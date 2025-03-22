import React, { useState } from "react";
import api from "../../api";

const AddEvent = () => {
  const [eventName, setEventName] = useState("");
  const [message, setMessage] = useState(""); 

  const createEventHandler = async (e) => {
    e.preventDefault();
    try {
      await api.post("/event/", {
        name: eventName  
      });
            setMessage("Event created successfully!");
      setEventName(""); 
    } catch (error) {
      setMessage("Failed to create event. Please try again.");
      console.error("Error creating event:", error);
    }
  };
  

  return (
    <div>
      <form className="app__users__form" onSubmit={createEventHandler}>
        <div>
          <label htmlFor="eventname">Event Name</label>
          <input
            value={eventName}
            id="eventname"
            type="text"
            required
            onChange={(e) => setEventName(e.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>} 
    </div>
  );
};

export default AddEvent;
