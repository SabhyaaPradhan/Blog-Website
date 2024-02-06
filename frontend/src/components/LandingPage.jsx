import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';

const LandingPage = () => {
  return (
    <div>
      <nav style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#acc8e0', padding: '10px' }}>
        <Link to="/">Home</Link>
        <div>
          <Link to="/login">Login</Link>
        </div>
        <div>
          <Link to="/register">Register</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
      </Routes>
      <h1>Welcome to BlogBursts</h1>
      <p>Welcome to BlogBursts, where words come alive and ideas take flight!
        Dive into a world of captivating narratives, insightful perspectives, and thought-provoking discussions.</p>
      <p>Our blog is a vibrant tapestry of diverse topics, from the latest trends in technology and science to the intricacies of art and culture.
        We strive to be your go-to destination for informative and entertaining content, providing a unique blend of expertise and relatability.
        Whether you're a tech enthusiast, a culture connoisseur, or simply seeking inspiration, our blog is crafted to engage, enlighten, and entertain. </p>
      <p>Join us on a journey of exploration and discovery, where every post is a doorway to new ideas and perspectives.
        Welcome to the intersection of knowledge and creativity; welcome to BlogBursts!</p>
    </div>
  );
};

export default LandingPage;
