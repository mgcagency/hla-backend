import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import session from 'express-session'
import MongoStore from 'connect-mongo';
import { initializingPassport } from './passportConfig.js';
import https from "https"
import fs from "fs" 
import { Server } from 'socket.io';
import http from 'http';
import cors from "cors"

//importing Routes
import userRoute from './routes/user.js'
import taskRoute from './routes/tasks.js'
import wellnessRoute from './routes/wellness.js'
import monthlyPlanRoute from './routes/monthly_plan.js'
import scheduleClassRoute from "./routes/schedule_class.js";
import reviewRoute from "./routes/review.js"
import wellbeingRoute from "./routes/wellbeing.js"
import { Chats } from './models/chat.js';
// import chatRoute from "./routes/chat.js"
dotenv.config();
console.log("hellom2");

// const PORT = 4000
const PORT = 443

const app = express();

const certPath = fs.readFileSync("/etc/letsencrypt/live/ardleanursery.co.uk-0001/fullchain.pem");
const keyPath = fs.readFileSync("/etc/letsencrypt/live/ardleanursery.co.uk-0001/privkey.pem");

const SSLOPITON = {
    key: keyPath,
    cert: certPath
}

// console.log("file contnet is : ", SSLOPITON);


app.use(cors({
    origin: ["http://localhost:5173", "https://hla-integration-fnxi.vercel.app", "https://house-learning-accademy.netlify.app", "https://hla-frontend.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

const server = https.createServer(SSLOPITON, app);
// const server = http.createServer(app);  // Create an HTTP server with Express app
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "https://hla-integration-fnxi.vercel.app", "https://house-learning-accademy.netlify.app", "https://hla-frontend.vercel.app"],
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: ['Content-Type'],
    }
});

app.use(express.json());


mongoose.connect(process.env.MONGO_URI as string)
.then(() => {
    console.log("Connected to Database");
})
.catch(() => {
    console.log("Connection Failed")
})


//Using Routes
app.use("/api/user", userRoute);
app.use("/api/task", taskRoute);
app.use("/api/class", scheduleClassRoute);
app.use("/api/review", reviewRoute);
app.use("/api/wellbeing", wellbeingRoute);
app.use("/api/wellness", wellnessRoute);
app.use("/api/monthly-plan", monthlyPlanRoute);
// app.use("api/chats", chatRoute)

app.get("/", (req, res) => {
    res.send({message: "API working FINE live on DIGITAL OCEAN", count: 4, lastCount:3})
})

const messageCache: any = {}; // Local cache for messages
const FLUSH_INTERVAL = 5000;

const flushMessagesToDB = async () => {
    // console.log("Sedning data to DB")
    for (const roomName in messageCache) {
        if (messageCache[roomName].length > 0) {
            const chat = await Chats.findOne({ members: { $all: roomName.split('_').slice(1) } });
            if (chat) {
                chat.messages.push(...messageCache[roomName]);
                await chat.save();
            } else {
                const members = roomName.split('_').slice(1);
                await Chats.create({ members, messages: messageCache[roomName] });
            }
            messageCache[roomName] = []; // Clear the cache for the room after flushing
        }
    }
};

// Set up the interval to flush messages to the database
setInterval(flushMessagesToDB, FLUSH_INTERVAL);

io.on("connection", (socket) => {
    console.log("User Connected");
    console.log("Id", socket.id);
    socket.emit("welcome", `Welcome to the server ${socket.id}`);

    socket.on("get-chats", async (members)=> {
        const [member1, member2] = members;
        const roomName = member1 < member2 ? `room_${member1}_${member2}` : `room_${member2}_${member1}`;
        
        console.log(socket.id, roomName, "jonied")
        socket.join(roomName);
        const chat = await Chats.findOne({ members: { $all: members } });
        if(chat){
            socket.emit("chat-history", chat);
        }
        else{
            socket.emit("chat-history", { messages: [] });
        }
    })

    socket.on("get-all-chats", async (userid) => {
        const chats = await Chats.find({ members: userid });
        socket.emit("all-chats", chats);    
    });

    socket.on("message", async (data) => {
        const [member1, member2] = data.members;
        const roomName = member1 < member2 ? `room_${member1}_${member2}` : `room_${member2}_${member1}`;
        
        socket.join(roomName);
        socket.emit("join-room", roomName);
        
        // console.log("RoomName:", roomName, "Data Going: ", data);
        socket.to(roomName).emit("receive-message", data);

        if (!messageCache[roomName]) {
            messageCache[roomName] = [];
        }

        messageCache[roomName].push(data.messages[0]);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

server.listen(PORT, ()=> {
    console.log(`Server is working on ${PORT} live on Digital Ocean --=> count: 1, lastCount: 1`);
    // console.log(`Server is working on http://localhost:${PORT}`);
})


http.createServer((req, res) => {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
  }).listen(80);
