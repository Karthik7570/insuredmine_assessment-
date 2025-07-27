const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {User, Policy} = require('../models/modelschema');      
const connectDB = require('../mangodbconnect');

// GET /api/policies/by-username?username=john_doe
router.get('/policies/by-username', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    await connectDB();
    // Step 1: Find the user by username
    const user = await User.findOne({ firstName: username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    console.log("userId", user)
    // Step 2: Find policies linked to that user
    const policies = await Policy.find({ userId: user._id })
      .populate('categoryId', 'categoryName') 
      .populate('carrierId', 'companyName'); 
        // Include Carrier info

    await mongoose.disconnect();
    return res.status(200).json({ user: user.username, policies });

  } catch (err) {
    console.error('Error fetching policies by username:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;