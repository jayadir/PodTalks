import logo from "./logo.svg";
import "./App.css";
import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import {useSelector} from 'react-redux'
function App() {
  return (
    <>
      <Header />
      <div className="App">
        <Outlet />
      </div>
    </>
  );
}

export default App;
