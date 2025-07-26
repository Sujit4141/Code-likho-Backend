const razorpay=require("razorpay");
const dotenv=require('dotenv')
dotenv.config()

const razorpayInstance =()=>{
  return new razorpay({
  key_id:process.env.razorpaykeyid,

  key_secret:process.env.Razorpay_api
});
}

module.exports=   razorpayInstance