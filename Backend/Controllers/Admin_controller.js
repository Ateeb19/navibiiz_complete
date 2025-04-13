const db = require('../Db_Connection');

const Display_company = (req, res) => {
    db.query(`SELECT * FROM companies_info WHERE created_by = ?`, [req.user.useremail], (err, result) => {
        if (err) {
            console.error("Error fetching company info:", err);
            return res.json({ message: 'Error in database', status: false });
        }

        if (result.length === 0) {
            return res.json({ message: 'Company not found', status: false });
        }

        const company = result[0];

        const company_id = result[0].id;
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

    // db.query(
    //     `SELECT * FROM companies_info WHERE created_by = ?`,
    //     [req.user.useremail],
    //     (err, companies) => {
    //         if (err) {
    //             console.error("Error fetching companies:", err);
    //             return res.status(500).json({ message: "Error fetching companies", error: err });
    //         }
    //         const companyDataPromises = companies.map((company) => {
    //             return new Promise((resolve) => {
    //                 db.query(`SELECT * FROM company_${company.id}`, (err, tableData) => {
    //                     if (err) {
    //                         console.error(`Error fetching data for ${company.company_name}:`, err);
    //                         resolve({ ...company, tableData: [], error: "Error fetching table data" });
    //                     } else {
    //                         resolve({ ...company, tableData });
    //                     }
    //                 });
    //             });
    //         });

    //         Promise.all(companyDataPromises)
    //             .then((companiesWithTableData) => {
    //                 res.json({
    //                     message: "Data fetched successfully",
    //                     data: companiesWithTableData,
    //                 });
    //             })
    //             .catch((error) => {
    //                 console.error("Error resolving promises:", error);
    //                 res.status(500).json({ message: "Error processing data", error });
    //             });
    //     }
    // );
};

const Delete_company_admin = (req, res) => {
    if (req.user.role === 'admin') {
        const company_info = req.params.id;
        const [comapny_name, company_id] = company_info.split('_');
        db.query(`DELETE FROM companies_info WHERE id = ${company_id} AND created_by = '${req.user.useremail}'`, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                db.query(`DROP TABLE ${company_info}`, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.json({ message: 'Company Deleted success', status: true });
                    }
                })
            }
        })
    } else {
        res.json({ message: "you are not Admin" })
    }
}

const Display_offers = (req, res) => {
    if (req.user.role === 'admin') {
        db.query(`SELECT * FROM offers WHERE created_by_email = ?`, [req.user.useremail], (err, offersResult) => {
            if (err) {
                console.log(err);
                return res.json({ message: 'Error fetching offers', status: false });
            }

            if (offersResult.length === 0) {
                return res.json({ message: [], status: true }); // No offers found
            }
            const groupageIds = [...new Set(offersResult.map(offer => offer.groupage_id))];

            db.query('SELECT id, product_name, pickup_date, sender_name FROM groupage WHERE id IN (?)', [groupageIds], (err, groupageResult) => {
                if (err) {
                    console.log(err);
                    return res.json({ message: 'Error fetching groupage data', status: false });
                }

                const groupageMap = {};
                groupageResult.forEach(groupage => {
                    groupageMap[groupage.id] = groupage;
                });

                const offerData = offersResult.map(offer => {
                    const groupage = groupageMap[offer.groupage_id] || {};
                    return {
                        ...offer,
                        product_name: groupage.product_name || null,
                        pickup_date: groupage.pickup_date || null,
                        sender_name: groupage.sender_name || null
                    };
                });

                res.json({ message: offerData, status: true });
            });
        });
    }
}

const total_offers_sent = (req, res) => {
    if(req.user.role === 'admin'){
        db.query(`SELECT COUNT(*) as total_offers FROM offers WHERE created_by_email = ?`, [req.user.useremail], (err, result) => {
            if(err){
                console.log(err);
                return res.json({ message: 'Error fetching total offers', status: false });
            }else{
                res.json({ message: result[0].total_offers, status: true });
            }
        });
    }else{
        res.json({ message: "you are not Admin", status: false });
    }
}

const total_offer_accepted = (req, res) => {
    if(req.user.role === 'admin') {
        db.query(`SELECT COUNT(*) as total_offers FROM offers WHERE created_by_email = ? AND accepted = 1` , [req.user.useremail], (err, result) => {
            if(err) {
                console.log(err);
                return res.json({message: 'Error fetching total offers', status: false})
            }else{
                res.json({message: result[0].total_offers, status: true});
            }
        })
    }else{
        res.json({message: 'you are not Admin', status: false});
    }
}

const edit_company_details = (req, res) => {
    const company_id = req.params.id;
    const editField = req.body.editField;
    const newValue = req.body.newValue;

    console.log(editField.label,'-::-' ,newValue, '-::-' ,company_id);
    // res.json({message: 'ok'});
    if (req.user.role === 'admin') {

        if (editField.label === 'Contact Number') {
            db.query(`UPDATE companies_info SET contect_no = '${newValue}' WHERE id = ${company_id}`, (err, result) => {
                if (err) {
                    console.log(err);
                    res.json({ message: 'error in database' });
                } else {
                    res.json({ message: 'Updated!', status: true });
                }
            })
        } else

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
    if (req.user.role === 'admin') {
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
    if (req.user.role === 'admin') {
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
module.exports = { Display_company, Delete_company_admin, Display_offers, total_offers_sent, total_offer_accepted, edit_company_details, Delete_company_details_country, add_company_country };