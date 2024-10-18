import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser, setAuthenticated } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

export const useLoading = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function refreshTkn() {
      try {
        setIsLoading(true);
        console.log("All cookies:", document.cookie); 
        // const token = getCookie('refreshTkn'); 
        // console.log("Refresh token:", token); 
        // if (!token) {
        //   throw new Error('No token found');
        // }
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}apiv1/refreshTokens`,
          { withCredentials: true }
        );
        const data = res.data;
        console.log("Response:", res);
        console.log("Data:", data);
        if(res.status===401){
          throw new Error('No token found');
        }
        if (isMounted) {
          dispatch(setUser(data.user));
          dispatch(setAuthenticated(true));
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error during token refresh:", error);
        if (isMounted) {
          setIsLoading(false);
          if (error.message === 'No token found' || (error.response && error.response.status === 401)) {
            setHasError(true);
            navigate('/login');
          }
        }
      }
    }

    if (!hasError) {
      refreshTkn();
    }

    return () => {
      isMounted = false;
    };
  }, [dispatch, hasError, navigate]);

  return { isLoading };
};


// function getCookie(name) {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop().split(';').shift();
//   return null;
// }