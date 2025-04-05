const {Server}=require('socket.io');
const { addMessage } = require('../controller/Chat');
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


        socket.on('message',async(data)=>{
            console.log("Data Received : ",data);
            addMessage(data);            
        })

        socket.on('disconnect', () => {
            console.log("Client disconnected : ", socket.id);
            if (socket.userId) {
                userMap.delete(socket.userId);  // ✅ this will work
            }
        });
        
        
    });
}




exports.newMessageNotify=async(newMessage,senderId,receiverId,chatboxId)=>{
    const sender=userMap.get(senderId);
    const receiver=userMap.get(receiverId);
  
    
    console.log(chatboxId,senderId,receiverId);
    
    if(sender){
         
        sender.emit('newMessage',{message:newMessage,id:chatboxId});
          
    }
    if(receiver){
  
        receiver.emit('newMessage',{message:newMessage,id:chatboxId});
    }
}

exports.Notify=async(userId,type)=>{    
    const user=userMap.get(userId)
    console.log("User Id : ",userId,type);
    
    if(user){
  
        
        user.emit('notification',{type:type});
    }else{
        console.log("User Offline with id : ",user);
           
    }
}