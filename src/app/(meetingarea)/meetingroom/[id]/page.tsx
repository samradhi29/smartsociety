"use client"
import { ChartArea } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Page() {
  const { id } = useParams();
  const [meetingdetails, setMeetingDetails] = useState<any>(null);

  const fetchData = async () => {
    // Use backticks for template literal
    const res = await fetch(`/api/meetingdetails/${id}`);
    const data = await res.json(); // Parse JSON response
    setMeetingDetails(data);
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  if (!meetingdetails) return <div>Loading...</div>;

  return (
    <div>
      {/* meeting details */}
      <div>
        <div key={meetingdetails.id}>
          <h1>{meetingdetails.purpose}</h1>
          <p>Started At: {meetingdetails.startTime}</p>
        </div>
      </div>

      {meetingdetails.usersdata?.map((user: any) => (
        <div key={user._id}>
          <h3>{user.name}</h3>
          <p>Joined at: {user.joinedAt}</p>
        </div>
      ))}

      <ChartArea />
      <br />
      <button>end</button>
    </div>
  );
}
