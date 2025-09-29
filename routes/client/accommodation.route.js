const express = require('express')
const route = express.Router()

const accommodationController = require("../../controller/client/accommodation.controller") 

route.get('/', accommodationController.accommodation)
route.get('/:slug', accommodationController.accommodationDetail)
module.exports = route; 