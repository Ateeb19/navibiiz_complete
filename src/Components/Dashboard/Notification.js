import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import useIsMobile from "../hooks/useIsMobile";
import { useAlert } from "../alert/Alert_message";

const Notification = () => {
    const port = process.env.REACT_APP_SECRET;
    const { showAlert } = useAlert();
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');
    const isMobile = useIsMobile();
    const [admin_notification, setAdmin_notification] = useState([]);
    const [super_admin_notification, setSuper_admin_notification] = useState([]);
    const [user_notification, setUser_notification] = useState([]);
    const [userInfo, setUserInfo] = useState('');
    const token = localStorage.getItem('token');
    const [show_admin_offer, setShow_admin_offer] = useState('');

    const read_notification = () => {
        axios.get(`${port}/notification/read_notificaiton`, {
            headers: {
                Authorization: token,
            }
        }).then((res) => {

        }).catch((err) => { })
    }
    useEffect(() => {
        return () => {
            read_notification();
        };
    }, []);

    useEffect(() => {
        const notification = () => {
            if (userRole === 'admin') {
                axios.get(`${port}/notification/admin_notification`, {
                    headers: {
                        Authorization: token,
                    }
                }).then((response) => {
                    console.log(response.data)
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

    const handle_admin_selected_offer = (offer_id, groupage_id) => {
        axios.get(`${port}/admin/selected_offer`, {
            params: {
                offer_id: offer_id,
                groupage_id: groupage_id,
            },
            headers: {
                Authorization: token,
            }
        }).then((res) => {
            setShow_admin_offer(res.data.message);
        })
            .catch((err) => console.log(err));
    }

    const notification_groupageData = super_admin_notification.filter(
        (item) => item.groupage_created_at && item.groupage_created_by
    ).slice(0, 4);

    const notification_companyData = super_admin_notification.filter(
        (item) => item.company_info_logo !== null && item.company_info_name !== null
    ).slice(0, 4);

    const timeAgo = (dateString) => {
        const now = new Date();
        const past = new Date(dateString);
        const diffInSeconds = Math.floor((now - past) / 1000);

        const minutes = Math.floor(diffInSeconds / 60);
        const hours = Math.floor(diffInSeconds / 3600);
        const days = Math.floor(diffInSeconds / 86400);
        const months = Math.floor(diffInSeconds / 2592000); // 30 days approx
        const years = Math.floor(diffInSeconds / 31536000);

        if (diffInSeconds < 60) {
            return "Just now";
        }
        else if (minutes === 1) {
            return "A minute ago";
        }
        else if (minutes < 60) {
            return `${minutes} minutes ago`;
        }
        else if (hours === 1) {
            return "An hour ago";
        }
        else if (hours < 24) {
            return `${hours} hours ago`;
        }
        else if (days === 1) {
            return "A day ago";
        }
        else if (days < 30) {
            return `${days} days ago`;
        }
        else if (months === 1) {
            return "A month ago";
        }
        else if (months < 12) {
            return `${months} months ago`;
        }
        else if (years === 1) {
            return "A year ago";
        }
        else {
            return `${years} years ago`;
        }
    };

    return (
        <div>
            <div className="bg-light mb-5 pb-3" style={{ width: '100%', overflow: 'auto' }}>

                <div className="d-flex justify-content-start align-items-center mt-2 rounded-1">
                    <div className="d-flex ps-4 w-50 justify-content-start">
                        <label className="fs-3"><strong>Notification</strong></label>
                    </div>
                </div>

                <div className="d-flex px-4 flex-column justify-content-start align-items-start"
                // style={{ boxShadow: '0 0 5px 2px rgba(0, 0, 0, 0.5)' }}
                >
                    <div className="d-flex flex-column align-items-start justify-content-start px-2 w-100">

                        {userRole === 'admin' ? (
                            <>
                                {admin_notification.length > 0 ? (
                                    <>
                                        {isMobile ? (
                                            <>
                                                <div className="d-flex flex-column align-items-start justify-content-start w-100 mb-5">
                                                    {admin_notification.sort((a, b) => Number(b.offer_id) - Number(a.offer_id))
                                                        .map((item, index) => (
                                                            <div className="d-flex flex-column align-items-start justify-content-start w-100 my-3 notification-box">
                                                                <div className="d-flex flex-column align-items-start justify-content-start text-start">
                                                                    <h5>Offer Accepted </h5>
                                                                    <h6>{item.product_name ? 'Product Name : ' : 'Box Dimentions : '} {item.product_name ? item.product_name : item.box_dimension}</h6>
                                                                    <h6 className="notification-amount-green">Total Amount : €{parseFloat(item.amount) + parseFloat(item.commission)}</h6>
                                                                    {/* <h6 className="notification-amount-green">Amount To Pay: €{parseFloat(item.commission)}</h6>
                                                                    <h6>Amount To Transporter: €{parseFloat(item.amount)}</h6> */}
                                                                    <h6>Delivery Duration : {item.expeted_date}</h6>
                                                                </div>
                                                                <div className="d-flex align-items-start justify-content-between w-100 mt-2">
                                                                    <button className="btn btn-sm btn-primary fw-bold" onClick={() => {
                                                                        if (item.status === 'pending') {
                                                                            showAlert("Offer is not yet accepted by customer");
                                                                        } else if (item.status === 'rejected') {
                                                                            showAlert("Your offer is Rejected");
                                                                        } else {
                                                                            handle_admin_selected_offer(item.offer_id, item.groupage_id);
                                                                        }
                                                                    }}>View Details</button>
                                                                    <h6 className="mt-2">{timeAgo(item.created_at)}</h6>
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="d-flex flex-column align-items-start justify-content-start w-100 pb-5 mb-5">
                                                    {admin_notification.sort((a, b) => Number(b.offer_id) - Number(a.offer_id))
                                                        .map((item, index) => (
                                                            <div className="d-flex flex-column align-items-start justify-content-start w-100 my-3 notification-box">
                                                                <div className="d-flex flex-column align-items-start justify-content-between w-100">
                                                                    <div className="d-flex flex-column align-items-start justify-content-start">
                                                                        <h5>Offer Accepted</h5>
                                                                        <div className="d-flex align-items-start justify-content-start w-100 gap-5">
                                                                            <h6>{item.product_name ? 'Product Name : ' : 'Box Dimentions : '} {item.product_name ? item.product_name : item.box_dimension}</h6>
                                                                            <h6 className="notification-amount-green">Total Amount : €{parseFloat(item.amount) + parseFloat(item.commission)}</h6>
                                                                            <h6>Delivery Duration : {item.expeted_date}</h6>
                                                                        </div>

                                                                        {/* <div className="d-flex align-items-start justify-content-start w-100 gap-5">
                                                                            <h6 className="notification-amount-blue">Total Amount : €{parseFloat(item.amount) + parseFloat(item.commission)}</h6>
                                                                            <h6 className="notification-amount-green">Amount To Pay: €{parseFloat(item.commission)}</h6>
                                                                            <h6>Amount To Transporter: €{parseFloat(item.amount)}</h6>
                                                                        </div> */}

                                                                    </div>
                                                                    <div className="d-flex align-items-start justify-content-between w-100">
                                                                        <button className="btn btn-primary fw-bold fs-6"
                                                                            onClick={() => {
                                                                                if (item.status === 'pending') {
                                                                                    showAlert("Offer is not yet accepted by customer");
                                                                                } else if (item.status === 'rejected') {
                                                                                    showAlert("Your offer is Rejected");
                                                                                } else {
                                                                                    handle_admin_selected_offer(item.offer_id, item.groupage_id);
                                                                                }
                                                                            }}
                                                                        // onClick={() => navigate(`/dashboard/offers-admin`)}
                                                                        >View Details</button>
                                                                        <h6 className="mt-2">{timeAgo(item.payment_time)}</h6>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <div className="mt-3"><h5 className="fw-bold fs-5">No Notification!</h5></div>
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
                                {user_notification.length > 0 ? (
                                    <>
                                        {isMobile ? (
                                            <>
                                                <div className="d-flex flex-column align-items-start justify-content-start w-100 mb-5">
                                                    {user_notification.sort((a, b) => Number(b.offer_id) - Number(a.offer_id))
                                                        .map((item, index) => (
                                                            <div className="d-flex flex-column align-items-start justify-content-start w-100 my-3 notification-box">
                                                                <div className="d-flex flex-column align-items-start justify-content-start text-start">
                                                                    <h5>New Offer Received </h5>
                                                                    <h6>{item.product_name ? 'Product Name : ' : 'Box Dimentions : '} {item.product_name ? item.product_name : item.box_dimension}</h6>
                                                                    <h6 className="notification-amount-green">Total Amount : €{parseFloat(item.amount) + parseFloat(item.commission)}</h6>
                                                                    {/* <h6 className="notification-amount-green">Amount To Pay: €{parseFloat(item.commission)}</h6>
                                                                    <h6>Amount To Transporter: €{parseFloat(item.amount)}</h6> */}
                                                                    <h6>Delivery Duration : {item.expeted_date}</h6>
                                                                </div>
                                                                <div className="d-flex align-items-start justify-content-between w-100 mt-2">
                                                                    <button className="btn btn-sm btn-primary fw-bold" onClick={() => navigate(`/dashboard/offers-user/${item.groupage_id}`)}>View Offer</button>
                                                                    <h6 className="mt-2">{timeAgo(item.created_at)}</h6>
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="d-flex flex-column align-items-start justify-content-start w-100 pb-5 mb-5">
                                                    {user_notification.sort((a, b) => Number(b.offer_id) - Number(a.offer_id))
                                                        .map((item, index) => (
                                                            <div className="d-flex flex-column align-items-start justify-content-start w-100 my-3 notification-box">
                                                                <div className="d-flex flex-column align-items-start justify-content-between w-100">
                                                                    <div className="d-flex flex-column align-items-start justify-content-start">
                                                                        <h5>New Offer Received</h5>
                                                                        <div className="d-flex align-items-start justify-content-start w-100 gap-5">
                                                                            <h6>{item.product_name ? 'Product Name : ' : 'Box Dimentions : '} {item.product_name ? item.product_name : item.box_dimension}</h6>
                                                                            <h6 className="notification-amount-green">Total Amount : €{parseFloat(item.amount) + parseFloat(item.commission)}</h6>
                                                                            <h6>Delivery Duration : {item.expeted_date}</h6>
                                                                        </div>

                                                                        {/* <div className="d-flex align-items-start justify-content-start w-100 gap-5">
                                                                            <h6 className="notification-amount-blue">Total Amount : €{parseFloat(item.amount) + parseFloat(item.commission)}</h6>
                                                                            <h6 className="notification-amount-green">Amount To Pay: €{parseFloat(item.commission)}</h6>
                                                                            <h6>Amount To Transporter: €{parseFloat(item.amount)}</h6>
                                                                        </div> */}

                                                                    </div>
                                                                    <div className="d-flex align-items-start justify-content-between w-100">
                                                                        <button className="btn btn-primary fw-bold fs-6" onClick={() => navigate(`/dashboard/offers-user/${item.groupage_id}`)}>View Offer</button>
                                                                        <h6 className="mt-2">{timeAgo(item.created_at)}</h6>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <div className="mt-3"><h5 className="fw-bold fs-5">No Notification!</h5></div>
                                )}
                            </>
                        )}

                    </div>
                </div>
            </div>

            {show_admin_offer && (
                <>
                    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                        style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            zIndex: 9999
                        }}
                    >
                        <div className="bg-light rounded shadow p-4 position-relative border border-2 border-dark dashboard-offer-selection"
                            style={{
                                width: '55%',
                                height: '80vh',
                                overflowY: 'auto'
                            }}
                        >
                            <div className="d-flex flex-column justify-content-start align-items-start w-100">
                                <button className="btn btn-danger position-absolute top-0 end-0 m-2" onClick={() => setShow_admin_offer('')}>
                                    ✕
                                </button>

                                <strong className="fs-4">Offer Details</strong>

                                <h5 className="mt-3">{show_admin_offer.box ? 'Box Information' : 'Product Information'}</h5>
                                <div className="d-flex flex-column align-items-start justify-content-start mt-1 w-100 border-bottom pb-3 border-2 gap-2">
                                    <div className=" d-flex flex-row align-items-start justify-content-between w-100">
                                        <span className="text-secondary">{show_admin_offer.box ? 'Box ID' : 'Product ID'} : </span>
                                        <span>{show_admin_offer.id}</span>
                                    </div>
                                    <div className={show_admin_offer.img01 ? 'd-flex flex-column align-items-start justify-content-between w-100' : 'd-flex flex-row align-items-start justify-content-between w-100'}>
                                        <span className="text-secondary">{show_admin_offer.box ? 'Box' : 'Product'} Image : </span>
                                        {!show_admin_offer.img01 ? (
                                            <>
                                                <span>N/A</span>
                                            </>
                                        ) : (
                                            <>
                                                <div className="d-flex flex-wrap justify-content-center gap-3 w-100 ms-3">
                                                    {Object.keys(show_admin_offer)
                                                        .filter(key => key.startsWith('img') && show_admin_offer[key])
                                                        .slice(0, 10)
                                                        .map((key, index) => (
                                                            <div key={index} className="image-wrapper-offers">
                                                                <img
                                                                    src={show_admin_offer[key]}
                                                                    alt={`preview-${index}`}
                                                                    className="img-fluid rounded shadow-sm"
                                                                />
                                                            </div>
                                                        ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    {show_admin_offer.box ? <>
                                        <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                            <span className="text-secondary">Box Dimensions : </span>
                                            <span>{show_admin_offer.box_dimension}</span>
                                        </div>
                                        <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                            <span className="text-secondary">Number of Boxes : </span>
                                            <span>{show_admin_offer.box_number}</span>
                                        </div>
                                        <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                            <span className="text-secondary">Box info : </span>
                                            <span>{show_admin_offer.box_info}</span>
                                        </div>
                                    </> : <>
                                        <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                            <span className="text-secondary">Product Name : </span>
                                            <span>{show_admin_offer.product_name}</span>
                                        </div>
                                        {/* <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                            <span className="text-secondary">Product Type : </span>
                                            <span>{show_admin_offer.product_type ? show_admin_offer.product_type : '-' }</span>
                                        </div>
                                        <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                            <span className="text-secondary">Weight : </span>
                                            <span>{show_admin_offer.p_weight}  {show_admin_offer.p_weight ? "Kg" : ""}</span>
                                        </div>
                                        <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                            <span className="text-secondary">Height :  </span>
                                            <span>{show_admin_offer.p_height}  {show_admin_offer.p_height ? "Cm" : ""}</span>
                                        </div>
                                        <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                            <span className="text-secondary">Length : </span>
                                            <span>{show_admin_offer.p_length}  {show_admin_offer.p_length ? "Cm" : ""}</span>
                                        </div>
                                        <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                            <span className="text-secondary">Width : </span>
                                            <span>{show_admin_offer.p_width}  {show_admin_offer.p_width ? "Cm" : ""}</span>
                                        </div> */}
                                    </>}

                                </div>


                                <h5 className="mt-3">Pick Up Information</h5>
                                <div className="d-flex flex-column align-items-start justify-content-start mt-1 w-100 border-bottom pb-3 border-2 gap-2">
                                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                        <span className="text-secondary">Full Name : </span>
                                        <span>{show_admin_offer.sender_name}</span>
                                    </div>
                                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                        <span className="text-secondary">Contact Number : </span>
                                        <span>{show_admin_offer.sender_contact}</span>
                                    </div>
                                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                        <span className="text-secondary">Email ID : </span>
                                        <span>{show_admin_offer.sender_email}</span>
                                    </div>
                                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                        <span className="text-secondary">Country : </span>
                                        <span>{show_admin_offer.sender_country}</span>
                                    </div>
                                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                        <span className="text-secondary">State : </span>
                                        <span>{show_admin_offer.sender_state}</span>
                                    </div>
                                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                        <span className="text-secondary">City : </span>
                                        <span>{show_admin_offer.sender_city}</span>
                                    </div>
                                    {/* <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                        <span className="text-secondary">Street Address : </span>
                                        <span>{show_admin_offer.sender_address ? show_admin_offer.sender_address : '-'}</span>
                                    </div>
                                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                        <span className="text-secondary">Zip Code : </span>
                                        <span>{show_admin_offer.sender_zipcode ? show_admin_offer.sender_zipcode : '-'}</span>
                                    </div>
                                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                        <span className="text-secondary">Pick Up Date : </span>
                                        <span>{
                                            show_admin_offer.pickup_date && show_admin_offer.pickup_date !== 'null'
                                                    ? show_admin_offer.pickup_date.includes('Select End Date')
                                                        ? show_admin_offer.pickup_date.split(' - ')[0] || '-'
                                                        : show_admin_offer.pickup_date.split(' - ')[0] || '-'
                                                    : '-'
                                            // show_admin_offer.pickup_date.includes('Select End Date') ? show_admin_offer.pickup_date.split(' - ')[0] : show_admin_offer.pickup_date
                                        }</span>
                                    </div> */}
                                </div>

                                <h5 className="mt-3">Delivery Information</h5>
                                <div className="d-flex flex-column align-items-start justify-content-start mt-1 w-100 border-bottom pb-3 border-2 gap-2">
                                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                        <span className="text-secondary">Full Name : </span>
                                        <span>{show_admin_offer.receiver_name}</span>
                                    </div>
                                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                        <span className="text-secondary">Contact Number : </span>
                                        <span>{show_admin_offer.receiver_contact}</span>
                                    </div>
                                    {/* <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                        <span className="text-secondary">Email ID : </span>
                                        <span>{show_admin_offer.receiver_email ? show_admin_offer.receiver_email : '-'}</span>
                                    </div> */}
                                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                        <span className="text-secondary">Country : </span>
                                        <span>{show_admin_offer.receiver_country ? show_admin_offer.receiver_country : '-'}</span>
                                    </div>
                                    {/* <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                        <span className="text-secondary">State : </span>
                                        <span>{show_admin_offer.receiver_state ? show_admin_offer.receiver_state : '-'}</span>
                                    </div>
                                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                        <span className="text-secondary">City : </span>
                                        <span>{show_admin_offer.receiver_city ? show_admin_offer.receiver_city : '-'}</span>
                                    </div>
                                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                        <span className="text-secondary">Street Address : </span>
                                        <span>{show_admin_offer.receiver_address ? show_admin_offer.receiver_address : '-'}</span>
                                    </div>
                                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                        <span className="text-secondary">Zip Code : </span>
                                        <span>{show_admin_offer.receiver_zipcode ? show_admin_offer.receiver_zipcode : '-'}</span>
                                    </div> */}
                                    {/* <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Delivery Duration : </span>
                      <span>{show_admin_offer.expeted_date}</span>
                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )
            }
        </div>
    )

}

export default Notification;