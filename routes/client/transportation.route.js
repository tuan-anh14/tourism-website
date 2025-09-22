const express = require('express')
const route = express.Router()

const transportationController = require("../../controller/client/transportation.controller") 

route.get('/transportation', transportationController.index)
module.exports = route; 