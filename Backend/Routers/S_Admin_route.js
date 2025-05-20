const express = require('express');
const Routers = express.Router();
const AuthenticateToken = require('../Middleware/Authenticate.js');
const { 
    Display_All_company, 
    Delete_any_company, 
    Show_all_User, 
    Update_User_role, 
    Delete_user,
    show_all_offers,
    Total_company_count,
    Total_User_count,
    payment_history,
    edit_company_details,
    compnay_info_details,
    Delete_company_details_country,
    add_company_country,
    total_amount_received,
    total_commission,
    amount_to_pay,
    edit_company_documents,
    payment_details,
} = require('../Controllers/S_Admin_controller.js');

Routers.route('/display_company').get(AuthenticateToken, Display_All_company);
Routers.route('/delete_compnay/:id').delete(AuthenticateToken, Delete_any_company);
Routers.route('/all_users').get(AuthenticateToken, Show_all_User);
Routers.route('/update_user/:id').put(AuthenticateToken, Update_User_role);
Routers.route('/delete_user/:id').delete(AuthenticateToken, Delete_user);
Routers.route('/show_all_offers').get(AuthenticateToken, show_all_offers);
Routers.route('/count_companies').get(AuthenticateToken, Total_company_count);
Routers.route('/count_users').get(AuthenticateToken, Total_User_count);
Routers.route('/payment_history').get(AuthenticateToken, payment_history);
Routers.route('/company_info_detail/:id').get(AuthenticateToken, compnay_info_details);
Routers.route('/edit_company/:id').put(AuthenticateToken, edit_company_details);
Routers.route('/edit_company_document/:id').post(AuthenticateToken, edit_company_documents);
Routers.route('/delete_company_country').delete(AuthenticateToken, Delete_company_details_country)
Routers.route('/add_new_country/:id').post(AuthenticateToken, add_company_country);
Routers.route('/total_amount_received').get(AuthenticateToken, total_amount_received);
Routers.route('/total_commission').get(AuthenticateToken, total_commission);
Routers.route('/amount_to_pay').get(AuthenticateToken, amount_to_pay);
Routers.route('/payment_information').post(AuthenticateToken, payment_details);
module.exports = Routers;