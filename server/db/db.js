const mongoose=require('mongoose');


// Connect to database
exports.connectDb=async ()=>{
    try{

        await mongoose.connect(process.env.DB_URL);
        return true;

    }catch(e){
        console.log("Can't Connect to db",e.message);
        return false;
    }
    
}