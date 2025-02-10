import React, { useState, useEffect } from 'react';
import api from '../api';

import './container.css';

const Container = () => {
  const [events, setEvents] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState(''); // New state for password
  const [user, setUser] = useState(null);
  const [err, setError] = useState('');

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data);
      // console.log(response.data);
    } catch (error) {
      console.error('Error fetching events', error);
    }
  };

  const logIn = async (userName, password) => { // Updated to include password
    const Userlogin={username:userName , password:password}
    try {
      const res = await api.post('log_in',  
      Userlogin, // Include password in request
      );
      console.log('this is login');
      console.log(res.data);
      setUser(res.data);
      setIsLoggedIn(true);
      localStorage.setItem('user', JSON.stringify(res.data));
      localStorage.setItem('username', userName); // Store username as a separate item
    } catch (err) {
      console.log(err.response?.data?.detail || err.message);
      setError(err.response?.data?.detail || err.message);
    }
  };

  const logOut = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('user'); // Clear user data
  };



  const Vote = async (eventId, eventName) => {
    try {
      const res = await api.post(`/events/${eventId}/vote`, null, {
        params: { user_id: user.user_id },
      });
      setUser((prevUser) => {
        const updatedUser = {
          ...prevUser,
          user_events: [...prevUser.user_events, eventName],
        };
  
        // Save the updated user to localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      });
      console.log('Vote successful:', res.data);
      
    } catch (err) {
      console.error('Error voting:', err.response?.data?.detail || err.message);
    }
  };

  const handelLogIn = (e) => {
    e.preventDefault();
    logIn(userName, password); // Updated to include password
  };

  useEffect(()=>{
fetchEvents();
console.log(user)
  },[user])

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedUsername = localStorage.getItem('username'); // Retrieve username
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
    if (storedUsername) {
      setUserName(storedUsername); // Update username state
    }
    fetchEvents();
  }, []);
  

  return (
    <>
      {user ? <h1>Welcome {userName}</h1> : ''}
      {isLoggedIn ? (
        <div className="container">
          {events.map((event) => (
            <div key={event.id} className="container_head">
              <h2>{event.name}</h2>
              <p>{event.total_points}</p>
              <button
                className={`${
                  user.user_events.includes(event.name) ? 'active' : ''
                }`}
                disabled={user?.user_events?.includes(event.name)}
                onClick={() => Vote(event.id, event.name)}
              >
                {user.user_events.includes(event.name) ? 'Voted' : 'Vote'}
              </button>
            </div>
          ))}
          <button onClick={logOut} className="logout">
            Log out
          </button>
        </div>
      ) : (
        <form onSubmit={handelLogIn}>
          <input
            type="text"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            placeholder="Enter username"
          />
          <input
            type="password" // New password input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Enter password"
          />
          <button type="submit">Log In</button>
          {err ? <h1>{err}</h1> : ''}
        </form>
      )}
    </>
  );
};

export default Container;
