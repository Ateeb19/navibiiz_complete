const db = require('../Db_Connection');
require("dotenv").config();

const paypal = require("@paypal/checkout-server-sdk");
const OrdersCreateRequest = paypal.orders.OrdersCreateRequest;
const OrdersCaptureRequest = paypal.orders.OrdersCaptureRequest;

// Set up PayPal environment
// const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

const environment = new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
const client = new paypal.core.PayPalHttpClient(environment);
const create_order_api = async (req, res) => {
    // console.log('hello');
    try {
        const { offer } = req.body;
        if (!offer || !offer.amount || !offer.id || !offer.name) {
            return res.status(400).json({ error: "Invalid offer data." });            
        }
        const request = new paypal.orders.OrdersCreateRequest();
        request.requestBody({
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: offer.amount,
                        breakdown: {
                            item_total: {
                                currency_code: "USD",
                                value: offer.amount, // Ensure this matches the sum of items
                            }
                        }
                    },
                    items: [
                        {
                            name: offer.name,
                            unit_amount: {
                                currency_code: "USD",
                                value: offer.amount,
                            },
                            quantity: "1",
                            description: `Payment for ${offer.name}`,
                            sku: offer.id,
                        }
                    ]
                }
            ]
        });

        const response = await client.execute(request);
        res.status(response.statusCode).json(response.result);
    } catch (error) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to create order." });
    }
};

// Function to capture an order
const capture_order_route = async (req, res) => {
    try {
        const { orderID } = req.params;
        if (!orderID) {
            return res.status(400).json({ error: "Order ID is required." });
        }

        const request = new OrdersCaptureRequest(orderID);
        request.requestBody({});

        const response = await client.execute(request);
        res.status(response.statusCode).json(response.result);
    } catch (error) {
        console.error("Failed to capture order:", error);
        res.status(500).json({ error: "Failed to capture order." });
    }
};

// Function to send order information
const send_information = (req, res) => {
    const { orderId, transactionId, offerId, amount, status, paypal_id } = req.body;
    const user_id = req.user.userid;
    const user_email = req.user.useremail;
    console.log(orderId, transactionId, paypal_id, offerId, amount, status, user_id, user_email);
    if (!orderId || !transactionId || !paypal_id || !offerId || !amount || !status) {
        return res.status(400).json({ error: "Missing required fields." });
    }
    db.query(
        `INSERT INTO payment_info_customers (user_id, user_email, transaction_id, order_id, paypal_id, offer_id, payment_info_amount, payment_info_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [user_id, user_email, transactionId, orderId, paypal_id, offerId, amount, status],
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
                    user_email: user_email
                });
                console.log("Transaction inserted successfully:", result);
            }
        }
    );
};

module.exports = {
    capture_order_route,
    create_order_api,
    send_information
};
