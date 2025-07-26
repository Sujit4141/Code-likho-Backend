const redisclient = require("../confiq/redis");
const User=require("../models/user")
const validate =require("../utils/validate");
const bcrypt= require("bcrypt")
const jwt=require("jsonwebtoken")
const Submission=require("../models/submission")


const register= async (req,res)=>{
  try{
    

      validate(req.body)
     const {firstName,emailId,password}=req.body;

   if (!firstName || !emailId || !password) {
  return res.status(400).json({ 
    message: "Please Input all details" 
  });
}

     req.body.password= await bcrypt.hash(password,10);
     req.body.role="user"
    
    
    const user=await User.create(req.body);
    const token =jwt.sign({_id:user._id,emailId:emailId,role:"user"},process.env.JWT_KEY,{expiresIn:60*60});

    const reply={
     firstName:user.firstName,
     emailId:user.emailId,
     _id:user._id,
     role:user.role
   }

   
    res.cookie("token",token,{maxAge:60*60*1000});
    res.status(201).json({user:reply,
      message:"Registerd Successfully! succesfully!"})
  }
  catch(err){
    console.log(err)
    res.status(500).json({message:"Error Occured",
      error:err
    });
  }
}

const login=async(req,res)=>{
  try{
    const {emailId,password}=req.body;

    // if(!emailId)
    //   throw new Error("Invalid Credentials")
    // if(!password)
    //   throw new Error("Invalid Credentials")
    if (!emailId || !password) {
      return res.status(400).json({ 
        message: "Both email and password are required" 
      });
    }

    const user= await User.findOne({emailId});

     if (!user) {
      return res.status(401).json({ 
        message: "Invalid credentials" 
      });
    }


  const match=await bcrypt.compare(password,user.password);
    if (!match) {
      return res.status(401).json({ 
        message: "Invalid credentials" 
      });
    }


    const reply={
     firstName:user.firstName,
     emailId:user.emailId,
     _id:user._id,
     role:user.role
   }
  

    const token =jwt.sign({_id:user._id,emailId:emailId,role:user.role},process.env.JWT_KEY,{expiresIn:60*60});
    res.cookie("token",token,{maxAge:60*60*1000});
    res.status(200).json({user:reply,message:"Logged In succesfully!"})
  }
    catch(err){
    res.status(500).json({message:" Interval Server Error ",
      error:err
    });

  }
}


//logout feature

const logout=async(req,res)=>{
  try{
     
    //validate the token 
    //token add kar dunga redix ke blocklist 
    //aur jab tak expire naa kar jaye 
    //cookeies clear
    const {token} =req.cookies;//(already validate hai )
    const payload =jwt.decode(token);
    await redisclient.set(`token${token}`,"Blocked")
    await redisclient.expireAt(`token${token}`,payload.exp)
    res.cookie("token",null,{expires:new Date(Date.now())});
    res.send("Logged Out Succesfully !")

  }
  catch(err){

    res.status(501).send("Error"+err)
  }
}

const adminRegister = async (req, res) => {
  try {
    await validate(req.body);
    const { firstName, emailId, password, role } = req.body;
    req.body.password = await bcrypt.hash(password, 10);
    req.body.role = role;

    const user = await User.create(req.body); 
  
    res.status(201).send("User Registered Successfully!");
  } catch (err) {
    console.error("Registration Error:", err); // ✅ Log the real error
    res.status(401).json({ message: err.message }); // ✅ Return a proper error
  }
};

const deleteProfile = async (req, res) => {
  try {
    const { userId } = req.params; // ✅ Destructure properly

    await User.findByIdAndDelete(userId); // ✅ This is now a string

    await Submission.deleteMany({ userId }); // ✅ Only works if your Submission schema has a userId field

    res.status(200).send("Deleted Successfully");
  } catch (err) {
    res.status(512).send("Server Error: " + err.message);
  }
};



const allProfile = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      message: 'Unable to fetch data',
      error: err.message || err,
    });
  }
};



const updateuser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;


    if (!role) {
      return res.status(400).json({ error: "Role is required." });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role: role },
    );

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getuser=async(req,res)=>{

  try{
    const {id}=req.params

    const response=await User.findById(id)

    res.status(201).send(response)




  }
  catch(err){
    res.status(401).send({message:"Cant fetch Right Now ",
      error:err
    })
  }
  

}

const completeProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { lastName, age } = req.body;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { lastName, age },
      { new: true } // returns the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong while updating the profile",
      error: err.message,
    });
  }
};






module.exports={register,login,logout,adminRegister,deleteProfile,allProfile,updateuser,getuser,completeProfile};
