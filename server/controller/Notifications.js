const mongoose=require('mongoose');
const {getIoStream,getUserSocketId}=require('../helpers/sockets');
const UserModel = require('../models/UserModel');



exports.Notify=async(receiverId,type,contentId,userId,contentType,media=null,text=null)=>{
    console.log(receiverId,userId);
    
    const receiverSocket=getUserSocketId(receiverId.toString());
    console.log("Receiver found : ",receiverSocket);
    const io=getIoStream();
        if(receiverSocket && io ){
            io.to(receiverSocket).emit('notification');
        }
        const notification={type:type,contentId:contentId,userId:userId,contentType:contentType,media:media,text:text}
        console.log(notification);
        
        await UserModel.findByIdAndUpdate(receiverId,{$push:{notifications:notification}})
    
   
}