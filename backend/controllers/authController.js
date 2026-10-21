/**
 * Controller: Authentication & Authorization
 *
 * Provides secure JWT-based authentication:
 * - User registration with full field validation (name, email, password, blood group, DOB, city, phone).
 * - Login with bcrypt password comparison.
 * - Profile retrieval for authenticated sessions.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, bloodGroup, dob, city, phone, lastDonationDate } = req.body;

    if (!name || !email || !password || !bloodGroup || !dob || !city || !phone) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedCity = city.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName || !trimmedCity || !trimmedPhone) {
      return res.status(400).json({ message: 'Name, city, and phone number cannot be blank' });
    }

    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters in length' });
    }

    if (!validBloodGroups.includes(bloodGroup)) {
      return res.status(400).json({ message: `Invalid blood group. Must be one of: ${validBloodGroups.join(', ')}` });
    }

    const parsedDob = new Date(dob);
    if (isNaN(parsedDob.getTime())) {
      return res.status(400).json({ message: 'Invalid date of birth provided' });
    }
    if (parsedDob > new Date()) {
      return res.status(400).json({ message: 'Date of birth cannot be in the future' });
    }

    let parsedLastDonation = null;
    if (lastDonationDate) {
      const parsedDate = new Date(lastDonationDate);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: 'Invalid last donation date provided' });
      }
      if (parsedDate > new Date()) {
        return res.status(400).json({ message: 'Last donation date cannot be in the future' });
      }
      parsedLastDonation = parsedDate;
    }

    const userExists = await User.findOne({ email: trimmedEmail });
    if (userExists) {
      return res.status(400).json({ message: 'A user account already exists with this email address' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: trimmedName,
      email: trimmedEmail,
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'donor',
      bloodGroup,
      dob: parsedDob,
      city: trimmedCity,
      phone: trimmedPhone,
      lastDonationDate: parsedLastDonation,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      bloodGroup: user.bloodGroup,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email address or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email address or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      bloodGroup: user.bloodGroup,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getMe };
