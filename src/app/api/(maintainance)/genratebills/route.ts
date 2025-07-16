import { dbconnect } from "@/app/lib/dbconnect";
import { flatsModel } from "@/model/flats";
import { BillModel } from "@/model/maintainancebill";

export async function generateBills() {
  await dbconnect();

  const flatsdata = await flatsModel.find();  // await is needed here

  const today = new Date();
  const month = today.toLocaleString("default", { month: "long" }); // e.g. "June"
  const year = today.getFullYear();

  for (const flat of flatsdata) {
    const exists = await BillModel.findOne({
      flatNo: flat.flatNo,
      month,
      year,
    });

    if (!exists) {
      await BillModel.create({
        flatNo: flat.flatNo,
        userEmail: flat.userEmail,   // from flat data
        amount: 1500,                // or any logic to calculate amount
        month,
        year,
        status: "unpaid",
      });
    }
  }
}
