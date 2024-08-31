require('dotenv').config();
const express=require('express');
const cors=require('cors');
const router=require('./routes');
const connect=require('./database/db');
const cookieparser=require('cookie-parser');
const app=express();
app.use(cookieparser());
app.use(cors({
    origin:'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], 

    allowedHeaders:["Content-Type","Authorization"],
    credentials:true
    
}));
const port=process.env.PORT || 5000;
connect();
app.use(express.json());
app.use("/apiv1",router);
app.listen(port,()=>{
    console.log('Server is running on port 5000');
})