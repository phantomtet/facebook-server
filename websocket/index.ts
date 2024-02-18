import mongoose from 'mongoose';

// new WebSocketServer().on('connection', (socket, req) => {
//     req.
// })
export var clients = {};

const callback = (socket, request) => {
  let userId = new mongoose.Types.ObjectId(
    new URLSearchParams(request.url.split('?')[1]).get('userId') as string,
  );
  // let userId =
  clients[userId.toString()] = socket;

  socket.addEventListener('close', () => {
    delete clients[userId.toString()];
  });
  socket.addEventListener('message', (e) => {
    console.log(e.data);
  });
};
export default callback;
