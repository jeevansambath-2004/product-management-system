const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/user'); // Replace Food with Item model
const Item = require('./models/item');

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// PORT
const PORT = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect(process.env.uri).then(() => {
  console.log("Connected to the database");
})
.catch((err) => {
  console.log("Cannot connect to the database", err);
  process.exit();
});

// Register API
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.json({ message: "User Registered Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed", details: error });
  }
});

// Login API
app.post('/api/login', async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "A token is required for authentication" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid Token" });
    }
    req.userId = decoded.userId;
    next();
  });
};

// Add Item to Inventory
app.post('/api/items', verifyToken, async (req, res) => {
  try {
    const { name, quantity, price } = req.body;

    const item = new Item({
      name,
      quantity,
      price,
      user: req.userId
    });

    await item.save();
    res.json({ message: "Item added successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Items
app.get('/api/items', verifyToken, async (req, res) => {
  try {
    const items = await Item.find({ user: req.userId });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Item
app.put('/api/items/:id', verifyToken, async (req, res) => {
  try {
    const { name, quantity, price } = req.body;
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { name, quantity, price },
      { new: true }
    );
    res.json({ message: "Item updated successfully", item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Item
app.delete('/api/items/:id', verifyToken, async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
