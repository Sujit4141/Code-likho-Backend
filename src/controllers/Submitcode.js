const Problem=require("../models/problems")
const Submission=require("../models/submission")
const {submitToken,submitBatch,getLanguageById}=require("../utils/ProblemUtility")




const Submitcode=async(req,res)=>{
 
  //hulog ko userid aur problem id chhaiye !
  try{
      const userId=req.result._id;
      const problemId=req.params.id;


      
      const {code,language}=req.body //jab submit ho rha hoga tab to ye dono body me rahega hee 

      if(!userId||!code||!problemId||!language)
        return res.status(400).send("Some Field are misiing");
      
      //fetch the problem from the databse taki humlog run kar sakte judge0 ko deke 
      const problem=await Problem.findById(problemId)
      //abb humlog ko problem mil gaya jaise user bheja problem ko tab abb hidden test cases lenge aur judge0 ko bhej deng par krenge kya ki bhejne se phle db me jo pata hai utna hee store kr denge ki baad me jake agae error bhi aaye judge0 se to kam se kam daytabse me pending wala to rhega hee aur phir jab baad me judge0 return kr dega tab usko update kr denge database me  
     
     const submittedResult = await Submission.create({
               userId,
               problemId,
               code,
               language,
               status:'pending',
               testCasesTotal:problem.hiddenTestCases.length
             })

     //abb judge0 ko denge code
    const languageId=getLanguageById(language);

     

    const submissions =problem.hiddenTestCases.map((testcases)=>({
    source_code:code, //user ka code
    language_id:languageId,
    stdin: testcases.input,
    expected_output:testcases.output
   

  }));

  const submitResult= await submitBatch(submissions);

   const resultToken = submitResult.map((value)=> value.token);
   const testResult= await submitToken(resultToken);
   
   //submittedResult ko update krenge  !!
   let testCasesPassed=0;
   let runTime=0;
   let memory=0;
   let errorMessage=null
   let status="accepted"
   for(const test of testResult){
    if(test.status_id==3){
      testCasesPassed++;
      runTime=runTime+parseFloat(test.time);
      memory=Math.max(memory,test.memory);
    }

    else{
      if(test.status_id==4){
        status='error'
        errorMessage=test.stderr
      }
      else{
        status="wrong";
        errorMessage=test.stderr
      }
    }
   }

   //abb database me update kr denge 
   submittedResult.testCasesPassed=testCasesPassed
   submittedResult.runTime=runTime
   submittedResult.memory=memory
   submittedResult.errorMessage=errorMessage
   submittedResult.status=status

  await submittedResult.save();

  //humlog abb submit ho gya sab database me updtae ho gaya abb dekh lenge ki agar problem solved me hai phle se to usko add nhi karayenge warna karwa denge ki ye problem id user solve kiya hai !
  
  if(!req.result.problemSolved.includes(problemId)){
    req.result.problemSolved.push(problemId);
    await req.result.save()
  }


  
     res.status(200).json({
      results: testResult.map(result => ({
        status: result.status.description,
        stdin: result.stdin,
        stdout: result.stdout,
        expected_output: result.expected_output,
        time: result.time,
        memory: result.memory
      })),
      // Optional: Calculate overall status
      overallStatus: testResult.every(r => r.status.id === 3)
        ? "Accepted"
        : "Rejected"
    });
  
  }
  catch(err){
    res.send("Error occured :"+err)

  }

}


const runCode=async(req,res)=>{
   

 try{
      const userId=req.result._id;
      const problemId=req.params.id;
      

      const {code,language}=req.body //jab submit ho rha hoga tab to ye dono body me rahega hee 
      
      

      if(!userId||!code||!problemId||!language)
        return res.status(400).send("Some Field are misiing");
      
      //fetch the problem from the databse taki humlog run kar sakte judge0 ko deke 
      const problem=await Problem.findById(problemId)
      
      //abb humlog ko problem mil gaya jaise user bheja problem ko tab abb hidden test cases lenge aur judge0 ko bhej deng par krenge kya ki bhejne se phle db me jo pata hai utna hee store kr denge ki baad me jake agae error bhi aaye judge0 se to kam se kam daytabse me pending wala to rhega hee aur phir jab baad me judge0 return kr dega tab usko update kr denge database me  
     

     //abb judge0 ko denge code
    const languageId=getLanguageById(language);
    

    const submissions =problem.visibleTestCases.map((testcases)=>({
    source_code:code, //user ka code
    language_id:languageId,
    stdin: testcases.input,
    expected_output:testcases.output

  }));

  console.log(submissions)
  

  const submitResult= await submitBatch(submissions);

   const resultToken = submitResult.map((value)=> value.token);
   const testResult= await submitToken(resultToken);
   console.log(testResult)
  
  
     res.status(200).json({
      results: testResult.map(result => ({
        status: result.status.description,
        stdin: result.stdin,
        stdout: result.stdout,
        expected_output: result.expected_output,
        time: result.time,
        memory: result.memory
      })),
      // Optional: Calculate overall status
      overallStatus: testResult.every(r => r.status.id === 3)
        ? "Accepted"
        : "Rejected"
    });
}
 catch(err){
    res.send("Error occured :"+err)

  }}
module.exports={runCode,Submitcode}