import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import Navbar from "../Navbar/Navbar";

const Notification = () => {
    const port = process.env.REACT_APP_SECRET;
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');
    const [admin_notification, setAdmin_notification] = useState([]);
    const [super_admin_notification, setSuper_admin_notification] = useState([]);
    const [user_notification, setUser_notification] = useState([]);
    const [userInfo, setUserInfo] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const notification = () => {
            if (userRole === 'admin') {
                axios.get(`${port}/notification/admin_notification`, {
                    headers: {
                        Authorization: token,
                    }
                }).then((response) => {
                    if (response.data.status === true) {
                        setAdmin_notification(response.data.message);
                    }
                }).catch((err) => { console.log(err) })
            }
            if (userRole === 'Sadmin') {
                axios.get(`${port}/notification/SuperAdmin_notification`, {
                    headers: {
                        Authorization: token,
                    }
                }).then((response) => {
                    if (response.data.status === true) {
                        setSuper_admin_notification(response.data.message);
                    }
                }).catch((err) => { console.log(err) });
            }
            if (userRole === 'user') {
                axios.get(`${port}/notification/user_notification`, {
                    headers: {
                        Authorization: token,
                    }
                }).then((response) => {
                    if (response.data.status === true) {
                        setUser_notification(response.data.message);
                    }
                }).catch((err) => { console.log(err) });
            }
        }
        notification();

        if (!token) {
            navigate('/');
        }
        if (userRole !== 'admin' && userRole !== 'Sadmin' && userRole !== 'user') {
            navigate('/');
        } else {
            axios.get(`${port}/user/display_profile`, {
                headers: {
                    Authorization: token,
                }
            }).then((response) => {
                setUserInfo(response.data.message);
            }).catch((err) => { console.log(err) });
        }
    }, [userRole]);

    const notification_groupageData = super_admin_notification.filter(
        (item) => item.groupage_created_at && item.groupage_created_by
    ).slice(0, 4);

    const notification_companyData = super_admin_notification.filter(
        (item) => item.company_info_logo !== null && item.company_info_name !== null
    ).slice(0, 4);
    return (
        <div>
            <div className="bg-light mb-5 pb-3" style={{ width: '100%', overflow: 'auto' }}>

                <div className="d-flex justify-content-start align-items-center mt-2 rounded-1">
                    <div className="d-flex ps-4 w-50 justify-content-start">
                        <label className="fs-3"><strong>Notification</strong></label>
                    </div>
                </div>

                <div className="d-flex mt-4 p-3 flex-column justify-content-start align-items-start m-5 rounded-1" style={{ boxShadow: '0 0 5px 2px rgba(0, 0, 0, 0.5)' }}>
                    <div className="d-flex flex-column align-items-start justify-content-start mt-2 p-2 w-100">

                        {userRole === 'admin' ? (
                            <>
                                <strong>New Offers</strong>
                                {admin_notification && (
                                    <>
                                        <div className="d-flex flex-column align-items-start justify-content-start">
                                            {admin_notification.map((item, index) => (
                                                <div className="d-flex flex-row align-items-start w-100 justify-content-start mt-3 mb-3">
                                                    <div
                                                        className="rounded-circle border border-1 border-secondary d-flex align-items-center justify-content-center overflow-hidden"
                                                        style={{ width: '3.5rem', height: '3.5rem' }}
                                                    >
                                                        <img
                                                            src={item.img01}
                                                            alt="Item"
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    </div>
                                                    <div className="ps-3 flex-grow-1">
                                                        <p className="mb-0 text-start">
                                                            A new product name <strong>{item.product_name}</strong> has been added for groupage
                                                            <br />
                                                            <span className="text-secondary">{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</span>
                                                        </p>
                                                    </div>
                                                    <div className="text-primary">
                                                        <span onClick={() => navigate('/shipments')}>See Details</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                    </>
                                )}
                            </>
                        ) : userRole === 'Sadmin' ? (
                            <>
                                <strong>New Groupage Created</strong>
                                {notification_groupageData && (
                                    <>
                                        <div className="d-flex flex-column align-items-start justify-content-start">
                                            {notification_groupageData.map((item, index) => (
                                                <div className="d-flex flex-row align-items-start w-100 justify-content-start mt-3 mb-3">
                                                    <div
                                                        className="rounded-circle border border-1 border-secondary d-flex align-items-center justify-content-center overflow-hidden"
                                                        style={{ width: '3.5rem', height: '3.5rem' }}
                                                    >
                                                        <img
                                                            src={item.img01}
                                                            alt="Item"
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    </div>
                                                    <div className="ps-3 flex-grow-1">
                                                        <p className="mb-0 text-start">
                                                            A new product name <strong>{item.product_name}</strong> has been added for groupage
                                                            <br />
                                                            <span className="text-secondary">{formatDistanceToNow(new Date(item.groupage_created_at), { addSuffix: true })}</span>
                                                        </p>
                                                    </div>
                                                    <div className="text-primary">
                                                        <span onClick={() => navigate('/shipments')}>See Details</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                                <strong>New Transporters Regestered</strong>
                                {notification_companyData && (
                                    <>
                                        <div className="d-flex flex-column align-items-start justify-content-start">
                                            {notification_companyData.map((item, index) => (
                                                <div className="d-flex flex-row align-items-start w-100 justify-content-start mt-3 mb-3" key={index}>
                                                    <div
                                                        className="rounded-circle border border-1 border-secondary d-flex align-items-center justify-content-center overflow-hidden"
                                                        style={{ width: '3.5rem', height: '3.5rem' }}
                                                    >
                                                        <img
                                                            src={item.comapny_info_logo}
                                                            alt="Logo"
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    </div>
                                                    <div className="ps-3 flex-grow-1">
                                                        <p className="mb-0 text-start">
                                                            A new company name <strong>{item.company_info_name}</strong> has been regestered
                                                        </p>
                                                    </div>
                                                    <div className="text-primary">
                                                        <span onClick={() => navigate('/transporters_list')}>See Details</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                {user_notification && (
                                    <>
                                        <div className="d-flex flex-column align-items-start justify-content-start w-100">
                                            {user_notification.map((item, index) => (
                                                <div className="d-flex flex-row align-items-start w-100 justify-content-start mt-3 mb-3">
                                                    <div
                                                        className="rounded-circle border border-1 border-secondary d-flex align-items-center justify-content-center overflow-hidden"
                                                        style={{ width: '3.5rem', height: '3.5rem' }}
                                                    >
                                                        <img
                                                            src={item.logo}
                                                            alt="logo"
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    </div>
                                                    <div className="ps-3 flex-grow-1">
                                                        <p className="mb-0 text-start">
                                                            A new company name <strong>{item.company_name}</strong> has been added
                                                        </p>
                                                    </div>
                                                    <div className="text-primary">
                                                        <span onClick={() => navigate('/transporters_list')}>See Details</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                    </div>
                </div>
            </div>
        </div>
    )

}

export default Notification;