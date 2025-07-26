const Goodies=require("../models/Goodies")
const Course= require("../models/courses")
const mongoose = require('mongoose');
const crypto=require("crypto")

const Premium=require("../models/premiumuser")

const dotenv=require('dotenv')
dotenv.config()

const razorpayInstance=require("../confiq/razorpay")

const razorpay=razorpayInstance();


const createorderStore= async(req,res)=>{
  const {id}=req.params;

  const data = await Goodies.findById(id)
 
    //create order
    const options={
      amount: data.productPrice * 100,
      currency :"INR",
    
    };

    try{
      razorpay.orders.create(options,(err,order)=>{
        if(err){
          return res.status(500).json({
            success:false,
            message:err
          })
        }

        res.status(200).json(order);
      })


    }
    catch(err){
      return res.status(500).json({
        status:false,
        message: err
      })
    }
}


const ispremium=async(req,res)=>{
    const {id}=req.params;

  const data = await Premium.findById(id)

 
    //create order
    const options={
      amount: 2000 * 100,
      currency :"INR",
    };

    try{
      razorpay.orders.create(options,(err,order)=>{
        if(err){
          return res.status(500).json({
            success:false,
            message:err
          })
        }

        res.status(200).json(order);
      })


    }
    catch(err){
      return res.status(500).json({
        status:false,
        message: err
      })
    }
}

const verifyPayment = async (req, res) => {
  // 1. Use correct environment variable name
  const secret = process.env.Razorpay_api; 
  
  

  // 2. Use correct parameter names from frontend
  const {productId, order_id,payment_id,signature } = req.body;
  

  // 3. Generate signature with correct format
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(order_id + "|" + payment_id);
  const generatedSignature = hmac.digest("hex");

  // 4. Compare signatures
  if (generatedSignature === signature) {

     
    



    return res.status(200).json({
      success: true,
      message: "Payment Verified"
    });
  } else {
    // Add debug logs in development
    console.error("Signature Mismatch:", {
      generated: generatedSignature,
      received: signature
    });
    
    return res.status(400).json({
      success: false,
      message: "Payment verification failed"
    });
  }
};



const createcourseorder=async(req,res)=>{

 try {
    const { id } = req.params;
    
   

    const data = await Course.findById(id);
      const options={
      amount: data.CoursePrice * 100,
      currency :"INR",
    };

     razorpay.orders.create(options,(err,order)=>{
        if(err){
          return res.status(500).json({
            success:false,
            message:err
          })
        }

        res.status(200).json({order:order,
          data:data
        });
      })

  }
   catch(err){
      return res.status(500).json({
        status:false,
        message: err
      })
    }
}

module.exports= {verifyPayment,createorderStore,createcourseorder,ispremium}