import React, { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";

const Paypal_payment = ({ selected_offer, handleAcceptOffer }) => {
    const port = process.env.REACT_APP_SECRET;
    // console.log(selected_offer, handleAcceptOffer);

    const [message, setMessage] = useState("");

    const initialOptions = {
        "client-id": "AZOcns1edlBV838gnlQgdp25SJW-RXc8Kle0FL3dTj0t289XKg2W7hXOJFG9zngWOko3VQqERais4-aY",
        currency: "USD",
        components: "buttons",
    };

    return (
        <div>
            <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons
                    style={{ layout: "vertical", color: "gold", label: "paypal" }}

                    createOrder={async () => {
                        try {
                            const response = await fetch(`${port}/paypal/api/orders`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    offer: {
                                        id: selected_offer.id, // Pass the selected offer ID
                                        amount: selected_offer.price, // Pass the selected offer price
                                        name: selected_offer.product_name, // Offer name
                                    },
                                }),
                            });

                            const orderData = await response.json();

                            if (orderData.id) {
                                console.log("Order created successfully with ID:", orderData.id);
                                return orderData.id || "";
                            } else {
                                console.error("Error creating order:", orderData);
                                return ""; // Return an empty string if order creation fails
                            }
                        } catch (error) {
                            console.error("Error in createOrder:", error);
                            setMessage(`Could not initiate PayPal Checkout: ${error.message}`);
                            return ""; // Ensure a return value even in case of failure
                        }
                    }}

                    onApprove={async (data, actions) => {
                        try {
                            const response = await axios.post(`${port}/paypal/api/orders/${data.orderID}/capture`);
                            const orderData = response.data;

                            if (orderData.status === "COMPLETED") {
                                const transaction = orderData.purchase_units[0].payments.captures[0];

                                // Send transaction details to the backend
                                await axios.post(`${port}/paypal/api/save_transaction`, {
                                    orderId: data.orderID,
                                    transactionId: transaction.id,
                                    offerId: selected_offer.id,
                                    amount: transaction.amount.value,
                                    status: orderData.status,
                                }).then((response) => {
                                    console.log(response.data);
                                }).catch((err) => {console.log(err)});

                                setMessage(`Transaction successful: ${transaction.id}`);
                                console.log("Capture result", orderData);

                                // Accept the offer after a successful transaction
                                handleAcceptOffer(selected_offer);
                            }
                        } catch (error) {
                            console.error(error);
                            setMessage(`Transaction failed: ${error.message}`);
                        }
                    }}
                />
            </PayPalScriptProvider>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Paypal_payment;