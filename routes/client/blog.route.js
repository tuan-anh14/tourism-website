const express = require("express");
const router = express.Router();
const blogController = require("../../controller/client/blog.controller");

// Blog page route
router.get("/", blogController.index);

// New SEO articles
router.get("/bai-1", blogController.articleOne);
router.get("/bai-2", blogController.articleTwo);
router.get("/bai-3", blogController.articleThree);

module.exports = router;
