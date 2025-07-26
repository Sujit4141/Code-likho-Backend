const express=require("express")
const premiumrouter=express.Router()
const adminMiddleware = require ("../middleware/adminmiddleware");  
const userMiddleware = require("../middleware/usermiddleware")

const {premiumdetails, premiumstatus, createPremiumRecord}=require("../controllers/premiumdetails"); 
const { ispremium } = require("../controllers/paymentrazorpay");



premiumrouter.post("/premiumdetails",userMiddleware,premiumdetails)
premiumrouter.post("/premiumsave", userMiddleware, createPremiumRecord);

premiumrouter.get("/subscription/:id",ispremium)


premiumrouter.get("/activatepremium/:id",userMiddleware,premiumstatus)

    




module.exports=premiumrouter