import React, { useContext, useState } from "react";
import { Link } from 'react-router-dom';
import { AuthContext } from "../../hooks/context/ContextProvider";

import "./navbar.css";

const Navbar = () => {
  const { logIn, user, isLoggedIn, logOut } = useContext(AuthContext);
  const [openLogIn, setOpenLogIn] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <nav className="app__navbar">
        <ul>
          <li>
            <Link to="/">Users</Link>
          </li>
          <li>
            <Link to="/events">Events</Link>
          </li>
          <li>
            <Link to="/create_event"> Create Event</Link>
          </li>
        </ul>
        <button

          onClick={() => {
            isLoggedIn?logOut():setOpenLogIn("activef");
            
          }}
        >
          {user ? "log out" : "log in"}
        </button>
      </nav><>
      {isLoggedIn ?"": (<>
        <div
        className={`background  ${openLogIn}`}
        onClick={() => {
          setOpenLogIn("");
        }}
      ></div>
      <div className={`form__container ${openLogIn}`}>
      <form onSubmit={(e) => logIn(e, userName, password)} className="log_in_form nf">
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
          <button type="submit">Log In</button>
          <br />
          <button
            onClick={() => {
              setOpenLogIn("");
            }}
            type="button"
          >
            cancel
          </button>
        </form>
      </div></>)}
      </>
    </>
  );
};

export default Navbar;
