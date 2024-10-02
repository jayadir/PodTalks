const mongoose=require('mongoose');
const roomSchema=new mongoose.Schema({
    topic:{
        type:String,
        required:true
    },
    roomAccess:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    speakers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    
})
module.exports=mongoose.model("Room",roomSchema)