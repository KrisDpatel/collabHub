const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads"); // ✅ make sure this matches your folder name
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // 🕒 avoid filename conflicts
  },
});

const upload = multer({ storage });

// Signup Route
router.post('/signup',upload.single('photo'), async (req, res) => {
  const { username, email, password, institute, department, mobile,er_no, city, role, semester } = req.body;
  console.log('Received data:', req.body);  // Log incoming data

  const photo = req.file.filename;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      institute,
      department,
      mobile,
      er_no,
      city,
      role,
      semester,
      photo: photo  // Assign default photo if not provided
    });

    // Save user to the database
    await newUser.save();

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

//login route
// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }

    // if (existingUser.password !== password) {
    //   return res.status(401).json({ message: "Invalid credentials" });
    // }
    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ 
      message: "Login successful",
    username: existingUser.username,
    photo: existingUser.photo,  // assuming this stores the filename like "myphoto.jpg"
    role: existingUser.role     // if you want to show role-based UI
   });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
