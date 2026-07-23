'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

interface MeetingReport {
  _id: string;
  meetingId: string;
  report: string;
  createdAt: string;
}

export default function MeetingReportPage() {
  const { id } = useParams(); // get meetingId from route
  const [reports, setReports] = useState<MeetingReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SOCKET_SERVER}/api/meeting-reports/${id}`);
        if (!res.ok) throw new Error('Failed to fetch reports');
        const data = await res.json();
        setReports(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent mb-4"></div>
        <p className="text-gray-300 text-lg font-medium">Loading reports...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="bg-gradient-to-br from-red-950 to-gray-900 p-8 rounded-2xl border border-red-900/50 shadow-2xl">
        <p className="text-red-300 text-lg font-medium">⚠️ Error: {error}</p>
      </div>
    </div>
  );
  
  if (!reports.length) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700/50 shadow-2xl">
        <p className="text-gray-300 text-lg font-medium">📋 No reports found for this meeting</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Meeting Reports
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>

        {/* Reports */}
        <div className="space-y-6">
          {reports.map((r, index) => (
            <div 
              key={r._id} 
              className="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700/50 shadow-2xl hover:shadow-blue-900/20 transition-all duration-300 hover:border-gray-600/50"
              style={{
                animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
              }}
            >
              {/* Decorative gradient corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-bl-full blur-2xl"></div>
              
              {/* Timestamp */}
              <div className="relative flex items-center gap-3 mb-6 pb-6 border-b border-gray-700/50">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">📅</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Created</p>
                  <p className="text-sm text-gray-300 font-medium">
                    {new Date(r.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              
              {/* Report Content */}
              <div className="relative prose prose-invert prose-slate max-w-none markdown-content">
                <ReactMarkdown>{r.report}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        :global(.markdown-content h1) { color: #f0f0f0; font-weight: 700; }
        :global(.markdown-content h2) { color: #e5e5e5; font-weight: 600; }
        :global(.markdown-content h3) { color: #d5d5d5; font-weight: 600; }
        :global(.markdown-content p) { color: #c0c0c0; line-height: 1.8; }
        :global(.markdown-content strong) { color: #ffffff; font-weight: 600; }
        :global(.markdown-content ul), :global(.markdown-content ol) { color: #c0c0c0; }
        :global(.markdown-content li) { margin: 0.5rem 0; }
        :global(.markdown-content code) { 
          background: rgba(59, 130, 246, 0.1); 
          color: #93c5fd; 
          padding: 0.2rem 0.4rem; 
          border-radius: 0.25rem;
          font-size: 0.875em;
        }
        :global(.markdown-content pre) { 
          background: rgba(17, 24, 39, 0.8); 
          border: 1px solid rgba(75, 85, 99, 0.5);
        }
        :global(.markdown-content a) { 
          color: #60a5fa; 
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s;
        }
        :global(.markdown-content a:hover) { 
          border-bottom-color: #60a5fa;
        }
      `}</style>
    </div>
  );
}