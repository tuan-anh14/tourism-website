const express = require('express')
const route = express.Router()

const homeController = require("../../controller/client/home.controller") 

route.get('/', homeController.index)
route.get('/events', homeController.events)
route.get('/attraction', homeController.attractions)
route.get('/accommodation', homeController.accommodation)
route.get('/cuisine', homeController.cuisine)
route.get('/transportation', homeController.transportation)
route.get('/entertainment', homeController.entertainment)

module.exports = route; 