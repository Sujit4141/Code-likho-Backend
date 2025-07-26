const express = require("express");  
const GoodiesRouter = express.Router();
const adminMiddleware = require ("../middleware/adminmiddleware");  
const userMiddleware = require("../middleware/usermiddleware") 

const {createorderStore,verifyPayment}=require("../controllers/paymentrazorpay")


const {
  addGoodies,
  updateGoodies,
  getAllGoodies,
  getGoodiesById,
  deleteGoodies
} = require("../controllers/goodiesController");


GoodiesRouter.post("/addgoodies", adminMiddleware, addGoodies);  
GoodiesRouter.put("/updategoodies/:id", adminMiddleware, updateGoodies);  
GoodiesRouter.get("/getallgoodies", userMiddleware, getAllGoodies);  
GoodiesRouter.get("/getgoodies/:id", userMiddleware, getGoodiesById);  
GoodiesRouter.delete("/deletegoodies/:id", adminMiddleware, deleteGoodies);  

GoodiesRouter.post('/orderid/:id',userMiddleware,createorderStore)
GoodiesRouter.post('/paymentverify',userMiddleware,verifyPayment)




module.exports = GoodiesRouter;