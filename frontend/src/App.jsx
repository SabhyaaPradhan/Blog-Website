import React, { useState, useEffect, useRef } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
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
import RegistrationForm from './components/RegistrationForm';

function Home({ showAll, toggleLikeOf, handleDelete }) {
  const [blogs, setBlogs] = useState([]);

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
      <h2>Blogs</h2>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {sortedBlogsToShow.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            toggleLike={() => toggleLikeOf(blog.id)}
            handleDelete={() => handleDelete(blog.id)}
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
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

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

  const toggleLikeOf = (id) => {
    const blog = blogs.find((b) => b.id === id);
    const changedBlog = { ...blog, likes: blog.likes + 1 };

    blogService
      .update(id, changedBlog)
      .then((returnedBlog) => {
        setBlogs(blogs.map((blog) => (blog.id !== id ? blog : returnedBlog)));
        navigate('/');
      })
      .catch((error) => {
        setErrorMessage(
          `Blog '${blog.title}' was already removed from the server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
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
      setErrorMessage('Wrong credentials');
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
    navigate('/');
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
  };

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' };
    const showWhenVisible = { display: loginVisible ? '' : 'none' };

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>Log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>Cancel</button>
        </div>
      </div>
    );
  };

  const blogForm = () => (
    <Togglable buttonLabel="New Blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  );

  return (
    <div style={{ textAlign: 'center' }}>
      {user ? (
        <>
          <nav style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#eee', padding: '10px' }}>
            <Link style={{ textDecoration: 'none' }} to="/">
              Home
            </Link>
            <Link style={{ textDecoration: 'none' }} to="/create">
              Create
            </Link>
            <Link style={{ textDecoration: 'none' }} to="/about">
              About
            </Link>
            <button onClick={handleLogout}>Logout</button>
          </nav>
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
            <Route path="/about" element={<About />} />
            <Route path="blogs/:id" element={<SingleBlog />} />
          </Routes>
          <Notification message={errorMessage} />
          <div>
            {blogForm()}
            <button onClick={() => setShowAll(!showAll)}>
              Show {showAll ? 'liked' : 'all'} blogs
            </button>
          </div>
          <Footer />
        </>
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1> Welcome to Blog Website</h1>
                <p>Welcome to BlogBursts, where words come alive and ideas take flight! 
                  Dive into a world of captivating narratives, insightful perspectives, and thought-provoking discussions.</p>
                <p>Our blog is a vibrant tapestry of diverse topics, from the latest trends in technology and science to the intricacies of art and culture. 
                  We strive to be your go-to destination for informative and entertaining content, providing a unique blend of expertise and relatability. 
                  Whether you're a tech enthusiast, a culture connoisseur, or simply seeking inspiration, our blog is crafted to engage, enlighten, and entertain. </p>
                <p>Join us on a journey of exploration and discovery, where every post is a doorway to new ideas and perspectives. 
                  Welcome to the intersection of knowledge and creativity; welcome to BlogBursts!</p>
                <RegistrationForm
                  handleRegistration={handleRegistration}
                />
                Already have an account?{loginForm()}
              </>
            }
          />
        </Routes>
      )}
    </div>
  );
}

export default App