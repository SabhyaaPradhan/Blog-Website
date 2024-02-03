import React, { useState } from 'react';
import userService from '../services/user';

const RegistrationForm = ({ handleRegistration }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      const newUser = await userService.register({ username, password });
      handleRegistration(newUser);
    } catch (error) {
      console.error('Registration error:', error.message);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Sign up</button>
    </form>
  );
};

export default RegistrationForm;
