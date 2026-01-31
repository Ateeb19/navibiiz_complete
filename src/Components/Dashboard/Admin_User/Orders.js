import axios from "axios";
import React, { useEffect, useState } from "react";
import { DateRange } from 'react-date-range';
import { FaCalendarCheck, FaCity, FaEye, FaFlag, FaInfoCircle, FaMapPin, FaRuler, FaUser, FaUserTie } from "react-icons/fa";
import { FaBuildingFlag, FaWeightScale } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import { MdAttachEmail, MdConfirmationNumber, MdDelete } from "react-icons/md";
import { RiExpandHeightFill, RiExpandWidthFill } from "react-icons/ri";
import { SiAnytype } from "react-icons/si";
import { format } from "date-fns";
import CountriesSelector from "../../Selector/Countries_selector";
import { useAlert } from "../../alert/Alert_message";
import ConfirmationModal from '../../alert/Conform_alert';
import useIsMobile from "../../hooks/useIsMobile";
import { useNavigate } from "react-router-dom";

const Orders = () => {
    const port = process.env.REACT_APP_SECRET;
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [selected_groupage, setSelected_groupage] = useState(null);
    const [groupageUser, setGroupageUser] = useState([]);
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: null,
            key: 'selection'
        }
    ]);
    const [showCalendar, setShowCalendar] = useState(false);
    const { showAlert } = useAlert();
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [deleteAction, setDeleteAction] = useState(null);
    const isMobile = useIsMobile();

    const displayGroupageUser = () => {
        axios.get(`${port}/send_groupage/display_user_dashboard`, {
            headers: {
                Authorization: token,
            }
        }).then((response) => {
            setGroupageUser(response.data.message);
        }).catch((err) => { console.log(err); });
    }

    useEffect(() => {
        displayGroupageUser();
    }, []);

    const cancelDelete = () => {
        setShowModal(false);
        showAlert("Delete canceled");
    };
    const confirmDelete = () => {
        if (deleteAction) {
            deleteAction();
        }
        setShowModal(false);
    };
    const openDeleteModal = (message, deleteFunction) => {
        setModalMessage(message);
        setDeleteAction(() => deleteFunction);
        setShowModal(true);
    };
    const handle_show_groupage_details = (item) => {
        setSelected_groupage(item);
    }
    const handle_show_groupage_delete = (item) => {

        openDeleteModal(`Are you sure you want to delete ${item.name}?`, () => {
            axios.delete(`${port}/send_groupage/delete_groupage/${item.id}`, {
                headers: { Authorization: token },
            })
                .then((response) => {
                    showAlert(response.data.message);
                    // window.location.reload();
                    displayGroupageUser();
                })
                .catch((err) => console.log(err));
        });

    }

    return (
        <>
            <div className="bg-light" style={{ width: '100%', overflow: 'auto', paddingBottom: '80px' }}>
                <ConfirmationModal
                    show={showModal}
                    message={modalMessage}
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
                <div className="d-flex justify-content-start align-items-center mt-2 ps-3 rounded-1" >
                    <div className="d-flex ps-4 w-100 justify-content-start">
                        <label className="fs-3"><strong>Order List</strong></label>
                    </div>
                </div>

                <div className="dashboard-wrapper-box">
                    <div className="table-wrap">
                        <div className="d-flex flex-column justify-content-start align-items-start ">
                            <div className="table-filter-wrap">
                                <div className="d-flex flex-column align-items-start justify-content-start ps-2 mb-3 w-100">
                                    <h5>Filter By:</h5>

                                    <div className="row w-100 g-2 mt-1 ">
                                        <div className="col-12 col-md-6 col-lg-3">
                                            <input type="text" placeholder="Search by product name or order id" className="shipping-input-field" />
                                        </div>
                                        <div className="col-12 col-md-6 col-lg-3">
                                            <CountriesSelector paddingcount='12px 18px' fontsizefont='15px' bgcolor='#ebebeb' bordercolor='1px solid #ebebeb' borderradiuscount='6px' label="Pick Up Country" />
                                        </div>
                                        <div className="col-12 col-md-6 col-lg-3">
                                            <CountriesSelector paddingcount='12px 18px' fontsizefont='15px' bgcolor='#ebebeb' bordercolor='1px solid #ebebeb' borderradiuscount='6px' label="Destination Country" />
                                        </div>
                                        <div className="col-12 col-md-6 col-lg-3">
                                            <div style={{ position: "relative", width: "100%" }}>
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
                                                    <div style={{
                                                        position: "absolute",
                                                        top: "40px",
                                                        zIndex: 1000,
                                                        background: "#fff",
                                                        borderRadius: "8px",
                                                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)"
                                                    }}>
                                                        <DateRange
                                                            editableDateInputs={true}
                                                            onChange={item => setState([item.selection])}
                                                            moveRangeOnFirstSelection={false}
                                                            ranges={state}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {isMobile ?
                                <>
                                    <div className="d-flex flex-column w-100 align-items-center justify-content-center gap-3">
                                        {groupageUser && groupageUser.length > 0 ? (
                                            <>
                                                {groupageUser.map((item, index) => (
                                                    <div className="orders-mobile-card w-100" style={{ cursor: 'pointer' }} onClick={() => handle_show_groupage_details(item)}>
                                                        <div className="d-flex justify-content-between w-100">
                                                            <div className="text-start">
                                                                <div className="d-flex gap-2">
                                                                    <h5>Order Id </h5> <h5 className="text-primary">#{item.id}</h5>
                                                                </div>
                                                                <div className="d-flex">
                                                                    <h5>{item.box ? "Boxes" : item.product_name ? item.product_name : '-'}</h5>
                                                                </div>
                                                            </div>
                                                            <div className="d-flex align-items-center justify-content-center">
                                                                {/* <button className="btn btn-sm btn-light text-primary pt-0 pb-0" onClick={() => handle_show_groupage_details(item)} style={{ fontSize: '1.5rem' }}>
                                                                    <FaEye />
                                                                </button> */}
                                                                <button className="btn btn-sm btn-primary text-white py-2 px-3 user-order-btn text-primary me-1" onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/offers-user/${item.id}`) }}>
                                                                    View Offers
                                                                </button>
                                                                <button className="btn btn-sm text-danger pt-0 pb-0" onClick={(e) => { e.stopPropagation(); handle_show_groupage_delete(item) }} style={{ fontSize: '1.5rem' }}>
                                                                    <MdDelete />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="d-flex flex-column justify-content-start align-items-start">
                                                            <h6>Pick up : {item.sender_country ? item.sender_country : '-'}</h6>
                                                            <h6>Delivery to : {item.receiver_country ? item.receiver_country : '-'}</h6>
                                                            <h6>Total Offers Received : {item.offers_count ? item.offers_count : '0'}</h6>
                                                            <h6>Payment Status : <span className="p-1 fw-bold user-offer-width" style={{
                                                                backgroundColor: item.payment_status === 'panding' ? 'rgb(255, 191, 191)' : '#bcffba',
                                                                color: item.payment_status === 'panding' ? 'rgb(252, 30, 30)' : '#10c200'
                                                            }}>
                                                                {item.payment_status === 'panding' ? 'Unpaid' : 'Paid'}
                                                            </span></h6>
                                                        </div>
                                                    </div>
                                                ))}
                                            </>
                                        ) : (
                                            <>

                                            </>
                                        )}

                                    </div>
                                </> :
                                <>
                                    <div className="table-responsive w-100 ">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th scope="col"><h6>Order Id</h6></th>
                                                    <th scope="col"><h6>Product Name</h6></th>
                                                    <th scope="col"><h6>Pick up</h6></th>
                                                    <th scope="col"><h6>Delivery to</h6></th>
                                                    <th scope="col"><h6>Total Offers Received</h6></th>
                                                    <th scope="col"><h6>Payment Status</h6></th>
                                                    <th scope="col"><h6>Actions</h6></th>
                                                </tr>
                                            </thead>
                                            {groupageUser && groupageUser.length > 0 ? (
                                                <tbody>
                                                    {groupageUser.map((item, index) => (
                                                        <tr key={index}>
                                                            <td className="text-primary" style={{ cursor: 'pointer' }} onClick={() => handle_show_groupage_details(item)}>#{item.id}</td>
                                                            <td className="text-secondary">{item.box ? "Boxes" : item.product_name ? item.product_name : '-'}</td>
                                                            <td className="text-secondary">{item.sender_country ? item.sender_country : '-'}</td>
                                                            <td className="text-secondary">{item.receiver_country ? item.receiver_country : '-'}</td>
                                                            {/* <td className="text-secondary">{
                                                        item.pickup_date && item.pickup_date !== 'null'
                                                            ? item.pickup_date.includes('Select End Date')
                                                                ? item.pickup_date.split(' - ')[0] || '-'
                                                                : item.pickup_date.split(' - ')[0] || '-'
                                                            : '-'
                                                    }
                                                    </td> */}
                                                            <td className="text-secondary">
                                                                {item.offers_count ? item.offers_count : '0'}
                                                            </td>
                                                            {/* <td className="text-secondary">{item.pickup_date ? item.pickup_date.includes('Select End Date') ? item.pickup_date.split(' - ')[0] === 'null' ? '-' : item.pickup_date.split(' - ')[0] : item.pickup_date : '-'}</td> */}
                                                            <td className="text-secondary d-flex align-items-center justify-content-center">
                                                                <span className="p-2 fw-bold d-flex flex-column align-items-center justify-content-center w-75 user-offer-width" style={{
                                                                    backgroundColor: item.payment_status === 'panding' ? 'rgb(255, 191, 191)' : '#bcffba',
                                                                    color: item.payment_status === 'panding' ? 'rgb(252, 30, 30)' : '#10c200'
                                                                }}>
                                                                    {item.payment_status === 'panding' ? 'Unpaid' : 'Paid'}
                                                                </span>
                                                            </td>
                                                            <td className="text-secondary">
                                                                <button className="btn btn-sm btn-primary text-white py-2 px-3 user-order-btn text-primary me-1" onClick={() => navigate(`/dashboard/offers-user/${item.id}`)}>
                                                                    View Offers
                                                                </button>
                                                                <button className="btn btn-sm btn-light text-danger pt-0 pb-0" onClick={() => handle_show_groupage_delete(item)} style={{ fontSize: '1.5rem' }}>
                                                                    <MdDelete />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            ) : (
                                                <tbody>
                                                    <tr>
                                                        <td colSpan='7' className="text-secondary text-center">No Data Available</td>
                                                    </tr>
                                                </tbody>
                                            )}
                                        </table>
                                    </div>
                                </>}

                        </div>
                    </div>
                </div>
            </div>

            {selected_groupage && (
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
                                height: '90vh',
                                overflowY: 'auto'
                            }}
                        >
                            <div className="d-flex flex-column justify-content-start align-items-start w-100">
                                <button className="btn btn-danger position-absolute top-0 end-0 m-2" onClick={() => setSelected_groupage(null)}>
                                    ✕
                                </button>
                                <div className="d-flex justify-content-start align-items-center mt-2 ps-3 rounded-1" >
                                    <div className="d-flex w-100 justify-content-start">
                                        <label className="fs-3"><strong>Order Details</strong></label>
                                    </div>
                                </div>



                                <div className="d-flex flex-row justify-content-start align-items-center">
                                    <div className="m-2 w-25 border border-3 border-secondary rounded-1">
                                        <img src={selected_groupage.img01} alt="" style={{ width: '100%', height: '100%' }} />
                                    </div>
                                    <div className="ms-5 d-flex flex-column align-items-start justify-content-start text-start">
                                        <strong className="fs-4">{selected_groupage.box ? 'Boxes' : selected_groupage.product_name}</strong>
                                        <div className="d-flex flex-row align-items-start text-start">
                                            <span className="text-secondary">ID: #{selected_groupage.id}</span>
                                        </div>
                                    </div>
                                </div>

                                {selected_groupage.box ? <>
                                    <div className="offer-details-wrap">
                                        <h5 className="text-start w-100 mb-3 fs-6">Box Information</h5>

                                        <div className="row w-100 g-3">
                                            <div className="col-12 col-md-6">
                                                <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2">
                                                    <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                        style={{
                                                            width: '3rem',
                                                            height: '3rem',
                                                            backgroundColor: '#E1F5FF',
                                                            aspectRatio: '1 / 1'
                                                        }}>
                                                        <SiAnytype />
                                                    </div>
                                                    <div className="d-flex flex-column align-items-start gap-2">
                                                        <span className="text-secondary offer-submit-sub-head">Box dimensions</span>
                                                        <h6>{selected_groupage.box_dimension ? selected_groupage.box_dimension : 'null'}</h6>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-6">
                                                <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2">
                                                    <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                        style={{
                                                            width: '3rem',
                                                            height: '3rem',
                                                            backgroundColor: '#E1F5FF',
                                                            aspectRatio: '1 / 1'
                                                        }}>
                                                        <FaWeightScale />
                                                    </div>
                                                    <div className="d-flex flex-column align-items-start gap-2">
                                                        <span className="text-secondary offer-submit-sub-head">Number of Boxes</span>
                                                        <h6>{selected_groupage.box_number}</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row w-100 g-3 mt-3">
                                            <div className="col-12 col-md-12">
                                                <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2">
                                                    <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                        style={{
                                                            width: '3rem',
                                                            height: '3rem',
                                                            backgroundColor: '#E1F5FF',
                                                            aspectRatio: '1 / 1'
                                                        }}>
                                                        <FaRuler />
                                                    </div>
                                                    <div className="d-flex flex-column align-items-start gap-2">
                                                        <span className="text-secondary offer-submit-sub-head">Box Info</span>
                                                        <h6>{selected_groupage.box_info ? selected_groupage.box_info : 'null'}</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </> : <>
                                    <div className="offer-details-wrap">
                                        <h5 className="text-start w-100 mb-3 fs-6">Product Information</h5>

                                        <div className="row w-100 g-3">
                                            <div className="col-12 col-md-4">
                                                <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2">
                                                    <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                        style={{
                                                            width: '3rem',
                                                            height: '3rem',
                                                            backgroundColor: '#E1F5FF',
                                                            aspectRatio: '1 / 1'
                                                        }}>
                                                        <SiAnytype />
                                                    </div>
                                                    <div className="d-flex flex-column align-items-start gap-2">
                                                        <span className="text-secondary offer-submit-sub-head">Product Name</span>
                                                        <h6>{selected_groupage.product_name ? selected_groupage.product_name : '-'}</h6>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div className="col-12 col-md-4">
                                                <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2">
                                                    <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                        style={{
                                                            width: '3rem',
                                                            height: '3rem',
                                                            backgroundColor: '#E1F5FF',
                                                            aspectRatio: '1 / 1'
                                                        }}>
                                                        <SiAnytype />
                                                    </div>
                                                    <div className="d-flex flex-column align-items-start gap-2">
                                                        <span className="text-secondary offer-submit-sub-head">Product Type</span>
                                                        <h6>{selected_groupage.product_type ? selected_groupage.product_type : '-'}</h6>
                                                    </div>
                                                </div>
                                            </div> */}

                                            {/* <div className="col-12 col-md-4">
                                                <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2">
                                                    <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                        style={{
                                                            width: '3rem',
                                                            height: '3rem',
                                                            backgroundColor: '#E1F5FF',
                                                            aspectRatio: '1 / 1'
                                                        }}>
                                                        <FaWeightScale />
                                                    </div>
                                                    <div className="d-flex flex-column align-items-start gap-2">
                                                        <span className="text-secondary offer-submit-sub-head">Weight</span>
                                                        <h6>{selected_groupage.p_weight} Kg</h6>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4">
                                                <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2">
                                                    <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                        style={{
                                                            width: '3rem',
                                                            height: '3rem',
                                                            backgroundColor: '#E1F5FF',
                                                            aspectRatio: '1 / 1'
                                                        }}>
                                                        <RiExpandHeightFill />
                                                    </div>
                                                    <div className="d-flex flex-column align-items-start gap-2">
                                                        <span className="text-secondary offer-submit-sub-head">Height</span>
                                                        <h6>{selected_groupage.p_height} Cm</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row w-100 g-3 mt-3">
                                            <div className="col-12 col-md-4">
                                                <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2">
                                                    <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                        style={{
                                                            width: '3rem',
                                                            height: '3rem',
                                                            backgroundColor: '#E1F5FF',
                                                            aspectRatio: '1 / 1'
                                                        }}>
                                                        <FaRuler />
                                                    </div>
                                                    <div className="d-flex flex-column align-items-start gap-2">
                                                        <span className="text-secondary offer-submit-sub-head">Length</span>
                                                        <h6>{selected_groupage.p_length} Cm</h6>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4">
                                                <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2">
                                                    <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                        style={{
                                                            width: '3rem',
                                                            height: '3rem',
                                                            backgroundColor: '#E1F5FF',
                                                            aspectRatio: '1 / 1'
                                                        }}>
                                                        <RiExpandWidthFill />
                                                    </div>
                                                    <div className="d-flex flex-column align-items-start gap-2">
                                                        <span className="text-secondary offer-submit-sub-head">Width</span>
                                                        <h6>{selected_groupage.p_width} Cm</h6>
                                                    </div>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>
                                </>}


                                <div className="offer-details-wrap">
                                    <div className="d-flex flex-column align-items-start justify-content-start mt-4 w-100">
                                        <h5 className="text-start w-100 mb-3 fs-6">Pick Up Information</h5>
                                        <div className="row w-100 g-3 mt-2">
                                            <div className="col-md-4 col-12">
                                                <div className="d-flex align-items-start p-2 gap-2">
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
                                                        <span className="text-secondary offer-submit-sub-head">Full Name</span>
                                                        <h6>{selected_groupage.sender_name}</h6>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-4 col-12">
                                                <div className="d-flex align-items-start p-2 gap-2">
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
                                                        <span className="text-secondary offer-submit-sub-head">Contact Number</span>
                                                        <h6>{selected_groupage.sender_contact}</h6>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-4 col-12">
                                                <div className="d-flex align-items-start p-2 gap-2">
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
                                                        <span className="text-secondary offer-submit-sub-head text-start">Email Address</span>
                                                        <h6>{selected_groupage.sender_email}</h6>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-4 col-12">
                                                <div className="d-flex align-items-start p-2 gap-2">
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
                                                        <span className="text-secondary offer-submit-sub-head text-start">Country</span>
                                                        <h6>{selected_groupage.sender_country}</h6>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-4 col-12">
                                                <div className="d-flex align-items-start p-2 gap-2">
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
                                                        <span className="text-secondary offer-submit-sub-head text-start">State</span>
                                                        <h6>{selected_groupage.sender_state}</h6>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-4 col-12">
                                                <div className="d-flex align-items-start p-2 gap-2">
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
                                                        <span className="text-secondary offer-submit-sub-head text-start">City</span>
                                                        <h6>{selected_groupage.sender_city}</h6>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* <div className="col-md-4 col-12">
                                                <div className="d-flex align-items-start p-2 gap-2">
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
                                                        <span className="text-secondary offer-submit-sub-head text-start">Street Address</span>
                                                        <h6>{selected_groupage.sender_address ? selected_groupage.sender_address : '-'}</h6>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-4 col-12">
                                                <div className="d-flex align-items-start p-2 gap-2">
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
                                                        <span className="text-secondary offer-submit-sub-head text-start">Zip Code</span>
                                                        <h6>{selected_groupage.sender_zipcode ? selected_groupage.sender_zipcode : '-'}</h6>
                                                    </div>
                                                </div>
                                            </div> */}

                                            {/* <div className="col-md-4 col-12">
                                                <div className="d-flex align-items-start p-2 gap-2">
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
                                                        <span className="text-secondary offer-submit-sub-head text-start">Pick Up Date</span>
                                                        <h6>{
                                                               selected_groupage.pickup_date && selected_groupage.pickup_date !== 'null'
                                                            ? selected_groupage.pickup_date.includes('Select End Date')
                                                                ? selected_groupage.pickup_date.split(' - ')[0] || '-'
                                                                : selected_groupage.pickup_date.split(' - ')[0] || '-'
                                                            : '-'
                                                            // selected_groupage.pickup_date ? selected_groupage.pickup_date.includes('Select End Date') ? `${selected_groupage.pickup_date.split(' - ')[0]} -` : selected_groupage.pickup_date : 'null'
                                                        }</h6>
                                                    </div>
                                                </div>
                                            </div> */}

                                            {/* <div className="col-md-12">
                                                <div className="d-flex align-items-start p-2 gap-2">
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
                                                        <span className="text-secondary offer-submit-sub-head text-start">Pick Up Notes</span>
                                                        <p className="text-start"><h6>{selected_groupage.sender_description ? selected_groupage.sender_description : '-'}</h6></p>
                                                    </div>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>

                                <div className="offer-details-wrap">
                                    <div className="d-flex flex-column align-items-start justify-content-start mt-4 w-100">
                                        <h5 className="text-start w-100 mb-3 fs-6">Delivery Information</h5>

                                        <div className="row w-100 g-3 mt-2">
                                            <div className="col-md-4 col-12">
                                                <div className="d-flex align-items-start p-2 gap-2">
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
                                                        <span className="text-secondary offer-submit-sub-head text-start">Full Name</span>
                                                        <h6 className="text-start">{selected_groupage.receiver_name}</h6>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-4 col-12">
                                                <div className="d-flex align-items-start p-2 gap-2">
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
                                                        <span className="text-secondary offer-submit-sub-head text-start">Contact Number</span>
                                                        <h6>{selected_groupage.receiver_contact}</h6>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* <div className="col-md-4 col-12">
                                                <div className="d-flex align-items-start p-2 gap-2">
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
                                                        <span className="text-secondary offer-submit-sub-head text-start">Email Address</span>
                                                        <h6>{selected_groupage.receiver_email ? selected_groupage.receiver_email : '-'}</h6>
                                                    </div>
                                                </div>
                                            </div> */}

                                            <div className="col-md-4 col-12">
                                                <div className="d-flex align-items-start p-2 gap-2">
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
                                                        <span className="text-secondary offer-submit-sub-head text-start">Country</span>
                                                        <h6>{selected_groupage.receiver_country ? selected_groupage.receiver_country : '-'}</h6>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* <div className="col-md-4 col-12">
                                                <div className="d-flex align-items-start p-2 gap-2">
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
                                                        <span className="text-secondary offer-submit-sub-head text-start">State</span>
                                                        <h6>{selected_groupage.receiver_state ? selected_groupage.receiver_state : '-'}</h6>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-4 col-12">
                                                <div className="d-flex align-items-start p-2 gap-2">
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
                                                        <span className="text-secondary offer-submit-sub-head text-start">City</span>
                                                        <h6>{selected_groupage.receiver_city ? selected_groupage.receiver_city : '-'}</h6>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-4 col-12">
                                                <div className="d-flex align-items-start p-2 gap-2">
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
                                                        <span className="text-secondary offer-submit-sub-head text-start">Street Address</span>
                                                        <h6 className="text-start">{selected_groupage.receiver_address ? selected_groupage.receiver_address : "-"}</h6>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-4 col-12">
                                                <div className="d-flex align-items-start p-2 gap-2">
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
                                                        <span className="text-secondary offer-submit-sub-head text-start">Zip Code</span>
                                                        <h6 className="text-start">{selected_groupage.receiver_zipcode ? selected_groupage.receiver_zipcode : '-'}</h6>
                                                    </div>
                                                </div>
                                            </div> */}

                                            {/* <div className="col-md-4 col-12">
                                                <div className="d-flex align-items-start p-2 gap-2">
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
                                                        <span className="text-secondary offer-submit-sub-head text-start">Preferred Delivery Date</span>
                                                        <h6 className="text-start">{selected_groupage.departure_date ? selected_groupage.departure_date : '-'}</h6>
                                                    </div>
                                                </div>
                                            </div> */}

                                            {/* <div className="col-md-12">
                                                <div className="d-flex align-items-start p-2 gap-2">
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
                                                        <span className="text-secondary offer-submit-sub-head text-start">Delivery Notes</span>
                                                        <p className="text-start"><h6>{selected_groupage.receiver_description ? selected_groupage.receiver_description : '-'}</h6></p>
                                                    </div>
                                                </div>
                                            </div> */}
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

export default Orders;