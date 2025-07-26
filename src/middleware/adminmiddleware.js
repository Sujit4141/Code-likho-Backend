const jwt=require("jsonwebtoken");
const User = require("../models/user");
const redisclient=require("../confiq/redis")

const adminMiddleware= async(req,res,next)=>{
  try{

    const{token}=req.cookies;
    if(!token)
      throw new Error ("Token is not present");
   const payload= await jwt.verify(token,process.env.JWT_KEY);
   const {_id}=payload;
   if(!_id)
    throw new Error("Invalid Token");
   const result=await User.findById(_id);
   if(payload.role!="admin")
    throw new Error("Invalid Token ")
   if(!result)
    throw new Error("User doesnot exist !")
   
   //redis ke blocklist me present to nhi hai check karenge 
   const  isBlocked=await redisclient.exists(`token:${token}`);//esist krta hai ki nhi 
    if(isBlocked)
      throw new Error("Invalid Token")
    req.result=result;
    next();
  }
  catch(err){
   res.send("Error"+err)
  }
}

module.exports=adminMiddleware
