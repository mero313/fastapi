import { useState } from "react";

const DeleteUser = ({ DeleteUser }) => {
  const [userName, setUserName] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (userName) {
      DeleteUser(userName);
      setUserName(""); // Reset the input field after submission
    }
  };

  return (
    <div style={{marginTop:"1rem"}}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter username"
          style={{marginRight:"0.5rem"}}
        />
        <button type="submit">Delete User</button>
      </form>
    </div>
  );
};

export default DeleteUser;