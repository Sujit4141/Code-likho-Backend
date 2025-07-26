const express=require("express");
const authRouter=express.Router();
const {register,login,logout,adminRegister,deleteProfile,allProfile,updateuser,getuser,completeProfile}=require("../controllers/userAuthent")
const userMiddleware=require("../middleware/usermiddleware")
const adminMiddleware=require("../middleware/adminmiddleware")


authRouter.post("/register",register);
authRouter.post("/login",login);
authRouter.post("/logout",userMiddleware,logout);
// authRouter.get("getProfile",getProfile);
authRouter.post("/admin/register",adminMiddleware,adminRegister);
authRouter.get("/getallprofile",adminMiddleware,allProfile)
authRouter.post("/completeprofile/:id",userMiddleware,completeProfile)

authRouter.get("/check",userMiddleware,(req,res)=>{
  const reply={
    firstName:req.result.firstName,
    emailid:req.result.emailid,
    _id:req.result._id,
    role:req.result.role
  }
  res.status(200).json({
    user:reply,
    message:"Valid User"
  })
})

authRouter.delete('/deleteProfile/:userId',userMiddleware,deleteProfile)
authRouter.patch("/update/:id",updateuser)
authRouter.get("/getuser/:id",userMiddleware,getuser)

// Add to your auth routes


module.exports=authRouter;


//register
//login//logout//getprofile