const express = require('express');
const Routers = express.Router();
const AuthenticateToken = require('../Middleware/Authenticate.js');
const { Register, login, update_user_name, update_user_password, display_profile, token_check, Send_message } = require('../Controllers/User_controller.js');


Routers.route('/check_token').get(AuthenticateToken,token_check);
Routers.route('/regester').post(Register);
Routers.route('/login').post(login);
Routers.route('/display_profile').get(AuthenticateToken, display_profile);
Routers.route('/update_name').put(AuthenticateToken, update_user_name);
Routers.route('/update_password').put(AuthenticateToken, update_user_password);
Routers.route('/send_message').post(Send_message);


module.exports = Routers;



