const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');
const db = require('../Db_Connection');
require('dotenv').config({ path: './.env' });
const sendMail = require('../Email/Send_mail');


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

// multer storage
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
})
// const upload = multer({ storage: storage }).any();

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
}).fields([
    { name: "document", maxCount: 1 },
]);


// const send_groupage_submit = (req, res) => {
//     upload(req, res, async (err) => {
//         if (err) {
//             return res.status(400).json({ message: "File upload error", error: err.message });
//         }
//         const data = req.body;
//         // const images = req.files["images"] || [];
//         let imageUrls = [];
//         if (data["imageUrls[]"]) {
//             if (Array.isArray(data["imageUrls[]"])) {
//                 imageUrls = data["imageUrls[]"];
//             } else {
//                 // If single string, wrap as array
//                 imageUrls = [data["imageUrls[]"]];
//             }
//         }

//         if (data.imageUrls) {
//             try {
//                 const parsed = JSON.parse(data.imageUrls);
//                 if (Array.isArray(parsed)) {
//                     imageUrls = parsed;
//                 }
//             } catch (err) {
//                 // ignore parse error
//             }
//         }

//         const documentFile = req.files["document"] ? req.files["document"][0] : null;
//         let imageUploadPromises = [];
//         let documentUploadPromise = null;
//         images.forEach((file) => {
//             imageUploadPromises.push(
//                 cloudinary.uploader.upload(file.path, { folder: "send_transfer_img" })
//             );
//         });
//         if (documentFile) {
//             documentUploadPromise = cloudinary.uploader.upload(documentFile.path, { folder: "send_transfer_docs" });
//         }
//         try {
//             const uploadedImages = await Promise.all(imageUploadPromises);
//             const uploadedDocument = documentUploadPromise ? await documentUploadPromise : null;
//             const imageUrls = uploadedImages.map((img) => img.secure_url);
//             const documentUrl = uploadedDocument ? uploadedDocument.secure_url : null;
//             const responseData = {
//                 productInfo: {
//                     productName: data.productName,
//                     productType: data.productType,
//                     dimensions: {
//                         weight: data.Pweight,
//                         height: data.Pheight,
//                         length: data.Plength,
//                         width: data.Pwidth,
//                     },
//                     images: imageUrls,
//                 },
//                 pickUpInfo: {
//                     userName: data.userName,
//                     userNumber: data.userNumber,
//                     userEmail: data.userEmail,
//                     userCountry: data.userCountry,
//                     userState: data.userState,
//                     userCity: data.userCity,
//                     streetAddress: data.streetAddress,
//                     zipCode: data.zipCode,
//                     picking_period: data.picking_period,
//                     userDescription: data.userDescription,
//                 },
//                 deliveryInfo: {
//                     senderName: data.senderName,
//                     senderNumber: data.senderNumber,
//                     senderEmail: data.senderEmail,
//                     senderCountry: data.senderCountry,
//                     senderState: data.senderState,
//                     senderCity: data.senderCity,
//                     senderStreetAddress: data.senderStreetAddress,
//                     senderZipCode: data.senderZipCode,
//                     departureDate: data.departureDate,
//                     senderDescription: data.senderDescription,
//                 },
//                 additionalInfo: {
//                     document: documentUrl,
//                 },
//             };
//             const safeImage = (image) => (image !== undefined ? image : '');
//             const safeNumber = (num) => (num == '' || num === 'null' ? 0 : num);

//             db.query('INSERT INTO groupage SET ?', {
//                 groupage_created_by: req.user.useremail,
//                 payment_status: 'panding',
//                 product_name: responseData.productInfo.productName,
//                 product_type: responseData.productInfo.productType,
//                 p_weight: safeNumber(responseData.productInfo.dimensions.weight),
//                 p_height: safeNumber(responseData.productInfo.dimensions.height),
//                 p_length: safeNumber(responseData.productInfo.dimensions.length),
//                 p_width: safeNumber(responseData.productInfo.dimensions.width),
//                 sender_name: responseData.pickUpInfo.userName,
//                 sender_contact: responseData.pickUpInfo.userNumber,
//                 sender_email: responseData.pickUpInfo.userEmail,
//                 sender_country: responseData.pickUpInfo.userCountry,
//                 sender_state: responseData.pickUpInfo.userState,
//                 sender_city: responseData.pickUpInfo.userCity,
//                 sender_address: responseData.pickUpInfo.streetAddress,
//                 sender_zipcode: responseData.pickUpInfo.zipCode,
//                 sender_description: responseData.pickUpInfo.userDescription,
//                 pickup_date: responseData.pickUpInfo.picking_period,
//                 receiver_name: responseData.deliveryInfo.senderName,
//                 receiver_contact: responseData.deliveryInfo.senderNumber,
//                 receiver_email: responseData.deliveryInfo.senderEmail,
//                 receiver_country: responseData.deliveryInfo.senderCountry,
//                 receiver_state: responseData.deliveryInfo.senderState,
//                 receiver_city: responseData.deliveryInfo.senderCity,
//                 receiver_address: responseData.deliveryInfo.senderStreetAddress,
//                 receiver_zipcode: responseData.deliveryInfo.senderZipCode,
//                 receiver_description: responseData.deliveryInfo.senderDescription,
//                 departure_date: responseData.deliveryInfo.departureDate,
//                 img01: safeImage(responseData.productInfo.images[0]),
//                 img02: safeImage(responseData.productInfo.images[1]),
//                 img03: safeImage(responseData.productInfo.images[2]),
//                 img04: safeImage(responseData.productInfo.images[3]),
//                 img05: safeImage(responseData.productInfo.images[4]),
//                 img06: safeImage(responseData.productInfo.images[5]),
//                 img07: safeImage(responseData.productInfo.images[6]),
//                 img08: safeImage(responseData.productInfo.images[7]),
//                 img09: safeImage(responseData.productInfo.images[8]),
//                 img10: safeImage(responseData.productInfo.images[9]),
//                 document: safeImage(responseData.additionalInfo.document)
//             }, (err, result) => {
//                 if (err) {
//                     res.json({ message: 'error in database', status: false });
//                     console.log(err);
//                 } else {
//                     res.json({ message: 'Data inserted successfully', status: true });
//                 }
//             });
//             [...images.map((img) => img.path), documentFile?.path].forEach((filePath) => {
//                 if (filePath) fs.unlink(filePath, (err) => err && console.error("File deletion error:", err));
//             });

//         } catch (error) {
//             console.error("Cloudinary Upload Error:", error);
//             res.status(500).json({ message: "Error uploading files", error });
//         }
//     });
// }


const send_groupage_submit = (req, res) => {

    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: "File upload error", error: err.message });
        }

        const data = req.body;

        let imageUrls = [];
        if (data.imageUrls) {
            if (Array.isArray(data.imageUrls)) {
                imageUrls = data.imageUrls;
            } else {
                imageUrls = [data.imageUrls];
            }
        } else if (data["imageUrls[]"]) {
            if (Array.isArray(data["imageUrls[]"])) {
                imageUrls = data["imageUrls[]"];
            } else {
                imageUrls = [data["imageUrls[]"]];
            }
        }
        console.log(imageUrls);

        const documentFile = req.file;
        let documentUrl = null;

        if (documentFile) {
            try {
                const uploadedDocument = await cloudinary.uploader.upload(documentFile.path, { folder: "send_transfer_docs" });
                documentUrl = uploadedDocument.secure_url;
                fs.unlink(documentFile.path, (err) => err && console.error("File deletion error:", err));
            } catch (err) {
                console.error("Cloudinary doc upload error:", err);
                return res.status(500).json({ message: "Error uploading document", error: err });
            }
        }

        const responseData = {
            productInfo: {
                productName: data.productName,
                productType: data.productType,
                dimensions: {
                    weight: data.Pweight,
                    height: data.Pheight,
                    length: data.Plength,
                    width: data.Pwidth,
                },
                images: imageUrls,
            },
            pickUpInfo: {
                userName: data.userName,
                userNumber: data.userNumber,
                userEmail: data.userEmail,
                userCountry: data.userCountry,
                userState: data.userState,
                userCity: data.userCity,
                streetAddress: data.streetAddress,
                zipCode: data.zipCode,
                picking_period: data.picking_period,
                userDescription: data.userDescription,
            },
            deliveryInfo: {
                senderName: data.senderName,
                senderNumber: data.senderNumber,
                senderEmail: data.senderEmail,
                senderCountry: data.senderCountry,
                senderState: data.senderState,
                senderCity: data.senderCity,
                senderStreetAddress: data.senderStreetAddress,
                senderZipCode: data.senderZipCode,
                departureDate: data.departureDate,
                senderDescription: data.senderDescription,
            },
            additionalInfo: {
                document: documentUrl,
            },
        };

        const safeImage = (image) => (image !== undefined ? image : '');
        const safeNumber = (num) => (num == '' || num === 'null' ? 0 : num);

        db.query('INSERT INTO groupage SET ?', {
            groupage_created_by: req.user.useremail,
            payment_status: 'panding',
            product_name: responseData.productInfo.productName,
            product_type: responseData.productInfo.productType,
            p_weight: safeNumber(responseData.productInfo.dimensions.weight),
            p_height: safeNumber(responseData.productInfo.dimensions.height),
            p_length: safeNumber(responseData.productInfo.dimensions.length),
            p_width: safeNumber(responseData.productInfo.dimensions.width),
            sender_name: responseData.pickUpInfo.userName,
            sender_contact: responseData.pickUpInfo.userNumber,
            sender_email: responseData.pickUpInfo.userEmail,
            sender_country: responseData.pickUpInfo.userCountry,
            sender_state: responseData.pickUpInfo.userState,
            sender_city: responseData.pickUpInfo.userCity,
            sender_address: responseData.pickUpInfo.streetAddress,
            sender_zipcode: responseData.pickUpInfo.zipCode,
            sender_description: responseData.pickUpInfo.userDescription,
            pickup_date: responseData.pickUpInfo.picking_period,
            receiver_name: responseData.deliveryInfo.senderName,
            receiver_contact: responseData.deliveryInfo.senderNumber,
            receiver_email: responseData.deliveryInfo.senderEmail,
            receiver_country: responseData.deliveryInfo.senderCountry,
            receiver_state: responseData.deliveryInfo.senderState,
            receiver_city: responseData.deliveryInfo.senderCity,
            receiver_address: responseData.deliveryInfo.senderStreetAddress,
            receiver_zipcode: responseData.deliveryInfo.senderZipCode,
            receiver_description: responseData.deliveryInfo.senderDescription,
            departure_date: responseData.deliveryInfo.departureDate,
            img01: safeImage(responseData.productInfo.images[0]),
            img02: safeImage(responseData.productInfo.images[1]),
            img03: safeImage(responseData.productInfo.images[2]),
            img04: safeImage(responseData.productInfo.images[3]),
            img05: safeImage(responseData.productInfo.images[4]),
            img06: safeImage(responseData.productInfo.images[5]),
            img07: safeImage(responseData.productInfo.images[6]),
            img08: safeImage(responseData.productInfo.images[7]),
            img09: safeImage(responseData.productInfo.images[8]),
            img10: safeImage(responseData.productInfo.images[9]),
            document: safeImage(responseData.additionalInfo.document)
        }, (err, result) => {
            if (err) {
                res.json({ message: 'error in database', status: false });
                console.log(err);
            } else {
                res.json({ message: 'Data inserted successfully', status: true });
            }
        });
    });
};

//display to the user dashboard
const display_user_dashboard = (req, res) => {
    if (req.user.useremail) {
        db.query('SELECT * FROM groupage WHERE groupage_created_by = ?', [req.user.useremail], (err, result) => {
            if (err) {
                res.json({ message: "error in database", status: false });
            } else {
                res.json({ message: result, status: true });
            }
        })
    } else {
        res.json({ message: 'User not found Login again', status: false });
    }
}

//delete for the user
const delete_groupage = (req, res) => {
    if (req.user.useremail) {
        const id = req.params.id;
        db.query('DELETE FROM groupage WHERE id = ?', id, (err, result) => {
            if (err) {
                res.json({ message: 'error in database', status: false });
            } else {
                res.json({ message: 'Deleted successfully', status: true });
            }
        });
    } else {
        res.json({ message: 'User not found Login again', status: false });
    }
}

//show all groupage user
const show_all_groupage = (req, res) => {
    db.query('SELECT id, product_name, product_type, p_weight, p_height, p_length, p_width, sender_country, sender_state, sender_city, sender_zipcode, receiver_country, receiver_state, receiver_city, sender_description, RIGHT(sender_contact, 4) AS sender_contact, RIGHT(receiver_contact, 4) AS receiver_contact, img01, img02, img03, img04, img05, img06, img07, img08, img09, img10, created_at, pickup_date, payment_status FROM groupage where payment_status = "panding" ', (err, result) => {
        if (err) {
            res.json({ message: 'error in database', status: false });
        } else {
            res.json({ message: result, status: true });
        }
    });
}

const show_4_groupage = (req, res) => {
    db.query('SELECT id, product_name, product_type, p_weight, p_height, p_length, p_width, sender_country, sender_state, sender_city, sender_zipcode,        receiver_country, receiver_state, receiver_city, sender_description, RIGHT(sender_contact, 4) AS sender_contact, RIGHT(receiver_contact, 4) AS receiver_contact, img01, img02, img03, img04, img05, img06, img07, img08, img09, img10, created_at, pickup_date FROM groupage where payment_status = "panding" ORDER BY created_at DESC LIMIT 4', (err, result) => {
        if (err) {
            res.json({ message: 'error in database', status: false });
        } else {
            res.json({ message: result, status: true });
        }
    })
}

//create the offer
const create_offer = (req, res) => {
    const data = req.body;
    if (req.user.company === 'yes') {

        db.query('SELECT * FROM offers WHERE created_by_id = ? AND groupage_id = ?', [req.user.userid, data.offer_id], (err, result) => {
            if (err) {
                console.log(err, '1')
                res.json({ message: 'error in database', status: false });
            } else {
                if (result.length === 0) {
                    const commission = ((data.offer_amount * 10) / 100).toFixed(1);
                    console.log(commission, '2');
                    console.log('address-:', data.office_address);
                    db.query('INSERT INTO offers SET ?', { groupage_id: data.offer_id, created_by_email: req.user.useremail, created_by_id: req.user.userid, amount: data.offer_amount, commission: commission, expeted_date: data.expected_date, office_address: data.office_address, accepted: 0, status: 'pending' }, (err, result) => {
                        if (err) {
                            console.log(err, '12')
                            res.json({ message: 'error in database', status: false });
                        } else {
                            db.query('SELECT groupage_created_by FROM groupage WHERE id = ?', [data.offer_id], (err, result) => {
                                if (err) {
                                    console.log(err, '123')
                                    res.json({ message: 'error in database', status: false });
                                }
                                else {
                                    res.json({ message: 'Data inserted successfully', status: true });
                                    console.log('email', result[0].groupage_created_by)
                                    // const amount = parseFloat(data.offer_amount) + parseFloat(commission);
                                    // console.log(amount, '-: Amount');
                                    sendMail(
                                        result[0].groupage_created_by,
                                        "Offer received from a transporter",
                                        `<h3>There is a new offer from a transporter.</h3>
                                        <br><br><br><h4>Details-:</h4><p>Amount: €${parseFloat(data.offer_amount) + parseFloat(commission)}</p><p>Pickup Date: ${data.expected_date}</p>
                                        ${data.office_address ? `<br><br><h4>Note -: The transporter does not pick up the groupage. Please bring it to their address.</h4><br><br> ` 
                                            :`<br><br><h4>Note -: The transporter will pick up the groupage from your pickup address.</h4><br><br>`}`
                                    )
                                    // <h5>Transporter's Adress -: </h5> <p>${data.office_address}</p>
                                        .then(info => console.log({ info }))
                                        .catch(console.error);

                                }
                            });
                        }
                    });
                } else {
                    const commission = (data.offer_amount * 10) / 100;
                    db.query('UPDATE offers SET amount = ?, commission = ?, expeted_date = ? WHERE groupage_id = ? AND created_by_id = ?', [data.offer_amount, commission, data.expected_date, data.offer_id, req.user.userid], (err, result) => {
                        if (err) {
                            console.log(err, '123')
                            res.json({ message: 'error in database', status: false });
                        } else {
                            res.json({ message: 'Data inserted successfully Update', status: true });
                        }
                    });
                }
            }
        });
    } else {
        res.json({ message: 'Login with a company email id', status: false });
    }
}

//show offers to the user
const show_offers_user = (req, res) => {
    const userEmail = req.user.useremail;

    // Get groupage data for the user
    db.query('SELECT * FROM groupage WHERE groupage_created_by = ?', [userEmail], (err, groupageResults) => {
        if (err) {
            console.log(err);
            return res.json({ message: 'Database error', status: false });
        }

        if (groupageResults.length === 0) {
            return res.json({ message: 'No data found', status: false });
        }

        // Extract groupage IDs
        const groupageIds = groupageResults.map(g => g.id);

        // Get offers that match the groupage IDs
        db.query('SELECT * FROM offers WHERE groupage_id IN (?)', [groupageIds], (err, offerResults) => {
            if (err) {
                console.log(err);
                return res.json({ message: 'Database error', status: false });
            }

            // Merge groupage and offers based on groupage_id
            const mergedData = offerResults.map(offer => {
                const groupage = groupageResults.find(g => g.id === offer.groupage_id);
                return {
                    order_id: groupage.id,
                    product_name: groupage.product_name || "N/A",
                    offer_id: offer.offer_id,
                    created_date: offer.created_at,
                    price: Number((parseFloat(offer.amount)).toFixed(2)),
                    commission: offer.commission,
                    delivery_duration: offer.expeted_date,
                    office_address: offer.office_address,
                    accepted: offer.accepted,
                    status: offer.status,
                };
            });

            res.json({ message: mergedData, status: true });
        });
    });
}

//delete the offer of the user
const delete_offer_user = (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM offers WHERE offer_id = ?', id, (err, result) => {
        if (err) {
            console.log(err);
            res.json({ message: 'error in database', status: false });
        } else {
            res.json({ message: 'Deleted successfully', status: true });
        }
    });
}

//return the groupage data info
const groupage_info = (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM groupage WHERE id = ?', id, (err, result) => {
        if (err) {
            res.json({ message: 'error in database', status: false });
        } else {
            res.json({ message: result[0], status: true });
        }
    });
}

//update status
const update_stats_offer = (req, res) => {
    const id = req.params.id;
    db.query('UPDATE offers SET accepted = ? WHERE offer_id = ?', [1, id], (err, result) => {
        if (err) {
            res.json({ message: 'error in database', status: false });
        } else {
            res.json({ message: 'Updated successfully', status: true });
        }
    });
}
module.exports = { send_groupage_submit, display_user_dashboard, delete_groupage, show_all_groupage, show_4_groupage, create_offer, show_offers_user, delete_offer_user, groupage_info, update_stats_offer };