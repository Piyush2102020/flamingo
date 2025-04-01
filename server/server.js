require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./routes/routes"); 
const { connectDb } = require("./db/db");


const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(routes);

const startServer = async () => {
    const isConnected = await connectDb();

    if (isConnected) {
        app.listen(process.env.PORT, () => {
            console.log("🚀 Server running successfully");
        });
    } else {
        process.exit(1);
    }
};

startServer();
