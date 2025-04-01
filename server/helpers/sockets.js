const {Server}=require('socket.io');

let io;
const Users=new Map();


const createSocket=(server)=>{
    io=new Server(server,{cors:{origin:"*",methods:["GET","POST"]}})

    io.on('connection',(socket)=>{
        console.log("A User Connected : ",socket.id);

        socket.on("registerUser",(userId)=>{
            Users.set(userId,socket.id);
        })


        socket.on('disconnect',(userId)=>{
            console.log("User Disconnect : ",userId);
        })
    })
}

module.exports={createSocket};