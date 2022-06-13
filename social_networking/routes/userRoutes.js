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
route.get('/edit_post',controller.editPost);
route.get('/getposts',services.getPosts);
route.get('/getUserposts/:email',services.getUserPosts);
route.post('/update_post',controller.updatePost);

route.post('/verify_user',services.verifyUser);

route.post('/createpost', services.postRoute);
route.post('/password_reset', services.forgotPassword);
route.get('/password_reset_page/:email', services.passwordReset);
route.get('/api/user/:id',controller.findUser)
route.get('/connectionDetails', controller.getConnectionDetails);
route.get('/getusers', controller.getUsers);


module.exports = route;