const express = require('express')
const route = express.Router()

const entertainmentController = require("../../controller/client/entertainment.controller")
const { optionalAuth } = require("../../middleware/auth")

route.get('/', optionalAuth, entertainmentController.entertainment)
route.get('/:id', optionalAuth, entertainmentController.detail)
module.exports = route; 