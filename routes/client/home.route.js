const express = require('express')
const route = express.Router()

const homeController = require("../../controller/client/home.controller") 

route.get('/', homeController.index)
route.get('/events', homeController.events)

module.exports = route; 