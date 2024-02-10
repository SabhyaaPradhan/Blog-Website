import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Container, Nav, Navbar } from 'react-bootstrap'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  useParams
} from 'react-router-dom';
import Blog from './components/Blog';
import WelcomeSlideshow from './components/WelcomeSlideshow';
import Notification from './components/Notification';
import Footer from './components/Footer';
import Togglable from './components/Togglable';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import blogService from './services/blog';
import loginService from './services/login';
import SingleBlog from './components/SingleBlog';
import LikeButton from './services/LikeButton';
import RegistrationForm from './components/RegistrationForm';
import Users from './components/Users'
import BlogList from './components/BlogList';

function Home({ showAll, toggleLikeOf, handleDelete }) {
  const [blogs, setBlogs] = useState([]);
  const handleEdit = (editedTitle, editedContent) => {
    console.log("Edited Title:", editedTitle);
    console.log("Edited Content:", editedContent);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogs = await blogService.getAll();
        setBlogs(Array.isArray(blogs) ? blogs : []);
      } catch (error) {
        console.error('Error fetching blogs:', error.message);
        setBlogs([]);
      }
    };

    fetchData();
  }, [showAll]);

  const sortedBlogsToShow = showAll
    ? blogs
    : blogs.filter((blog) => blog.likes > 0);

  return (
    <div>
      <WelcomeSlideshow />
      <h2>Stay Curious.</h2>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {sortedBlogsToShow.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            toggleLike={() => toggleLikeOf(blog.id)}
            handleDelete={() => handleDelete(blog.id)}
            handleEdit={() => handleEdit(blog.id)}
          />
        ))}
      </div>
    </div>
  );
}


function Create() {
  return (
    <div>
      <h2>Create Blog</h2>
      <h5>Get started with your blogs</h5>
    </div>
  );
}

function About() {
  return (
    <div>
      <h2>About</h2>
      <p>Welcome to BlogBursts – a digital space where curiosity meets creativity!</p>
      <p> Founded with a passion for sharing engaging and informative content, our blog is a labor of love dedicated to exploring a wide array of topics. From the latest trends to timeless insights, we aim to offer a little something for everyone. Whether you're here to learn, be entertained, or simply unwind, we invite you to join our community of readers.</p>
      <p> At BlogBursts, we believe that knowledge should be accessible, enjoyable, and shared. Our team of writers is committed to delivering content that sparks curiosity and fosters a sense of connection. Thank you for being a part of our journey. Here, every click, scroll, and share is an opportunity to celebrate the joy of learning and the beauty of diverse perspectives. Welcome to our space – we're thrilled to have you here!</p>
    </div>
  );
}

function App() {
  const [blogs, setBlogs] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [loginVisible, setLoginVisible] = useState(false);
  const [registrationVisible, setRegistrationVisible] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const currentRoute = location.pathname;
  const { id: userId} = useParams()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogs = await blogService.getAll();
        setBlogs(Array.isArray(blogs) ? blogs : []);
      } catch (error) {
        console.error('Error fetching blogs:', error.message);
        setBlogs([]);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const blogFormRef = useRef();

  const toggleLikeOf = async (id) => {
    try {
      const blog = blogs.find((b) => b.id === id);
      const changedBlog = { ...blog, likes: blog.likes + 1 };

      const returnedBlog = await blogService.update(id, changedBlog);

      setBlogs(blogs.map((blog) => (blog.id !== id ? blog : returnedBlog)));
    } catch (error) {
      console.error('Toggle Like error:', error.message);
      setErrorMessage('Error updating like count');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleDelete = (id) => {
    const blog = blogs.find((b) => b.id === id);
    const confirmDeletion = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`
    );

    if (confirmDeletion) {
      blogService
        .remove(id)
        .then(() => {
          setBlogs(blogs.filter((b) => b.id !== id));
        })
        .catch((error) => {
          setErrorMessage(`Error deleting the blog: ${error.message}`);
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        });
    }
  };

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject);

      console.log('Returned Blog:', returnedBlog);

      if (!returnedBlog || !returnedBlog.title) {
        throw new Error('Invalid blog data received');
      }

      setBlogs([...blogs, returnedBlog]);
      setNotification(`Blog "${returnedBlog.title}" created successfully!`);
      setTimeout(() => {
        setNotification(null);
      }, 5000);
      navigate(`/blogs/${returnedBlog.id}`);
    } catch (error) {
      console.error('Add Blog error:', error.message);
      setErrorMessage(`Error creating the blog: ${error.message}`);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
      setIsLoggedIn(true);
      setLoginVisible(false);
    } catch (exception) {
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleRegistration = (newUser) => {
    setNotification(`User "${newUser.username}" registered successfully!`);
    setTimeout(() => {
      setNotification(null);
    }, 5000);
    console.log('Registration data:', newUser);
    setRegistrationVisible(false);
    navigate('/');
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
  };

  const loginForm = () => {
    return (
      <div>
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
        <a>
        <Button onClick={() => setLoginVisible(false)} variant="outline-danger" type="button">
          Cancel
        </Button>
        </a>
      </div>
    );
  };

  const registrationForm = () => {
    return (
      <div>
        <RegistrationForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleRegistration={handleRegistration}
        />
        <Button onClick={() => setRegistrationVisible(false)} variant="outline-danger" type="button">
          Cancel
        </Button>
      </div>
    );
  };

  const blogForm = () => (
    <Togglable buttonLabel="Add Blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} currentRoute={currentRoute} />
    </Togglable>
  );

  return (
    <div style={{ textAlign: 'center' }}>
      {user ? (
        <>
          <Navbar bg="light" data-bs-theme="light" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '10px' }}>
            <Container>
              <Navbar.Brand href="/"><img
                alt=""
                src="Logo1.png"
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{' '}
                BlogBursts</Navbar.Brand>
              <Nav className="me-auto">
                <Nav.Link href="/" to="/">Home</Nav.Link>
                <Nav.Link href="/create" to="/create">Create</Nav.Link>
                <Nav.Link href="/users" to="/users">Users</Nav.Link>
                <Nav.Link href="/about" to="/about">About</Nav.Link>
                <Button variant="outline-danger" type="submit" onClick={handleLogout}>
                  Logout
                </Button>
              </Nav>
              <div style={{ color: 'black', display: 'flex', justifyContent: 'space-around', alignContent: 'center', alignItems: 'center' }}>
                <p>{user.username} logged in</p>
              </div>
            </Container>
          </Navbar>
          <h1>BlogBursts</h1>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  blogs={blogs}
                  showAll={showAll}
                  toggleLikeOf={toggleLikeOf}
                  handleDelete={handleDelete}
                />
              }
            />
            <Route path="/create" element={<Create />} />
            <Route path="/users" element={<Users />} />
            <Route path="/about" element={<About />} />
            <Route path="/blogs/:id" element={<SingleBlog />} />
            <Route path="/blogs/:id" element={<BlogList userId={userId}/>} />
          </Routes>
          <Notification message={errorMessage} />
          <div>
            {blogForm()}
            <Form>
              <Button onClick={() => setShowAll(!showAll)} variant="secondary" type="button">
                Show {showAll ? 'liked' : 'all'} blogs
              </Button>
            </Form>
          </div>
          <Footer />
        </>
      ) : (
        <Routes>
          <Route
            path="/*"
            element={
              <>
                <Navbar bg="light" data-bs-theme="light" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '10px' }}>
                  <Container>
                    <Navbar.Brand href="/">
                    <img
                       alt=""
                        src="Logo1.png"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                      />{' '}
                      BlogBursts</Navbar.Brand>
                    <Nav className="me-auto">
                      <Nav.Link href="/" to="/">Home</Nav.Link>
                      <Nav.Link href="/login">Login</Nav.Link>
                      <Nav.Link href="/register">Register</Nav.Link>
                    </Nav>
                  </Container>
                </Navbar>
                <h1> Welcome to BlogBursts</h1>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route
                    path="/login"
                    element={loginForm()}
                  />
                  <Route
                    path="/register"
                    element={registrationForm()}
                  />
                </Routes>
                <p>Welcome to BlogBursts, where words come alive and ideas take flight!
                  Dive into a world of captivating narratives, insightful perspectives, and thought-provoking discussions.</p>
                <p>Our blog is a vibrant tapestry of diverse topics, from the latest trends in technology and science to the intricacies of art and culture.
                  We strive to be your go-to destination for informative and entertaining content, providing a unique blend of expertise and relatability.
                  Whether you're a tech enthusiast, a culture connoisseur, or simply seeking inspiration, our blog is crafted to engage, enlighten, and entertain. </p>
                <p>Join us on a journey of exploration and discovery, where every post is a doorway to new ideas and perspectives.
                  Welcome to the intersection of knowledge and creativity; welcome to BlogBursts!</p>
                <Footer />
              </>
            }
          />
        </Routes>
      )}
    </div>
  );
}

export default App