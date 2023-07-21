import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import socketInit from './socket.js';

const app = express();
app.use(express.json());
const httpServer = http.createServer(app);

const io = new Server(httpServer);
socketInit(io);

httpServer.listen(3000, ()=>{
    console.log('Listening🚀 on PORT 3000');
});