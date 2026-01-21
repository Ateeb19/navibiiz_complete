import React, { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../alert/Alert_message";
import axios from "axios";
import { FaCalendarCheck, FaCity, FaFlag, FaInfoCircle, FaMapPin, FaRuler, FaUser } from "react-icons/fa";
import { MdAttachEmail, MdConfirmationNumber } from "react-icons/md";
import { FaBuildingFlag, FaWeightScale } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import { RiExpandHeightFill, RiExpandWidthFill } from "react-icons/ri";
import { SiAnytype } from "react-icons/si";

const Offers = () => {
    const port = process.env.REACT_APP_SECRET;
    const { showAlert } = useAlert();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const [allOffers, setAllOffers] = useState([]);
    const [offerdate, setOfferdate] = useState('');
    const [offersearch, setOffersearch] = useState('');
    const [showOfferDetails, setShowOfferDetails] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [deleteAction, setDeleteAction] = useState(null);




    const displayallOffers = () => {
        if (userRole === 'Sadmin') {
            axios.get(`${port}/s_admin/show_all_offers`, {
                headers: {
                    Authorization: token,
                }
            }).then((response) => {
                setAllOffers(response.data.data);
            }).catch((err) => { console.log(err) });
        }
    }

    useEffect(() => {
        displayallOffers();
    }, [])

    const openDeleteModal = (message, deleteFunction) => {
        setModalMessage(message);
        setDeleteAction(() => deleteFunction);
        setShowModal(true);
    };

    const filteredOffers = allOffers.filter((item) => {
        const matchesSearch = offersearch === "" || (
            item.offer_id?.toString().includes(offersearch) ||
            item.product_name?.toLowerCase().includes(offersearch.toLowerCase()) ||
            item.userName?.toLowerCase().includes(offersearch.toLowerCase()) ||
            item.company_name?.toLowerCase().includes(offersearch.toLowerCase()) ||
            ((parseFloat(item.amount) || 0) +
                (item.commission === 'null' || item.commission == null ? 0 : parseFloat(item.commission)))
                .toString()
                .includes(offersearch)
        );

        const matchesDate = offerdate === "" ||
            (item.created_at && new Date(item.created_at).toISOString().split("T")[0] === offerdate);

        return matchesSearch && matchesDate;
    });
    const show_offer_details = (item) => {
        setShowOfferDetails(item);
    }
    const delete_offer_admin = (offer_id) => {
        openDeleteModal(`Are you sure you want to delete this offer ?`, () => {
            axios.delete(`${port}/admin/delete_offer/${offer_id}`, {
                headers: {
                    Authorization: token,
                }
            }).then((response) => {
                if (response.data.status === true) {
                    showAlert(response.data.message);
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }
            }).catch((err) => { console.log(err) });
        });
    }
    return (
        <>
            <div className="bg-light" style={{ width: '100%', overflow: 'auto', paddingBottom: '90px' }}>
                <div className="d-flex justify-content-start align-items-center mt- rounded-1">
                    <div className="d-flex ps-4 w-50 justify-content-start">
                        <label className="fs-3"><strong>Offers List</strong></label>
                    </div>
                </div>

                <div className="dashboard-wrapper-box">
                    <div className="table-wrap">
                        <div className="table-filter-wrap">
                            <div className="d-flex flex-column align-items-start justify-content-start ps-2 mb-3 w-100">
                                <h5>Filter By:</h5>
                                <div className="row w-100 g-2 mt-1 ">
                                    <div className="col-12 col-md-6 col-lg-8">
                                        <input type="text" className="shipping-input-field" placeholder="Search here..." onChange={(e) => setOffersearch(e.target.value)} value={offersearch} />
                                    </div>

                                    <div className="col-12 col-md-6 col-lg-4 position-relative">
                                        <input type="date" className="shipping-input-field" placeholder="Pick up date" onChange={(e) => setOfferdate(e.target.value)} value={offerdate} />
                                    </div>
                                </div>
                            </div>

                            <div className="table-responsive w-100">

                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col"><h6>Offer Id</h6></th>
                                            <th scope="col"><h6>Product Name / Box Dimensions</h6></th>
                                            <th scope="col"><h6>Date</h6></th>
                                            <th scope="col"><h6>Offer Created By</h6></th>
                                            <th scope="col"><h6>Price (€)</h6></th>
                                            <th scope="col"><h6>Offer From</h6></th>
                                            <th scope="col"><h6>Status</h6></th>
                                            {/* <th scope="col"><h6>Payment Status ($)</h6></th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allOffers && allOffers.length > 0 ? (
                                            filteredOffers.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="text-primary" style={{ cursor: 'pointer' }} onClick={() => {
                                                        if (item.status === 'rejected') {
                                                            showAlert("The offer is rejected");
                                                            return;
                                                        }
                                                        show_offer_details(item)
                                                    }}>#{item.offer_id}</td>
                                                    <td className="text-secondary">{item.box ? item.box_dimension : item.product_name ? item.product_name : '-'}</td>
                                                    <td className="text-secondary">
                                                        {item.created_at ? new Date(item.created_at).toISOString().split("T")[0] : "-"}
                                                    </td>
                                                    <td className="text-secondary">{item.userName ? item.userName : '-'}</td>
                                                    <td className="text-dark"><b>{(parseFloat(item.amount) || 0) + (item.commission === 'null' || item.commission == null ? 0 : parseFloat(item.commission))}</b></td>
                                                    <td className="text-secondary">{item.company_name}</td>
                                                    <td className="text-secondary"
                                                        style={item.status === 'rejected' ? { cursor: 'pointer' } : {}}
                                                        onClick={() => { if (item.status === 'rejected') { delete_offer_admin(item.offer_id) } }}
                                                    >
                                                        <span className="px-3 py-2 d-flex flex-column w-100 text-center align-items-center justify-content-center" style={item.status === 'pending' ? { fontWeight: '600', backgroundColor: ' #FFEF9D', color: ' #9B8100' } : item.status === 'rejected' ? { fontWeight: '600', backgroundColor: '#ffcbcb', color: 'rgb(110, 0, 0)' } : { fontWeight: '600', backgroundColor: ' #CBFFCF', color: ' #006E09' }}>{item.status === 'complete' ? 'Accepted' : item.status === 'pending' ? 'Pending' : (<span className="d-flex flex-row text-center align-items-center justify-content-center gap-2 w-100">Rejected <AiFillDelete /></span>)}</span>
                                                    </td>
                                                    {/* <td className="text-secondary">
                                          <span
                                            className={`p-2 pe-4 ps-4 fw-bold ${item.status === 'pending' ? 'text-warning' : item.status === 'rejected' ? 'text-danger' : 'text-success'}`}
                                            style={{ backgroundColor: item.status === 'pending' ? 'rgb(255, 242, 128)' : item.status === 'rejected' ? 'rgb(255, 128, 128)' : 'rgb(145, 255, 128)' }}
                                          >
                                            {item.status === 'pending' ? 'Pending' : item.status === 'rejected' ? 'Rejected' : 'Success'}
                                          </span>
                                        </td> */}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center text-secondary">No Data Available</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showOfferDetails && (
                <>

                    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                        style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            zIndex: 9999
                        }}
                    >
                        <div className="bg-light rounded shadow p-4 position-relative border border-2 border-dark "
                            style={{
                                width: '90%',
                                maxWidth: '1100px',
                                height: '90vh',
                                overflowY: 'auto'
                            }}
                        >
                            <div className="d-flex flex-column justify-content-start align-items-start w-100">
                                <button className="btn btn-danger position-absolute top-0 end-0 m-2" onClick={() => setShowOfferDetails(null)}>
                                    ✕
                                </button>
                                <div className="d-flex justify-content-start align-items-center mt-2 ps-3 rounded-1" >
                                    <div className="d-flex ps-4 w-100 justify-content-start">
                                        <label className="fs-3"><strong>Offer Details</strong></label>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex flex-row justify-content-start align-items-start">
                                <div className="m-2 border border-1 border-secondary rounded-1" style={{ width: '10%' }}>
                                    <img src={showOfferDetails.img01} alt='' style={{ width: '100%', height: '100%' }} />
                                </div>
                                <div className="ms-5 d-flex flex-column align-items-start justify-content-start">
                                    <strong className="fs-4">{showOfferDetails.box ? 'Boxes' : showOfferDetails.product_name}</strong>
                                    {/* <strong className="fs-4">{showOfferDetails.product_name}</strong> */}
                                    <span className="text-secondary">Offer ID: #{showOfferDetails.offer_id}</span>
                                </div>
                            </div>

                            <div className="offer-details-wrap">
                                <h5 className="text-start w-100 mb-3" >Payment Information</h5>
                                {[
                                    [
                                        { icon: <SiAnytype />, label: "Amount Received", value: showOfferDetails.payment_info_amount ? showOfferDetails.payment_info_amount : '-' },
                                        { icon: <FaWeightScale />, label: "Commission Earned", value: showOfferDetails.commission },
                                        { icon: <RiExpandHeightFill />, label: "Payment Status", value: showOfferDetails.payment_info_status ? showOfferDetails.payment_info_status : '-' }
                                    ],
                                    [
                                        { icon: <SiAnytype />, label: "Paid By", value: showOfferDetails.user_email ? showOfferDetails.user_email : '-' },
                                        { icon: <FaWeightScale />, label: "Transaction ID", value: showOfferDetails.transaction_id ? showOfferDetails.transaction_id : '-' },
                                        { icon: <RiExpandHeightFill />, label: "Offer Status ", value: showOfferDetails.status === 'pending' ? 'Pending' : showOfferDetails.status === 'rejected' ? 'Rejected' : 'Success' }
                                    ],
                                    [
                                        { icon: <SiAnytype />, label: "Company Name", value: showOfferDetails.company_name },
                                        { icon: <FaWeightScale />, label: "Company Contact Number", value: showOfferDetails.contect_no },
                                        { icon: <RiExpandHeightFill />, label: "Company Email ID", value: showOfferDetails.created_by_email ? showOfferDetails.created_by_email : '-' }
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

                            {showOfferDetails.box ? <>
                                <div className="offer-details-wrap">

                                    <h5 className="text-start w-100 mb-3">Box Information</h5>

                                    <div className="d-flex flex-column flex-md-row flex-wrap w-100 gap-3 gap-lg-5 ">
                                        {[
                                            { icon: <SiAnytype />, label: "Box dimensions", value: showOfferDetails.box_dimension },
                                            { icon: <FaWeightScale />, label: "Number of Boxes", value: `${showOfferDetails.box_number}` },
                                        ].map((item, idx) => (
                                            <div key={idx} className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '40%' }}>
                                                <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                    style={{
                                                        width: '3rem',
                                                        height: '3rem',
                                                        backgroundColor: '#E1F5FF',
                                                        aspectRatio: '2 / 1'
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

                                    {/* <div className="d-flex flex-column flex-md-row flex-wrap w-100 gap-3 gap-lg-5 mt-3">
                                        {[
                                            { icon: <FaRuler />, label: "Box Info", value: `${showOfferDetails.box_info}` },
                                        ].map((item, idx) => (
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
                                    </div> */}
                                    <div className="d-flex flex-column flex-md-row flex-wrap w-100 gap-3 gap-lg-5 mt-3">
                                        <div
                                            className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer"
                                            style={{ width: "100%" }}
                                        >
                                            <div
                                                className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                style={{
                                                    width: "3rem",
                                                    height: "3rem",
                                                    backgroundColor: "#E1F5FF",
                                                }}
                                            >
                                                <FaRuler />
                                            </div>

                                            <div className="d-flex flex-column align-items-start gap-2">
                                                <span className="text-secondary">Box Info</span>
                                                <h6>{showOfferDetails.box_info}</h6>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </> : <>
                                <div className="offer-details-wrap">

                                    <h5 className="text-start w-100 mb-3">Product Information</h5>

                                    <div className="d-flex flex-column flex-md-row flex-wrap w-100 gap-3 gap-lg-5 ">
                                        {[
                                            { icon: <SiAnytype />, label: "Product Type", value: showOfferDetails.product_type ? showOfferDetails.product_type : '-' },
                                            { icon: <FaWeightScale />, label: "Weight", value: `${showOfferDetails.p_weight} Kg` },
                                            { icon: <RiExpandHeightFill />, label: "Height", value: `${showOfferDetails.p_height} Cm` }
                                        ].map((item, idx) => (
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

                                    <div className="d-flex flex-column flex-md-row flex-wrap w-100 gap-3 gap-lg-5 mt-3">
                                        {[
                                            { icon: <FaRuler />, label: "Length", value: `${showOfferDetails.p_length} Cm` },
                                            { icon: <RiExpandWidthFill />, label: "Width", value: `${showOfferDetails.p_width} Cm` }
                                        ].map((item, idx) => (
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
                                </div>
                            </>}


                            <div className="offer-details-wrap">
                                <h5 className="text-start w-100 mb-3">Pick Up Information</h5>
                                <div className="d-flex flex-column flex-md-row flex-wrap align-items-start justify-content-start w-100 gap-4 gap-md-5">
                                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
                                        <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                            style={{
                                                width: '3rem',
                                                height: '3rem',
                                                backgroundColor: '#E1F5FF',
                                                aspectRatio: '1 / 1'
                                            }}>
                                            <FaUser />
                                        </div>
                                        <div className="d-flex flex-column align-items-start gap-2">
                                            <span className="text-secondary">Full Name</span>
                                            <h6>{showOfferDetails.sender_name}</h6>
                                        </div>
                                    </div>

                                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
                                        <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                            style={{
                                                width: '3rem',
                                                height: '3rem',
                                                backgroundColor: '#E1F5FF',
                                                aspectRatio: '1 / 1'
                                            }}>
                                            <IoCall />
                                        </div>
                                        <div className="d-flex flex-column align-items-start gap-2">
                                            <span className="text-secondary">Contact Number</span>
                                            <h6>{showOfferDetails.sender_contact}</h6>
                                        </div>
                                    </div>

                                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
                                        <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                            style={{
                                                width: '3rem',
                                                height: '3rem',
                                                backgroundColor: '#E1F5FF',
                                                aspectRatio: '1 / 1'
                                            }}>
                                            <MdAttachEmail />
                                        </div>
                                        <div className="d-flex flex-column align-items-start gap-2">
                                            <span className="text-secondary">Email Address</span>
                                            <h6>{showOfferDetails.sender_email}</h6>
                                        </div>
                                    </div>
                                </div>

                                <div className="d-flex flex-column flex-md-row flex-wrap align-items-start justify-content-start w-100 gap-4 gap-md-5 mt-3">
                                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
                                        <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                            style={{
                                                width: '3rem',
                                                height: '3rem',
                                                backgroundColor: '#E1F5FF',
                                                aspectRatio: '1 / 1'
                                            }}>
                                            <FaFlag />
                                        </div>
                                        <div className="d-flex flex-column align-items-start gap-2">
                                            <span className="text-secondary">Country</span>
                                            <h6>{showOfferDetails.sender_country}</h6>
                                        </div>
                                    </div>

                                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
                                        <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                            style={{
                                                width: '3rem',
                                                height: '3rem',
                                                backgroundColor: '#E1F5FF',
                                                aspectRatio: '1 / 1'
                                            }}>
                                            <FaBuildingFlag />
                                        </div>
                                        <div className="d-flex flex-column align-items-start gap-2">
                                            <span className="text-secondary">State</span>
                                            <h6>{showOfferDetails.sender_state}</h6>
                                        </div>
                                    </div>

                                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
                                        <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                            style={{
                                                width: '3rem',
                                                height: '3rem',
                                                backgroundColor: '#E1F5FF',
                                                aspectRatio: '1 / 1'
                                            }}>
                                            <FaCity />
                                        </div>
                                        <div className="d-flex flex-column align-items-start gap-2">
                                            <span className="text-secondary">City</span>
                                            <h6>{showOfferDetails.sender_city}</h6>
                                        </div>
                                    </div>
                                </div>


                                <div className="d-flex flex-column flex-md-row flex-wrap align-items-start justify-content-start w-100 gap-4 gap-md-5 mt-3">
                                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
                                        <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                            style={{
                                                width: '3rem',
                                                height: '3rem',
                                                backgroundColor: '#E1F5FF',
                                                aspectRatio: '1 / 1'
                                            }}>
                                            <FaMapPin />
                                        </div>
                                        <div className="d-flex flex-column align-items-start gap-2">
                                            <span className="text-secondary">Street Address</span>
                                            <h6>{showOfferDetails.sender_address ? showOfferDetails.sender_address : '-'}</h6>
                                        </div>
                                    </div>

                                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
                                        <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                            style={{
                                                width: '3rem',
                                                height: '3rem',
                                                backgroundColor: '#E1F5FF',
                                                aspectRatio: '1 / 1'
                                            }}>
                                            <MdConfirmationNumber />
                                        </div>
                                        <div className="d-flex flex-column align-items-start gap-2">
                                            <span className="text-secondary">Zip Code</span>
                                            <h6>{showOfferDetails.sender_zipcode ? showOfferDetails.sender_zipcode : '-'}</h6>
                                        </div>
                                    </div>

                                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
                                        <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                            style={{
                                                width: '3rem',
                                                height: '3rem',
                                                backgroundColor: '#E1F5FF',
                                                aspectRatio: '1 / 1'
                                            }}>
                                            <FaCalendarCheck />
                                        </div>
                                        <div className="d-flex flex-column align-items-start gap-2">
                                            <span className="text-secondary">Pick Up Date</span>
                                            <h6>{showOfferDetails?.pickup_date?.includes('Select End Date') ? `${showOfferDetails?.pickup_date?.split(' - ')[0]} -` : showOfferDetails?.pickup_date ? showOfferDetails?.pickup_date : '-'}</h6>
                                        </div>
                                    </div>
                                </div>


                                <div className="d-flex flex-row align-items-between justify-contents-start w-100 gap-5 mt-3">
                                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-3" style={{ width: '100%' }}>
                                        <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary" style={{
                                            width: '3rem',
                                            height: '3rem',
                                            backgroundColor: '#E1F5FF',
                                            aspectRatio: '1 / 1'
                                        }}><FaInfoCircle /></div>
                                        <div className="d-flex flex-column align-items-start">
                                            <span className="text-secondary">Pick Up Notes</span>
                                            <p className="text-start"><h6>{showOfferDetails.sender_description ? showOfferDetails.sender_description : '-'}</h6></p>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="offer-details-wrap">

                                <h5 className="text-start w-100 mb-3">Delivery Information</h5>
                                <div className="d-flex flex-column flex-md-row flex-wrap align-items-start justify-content-start w-100 gap-4 gap-md-5">
                                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
                                        <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                            style={{
                                                width: '3rem',
                                                height: '3rem',
                                                backgroundColor: '#E1F5FF',
                                                aspectRatio: '1 / 1'
                                            }}>
                                            <FaUser />
                                        </div>
                                        <div className="d-flex flex-column align-items-start gap-2">
                                            <span className="text-secondary">Full Name</span>
                                            <h6>{showOfferDetails.receiver_name}</h6>
                                        </div>
                                    </div>

                                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
                                        <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                            style={{
                                                width: '3rem',
                                                height: '3rem',
                                                backgroundColor: '#E1F5FF',
                                                aspectRatio: '1 / 1'
                                            }}>
                                            <IoCall />
                                        </div>
                                        <div className="d-flex flex-column align-items-start gap-2">
                                            <span className="text-secondary">Contact Number</span>
                                            <h6>{showOfferDetails.receiver_contact}</h6>
                                        </div>
                                    </div>

                                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
                                        <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                            style={{
                                                width: '3rem',
                                                height: '3rem',
                                                backgroundColor: '#E1F5FF',
                                                aspectRatio: '1 / 1'
                                            }}>
                                            <MdAttachEmail />
                                        </div>
                                        <div className="d-flex flex-column align-items-start gap-2">
                                            <span className="text-secondary">Email Address</span>
                                            <h6>{showOfferDetails.receiver_email ? showOfferDetails.receiver_email : '-' }</h6>
                                        </div>
                                    </div>
                                </div>

                                <div className="d-flex flex-column flex-md-row flex-wrap align-items-start justify-content-start w-100 gap-4 gap-md-5 mt-3">
                                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
                                        <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                            style={{
                                                width: '3rem',
                                                height: '3rem',
                                                backgroundColor: '#E1F5FF',
                                                aspectRatio: '1 / 1'
                                            }}>
                                            <FaFlag />
                                        </div>
                                        <div className="d-flex flex-column align-items-start gap-2">
                                            <span className="text-secondary">Country</span>
                                            <h6>{showOfferDetails.receiver_country ? showOfferDetails.receiver_country : '-' }</h6>
                                        </div>
                                    </div>

                                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
                                        <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                            style={{
                                                width: '3rem',
                                                height: '3rem',
                                                backgroundColor: '#E1F5FF',
                                                aspectRatio: '1 / 1'
                                            }}>
                                            <FaBuildingFlag />
                                        </div>
                                        <div className="d-flex flex-column align-items-start gap-2">
                                            <span className="text-secondary">State</span>
                                            <h6>{showOfferDetails.receiver_state ? showOfferDetails.receiver_state : '-' }</h6>
                                        </div>
                                    </div>

                                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
                                        <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                            style={{
                                                width: '3rem',
                                                height: '3rem',
                                                backgroundColor: '#E1F5FF',
                                                aspectRatio: '1 / 1'
                                            }}>
                                            <FaCity />
                                        </div>
                                        <div className="d-flex flex-column align-items-start gap-2">
                                            <span className="text-secondary">City</span>
                                            <h6>{showOfferDetails.receiver_city ? showOfferDetails.receiver_city : '-' }</h6>
                                        </div>
                                    </div>
                                </div>


                                <div className="d-flex flex-column flex-md-row flex-wrap align-items-start justify-content-start w-100 gap-4 gap-md-5 mt-3">
                                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
                                        <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                            style={{
                                                width: '3rem',
                                                height: '3rem',
                                                backgroundColor: '#E1F5FF',
                                                aspectRatio: '1 / 1'
                                            }}>
                                            <FaMapPin />
                                        </div>
                                        <div className="d-flex flex-column align-items-start gap-2">
                                            <span className="text-secondary">Street Address</span>
                                            <h6>{showOfferDetails.receiver_address ? showOfferDetails.receiver_address : '-' }</h6>
                                        </div>
                                    </div>

                                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
                                        <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                            style={{
                                                width: '3rem',
                                                height: '3rem',
                                                backgroundColor: '#E1F5FF',
                                                aspectRatio: '1 / 1'
                                            }}>
                                            <MdConfirmationNumber />
                                        </div>
                                        <div className="d-flex flex-column align-items-start gap-2">
                                            <span className="text-secondary">Zip Code</span>
                                            <h6>{showOfferDetails.receiver_zipcode ? showOfferDetails.receiver_zipcode : '-' }</h6>
                                        </div>
                                    </div>

                                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
                                        <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                            style={{
                                                width: '3rem',
                                                height: '3rem',
                                                backgroundColor: '#E1F5FF',
                                                aspectRatio: '1 / 1'
                                            }}>
                                            <FaCalendarCheck />
                                        </div>
                                        <div className="d-flex flex-column align-items-start gap-2">
                                            <span className="text-secondary">Preferred Delivery Date</span>
                                            <h6>{showOfferDetails.departure_date ? showOfferDetails.departure_date : '-' }</h6>
                                        </div>
                                    </div>
                                </div>


                                <div className="d-flex flex-row flex-wrap align-items-start justify-content-start w-100 gap-5 mt-3">
                                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '100%' }}>
                                        <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                            style={{
                                                width: '3rem',
                                                height: '3rem',
                                                backgroundColor: '#E1F5FF',
                                                aspectRatio: '1 / 1'
                                            }}>
                                            <FaInfoCircle />
                                        </div>
                                        <div className="d-flex flex-column align-items-start gap-2">
                                            <span className="text-secondary">Delivery Notes</span>
                                            <h6 className="text-start">{showOfferDetails.receiver_description ? showOfferDetails.receiver_description : '-' }</h6>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default Offers;