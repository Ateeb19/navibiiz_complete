const express = require('express');
const Routers = express.Router();
const AuthenticateToken = require('../Middleware/Authenticate.js');
const { Register, login, update_user_name, update_user_password, display_profile, token_check, Send_message, payment_history, reset_password, froget_password, total_number_orders } = require('../Controllers/User_controller.js');


Routers.route('/check_token').get(AuthenticateToken,token_check);
Routers.route('/regester').post(Register);
Routers.route('/login').post(login);
Routers.route('/display_profile').get(AuthenticateToken, display_profile);
Routers.route('/update_name').put(AuthenticateToken, update_user_name);
Routers.route('/update_password').put(AuthenticateToken, update_user_password);
Routers.route('/send_message').post(Send_message);
Routers.route('/payment_history').get(AuthenticateToken, payment_history);
Routers.route('/forget_password').post(froget_password);
Routers.route('/reset_password/:token').post(reset_password);
Routers.route('/total_orders_number').get(AuthenticateToken, total_number_orders);

module.exports = Routers;



