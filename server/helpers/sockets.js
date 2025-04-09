const {Server}=require('socket.io');
const { addMessage } = require('../controller/Chat');
let io;


const userMap=new Map();

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