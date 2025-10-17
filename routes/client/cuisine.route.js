const express = require('express')
const route = express.Router()

const cuisineController = require("../../controller/client/cuisine.controller") 

route.get('/', cuisineController.cuisine)
route.get('/:cuisineSlug/:restaurantSlug', cuisineController.restaurantDetail)
route.get('/:slug', cuisineController.cuisineDetail)
module.exports = route; 