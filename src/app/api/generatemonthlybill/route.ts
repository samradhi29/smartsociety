import { NextRequest , NextResponse } from "next/server";
import { dbconnect } from "@/app/lib/dbconnect";
import { BillModel } from "@/model/maintainancebill";
import { flatsModel } from "@/model/flats";
export async function POST(req : NextRequest) {
    await dbconnect();
    const {month , year} = await req.json();
const flats = await flatsModel.find();
const bills = flats.map(flat=>({
    flatnumber : flat.flatnumber,
    month , 
    year ,
    charges : [
        {name : 'Maintenance' , amount : 2000},
        {name : 'Water' , amount : 200},
    ],
    totalAmount : 2200,
}))

}