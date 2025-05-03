const express = require('express');
const Routers = express.Router();
const AuthenticateToken = require('../Middleware/Authenticate.js');
const { Display_company, Delete_company_admin, Display_offers, total_offers_sent, total_offer_accepted, edit_company_details, Delete_company_details_country, add_company_country, edit_logo, selected_offer, edit_company_documents, delete_offer } = require('../Controllers/Admin_controller.js');
const { Routes } = require('react-router-dom');

Routers.route('/display_company').get(AuthenticateToken, Display_company);
Routers.route('/display_offer').get(AuthenticateToken, Display_offers);
Routers.route('/delete_compnay/:id').delete(AuthenticateToken, Delete_company_admin);
Routers.route('/total_offers_sent').get(AuthenticateToken, total_offers_sent);
Routers.route('/total_offer_accepted').get(AuthenticateToken, total_offer_accepted);
Routers.route('/edit_company/:id').put(AuthenticateToken, edit_company_details);
Routers.route('/edit_company_document/:id').post(AuthenticateToken, edit_company_documents);
Routers.route('/delete_company_country').delete(AuthenticateToken, Delete_company_details_country)
Routers.route('/add_new_country/:id').post(AuthenticateToken, add_company_country);
Routers.route('/edit_logo/:id').post(AuthenticateToken, edit_logo);
Routers.route('/selected_offer').get(AuthenticateToken, selected_offer);
Routers.route('/delete_offer/:id').delete(AuthenticateToken, delete_offer);
module.exports = Routers;