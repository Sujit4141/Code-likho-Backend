const axios=require("axios")

const getLanguageById=(lang)=>{
  const language={
    "c++":54,
    "C++":54,
    "Cpp":54,
    "cpp":54,
    "java":62,
    "javascript":63,
    "python":71
  }
  return language[lang.toLowerCase()];

}

const submitBatch=async (submissions)=>{

const options = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'false'
  },
  headers: {
      
    'x-rapidapi-key': process.env.JUDGE0_API,
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
    submissions
}};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data
	} catch (error) {
		console.error(error);
	}
}

return await fetchData();
}


const waiting=async(timer)=>{
  setTimeout(()=>{
    return 1
  },timer)
}


const submitToken=async(resulttoken)=>{
   

const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    tokens: resulttoken.join(","),
    base64_encoded: 'false',
    fields: '*'
  },
  // headers: {
  //   'x-rapidapi-key': '4715399645msh98067e33ff8128bp11972djsn23d74a83bc65',
  //   'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
  // }

  headers: {
    'x-rapidapi-key': process.env.JUDGE0_API,
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
  }

};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data
	} catch (error) {
		console.error(error);
	}
}
while(true){
   const result= await fetchData()

const IsResultObtained=result.submissions.every((r)=>r.status_id>2);
if(IsResultObtained){
  return result.submissions
}

 await waiting(1000)

     }
}


module.exports={getLanguageById,submitBatch,submitToken}