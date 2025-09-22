const express = require('express')
const route = express.Router()

const entertainmentController = require("../../controller/client/entertainment.controller") 

route.get('/', entertainmentController.entertainment)
module.exports = route; 