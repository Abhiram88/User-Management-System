const express = require('express');
const route = express.Router();
const services = require('./renderRoutes');
const controller = require('./controller');

route.get('/', services.homeRoute)
route.post('/login', services.loginRoute)
route.post('/signup', services.signupRoute)
route.get('/allusers', services.getUsers)


route.get('/api/user/:id', controller.findUser)

module.exports = route;