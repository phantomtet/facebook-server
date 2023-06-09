import { WebSocketServer } from "ws"
import { websocket } from "../index.js"
import mongoose from "mongoose"

// new WebSocketServer().on('connection', (socket, req) => {
//     req.
// })
export var clients = {}

const callback = (socket, request) => {
    let userId = new mongoose.Types.ObjectId(new URLSearchParams(request.url.split('?')[1]).get('userId'))
    // let userId =
    clients[userId] = socket

    socket.addEventListener('close', () => {
        delete clients[userId]
    })
    socket.addEventListener('message', (e) => {
        console.log(e.data)
    })

}
export default callback

