const Problem =require("../models/problems")
const {submitToken,submitBatch,getLanguageById}=require("../utils/ProblemUtility")
const User=require("../models/user");
const Submission = require("../models/submission");

const createProblem=async(req,res)=>{
    const {title,description,difficulty,tags,
  visibleTestCases,hiddenTestCases, startCode,referenceSolution,problemCreator}= req.body;

  try{

    
  

  //abb data directly store nhi kara sakte pahle check krna hoga ki jo data de rahe hai wo sahi hai ki galat kuch bhi to admin nhi de rha hai to hum kya karenge jo language hai jo complete code hai + input denge Judge0 ko aue output lenge aue phir apna output se match karwa denge agar sahi hai iska mtlb admin thk data bheja hai phir usko store karayenge abb judge0 ko code language input aur expexted output bhejna ka ek format hai usko dekhna parega !!

  // source_code:
  //language_id:54 62 63
  //stdin:
  //expected_output:
  for(const {language,completeCode} of referenceSolution){

  
   const languageId=getLanguageById(language);
   const submissions = visibleTestCases.map((testcases)=>({
    source_code:completeCode,
    language_id:languageId,
    stdin: testcases.input,
    expected_output:testcases.output

  }));

  

  const submitResult= await submitBatch(submissions);
    console.log(submitResult)
  
   
   const resultToken = submitResult.map((value)=> value.token);

  const testResult= await submitToken(resultToken);
  console.log(testResult)
    
  for (const test of testResult){
    if(test.status_id!=3){
     return  res.status(400).send("Error Occured")
    }
  }

  }
  //after this for loop all my data is checked !

 await Problem.create({
  ...req.body,problemCreator:req.result._id
 })
 
  return  res.status(201).json({
      message:"Problem Saved succesfully!"})
}

  catch(err){
   return  res.status(501).json({message:"problem in Loading problem " + err})
  }
  
}

const updateProblem = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,
    hiddenTestCases,
    startCode,
    referenceSolution,
    problemCreator,
  } = req.body;

  if (!id) return res.status(400).send("Missing Id field");

  try {
    const existingProblem = await Problem.findById(id);
    if (!existingProblem) return res.status(404).send("Problem ID not found");

    // Validate all reference solutions using visible test cases
    for (const { language, completeCode } of referenceSolution) {
      const languageId = getLanguageById(language);

      // Prepare submissions
      const submissions = visibleTestCases.map((testcase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output,
      }));

      // Submit batch of test cases
      const submitResult = await submitBatch(submissions);
      const resultTokens = submitResult.map((r) => r.token);

      // Get execution results
      const testResults = await submitToken(resultTokens);

      // Check each test case's result
      for (const test of testResults) {
        if (test.status_id !== 3) {
          return res
            .status(400)
            .send(`Test failed for language: ${language}. Output mismatch or runtime error.`);
        }
      }
    }

    // All test cases passed — safe to update
    const updatedProblem = await Problem.findByIdAndUpdate(id, { ...req.body }, { new: true, runValidators: true });

    return res.status(200).json({
      message: "Problem updated successfully",
      updatedProblem,
    });
  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).send("Server Error: " + err.message);
  }
};


const deleteProblem =async(req,res)=>{
  const {id}=req.params;
  
  if(!id){
    return res.status(400).send("Id is not valid")
  }
  try{
    await Problem.findByIdAndDelete(id);
   if(!deleteProblem){
    return res.status(404).send("Id is not present !")
   }
   res.send('Succesfully Deleted')
  }
  catch(err){
   res.status(400).send("Error")+err
  }
}

// const getProblemById= async (res,req)=>{
//   const {id}=req.params;
//   try{
//   if(!id){
//     return res.status(401).res.send("Id is missing")
//   }

//   const getProblem = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases startCode referenceSolution ');
//   if(!getProblem){
//     return res.send("Problem is missing")
//   }
//   res.status(201).send(getProblem)
// }}
// catch(err){
//   res.status(500).send("Error: "+err);
// }

const getProblemById = async(req,res)=>{

  const {id} = req.params;
  try{
     
    if(!id)
      return res.status(400).send("ID is Missing");

    const getProblem = await Problem.findById(id).select();
   
   if(!getProblem)
    return res.status(404).send("Problem is Missing");


   res.status(200).send(getProblem);
  }
  catch(err){
    res.status(500).send("Error: "+err);
  }
}

const getAllProblem=async(req,res)=>{
  
  const getProblem= await Problem.find({}).select()
  if(getProblem.length==0){
    return res.send("Problem is missing")
  }
  res.status(201).send(getProblem)
} 

const solvedAllProblembyUser =async(req,res)=>{
  //user me jake length extract kr denge
  try{
    const userId=req.result._id;
    const user=await User.findById(userId).populate({
      path:"problemSolved",
      select:"_id title difficulty tags"
    })
    res.status(200).send(user.problemSolved);
  }
  catch(err){
    res.status(500).send("Server Error"+err)

  }
}


const submittedProblem=async (req,res)=>{
  try{
    const userId=req.result._id
    const problemId=req.params.pid

    const ans=await Submission.find({userId,problemId})
    if (ans.length==0)
     return res.send([])
    res.status(200).send(ans);


  }
  catch(err){
    res.send("Internal Server Error!")
  }
}





module.exports={createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblembyUser,submittedProblem}
