const {Server}=require('socket.io');
let io;


const userMap=new Map();

exports.initSocket=(server)=>{
    io=new Server(server,{cors:{origin:"*"},methods:["GET","POST"]});
    
    io.on('connection',(socket)=>{
        console.log("User Connected : ",socket.id);
        socket.on('register',(userId)=>{
            console.log("User Registered with : ",socket.id);
            userMap.set(userId,socket);
        })

        socket.on('disconnect',()=>{
            console.log("Client disconnected : ",socket.id);
            userMap.delete(socket.id);
        })
        
    });
}


exports.Notify=async(userId,type)=>{    
    const user=userMap.get(userId)
    console.log("User Id : ",userId,type);
    
    if(user){
        console.log("user: ",userId);
        
        user.emit('notification',{type:type});
    }else{
        console.log("User Offline with id : ",user);
           
    }
}