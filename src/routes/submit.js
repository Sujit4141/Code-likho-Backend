const express=require("express");
const userMiddleware = require("../middleware/usermiddleware");
const submitRouter=express.Router();
const {runCode,Submitcode}=require("../controllers/Submitcode")




submitRouter.post("/submit/:id",userMiddleware,Submitcode)
submitRouter.post("/run/:id",userMiddleware,runCode)


module.exports=submitRouter