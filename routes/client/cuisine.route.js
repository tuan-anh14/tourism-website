const express = require('express')
const route = express.Router()

const cuisineController = require("../../controller/client/cuisine.controller") 

route.get('/cuisine', cuisineController.index)
module.exports = route; 