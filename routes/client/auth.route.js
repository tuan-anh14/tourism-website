const express = require('express')
const route = express.Router()

const controller = require("../../controller/client/auth.controller")
const validate = require("../../validates/auth.validate")
const authMiddleware = require("../../middleware/auth")

route.get('/register', controller.register)

route.post('/register', validate.registerPost, controller.registerPost)

route.get('/login', controller.login)

route.post('/login', validate.loginPost, controller.loginPost)

route.get('/logout', controller.logout)

route.get('/password/forgot', controller.forgotPassword)

route.post('/password/forgot', validate.forgotPasswordPost, controller.forgotPasswordPost)

route.get('/password/otp', controller.otpPassword)

route.post('/password/otp', controller.otpPasswordPost)

route.get('/password/reset', controller.resetPassword)

route.post('/password/reset', validate.resetPasswordPost, controller.resetPasswordPost)

route.get('/info', authMiddleware.requireAuth, controller.info)

module.exports = route;
