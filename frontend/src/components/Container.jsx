import React, { useState, useEffect } from 'react';
import api from '../api';

import './container.css';

const Container = () => {
  const [events, setEvents] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState();

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data);
      // console.log(response.data);
    } catch (error) {
      console.error('Error fetching events', error);
    }
  };

  const logIn=async(userName)=>{
    try {
      const res = await api.post("log_in", null, {
        params: { username: userName },
      });
      console.log(`this is login `)
      console.log(res)
      setUserId(res.data.user_id)
      setIsLoggedIn(true)
    } catch (err) {
      console.log(err.response?.data?.detail || err.message);
    }
  };

  const handelLogIn=(userName)=>{
    logIn(userName);
  }
  

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <>
    {
      isLoggedIn ? (<div className="container">
      {events.map((event) => (
        <div key={event.id} className="container_head">
          <h2>{event.name}</h2>
          <p>{event.total_points}</p>
          <button>Vote</button>
        </div>
      ))}
    </div>):(<div>
      <input type="text" value={userName}
      onChange={(e)=>{setUserName(e.target.value)}}
      />
      {/* <h1>{userName}</h1> */}
      <button onClick={()=>handelLogIn(userName)}>Log In</button>
    </div>)
    }
      
    </>
  
  );
};

export default Container;
