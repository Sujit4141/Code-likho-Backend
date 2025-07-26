const express=require("express")
const courseRouter=express.Router()

const {createcourseorder,verifyPayment}=require("../controllers/paymentrazorpay")

const {Addcourse,Updatecourse,getcoursebyid,Deletecourse,getallcourses}=require("../controllers/coursesController")

const adminMiddleware=require("../middleware/adminmiddleware")
const usermiddleware=require("../middleware/usermiddleware")

courseRouter.post('/addCourse',adminMiddleware,Addcourse)
courseRouter.delete('/deletecourse/:id',adminMiddleware,Deletecourse)
courseRouter.put('/updatecourse/:id',adminMiddleware,Updatecourse)

courseRouter.get('/Allcourses',usermiddleware,getallcourses)
courseRouter.get('/getCourse/:id',usermiddleware,getcoursebyid)


courseRouter.post('/courseid/:id',usermiddleware,createcourseorder)
courseRouter.post('/paymentverify',usermiddleware,verifyPayment)



module.exports=courseRouter