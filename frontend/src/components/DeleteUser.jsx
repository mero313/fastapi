import { useState } from "react";

const DeleteUser = ({ DeleteUser }) => {
  const [id, setId] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (id) {
      DeleteUser(id);
      setId(""); // Reset the input field after submission
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Enter user id"
        />
        <button type="submit">Delete User</button>
      </form>
    </div>
  );
};

export default DeleteUser;