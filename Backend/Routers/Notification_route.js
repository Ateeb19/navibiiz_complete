const express = require('express');
const Routers = express.Router();
const AuthenticateToken = require('../Middleware/Authenticate.js');
const { admin_notificaiton, Sadmin_notificaiton } = require('../Controllers/Notification_controller.js');

Routers.route('/admin_notification').get(AuthenticateToken, admin_notificaiton);
Routers.route('/SuperAdmin_notification').get(AuthenticateToken, Sadmin_notificaiton);


module.exports = Routers;
