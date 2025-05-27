import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import { useAlert } from "../alert/Alert_message";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function OfferDetails({ selected_offer }) {
    const port = process.env.REACT_APP_SECRET;
    const [showPayPalButton, setShowPayPalButton] = useState(false);
    const [transactionId, setTraansactionId] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowPayPalButton(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, [selected_offer]);

    const createOrder = async () => {
        const { data } = await axios.post(`${port}/paypal/api/create-order`, {
            amount: selected_offer.price,
        });
        return data.id;
    };
    const { showAlert } = useAlert();


    const onApprove = async (data) => {
        const response = await axios.post(`${port}/paypal/api/capture-order/${data.orderID}`);


        const transactionData = {
            transaction_ID: response.data.purchase_units[0].payments.captures[0].id,
            orderId: response.data.id, // PayPal order ID
            payerId: response.data.payer.payer_id,
            payerEmail: response.data.payer.email_address,
            payerName: `${response.data.payer.name.given_name} ${response.data.payer.name.surname}`,
            amount: response.data.purchase_units[0].payments.captures[0].amount.value,
            currency: response.data.purchase_units[0].payments.captures[0].amount.currency_code,
            status: response.data.status,
            paymentTime: response.data.purchase_units[0].payments.captures[0].create_time,
        };

        axios.post(`${port}/paypal/api/save_transaction`, {
            orderId: transactionData.orderId,
            transactionId: response.data.purchase_units[0].payments.captures[0].id,
            offerId: selected_offer.offer_id,
            amount: transactionData.amount,
            status: transactionData.status,
            paypal_id: transactionData.payerId,
            payment_time: transactionData.paymentTime,
        }, {
            headers: {
                Authorization: localStorage.getItem('token'),
            }
        }).then((res) => {
            if (res.data.current_status === true) {
                setTraansactionId(transactionData.transaction_ID)
            }
        }).catch((err) => { console.log(err) });
    };



    return (
        <div className="d-flex flex-column w-100 align-items-center justify-content-center">
            {showPayPalButton && (
                <div className="mt-3 w-100">
                    {/* <PayPalScriptProvider options={{ "client-id": "AabacLi27CRoLZCcaHTYgUesly35TFDCyoMmm3Vep3pSPbHrLuBNL7-LYbdvtNsFVnWNHoK1Nyq5dDSX" }}> */}
                    <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        style={{ layout: "horizontal", color: "gold", shape: "pill", label: "pay" }}
                    />
                    {/* </PayPalScriptProvider> */}
                </div>
            )}
            {transactionId && (
                <>
                    <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center" style={{ zIndex: 1050 }}>

                        <div className="position-relative bg-white p-4 rounded shadow-lg" style={{ width: '580px', height: '25rem' }}>

                            <div className="success-img-wrap">
                                <img src="/Images/Party_Popper.png" alt="congratulation" />
                            </div>

                            <div className="title-head">
                                <h3 style={{ color: ' #1ba300' }}>CONGRATULATIONS</h3>
                            </div>

                            <div className="success-des-wrap">
                                <p>You have successfully complete the transaction.<br /> Transaction id -: {transactionId}</p>
                            </div>

                            <div className="success-button">
                                <button className="btn-success" onClick={() => {
                                    navigate('/dashboard');
                                    localStorage.setItem('activeSection', 'dashboard')
                                    setTraansactionId('');
                                    window.location.reload();
                                }}>Go To Dashboard</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default OfferDetails;




// import React, { useState, useEffect } from "react";
// import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
// import axios from "axios";
// import { useAlert } from "../alert/Alert_message";

// const Paypal_payment = ({ selected_offer, handleAcceptOffer }) => {
//     const port = process.env.REACT_APP_SECRET;
//     const { showAlert } = useAlert();
//     const [message, setMessage] = useState("");

//     const initialOptions = {
//         "client-id": "Ae-QJja_9j4sH-PmGLdd6ghIT_9_A1IUicHytfy9i0sV4ZDZLsUn8bcfyW1SBF_3CNc0OGQoGZGOZ_8a",
//         currency: "USD",
//         components: "buttons",
//     };
//     const token = localStorage.getItem('token');
//     const [showPaypal, setShowPaypal] = useState(false);

//     useEffect(() => {
//         if (selected_offer) {
//             setTimeout(() => setShowPaypal(true), 200);
//         }
//     }, [selected_offer]);
//     return (
//         <div>
//             {showPaypal && selected_offer && (
//                 <PayPalButtons
//                     key={selected_offer?.offer_id}
//                     style={{ layout: "vertical", color: "gold", label: "paypal" }}

//                     createOrder={async () => {
//                         try {
//                             const response = await fetch(`${port}/paypal/api/orders`, {
//                                 method: "POST",
//                                 headers: {
//                                     "Content-Type": "application/json",
//                                 },
//                                 body: JSON.stringify({
//                                     offer: {
//                                         id: selected_offer.offer_id,
//                                         amount: selected_offer.price,
//                                         name: selected_offer.product_name,
//                                     },
//                                 }),
//                             });

//                             const orderData = await response.json();

//                             if (orderData.id) {
//                                 return orderData.id || "";
//                             } else {
//                                 console.error("Error creating order:", orderData);
//                                 return "";
//                             }
//                         } catch (error) {
//                             console.error("Error in createOrder:", error);
//                             showAlert(`Could not initiate PayPal Checkout: ${error.message}`);
//                             setMessage(`Could not initiate PayPal Checkout: ${error.message}`);
//                             return "";
//                         }
//                     }}

//                     onApprove={async (data, actions) => {
//                         try {
//                             const response = await axios.post(`${port}/paypal/api/orders/${data.orderID}/capture`);
//                             const orderData = response.data;

//                             if (orderData.status === "COMPLETED") {
//                                 const transaction = orderData.purchase_units[0].payments.captures[0];

//                                 await axios.post(`${port}/paypal/api/save_transaction`, {
//                                     orderId: data.orderID,
//                                     transactionId: transaction.id,
//                                     offerId: selected_offer.offer_id,
//                                     amount: transaction.amount.value,
//                                     status: orderData.status,
//                                     paypal_id: orderData.payer.payer_id,
//                                 }, {
//                                     headers: {
//                                         Authorization: token,
//                                     }
//                                 }).then((response) => {
//                                 }).catch((err) => { console.log(err) });

//                                 setMessage(`Transaction successful: ${transaction.id}`);
//                                 showAlert(`Transaction successfull: ${transaction.id}`)

//                                 handleAcceptOffer(selected_offer);
//                             }
//                         } catch (error) {
//                             console.error(error);
//                             setMessage(`Transaction failed: ${error.message}`);
//                             showAlert(`Transaction failed: ${error.message}`);
//                         }
//                     }}
//                 />
//             )}
//             {message && <p>{message}</p>}

//         </div>
//     );
// }

// export default Paypal_payment;