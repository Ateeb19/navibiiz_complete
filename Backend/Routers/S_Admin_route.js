const express = require('express');
const Routers = express.Router();
const AuthenticateToken = require('../Middleware/Authenticate.js');
const { 
    Display_All_company, 
    Delete_any_company, 
    Show_all_User, 
    Update_User_role, 
    Delete_user,
} = require('../Controllers/S_Admin_controller.js');

Routers.route('/display_company').get(AuthenticateToken, Display_All_company);
Routers.route('/delete_compnay/:id').delete(AuthenticateToken, Delete_any_company);
Routers.route('/all_users').get(AuthenticateToken, Show_all_User);
Routers.route('/update_user/:id').put(AuthenticateToken, Update_User_role);
Routers.route('/delete_user/:id').delete(AuthenticateToken, Delete_user);


module.exports = Routers;