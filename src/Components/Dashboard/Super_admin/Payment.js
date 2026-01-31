import React, { useEffect, useState } from "react";
import { BsBuildingFillCheck } from "react-icons/bs";
import { FaUserAlt } from "react-icons/fa";
import { FaSackDollar } from "react-icons/fa6";
import { MdAttachEmail, MdOutlineDateRange, MdPermContactCalendar } from "react-icons/md";
import { PiContactlessPaymentFill, PiHandCoinsBold } from "react-icons/pi";
import { useAlert } from "../../alert/Alert_message";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useIsMobile from "../../hooks/useIsMobile";

const Payment = () => {
    const port = process.env.REACT_APP_SECRET;
    const { showAlert } = useAlert();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const [payment_details, setPayment_details] = useState('');
    const [S_admin_payment, setS_admin_payment] = useState([]);
    const [payment_search, setPayment_search] = useState('');
    const [payment_date, setPayment_date] = useState('');
    const isMobile = useIsMobile();

    const payment_history = () => {
        if (userRole === 'Sadmin') {
            axios.get(`${port}/S_admin/payment_history`, {
                headers: {
                    Authorization: token,
                }
            }).then((response) => {
                if (response.data.status === true) {
                    setS_admin_payment(response.data.message);
                } else {
                    setS_admin_payment('');
                }
            }).catch((err) => { console.log(err) });
        }
    }


    useEffect(() => {
        payment_history();
    }, [])
    const commission_percentage = 1.3;

    const S_admin_payment_status = (item) => {
        axios.post(`${port}/s_admin/payment_information`,
            {
                user_email: item.user_email,
                offer_id: item.offer_id,
            },
            {
                headers: {
                    Authorization: token,
                }
            }
        )
            .then((response) => {
                if (response.data.status === true) {
                    const combinedDetails = {
                        ...item,
                        ...response.data.message
                    };
                    setPayment_details(combinedDetails);
                } else {
                    setPayment_details(null);
                }
            })
            .catch((err) => {
                console.error('API error:', err);
            });
    };
    const filteredPayments = S_admin_payment.filter((item) => {
        const matchesSearch = payment_search === "" ||
            item.transaction_id?.toLowerCase().includes(payment_search.toLowerCase()) ||
            item.offer_id?.toString().includes(payment_search) ||
            item.payment_info_amount?.toString().includes(payment_search);

        const matchesDate = payment_date === "" ||
            (item.payment_time && new Date(item.payment_time).toISOString().split("T")[0] === payment_date);

        return matchesSearch && matchesDate;
    });

    return (
        <>
            <div className="bg-light pb-5" style={{ width: '100%', overflow: 'auto', marginBottom: '70px' }}>

                <div className="d-flex justify-content-start align-items-center ps-3 rounded-1" >
                    <div className="d-flex ps-4 w-100 justify-content-start">
                        <label className="fs-3"><strong>Payment History</strong></label>
                    </div>
                </div>

                <div className="dashboard-wrapper-box">
                    <div className="table-wrap">
                        <div className="table-filter-wrap">
                            <div className="d-flex flex-column align-items-start justify-content-start ps-2 mb-3 w-100">
                                <h5>Filter By:</h5>
                                <div className="row w-100 g-2 mt-1 ">
                                    <div className="col-12 col-md-6 col-lg-8">
                                        <input type="text" className="shipping-input-field" placeholder="Search here..." onChange={(e) => setPayment_search(e.target.value)} value={payment_search} />
                                    </div>

                                    <div className="col-12 col-md-6 col-lg-4 position-relative">
                                        <input type="date" className="shipping-input-field" placeholder="Pick up date" onChange={(e) => setPayment_date(e.target.value)} value={payment_date} />
                                    </div>
                                </div>
                            </div>

                            {isMobile ? (
                                <>
                                    <div className="d-flex flex-column w-100 align-items-center justify-content-center gap-3">
                                        {S_admin_payment && S_admin_payment.length > 0 ? (
                                            <>
                                                {filteredPayments.map((item, index) => (
                                                    <>
                                                        <div className="orders-mobile-card w-100">
                                                            <div className="d-flex justify-content-between w-100">
                                                                <div className="text-start">
                                                                    <div className="d-flex gap-2">
                                                                        <h5>Offer Id :  </h5> <h5 className="text-primary">#{item.offer_id}</h5>
                                                                    </div>
                                                                    <div className="d-flex">
                                                                        <h5>Transaction Id : {item.transaction_id}</h5>
                                                                    </div>
                                                                </div>
                                                                <div className="d-flex align-items-center justify-content-center">

                                                                </div>
                                                            </div>

                                                            <div className="d-flex flex-column justify-content-start align-items-start">
                                                                <h5>Payment Receive Date: {item.payment_time ? new Date(item.payment_time).toISOString().split("T")[0] : ""}</h5>
                                                                <h5>Amount (€) : {item.payment_info_amount}</h5>
                                                                <h5>Commission :  {(() => {
                                                                    const T = parseFloat(item.payment_info_amount);
                                                                    const com = T - (T / commission_percentage);
                                                                    return com.toFixed(2);
                                                                })()}</h5>
                                                            </div>
                                                        </div>
                                                    </>
                                                ))}
                                            </>
                                        ) : (
                                            <>

                                            </>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>

                                    <div className="table-responsive w-100">

                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th scope="col"><h6>Offer Id</h6></th>
                                                    <th scope="col"><h6>Transaction Id</h6></th>
                                                    <th scope="col"><h6>Payment Receive Date</h6></th>
                                                    <th scope="col"><h6>Amount (€)</h6></th>
                                                    <th scope="col"><h6>Commission</h6></th>
                                                </tr>
                                            </thead>
                                            {S_admin_payment && S_admin_payment.length > 0 ? (
                                                <tbody>
                                                    {filteredPayments.map((item, index) => (
                                                        <tr key={index}>
                                                            <td className="text-primary" style={{ cursor: 'pointer' }} onClick={() => S_admin_payment_status(item)}>#{item.offer_id}</td>
                                                            <td className="text-secondary">{item.transaction_id}</td>
                                                            <td className="text-secondary">{item.payment_time ? new Date(item.payment_time).toISOString().split("T")[0] : ""}</td>
                                                            <td className="text-secondary">{item.payment_info_amount}</td>
                                                            <td className="text-secondary">
                                                                {(() => {
                                                                    const T = parseFloat(item.payment_info_amount);
                                                                    const com = T - (T / commission_percentage);
                                                                    return com.toFixed(2);
                                                                })()}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            ) : (
                                                <tbody>
                                                    <tr>
                                                        <td colSpan="6" className="text-center text-secondary">No Data</td>
                                                    </tr>
                                                </tbody>
                                            )}
                                        </table>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {payment_details && (
                    <>
                        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                            style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                zIndex: 9999
                            }}
                        >
                            <div className="bg-light rounded shadow p-4 position-relative border border-2 border-dark"
                                style={{
                                    width: '90%',
                                    maxWidth: '1100px',
                                    height: '60vh',
                                    overflowY: 'auto'
                                }}
                            >
                                <div className="d-flex flex-column justify-content-start align-items-start w-100">
                                    <button className="btn btn-danger position-absolute top-0 end-0 m-2" onClick={() => setPayment_details(null)}>
                                        ✕
                                    </button>
                                    <div className="d-flex justify-content-start align-items-center mt-2 ps-3 rounded-1" >
                                        <div className="d-flex w-100 justify-content-start">
                                            <label className="fs-3"><strong>Payment Details</strong></label>
                                        </div>
                                    </div>

                                    <div className="offer-details-wrap">
                                        {[
                                            [
                                                { icon: <BsBuildingFillCheck />, label: "Company Name", value: payment_details.company_name ? payment_details.company_name : 'N/A' },
                                                { icon: <MdAttachEmail />, label: "Company Email", value: payment_details.company_email ? payment_details.company_email : 'N/A' },
                                                { icon: <MdPermContactCalendar />, label: "Company Contact No. ", value: payment_details.company_contact ? payment_details.company_contact : 'N/A' }
                                            ],
                                            [
                                                { icon: <FaUserAlt />, label: "User Name", value: payment_details.user_name ? payment_details.user_name : 'N/A' },
                                                { icon: <MdAttachEmail />, label: "User Email", value: payment_details.user_email ? payment_details.user_email : 'N/A' },
                                                { icon: <FaSackDollar />, label: "Amount Paid", value: payment_details.payment_info_amount ? payment_details.payment_info_amount : 'N/A' }
                                            ],
                                            [
                                                {
                                                    icon: <PiHandCoinsBold />,
                                                    label: "Commission Earned",
                                                    value: payment_details.payment_info_amount
                                                        ? (() => {
                                                            const T = parseFloat(payment_details.payment_info_amount);
                                                            const com = T - (T / commission_percentage);
                                                            return com.toFixed(2);
                                                        })()
                                                        : 'N/A'
                                                },
                                                { icon: <MdOutlineDateRange />, label: "Payment Date", value: payment_details.payment_time ? new Date(payment_details.payment_time).toISOString().split("T")[0] : 'N/A' },
                                                { icon: <PiContactlessPaymentFill />, label: "Payment Status", value: payment_details.payment_info_status ? payment_details.payment_info_status : 'N/A' }
                                            ],
                                            [
                                                {
                                                    icon: <FaUserAlt />, label: "Amount Bid", value: payment_details.payment_info_amount ? (() => {
                                                        const Amount = parseFloat(payment_details.payment_info_amount);
                                                        const com = Amount - (Amount / commission_percentage);
                                                        const bid = Amount - com;
                                                        return bid.toFixed(2);
                                                    })() : 'N/A'
                                                },

                                                {
                                                    icon: <FaUserAlt />, label: "Amount To Pay", value: payment_details.payment_info_amount ? (() => {
                                                        const Amount = parseFloat(payment_details.payment_info_amount);
                                                        const com = Amount - (Amount / commission_percentage);
                                                        const bid = Amount - com;
                                                        return bid.toFixed(2);
                                                    })() : 'N/A'
                                                },
                                            ]
                                        ].map((row, index) => (
                                            <div key={index} className="d-flex flex-column flex-md-row flex-wrap w-100 gap-3 gap-lg-5">
                                                {row.map((item, idx) => (
                                                    <div key={idx} className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
                                                        <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                            style={{
                                                                width: '3rem',
                                                                height: '3rem',
                                                                backgroundColor: '#E1F5FF',
                                                                aspectRatio: '1 / 1'
                                                            }}>
                                                            {item.icon}
                                                        </div>
                                                        <div className="d-flex flex-column align-items-start gap-2">
                                                            <span className="text-secondary">{item.label}</span>
                                                            <h6>{item.value}</h6>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            </div>
                        </div>

                    </>
                )}
            </div>
        </>
    )
}

export default Payment;