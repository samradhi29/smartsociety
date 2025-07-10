'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useRouter } from 'next/navigation';

interface Event {
  _id: string;
  name: string;
  description: string;
  dateofevent: string;
  location: string;
  startTime: string;
  endTime: string;
  iscompleted: boolean;
  attendees?: string[];
  images?: string[];
}

export default function EventTablePage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null);
  const reminderTriggered = useRef<{ [key: string]: boolean }>({});
  const userEmail = session?.user?.email;
  const isAdmin = session?.user?.role;
  const router = useRouter();

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/fetchevents/');
      const result = await res.json();
      const data: Event[] = result.data || result;
      setEvents(data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    }
  };

  const handleRSVP = async (id: string) => {
    if (!userEmail) return alert('Please log in to RSVP');
    try {
      const res = await fetch(`/api/rsvp/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: userEmail }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'RSVP failed');
      alert('RSVP successful 🎉');
      fetchEvents();
    } catch (err) {
      console.error('RSVP error:', err);
      alert('RSVP failed');
    }
  };

  const markAsCompleted = async (id: string) => {
    try {
      const res = await fetch(`/api/events/${id}/complete`, { method: 'PUT' });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to mark completed');
      alert('Event marked as completed!');
      fetchEvents();
    } catch (err) {
      console.error('Error completing event:', err);
      alert('Error completing event');
    }
  };

  const cancelEvent = async (id: string) => {
    try {
      const res = await fetch(`/api/events/${id}/cancel`, { method: 'DELETE' });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to cancel');
      alert('Event cancelled');
      fetchEvents();
    } catch (err) {
      console.error('Cancel error:', err);
      alert('Cancel failed');
    }
  };

  const handleUploadImages = async () => {
    if (!uploadFiles || !selectedEvent) return alert('Select files to upload');

    const formData = new FormData();
    Array.from(uploadFiles).forEach((file) => formData.append('images', file));

    try {
      const res = await fetch(`/api/events/${selectedEvent._id}/upload`, {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Upload failed');
      alert('Images uploaded!');
      fetchEvents();
      setUploadFiles(null);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed');
    }
  };

  const filteredEvents = events.filter((e) => {
    if (filter === 'completed') return e.iscompleted;
    if (filter === 'pending') return !e.iscompleted;
    return true;
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="overflow-x-auto bg-gradient-to-br from-black to-zinc-800 min-h-screen px-4 py-10 text-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl  text-center mb-8 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-sm tracking-wide">
          Event Overview
        </h2>

        <div className="mb-6 flex justify-center gap-4 flex-wrap">
          {['all', 'completed', 'pending'].map((type) => (
            <Button
              key={type}
              onClick={() => setFilter(type as any)}
              className={`capitalize px-4 py-2 text-sm rounded border border-gray-400 ${
                filter === type
                  ? 'bg-gradient-to-br   text-white font-semibold'
                  : 'bg-black text-gray-300'
              }`}
            >
              {type} Events
            </Button>
          ))}
        </div>

        {isAdmin === 'admin' && (
          <button
            onClick={() => router.push('/AddEvent')}
            className="bg-black border-2 border-gray-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded shadow-sm"
          >
            Add Event
          </button>
        )}

        <div className="overflow-auto rounded-xl border border-zinc-700 mt-6">
          <table className="min-w-full bg-gradient-to-br from-zinc-900 to-black text-white divide-y divide-zinc-700">
            <thead>
              <tr className="bg-gradient-to-tl from-black to-gray-900 text-sm font-stretch-semi-expanded tracking-wider divide-x divide-zinc-700">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-center">Date</th>
                <th className="py-3 px-4 text-center">Time</th>
                <th className="py-3 px-4 text-center">Location</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">RSVP</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gradient-to-br from-black to-zinc-900">
              {filteredEvents.map((event) => {
                const hasRSVPed = event.attendees?.includes(userEmail ?? '') ?? false;

                return (
                  <tr
                    key={event._id}
                    className="hover:bg-zinc-800 transition divide-x divide-zinc-700"
                  >
                    <td className="py-3 px-4">{event.name}</td>
                    <td className="py-3 px-4 text-center">{event.dateofevent}</td>
                    <td className="py-3 px-4 text-center">{event.startTime} - {event.endTime}</td>
                    <td className="py-3 px-4 text-center">{event.location}</td>
                    <td className="py-3 px-4 text-center">
                      {event.iscompleted ? (
                        <span className="text-white font-semibold">Completed</span>
                      ) : (
                        <span className="text-white font-semibold">Upcoming</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {hasRSVPed ? (
                        <span className="text-emerald-400 font-medium">Yes</span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center flex justify-center gap-2">
                      {!event.iscompleted && !hasRSVPed && (
                        <button
                          onClick={() => handleRSVP(event._id)}
                          className="bg-teal-600 hover:bg-teal-500 text-white text-sm px-3 py-1 rounded shadow-sm"
                        >
                          RSVP
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedEvent(event);
                          setUploadFiles(null);
                        }}
                        className="bg-black border-2 border-gray-800  rounded-3xl hover:bg-zinc-600 text-white text-sm px-3 py-1  shadow-sm"
                      >
                        View
                      </button>
                      {isAdmin === 'admin' && !event.iscompleted && (
                        <button
                          onClick={() => markAsCompleted(event._id)}
                          className="bg-black hover:bg-red-700 text-white text-sm px-3 py-1 rounded shadow-sm"
                        >
                          Mark Completed
                        </button>
                      )}
                      {isAdmin && (
                        <button
                          onClick={() => cancelEvent(event._id)}
                          className="bg-black hover:bg-red-700 text-white text-sm px-3 py-1 rounded shadow-sm"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-12 max-w-md mx-auto rounded-xl p-6 shadow-lg text-black">
          <h3 className="text-xl font-semibold mb-4 text-center">Upcoming Events Calendar</h3>
          <Calendar
            tileContent={({ date }) => {
              const ev = events.find(
                (e) => !e.iscompleted && new Date(e.dateofevent).toDateString() === date.toDateString()
              );
              return ev ? (
                <p className="text-xs text-teal-400 truncate" title={ev.name}>● {ev.name}</p>
              ) : null;
            }}
          />
        </div>

        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-zinc-900 text-white rounded-lg w-full max-w-2xl p-6 relative">
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-2 right-2 text-gray-300 hover:text-white text-xl font-bold"
              >✕</button>

              <h3 className="text-2xl font-bold mb-4">{selectedEvent.name}</h3>
              <p className="mb-2 text-gray-300">{selectedEvent.description}</p>
              <p className="text-sm text-gray-400 mb-2">Date: {selectedEvent.dateofevent}</p>
              <p className="text-sm text-gray-400 mb-2">Time: {selectedEvent.startTime} - {selectedEvent.endTime}</p>
              <p className="text-sm text-gray-400 mb-4">Location: {selectedEvent.location}</p>
              <p className="text-sm text-gray-400 mb-4">Status: {selectedEvent.iscompleted ? <span className="text-green-400 font-semibold">Completed</span> : <span className="text-yellow-400 font-semibold">Upcoming</span>}</p>

              {selectedEvent.iscompleted && selectedEvent.attendees?.includes(userEmail ?? '') && (
                <>
                  <h4 className="text-lg font-semibold mb-2">Uploaded Images:</h4>
                  {selectedEvent.images && selectedEvent.images.length > 0 ? (
                    <div className="flex flex-wrap gap-3 max-h-40 overflow-auto">
                      {selectedEvent.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`Event image ${i + 1}`}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-600"
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No images uploaded yet.</p>
                  )}

                  <div className="mt-4">
                    <label className="block mb-1 font-semibold" htmlFor="image-upload">Upload Images</label>
                    <input
                      id="image-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => setUploadFiles(e.target.files)}
                      className="block w-full text-sm text-gray-300 bg-zinc-800 border border-gray-600 rounded px-2 py-1"
                    />
                    <Button onClick={handleUploadImages} className="mt-2 bg-teal-600 hover:bg-teal-500">
                      Upload
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
