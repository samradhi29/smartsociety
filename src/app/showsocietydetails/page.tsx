import { useEffect, useState } from "react";

export default function Page() {
  const [societydetails, setsocietydetails] = useState<any>(null);
  const [flatsdata, setflatsdata] = useState<any[]>([]);
  const [members, setmembers] = useState<any[]>([]);

  // Fetch society details
  const fetchsocietydetails = async () => {
    try {
      const res = await fetch('/api/societydetails');
      const data = await res.json();
      setsocietydetails(data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch flats details
  const fetchflats = async () => {
    try {
      const res = await fetch('/api/flatsdetails');
      const data = await res.json();
      setflatsdata(data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch members for a flat
  const fetchmembers = async (flat: any) => {
    try {
      const res = await fetch(`/api/members/${flat}`);  // fixed template literal
      const membersdata = await res.json();
      setmembers(membersdata);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchflats();
    fetchsocietydetails();
  }, []);

  if (!societydetails) return <div>Loading society details...</div>;

  return (
    <div>
      <div className="societydetails">
        <div>
          <h1>{societydetails.name}</h1>
          <h4>{societydetails.address}</h4>
        </div>
      </div>

      <div>
        {flatsdata.map((flat: any) => (
          <div key={flat.id}>
            <h2>{flat.flatnumber}</h2>
            <span>{flat.block}</span>
            <span>{flat.size}</span>
            <span>empty: {!flat.isoccupied ? "Yes" : "No"}</span>
            <button onClick={() => fetchmembers(flat.id)}>Members</button>
          </div>
        ))}
      </div>

      <div>
        <h3>Members:</h3>
        {members.length === 0 && <p>No members selected</p>}
        {members.map((member: any) => (
          <div key={member.id}>
            <p>{member.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
