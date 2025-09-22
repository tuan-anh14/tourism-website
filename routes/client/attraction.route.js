const express = require('express')
const route = express.Router()

const attractionController = require("../../controller/client/attraction.controller") 

route.get('/', attractionController.attractions)
module.exports = route; 