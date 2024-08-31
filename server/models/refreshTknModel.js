const mongoose=require('mongoose');
const tknSchema=new mongoose.Schema({
    refreshToken:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
})

module.exports=mongoose.model('refreshToken',tknSchema,"refreshTokens");