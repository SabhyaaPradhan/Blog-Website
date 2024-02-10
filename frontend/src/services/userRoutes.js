const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/:userId/blogs', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate('blogs');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.blogs);
  } catch (error) {
    console.error('Error fetching user-specific blogs:', error);
    res.status(500).json({ message: 'Failed to fetch user-specific blogs' });
  }
});

module.exports = router;
