const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const Message = require('./models/message');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // your Next.js frontend
    methods: ['GET', 'POST'],
  },
});

console.log("✅ Connecting to:", process.env.MONGO_URL);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

io.on('connection', (socket) => {
  console.log('🔌 User connected');

  socket.on('send-message', async (msg) => {
    const saved = await new Message(msg).save();
    io.emit('receive-message', saved);
  });

  socket.on('react-message', async ({ messageId, emoji }) => {
    const msg = await Message.findById(messageId);
    if (msg) {
      const count = msg.reactions.get(emoji) || 0;
      msg.reactions.set(emoji, count + 1);
      await msg.save();
      io.emit('reaction-updated', msg);
    }
  });

  socket.on('mark-important', async (id) => {
    const msg = await Message.findByIdAndUpdate(id, { important: true }, { new: true });
    io.emit('important-marked', msg);
  });
});

server.listen(3001, () => console.log('✅ Socket.IO server running on http://localhost:3001'));
