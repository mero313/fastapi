import React from "react";

import "./navbar.css";

const Navbar = () => {
  return (
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
      <button>log in</button>
    </nav>
  );
};

export default Navbar;
