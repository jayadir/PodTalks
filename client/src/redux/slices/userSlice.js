import {createSlice} from '@reduxjs/toolkit';
import { set } from 'mongoose';
const userSlice=createSlice({
    name:'user',
    initialState:{
        isAuthenticated:false,
        user:null,
        otp:{
            mobile:"",
            hashdata:"",
        }
    },
    reducers:{
        setAuthenticated:(state,action)=>{
            //
        },
        setOtp:(state,action)=>{
            const {mobile,hash}=action.payload
            state.opt.mobile=mobile;
            state.opt.hashdata=hash;
        }
    }
})

export const {setAuthenticated,setOtp}=userSlice.actions;
export default userSlice.reducer;