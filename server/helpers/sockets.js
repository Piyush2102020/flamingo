const {Server}=require('socket.io');
const { addMessage } = require('../controller/Chat');
let io;
const userMap=new Map();


/**
 * Socket.IO Initialization Module
 * 
 * Handles:
 * - Initializing Socket.IO with CORS support
 * - Tracking connected users via `userMap`
 * - Binding message and disconnect handlers
 * - Providing access to active socket instance and specific user socket IDs
 * 
 * Exports:
 * - `initSocket(server)`: Initializes socket server with handlers
 * - `getIoStream()`: Returns current Socket.IO instance
 * - `getUserSocketId(userId)`: Returns the socket ID of a connected user
 */

exports.initSocket=(server)=>{
    io=new Server(server,{cors:{origin:"*"},methods:["GET","POST"]});
    io.on('connection',(socket)=>{
        const userId=socket.handshake.query.id;
        console.log("User Connected : ",userId,socket.id);
        
        userMap.set(userId,socket.id);
        socket.on('message',addMessage);
        
        socket.on('disconnect', () => {
            console.log("Client disconnected : ", socket.id);
            if (socket.userId) {
                userMap.delete(socket.userId);
            }
        });
    });
}


exports.getIoStream=()=>{
    return io||null;
}
exports.getUserSocketId=(userId)=>{
    return userMap.get(userId)
}