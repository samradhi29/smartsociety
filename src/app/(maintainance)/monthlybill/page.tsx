'use client'
import { useEffect , useState } from "react"
interface Bill{
    _id : string;
    flatNo : string;
    amount : string;
    month :  string;
    year : number;
    status : "paid"| "unpaid";
    paidAt : string;
    paymentId? : string;
}



export default function page() {
    const [bill , setbill] = useState<Bill | null>(null);
    const [loading , setLoading] = useState(true);
    const fetchBill = async () =>{
        const res = await fetch("app/api/currentbill");
        const data = await res.json();
        setbill(data);
        setLoading(false);
    };
    useEffect(()=>{
        fetchBill();
    } , [])

    if(loading) return <p>laoding current month's bill...</p>;
  if (!bill) return <p>No bill generated for this month.</p>;

  return (
    <div>
      <h2>Maintennce Bill-{bill.month} {bill.year}</h2>
      <p> Amount : {bill.amount}</p>
      <p>Status : {bill.status}</p>
       {bill.status === "unpaid" ? (
        <button onClick={() => alert("Integrate Razorpay here")}>Pay Now</button>
      ) : (
        <p>Paid on {new Date(bill.paidAt!).toLocaleDateString()}</p>
      )}
    </div>
  )
}
