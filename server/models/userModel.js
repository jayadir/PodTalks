const mongoose = require("mongoose");
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        // required:true
    },
    activated:{
        type:Boolean,
        default:false
    },
    email:{
        type:String,
        // required:true
    },
    phone:{
        type:String,
        // required:true
    },
    // timestamps:true
})
module.exports=mongoose.model('User',userSchema);