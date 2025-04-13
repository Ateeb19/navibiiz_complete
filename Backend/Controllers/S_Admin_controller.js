const { truncate } = require('fs');
const db = require('../Db_Connection');

const Display_All_company = (req, res) => {
    if (req.user.role === 'Sadmin') {
        db.query(
            `SELECT * FROM companies_info`,
            (err, companies) => {
                if (err) {
                    console.error("Error fetching companies:", err);
                    return res.status(500).json({ message: "Error fetching companies", error: err });
                }
                const companyDataPromises = companies.map((company) => {
                    return new Promise((resolve) => {
                        db.query(`SELECT * FROM company_${company.id}`, (err, tableData) => {
                            if (err) {
                                console.error(`Error fetching data for ${company.company_name}:`, err);
                                resolve({ ...company, tableData: [], error: "Error fetching table data" });
                            } else {
                                resolve({ ...company, tableData });
                            }
                        });
                    });
                });
                Promise.all(companyDataPromises)
                    .then((companiesWithTableData) => {
                        res.json({
                            message: "Data fetched successfully",
                            data: companiesWithTableData,
                        });
                    })
                    .catch((error) => {
                        console.error("Error resolving promises:", error);
                        res.status(500).json({ message: "Error processing data", error, data: 'error' });
                    });
            }
        );
    } else {
        res.json({ message: "You are not Super Admin" });
    }
}

const Delete_any_company = (req, res) => {
    if (req.user.role === 'Sadmin') {
        const company_info = req.params.id;
        const [comapny_name, company_id] = company_info.split('_');
        db.query(`DELETE FROM companies_info WHERE id = ${company_id}`, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                db.query(`DROP TABLE ${company_info}`, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.json({ message: 'Companyy Deleted success', status: true });
                    }
                })
            }
        })
    } else {
        res.json({ message: "you are not Super Admin" })
    }
}

const Show_all_User = (req, res) => {
    if (req.user.role === 'Sadmin') {
        db.query(`SELECT * FROM users`, (err, result) => {
            if (err) {
                console.log(err);
                res.json({ message: "error in database" })
            } else {
                res.json({ message: result, status: true })
            }
        })
    } else {
        res.json({ message: 'You are not Super Adimin', status: false });
    }
}

const Update_User_role = (req, res) => {
    const id = req.params.id;
    const role = req.body.role;
    if (req.user.role === "Sadmin") {
        db.query(`UPDATE users SET role = '${role}' WHERE id = ${id}`, (err, result) => {
            if (err) {
                console.log(err);
                res.json({ message: 'error in database' });
            } else {
                res.json({ message: result, status: true });
            }
        })
    } else {
        res.json({ message: 'You are not Super Admin', status: false });
    }
}

const Delete_user = (req, res) => {
    const id = req.params.id;
    if (req.user.role === 'Sadmin') {
        db.query(`DELETE FROM users WHERE id = ${id}`, (err, result) => {
            if (err) {
                console.log(err);
                res.json({ message: 'error in database' });
            } else {
                res.json({ message: 'Deleted!', status: true });
            }
        })
    }
}


//show all offers
const show_all_offers = (req, res) => {
    if (req.user.role === "Sadmin") {
        const query = `
            SELECT o.*, g.*
            FROM offers o
            LEFT JOIN groupage g ON o.groupage_id = g.id
        `;

        db.query(query, (err, result) => {
            if (err) {
                console.error("Database query error:", err);
                return res.status(500).json({ message: "Internal Server Error" });
            }
            res.json({ message: "All offers with groupage details", data: result });
        });
    } else {
        res.status(403).json({ message: "You are not authorized" });
    }
};

const Total_company_count = (req, res) => {
    if (req.user.role === 'Sadmin') {
        db.query('SELECT COUNT(*) AS count FROM companies_info', (err, result) => {
            if (err) {
                res.json({ message: 'Error in database', status: 'false' });
            } else {
                res.json({ message: result[0], status: true });
            }
        })
    } else {
        res.json({ message: 'You are not authorized', status: false });
    }
}

const Total_User_count = (req, res) => {
    if (req.user.role === 'Sadmin') {
        db.query(`SELECT COUNT(*) AS count FROM users WHERE role = 'user' OR role = 'admin'`, (err, result) => {
            if (err) {
                res.json({ message: 'Error in database', status: 'false' });
            } else {
                res.json({ message: result[0], status: true });
            }
        })
    } else {
        res.json({ message: 'You are not authorized', status: false });
    }
}

const payment_history = (req, res) => {
    if (req.user.role === 'Sadmin') {
        db.query('SELECT * FROM payment_info_customers', (err, result) => {
            if (err) {
                res.json({ message: 'error in database', status: false })
                console.log(err);
            } else {
                res.json({ message: result, status: true });
            }
        })
    }
}
const compnay_info_details = (req, res) => {
    if (req.user.role === 'Sadmin') {
        const company_id = req.params.id;

        // First, fetch the main company information
        db.query(`SELECT * FROM companies_info WHERE id = ?`, [company_id], (err, result) => {
            if (err) {
                console.error("Error fetching company info:", err);
                return res.json({ message: 'Error in database', status: false });
            }

            if (result.length === 0) {
                return res.json({ message: 'Company not found', status: false });
            }

            const company = result[0];

            // Then, fetch data from the dynamic company-specific table
            const dynamicTableName = `company_${company_id}`;
            db.query(`SELECT * FROM ??`, [dynamicTableName], (tableErr, tableData) => {
                if (tableErr) {
                    console.error(`Error fetching data from table ${dynamicTableName}:`, tableErr);
                    return res.json({
                        message: 'Error fetching data from company table',
                        status: false,
                        company,
                        tableData: [],
                        tableError: true
                    });
                }

                // Return both the main info and the company-specific table data
                res.json({
                    message: [{ ...company, tableData }],
                    status: true
                });
            });
        });
    } else {
        res.json({ message: 'You are not Super Admin', status: false });
    }
};

const edit_company_details = (req, res) => {
    const company_id = req.params.id;
    const editField = req.body.editField;
    const newValue = req.body.newValue;

    // console.log(editField.label,'-::-' ,newValue, '-::-' ,company_id);
    // res.json({message: 'ok'});
    if (req.user.role === 'Sadmin') {

        if (editField.label === 'Email ID') {
            db.query(`UPDATE companies_info SET email = '${newValue}' WHERE id = ${company_id}`, (err, result) => {
                if (err) {
                    console.log(err);
                    res.json({ message: 'error in database' });
                } else {
                    res.json({ message: 'Updated!', status: true });
                }
            })
        } else

            if (editField.label === 'Location') {
                const locationString = `${newValue.country}, ${newValue.state}, ${newValue.city}`;

                db.query(`UPDATE companies_info SET location1 = '${locationString}' WHERE id = ${company_id}`, (err, result) => {
                    if (err) {
                        console.log(err);
                        res.json({ message: 'error in database' });
                    } else {
                        res.json({ message: 'Updated!', status: true });
                    }
                });
            } else

                if (editField.label === 'Paypal Id') {
                    db.query(`UPDATE companies_info SET paypal_id = '${newValue}' WHERE id = ${company_id}`, (err, result) => {
                        if (err) {
                            console.log(err, 'this is the error ');
                            res.json({ message: 'error in database' });
                        } else {
                            res.json({ message: 'Updated!', status: true });
                        }
                    })
                } else

                    if (editField.label === 'Account Holder Name') {
                        db.query(`UPDATE companies_info SET account_holder_name = '${newValue}' WHERE id = ${company_id}`, (err, result) => {
                            if (err) {
                                console.log(err);
                                res.json({ message: 'error in database' });
                            } else {
                                res.json({ message: 'Updated!', status: true });
                            }
                        })
                    } else

                        if (editField.label === 'IBA Number') {
                            db.query(`UPDATE companies_info SET iban_number = '${newValue}' WHERE id = ${company_id}`, (err, result) => {
                                if (err) {
                                    console.log(err);
                                    res.json({ message: 'error in database' });
                                } else {
                                    res.json({ message: 'Updated!', status: true });
                                }
                            })
                        } else

                            if (editField.label === 'About Company') {
                                db.query(`UPDATE companies_info SET description = '${newValue}' WHERE id = ${company_id}`, (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        res.json({ message: 'error in database' });
                                    } else {
                                        res.json({ message: 'Updated!', status: true });
                                    }
                                })
                            }

                            else {
                                res.json('nothing');
                            }
    } else {
        res.json({ message: 'You are not Super Admin', status: false });
    }
}
const Delete_company_details_country = (req, res) => {
    if (req.user.role === 'Sadmin') {
        const company_id = req.body.company_id;
        const row_id = req.body.row_id;
        db.query(`DELETE FROM company_${company_id} WHERE id = ${row_id}`, (err, result) => {
            if (err) {
                console.log(err);
                res.json({ message: 'error in database', status: false })
            } else {
                res.json({ message: 'Deleted!', status: true })
            }
        })
    }
}

const add_company_country = (req, res) => {
    if (req.user.role === 'Sadmin') {
        const company_id = req.params.id;
        const newCountryData = {
            country: req.body.country,
            duration: req.body.duration,
            name: req.body.name,
        }
        db.query(
            `INSERT INTO company_${company_id} (countries, duration, service_type) VALUES (?, ?, ?)`,
            [req.body.country, req.body.duration, req.body.name],
            (err, result) => {
                if (err) {
                    console.error('Insert error:', err);
                    return res.status(500).json({ status: false, message: 'Insert failed', error: err });
                }
                res.json({
                    status: true,
                    message: 'New country added successfully',
                    insertedId: result.insertId
                });
            }
        );
    } else {
        res.json({ message: 'You are not Super Admin', status: false })
    }
}
module.exports = {
    Display_All_company,
    Delete_any_company,
    Show_all_User,
    Update_User_role,
    Delete_user,
    show_all_offers,
    Total_company_count,
    Total_User_count,
    payment_history,
    compnay_info_details,
    edit_company_details,
    Delete_company_details_country,
    add_company_country,
};