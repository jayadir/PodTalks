import {createSlice} from '@reduxjs/toolkit';
import { set } from 'mongoose';
const userSlice=createSlice({
    name:'user',
    initialState:{
        isAuthenticated:false,
        user:{},
        otp:{
            mobile:"",
            hashdata:"",
            expiry:""
        }
    },
    reducers:{
        setUser:(state,action)=>{
            // if(Object.keys(state.user).length!==0){
            //     state.isAuthenticated=true;
            // }
            const user=action.payload;
            console.log(user)
            const newData={...state.user,...user};
            state.user=newData;
        },
        setAuthenticated:(state,action)=>{
            state.isAuthenticated=action.payload;
        },
        setOtp:(state,action)=>{
            const {mobile,hash,expiry}=action.payload
            state.otp.mobile=mobile;
            state.otp.hashdata=hash;
            state.otp.expiry=expiry;
        },
        setUsername(state,action){
            if (!state.user) {
                state.user = {}; 
              }
              state.user.activated=true
            state.user.username=action.payload;
        },
        logout(state,action){
            state.isAuthenticated=false;
            state.user={};
            state.otp={
                mobile:"",
                hashdata:"",
                expiry:""
            }
        }
    }
})

export const {setUser,setOtp,setUsername,setAuthenticated,logout}=userSlice.actions;
export default userSlice.reducer;