const express = require("express");
const User = require("../models/User");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// Create new user (admin only)
router.post("/", authenticateToken, authorizeRoles("admin"), (req, res) => {
  User.create(req.body, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User created successfully", results });
  });
});

// Get all users (admin only)
router.get("/", authenticateToken, authorizeRoles("admin"), (req, res) => {
  User.findAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;
