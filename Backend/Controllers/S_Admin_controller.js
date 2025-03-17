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

module.exports = {
    Display_All_company,
    Delete_any_company,
    Show_all_User,
    Update_User_role,
    Delete_user,
    show_all_offers
};