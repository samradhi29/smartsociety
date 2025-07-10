import { useEffect, useState } from "react"


export default function page() {
 const  [societydetails , setsocietydetails] = useState<any>([]);
 const [flatsdata , setflatsdata] = useState<any>([]);
 const [members , setmembers] = useState<any>([]);
 const fetchsocietydetails = async () =>{
    try{
        const data = await fetch('/api/societydetails');
        setsocietydetails(data);
    }
catch(error){
console.log(error);
}
 const fetchflats = async () =>{
    try{
        const data = await fetch('/api/flatsdetails');
        setflatsdata(data);
    }
catch(error){
console.log(error);
}
const fetchmemebers = async (flat : any) => {
try{
const membersdata = fetch('/api/memebers/&{flat');
setmembers(membersdata); 
}
catch(err){

}
}
useEffect(()=>{
    fetchflats();
    fetchsocietydetails();
})
 }
    return (


    <div>
    <div className="societydetails">
<div>
    <h1>{societydetails.name}</h1>
    <h4>{societydetails.address}</h4>
</div>

    </div>

    <div>
        {flatsdata.map((flat)=>{
            <div key={flat.id}>
                <h2>{flat.flatnumber}</h2>
                <span>{flat.block}</span>
                <span>{flat.size}</span>
                <span>empty : {flat.isoccupied}</span>
        <button onClick={()=>fetchmembers(flat)}>memebers</button>
            </div>
        
        })}
    </div>
    </div>
  )
}
