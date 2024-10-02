import logo from "./logo.svg";
import "./App.css";
import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useLoading } from "./customHooks/useLoading";
import Loader from "./components/Loader/Loader";
import socket from "./sockets";
function App() {
  // const [isLoading, setIsLoading] = useState(false);
  
  const {isLoading}=useLoading()
  console.log(isLoading)
  return isLoading ? (
    <Loader/>
  ) : (
    <>
      <Header />
      <div className="App">
        <Outlet />
      </div>
    </>
  );
}

export default App;
