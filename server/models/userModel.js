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
    username:{
        type:String,
        // required:true,
        // unique:true
        default:""
    },
    }
,{timestamps:true})
const User=mongoose.model('User',userSchema);
// User.createIndexes({username:1})
module.exports=User