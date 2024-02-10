const baseUrl = '/api/blogs';

const getAll = async () => {
  const response = await fetch(baseUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch blogs');
  }
  return response.json();
};

const create = async (newBlog, token) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(newBlog),
  };

  const response = await fetch(baseUrl, requestOptions);
  if (!response.ok) {
    throw new Error('Failed to create blog');
  }
  return response.json();
};

const update = async (id, updatedBlog, token) => {
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedBlog),
  };

  const response = await fetch(`${baseUrl}/${id}`, requestOptions);
  if (!response.ok) {
    throw new Error('Failed to update blog');
  }
  return response.json();
};

const remove = async (id, token) => {
  const requestOptions = {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(`${baseUrl}/${id}`, requestOptions);
  if (!response.ok) {
    throw new Error('Failed to delete blog');
  }
};

const getBlogsByUser = async (userId) => {
  const response = await fetch(`${baseUrl}/user/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user-specific blogs');
  }
  return response.json();
};

const likeBlog = async (blogId) => {
  try {
    const response = await fetch(`${baseUrl}/${blogId}/like`, { method: 'PUT' });
    if (!response.ok) {
      throw new Error('Failed to like blog');
    }
  } catch (error) {
    throw new Error(`Error liking blog: ${error.message}`);
  }
};

const getSingleBlog = async (blogId) => {
  const response = await fetch(`${baseUrl}/${blogId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch blog details');
  }
  return response.json();
};

export default {
  getAll,
  create,
  update,
  remove,
  getBlogsByUser,
  likeBlog,
  getSingleBlog,
};
