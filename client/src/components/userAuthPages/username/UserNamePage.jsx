import React, { useState } from "react";
import Card from "../../card/Card";
import "./username.css";
import { setUsername } from "../../../redux/slices/userSlice";
import {useDispatch,useSelector} from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function UserNamePage({ onNext }) {
  const navigate=useNavigate()
  const mobile=useSelector(state=>state.user.user.phone)
  const dispatch=useDispatch();
  const [username, setUsernameState] = useState("");
const handleNext=async ()=>{
  if(username===""){
    alert("fill the username")
    return
  }
  console.log(mobile)
  const res=await axios.patch(process.env.REACT_APP_API_URL+"apiv1/updateUsername",{username,mobile},{
    withCredentials:true
  })
  console.log(res)
  if(res.status===200){
    dispatch(setUsername(username))
    // onNext()
    navigate("/dashboard")
  }
  else if(res.data.message==="username already exists"){
    alert("username already exists")
    return
  }
}
  return (
    <div className="container">
      <Card title={"Enter UserName"} buttonContent={"Finish"} onclick={handleNext}>
        <div className="input">
          {/* <label htmlFor="username">Username</label> */}
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsernameState(e.target.value)}
            placeholder="Enter your username"
          />
        </div>
      </Card>
    </div>
  );
}
