/**
 * ===============================================================
 * 📄 NOTE FROM DEVELOPER:
 * 
 * The code in this file is fully written and structured by the developer.
 * Only the inline documentation (comments/docstrings) were generated 
 * using ChatGPT to improve readability and maintainability.
 * 
 * All logic, architecture decisions, and implementation are original 
 * and hand-coded.
 * 
 * – Developer: Piyush Bhatt
 * ===============================================================
 */



/**
 * 🔧 Server Setup
 * 
 * - Loads environment variables
 * - Initializes Express app with middleware (CORS, JSON)
 * - Connects to MongoDB
 * - Attaches REST API routes
 * - Boots up HTTP server with WebSocket (via socket.io or similar)
 */
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

const startServer = async () => {
    const isConnected = await connectDb();
    if (isConnected) {
        initSocket(httpServer);
        httpServer.listen(process.env.PORT,"0.0.0.0",()=>{
            console.log("Server Succesfully running at port : ",process.env.PORT);
        })

    } else {
        process.exit(1);
    }
};




startServer();
