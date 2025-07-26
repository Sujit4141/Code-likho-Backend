const validator=require("validator")



const validateData=(data)=>{
  const mandatoryField=["firstName","emailId","password"];
  const IsAllowed=mandatoryField.every((k)=>Object.keys(data).includes(k));

  if(!IsAllowed)
    throw new Error("Some Field Missing")

  if (!validator.isEmail(data.emailId))
    throw new Error("Invaid Email")


}

module.exports=validateData