import React, { useContext, useState } from "react";
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
            <a href="/">Users</a>
          </li>
          <li>
            <a href="/events">Events</a>
          </li>
          <li>
            <a href="/create_event"> Create Event</a>
          </li>
        </ul>
        <button
          onClick={() => {
            setOpenLogIn("activef");
          }}
        >
          {user ? "log out" : "log in"}
        </button>
      </nav>
      <div
        className={`background  ${openLogIn}`}
        onClick={() => {
          setOpenLogIn("");
        }}
      ></div>
      <div className={`form__container ${openLogIn}`}>
        <form onSubmit={logIn} className={`log_in_form nf `}>
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
      </div>
    </>
  );
};

export default Navbar;
