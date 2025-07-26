const express=require("express")
const problemRouter= express.Router();
const adminMiddleware=require("../middleware/adminmiddleware")
const {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblembyUser,submittedProblem}=require("../controllers/userProblem")
const usermiddleware=require("../middleware/usermiddleware")

problemRouter.post("/create",adminMiddleware,createProblem);
problemRouter.put("/update/:id",adminMiddleware,updateProblem);
problemRouter.delete("/delete/:id",adminMiddleware,deleteProblem);
//upparwala me admin ka access lagega 

problemRouter.get("/problemById/:id",usermiddleware,getProblemById);
problemRouter.get("/getAllProblem",usermiddleware,getAllProblem);
problemRouter.get("/problemSolvedbyUser",usermiddleware,solvedAllProblembyUser);

problemRouter.get("/submittedProblem/:pid",usermiddleware,submittedProblem)
//create
//fetch//
//delete
//update

module.exports=problemRouter