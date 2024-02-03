import axios from 'axios';

const baseUrl = '/api/users';

const register = async (userData) => {
  try {
    const response = await axios.post('/api/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Registration failed');
  }
};

const userService = {
  register,
};

export default userService;
