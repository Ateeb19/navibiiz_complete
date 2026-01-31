import React, { useEffect, useState } from "react";
import { FaBuilding, FaEye, FaRegCheckCircle } from "react-icons/fa";
import { LuCircleX } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "../../alert/Alert_message";
import { DateRange } from 'react-date-range';
import { format } from "date-fns";
import CountriesSelector from "../../Selector/Countries_selector";
import { AiFillDelete } from "react-icons/ai";
import axios from "axios";
import { RiContactsBook3Fill } from "react-icons/ri";
import { IoIosMailOpen } from "react-icons/io";
import PaypalPayment from "../../Paypal/Paypal_payment";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import ConfirmationModal from "../../alert/Conform_alert";
import { IoTrashBin } from "react-icons/io5";
import useIsMobile from "../../hooks/useIsMobile";

const Offers = () => {
    const port = process.env.REACT_APP_SECRET;
    const { showAlert } = useAlert();
    const navigate = useNavigate();
    const { id } = useParams();
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const [offers, setOffers] = useState([]);
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: null,
            key: 'selection'
        }
    ]);
    const [showCalendar, setShowCalendar] = useState(false);
    const [admin_offer, setAdmin_offer] = useState([]);
    const [show_admin_offer, setShow_admin_offer] = useState('');
    const [show_company_details, setShow_company_details] = useState(null);
    const [selected_offer, setSelected_offer] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [deleteAction, setDeleteAction] = useState(null);
    const isMobile = useIsMobile();




    const offersForUser = () => {
        axios.get(`${port}/send_groupage/show_offer_user/${id}`, {
            headers: {
                Authorization: token,
            }
        }).then((response) => {
            if (response.data.status === true) {
                setOffers(response.data.message);
            } else {
                setOffers([]);
            }
        }).catch((err) => { console.log(err); });
    }

    useEffect(() => {
        offersForUser();
    }, [])

    console.log(admin_offer);
    const openDeleteModal = (message, deleteFunction) => {
        setModalMessage(message);
        setDeleteAction(() => deleteFunction);
        setShowModal(true);
    };

    const handleShowOffer = (item) => {
        axios.get(`${port}/send_groupage/groupage_info/${item.order_id}`, {
            headers: {
                Authorization: token,
            }
        }).then((response) => {
            setSelected_offer({ ...response.data.message, ...item });
        }).catch((err) => { console.log(err); });
    }
    const handle_user_offer_details = (offer_id, groupage_id, price, commission) => {
        axios.get(`${port}/user/company_details/${offer_id}`, {
            headers: {
                Authorization: token,
            }
        }).then((res) => {
            if (res.data.status === true) {
                setShow_company_details({
                    data: res.data.message,
                    price: price - commission,
                    commission: commission
                });
            } else {
                setShow_company_details(null);
            }
        }).catch((err) => console.log(err));
    }

    const handleDeleteoffer = (item) => {
        openDeleteModal("Are you sure you want to delete this offer?", () => {
            axios.delete(`${port}/send_groupage/delete_offer_user/${item}`, {
                headers: { Authorization: token },
            })
                .then((response) => {
                    showAlert(response.data.message);
                    // window.location.reload();
                    offersForUser();
                })
                .catch((err) => console.log(err));
        });

    }
    const confirmDelete = () => {
        if (deleteAction) {
            deleteAction();
        }
        setShowModal(false);
    };

    const cancelDelete = () => {
        setShowModal(false);
        showAlert("Delete canceled");
    };
    return (
        <>
            <ConfirmationModal
                show={showModal}
                message={modalMessage}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
            <div className="bg-light" style={{ width: '100%', overflow: 'auto', paddingBottom: '80px' }}>
                <div className="d-flex justify-content-start align-items-center mt-2 ps-3 rounded-1" >
                    <div className="d-flex flex-column ps-4 w-100 justify-content-start align-items-start">
                        <label className="fs-3"><strong>Offers List</strong></label>
                        {userRole === 'user' && (
                            <>
                                {/* <marquee behavior="scroll" direction="left" scrollamount="12">
                        <label className="fs-6 me-4">
                          <strong>Note -: </strong> You are paying 10% of the amount now and the remaining amount you can pay directly to the company.
                        </label>
                        <label className="fs-6 me-4">
                          <strong>Note -: </strong> You are paying 10% of the amount now and the remaining amount you can pay directly to the company.
                        </label>
                        <label className="fs-6 me-4">
                          <strong>Note -: </strong> You are paying 10% of the amount now and the remaining amount you can pay directly to the company.
                        </label>
                      </marquee> */}
                                {/* <div className="marquee">
                                    <div className="marquee__track">
                                        <span className="text">
                                            <strong>Note -: </strong> You will pay €5 of the total amount now, and the remaining balance will be paid directly to the transporter.
                                        </span>
                                        <span className="text">
                                            <strong>Note -: </strong> You will pay €5 of the total amount now, and the remaining balance will be paid directly to the transporter.
                                        </span>
                                        <span className="text">
                                            <strong>Note -: </strong> You will pay €5 of the total amount now, and the remaining balance will be paid directly to the transporter.
                                        </span>
                                        <span className="text">
                                            <strong>Note -: </strong> You will pay €5 of the total amount now, and the remaining balance will be paid directly to the transporter.
                                        </span>
                                    </div>
                                </div> */}
                                <div className="text-start mt-2">
                                    <span className="text">
                                        <strong>Note -: </strong> You will pay €5 of the total amount now, and the remaining balance will be paid directly to the transporter.
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="dashboard-wrapper-box">

                    <div className="table-wrap">

                        <div className="table-filter-wrap">
                            {/* <div className="d-flex flex-column align-items-start justify-content-start ps-2 mb-3 w-100">
                                <h5>Filter By:</h5>
                                <div className="row w-100 g-2 mt-1 ">
                                    <div className="col-12 col-md-6 col-lg-3">
                                        <input
                                            type="text"
                                            placeholder="Search by product name or order id"
                                            className="shipping-input-field"
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-3">
                                        <CountriesSelector label="Pick Up Country" paddingcount='12px 18px' fontsizefont='15px' bgcolor='#ebebeb' bordercolor='1px solid #ebebeb' borderradiuscount='6px' />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-3">
                                        <CountriesSelector label="Destination Country" paddingcount='12px 18px' fontsizefont='15px' bgcolor='#ebebeb' bordercolor='1px solid #ebebeb' borderradiuscount='6px' />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-3 position-relative">
                                        <input
                                            type="text"
                                            readOnly
                                            className="shipping-input-field"
                                            value={
                                                state[0].endDate
                                                    ? `${format(state[0].startDate, "dd/MM/yyyy")} - ${format(state[0].endDate, "dd/MM/yyyy")}`
                                                    : `${format(state[0].startDate, "dd/MM/yyyy")} - Select End Date`
                                            }
                                            onClick={() => setShowCalendar(!showCalendar)}
                                            style={{ cursor: "pointer" }}
                                        />
                                        {showCalendar && (
                                            <div
                                                className="position-absolute bg-white rounded shadow-sm p-2"
                                                style={{ top: "40px", zIndex: 1000 }}
                                            >
                                                <DateRange
                                                    editableDateInputs={true}
                                                    onChange={(item) => setState([item.selection])}
                                                    moveRangeOnFirstSelection={false}
                                                    ranges={state}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div> */}
                        </div>
                        {isMobile ?
                            <>
                                <div className="d-flex flex-column w-100 align-items-center justify-content-center gap-3">
                                    {offers && offers.length > 0 ? (
                                        <>
                                            {offers.filter(item => item.status !== 'rejected')
                                                .sort((a, b) => Number(a.accepted) - Number(b.accepted))
                                                .map((item, index) => (
                                                    <div className="orders-mobile-card w-100" style={{ cursor: 'pointer' }} onClick={() =>
                                                        item.accepted === '1'
                                                            ? handle_user_offer_details(item.offer_id, item.groupage_id, item.price, item.commission)
                                                            : handleShowOffer(item)
                                                    }>
                                                        <div className="d-flex justify-content-between w-100">
                                                            <div className="text-start">
                                                                <div className="d-flex gap-2">
                                                                    <h5>Order Id </h5> <h5 className="text-primary">#{item.order_id}</h5>
                                                                </div>
                                                                <div className="d-flex">
                                                                    <h5>{item.box ? "Boxes" : item.product_name !== 'N/A' ? item.product_name : '-'}</h5>
                                                                </div>
                                                            </div>
                                                            <div className="d-flex align-items-center justify-content-center">
                                                                <button
                                                                    className="btn btn-sm text-light"

                                                                    onClick={() => handleDeleteoffer(item.offer_id)}
                                                                    disabled={item.accepted === '1'}
                                                                >
                                                                    <IoTrashBin className="fs-4" style={{ color: '#c63d3d' }} />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="d-flex flex-column justify-content-start align-items-start">
                                                            <h6>Offer From : XXXXX-XXX</h6>
                                                            <h6>Total Amount (€) : {parseFloat(item.price) + parseFloat(item.commission)}</h6>
                                                            <h6>Amount to pay now (€) : {item.commission}</h6>
                                                            <h6>Delivery Duration : {item.delivery_duration.replace(/_/g, ' ')}</h6>
                                                            <h6>Transporter Pickup : {item.office_address ? <>No</> : <>Yes</>}</h6>
                                                        </div>
                                                    </div>
                                                ))}
                                        </>
                                    ) : (
                                        <>

                                        </>
                                    )}

                                </div>
                            </>
                            :
                            <>
                                <div className="table-responsive" style={{
                                    width: "100%",
                                    overflowX: "auto",
                                    whiteSpace: "nowrap",
                                }}>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col"><h6>Order Id</h6></th>
                                                <th scope="col"><h6>Product Name</h6></th>
                                                <th scope="col"><h6>Offer From</h6></th>
                                                <th scope="col"><h6>Total Amount (€)</h6></th>
                                                <th scope="col"><h6>Amount to pay now (€)</h6></th>
                                                <th scope="col"><h6>Delivery Duration</h6></th>
                                                <th scope="col"><h6>Transporter Pickup</h6></th>
                                                <th scope="col"><h6>Actions</h6></th>
                                            </tr>
                                        </thead>
                                        {offers && offers.length > 0 ? (
                                            <tbody>
                                                {offers
                                                    .filter(item => item.status !== 'rejected')
                                                    .sort((a, b) => Number(a.accepted) - Number(b.accepted))
                                                    .map((item, index) => (
                                                        <tr
                                                            key={index}
                                                            onClick={() =>
                                                                item.accepted === '1'
                                                                    ? handle_user_offer_details(item.offer_id, item.groupage_id, item.price, item.commission)
                                                                    : null
                                                            }
                                                            style={{ cursor: item.accepted === '1' ? 'pointer' : 'default' }}
                                                            className="justify-content-center align-items-center"
                                                        >
                                                            <td className="text-primary">#{item.order_id}</td>
                                                            <td className="text-secondary">{item.box ? "Boxes" : item.product_name !== 'N/A' ? item.product_name : '-'}</td>
                                                            <td className="text-secondary">XXXXX-XXX</td>
                                                            <td className="text-secondary">{parseFloat(item.price) + parseFloat(item.commission)}</td>
                                                            {/* <td className="text-secondary"><Link11 title="You are paying 10% of the amount now and the remaining amount you can pay directly to the company" id="t-1">{item.commission}</Link11></td> */}
                                                            <td className="text-secondary">{item.commission}</td>
                                                            <td className="text-secondary">
                                                                {item.delivery_duration.replace(/_/g, ' ')}
                                                            </td>
                                                            <td className="text-secondary">{item.office_address ? <>No</> : <>Yes</>}</td>
                                                            <td className="d-flex align-items-center justify-content-center w-100 gap-3">
                                                                {item.accepted === '1' ? <>
                                                                    <span className='p-2 fw-bold' style={{ backgroundColor: '#bcffba', color: '#0b7e01' }}>Accepted</span>
                                                                </> : <>
                                                                    <button
                                                                        className="btn btn-sm text-light"
                                                                        // style={{ backgroundColor: '#31b23c' }}
                                                                        onClick={() => handleShowOffer(item)}
                                                                        disabled={item.accepted === '1'}
                                                                    >
                                                                        <FaEye className="fs-4" style={{ color: 'rgb(1, 42, 82)' }} />
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-sm text-light"

                                                                        onClick={() => handleDeleteoffer(item.offer_id)}
                                                                        disabled={item.accepted === '1'}
                                                                    >
                                                                        <IoTrashBin className="fs-4" style={{ color: '#c63d3d' }} />
                                                                    </button>
                                                                </>}

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
                            </>}
                    </div>
                </div>

            </div >

            {
                show_company_details !== null && (
                    <>
                        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center" style={{ zIndex: 1050 }}>
                            <div className="position-relative bg-white p-4 rounded shadow-lg" style={{ width: '580px', height: 'auto' }}>
                                <button
                                    className="btn-close position-absolute top-0 end-0 m-2"
                                    onClick={() => setShow_company_details(null)}
                                ></button>

                                <div className='d-flex flex-column align-items-start'>
                                    <div className='title-head'><h3>Transporter Details</h3></div>

                                    <div className='details-wrap w-100 text-start'>
                                        <span>< FaBuilding className='fs-4 me-2' style={{ color: '#de8316', width: '20px' }} />Name -: {show_company_details?.data?.company_name}</span>
                                    </div>

                                    <div className='details-wrap w-100 text-start'>
                                        <span>< IoIosMailOpen className='fs-4 me-2' style={{ color: '#de8316', width: '20px' }} />E-mail -: <a href={`mailto:"${show_company_details?.data?.email}"`}>{show_company_details?.data?.email}</a></span>
                                    </div>

                                    <div className='details-wrap w-100 text-start'>
                                        <span>< RiContactsBook3Fill className='fs-4 me-2' style={{ color: '#de8316', width: '20px' }} />Contact Number-: {show_company_details?.data?.contect_no}</span>
                                    </div>
                                    {show_company_details?.data?.office_address && (
                                        <>
                                            <div className='details-wrap w-100 text-start'>
                                                <span>< RiContactsBook3Fill className='fs-4 me-2' style={{ color: '#de8316', width: '20px' }} />Office Address-: {show_company_details?.data?.office_address}</span>
                                            </div>
                                        </>
                                    )}
                                    <div className='details-wrap w-100 text-start'>
                                        <span>< RiContactsBook3Fill className='fs-4 me-2' style={{ color: '#de8316', width: '20px' }} />Amount pay to Transporter-: €{parseFloat(show_company_details?.price) + parseFloat(show_company_details?.commission)}</span>
                                    </div>

                                    <div className='details-wrap w-100 text-start'>
                                        <span>< RiContactsBook3Fill className='fs-4 me-2' style={{ color: '#de8316', width: '20px' }} />Amount payed-: €{show_company_details?.commission}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </>
                )
            }

            {
                selected_offer && (
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
                                    height: '90vh',
                                    overflowY: 'auto'
                                }}
                            >
                                {/* <PayPalScriptProvider options={{ "client-id": "AabacLi27CRoLZCcaHTYgUesly35TFDCyoMmm3Vep3pSPbHrLuBNL7-LYbdvtNsFVnWNHoK1Nyq5dDSX", currency: "EUR" }}> */}
                                <PayPalScriptProvider options={{ "client-id": "AVNh59zTvpqrmnQPV_gT/PRJiduXU4Fdp8_y2ESR-XhvYWEZflyR8TEpE8zA3-IE2UZR1SOhxGYgepYGL", currency: "EUR" }}>


                                    {/* <PayPalScriptProvider options={{ "client-id": "AZOcns1edlBV838gnlQgdp25SJW-RXc8Kle0FL3dTj0t289XKg2W7hXOJFG9zngWOko3VQqERais4-aY", currency: "EUR" }}> */}
                                    <div className="d-flex flex-column justify-content-start align-items-start w-100">
                                        <button className="btn btn-danger position-absolute top-0 end-0 m-2" onClick={() => setSelected_offer(null)}>
                                            ✕
                                        </button>

                                        <strong className="fs-4">Offer Details</strong>

                                        <h5 className="mt-3">Product Information</h5>
                                        <div className="d-flex flex-column align-items-start justify-content-start mt-1 w-100 border-bottom pb-3 border-2 gap-2">
                                            <div className=" d-flex flex-row align-items-start justify-content-between w-100">
                                                <span className="text-secondary">Product ID : </span>
                                                <span>{selected_offer.id}</span>
                                            </div>
                                            <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                                {selected_offer.box ? <>
                                                    <span className="text-secondary">Box Dimensions : </span>
                                                    <span>{selected_offer.box_dimension}</span>
                                                </> : <>
                                                    <span className="text-secondary">Product Name : </span>
                                                    <span>{selected_offer.product_name}</span>
                                                </>}
                                            </div>
                                            {/* <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                            <span className="text-secondary">Weight : </span>
                                            <span>{selected_offer.p_weight} {selected_offer.p_weight && "Kg"}</span>
                                        </div>
                                        <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                            <span className="text-secondary">Height :  </span>
                                            <span>{selected_offer.p_height} {selected_offer.p_height && "Cm"}</span>
                                        </div>
                                        <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                            <span className="text-secondary">Length : </span>
                                            <span>{selected_offer.p_length} {selected_offer.p_length && "Cm"}</span>
                                        </div>
                                        <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                            <span className="text-secondary">Width : </span>
                                            <span>{selected_offer.p_width} {selected_offer.p_width && "Cm"}</span>
                                        </div> */}
                                        </div>

                                        <h5 className="mt-3">Transporter Information</h5>
                                        <div className="d-flex flex-column align-items-start justify-content-start mt-1 w-100 border-bottom pb-3 border-2 gap-2">
                                            <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                                <span className="text-secondary">Transporter Name : </span>
                                                <span>XXXX-XX</span>
                                            </div>
                                            <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                                <span className="text-secondary">Price Offered : </span>
                                                <span className="fw-bold">€{parseFloat(selected_offer.price) + parseFloat(selected_offer.commission)}</span>
                                            </div>
                                            <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                                <span className="text-secondary">Amount to Pay Now: </span>
                                                <span className="fw-bold">€{selected_offer.commission}</span>
                                            </div>
                                            <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                                <span className="text-secondary">Amount pay to Transporter : </span>
                                                <span className="fw-bold">€{selected_offer.price}</span>
                                            </div>
                                            <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                                <span className="text-secondary">Offer Received Date : </span>
                                                <span>{selected_offer.created_at.split("T")[0]}</span>
                                            </div>
                                        </div>

                                        <h5 className="mt-3">Pick Up Information</h5>
                                        <div className="d-flex flex-column align-items-start justify-content-start mt-1 w-100 border-bottom pb-3 border-2 gap-2">
                                            <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                                <span className="text-secondary">Full Name : </span>
                                                <span>{selected_offer.sender_name}</span>
                                            </div>
                                            <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                                <span className="text-secondary">Contact Number : </span>
                                                <span>{selected_offer.sender_contact}</span>
                                            </div>
                                            <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                                <span className="text-secondary">Email ID : </span>
                                                <span>{selected_offer.sender_email}</span>
                                            </div>
                                            <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                                <span className="text-secondary">Country : </span>
                                                <span>{selected_offer.sender_country}</span>
                                            </div>
                                            <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                                <span className="text-secondary">State : </span>
                                                <span>{selected_offer.sender_state}</span>
                                            </div>
                                            <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                                <span className="text-secondary">City : </span>
                                                <span>{selected_offer.sender_city}</span>
                                            </div>
                                            {/* <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                            <span className="text-secondary">Street Address : </span>
                                            <span>{selected_offer.sender_address ? selected_offer.sender_address : '-'}</span>
                                        </div>
                                        <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                            <span className="text-secondary">Zip Code : </span>
                                            <span>{selected_offer.sender_zipcode ? selected_offer.sender_zipcode : '-'}</span>
                                        </div>
                                        <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                            <span className="text-secondary">Pick Up Date : </span>
                                            <span>{
                                                selected_offer.pickup_date && selected_offer.pickup_date !== 'null'
                                                    ? selected_offer.pickup_date.includes('Select End Date')
                                                        ? selected_offer.pickup_date.split(' - ')[0] || '-'
                                                        : selected_offer.pickup_date.split(' - ')[0] || '-'
                                                    : '-'
                                                // selected_offer.pickup_date.includes('Select End Date') ? selected_offer.pickup_date.split(' - ')[0] : selected_offer.pickup_date
                                            }</span>
                                        </div> */}
                                        </div>

                                        <h5 className="mt-3">Delivery Information</h5>
                                        <div className="d-flex flex-column align-items-start justify-content-start mt-1 w-100 border-bottom pb-3 border-2 gap-2">
                                            <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                                <span className="text-secondary">Full Name : </span>
                                                <span>{selected_offer.receiver_name}</span>
                                            </div>
                                            <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                                <span className="text-secondary">Contact Number : </span>
                                                <span>{selected_offer.receiver_contact}</span>
                                            </div>
                                            {/* <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                            <span className="text-secondary">Email ID : </span>
                                            <span>{selected_offer.receiver_email ? selected_offer.receiver_email : '-'}</span>
                                        </div> */}
                                            <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                                <span className="text-secondary">Country : </span>
                                                <span>{selected_offer.receiver_country ? selected_offer.receiver_country : '-'}</span>
                                            </div>
                                            {/* <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                            <span className="text-secondary">State : </span>
                                            <span>{selected_offer.receiver_state ? selected_offer.receiver_state : '-'}</span>
                                        </div>
                                        <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                            <span className="text-secondary">City : </span>
                                            <span>{selected_offer.receiver_city ? selected_offer.receiver_city : '-'}</span>
                                        </div>
                                        <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                            <span className="text-secondary">Street Address : </span>
                                            <span>{selected_offer.receiver_address ? selected_offer.receiver_address : '-'}</span>
                                        </div>
                                        <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                            <span className="text-secondary">Zip Code : </span>
                                            <span>{selected_offer.receiver_zipcode ? selected_offer.receiver_zipcode : '-'}</span>
                                        </div> */}
                                            {/* <div className="d-flex flex-row align-items-start justify-content-between w-100">
                        <span className="text-secondary">Delivery Duration : </span>
                        <span>{duration_calculate(selected_offer.delivery_duration, selected_offer.pickup_date)}</span>
                        <span>{duration_calculate(selected_offer.delivery_duration, selected_offer.pickup_date)}</span>
                      </div> */}
                                            {/* {selected_offer.office_address && (
                        <>
                          <div className="d-flex flex-row align-items-start justify-content-between w-100">
                            <span className="text-secondary">Office Address : </span>
                            <span>{selected_offer.office_address}</span>
                          </div>
                        </>
                      )} */}
                                        </div>

                                        {/* <button onClick={() => {
                      axios.post(`${port}/paypal/api/test_api`, {
                        offerId: selected_offer.offer_id,
                        amount: selected_offer.price,
                      }, {
                        headers: {
                          Authorization: token,
                        }
                      }).then((res) => {
                        if (res.data.current_status === true) {
                          showAlert(`Transaction successful: ${res.data.transaction_ID}`);
                        }
                      }).catch((err) => { console.log(err) });
                    }}>test payment button</button>
                     */}
                                        <div className="d-flex flex-column w-100 justify-content-center align-items-center">
                                            <PaypalPayment
                                                key={selected_offer?.offer_id}
                                                selected_offer={selected_offer}
                                            />

                                            <button className="btn btn-danger mt-3  w-100" onClick={() => handleDeleteoffer(selected_offer.offer_id)}>Reject</button>
                                        </div>
                                    </div>
                                </PayPalScriptProvider>

                            </div>
                        </div>
                    </>
                )
            }
        </>
    )
}

export default Offers;