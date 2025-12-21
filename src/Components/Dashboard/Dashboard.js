import React, { useEffect, useState } from "react";
import { BsBuildingsFill, BsCarFrontFill } from "react-icons/bs";
import { FaTruckLoading, FaUsers } from "react-icons/fa";
import { PiShippingContainerDuotone } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../alert/Alert_message";
import axios from "axios";

const Dashboard = () => {
    const port = process.env.REACT_APP_SECRET;
    const { showAlert } = useAlert();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const [user_upcomming, setUser_upcomming] = useState([]);
    const [user_numbers_orders, setUser_numbers_orders] = useState('');
    const [userInfo, setUserInfo] = useState('');
    const [admin_offer_accecepted, setAdmin_offer_accecepted] = useState('');
    const [admin_total_offers, setAdmin_total_offers] = useState('');
    const [total_companies, setTotal_companies] = useState('');
    const [total_user, setTotal_user] = useState('');
    const [total_amount_received, setTotal_amount_received] = useState('');
    const [total_commission, setTotal_commission] = useState('');
    const [amount_to_pay, setAmount_to_pay] = useState('');
    let total_spending = 0;

    //super Admin
    const total_sadmin_amount = async () => {
        if (userRole === 'Sadmin') {
            axios.get(`${port}/s_admin/total_amount_received`, {
                headers: {
                    Authorization: token,
                }
            }).then((res) => {
                let amount = 0;
                if (res.data.status) {
                    const data = res.data.message;
                    data.forEach(item => {
                        amount += parseFloat(item.payment_info_amount || 0);
                    });
                }
                setTotal_amount_received(amount);
            });
        }
    }
    const total_sadmin_commission = () => {
        if (userRole === 'Sadmin') {
            axios.get(`${port}/s_admin/total_commission`, {
                headers: {
                    Authorization: token,
                }
            }).then((res) => {
                let commission = 0;
                if (res.data.status) {
                    const data = res.data.message;
                    data.forEach(item => {
                        commission += parseFloat(item.commission || 0);
                    });
                }
                setTotal_commission(commission);
            })
        }
    }
    const total_sadmin_amount_to_pay = () => {
        if (userRole === 'Sadmin') {
            axios.get(`${port}/s_admin/amount_to_pay`, {
                headers: {
                    Authorization: token,
                }
            }).then((res) => {
                let pay = 0;
                if (res.data.status) {
                    const data = res.data.message;
                    data.forEach(item => {
                        pay += parseFloat(item.amount || 0);
                    });
                }
                setAmount_to_pay(pay);
            })
        }
    }
    const total_company = () => {
        axios.get(`${port}/s_admin/count_companies`, {
            headers: {
                Authorization: token,
            }
        }).then((response) => {
            if (response.data.status === true) {
                setTotal_companies(response.data.message.count);
            } else {
                setTotal_companies('');
            }
        }).catch((err) => { console.log(err) });
    }
    const total_users = () => {
        axios.get(`${port}/s_admin/count_users`, {
            headers: {
                Authorization: token,
            }
        }).then((response) => {
            if (response.data.status === true) {
                setTotal_user(response.data.message.count);
            } else {
                setTotal_user('');
            }
        }).catch((err) => { console.log(err) });
    }

    //Admin
    const display_admin_total_offers = () => {
        if (userRole === 'admin') {
            axios.get(`${port}/admin/total_offers_sent`, {
                headers: {
                    Authorization: token,
                }
            }).then((response) => {
                if (response.data.status === true) {
                    setAdmin_total_offers(response.data.message);
                } else {
                    setAdmin_total_offers('');
                }
            })
        }
    }
    const display_admin_accecepted_offers = () => {
        if (userRole === 'admin') {
            axios.get(`${port}/admin/total_offer_accepted`, {
                headers: {
                    Authorization: token,
                }
            }).then((response) => {
                if (response.data.status === true) {
                    setAdmin_offer_accecepted(response.data.message);
                } else {
                    setAdmin_offer_accecepted('');
                }
            })
        }
    }

    //user
    const user_info = () => {
        axios.get(`${port}/user/display_profile`, {
            headers: {
                Authorization: token,
            }
        }).then((response) => {
            setUserInfo(response.data.message);
        }).catch((err) => { console.log(err) });
    }
    const total_user_orders = () => {
        axios.get(`${port}/user/total_orders_number`, {
            headers: {
                Authorization: token,
            }
        }).then((response) => {
            if (response.data.status === true) {
                setUser_numbers_orders(response.data.message);
            } else {
                setUser_numbers_orders('');
            }
        }).catch((err) => { console.log(err) });
    }
    const upcomming = () => {
        axios.get(`${port}/user/user_upcomming`, {
            headers: {
                Authorization: token,
            }
        }).then((response) => {
            if (response.data.status === true) {
                setUser_upcomming(response.data.message);
            } else {
                setUser_upcomming('');
            }
        }).catch((err) => { console.log(err) });
    }


    useEffect(() => {
        if (!token) {
            navigate('/');
        }
        if (userRole === 'Sadmin') {
            total_sadmin_amount();
            total_sadmin_commission();
            total_sadmin_amount_to_pay();
            total_company();
            total_users();
            user_info();
        } else if (userRole === 'admin') {
            display_admin_total_offers();
            display_admin_accecepted_offers();
            user_info();
        } else if (userRole === 'user') {
            user_info();
            total_user_orders();
            upcomming();
        } else {
            navigate('/');
        }
    }, [userRole]);
    return (
        <>
            <div className="bg-light" style={{ width: '100%', height:'100%', overflow: 'auto' }}>

                <div className="dashbord-info-wrap">
                    {userRole === 'Sadmin' ? (
                        <>
                            <div className="d-flex justify-content-start align-items-center rounded-1" >
                                <div className="d-flex  w-50 justify-content-start">
                                    <label className="fs-3">Hi, <strong>{userInfo.name}</strong></label>
                                </div>
                                <div className="w-50 pe-3 d-flex justify-content-end">
                                    <label className="text-success fs-5">Updated 2 min ago</label>
                                </div>
                            </div>


                            <div className="dashboard-wraper-box">
                                <div className="row mt-3 g-3 justify-content-center">
                                    {[{ count: total_amount_received ? parseFloat(total_amount_received).toFixed(2) : 'N/A', change: "+5%", text: "Amount Received", icon: <PiShippingContainerDuotone /> },
                                    { count: total_commission ? parseFloat(total_commission).toFixed(2) : 'N/A', change: "-2%", text: "Commission Earned", icon: <BsCarFrontFill /> },
                                    { count: amount_to_pay ? parseFloat(amount_to_pay).toFixed(2) : 'N/A', change: "+10%", text: "Total Amount Paid", icon: <FaTruckLoading /> }
                                    ].map((item, index) => (
                                        <div key={index} className="col-12 col-sm-6 col-md-4 d-flex justify-content-center">
                                            <div className=" dashboard-wrap-box ">
                                                <div className="rounded-circle fs-1 d-flex justify-content-center align-items-center text-primary mx-auto" style={{ width: '5rem', height: '5rem', backgroundColor: '#e1f5ff' }}>
                                                    {item.icon}
                                                </div>
                                                <h3 className="mt-3 fw-bold d-block">{item.count}</h3>
                                                <label className="text-success fs-6 p-2">{item.change} Last Month</label>
                                                <label className="fs-5 d-block">{item.text}</label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="dashboard-wraper-box ">
                                <div className="row mt-3 g-3 justify-content-center">
                                    {[{ count: total_companies, change: "+7%", text: "Companies Registered", icon: <BsBuildingsFill /> },
                                    { count: total_user, change: "+2%", text: "Customers Registered", icon: <FaUsers /> }
                                    ].map((item, index) => (
                                        <div key={index} className="col-12 col-sm-6 col-md-4 d-flex justify-content-center">
                                            <div className=" dashboard-wrap-box ">
                                                <div className="rounded-circle fs-1 d-flex justify-content-center align-items-center text-primary mx-auto" style={{ width: '5rem', height: '5rem', backgroundColor: '#e1f5ff' }}>
                                                    {item.icon}
                                                </div>
                                                <h3 className="mt-3 fw-bold d-block">{item.count}</h3>
                                                <label className="text-success fs-6 p-2">{item.change} Last Month</label>
                                                <label className="fs-5 d-block">{item.text}</label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : userRole === 'admin' ? (
                        <>

                            <div className="d-flex justify-content-start align-items-center rounded-1" >
                                <div className="d-flex  w-50 justify-content-start">
                                    <label className="fs-3">Hi, <strong>{userInfo.name}</strong></label>
                                </div>
                                <div className="w-50 pe-3 d-flex justify-content-end">
                                    <label className="text-success fs-5">Updated 2 min ago</label>
                                </div>
                            </div>


                            <div className="dashboard-wraper-box">
                                <div className="row mt-3 g-3 justify-content-center">
                                    {[{ count: 'N/A', change: "+5%", text: "Amount Received", icon: <PiShippingContainerDuotone /> },
                                    { count: admin_total_offers ? admin_total_offers : 'N/A', change: "-2%", text: "Total Offers Sent", icon: <BsCarFrontFill /> },
                                    { count: admin_offer_accecepted ? admin_offer_accecepted : 'N/A', change: "+10%", text: "Offers Accepted ", icon: <FaTruckLoading /> }
                                    ].map((item, index) => (
                                        <div key={index} className="col-12 col-sm-6 col-md-4 d-flex justify-content-center">
                                            <div className=" dashboard-wrap-box ">
                                                <div className="rounded-circle fs-1 d-flex justify-content-center align-items-center text-primary mx-auto" style={{ width: '5rem', height: '5rem', backgroundColor: '#e1f5ff' }}>
                                                    {item.icon}
                                                </div>
                                                <h3 className="mt-3 fw-bold d-block">{item.count}</h3>
                                                <label className="text-success fs-6 p-2">{item.change} Last Month</label>
                                                <label className="fs-5 d-block">{item.text}</label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="d-flex justify-content-start align-items-center rounded-1" >
                                <div className="d-flex  w-50 justify-content-start">
                                    <label className="fs-3">Hi, <strong>{userInfo.name}</strong></label>
                                </div>
                                <div className="w-50 pe-3 d-flex justify-content-end">
                                    <label className="text-success fs-5">Updated 2 min ago</label>
                                </div>
                            </div>

                            <div className="dashboard-wraper-box">
                                <div className="row mt-3 g-3 justify-content-center">
                                    {[{ count: user_numbers_orders ? user_numbers_orders : 'N/A', change: "+5%", text: "Total Orders", icon: <PiShippingContainerDuotone /> },
                                    { count: user_upcomming ? user_upcomming : 'N/A', change: "-2%", text: "Upcoming Pick up", icon: <BsCarFrontFill /> },
                                    { count: total_spending ? total_spending : 'N/A', change: "+10%", text: "Total Spending", icon: <FaTruckLoading /> }
                                    ].map((item, index) => (
                                        <div key={index} className="col-12 col-sm-6 col-md-4 d-flex justify-content-center">
                                            <div className=" dashboard-wrap-box ">
                                                <div className="rounded-circle fs-1 d-flex justify-content-center align-items-center text-primary mx-auto" style={{ width: '5rem', height: '5rem', backgroundColor: '#e1f5ff' }}>
                                                    {item.icon}
                                                </div>
                                                <h3 className="mt-3 fw-bold d-block">{item.count}</h3>
                                                <label className="text-success fs-6 p-2">{item.change} Last Month</label>
                                                <label className="fs-5 d-block">{item.text}</label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>

    )
}

export default Dashboard;