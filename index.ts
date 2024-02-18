import express, { Express } from 'express';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import * as dotenv from 'dotenv';
import cors from 'cors';
import callback from './websocket/index';
import LoginRouter from './routes/login';
import FeedRouter from './routes/feed';
import CommentRouter from './routes/comment';
import MeRouter from './routes/@me';
import PostRouter from './routes/post';
import SearchRouter from './routes/search';
import ContactRouter from './routes/contact';
import MessageRouter from './routes/message';
import MessageChannelRouter from './routes/messageChannel';
import UploadRouter from './routes/upload';
import ProfileRouter from './routes/profile';
import testRouter from './routes/test';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      JWT: string;
      file?: any;
      files?: any[];
    }
  }
}

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
if (process.env.CONNECTION_URL) {
  mongoose.connect(process.env.CONNECTION_URL);
}
const server = createServer(app);
export const websocket = new WebSocketServer({
  server,
});
websocket.on('connection', callback);

app.use('/api/login', LoginRouter);
app.use('/api/feed', FeedRouter);
app.use('/api/comment', CommentRouter);
app.use('/api/@me', MeRouter);
app.use('/api/post', PostRouter);
app.use('/api/search', SearchRouter);
app.use('/api/contact', ContactRouter);
app.use('/api/message', MessageRouter);
app.use('/api/msgchannel', MessageChannelRouter);
app.use('/api/upload', UploadRouter);
app.use('/api/profile', ProfileRouter);
app.use('/test', testRouter);

server.listen(process.env.PORT || 8000);
