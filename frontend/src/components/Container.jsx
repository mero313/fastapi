import React, { useState, useEffect } from 'react';
import api from '../api';

import './container.css';

const Container = () => {
  const [events, setEvents] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [user, setUser] = useState();
  const [err,setError]=useState()

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
      console.log(res.data)
      setUser(res.data)
      setIsLoggedIn(true)
      // console.log(user)
    } catch (err) {
      console.log(err.response?.data?.detail || err.message);
      setError(err.response?.data?.detail || err.message);
    }
  };

  const Vote = async (eventId,eventName) => {
    // console.log("this is vote",eventId,user.user_id)
    try {
      const res = await api.post(`/events/${eventId}/vote`, null, {
        params: { user_id: user.user_id }, 
      });
      setUser((prevUser) => ({
        ...prevUser,
        user_events: [...prevUser.user_events, eventName],  
      }));
      console.log('Vote successful:', res.data); 
    } catch (err) {
      console.error('Error voting:', err.response?.data?.detail || err.message);
    }
  };
  

  const handelLogIn=(e)=>{
    e.preventDefault();
    logIn(userName);
  }
  

  useEffect(() => {
    fetchEvents();
          console.log(user)

  }, [user]);

  return (
    <>
   {user ?<h1>Welcome {userName}</h1>:""}
    {
      isLoggedIn ? (<div className="container">
      {events.map((event) => (
        <div key={event.id} className="container_head">
          <h2>{event.name}</h2>
          <p>{event.total_points}</p>
          <button className={`${user.user_events.includes(event.name)?"active":""}`}
          disabled={user?.user_events?.includes(event.name)}
          onClick={()=>Vote(event.id,event.name)}
          >{user.user_events.includes(event.name)?"Voted":"vote"}</button>
        </div>
      ))}
    </div>):(<form onSubmit={(e)=>handelLogIn(e)}>
      <input type="text" value={userName}
      onChange={(e)=>{setUserName(e.target.value)}}
      />
      {/* <h1>{userName}</h1> */}
      <button type='submit'>Log In</button>
      {err?(<h1>{err}</h1>):""}
    </form>)
    }
      
    </>
  
  );
};

export default Container;
