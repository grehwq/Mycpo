const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware to parse JSON and allow frontend-backend connection
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Sample route (to test)
app.get("/", (req, res) => {
  res.send("Hello from backend!");
});
const bcrypt = require("bcryptjs");
const mongooseSchema = mongoose.Schema;

// Define User model
const userSchema = new mongooseSchema({
  username: String,
  password: String,
});
const User = mongoose.model("User", userSchema);

// Sign Up Route
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed });
    await user.save();

    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});
const reviewSchema = new mongoose.Schema({
  username: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
});

const Review = mongoose.model("Review", reviewSchema);

app.post("/review", async (req, res) => {
  console.log("🔵 Incoming review:", req.body);  // Add this line

  const { username, content } = req.body;

  if (!username || !content) {
    return res.status(400).json({ message: "Missing username or content" });
  }

  try {
    const newReview = new Review({ username, content });
    await newReview.save();
    res.status(201).json({ message: "Review saved" });
  } catch (err) {
    console.error("❌ Failed to save review:", err);  // Add this
    res.status(500).json({ error: "Failed to save review" });
  }
});
// Get all reviews
app.get("/reviews", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});




// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


