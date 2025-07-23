const db = require('../Db_Connection');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: './.env' });


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const directoryPath = './send_transport_img';
const deleteAllFilse = (directoryPath) => {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.log(`could not list the directory ${err}`);
            return;
        }
        files.forEach((file) => {
            const filePath = path.join(directoryPath, file);
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.log(`could not stat file ${err}`);
                    return;
                }
                if (stats.isFile()) {
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error(`Could not delete file: ${err}`);
                            return;
                        }
                    });
                }
            })
        })
    })
};
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

const Company_Register = (req, res) => {
    try {
        const {
            companyName,
            contactNumber,
            contact_person_name,
            emailAddress,
            password,
            paypal_id,
            account_number,
            iban_number,
            description,
            locations,
            transportation,
            files
        } = req.body;

        const sanitizeField = (field) => (field === null || field === undefined ? '' : field);

        const companyData = {
            companyName: sanitizeField(companyName),
            contactNumber: sanitizeField(contactNumber),
            contact_person_name: sanitizeField(contact_person_name),
            emailAddress: sanitizeField(emailAddress),
            password: sanitizeField(password),
            paypal_id: sanitizeField(paypal_id),
            account_number: sanitizeField(account_number),
            iban_number: sanitizeField(iban_number),
            description: sanitizeField(description),
            locations: JSON.parse(locations).map((loc) => {
                return `${sanitizeField(loc.country)}, ${sanitizeField(loc.state)}, ${sanitizeField(loc.city)}`;
            }),
            transportation: JSON.parse(transportation),
            files: {
                registrationDocument: files?.registrationDocument || '',
                financialDocument: files?.financialDocument || '',
                passportCEO_MD: files?.passportCEO_MD || '',
                selectedImage: files?.selectedImage || '',
            },
        };

        const sqlData = {
            location1: companyData.locations[0] || '',
            location2: companyData.locations[1] || '',
            location3: companyData.locations[2] || '',
            location4: companyData.locations[3] || '',
            location5: companyData.locations[4] || '',
            location6: companyData.locations[5] || '',
            location7: companyData.locations[6] || '',
            location8: companyData.locations[7] || '',
            location9: companyData.locations[8] || '',
            location10: companyData.locations[9] || '',
            companyName: companyData.companyName,
            contactNumber: companyData.contactNumber,
            contact_person_name: companyData.contact_person_name,
            emailAddress: companyData.emailAddress,
            password: companyData.password,
            paypal_id: companyData.paypal_id,
            account_number: companyData.account_number,
            iban_number: companyData.iban_number,
            description: companyData.description,
            transportation: companyData.transportation,
            files: companyData.files,
        };

        db.query(
            'INSERT INTO companies_info SET ?',
            {
                created_by: sqlData.emailAddress,
                user_role: 'admin',
                company_name: sqlData.companyName,
                contact_person_name: sqlData.contact_person_name,
                email: sqlData.emailAddress,
                paypal_id: sqlData.paypal_id,
                account_holder_name: sqlData.account_number,
                iban_number: sqlData.iban_number,
                contect_no: sqlData.contactNumber,
                description: sqlData.description,
                logo: sqlData.files.selectedImage,
                location1: sqlData.location1,
                location2: sqlData.location2,
                location3: sqlData.location3,
                location4: sqlData.location4,
                location5: sqlData.location5,
                location6: sqlData.location6,
                location7: sqlData.location7,
                location8: sqlData.location8,
                location9: sqlData.location9,
                location10: sqlData.location10,
                container_service: sqlData.transportation.containerService,
                groupage_service: sqlData.transportation.groupageService,
                car_service: sqlData.transportation.carService,
                registrationDocument: sqlData.files.registrationDocument,
                financialDocument: sqlData.files.financialDocument,
                passport_CEO_MD: sqlData.files.passportCEO_MD
            },
            (err, result1) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Error in database', status: false });
                }

                const companyTable = `company_${result1.insertId}`;
                db.query(
                    `CREATE TABLE ${companyTable} (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        region VARCHAR(255),
                        countries VARCHAR(255),
                        duration VARCHAR(255),
                        service_type VARCHAR(255)
                    );`,
                    (err) => {
                        if (err) {
                            return res.status(500).json({ message: 'Error in creating table', status: false });
                        }

                        const insertCountryData = (countries, type) => {
                            countries.forEach((country) => {
                                // console.log('service_type: ',type, '** region: ', country.region, '** country: ', country.country, '** duration: ', country.deliveryTime, '\n');
                                db.query(
                                    `INSERT INTO ${companyTable} SET ?`,
                                    {
                                        region: country.region,
                                        countries: country.country,
                                        duration: country.deliveryTime,
                                        service_type: type
                                    },
                                    (err) => {
                                        if (err) console.log(`Error in company table (${type}):`, err);
                                    }
                                );
                            });
                        };

                        if (sqlData.transportation.containerService)
                            insertCountryData(sqlData.transportation.selectedContainerCountries, 'container');

                        if (sqlData.transportation.carService)
                            insertCountryData(sqlData.transportation.selectedCarCountries, 'car');

                        if (sqlData.transportation.groupageService)
                            insertCountryData(sqlData.transportation.selectedGroupageCountries, 'groupage');

                        db.query(
                            'UPDATE users SET role = ?, company = ? WHERE email = ?',
                            ['admin', 'yes', sqlData.emailAddress],
                            (err) => {
                                if (err) console.log('User update error:', err);
                            }
                        );

                        return res.status(200).json({
                            message: 'Company registered successfully',
                            data: sqlData
                        });
                    }
                );
            }
        );
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
};



// const Company_Register = (req, res) => {
//     const fileHandler = upload.fields([
//         { name: 'selectedImage', maxCount: 1 },
//         { name: 'registrationDocument', maxCount: 1 },
//         { name: 'financialDocument', maxCount: 1 },
//         { name: 'passportCEO_MD', maxCount: 1 }
//     ]);

//     fileHandler(req, res, async (err) => {
//         if (err) {
//             return res.status(400).json({ message: 'File upload failed', error: err.message });
//         }

//         const {
//             companyName,
//             contactNumber,
//             contact_person_name,
//             emailAddress,
//             password,
//             paypal_id,
//             account_number,
//             iban_number,
//             description,
//             locations,
//             transportation
//         } = req.body;

//         const uploadToCloudinary = async (filePath) => {
//             return new Promise((resolve, reject) => {
//                 cloudinary.uploader.upload(filePath, { folder: 'Documents' }, (error, result) => {
//                     if (error) {
//                         reject(error);
//                     } else {
//                         resolve(result.secure_url);
//                     }
//                 });
//             });
//         };
//         const uploadedFiles = {};

//         if (req.files && typeof req.files === 'object') {
//             for (const field in req.files) {
//                 if (Object.prototype.hasOwnProperty.call(req.files, field)) {
//                     try {
//                         const filePath = req.files[field][0]?.path;
//                         if (filePath) {
//                             const url = await uploadToCloudinary(filePath);
//                             uploadedFiles[field] = url;
//                         } else {
//                             uploadedFiles[field] = '';
//                         }
//                     } catch (error) {
//                         console.error(`Error uploading ${field} to Cloudinary:`, error);
//                         uploadedFiles[field] = '';
//                     }
//                 } else {
//                     uploadedFiles[field] = '';
//                 }
//             }
//         }
//         const sanitizeField = (field) => (field === null || field === undefined ? '' : field);

//         const companyData = {
//             companyName: sanitizeField(companyName),
//             contactNumber: sanitizeField(contactNumber),
//             contact_person_name: sanitizeField(contact_person_name),
//             emailAddress: sanitizeField(emailAddress),
//             password: sanitizeField(password),
//             paypal_id: sanitizeField(paypal_id),
//             account_number: sanitizeField(account_number),
//             iban_number: sanitizeField(iban_number),
//             description: sanitizeField(description),
//             locations: JSON.parse(locations).map((loc) => {
//                 return `${sanitizeField(loc.country)}, ${sanitizeField(loc.state)}, ${sanitizeField(loc.city)}`;
//             }),
//             transportation: JSON.parse(transportation),
//             files: {
//                 registrationDocument: uploadedFiles.registrationDocument || '',
//                 financialDocument: uploadedFiles.financialDocument || '',
//                 passportCEO_MD: uploadedFiles.passportCEO_MD || '',
//                 selectedImage: uploadedFiles.selectedImage || '',
//             },
//         };
//         const sqlData = {
//             location1: companyData.locations[0] || '',
//             location2: companyData.locations[1] || '',
//             location3: companyData.locations[2] || '',
//             location4: companyData.locations[3] || '',
//             location5: companyData.locations[4] || '',
//             location6: companyData.locations[5] || '',
//             location7: companyData.locations[6] || '',
//             location8: companyData.locations[7] || '',
//             location9: companyData.locations[8] || '',
//             location10: companyData.locations[9] || '',
//             companyName: companyData.companyName,
//             contactNumber: companyData.contactNumber,
//             contact_person_name: companyData.contact_person_name,
//             emailAddress: companyData.emailAddress,
//             password: companyData.password,
//             paypal_id: companyData.paypal_id,
//             account_number: companyData.account_number,
//             iban_number: companyData.iban_number,  
//             description: companyData.description,
//             transportation: companyData.transportation,
//             files: companyData.files,
//         };

//         db.query('INSERT INTO companies_info SET ?', { created_by: sqlData.emailAddress, user_role: 'admin', company_name: sqlData.companyName, contact_person_name: sqlData.contact_person_name, email: sqlData.emailAddress, paypal_id: sqlData.paypal_id, account_holder_name: sqlData.account_number, iban_number: sqlData.iban_number, contect_no: sqlData.contactNumber, description: sqlData.description, logo: sqlData.files.selectedImage, location1: sqlData.location1, location2: sqlData.location2, location3: sqlData.location3, location4: sqlData.location4, location5: sqlData.location5, location6: sqlData.location6, location7: sqlData.location7, location8: sqlData.location8, location9: sqlData.location9, location10: sqlData.location10, container_service: sqlData.transportation.containerService, groupage_service: sqlData.transportation.groupageService, car_service: sqlData.transportation.carService, registrationDocument: sqlData.files.registrationDocument, financialDocument: sqlData.files.financialDocument, passport_CEO_MD: sqlData.files.passportCEO_MD }, (err, result1) => {
//             if (err) {
//                 res.json({ message: 'Error in database', status: false });
//                 console.log(err);
//             } else {
//                 db.query('CREATE TABLE ' + 'company' + '_' + result1.insertId + '(id INT AUTO_INCREMENT PRIMARY KEY, countries VARCHAR(255), duration VARCHAR(255), service_type VARCHAR(255));', (err, result2) => {
//                     if (err) {
//                         res.json({ message: 'Error in creating table', status: false });
//                     } else {
//                         if (sqlData.transportation.containerService === true) {
//                             sqlData.transportation.selectedContainerCountries.map((country) => {
//                                 db.query('INSERT INTO ' + 'company' + '_' + result1.insertId + ' SET ?', { countries: country.country, duration: country.deliveryTime, service_type: 'container' }, (err, result001) => {
//                                     if (err) {
//                                         console.log('error in cpmanyName table', err);
//                                     }

//                                 });
//                             });
//                         }
//                         if (sqlData.transportation.carService === true) {
//                             sqlData.transportation.selectedCarCountries.map((country) => {
//                                 db.query('INSERT INTO ' + 'company' + '_' + result1.insertId + ' SET ?', { countries: country.country, duration: country.deliveryTime, service_type: 'car' }, (err, result002) => {
//                                     if (err) {
//                                         console.log('error in cpmanyName table', err);
//                                     }

//                                 });
//                             });
//                         }
//                         if (sqlData.transportation.groupageService === true) {
//                             sqlData.transportation.selectedGroupageCountries.map((country) => {
//                                 db.query('INSERT INTO ' + 'company' + '_' + result1.insertId + ' SET ?', { countries: country.country, duration: country.deliveryTime, service_type: 'groupage' }, (err, result003) => {
//                                     if (err) {
//                                         console.log('error in cpmanyName table', err);
//                                     }

//                                 });
//                             });
//                         }
//                         db.query('UPDATE users SET role = ?, company = ? WHERE email = ?', ['admin','yes', sqlData.emailAddress], (err, result) => {
//                             if (err) {
//                                 console.log(err);
//                             }
//                         })
//                         res.json({ message: 'Company registered successfully', data: sqlData });
//                     }
//                 });
//                 deleteAllFilse(directoryPath);
//             }
//         });
//     });
// };


//update company
const Update_companyName = (req, res) => {
    const id = req.params.id;
    const new_name = req.body.new_name;
    const old_name = req.body.old_name;
    if (req.user.role === 'Sadmin' || req.user.role === 'admin') {
        db.query('UPDATE companies_info SET company_name = ? WHERE id = ?', [new_name, id], (err, result) => {
            if (err) {
                console.log(err);
                res.json({ message: 'error in database' });
            } else {
                db.query(`ALTER TABLE ${old_name}_${id} RENAME ${new_name}_${id}`, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.json({ message: 'Updated!', status: true });
                    }
                })
            }
        });
    } else {
        res.json({ message: 'You are not Super Admin', status: false });
    }
}

const Update_companyEmail = (req, res) => {
    const id = req.params.id;
    const email = req.body.email;
    if (req.user.role === 'Sadmin' || req.user.role === 'admin') {
        db.query('UPDATE companies_info SET email = ? WHERE id = ?', [email, id], (err, result) => {
            if (err) {
                console.log(err);
                res.json({ message: 'error in database' });
            } else {
                res.json({ message: 'Updated!', status: true });
            }
        });
    } else {
        res.json({ message: 'You are not Super Admin', status: false });
    }
}

const Update_companyContact = (req, res) => {
    const id = req.params.id;
    const contact = req.body.contact;
    if (req.user.role === 'Sadmin' || req.user.role === 'admin') {
        db.query('UPDATE companies_info SET contect_no = ? WHERE id = ?', [contact, id], (err, result) => {
            if (err) {
                console.log(err);
                res.json({ message: 'error in database' });
            } else {
                res.json({ message: 'Updated!', status: true });
            }
        });
    } else {
        res.json({ message: 'You are not Super Admin', status: false });
    }
}

const Update_companyWebsite = (req, res) => {
    const id = req.params.id;
    const webSite_url = req.body.webSite_url;
    if (req.user.role === 'Sadmin' || req.user.role === 'admin') {
        db.query('UPDATE companies_info SET webSite_url = ? WHERE id = ?', [webSite_url, id], (err, result) => {
            if (err) {
                console.log(err);
                res.json({ message: 'error in database' });
            } else {
                res.json({ message: 'Updated!', status: true });
            }
        });
    } else {
        res.json({ message: 'You are not Super Admin', status: false });
    }
}

const Update_companyAddress = (req, res) => {
    const id = req.params.id;
    const address = req.body.address;
    if (req.user.role === 'Sadmin' || req.user.role === 'admin') {
        db.query('UPDATE companies_info SET address = ? WHERE id = ?', [address, id], (err, result) => {
            if (err) {
                console.log(err);
                res.json({ message: 'error in database' });
            } else {
                res.json({ message: 'Updated!', status: true });
            }
        });
    } else {
        res.json({ message: 'You are not Super Admin', status: false });
    }
}

const Update_companyServices = (req, res) => {
    const id = req.params.id;
    const car = req.body.car;
    const container = req.body.container;
    const groupage = req.body.groupage;
    if (req.user.role === 'Sadmin' || req.user.role === 'admin') {
        db.query('UPDATE companies_info SET container_service = ?, groupage_service = ?, car_service = ? WHERE id = ?', [container, groupage, car, id], (err, result) => {
            if (err) {
                console.log(err);
                res.json({ message: 'error in database' });
            } else {
                res.json({ message: 'Updated!', status: true });
            }
        });
    } else {
        res.json({ message: 'You are not Super Admin', status: false });
    }
}

const Delete_Country = (req, res) => {
    const tableId = req.body.tableId;
    const tablename = req.body.tablename;
    if (req.user.role === 'Sadmin' || req.user.role === 'admin') {
        db.query(`DELETE FROM ${tablename} WHERE id = ${tableId}`, (err, result) => {
            if (err) {
                console.log(err);
                res.json({ message: 'error in database' });
            } else {
                res.json({ message: 'Deleted!', status: true });
            }
        });
    } else {
        res.json({ message: 'You are not Super Admin', status: false });
    }
}

const Change_date = (req, res) => {
    const tableId = req.body.tableId;
    const tablename = req.body.tablename;
    const newdate = req.body.newdate;
    if (req.user.role === 'Sadmin' || req.user.role === 'admin') {
        db.query(`UPDATE ${tablename} SET date = '${newdate}' WHERE id = ${tableId}`, (err, result) => {
            if (err) {
                console.log(err);
                res.json({ message: 'error in database' });
            } else {
                res.json({ message: 'Date updated', status: true });
            }
        })
    } else {
        res.json({ message: "You are not Super Admin or Admin", status: false });
    }
}

const Add_New_country = (req, res) => {
    const from_NewCountryValue = req.body.from_NewCountryValue;
    const to_NewCountryValue = req.body.to_NewCountryValue;
    const duration_NewCountryValue = req.body.duration_NewCountryValue;
    const addNewCountry = req.body.addNewCountry;
    if (req.user.role === 'Sadmin' || req.user.role === 'admin') {
        db.query(`INSERT INTO ${addNewCountry} SET ?`, { ship_from: from_NewCountryValue, ship_to: to_NewCountryValue, duration: duration_NewCountryValue }, (err, result) => {
            if (err) {
                console.log(err);
                res.json({ message: 'error in database' });
            } else {
                res.json({ message: 'Added!', status: true });
            }
        });
    } else {
        res.json({ message: 'You are not Admin', status: false });
    }
}


const display_company = async (req, res) => {
    try {
        // Fetch all companies
        const result1 = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM companies_info WHERE container_service = 1 OR car_service = 1', (err, data) => {
                if (err) return reject(err);
                resolve(data);
            });
        });

        for (const element of result1) {
            const name = `company_${element.id}`;
            const company_id = element.id;
            const created_by = element.created_by;
            try {
                const countries = await new Promise((resolve, reject) => {
                    db.query(`SELECT * FROM \`${name}\``, (err, data) => {
                        if (err) return reject(err);
                        resolve(data);
                    });
                });
                element.Countries = countries;
            } catch (err) {
                console.error(`Error fetching countries for ${name}:`, err);
                element.Countries = []; // Set to empty array on error
            }
            try {
                const total_delivery = await new Promise((resolve, reject) => {
                    db.query(`SELECT COUNT(*) AS total_delivery FROM offers WHERE status = 'complete' AND created_by_email = ?`, [created_by], (err, data) => {
                        if (err) return reject(err);
                        resolve(data);
                    });
                });
                element.total_delivery = total_delivery[0].total_delivery;
            } catch (err) {
                console.error('Error fetching total delivery:', err);
                element.total_delivery = 0;
            }
            try {
                const ratting = await new Promise((resolve, reject) => {
                    db.query(`SELECT * FROM ratting WHERE company_id = ?`,[company_id], (err, rattings) => {
                        if (err) return reject(err);
                        resolve(rattings);
                    });
                });
                element.Ratting = ratting;
            } catch (err) {
                console.error(`Error fetching countries for ${name}:`, err);
                element.Ratting = []; // Set to empty array on error
            }

        }

        res.json({ message: result1, status: true });
    } catch (error) {
        console.error('Database Error:', error);
        res.json({ message: `Error in database: ${error.message}`, status: false });
    }
};

const submit_review = (req, res) => {
    const user_id = req.user.userid;
    const user_name = req.user.username
    const company_id = req.body.company_id;
    const rating = req.body.rating;
    const description = req.body.description;

    db.query('SELECT * FROM ratting WHERE user_id = ? AND company_id = ? ', [user_id, company_id], (err, result) => {
        if (err) {
            res.json({ message: 'error in database', status: false });
            return;
        } else {
            if (result.length > 0) {
                res.json({ message: 'Review alrady submitted', status: true });
            } else {
                db.query("INSERT INTO ratting SET ?", {
                    user_id: user_id,
                    company_id: company_id,
                    ratting: rating,
                    description: description,
                    user_name: user_name
                }, (err, result1) => {
                    if (err) {
                        res.json({ message: "error in database", status: false });
                        console.log("error", err);
                    } else {
                        res.json({ message: 'Review Submitted', status: true })

                    }
                })
            }
        }
    })

}

module.exports = {
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
    submit_review
};