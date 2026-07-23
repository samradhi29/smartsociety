'use client';

import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function MeetingChat({
  meetingId,
}: {
  meetingId: string;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');

  const username = session?.user?.username || 'Guest';
  const user = 'User-' + username;
  const urole = session?.user?.role;

  const socketServer = process.env.NEXT_PUBLIC_SOCKET_SERVER;

  // ---------------- SOCKET CONNECT ----------------
  useEffect(() => {
    if (!socketServer) {
      console.error(
        'NEXT_PUBLIC_SOCKET_SERVER is undefined'
      );
      return;
    }

    console.log('SOCKET URL:', socketServer);

    const socket = io(socketServer, {
      transports: ['polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socket.on('connect', () => {
      console.log('✅ CONNECTED:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ DISCONNECTED:', reason);
    });

    socket.on('connect_error', (err) => {
      console.log('🚨 CONNECT ERROR:', err);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [socketServer]);

  // ---------------- LOAD MESSAGES ----------------
  useEffect(() => {
    if (!socketServer || !meetingId) return;

    console.log(
      `Loading messages from ${socketServer}/messages/${meetingId}`
    );

    fetch(`${socketServer}/messages/${meetingId}`)
      .then(async (res) => {
        console.log('Messages API status:', res.status);

        const data = await res.json();

        console.log('Messages:', data);

        setMessages(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('Fetch messages error:', err);
        setMessages([]);
      });
  }, [meetingId, socketServer]);

  // ---------------- SOCKET LISTENERS ----------------
  useEffect(() => {
    const socket = socketRef.current;

    if (!socket) return;

    const handleMessage = (msg: any) => {
      console.log('Received message:', msg);

      if (msg?.meetingId === meetingId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on('receive-message', handleMessage);

    return () => {
      socket.off('receive-message', handleMessage);
    };
  }, [meetingId]);

  // ---------------- AUTO SCROLL ----------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages]);

  // ---------------- SEND MESSAGE ----------------
  const sendMessage = () => {
    if (!input.trim()) return;

    if (!socketRef.current) {
      console.error('Socket not connected');
      return;
    }

    const payload = {
      meetingId,
      sender: user,
      content: input.trim(),
    };

    console.log('Sending:', payload);

    socketRef.current.emit('send-message', payload);

    setInput('');
  };

  // ---------------- END MEETING ----------------
  const endMeeting = async () => {
    if (!confirm('End this meeting?')) return;

    try {
      const res = await fetch(
        `${socketServer}/api/end-meeting`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            meetingId,
          }),
        }
      );

      const data = await res.json();

      console.log('END MEETING RESPONSE:', data);

      if (data?.success) {
        router.push('/Showallmeetings');
      }
    } catch (err) {
      console.error('End meeting error:', err);
    }
  };

  if (status === 'loading') {
    return (
      <div className="text-white p-4">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">
      <div className="flex justify-between items-center px-4 py-3 bg-gray-900 border-b border-gray-800">
        <h1 className="text-lg font-semibold">
          Meeting Chat
        </h1>

        {urole === 'admin' && (
          <button
            onClick={endMeeting}
            className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
          >
            End
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, i) => {
          const isMine = msg?.sender === user;

          return (
            <div
              key={i}
              className={`flex ${
                isMine
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                  isMine
                    ? 'bg-blue-600'
                    : 'bg-gray-800'
                }`}
              >
                <div className="text-xs opacity-70">
                  {msg?.sender}
                </div>

                <div>{msg?.content}</div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2 p-3 bg-gray-900 border-t border-gray-800">
        <input
          value={input}
          onChange={(e) =>
            setInput(e.target.value)
          }
          onKeyDown={(e) =>
            e.key === 'Enter' && sendMessage()
          }
          placeholder="Type message..."
          className="flex-1 bg-gray-800 px-4 py-2 rounded-full outline-none"
        />

        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 rounded-full hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}