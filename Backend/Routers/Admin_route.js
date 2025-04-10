const express = require('express');
const Routers = express.Router();
const AuthenticateToken = require('../Middleware/Authenticate.js');
const { Display_company, Delete_company_admin, Display_offers, total_offers_sent, total_offer_accepted } = require('../Controllers/Admin_controller.js');

Routers.route('/display_company').get(AuthenticateToken, Display_company);
Routers.route('/display_offer').get(AuthenticateToken, Display_offers);
Routers.route('/delete_compnay/:id').delete(AuthenticateToken, Delete_company_admin);
Routers.route('/total_offers_sent').get(AuthenticateToken, total_offers_sent);
Routers.route('/total_offer_accepted').get(AuthenticateToken, total_offer_accepted);
module.exports = Routers;