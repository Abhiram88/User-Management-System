const express = require('express');
const route = express.Router();
const services = require('../services/render')
const controller = require('../controller/controller')

// GET
route.get('/', services.homeRoute)
route.post('/login', services.loginRoute)
route.post('/signup', services.signupRoute)


//API
route.get('/api/users', controller.users)
route.get('/api/users/:id', controller.findUser)
route.delete('/api/users/:id', controller.deleteUser)

module.exports = route;