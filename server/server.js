require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./routes/routes"); 
const { connectDb } = require("./db/db");
const app = express();
const {initSocket}=require('./helpers/sockets');
const http=require('http');


const httpServer=http.createServer(app);

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(routes);


console.log("Port : ",process.env.PORT);

const startServer = async () => {
    const isConnected = await connectDb();
    if (isConnected) {
        initSocket(httpServer);
        httpServer.listen(process.env.PORT,()=>{
            console.log("Server Succesfully running");
        })

    } else {
        process.exit(1);
    }
};




startServer();
