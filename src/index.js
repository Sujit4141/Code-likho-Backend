const express= require("express");
const app=express();
const http = require('http');
require('dotenv').config();
const main=require("./confiq/db")
const cookieParser= require('cookie-parser');
const authRouter=require("./routes/userAuth")
const redisclient=require("./confiq/redis")
const problemRouter=require("../src/routes/problemCreator")
const submitRouter=require("../src/routes/submit")
const cors=require('cors');
const courseRouter = require("./routes/courseRouter");

const GoodiesRouter=require("./routes/goodiesRoutes")
const getvideotoken =require("./controllers/videocall")

const premiumrouter=require("./routes/premiumrouter")

const server = http.createServer(app);
app.use(cors({
  origin: 'https://codelikho.vercel.app',
  credentials:true
}))

//socket.io is setup kiye kya humlog ek normal http server banaye phir usko socket.io wale server se upgrade kr diye abb koi dikkat nhi hoga io ke andar mera abb socket wala server hai mtlb jo bhi server socket wala kaam hoga wo io se hoga !

const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin:  'https://codelikho.vercel.app',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const chatHandler = require('./utils/Socket');
chatHandler(io);




app.use(express.json())
app.use(cookieParser())

app.use("/user",authRouter)
app.use("/problem",problemRouter)
app.use("/submission",submitRouter)
app.use("/course",courseRouter)

app.use("/goodies",GoodiesRouter)
app.get('/agoratoken/:id',getvideotoken)

app.use("/premium",premiumrouter)

const InitializeConnection=async()=>{
  try{
    await Promise.all([main(),redisclient.connect()]);
    console.log("DB connected !")
    server.listen(process.env.PORT,()=>{
     console.log("server is listening !"+process.env.PORT);})

  }
  catch(err){
    console.log("Error"+err)
  }
}
InitializeConnection();


