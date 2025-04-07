const db = require('../Db_Connection');

const Display_company = (req, res) => {
    db.query(
        `SELECT * FROM companies_info WHERE created_by = ?`,
        [req.user.useremail],
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
                    res.status(500).json({ message: "Error processing data", error });
                });
        }
    );
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



module.exports = { Display_company, Delete_company_admin, Display_offers };