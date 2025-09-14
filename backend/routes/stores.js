const express = require("express");
const Store = require("../models/Store");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Create new store
router.post("/", authenticateToken, (req, res) => {
  const storeData = { ...req.body, owner_id: req.user.id }; // owner is logged in user
  Store.create(storeData, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Store created successfully", results });
  });
});

// Get all stores
router.get("/", (req, res) => {
  Store.findAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;
