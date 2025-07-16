"use client"
import { ChartArea } from 'lucide-react';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function page() {
    const {id} = useParams();
    const [meetingdetails , setmeetingdetails] = useState<any>([])
    
    const fetchdata = async() =>{
        const data = await fetch('/api/meetingdetails/${id}');
        setmeetingdetails(data);
    }

    useEffect(()=>{
fetchdata();
    } ,[]);

  return (



    <div>

    {/* metting deetails */}
<div>
   
        
        <div key={meetingdetails.id}>
            <h1>{meetingdetails.purpose}</h1>
            <p>stated At: {meetingdetails.startTime}</p>
        </div>
    
</div>

{meetingdetails.usersdata?.map((user) => (
  <div key={user._id}>
    <h3>{user.name}</h3>
    <p>joined at: {user.joinedAt}</p>
  </div>
))}

<ChartArea/>
<br />
<button>end</button>
    </div>
  )
}
