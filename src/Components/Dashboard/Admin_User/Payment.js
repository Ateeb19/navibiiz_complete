import axios from "axios";
import React, { useEffect, useState } from "react";
import useIsMobile from "../../hooks/useIsMobile";

const Payment = () => {
    const port = process.env.REACT_APP_SECRET;
    const token = localStorage.getItem('token');
    const [user_payment_history, setUser_payment_history] = useState([]);
    const isMobile = useIsMobile();

    let total_spending = 0;
    const payment_history_user = () => {
        axios.get(`${port}/user/payment_history`, {
            headers: {
                Authorization: token,
            }
        }).then((response) => {
            if (response.data.status === true) {
                setUser_payment_history(response.data.message);
                console.log(response.data.message);
            } else {
                setUser_payment_history('');
            }
        }).catch((err) => { console.log(err) });
    }

    useEffect(() => {
        payment_history_user();
    }, [])

    if (user_payment_history) {
        total_spending = user_payment_history.reduce((total, record) => {
            return total + parseFloat(record.payment_info_amount);
        }, 0);
    }

    return (
        <>
            <div className="bg-light" style={{ width: '100%', overflow: 'auto', paddingBottom: '80px' }}>

                <div className="d-flex justify-content-start align-items-center ps-3 rounded-1" >
                    <div className="d-flex ps-4 w-100 justify-content-start">
                        <label className="fs-3"><strong>Payment History</strong></label>
                    </div>
                </div>
                <div className="dashboard-wrapper-box">
                    <div className="table-wrap">

                        {isMobile ? (
                            <div className="d-flex flex-column w-100 align-items-center justify-content-center gap-3">
                                {user_payment_history && user_payment_history.length > 0 ? (
                                    <>
                                        {user_payment_history.map((item, index) => (
                                            <>
                                                <div className="orders-mobile-card w-100">
                                                    <div className="d-flex justify-content-between w-100">
                                                        <div className="text-start">
                                                            <div className="d-flex gap-2">
                                                                <h5>Offer Id :  </h5> <h5>{item.groupage_id}</h5>
                                                            </div>
                                                            <div className="d-flex">
                                                                <h5>Product Name : {item.product_name ? item.product_name : item.box_dimension}</h5>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex align-items-center justify-content-center">

                                                        </div>
                                                    </div>

                                                    <div className="d-flex flex-column justify-content-start align-items-start text-start">
                                                        <h5>Transaction Id : {item.transaction_id}</h5>
                                                        <h5 className="fw-bold">Amount (€) : {item.payment_info_amount}</h5>
                                                        <h5>Payment Date : {new Date(item.payment_time).toLocaleDateString("en-GB", {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric"
                                                        })}</h5>
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
                        ) : <>
                            <div className="table-responsive" style={{
                                width: "100%",
                                overflowX: "auto",
                                whiteSpace: "nowrap",
                            }}>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col"><h6>Offer Id</h6></th>
                                            <th scope="col"><h6>Product Name</h6></th>
                                            <th scope="col"><h6>Transaction Id</h6></th>
                                            <th scope="col"><h6>Amount (€)</h6></th>
                                            <th scope="col"><h6>Payment Date</h6></th>
                                        </tr>
                                    </thead>
                                    {user_payment_history && user_payment_history.length > 0 ? (
                                        <tbody>
                                            {user_payment_history.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="text-secondary">{item.groupage_id}</td>
                                                    <td className="text-secondary">{item.product_name ? item.product_name : item.box_dimension}</td>
                                                    <td className="text-secondary">{item.transaction_id}</td>
                                                    <td className="text-secondary fw-bold">{item.payment_info_amount}</td>
                                                    <td className="text-secondary">{new Date(item.payment_time).toLocaleDateString("en-GB", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric"
                                                    })}</td>
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
                        </>}
                    </div>
                </div>
            </div >
        </>
    )
}

export default Payment;