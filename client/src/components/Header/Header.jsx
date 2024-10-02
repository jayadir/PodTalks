import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/userSlice";
import "./Header.css"; // Import the CSS file

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav>
      <Link to="/" className="logo">
        Logo
      </Link>
      <div className="logout">
        {isAuthenticated && (
          <div className="user-info">
            <div className="avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <Link to="/" className="username">
              {user.username}
            </Link>
          </div>
        )}
        {isAuthenticated && (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Header;