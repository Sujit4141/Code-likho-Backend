// Add to index.js
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

const getvideotoken=(req,res)=>{
  const {id}=req.params
  if(!id) 
    return res.status(400).json({error:"Chanel id id required"});
   const appId = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;
   const channelName = id;
  const uid = 0; // 0 for auto-assign uid
  const role = RtcRole.PUBLISHER;
  const expirationTimeInSeconds = 3600; // 1 hour
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const token = RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );

  res.json({ token, appId });
  
}



module.exports=getvideotoken