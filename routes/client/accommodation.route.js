const express = require('express')
const route = express.Router()

const accommodationController = require("../../controller/client/accommodation.controller") 

route.get('/accommodation', accommodationController.accommodation)
module.exports = route; 