const {Server}=require('socket.io');
let io;


const user=[];

exports.initSocket=(server)=>{
    io=new Server(server,{cors:{origin:"*"},methods:["GET","POST"]});
    

    io.on('connection',(socket)=>{
        console.log("User Connected : ",socket.id);
        user.push(socket);

        socket.on('register',(userId)=>{
            console.log("User Registered with : ",socket.id);
            user.push(socket);
        })

        socket.on('disconnect',()=>{
            console.log("Client disconnected : ",socket.id);
            
        })
        
    });

}




exports.sendAlert=()=>{
  if(user){
    user.forEach((value)=>{
        console.log("Sending message to : ",value);
        
        value.emit('message',{message:"here is the message"})
    })
  }
}