'use client';

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useSession } from 'next-auth/react';

export default function EventPage() {
  const { data: session } = useSession();

  const [formdata, setFormdata] = useState({
    name: '',
    description: '',
    dateofevent: '',
    startTime: '',
    endTime: '',
    location: '',
    societyname: session?.user?.society || '',
  });

  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Calendar's onChange value can be Date | Date[] | null
  const handleCalendarChange = (
    value: Date | Date[] | null,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (!value) return; // handle null case

    if (value instanceof Date) {
      setCalendarDate(value);
      setFormdata((prev) => ({
        ...prev,
        dateofevent: value.toISOString().split('T')[0],
      }));
    }
  };

  const handlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = Object.values(formdata).every(
    (val) => val.trim() !== ''
  );

  const submitform = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/addevent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formdata),
      });
      if (!res.ok) throw new Error('Failed to submit');
      setMessage('Event added successfully!');
      setFormdata({
        name: '',
        description: '',
        dateofevent: '',
        startTime: '',
        endTime: '',
        location: '',
       societyname: session?.user?.society || '',
      });
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-slate-900 flex flex-col md:flex-row items-start justify-center gap-10 p-8">
      <style>{`
        /* react-calendar black theme overrides */
        .react-calendar {
          background-color: #000000;
          border: 1px solid #22d3ee; /* cyan border */
          border-radius: 12px;
          color: white;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          box-shadow: 0 0 10px #06b6d4a3; /* cyan shadow */
          width: 350px;
          max-width: 100%;
          user-select: none;
        }

        .react-calendar__navigation button {
          color: #22d3ee;
          min-width: 44px;
          background: none;
          font-size: 16px;
          margin-top: 8px;
        }

        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus {
          background-color: #0891b2;
          border-radius: 6px;
          color: white;
        }

        .react-calendar__month-view__weekdays {
          text-align: center;
          text-transform: uppercase;
          font-weight: bold;
          font-size: 0.75rem;
          color: #38bdf8;
          padding-bottom: 8px;
        }

        .react-calendar__tile {
          background: transparent;
          color: white;
          border-radius: 8px;
          height: 40px;
          line-height: 40px;
          padding: 0 6px;
          transition: background-color 0.3s ease;
        }

        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background: #0891b2;
          color: white;
          border-radius: 8px;
        }

        .react-calendar__tile--now {
          background: #0e7490;
          color: white;
          border-radius: 8px;
        }

        .react-calendar__tile--active {
          background: #06b6d4;
          color: black;
          border-radius: 8px;
        }

        /* Disable outline for better look */
        .react-calendar__tile:focus {
          outline: none;
          box-shadow: 0 0 5px 2px #06b6d4;
        }
      `}</style>

      <div className="bg-black p-6 rounded-xl shadow-cyan-500 border border-slate-700">
        <h2 className="font-bold mb-4 text-center bg-gradient-to-r from-cyan-400 to-yellow-400 bg-clip-text text-transparent">
          Select Event Date
        </h2>
        <Calendar
          value={calendarDate}
          onChange={handleCalendarChange}
          className="react-calendar"
        />
      </div>

      <div className="w-full max-w-md bg-black p-6 rounded-xl border border-slate-700 text-white shadow-md shadow-cyan-700">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 to-yellow-400 bg-clip-text text-transparent">
          Add New Event
        </h2>
        <input
          className="w-full mb-3 p-3 rounded-3xl shadow-md shadow-cyan-900 bg-black border border-slate-600 placeholder-gray-400 text-white"
          name="name"
          placeholder="Event Name"
          value={formdata.name}
          onChange={handlechange}
        />
        <input
          className="w-full mb-3 p-3 rounded-2xl bg-black border border-slate-600 placeholder-gray-400 text-white shadow-md shadow-cyan-900"
          name="description"
          placeholder="Description"
          value={formdata.description}
          onChange={handlechange}
        />
        <input
          className="w-full mb-3 p-3 rounded-2xl bg-black border border-slate-600 placeholder-gray-400 text-white shadow-md shadow-cyan-900"
          name="startTime"
          placeholder="Start Time"
          value={formdata.startTime}
          onChange={handlechange}
        />
        <input
          className="w-full mb-3 p-3 rounded-2xl bg-black border border-slate-600 placeholder-gray-400 text-white shadow-md shadow-cyan-900"
          name="endTime"
          placeholder="End Time"
          value={formdata.endTime}
          onChange={handlechange}
        />
        <input
          className="w-full mb-6 p-3 rounded-2xl bg-black border border-slate-600 placeholder-gray-400 text-white shadow-md shadow-cyan-900"
          name="location"
          placeholder="Location"
          value={formdata.location}
          onChange={handlechange}
        />
        <button
          onClick={submitform}
          disabled={!isFormValid || loading}
          className="w-full py-3 bg-gradient-to-r font-semibold border-2 border-b-cyan-500 rounded-2xl"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
        {message && (
          <p className="mt-4 text-center text-yellow-400">{message}</p>
        )}
      </div>
    </div>
  );
}
