const express = require('express');
const Routers = express.Router();
const AuthenticateToken = require('../Middleware/Authenticate.js');
const { Display_company, Delete_company_admin } = require('../Controllers/Admin_controller.js');

Routers.route('/display_company').get(AuthenticateToken, Display_company);
Routers.route('/delete_compnay/:id').delete(AuthenticateToken, Delete_company_admin);

module.exports = Routers;