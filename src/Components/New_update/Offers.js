import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { FaLocationDot, FaWeightScale, FaMapLocationDot, FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { FaTruckLoading, FaTruckMoving, FaStar, FaFilter, FaUserEdit } from "react-icons/fa";
import { HiBadgeCheck } from "react-icons/hi";
import Countries_selector from "../Dashboard/Countries_selector";
import { Rating } from 'react-simple-star-rating';
import axios from "axios";
import { BsFillSendFill } from "react-icons/bs";
import { SiAnytype } from "react-icons/si";
import { RiExpandHeightFill, RiExpandWidthFill } from "react-icons/ri";
import { FaRuler } from "react-icons/fa";

const Offers = () => {
    const port = process.env.REACT_APP_SECRET;
    const token = localStorage.getItem('token');
    const [groupage, setGroupage] = useState([]);
    useEffect(() => {
        axios.get(`${port}/send_groupage/show_grouage`, {
            headers: {
                Authorization: token,
            },
        }).then((response) => {
            const updatedData = response.data.message.map(item => ({
                ...item,
                days_ago: getDaysAgo(item.created_at)
            }));
            setGroupage(updatedData);
        }).catch((err) => {
            console.log(err);
        });
    }, []);
    const getDaysAgo = (createdAt) => {
        const createdDate = new Date(createdAt);
        const currentDate = new Date();
        const timeDiff = currentDate - createdDate;
        const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        return daysAgo === 0 ? "Today" : `${daysAgo} days ago`;
    };
    const [selectedPickupCountry, setSelectedPickupCountry] = useState('');
    const [selectedDestinationCountry, setSelectedDestinationCountry] = useState('');
    const [bidAmount, setBidAmount] = useState('');
    const [expetedDate, setExpetedDate] = useState('');
    const handlePickupCountrySelect = (country) => {
        setSelectedPickupCountry(country);
    };

    const handleDestinationCountrySelect = (country) => {
        setSelectedDestinationCountry(country);
    };

    const filterData = (data) => {
        return data.filter((groupage) => {
            const pickupCountryMatch =
                !selectedPickupCountry || groupage.sender_country === selectedPickupCountry;

            const destinationCountryMatch =
                !selectedDestinationCountry || groupage.receiver_country === selectedDestinationCountry;

            return pickupCountryMatch && destinationCountryMatch;
        });
    };

    const filteredData = filterData(groupage);

    // console.log(filteredData)
    const [groupage_detail, setGroupage_detail] = useState(null);
    const View_details = (item) => {
        setGroupage_detail(item);
    }

    const handleSubmit_offer = (details) => {
        if (bidAmount === '' || expetedDate === '') {
            alert('Please fill all the fields');
            return;
        }
        const data = {
            offer_id: details.id,
            offer_amount: bidAmount,
            expected_date: expetedDate
        }
        axios.post(`${port}/send_groupage/create_offer`, data, {
            headers: {
                Authorization: token,
            },
        }).then((response) => {
            console.log(response.data);
            alert(response.data.message);
            setGroupage_detail(null);
        }).catch((err) => {
            console.log(err);
        });
    }
    return (
        <div className="d-flex flex-column align-items-center justify-content-center">

            <div className='navbar-wrapper'>
                <div className=" d-flex justify-content-center w-100">
                    <Navbar />
                </div>
            </div>
            <div className="d-flex flex-column justify-content-center align-items-center text-light px-3" style={{
                width: "100%",
                minHeight: "40vh", // Adjusts dynamically
                borderRadius: "0% 0% 2% 2% / 28% 28% 20% 20%",
                backgroundColor: "#0044BC",
                position: "relative", // Changed from fixed
                zIndex: -1, // Ensures visibility
            }}>
                <div className="text-center mt-3 w-100">
                    <strong className="fs-3 d-block mb-2">Ship Your Goods Worldwide with Reliable and Trusted Logistics Partners</strong>
                    <p className="w-50 mx-auto">
                        Connect with reliable logistics providers to transport goods across borders seamlessly. Our platform ensures efficient and hassle-free global shipping tailored to your needs.
                    </p>
                </div>
            </div>
            <section className="search-result-wrapper">
                <div className="container">

                </div>
            </section>
            <div className="d-flex flex-column flex-md-row justify-content-center align-items-start mt-4 mt-md-5 w-100">
                <div className="d-flex flex-column align-items-start p-3 ps-5 pb-5 col-12 col-md-3">
                    <strong className="fs-3"><span style={{ color: 'tomato' }}><FaFilter /> </span>Filters by :</strong>
                    <div className="d-flex flex-column align-items-start w-100 mt-5 border-bottom border-2 pb-3">
                        <h5>PICK UP COUNTRY</h5>
                        <span className="w-100 w-md-75">
                            <Countries_selector onSelectCountry={handlePickupCountrySelect} />
                        </span>
                    </div>
                    <div className="d-flex flex-column align-items-start w-100 mt-5 border-bottom border-2 pb-3">
                        <h5>DESTINATION COUNTRY</h5>
                        <span className="w-100 w-md-75">
                            <Countries_selector onSelectCountry={handleDestinationCountrySelect} />
                        </span>
                    </div>

                </div>
                <div className="d-flex flex-column align-items-start justify-content-start p-3 ps-4 col-12 col-md-9 border-start border-3" >
                    <strong className="fs-3">Search Results </strong>
                    {groupage ? (
                        <>
                            {filteredData.length > 0 ? (
                                <>
                                    {filteredData.map((item, index) => (
                                        <div className="d-flex flex-column align-items-start justify-content-start w-100 mt-5 pt-3 ps-5 pe-5 " key={index}>
                                            <div className="rounded-circle overflow-hidden" style={{ width: '80px', maxWidth: '110px', aspectRatio: '1/1' }}>
                                                <img
                                                    src={item.img01 ? item.img01 : "https://png.pngtree.com/png-clipart/20230915/original/pngtree-global-icon-for-web-design-logo-app-isolated-vector-vector-png-image_12189325.png"}
                                                    alt="Profile"
                                                    className="w-100 h-100 object-fit-cover"
                                                />
                                            </div>
                                            <div className="d-flex justify-content-between w-100">
                                                <span><strong className="fs-3">{item.product_name}</strong></span>
                                                <h5 className="" style={{ cursor: 'default', color: 'tomato' }} onClick={() => View_details(item)}><u>Submit Offer</u></h5>
                                            </div>
                                            <p className="mt-2">GER <span className="text-primary"><BsFillSendFill /></span> IND</p>
                                            <p className="mt-2 text-start text-secondary">{item.sender_description ? item.sender_description.split(" ").slice(0, 30).join(" ") + "..." : item.sender_description}</p>
                                            <div className="d-flex flex-column flex-md-row gap-4">
                                                <div className="p-3 border-end border-3">
                                                    <FaLocationDot className='fs-4' style={{ color: 'tomato' }} /> <span className="text-secondary">Weight: {item.p_weight}</span>
                                                </div>
                                                <div className="p-3 border-end border-3">
                                                    <FaTruckLoading className='fs-4' style={{ color: 'tomato' }} /> <span className="text-secondary">Pick up: {item.pickup_date.includes('Select End Date') ? item.pickup_date.split(' - ')[0] : item.pickup_date}</span>
                                                </div>
                                                <div className="p-3">
                                                    <FaTruckMoving className='fs-4' style={{ color: 'tomato' }} /> <span className="text-secondary">Posted {item.days_ago} </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <strong className="fs-4 w-100 mt-5">No Data</strong>
                            )}
                        </>
                    ) : (
                        <strong className="fs-4 w-100 mt-5">No Data</strong>
                    )}



                    {groupage_detail && (
                        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                            style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                zIndex: 9999
                            }}
                        >
                            <div className="bg-light rounded shadow p-4 position-relative border border-2 border-dark"
                                style={{
                                    width: '90%',
                                    maxWidth: '900px',
                                    height: '90vh',
                                    overflowY: 'auto'
                                }}
                            >
                                <div className="d-flex flex-column justify-content-start">
                                    <button className="btn btn-danger position-absolute top-0 end-0 m-2" onClick={() => setGroupage_detail(null)}>
                                        ✕
                                    </button>

                                    <div className="title-head text-start">
                                        <h3>Submitting an Offer</h3>
                                    </div>
                                    <span className="mt-2 text-start w-100">Offer ID: <span className="text-primary"> #{groupage_detail.id}</span></span>

                                    <div className="offer-details-wrap">
                                        <h5 className="text-start w-100 mb-3 fs-6">Product Details</h5>

                                        <div className="d-flex flex-wrap gap-3 w-100">
                                            <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '100%', maxWidth: '30%' }}>
                                                <div
                                                    className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                    style={{
                                                        width: '3rem',
                                                        height: '3rem',
                                                        backgroundColor: '#E1F5FF',
                                                        aspectRatio: '1 / 1'
                                                    }}
                                                >
                                                    <SiAnytype />
                                                </div>
                                                <div className="d-flex flex-column align-items-start gap-2">
                                                    <span className="text-secondary offer-submit-sub-head">Product Type</span>
                                                    <h6>{groupage_detail.product_type}</h6>
                                                </div>
                                            </div>

                                            <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '100%', maxWidth: '30%' }}>
                                                <div
                                                    className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                    style={{
                                                        width: '3rem',
                                                        height: '3rem',
                                                        backgroundColor: '#E1F5FF',
                                                        aspectRatio: '1 / 1'
                                                    }}
                                                ><FaWeightScale /></div>
                                                <div className="d-flex flex-column align-items-start gap-2">
                                                    <span className="text-secondary offer-submit-sub-head">Weight</span>
                                                    <h6>{groupage_detail.p_weight} Kg</h6>
                                                </div>
                                            </div>

                                            <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '100%', maxWidth: '30%' }}>
                                                <div
                                                    className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                    style={{
                                                        width: '3rem',
                                                        height: '3rem',
                                                        backgroundColor: '#E1F5FF',
                                                        aspectRatio: '1 / 1'
                                                    }}
                                                ><RiExpandHeightFill /></div>
                                                <div className="d-flex flex-column align-items-start gap-2">
                                                    <span className="text-secondary offer-submit-sub-head">Height</span>
                                                    <h6>{groupage_detail.p_height} Cm</h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex flex-wrap gap-3 mt-3 w-100">
                                            <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '100%', maxWidth: '30%' }}>
                                                <div
                                                    className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                    style={{
                                                        width: '3rem',
                                                        height: '3rem',
                                                        backgroundColor: '#E1F5FF',
                                                        aspectRatio: '1 / 1'
                                                    }}
                                                ><FaRuler /></div>
                                                <div className="d-flex flex-column align-items-start gap-2">
                                                    <span className="text-secondary offer-submit-sub-head">Length</span>
                                                    <h6>{groupage_detail.p_length} Cm</h6>
                                                </div>
                                            </div>

                                            <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '100%', maxWidth: '30%' }}>
                                                <div
                                                    className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                    style={{
                                                        width: '3rem',
                                                        height: '3rem',
                                                        backgroundColor: '#E1F5FF',
                                                        aspectRatio: '1 / 1'
                                                    }}
                                                ><RiExpandWidthFill /></div>
                                                <div className="d-flex flex-column align-items-start gap-2">
                                                    <span className="text-secondary offer-submit-sub-head">Width</span>
                                                    <h6>{groupage_detail.p_width} Cm</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="offer-details-wrap">
                                        <h5 className="text-start w-100 mb-3 fs-6">Pick Up Information</h5>

                                        <div className="d-flex flex-wrap gap-3 w-100">
                                            <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '100%', maxWidth: '30%' }}>
                                                <div
                                                    className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                    style={{
                                                        width: '3rem',
                                                        height: '3rem',
                                                        backgroundColor: '#E1F5FF',
                                                        aspectRatio: '1 / 1'
                                                    }}
                                                ><SiAnytype /></div>
                                                <div className="d-flex flex-column align-items-start gap-2">
                                                    <span className="text-secondary offer-submit-sub-head">Country</span>
                                                    <h6>{groupage_detail.sender_country}</h6>
                                                </div>
                                            </div>

                                            <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '100%', maxWidth: '30%' }}>
                                                <div
                                                    className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                    style={{
                                                        width: '3rem',
                                                        height: '3rem',
                                                        backgroundColor: '#E1F5FF',
                                                        aspectRatio: '1 / 1'
                                                    }}
                                                ><FaWeightScale /></div>
                                                <div className="d-flex flex-column align-items-start gap-2">
                                                    <span className="text-secondary offer-submit-sub-head">State</span>
                                                    <h6>{groupage_detail.sender_state}</h6>
                                                </div>
                                            </div>

                                            <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '100%', maxWidth: '30%' }}>
                                                <div
                                                    className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                    style={{
                                                        width: '3rem',
                                                        height: '3rem',
                                                        backgroundColor: '#E1F5FF',
                                                        aspectRatio: '1 / 1'
                                                    }}
                                                ><RiExpandHeightFill /></div>
                                                <div className="d-flex flex-column align-items-start gap-2">
                                                    <span className="text-secondary offer-submit-sub-head">City</span>
                                                    <h6>{groupage_detail.sender_city}</h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex flex-wrap gap-3 mt-3 w-100">
                                            <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '100%', maxWidth: '30%' }}>
                                                <div
                                                    className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                    style={{
                                                        width: '3rem',
                                                        height: '3rem',
                                                        backgroundColor: '#E1F5FF',
                                                        aspectRatio: '1 / 1'
                                                    }}
                                                ><FaRuler /></div>
                                                <div className="d-flex flex-column align-items-start gap-2">
                                                    <span className="text-secondary offer-submit-sub-head">Zip Code</span>
                                                    <h6>{groupage_detail.sender_zipcode}</h6>
                                                </div>
                                            </div>

                                            <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '100%', maxWidth: '30%' }}>
                                                <div
                                                    className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                    style={{
                                                        width: '3rem',
                                                        height: '3rem',
                                                        backgroundColor: '#E1F5FF',
                                                        aspectRatio: '1 / 1'
                                                    }}
                                                ><RiExpandWidthFill /></div>
                                                <div className="d-flex flex-column align-items-start gap-2">
                                                    <span className="text-secondary offer-submit-sub-head">Pick Up Date</span>
                                                    <h6 className="text-start">{groupage_detail.pickup_date.includes('Select End Date') ? groupage_detail.pickup_date.split('-')[0] : groupage_detail.pickup_date}</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="offer-details-wrap">

                                        <h5 className="text-start w-100 mb-3 fs-6">Delivery Information</h5>

                                        <div className="d-flex flex-wrap gap-3 w-100">
                                            <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '100%', maxWidth: '30%' }}>
                                                <div
                                                    className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                    style={{
                                                        width: '3rem',
                                                        height: '3rem',
                                                        backgroundColor: '#E1F5FF',
                                                        aspectRatio: '1 / 1'
                                                    }}
                                                ><SiAnytype /></div>
                                                <div className="d-flex flex-column align-items-start gap-2">
                                                    <span className="text-secondary offer-submit-sub-head">Receiver’s Name</span>
                                                    <h6>XXXX</h6>
                                                </div>
                                            </div>

                                            <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '100%', maxWidth: '30%' }}>
                                                <div
                                                    className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                    style={{
                                                        width: '3rem',
                                                        height: '3rem',
                                                        backgroundColor: '#E1F5FF',
                                                        aspectRatio: '1 / 1'
                                                    }}
                                                ><FaWeightScale /></div>
                                                <div className="d-flex flex-column align-items-start gap-2">
                                                    <span className="text-secondary offer-submit-sub-head">Contact Number </span>
                                                    <h6>{groupage_detail.receiver_contact}</h6>
                                                </div>
                                            </div>

                                            <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '100%', maxWidth: '30%' }}>
                                                <div
                                                    className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                    style={{
                                                        width: '3rem',
                                                        height: '3rem',
                                                        backgroundColor: '#E1F5FF',
                                                        aspectRatio: '1 / 1'
                                                    }}
                                                ><RiExpandHeightFill /></div>
                                                <div className="d-flex flex-column align-items-start gap-2">
                                                    <span className="text-secondary offer-submit-sub-head">Email ID</span>
                                                    <h6>XXXX@gmail.com</h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex flex-wrap gap-3 mt-3 w-100">
                                            <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '100%', maxWidth: '30%' }}>
                                                <div
                                                    className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                    style={{
                                                        width: '3rem',
                                                        height: '3rem',
                                                        backgroundColor: '#E1F5FF',
                                                        aspectRatio: '1 / 1'
                                                    }}
                                                ><FaRuler /></div>
                                                <div className="d-flex flex-column align-items-start gap-2">
                                                    <span className="text-secondary offer-submit-sub-head">Country</span>
                                                    <h6>{groupage_detail.receiver_country}</h6>
                                                </div>
                                            </div>

                                            <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '100%', maxWidth: '30%' }}>
                                                <div
                                                    className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                    style={{
                                                        width: '3rem',
                                                        height: '3rem',
                                                        backgroundColor: '#E1F5FF',
                                                        aspectRatio: '1 / 1'
                                                    }}
                                                ><RiExpandWidthFill /></div>
                                                <div className="d-flex flex-column align-items-start gap-2">
                                                    <span className="text-secondary offer-submit-sub-head">State</span>
                                                    <h6>{groupage_detail.receiver_state}</h6>
                                                </div>
                                            </div>

                                            <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '100%', maxWidth: '30%' }}>
                                                <div
                                                    className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                    style={{
                                                        width: '3rem',
                                                        height: '3rem',
                                                        backgroundColor: '#E1F5FF',
                                                        aspectRatio: '1 / 1'
                                                    }}
                                                ><RiExpandWidthFill /></div>
                                                <div className="d-flex flex-column align-items-start gap-2">
                                                    <span className="text-secondary offer-submit-sub-head">City</span>
                                                    <h6>{groupage_detail.receiver_city}</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="offer-details-wrap">
                                        <h5 className="text-start w-100 mb-3 fs-6">Customer Information</h5>

                                        <div className="d-flex flex-wrap gap-3 w-100">
                                            <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '100%', maxWidth: '30%' }}>
                                                <div
                                                    className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                    style={{
                                                        width: '3rem',
                                                        height: '3rem',
                                                        backgroundColor: '#E1F5FF',
                                                        aspectRatio: '1 / 1'
                                                    }}
                                                ><SiAnytype /></div>
                                                <div className="d-flex flex-column align-items-start gap-2">
                                                    <span className="text-secondary offer-submit-sub-head">Customer Name</span>
                                                    <h6>XXXX</h6>
                                                </div>
                                            </div>

                                            <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '100%', maxWidth: '30%' }}>
                                                <div
                                                    className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                    style={{
                                                        width: '3rem',
                                                        height: '3rem',
                                                        backgroundColor: '#E1F5FF',
                                                        aspectRatio: '1 / 1'
                                                    }}
                                                ><FaWeightScale /></div>
                                                <div className="d-flex flex-column align-items-start gap-2">
                                                    <span className="text-secondary offer-submit-sub-head">Contact Number </span>
                                                    <h6>{groupage_detail.sender_contact}</h6>
                                                </div>
                                            </div>

                                            <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '100%', maxWidth: '30%' }}>
                                                <div
                                                    className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                    style={{
                                                        width: '3rem',
                                                        height: '3rem',
                                                        backgroundColor: '#E1F5FF',
                                                        aspectRatio: '1 / 1'
                                                    }}
                                                ><RiExpandHeightFill /></div>
                                                <div className="d-flex flex-column align-items-start gap-2">
                                                    <span className="text-secondary offer-submit-sub-head">Email ID</span>
                                                    <h6>XXXX</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="offer-details-wrap">
                                        <div className="d-flex flex-column align-items-start justify-content-start w-100 p-3">
                                            <div className="title-head">
                                                <h3 >Bidding Information</h3>
                                            </div>
                                            <span className="mt-1">What is the full amount you want to bid for this order?</span>
                                            <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between w-100 gap-3 mt-4 border-bottom border-2 pb-2">
                                                <div className="d-flex flex-column align-items-start justify-content-start gap-2 w-100 w-sm-50">
                                                    <span className="fs-5">Bid Amount</span>
                                                    <span className="text-secondary text-start">Total amount the client will see on your proposal</span>
                                                </div>
                                                <input type="text" className="form-control w-100 w-sm-50 fs-5" onChange={(e) => { const value = e.target.value.replace(/[^0-9.]/g, ""); setBidAmount(value); }} value={`$ ${bidAmount}`} />
                                            </div>
                                            <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between w-100 gap-3 mt-4">
                                                <div className="d-flex flex-column align-items-start justify-content-start gap-2 w-100 w-sm-50">
                                                    <span className="text-secondary text-start">How long will this product take to deliver?</span>
                                                </div>
                                                <input type="date" className="form-control w-100 w-sm-50 fs-5" min={new Date().toISOString().split("T")[0]} onChange={(e) => setExpetedDate(e.target.value)} value={expetedDate} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex w-100 justify-content-end">
                                        <button className="btn-main-offer"  onClick={() => handleSubmit_offer(groupage_detail)}>Submit Offer</button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                </div>
            </div>
            <div className="d-flex flex-column align-items-center mt-4 mt-md-5 text-white p-3 p-md-5 w-100" style={{ backgroundColor: "#0044BC" }}>
                <strong className="fs-3 fs-md-4 text-center">Unable to Find Your Preferred Shipping Companies?</strong>
                <p className="w-100 w-md-50 p-2 p-md-4 text-center">Reach out to us for tailored shipping solutions that meet<br /> your needs</p>
                <button className="btn text-white" style={{ backgroundColor: "tomato" }}>Ship Your Goods with Us</button>
            </div>

            <div className="w-100 mt-5">
                <Footer />
            </div>
        </div>
    );
}
export default Offers;