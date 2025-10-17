const express = require("express");
const router = express.Router();
const blogController = require("../../controller/client/blog.controller");

// Blog page route
router.get("/", blogController.index);

// Blog detail: Old Quarter - 36 streets
router.get("/pho-co-ha-noi-36-pho-phuong", blogController.detailOldQuarter);

module.exports = router;
