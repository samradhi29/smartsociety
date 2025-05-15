"user client"
import { div, li, p } from "framer-motion/client";
import React , {useEffect , useState} from "react";
type Member ={
   name: string;
     email: string;
      
     phone: string;
     gender: string;
     age: number;
     username : string;
    
     password : string;
};
type flat ={
      flatnumber : string;
       block : string;
       floor: number ;
       type : string;
       size : Number;
       isoccupied : boolean;
       Members : Member[];
}
export default function flatview(){
const [flats , setflats] = useState<flat[]>([])
const [selectedflat , setselectedflat] = useState<flat | null>(null);
useEffect(()=>{
    const fetchflats = async()=>{
        try{
const res = await fetch("/api/flatsdata");
if(!res.ok){
    throw new Error("failed to fetch");
    const data : flat[] = await res.json();
    setflats(data);
}
        }
        catch(error){
throw new Error("something is wrong!!");
        }
    }
    fetchflats();
}
 , []);

 return (
    <div>

<h1>flats in your society</h1>
<div>
{flats.map((flat) => (
    

<div  onClick={()=>setselectedflat(flat)}>

    <h2>flat {flat.flatnumber}</h2>
    <p>{flat.block}</p>
    <p>{flat.floor}</p>
<p>{flat.size}</p>
<p>if(flat.isoccupied){
<P>empty!!</P>
    }</p>
</div>
))}

</div>

 {selectedflat &&(
        <div>
<ul>
{selectedflat.Members.map((member , id)=>(
    <li>
        <p>{member.name} </p>
        <p>{member.gender}</p>
        <p> {member.age}</p>
        <p>{member.email}</p>
        <p>{member.phone}</p>
    </li>
))}</ul>

        </div>
  )}
    </div>

   
  
 )
}