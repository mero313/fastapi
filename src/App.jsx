import React from 'react';
import './App.css';
import FruitList from './components/Fruits';
import Container from './components/Container';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateEvent from './components/CreateEvent';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
       
      </header>
      <main>
        <nav>
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
        </nav>
        <Router>
          <Routes>
            <Route path="/" element={<>
              <h1>Events Management App</h1>
              <FruitList />
              </>
              } />
            <Route path="/events" element={<Container/>  } />
            <Route path="/create_event" element= { <CreateEvent/>}/>
          </Routes>
        </Router>
      </main>
    </div>
  );
};

export default App;

// import React, { useState } from 'react';
// import VotingPage from './components/VotingPage';

// const App = () => {
//   const [user, setUser] = useState({ id: 2, isAdmin: true }); // Example user

//   return (
//     <div className="App">
//       <h1>Welcome, {user.isAdmin ? 'Admin' : 'User'}</h1>
//       <VotingPage userId={user.id} />
//     </div>
//   );
// };

// export default App;
