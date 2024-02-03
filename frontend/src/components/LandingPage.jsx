import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';

const LandingPage = ({ handleLogin, handleRegistration }) => {
  return (
    <div>
      <h1>Welcome to Blog Website</h1>
      <div>
        <h2>Login</h2>
        <LoginForm handleSubmit={handleLogin} />
      </div>
      <div>
        <h2>Register</h2>
        <RegistrationForm handleRegistration={handleRegistration} />
      </div>
      <p>
        Already have an account? <Link to="/login">Login here</Link>.
      </p>
    </div>
  );
};

export default LandingPage;
