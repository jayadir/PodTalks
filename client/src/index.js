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
import CheckAuthentication from "./components/userAuthPages/ProtectedRoutes/CheckAuthentication";
import Activate from "./components/userAuthPages/Activation/Activate";
import Dashboard from "./components/dashboard/Dashboard";
import axios from "axios";
import { store } from "./redux/store/store";
import { Provider } from "react-redux";
import RoomPage from "./components/RoomPage/RoomPage";
axios.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error) => {
    const prev = error.config;
    if (
      error.response.status === 401 &&
      prev &&
      !prev._isRetryRequest
    ) {
      prev._isRetryRequest = true;
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}apiv1/refreshTokens`,
          {
            withCredentials: true,
          }
        );

        if (res.status === 200) {
          return axios.request(prev);
        } else {
          throw new Error("Token refresh failed");
        }
      } catch (err) {
        console.error("Error refreshing token", err);
      }
    } else {
      throw error;
    }
  }
);

const root = ReactDOM.createRoot(document.getElementById("root"));
const user = {
  activated: false,
};
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
          <CheckAuth>
            <Signup />
          </CheckAuth>
        ),
      },
      // {
      //   path: "/activate",
      //   element: (
      //     <IntermediateProtectedRoute >
      //       <Activate />
      //     </IntermediateProtectedRoute>
      //   ),
      // },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path:"/room/:roomId",
        element:(
          <ProtectedRoute>
            <RoomPage/>
          </ProtectedRoute>
        )
      }
    ],
  },
]);
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={BrowserRouter} />
    </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
