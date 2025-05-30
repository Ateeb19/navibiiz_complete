const express = require('express');
const Routers = express.Router();
const AuthenticateToken = require('../Middleware/Authenticate.js');
const {  send_groupage_submit, display_user_dashboard, delete_groupage, show_all_groupage, create_offer, show_offers_user, delete_offer_user, groupage_info, update_stats_offer, show_4_groupage } = require('../Controllers/Send_Groupage_controller.js');


Routers.route('/send_groupage_submit').post(AuthenticateToken, send_groupage_submit);
Routers.route('/display_user_dashboard').get(AuthenticateToken, display_user_dashboard);
Routers.route('/delete_groupage/:id').delete(AuthenticateToken, delete_groupage);
Routers.route('/show_grouage').get(show_all_groupage);
Routers.route('/show_only_grouage').get(show_4_groupage);
Routers.route('/create_offer').post(AuthenticateToken, create_offer);
Routers.route('/show_offer_user').get(AuthenticateToken, show_offers_user);
Routers.route('/delete_offer_user/:id').delete(AuthenticateToken, delete_offer_user);
Routers.route('/groupage_info/:id').get(AuthenticateToken, groupage_info);
Routers.route('/update_offer_status/:id').get(AuthenticateToken, update_stats_offer);

module.exports = Routers;