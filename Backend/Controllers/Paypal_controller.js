const db = require('../Db_Connection');
const axios = require('axios');
require('dotenv').config();

// console.log(process.env.PAYPAL_SECRET, 'hello \n',process.env.PAYPAL_CLIENT_ID);
const base = 'https://api-m.paypal.com';
// const base = 'https://api-m.sandbox.paypal.com';
async function generateAccessToken() {
    const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString('base64');

    const response = await axios.post(`${base}/v1/oauth2/token`, 'grant_type=client_credentials', {
        headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    return response.data.access_token;
}

const capture_order_route = async (req, res) => {
    const accessToken = await generateAccessToken();

    const response = await axios.post(
        `${base}/v2/checkout/orders`,
        {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: 'EUR',
                        value: req.body.amount,
                    },
                },
            ],
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        }
    );

    res.json(response.data);
}

const create_payment_api = async (req, res) => {
    const accessToken = await generateAccessToken();

  const response = await axios.post(
    `${base}/v2/checkout/orders/${req.params.orderID}/capture`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  res.json(response.data);
}

// Function to send order information
const send_information = (req, res) => {
    const { orderId, transactionId, offerId, amount, status, paypal_id, payment_time } = req.body;
    const user_id = req.user.userid;
    const user_email = req.user.useremail;
    // console.log(orderId, transactionId, paypal_id, offerId, amount, status, user_id, user_email);
    if (!orderId || !transactionId || !paypal_id || !offerId || !amount || !status|| !payment_time) {
        return res.status(400).json({ error: "Missing required fields." });
    }
    db.query(
        `INSERT INTO payment_info_customers (user_id, user_email, transaction_id, order_id, paypal_id, offer_id, payment_info_amount, payment_info_status, payment_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [user_id, user_email, transactionId, orderId, paypal_id, offerId, amount, status, payment_time],
        (error, result) => {
            if (error) {
                return res.status(500).json({ error: "Error processing data" });
            } else {
                db.query('UPDATE offers SET status = ? , accepted = ? WHERE offer_id = ?', ['complete', 1, offerId], (error, result) => {
                    if (error) {
                        console.error("Error updating offer status:", error);
                        return res.status(500).json({ error: "Error updating offer status" });
                    }
                });
                db.query('SELECT groupage_id FROM offers WHERE offer_id = ?', [offerId], (error, result) => {
                    if (error) {
                        console.error("Error fetching groupage ID:", error);
                        return res.status(500).json({ error: "Error fetching groupage ID" });
                    } else {
                        db.query('UPDATE groupage SET payment_status = ? WHERE id = ?', ['complete', result[0].groupage_id], (error, result) => {
                            if (error) {
                                console.error("Error updating offer status:", error);
                                return res.status(500).json({ error: "Error updating offer status" });
                            }
                        });
                        db.query('UPDATE offers SET status = ? WHERE groupage_id = ? AND offer_id != ?', ['rejected', result[0].groupage_id, offerId], (err, result) => {
                            if(err){
                                console.error("Error updating offer status:", err);
                                return res.status(500).json({ error: "Error updating offer status" });
                            }
                        })                        
                    }
                });
                res.json({
                    message: 'transaction successfull',
                    orderid: orderId,
                    transactionid: transactionId,
                    paypal_id: paypal_id,
                    offerid: offerId,
                    amount: amount,
                    status: status,
                    user_id: user_id,
                    user_email: user_email,
                    payment_time: payment_time,
                    current_status: true
                });
            }
        }
    );
};

const paypal_test_api = (req, res) => {
    const user_id = req.user.userid;
    const user_email = req.user.useremail;
    const offerId = req.body.offerId;
    const amount = req.body.amount;

console.log(user_id, user_email, offerId, amount);
    db.query(
        `INSERT INTO payment_info_customers (user_id, user_email, transaction_id, order_id, paypal_id, offer_id, payment_info_amount, payment_info_status, payment_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [user_id, user_email, '1234567890', '11223454545', '1234566789908', amount, '45634563', '234534532452345', '43234523452345'],
        (error, result) => {
            if (error) {
                return res.status(500).json({ error: "Error processing data" });
            } else {
                db.query('UPDATE offers SET status = ? , accepted = ? WHERE offer_id = ?', ['complete', 1, offerId], (error, result) => {
                    if (error) {
                        console.error("Error updating offer status:", error);
                        return res.status(500).json({ error: "Error updating offer status" });
                    }
                });
                db.query('SELECT groupage_id FROM offers WHERE offer_id = ?', [offerId], (error, result) => {
                    if (error) {
                        console.error("Error fetching groupage ID:", error);
                        return res.status(500).json({ error: "Error fetching groupage ID" });
                    } else {
                        db.query('UPDATE groupage SET payment_status = ? WHERE id = ?', ['complete', result[0].groupage_id], (error, result) => {
                            if (error) {
                                console.error("Error updating offer status:", error);
                                return res.status(500).json({ error: "Error updating offer status" });
                            }
                        });
                        db.query('UPDATE offers SET status = ? WHERE groupage_id = ? AND offer_id != ?', ['rejected', result[0].groupage_id, offerId], (err, result) => {
                            if(err){
                                console.error("Error updating offer status:", err);
                                return res.status(500).json({ error: "Error updating offer status" });
                            }
                        })                        
                    }
                });
                res.json({
                    message: 'transaction successfull',                    
                    offerid: offerId,                    
                    user_id: user_id,
                    user_email: user_email,                    
                    current_status: true
                });
            }
        }
    );
}

module.exports = {
    capture_order_route,
    create_payment_api,
    send_information,
    paypal_test_api
};




// const db = require('../Db_Connection');
// require("dotenv").config();

// const paypal = require("@paypal/checkout-server-sdk");
// const OrdersCreateRequest = paypal.orders.OrdersCreateRequest;
// const OrdersCaptureRequest = paypal.orders.OrdersCaptureRequest;

// // Set up PayPal environment
// // const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

// const environment = new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
// const client = new paypal.core.PayPalHttpClient(environment);
// const create_order_api = async (req, res) => {
//     // console.log('hello');
//     try {
//         const { offer } = req.body;
//         if (!offer || !offer.amount || !offer.id || !offer.name) {
//             return res.status(400).json({ error: "Invalid offer data." });            
//         }
//         const request = new paypal.orders.OrdersCreateRequest();
//         request.requestBody({
//             intent: "CAPTURE",
//             purchase_units: [
//                 {
//                     amount: {
//                         currency_code: "USD",
//                         value: offer.amount,
//                         breakdown: {
//                             item_total: {
//                                 currency_code: "USD",
//                                 value: offer.amount, // Ensure this matches the sum of items
//                             }
//                         }
//                     },
//                     items: [
//                         {
//                             name: offer.name,
//                             unit_amount: {
//                                 currency_code: "USD",
//                                 value: offer.amount,
//                             },
//                             quantity: "1",
//                             description: `Payment for ${offer.name}`,
//                             sku: offer.id,
//                         }
//                     ]
//                 }
//             ]
//         });

//         const response = await client.execute(request);
//         res.status(response.statusCode).json(response.result);
//     } catch (error) {
//         console.error("Failed to create order:", error);
//         res.status(500).json({ error: "Failed to create order." });
//     }
// };

// // Function to capture an order
// const capture_order_route = async (req, res) => {
//     try {
//         const { orderID } = req.params;
//         if (!orderID) {
//             return res.status(400).json({ error: "Order ID is required." });
//         }

//         const request = new OrdersCaptureRequest(orderID);
//         request.requestBody({});

//         const response = await client.execute(request);
//         res.status(response.statusCode).json(response.result);
//     } catch (error) {
//         console.error("Failed to capture order:", error);
//         res.status(500).json({ error: "Failed to capture order." });
//     }
// };
