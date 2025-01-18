import React, { useState } from 'react';

const AddFruitForm = ({ addFruit }) => {
  const [fruitName, setFruitName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState(''); // New state for password

  const handleSubmit = (e) => {
    e.preventDefault();
    addFruit(fruitName, isAdmin, password);
    setFruitName('');
    setIsAdmin(false);
    setPassword(''); // Clear password input after submitting
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={fruitName}
        onChange={(e) => setFruitName(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="checkbox"
        checked={isAdmin}
        onChange={(e) => setIsAdmin(e.target.checked)}
      />
      <label>Admin</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Add User</button>
    </form>
  );
};

export default AddFruitForm;
