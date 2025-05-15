import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { AuthOptions } from "next-auth";
import { dbconnect } from "@/app/lib/dbconnect";
import { flatsModel } from "@/model/flats";
import authOptions from "../auth/[...nextauth]/options";
export async function GET(req : NextRequest) {
    const session = await getServerSession(authOptions);
    if(!session){
        return new Response(JSON.stringify({message : 'unauthorized'}) , {status : 401});
    }
        try{
            await dbconnect();
            const usersociety = session.user.society;
            const flats = await flatsModel.findOne({society : usersociety});
            return new Response(JSON.stringify(flats) , {status : 200});
            
        }
        catch(error){

        }
    }
    
