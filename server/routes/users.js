const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const auth = require("../middleware/auth")
const bcrypt = require("bcryptjs")

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Check if user already exists
    let user = await User.findOne({ email })

    if (user) {
      return res.status(400).json({ message: "User already exists with this email" })
    }

    // Check if username is taken
    user = await User.findOne({ username })

    if (user) {
      return res.status(400).json({ message: "Username is already taken" })
    }

    // Create new user
    user = new User({
      username,
      email,
      password,
    })

    await user.save()

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    })
  } catch (err) {
    console.error("Error registering user:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    })
  } catch (err) {
    console.error("Error logging in user:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
  } catch (err) {
    console.error("Error fetching user:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Update user profile
router.put("/:id", auth, async (req, res) => {
  try {
    // Check if user is updating their own profile
    if (req.params.id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this profile" })
    }

    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const { username } = req.body

    // Check if username is taken
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username })

      if (existingUser) {
        return res.status(400).json({ message: "Username is already taken" })
      }

      user.username = username
    }

    await user.save()

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    })
  } catch (err) {
    console.error("Error updating user:", err)
    res.status(500).json({ message: "Server error" })
  }
})

// Change password
router.post("/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword)

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.json({ message: "Password updated successfully" })
  } catch (err) {
    console.error("Error changing password:", err)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
