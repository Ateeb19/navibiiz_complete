const express = require('express');
const Routers = express.Router();
const AuthenticateToken = require('../Middleware/Authenticate.js');
const {  send_transport_display, send_groupage_submit } = require('../Controllers/Send_Groupage_controller.js');


Routers.route('/send_transport_display').get(AuthenticateToken, send_transport_display);
Routers.route('/send_groupage_submit').post(AuthenticateToken, send_groupage_submit);


module.exports = Routers;