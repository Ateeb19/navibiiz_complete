const express = require('express');
const Routers = express.Router();
const AuthenticateToken = require('../Middleware/Authenticate.js');
const {
    // create_order_route,
     capture_order_route,
      create_order_api,
       send_information
    } = require('../Controllers/Paypal_controller.js')

Routers.route('/api/orders').post(create_order_api);
Routers.route('/api/orders/:orderID/capture').post(capture_order_route);
// Routers.route('/create-order', create_order_api);
Routers.route('/api/save_transaction').post(send_information);

module.exports = Routers;
