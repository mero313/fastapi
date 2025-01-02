import { useState } from "react";
import api from "../api";



const CreateEvent = () => {
    const [eventName, setEventName] = useState("");
    const [isCreated, setIsCreated] = useState(false);
    
    const addEvent = async (eventName) => {
        try {
          await api.post('/event', { name: eventName });

          setEventName("")
          setIsCreated(true)

        } catch (error) {
          console.error("Error adding event", error);
        }
      };

    return (
        <div>
            <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="Event Name" 
            />
            {/* <h1>{userName}</h1> */}
            <button onClick={() => addEvent(eventName)}>Add Event</button>
            {
                isCreated && <p>Event created successfully!</p>
            }
          </div>)
    
}

export default CreateEvent;