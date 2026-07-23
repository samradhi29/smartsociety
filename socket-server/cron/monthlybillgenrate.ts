//import { dbconnect } from "../src/app/lib/dbconnect";
import { MonthlyChargesModel } from "../models/monthlycharges";
import { societyFlatModel } from "../models/societyflats";
import { BillModel } from "../models/maintainancebill";
import cron from "node-cron";

export const setupMonthlyBill = async () => {
  

  // Generate monthly bills on the 1st day of every month at 00:00
  cron.schedule("0 0 1 * *", async () => {
    try {
      console.log("Generating monthly bills...");

      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      const chargesThisMonth = await MonthlyChargesModel.find({
        month: currentMonth,
        year: currentYear,
      });

      for (const charge of chargesThisMonth) {
        const flats = await societyFlatModel.find({
          society: charge.society,
        });

        for (const flat of flats) {
          const existingBill = await BillModel.findOne({
            flat: flat._id,
            month: currentMonth,
            year: currentYear,
          });

          if (existingBill) continue;

          const totalAmount = charge.charges.reduce(
            (sum: any , c:any) => sum + c.amount,
            0
          );

          await BillModel.create({
            flat: flat._id,
            society: charge.society,
            month: currentMonth,
            year: currentYear,
            charges: charge.charges,
            totalAmount,
            dueAmount: totalAmount,
            status: "Unpaid",
            dueDate: new Date(currentYear, currentMonth - 1, 10),
          });
        }
      }

      console.log("Monthly bills generated successfully.");
    } catch (err) {
      console.error("Error generating bills:", err);
    }
  });

  // Add ₹250 late fee daily at 00:30 AM
  cron.schedule("30 0 * * *", async () => {
    try {
      console.log("Checking for overdue bills...");

      const today = new Date();

      const overdueBills = await BillModel.find({
        dueDate: { $lt: today },
        status: { $in: ["Unpaid", "Partial"] },
      });

      for (const bill of overdueBills) {
        const hasLateFee = bill.charges.some(
          (c:any) => c.name === "Late Fee"
        );

        if (hasLateFee) continue;

        bill.charges.push({ name: "Late Fee", amount: 250 });
        bill.totalAmount += 250;
        bill.dueAmount += 250;

        await bill.save();

        console.log(`Late fee added for Flat ${bill.flat}`);
      }

      console.log("Late fee processing complete.");
    } catch (err) {
      console.error("Error adding late fees:", err);
    }
  });

  console.log("Cron jobs initialized.");
};