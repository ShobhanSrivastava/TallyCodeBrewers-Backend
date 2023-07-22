import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import socketInit from './socket.js';
import connectToMongo from './utils/mongoDB.js';

const app = express();
app.use(express.json());
const httpServer = http.createServer(app);

connectToMongo();

const io = new Server(httpServer);
socketInit(io);

httpServer.listen(8000, ()=>{
    console.log('Listening🚀 on PORT 8000');
});