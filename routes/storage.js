const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");
const itemController = require("../controllers/itemController");
const manufacturerController = require("../controllers/manufacturerController");

// Get home page
router.get("/", itemController.index);

module.exports = router;