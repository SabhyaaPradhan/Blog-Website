import React, { useState, useEffect, useRef } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom';
import Blog from './components/Blog';
import Notification from './components/Notification';
import Footer from './components/Footer';
import Togglable from './components/Togglable';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import blogService from './services/blog';
import loginService from './services/login';
import SingleBlog from './components/SingleBlog';

function Home({ blogs, showAll, toggleLikeOf, handleDelete }) {
  const sortedBlogsToShow = showAll
    ? blogs
    : blogs.filter((blog) => blog.likes > 0);

  return (
    <div>
      <h1>Blog Website</h1>
      <ul>
        {sortedBlogsToShow.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            toggleLike={() => toggleLikeOf(blog.id)}
            handleDelete={() => handleDelete(blog.id)}
          />
        ))}
      </ul>
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
      <p>This is the about page of your application.</p>
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

  useEffect(() => {
    blogService.getAll().then((initialBlogs) => {
      setBlogs(initialBlogs);
    });
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

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility();
    blogService
      .create(blogObject)
      .then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog));
        setNotification(`Blog "${returnedBlog.title}" created successfully!`);
        setTimeout(() => {
          setNotification(null);
        }, 5000);
        navigate(`/blogs/${returnedBlog.id}`);
      })
      .catch((error) => {
        setErrorMessage(`Error creating the blog: ${error.message}`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(user)
      );
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setErrorMessage('Wrong credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
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
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/create">Create</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>

        {notification && <Notification message={notification} />}
        {!user && loginForm()}
        {user && (
          <div>
            <p>{user.username} logged in</p>
          </div>
        )}

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
          <Route path="/blogs/:id" element={<SingleBlog />} />
        </Routes>

        <Notification message={errorMessage} />
        <div>
        {blogForm()}
          <button onClick={() => setShowAll(!showAll)}>
            Show {showAll ? 'liked' : 'all'} blogs
          </button>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;