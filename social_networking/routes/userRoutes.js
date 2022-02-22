const express = require('express');
const route = express.Router();
const services = require('./renderRoutes');
const controller = require('./controller');


route.get('/', services.homeRoute);
route.get('/signin', services.signInRoute);
route.post('/loggedIn', services.loginRoute);
route.get('/signup', services.signupRoute);
route.post('/newuser', services.newUser);
route.get('/allusers', services.getUsers);
route.get('/userwall', services.userWall);


module.exports = route;