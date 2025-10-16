const express = require("express");
const router = express.Router();
const blogController = require("../../controller/client/blog.controller");

// Blog page route
router.get("/", blogController.index);

module.exports = router;
