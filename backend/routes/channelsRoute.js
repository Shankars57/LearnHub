import Channel from "../models/channel.js";
import express from 'express';
const channelRoutes = express.Router();


channelRoutes.get("/get-channels" ,async(req,res)=>{
 
   try {
     const channels = await Channel.find({});
 
     res.json({success:true , channels})
 
   } catch (error) {
    res.json({success:false , message:error.message})
   }

})

export default channelRoutes;