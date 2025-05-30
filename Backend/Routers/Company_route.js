const express = require('express');
const Routers = express.Router();
const AuthenticateToken = require('../Middleware/Authenticate.js');
const { 
    Company_Register, 
    Update_companyName, 
    Update_companyEmail, 
    Update_companyContact, 
    Update_companyWebsite, 
    Update_companyAddress,
    Update_companyServices,
    Delete_Country,
    Change_date,
    Add_New_country,
    display_company,
} = require('../Controllers/Company_controller.js');


Routers.route('/display_company').get(display_company);
Routers.route('/regester_company').post(Company_Register);
//updates
Routers.route('/update_company_name/:id').put(AuthenticateToken, Update_companyName);
Routers.route('/update_company_email/:id').put(AuthenticateToken, Update_companyEmail);
Routers.route('/update_company_contact/:id').put(AuthenticateToken, Update_companyContact);
Routers.route('/update_company_webSite/:id').put(AuthenticateToken, Update_companyWebsite);
Routers.route('/update_company_address/:id').put(AuthenticateToken, Update_companyAddress);
Routers.route('/update_company_service/:id').put(AuthenticateToken, Update_companyServices);
Routers.route('/delete_country').put(AuthenticateToken, Delete_Country);
Routers.route('/change_date').put(AuthenticateToken, Change_date);
Routers.route('/add_new_country').put(AuthenticateToken, Add_New_country);


module.exports = Routers;



