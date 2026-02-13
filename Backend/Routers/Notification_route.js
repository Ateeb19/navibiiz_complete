const express = require('express');
const Routers = express.Router();
const AuthenticateToken = require('../Middleware/Authenticate.js');
const { admin_notificaiton, Sadmin_notificaiton, user_notification, notification_bell, user_read_notificaiton } = require('../Controllers/Notification_controller.js');

Routers.route('/admin_notification').get(AuthenticateToken, admin_notificaiton);
Routers.route('/SuperAdmin_notification').get(AuthenticateToken, Sadmin_notificaiton);
Routers. route('/user_notification').get(AuthenticateToken, user_notification);
Routers. route('/notification_bell').get(AuthenticateToken, notification_bell);
Routers. route('/user_read_notificaiton').get(AuthenticateToken, user_read_notificaiton);

module.exports = Routers;
