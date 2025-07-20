const { truncate } = require('fs');
const db = require('../Db_Connection');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: './.env' });


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
                        db.query(`SELECT * FROM company_${company.id}`, (err1, tableData) => {
                            if (err1) {
                                console.error(`Error fetching data for ${company.company_name}:`, err1);
                                return resolve({ ...company, tableData: [], ratting: [], error: "Error fetching table data" });
                            }

                            db.query(`SELECT * FROM ratting WHERE company_id =? `, [company.id], (err2, ratting) => {
                                if (err2) {
                                    console.log(`Error featching data for ${company.company_name}: `, err2);
                                    return resolve({ ...company, tableData: [], ratting: [], error: "Error featching ratting data" });
                                }

                                resolve({ ...company, tableData, ratting });
                            });
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
        db.query(`SELECT created_by FROM companies_info WHERE id = ${company_id}`, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                const created_by = result[0].created_by;
                db.query(`DELETE FROM users WHERE email = '${created_by}'`, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
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
        db.query(
            `SELECT o.*, 
                    g.*, 
                    p.database_id, p.user_id, p.user_email, p.transaction_id, p.order_id, p.paypal_id, p.payment_info_amount, p.payment_info_status 
             FROM offers o 
             LEFT JOIN groupage g ON o.groupage_id = g.id 
             LEFT JOIN payment_info_customers p ON p.offer_id = o.offer_id`,
            (err, offerData) => {
                if (err) {
                    console.error("Error fetching offers:", err);
                    return res.status(500).json({ message: "Error fetching offers", error: err });
                }

                const offerWithCompanyPromises = offerData.map((offer) => {
                    return new Promise((resolve) => {
                        db.query(
                            `SELECT company_name, contect_no FROM companies_info WHERE created_by = ? LIMIT 1`,
                            [offer.created_by_email],
                            (err, companyResult) => {
                                if (err) {
                                    console.error("Error fetching company info:", err);
                                    companyResult = [{}];
                                }
                                const company = companyResult[0] || {};

                                db.query(
                                    `SELECT name as userName FROM users WHERE email = ?`,
                                    [offer.groupage_created_by],
                                    (err, userResult) => {
                                        if (err) {
                                            console.log("Error fetching user name", err);
                                            userResult = [{}];
                                        }
                                        const user = userResult[0] || {};

                                        resolve({
                                            ...offer,
                                            company_name: company.company_name || null,
                                            contect_no: company.contect_no || null,
                                            userName: user.userName || null,
                                        });
                                    }
                                );
                            }
                        );
                    });
                });

                Promise.all(offerWithCompanyPromises)
                    .then((finalData) => {
                        res.json({
                            message: "Merged offers with company info",
                            data: finalData,
                        });
                    })
                    .catch((error) => {
                        console.error("Error processing company merges:", error);
                        res.status(500).json({ message: "Internal error", error });
                    });
            }
        );
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
        db.query(`SELECT COUNT(*) AS count FROM users WHERE role = 'user'`, (err, result) => {
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

        db.query(`SELECT * FROM companies_info WHERE id = ?`, [company_id], (err, result) => {
            if (err) {
                console.error("Error fetching company info:", err);
                return res.json({ message: 'Error in database', status: false });
            }

            if (result.length === 0) {
                return res.json({ message: 'Company not found', status: false });
            }

            const company = result[0];

            const dynamicTableName = `company_${company_id}`;
            const tableQuery = `SELECT * FROM \`${dynamicTableName}\``;

            db.query(tableQuery, (tableErr, tableData) => {
                if (tableErr) {
                    console.error(`Error fetching data from table ${dynamicTableName}:`, tableErr);
                    return res.json({
                        message: 'Error fetching data from company table',
                        status: false,
                        company,
                        tableData: [],
                        avg_rating: "0",
                        total_reviews: 0,
                        tableError: true
                    });
                }

                db.query(`SELECT ratting FROM ratting WHERE company_id = ?`, [company_id], (ratErr, rattingRows) => {
                    if (ratErr) {
                        console.log('Error fetching ratings:', ratErr);
                        return res.json({
                            message: 'Error fetching rating data',
                            status: false,
                            company,
                            tableData,
                            avg_rating: "0",
                            total_reviews: 0,
                            rattingError: true
                        });
                    }

                    // Calculate average rating and total reviews
                    const totalReviews = rattingRows.length;
                    const totalRating = rattingRows.reduce((sum, r) => sum + parseFloat(r.ratting || 0), 0);
                    const avgRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : "0";

                    // Combine all in a single company object
                    company.tableData = tableData;
                    company.avg_rating = avgRating;
                    company.total_reviews = totalReviews;

                    res.json({
                        message: [company],
                        status: true
                    });
                });
            });
        });
    } else {
        res.json({ message: 'You are not Super Admin', status: false });
    }
};



// const compnay_info_details = (req, res) => {
//     if (req.user.role === 'Sadmin') {
//         const company_id = req.params.id;

//         db.query(`SELECT * FROM companies_info WHERE id = ?`, [company_id], (err, result) => {
//             if (err) {
//                 console.error("Error fetching company info:", err);
//                 return res.json({ message: 'Error in database', status: false });
//             }

//             if (result.length === 0) {
//                 return res.json({ message: 'Company not found', status: false });
//             }

//             const company = result[0];

//             const dynamicTableName = `company_${company_id}`;
//             db.query(`SELECT * FROM ??`, [dynamicTableName], (tableErr, tableData) => {
//                 if (tableErr) {
//                     console.error(`Error fetching data from table ${dynamicTableName}:`, tableErr);
//                     return res.json({
//                         message: 'Error fetching data from company table',
//                         status: false,
//                         company,
//                         tableData: [],
//                         tableError: true
//                     });
//                 }

//                 res.json({
//                     message: [{ ...company, tableData }],
//                     status: true
//                 });
//             });
//         });
//     } else {
//         res.json({ message: 'You are not Super Admin', status: false });
//     }
// };

const edit_company_details = (req, res) => {
    const company_id = req.params.id;
    const editField = req.body.editField;
    const newValue = req.body.newValue;
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
            region: req.body.region,
            country: req.body.country,
            duration: req.body.duration,
            name: req.body.name,
        }
        if (req.body.region) {
            db.query(
                `INSERT INTO company_${company_id} (region, countries, duration, service_type) VALUES (?, ?, ?, ?)`,
                [req.body.region, req.body.country, req.body.duration, req.body.name],
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
        }
    } else {
        res.json({ message: 'You are not Super Admin', status: false })
    }
}

const total_amount_received = (req, res) => {
    if (req.user.role === 'Sadmin') {
        db.query(`SELECT payment_info_amount FROM payment_info_customers`, (err, result) => {
            if (err) {
                res.json({ message: 'error in database', status: false });
            } else {
                res.json({ message: result, status: true });
            }
        })
    } else {
        res.json({ message: 'You are not super admin', status: false })
    }
}

const total_commission = (req, res) => {
    if (req.user.role === 'Sadmin') {
        db.query(`SELECT commission FROM offers WHERE status = 'complete'`, (err, result) => {
            if (err) {
                res.json({ message: 'error in database', status: false });
            } else {
                res.json({ message: result, status: true });
            }
        })
    } else {
        res.json({ message: 'You are not super admin', status: false });
    }
}

const amount_to_pay = (req, res) => {
    if (req.user.role === 'Sadmin') {
        db.query(`SELECT amount FROM offers WHERE status = 'complete'`, (err, result) => {
            if (err) {
                res.json({ message: 'error in database', status: false });
            } else {
                res.json({ message: result, status: true });
            }
        })
    } else {
        res.json({ message: 'You are not super amdin', status: false });
    }
}


const uploadDir = path.join(__dirname, '../send_transport_img');

if (!fs.existsSync(uploadDir)) {
    try {
        fs.mkdirSync(uploadDir, { recursive: true });
    } catch (err) {
        console.error('Error creating upload directory:', err);
    }
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });


const edit_company_documents = [
    upload.single("image"),
    async (req, res) => {
        try {
            const filePath = req.file.path;
            const id = req.params.id;
            const type = req.body.type;

            const result = await cloudinary.uploader.upload(filePath, {
                folder: `company_documents/${id}`,
                resource_type: "auto",
            });


            if (type === 'Financial Document') {

                db.query(`UPDATE companies_info SET financialDocument = ? WHERE id = ?`, [result.secure_url, id], (err, result) => {
                    if (err) {
                        console.log(err);
                        res.json({ message: 'Error in database', status: false });
                    } else {
                        res.json({ message: 'Updated success', status: true });
                    }
                })
            } else if (type === 'Registration Document') {

                db.query(`UPDATE companies_info SET registrationDocument = ? WHERE id = ?`, [result.secure_url, id], (err, result) => {
                    if (err) {
                        console.log(err);
                        res.json({ message: 'Error in database', status: false });
                    } else {
                        res.json({ message: 'Updated success', status: true });
                    }
                })
            } else if (type === 'Passport CEO MD') {

                db.query(`UPDATE companies_info SET passport_CEO_MD = ? WHERE id = ?`, [result.secure_url, id], (err, result) => {
                    if (err) {
                        console.log(err);
                        res.json({ message: 'Error in database', status: false });
                    } else {
                        res.json({ message: 'Updated success', status: true });
                    }
                })
            }
            fs.unlinkSync(filePath);

        } catch (error) {
            console.error("Error uploading document to Cloudinary:", error);
            res.status(500).json({ error: "Failed to upload document" });
        }
    }
];

const payment_details = (req, res) => {
    if (req.user.role === 'Sadmin') {
        const user_email = req.body.user_email;
        const offer_id = req.body.offer_id;
        const details = {};

        db.query(`SELECT name FROM users WHERE email = ?`, [user_email], (err, result1) => {
            if (err || !result1.length) {
                console.log(err || 'User not found');
                return res.status(500).json({ message: 'Error fetching user name', status: false });
            }
            details.user_name = result1[0].name;

            db.query(`SELECT created_by_email FROM offers WHERE offer_id = ?`, [offer_id], (err, result2) => {
                if (err || !result2.length) {
                    console.log(err || 'Offer not found');
                    return res.status(500).json({ message: 'Error fetching offer', status: false });
                }
                details.company_email = result2[0].created_by_email;

                db.query(`SELECT company_name, contect_no FROM companies_info WHERE created_by = ?`, [details.company_email], (err, result3) => {
                    if (err || !result3.length) {
                        console.log(err || 'Company not found');
                        return res.status(500).json({ message: 'Error fetching company info', status: false });
                    }

                    details.company_name = result3[0].company_name;
                    details.company_contact = result3[0].contect_no;

                    res.json({ message: details, status: true });
                });
            });
        });
    } else {
        res.status(403).json({ message: 'Only super admin can access', status: false });
    }
};



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
    total_amount_received,
    total_commission,
    amount_to_pay,
    edit_company_documents,
    payment_details
};