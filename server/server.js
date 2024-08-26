require('dotenv').config();
const express=require('express');
const cors=require('cors');
const router=require('./routes');
const connect=require('./database/db');
const app=express();
app.use(cors({
    origin:"*",
    methods:"*",
    allowedHeaders:"*",
    
}));
const port=process.env.PORT || 5000;
connect();
app.use(express.json());
app.use("/apiv1",router);
app.listen(port,()=>{
    console.log('Server is running on port 5000');
})