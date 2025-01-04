import React, { useState } from 'react';

const AddFruitForm = ({ addFruit }) => {
  const [fruitName, setFruitName] = useState('');
  const [isAdmin,setIsAdmin]=useState(false)

  const handleSubmit = (event) => {
    event.preventDefault();
    if (fruitName) {
      addFruit(fruitName,isAdmin);
      setFruitName('');
    }
  };

  const handleCheckboxChange = (event) => {
    setIsAdmin(event.target.checked);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={fruitName}
        onChange={(e) => setFruitName(e.target.value)}
        placeholder="Enter fruit name"
      />
      <br />
      <label for="checkbox">Is admin</label>
      <input type="checkbox" id='checkbox' onChange={handleCheckboxChange} />
      <br />
      <button type="submit">Add Fruit</button>
    </form>
  );
};

export default AddFruitForm;