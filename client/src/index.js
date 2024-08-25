import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./components/Homepage/HomePage";
import Signup from "./components/userAuthPages/Signup";
import CheckAuth from "./components/userAuthPages/ProtectedRoutes/CheckAuth";
import ProtectedRoute from "./components/userAuthPages/ProtectedRoutes/ProtectedRoute";
import IntermediateProtectedRoute from "./components/userAuthPages/ProtectedRoutes/IntermediateProtectedRoute";
import Activate from "./components/userAuthPages/Activation/Activate";
import Dashboard from "./components/dashboard/Dashboard";
const root = ReactDOM.createRoot(document.getElementById("root"));
const user={
  activated:false
}
const BrowserRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: (
          <CheckAuth isAuthenticated={false}>
            <Signup />
          </CheckAuth>
        ),
      },
      {
        path:"/activate",
        element: <IntermediateProtectedRoute isAuthenticated={false} user={user}>
          <Activate/>
        </IntermediateProtectedRoute>
      },{
        path:"/dashboard",
        element: <ProtectedRoute isAuthenticated={true} user={user}>
          <Dashboard/>
        </ProtectedRoute>
      }
    ],
  },
]);
root.render(
  <React.StrictMode>
    <RouterProvider router={BrowserRouter} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
