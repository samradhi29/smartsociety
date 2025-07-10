import { Server } from 'socket.io';
import { NextApiRequest } from 'next';
import { dbconnect } from '@/app/lib/dbconnect';
import Message from '@/model/message'; // model name should be PascalCase

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: any) {
  if (!res.socket.server.io) {
    console.log('Setting up socket.io...');

    const io = new Server(res.socket.server, {
      path: '/api/socket_io',
    });

    io.on('connection', (socket) => {
      // 📨 When user sends a message
      socket.on('send-message', async (msg: any) => {
        await dbconnect();
        const savedMsg = await new Message(msg).save();
        io.emit('receive-message', savedMsg);
      });

      // 😄 When user reacts to a message
      socket.on('react-message', async ({ messageId, emoji }) => {
        await dbconnect();
        const msg = await Message.findById(messageId);
        if (msg) {
          const count = msg.reactions.get(emoji) || 0;
          msg.reactions.set(emoji, count + 1);
          await msg.save();
          io.emit('reaction-updated', msg);
        }
      });

      // ❗ When user marks a message as important
      socket.on('mark-important', async (id) => {
        await dbconnect();
        const msg = await Message.findByIdAndUpdate(
          id,
          { important: true },
          { new: true }
        );
        io.emit('important-marked', msg);
      });
    });

    res.socket.server.io = io; // attach to res.socket.server to persist across hot reloads
  }

  res.end();
}
