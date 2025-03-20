const express = require('express');
const Routers = express.Router();
const AuthenticateToken = require('../Middleware/Authenticate.js');
const { admin_notificaiton, Sadmin_notificaiton, user_notification } = require('../Controllers/Notification_controller.js');

Routers.route('/admin_notification').get(AuthenticateToken, admin_notificaiton);
Routers.route('/SuperAdmin_notification').get(AuthenticateToken, Sadmin_notificaiton);
Routers. route('/user_notification').get(AuthenticateToken, user_notification);

module.exports = Routers;
