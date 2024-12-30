import React from 'react';
import './App.css';
import FruitList from './components/Fruits';
import Events from "./components/Events"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
              <a href="/event">event</a>
            </li>
          </ul>
        </nav>
        <Router>
          <Routes>
            <Route path="/" element={<>
              <h1>Fruit Management App</h1>
              <FruitList />
              </>
              } />
            <Route path="/event" element={<Events/>} />
          </Routes>
        </Router>
      </main>
    </div>
  );
};

export default App;