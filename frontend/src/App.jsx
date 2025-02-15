import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Voting from "./components/Voting/Voting";
import AddEvent from "./components/addEvent/AddEvent";
import Users from "./components/Users/Users";

const App = () => {
  return (
    <div>
      <main>
        <Navbar />
        <Router>
          <Routes>
            <Route path="/" element={<Users />} />
            <Route path="/events" element={<Voting />} />
            <Route path="/create_event" element={<AddEvent />} />
          </Routes>
        </Router>
      </main>
    </div>
  );
};

export default App;
