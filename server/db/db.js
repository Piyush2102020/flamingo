const mongoose=require('mongoose');




/**
 * Connects to the MongoDB database using the URL from environment variables.
 *
 * @returns {boolean} - Returns `true` if connection is successful, otherwise logs error and returns `false`.
 */
exports.connectDb=async ()=>{
    try{

        await mongoose.connect(process.env.DB_URL);
        return true;

    }catch(e){
        console.log("Can't Connect to db",e.message);
        return false;
    }
    
}