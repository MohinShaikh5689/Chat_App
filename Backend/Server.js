import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

import authRouter from './routes/authRoutes.js';
import chatRouter from './routes/chatRoutes.js';
import connectToMongoDB from './DB/connectToMongoDB.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

app.use('/api/user', authRouter);
app.use('/api/chat', chatRouter);

// Initialize Socket.IO
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true,
    },
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle sending messages
    socket.on('sendMessage', (messageData) => {
        io.emit('receiveMessage', messageData); // Broadcast to all clients
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

httpServer.listen(process.env.PORT, () => {
    connectToMongoDB();
    console.log(`Server running on port ${process.env.PORT}`);
});
