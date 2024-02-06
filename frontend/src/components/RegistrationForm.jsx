import React, { useState } from 'react';
import userService from '../services/user';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'

const RegistrationForm = ({ handleRegistration }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setname] = useState('');

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      const newUser = await userService.register({ username, password, name });
      handleRegistration(newUser);
    } catch (error) {
      console.error('Registration error:', error.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
    <Form className='container' onSubmit={handleRegister}>
        <Form.Group className="mb-3" controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="username" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formName">
          <Form.Label>Full name</Form.Label>
          <Form.Control type="username" placeholder="Enter full name" value={name} onChange={(e) => setname(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Form.Group>
        <Button variant="outline-success" type="submit">
          Sign up
        </Button>
    </Form>
    </div>
  );
};

export default RegistrationForm;
