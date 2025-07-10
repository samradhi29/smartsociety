'use client';

import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Sparkles, Star } from 'lucide-react';

const socket = io('http://localhost:3001'); // Make sure this server is running

export default function MeetingChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const user = 'User-' + Math.floor(Math.random() * 1000);

  const sendMessage = () => {
    const msg = { sender: user, content: input };
    socket.emit('send-message', msg);
    setInput('');
  };

  const markImportant = (id: string) => socket.emit('mark-important', id);
  const react = (id: string, emoji: string) =>
    socket.emit('react-message', { messageId: id, emoji });

  useEffect(() => {
    socket.on('receive-message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('reaction-updated', (updated) => {
      setMessages((msgs) =>
        msgs.map((m) => (m._id === updated._id ? updated : m))
      );
    });

    socket.on('important-marked', (updated) => {
      setMessages((msgs) =>
        msgs.map((m) => (m._id === updated._id ? updated : m))
      );
    });

    return () => {
      socket.off('receive-message');
      socket.off('reaction-updated');
      socket.off('important-marked');
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-neutral-900 text-white px-4 py-10">
      <div className="max-w-3xl mx-auto">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent mb-6">
          <Sparkles className="inline-block mr-2 mb-1" /> Live Meeting Chat
        </h2>

        {/* Chat Box */}
        <div className="h-[28rem] overflow-y-auto bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-4 space-y-4 shadow-xl">
          {messages.length === 0 && (
            <p className="text-center text-gray-400 italic">
              No messages yet. Start the conversation!
            </p>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-zinc-800 to-neutral-900 text-white rounded-xl p-4 border border-white/10 shadow hover:shadow-lg transition duration-200"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-blue-400">
                  {msg.sender || 'Anonymous'}:
                </span>
                {msg.important && (
                  <span className="text-red-500 text-xs font-bold bg-white/10 px-2 py-0.5 rounded flex items-center">
                    <Star className="w-4 h-4 mr-1" /> Important
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-100 mb-2">
                {msg.content || '[No content]'}
              </p>

              <div className="flex flex-wrap gap-2 text-sm">
                {['👍', '❤️', '😂'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => react(msg._id, emoji)}
                    className="bg-zinc-700 hover:bg-zinc-600 text-white px-2 py-1 rounded-lg shadow-sm transition-transform hover:scale-105"
                  >
                    {emoji} {msg.reactions?.[emoji] || 0}
                  </button>
                ))}
                <button
                  onClick={() => markImportant(msg._id)}
                  className="text-xs text-cyan-400 underline hover:text-cyan-300 ml-2"
                >
                  Mark Important
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex mt-6 gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 rounded-xl bg-zinc-800 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-3 rounded-xl font-semibold shadow-md transition-all"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
