const express = require('express');
const route = express.Router();
const services = require('./renderRoutes');
const controller = require('./controller');


route.get('/', services.homeRoute);
route.get('/signin', services.signInRoute);
route.post('/login', services.loginRoute);
route.post('/signup', services.signupRoute);
route.get('/allusers', services.getUsers);
route.post('/post', services.postRoute);
route.post('/password_reset', services.forgotPassword);
route.get('/password_reset_page/:email', services.passwordReset);
route.get('/api/user/:id',controller.findUser)
route.get('/connectionDetails', controller.getConnectionDetails);
route.get('/getusers', controller.getUsers);


module.exports =  route;