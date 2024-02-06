import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button'

function Users() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();

        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error('API response is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching users:', error.message);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = (id) => {
    navigate(`/blogs/${id}`);
  };

  return (
    <div>
      <h2>Users</h2>
      <h5>Check out other Blogs</h5>
      <div>
        {users.map((user) => (
          <div key={user.id} onClick={() => handleUserClick(user.id)} >
            <Button to={`/blogs/${user.id}`} variant='dark' size='lg' className="mt-4 mb-4" >
              {user.username}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Users;
