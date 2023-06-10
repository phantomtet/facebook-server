import express from "express";
import mongoose from "mongoose";
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import dotenv from 'dotenv'
import cors from 'cors'
import callback from "./websocket/index.js";
import LoginRouter from './routes/login.js'
import FeedRouter from './routes/feed.js'
import CommentRouter from './routes/comment.js'
import MeRouter from './routes/@me.js'
import PostRouter from './routes/post.js'
import SearchRouter from './routes/search.js'
import ContactRouter from './routes/contact.js'
import MessageRouter from './routes/message.js'
import MessageChannelRouter from './routes/messageChannel.js'
import UploadRouter from './routes/upload.js'
dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())
mongoose.connect(process.env.CONNECTION_URL)

const server = createServer(app)
export const websocket = new WebSocketServer({
    server
})
websocket.on('connection', callback)

app.use('/api/login', LoginRouter)
app.use('/api/feed', FeedRouter)
app.use('/api/comment', CommentRouter)
app.use('/api/@me', MeRouter)
app.use('/api/post', PostRouter)
app.use('/api/search', SearchRouter)
app.use('/api/contact', ContactRouter)
app.use('/api/message', MessageRouter)
app.use('/api/msgchannel', MessageChannelRouter)
app.use('/api/upload', UploadRouter)



server.listen(process.env.PORT || 8000)