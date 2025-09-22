const express = require('express')
const route = express.Router()

const attractionController = require("../../controller/client/attraction.controller") 

route.get('/attraction', attractionController.index)
module.exports = route; 