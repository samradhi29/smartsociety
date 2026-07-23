'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Clock, User, Home, FileText, LogIn, LogOut } from 'lucide-react';

interface Visitor {
  _id: string;
  name: string;
  flat: string;
  purpose: string;
  gender: string;
  info?: string;
}

export default function VisitorHistoryPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    async function fetchVisitors() {
      if (!session?.user?.society) return;

      try {
        const res = await fetch(`/api/visitorhistory?societyname=${session.user.society}`);
        if (!res.ok) throw new Error('Failed to fetch');

        const data = await res.json();
        setVisitors(data.visitors || []);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchVisitors();
  }, [session]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent mb-4"></div>
          <p className="text-gray-300 text-lg">Loading visitor history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-6 max-w-md">
          <p className="text-red-400 text-center">⚠️ Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Visitor History
            </h1>
          </div>
          <p className="text-gray-400 ml-11">Track all visitor entries and exits</p>
        </div>

        {/* Content */}
        {visitors.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-700/50 rounded-full mb-4">
              <User className="w-10 h-10 text-gray-500" />
            </div>
            <p className="text-gray-400 text-lg">No visitor entries found.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {visitors.map((vis) => (
              <div
                key={vis._id}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-gray-600 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Name */}
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <User className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Name</p>
                      <p className="text-white font-semibold">{vis.name}</p>
                    </div>
                  </div>

                  {/* Flat */}
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <Home className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Flat</p>
                      <p className="text-white font-semibold">{vis.flat}</p>
                    </div>
                  </div>

                  {/* Purpose */}
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <FileText className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Purpose</p>
                      <p className="text-white font-semibold">{vis.purpose}</p>
                    </div>
                  </div>

                
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <LogIn className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Gender</p>
                      <p className="text-white font-semibold">
                        {vis.gender ? vis.gender : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Out Time */}
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <LogOut className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Addition Info</p>
                      <p className="text-white font-semibold">
                        {vis.info ? vis.info : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
