// import { dbconnect } from "@/app/lib/dbconnect";
// import { flatsModel } from "@/model/flats";
// import { BillModel } from "@/model/maintainancebill";

// export async function POST(req: Request) {
//   try {
//     await dbconnect();

//     const flatsdata = await flatsModel.find();
//     const today = new Date();
//     const month = today.toLocaleString("default", { month: "long" });
//     const year = today.getFullYear();

//     const billsToCreate = [];

//     for (const flat of flatsdata) {
//       const exists = await BillModel.exists({
//         flatNo: flat.flatNo,
//         month,
//         year,
//       });

//       if (!exists && flat.userEmail) {
//         billsToCreate.push({
//           flatNo: flat.flatNo,
//           userEmail: flat.userEmail,
//           amount: 1500,
//           month,
//           year,
//           status: "unpaid",
//         });
//       }
//     }

//     if (billsToCreate.length > 0) {
//       await BillModel.insertMany(billsToCreate);
//     }

//     return new Response(JSON.stringify({ message: "Bills generated successfully" }), {
//       status: 200,
//     });
//   } catch (error) {
//     console.error("Error generating bills:", error);
//     return new Response(JSON.stringify({ error: "Failed to generate bills" }), {
//       status: 500,
//     });
//   }
// }
