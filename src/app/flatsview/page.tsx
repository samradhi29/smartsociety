"use client";
import React, { useEffect, useState } from "react";

type Member = {
  name: string;
  email: string;
  phone: string;
  gender: string;
  age: number;
  username: string;
  password: string;
};

type Flat = {
  flatnumber: string;
  block: string;
  floor: number;
  type: string;
  size: number;
  isoccupied: boolean;
  Members: Member[];
};

export default function FlatView() {
  const [flats, setFlats] = useState<Flat[]>([]);
  const [selectedFlat, setSelectedFlat] = useState<Flat | null>(null);

  useEffect(() => {
    const fetchFlats = async () => {
      try {
        const res = await fetch("/api/flatview");
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        const data: Flat[] = await res.json();
        setFlats(data);
      } catch (error) {
        console.error("Something went wrong!!", error);
      }
    };
    fetchFlats();
  }, []);

  return (
    <div>
      <h1>Flats in your society</h1>
      <div>
        {flats.map((flat, index) => (
          <div
            key={index}
            onClick={() => setSelectedFlat(flat)}
            style={{
              border: "1px solid gray",
              padding: "10px",
              margin: "10px",
              cursor: "pointer",
            }}
          >
            <h2>Flat {flat.flatnumber}</h2>
            <p>Block: {flat.block}</p>
            <p>Floor: {flat.floor}</p>
            <p>Size: {flat.size} sqft</p>
            <p>{flat.isoccupied ? "Occupied" : "Empty"}</p>
          </div>
        ))}
      </div>

      {selectedFlat && (
        <div style={{ marginTop: "20px" }}>
          <h2>Members in Flat {selectedFlat.flatnumber}</h2>
          <ul>
            {selectedFlat.Members.map((member, id) => (
              <li key={id} style={{ marginBottom: "10px" }}>
                <p>Name: {member.name}</p>
                <p>Gender: {member.gender}</p>
                <p>Age: {member.age}</p>
                <p>Email: {member.email}</p>
                <p>Phone: {member.phone}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
