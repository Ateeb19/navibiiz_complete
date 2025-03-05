const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');
const db = require('../Db_Connection');
require('dotenv').config({ path: './.env' });

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

//function to delete all the images in the send_transport_img folder 
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
    { name: "images", maxCount: 10 },
    { name: "document", maxCount: 1 },
]);


const send_groupage_submit = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: "File upload error", error: err.message });
        }
        const data = req.body;
        const images = req.files["images"] || [];
        const documentFile = req.files["document"] ? req.files["document"][0] : null;
        let imageUploadPromises = [];
        let documentUploadPromise = null;
        images.forEach((file) => {
            imageUploadPromises.push(
                cloudinary.uploader.upload(file.path, { folder: "send_transfer_img" })
            );
        });
        if (documentFile) {
            documentUploadPromise = cloudinary.uploader.upload(documentFile.path, { folder: "send_transfer_docs" });
        }
        try {
            const uploadedImages = await Promise.all(imageUploadPromises);
            const uploadedDocument = documentUploadPromise ? await documentUploadPromise : null;
            const imageUrls = uploadedImages.map((img) => img.secure_url);
            const documentUrl = uploadedDocument ? uploadedDocument.secure_url : null;
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
            const safeNumber = (num) => (num === undefined && num === null && num === '' ? num : 0);

            db.query('INSERT INTO groupage SET ?', {
                created_by: req.user.useremail, 
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
                img02: safeImage(responseData.productInfo.images[1] ), 
                img03: safeImage(responseData.productInfo.images[2] ), 
                img04: safeImage(responseData.productInfo.images[3] ), 
                img05: safeImage(responseData.productInfo.images[4] ), 
                img06: safeImage(responseData.productInfo.images[5] ), 
                img07: safeImage(responseData.productInfo.images[6] ), 
                img08: safeImage(responseData.productInfo.images[7] ), 
                img09: safeImage(responseData.productInfo.images[8] ), 
                img10: safeImage(responseData.productInfo.images[9] ), 
                document: safeImage(responseData.additionalInfo.document)
            }, (err, result) => {
                if(err){
                    res.json({message: 'error in database', status: false});
                    console.log(err);
                }else{
                    res.json({ message: 'Data inserted successfully', status: true });
                }
            });
            [...images.map((img) => img.path), documentFile?.path].forEach((filePath) => {
                if (filePath) fs.unlink(filePath, (err) => err && console.error("File deletion error:", err));
            });

        } catch (error) {
            console.error("Cloudinary Upload Error:", error);
            res.status(500).json({ message: "Error uploading files", error });
        }
    });
}

const send_transport_display = (req, res) => {
    db.query('SELECT * FROM send_transport', (err, result) => {
        if (err) {
            res.json({ message: 'error in database', status: false });
        } else {
            res.json({ message: result, status: true });
        }
    })
}
module.exports = { send_transport_display, send_groupage_submit }