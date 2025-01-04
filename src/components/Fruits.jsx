import React, { useEffect, useState } from 'react';
import AddFruitForm from './AddFruitForm';
import api from '../api';
import DelteUser from './DeleteUser';

const FruitList = () => {
  const [fruits, setFruits] = useState([]);

  const fetchFruits = async () => {
    try {
      const response = await api.get('/users/');
      setFruits(response.data);
      // console.log(response.data)
    } catch (error) {
      console.error("Error fetching fruits", error);
    }
  };

  const addFruit = async (fruitName,isAdmin) => {
    try {
      await api.post('/user', { username: fruitName ,is_admin:isAdmin});
      fetchFruits();  // Refresh the list after adding a fruit
    } catch (error) {
      console.error("Error adding fruit", error);
    }
  };

  const DeleteUser = async(username)=>{
    try {
      await api.delete(`/users/${username}`);
      fetchFruits();  // Refresh the list after adding a fruit
    } catch (error) {
      console.error("Error adding fruit", error);
    }
  }

  useEffect(() => {
    fetchFruits();
  }, []);

  return (
    <div>
      <h2>Fruits List</h2>
      <ul>
        {fruits.map((user) => (
          
          <li key={user.username}>{user.username}</li>
        ))}
      </ul>
      <AddFruitForm addFruit={addFruit} />
      <DelteUser DeleteUser={DeleteUser}/>
    </div>
  );
};

export default FruitList;