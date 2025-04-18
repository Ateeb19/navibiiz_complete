import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { Form } from "react-bootstrap";
import Navbar from "../Navbar/Navbar";
import { BiSolidDetail } from "react-icons/bi";
import { IoLocationSharp } from "react-icons/io5";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaTruckFast } from "react-icons/fa6";
import { MdDeliveryDining } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import Footer from "../Footer/Footer";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../assets/css/style.css'
import Countryselector from '../Dashboard/Countries_selector';
import Accordion from 'react-bootstrap/Accordion';
import { SiAnytype } from "react-icons/si";
import { FaWeightScale } from "react-icons/fa6";
import { RiExpandHeightFill, RiExpandWidthFill } from "react-icons/ri";
import { FaRuler } from "react-icons/fa";
import { useAlert } from "../alert/Alert_message";
import { IoSearch } from "react-icons/io5";


const Home = () => {
    const port = process.env.REACT_APP_SECRET;
    // console.log(port);
    const { showAlert } = useAlert();
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const [offers_details, setOffers_details] = useState([]);
    // const [mode, setMode] = useState(false);
    const displayCompany = () => {
        // localStorage.setItem('companyInfo');
        axios.get(`${port}/company/display_company`)
            .then((response) => {
                if (response.data.status) {
                    localStorage.setItem('companyInfo', JSON.stringify(response.data.message));
                } else {
                    localStorage.setItem('companyInfo', '');
                }
            }).catch((err) => { console.log('error', err); localStorage.setItem('companyInfo', '') });
    }
    const offers = () => {
        axios.get(`${port}/send_groupage/show_only_grouage`)
            .then((response) => {
                if (response.data.status === true) {
                    setOffers_details(response.data.message);
                } else {
                    setOffers_details([]);
                }
            }).catch((err) => { console.log(err) });
    }
    useEffect(() => {
        displayCompany();
        offers();
    }, []);

    const [company_info, setCompany_info] = useState([]);
    const companies = () => {
        if (localStorage.getItem('companyInfo').length > 0) {
            setCompany_info(JSON.parse(localStorage.getItem('companyInfo')));
        }
    }
    useEffect(() => {
        companies();
    }, [])

    const [last_companies, setLast_companies] = useState([]);

    const last_companies_fetch = () => {
        if (company_info.length > 0) {
            setLast_companies(company_info.slice(-4)); 
        } else {
            setLast_companies([]);
        }
    };

    useEffect(() => {
        last_companies_fetch();
    }, [company_info]); 
    
    const navigate = useNavigate();

    const settings = {
        dots: true,
        infinite: true,
        speed: 100,
        slidesToShow: 3,
        slidesToScroll: 1,
        appendDots: dots => (
            <ul style={{ margin: '0px', padding: '10px' }}> {dots} </ul>
        ),
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 700,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };
    const [pickupCountry, setPickupCountry] = useState('');
    const [destinationCountry, setDestinationCountry] = useState('');
    const [filter_selectedService, setFilter_selectedService] = useState('');
    const handleSearch = () => {
        navigate('/companies_list', {
            state: {
                pickupCountry,
                destinationCountry,
                selectedService: filter_selectedService,
            },
        });
    };

    const View_details = (item) => {
        localStorage.setItem(`company_${item.id}`, JSON.stringify(item));
        navigate(`/company_details/${item.id}`, { state: { company: item } });
    };

    const [groupage_detail, setGroupage_detail] = useState(null);
    const submit_offer = (item) => {
        setGroupage_detail(item);
    }
    const profiles = [
        {
            name: 'John Doe',
            description: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-',
            img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsb_V_Ha4XAl47doWf_2lF-actuld60ssYew&s'
        },
        {
            name: 'Jane Smith',
            description: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-',
            img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw0PDKrErulLlbJkbv5KtsCeICczdgJSyurA&s'
        },
        {
            name: 'Mike Johnson',
            description: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-',
            img: 'https://i2.pickpik.com/photos/711/14/431/smile-profile-face-male-preview.jpg'
        },
        {
            name: 'Sarah Brown',
            description: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-',
            img: 'https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg.jpg'
        }
    ];
    // console.log(offers_details, 'this is offers');

    const [bidAmount, setBidAmount] = useState('');
    const [expetedDate, setExpetedDate] = useState('');

    const handleSubmit_offer = (details) => {
        if (bidAmount === '' || expetedDate === '') {
            showAlert('Please fill all the fields');
            return;
        }

        const data = {
            offer_id: details.id,
            offer_amount: bidAmount,
            expected_date: expetedDate
        };

        axios.post(`${port}/send_groupage/create_offer`, data, {
            headers: {
                Authorization: token,
            },
        }).then((response) => {
            if (response.data.status === false) {
                showAlert('Login with a company account to submit an offer');
                navigate('/login');
            } else {
                console.log(response.data);
                showAlert(response.data.message);
                setGroupage_detail(null);
                setBidAmount('');
                setExpetedDate('');
            }
        }).catch((err) => {
            showAlert('Login to submit offer');
            navigate('/login');

            console.log(err);
        });
    };

    return (
        <div className="d-flex flex-column align-items-center justify-content-center">
            {/* {showAlert && <Alert message={alert_message} onClose={() => setShowAlert(false)} />} */}
            <div className='navbar-wrapper'>
                <div className=" d-flex justify-content-center w-100">
                    <Navbar />
                </div>
            </div>

            <section className="hero-wrapper">
                <div className="container">
                    <div className="d-flex flex-column justify-content-center align-items-center text-light px-3">
                        <div className="text-center mt-3 w-100">
                            <div className="hero-wrap-head">
                                <h1>Ship Your Goods Worldwide with Reliable and Trusted Logistics Partners</h1>
                                <p>
                                    Connect with reliable logistics providers to transport goods across borders seamlessly. Our platform ensures efficient and hassle-free global shipping tailored to your needs.
                                </p>
                            </div>
                        </div>

                        <div className="d-flex flex-row justify-content-center align-items-center px-3 pickup-wrap gap-4">
                            <span><Countryselector label='Pick Up Country' borderradiuscount='5px' bgcolor='#ffffff' bordercolor='1px solid #ffffff' margincount='0 0 0 0' paddingcount="12px 10px" onSelectCountry={(country) => setPickupCountry(country)} /></span>

                            <button className="" onClick={handleSearch}><IoSearch /> Search Companies</button>
                        </div>
                    </div>
                </div>
            </section>
            {/* <section className="search-wrapper">
                <div className="container">
                    <div className="row bg-white rounded-3 p-3 shadow border">
                        <div className="col-12 col-md-9 border-end border-1 p-3 text-center text-md-start">
                            <h5>Pick Up</h5>
                            <span><Countryselector bgcolor='#ffffff' bordercolor='1px solid #ffffff' margincount='15px 0 0 0' paddingcount="0px 6px" onSelectCountry={(country) => setPickupCountry(country)} /></span>
                        </div>
                        <div className="col-12 col-md-3 border-end border-1 p-3 text-center text-md-start">
                            <h5>Delivery</h5>
                            <span><Countryselector bgcolor='#ffffff' bordercolor='1px solid #ffffff' margincount='15px 0 0 0' paddingcount="0px 6px" onSelectCountry={(country) => setDestinationCountry(country)} /></span>
                        </div>
                        <div className="col-12 col-md-3 p-3 text-center text-md-start">
                            <h5>Service</h5>
                            <span>
                                <Form.Select
                                    value={filter_selectedService}
                                    onChange={(e) => setFilter_selectedService(e.target.value)}
                                    style={{ backgroundColor: '#ffffff', border: '1px solid #ffffff', padding: '0 6px', marginTop: '15px' }}
                                >
                                    <option value="">Select the service</option>
                                    <option value="container">Container</option>
                                    <option value="car">Car</option>
                                </Form.Select>
                            </span>
                        </div>
                        <div className="col-12 col-md-3 p-3 text-center">
                            <button className="btn btn-light border border-danger text-danger w-100" onClick={handleSearch}>
                                Search Shipping Companies
                            </button>
                        </div>
                    </div>
                </div>
            </section> */}

            <div className="container mt-4">
                <div className="row g-4 text-center">
                    <div className="col-12 col-sm-6 col-md-3">
                        <div className="d-flex flex-column align-items-center">
                            <div className="features-head">
                                <span style={{ fontSize: '3rem', color: '#de8316' }}><BiSolidDetail /></span>
                                <h5>Easy Shipment Details</h5>
                                <p >Simply provide your shipment details to get a tailored list of logistics companies</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-3">
                        <div className="d-flex flex-column align-items-center">
                            <div className="features-head">
                                <span style={{ fontSize: '3rem', color: '#de8316' }}><IoLocationSharp /></span>
                                <h5>Location-based Filtering</h5>
                                <p>Filter shipping companies by your destination and origin for precise results</p>
                            </div>

                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-3">
                        <div className="d-flex flex-column align-items-center">
                            <div className="features-head">
                                <span style={{ fontSize: '3rem', color: '#de8316' }}><FaTruckFast /></span>
                                <h5>Shipping Methods</h5>
                                <p>Choose your preferred shipping method and connect with the right partners</p>
                            </div>

                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-3">
                        <div className="d-flex flex-column align-items-center">
                            <div className="features-head">
                                <span style={{ fontSize: '3rem', color: '#de8316' }}><MdDeliveryDining /></span>
                                <h5>Pickup Service</h5>
                                <p >Shipping companies will send their professionals to pick up your goods from your location</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <section className="new-add-company-wrapper">
                <div className="container">
                    <div className="d-flex flex-column justify-content-start align-items-start">
                        <div className="title-head">
                            <h3>Newly Added Companies</h3>
                        </div>

                        <div className="row justify-content-center w-100">
                            {company_info.length > 0 ? (
                                <>
                                    {last_companies.map((company, index) => (
                                        <div key={index} className="col-12 col-sm-6 col-md-4 col-xl-3" onClick={() => View_details(company)}>
                                            <div className="company-box-wrap">
                                                <div className="d-flex flex-column align-items-start">
                                                    <div className="rounded-circle overflow-hidden" style={{ width: '30%', maxWidth: '130px', aspectRatio: '1/1' }}>
                                                        <img
                                                            src={company.logo ? company.logo : "https://png.pngtree.com/png-clipart/20230915/original/pngtree-global-icon-for-web-design-logo-app-isolated-vector-vector-png-image_12189325.png"}
                                                            alt="Logo"
                                                            className="w-100 h-100 object-fit-cover"
                                                        />
                                                    </div>
                                                    <h5>{company.company_name}</h5>
                                                    <span className="text-secondary"><FaStar className="pe-1 text-warning fs-5 mb-1" /> 4.5 (20 Ratings)</span>
                                                    <p className="text-secondary text-start mt-2">{company.description.split(" ").slice(0, 10).join(" ") + "..."}</p>
                                                    <span className="" style={{ cursor: "pointer", color: '#de8316' }} onClick={() => View_details(company)}>View Details</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <>
                                    <div className="col-12 col-sm-6 col-md-4 col-xl-3" >
                                        <div className="company-box-wrap">
                                            <div className="d-flex flex-column align-items-start">
                                                <div className="rounded-circle overflow-hidden" style={{ width: '30%', maxWidth: '130px', aspectRatio: '1/1' }}>
                                                    <img
                                                        src={"https://png.pngtree.com/png-clipart/20230915/original/pngtree-global-icon-for-web-design-logo-app-isolated-vector-vector-png-image_12189325.png"}
                                                        alt="Logo"
                                                        className="w-100 h-100 object-fit-cover"
                                                    />
                                                </div>
                                                <h5> No Data Fetch</h5>
                                                <span className="text-secondary"><FaStar className="pe-1 text-warning fs-5 mb-1" /> 4.5 (20 Ratings)</span>
                                                <p className="text-secondary text-start mt-2"></p>
                                                <span className="" style={{ cursor: "pointer", color: '#de8316' }} >View Details</span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                        </div>
                        <button className="btn-main" onClick={() => navigate('/companies_list')}>
                            View All
                        </button>
                    </div>
                </div>
            </section>



            <section className="step-wrapper">
                <div className="container mt-5">
                    <div className="text-center mb-4">
                        <div className="title-head">
                            <h3>How It Works: Simple & Secure Shipping in Four Easy Steps</h3>
                        </div>
                    </div>

                    <div className="row w-75 mx-auto align-items-center mb-4 mt-5">
                        <div className="col-12 col-md-6 order-2 order-md-2 text-start">
                            <div className="step-text-wrapper">
                                <h4>1</h4>
                                <h5>Provide Your Shipment Details</h5>
                                <p>Fill out a simple form with your shipment details, including type of goods, origin, and destination.</p>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 order-1 order-md-1 ">
                            <div className="step-image-wrapper">
                                <img src="/Images/image.png" alt="Step 1" />
                            </div>
                        </div>
                    </div>

                    <div className="row w-75 mx-auto align-items-center mb-4">
                        <div className="col-12 col-md-6 order-1 order-md-1 text-start">
                            <div className="step-text-wrapper">

                                <h4 style={{ color: 'tomato' }}>2</h4>
                                <h5>Receive Offers from Multiple Companies</h5>
                                <p className="text-secondary">Get competitive quotes from trusted shipping providers tailored to your needs.</p>

                            </div>
                        </div>
                        <div className="col-12 col-md-6 order-2 order-md-2 ">
                            <div className="step-image-wrapper">
                                <img src="/Images/image copy.png" alt="Step 2" />
                            </div>
                        </div>
                    </div>

                    <div className="row w-75 mx-auto align-items-center mb-4">
                        <div className="col-12 col-md-6 order-1 order-md-1 ">
                            <div className="step-image-wrapper">
                                <img src="/Images/image copy 2.png" alt="Step 3" />
                            </div>
                        </div>
                        <div className="col-12 col-md-6 order-2 order-md-2 text-start">
                            <div className="step-text-wrapper">

                                <h4 style={{ color: 'tomato' }}>3</h4>
                                <h5>Choose the Best Offer</h5>
                                <p className="text-secondary">Compare pricing, delivery times, and services to select the most suitable option.</p>

                            </div>
                        </div>
                    </div>

                    <div className="row w-75 mx-auto align-items-center mb-4">
                        <div className="col-12 col-md-6 order-1 order-md-1 text-start">
                            <div className="step-text-wrapper">
                                <h4 style={{ color: 'tomato' }}>4</h4>
                                <h5>Make Payment & Get Provider Details</h5>
                                <p className="text-secondary">Securely complete your booking and receive the provider’s details. The shipping company will contact you to confirm pickup arrangements and provide the estimated delivery timeline.</p>

                            </div>

                        </div>
                        <div className="col-12 col-md-6 order-2 order-md-2">
                            <div className="step-image-wrapper">
                                <img src="/Images/image copy 3.png" alt="Step 4" />
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-4">
                        <button className="btn-main" onClick={() => navigate('/send_groupage')}>
                            Start Shipping your products
                        </button>
                    </div>
                </div>
            </section>




            <section className="new-add-company-wrapper">
                <div className="container">
                    <div className="d-flex flex-column justify-content-start align-items-start">
                        <div className="title-head">
                            <h3>Recent Offers Posted</h3>
                        </div>

                        <div className="row justify-content-center w-100">
                            {offers_details.length > 0 ? (
                                <>
                                    {offers_details.map((company, index) => (
                                        <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3" onClick={() => submit_offer(company)}>
                                            <div className="company-box-wrap">
                                                <div className="d-flex flex-column align-items-start">
                                                    <div className="rounded-circle overflow-hidden" style={{ width: '30%', maxWidth: '130px', aspectRatio: '1/1' }}>
                                                        <img
                                                            src={company.img01 ? company.img01 : "https://png.pngtree.com/png-clipart/20230915/original/pngtree-global-icon-for-web-design-logo-app-isolated-vector-vector-png-image_12189325.png"}
                                                            alt="Logo"
                                                            className="w-100 h-100 object-fit-cover"
                                                        />
                                                    </div>
                                                    <h5>{company.product_name}</h5>
                                                    {/* <span className="text-secondary">4.5 (20 Ratings)</span> */}
                                                    <p className="text-secondary text-start mt-1">{company.sender_description.split(" ").slice(0, 10).join(" ") + "..."}</p>
                                                    <span className="" style={{ cursor: "pointer", color: '#de8316' }} onClick={() => submit_offer(company)}>Submit Offer</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <>
                                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3" >
                                        <div className="company-box-wrap">
                                            <div className="d-flex flex-column align-items-start">
                                                <div className="rounded-circle overflow-hidden" style={{ width: '30%', maxWidth: '130px', aspectRatio: '1/1' }}>
                                                    <img
                                                        src="https://png.pngtree.com/png-clipart/20230915/original/pngtree-global-icon-for-web-design-logo-app-isolated-vector-vector-png-image_12189325.png"
                                                        alt="Logo"
                                                        className="w-100 h-100 object-fit-cover"
                                                    />
                                                </div>
                                                <h5>No Data fetch</h5>
                                                {/* <span className="text-secondary">4.5 (20 Ratings)</span> */}
                                                <p className="text-secondary text-start mt-1"></p>
                                                <span className="" style={{ cursor: "pointer", color: '#de8316' }} >Submit Offer</span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                        </div>
                        <button className="btn-main" onClick={() => navigate('/offers')}>
                            View All
                        </button>
                    </div>
                </div>
            </section>

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
                                        <Form.Select
                                            value={expetedDate}
                                            onChange={(e) => setExpetedDate(e.target.value)}
                                        >
                                            <option value="">Select Expected Days</option>
                                            <option value="less_than_15_days">Less Than 15 Days</option>
                                            <option value="more_than_15_days">More Than 15 Days</option>
                                            <option value="more_than_30_days">More Than 30 Days</option>
                                        </Form.Select>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex w-100 justify-content-end">
                                <button className="btn-main-offer" onClick={() => handleSubmit_offer(groupage_detail)}>Submit Offer</button>
                            </div>
                        </div>

                    </div>
                </div>
            )}

            <section className="step-wrapper">
                <div className="container mt-5">
                    <div className="text-center mb-4">
                        <div className="title-head">
                            <h3>How It Works: Effortless Shipping in Four Easy Steps</h3>
                        </div>
                    </div>

                    <div className="row w-75 mx-auto align-items-center mb-4 mt-5">
                        <div className="col-12 col-md-6 order-2 order-md-2 text-start">
                            <div className="step-text-wrapper">
                                <h4>1</h4>
                                <h5>Provide Your Shipment Details</h5>
                                <p>Fill out a simple form with your shipment details, including type of goods, origin, and destination</p>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 order-1 order-md-1 ">
                            <div className="step-image-wrapper">
                                <img src="/Images/image.png" alt="Step 1" />
                            </div>
                        </div>
                    </div>

                    <div className="row w-75 mx-auto align-items-center mb-4">
                        <div className="col-12 col-md-6 order-1 order-md-1 text-start">
                            <div className="step-text-wrapper">

                                <h4 >2</h4>
                                <h5>Get Matched with Trusted Companies</h5>
                                <p >Receive a curated list of trusted shipping companies that can handle your shipment</p>

                            </div>
                        </div>
                        <div className="col-12 col-md-6 order-2 order-md-2 ">
                            <div className="step-image-wrapper">
                                <img src="/Images/image copy.png" alt="Step 2" />
                            </div>
                        </div>
                    </div>

                    <div className="row w-75 mx-auto align-items-center mb-4">
                        <div className="col-12 col-md-6 order-1 order-md-1 ">
                            <div className="step-image-wrapper">
                                <img src="/Images/image copy 2.png" alt="Step 3" />
                            </div>
                        </div>
                        <div className="col-12 col-md-6 order-2 order-md-2 text-start">
                            <div className="step-text-wrapper">

                                <h4 >3</h4>
                                <h5>Choose Your Preferred Company</h5>
                                <p >Review the list of companies and select the one that best fits your needs based on their services</p>

                            </div>
                        </div>
                    </div>

                    <div className="row w-75 mx-auto align-items-center mb-4">
                        <div className="col-12 col-md-6 order-1 order-md-1 text-start">
                            <div className="step-text-wrapper">
                                <h4 >4</h4>
                                <h5>Contact the Company Directly</h5>
                                <p >The shipping company will contact you to confirm pickup arrangements and provide the estimated delivery timeline</p>

                            </div>

                        </div>
                        <div className="col-12 col-md-6 order-2 order-md-2">
                            <div className="step-image-wrapper">
                                <img src="/Images/image copy 3.png" alt="Step 4" />
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-4">
                        <button className="btn-main" onClick={() => navigate('/offers')}>
                            View all offers
                        </button>
                    </div>
                </div>
            </section>

            <section className="stats-wrapper">
                <div className="container">
                    <div className="w-100 d-flex flex-wrap justify-content-between align-items-center">
                        <div className="flex-grow-1 text-light text-center">
                            <div className="stats-wrap">
                                <h3>100+</h3>
                                <p>Verified Logistics Companies</p>
                            </div>
                        </div>
                        <div className="flex-grow-1 text-light text-center">
                            <div className="stats-wrap">
                                <h3>100+</h3>
                                <p>Countries Covered</p>
                            </div>

                        </div>
                        <div className="flex-grow-1 text-light text-center">
                            <div className="stats-wrap">
                                <h3>10,000+</h3>
                                <p>Shipments Processed</p>
                            </div>

                        </div>
                        <div className="flex-grow-1 text-light text-center">
                            <div className="stats-wrap">
                                <h3>98%</h3>
                                <p>Customer Satisfaction Rate</p>
                            </div>

                        </div>
                    </div>
                </div>
            </section>


            {/* <section className="testi-wrapper"> */}
            <div className="d-flex flex-column justify-content-center align-items-center w-100 mt-5">
                <div className="title-head">
                    <h3>Real stories, Real impact</h3>
                </div>
                <div className="w-100 mx-auto px-3">
                    <Slider {...settings}>
                        {profiles.map((profile, index) => (
                            <div key={index} className="p-4">
                                <div className="bg-white rounded-3 w-100 p-4 d-flex flex-column align-items-center text-center border">
                                    <div className="testi-img-wrapper">
                                        <img
                                            src={profile.img}
                                            alt={profile.name}
                                        />
                                    </div>
                                    <div className="testi-desc-wrapper">
                                        <p>{profile.description}</p>
                                    </div>
                                    <h5 className="mb-2">{profile.name}</h5>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>

            {/* </section> */}

            <section className="faq-wrapper">
                <div className="title-head">
                    <h3>Questions we get asked</h3>
                </div>

                <div className="container">
                    <div className="faq-wrap">
                        <div className="d-flex flex-column flex-md-row justify-content-center p-3 p-md-5 gap-3 gap-md-5 w-100">
                            <div className="col-12 col-md-6 d-flex flex-column align-items-center">
                                <ul className="list-unstyled w-100 text-start">
                                    <Accordion defaultActiveKey="0">
                                        <li>
                                            <Accordion.Item eventKey="0">
                                                <Accordion.Header>
                                                    {/* <h5><IoIosAddCircleOutline className="text-primary" /></h5> */}
                                                    <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout</p>
                                                </Accordion.Header>
                                                <Accordion.Body>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                                    minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                                    aliquip ex ea commodo consequat. Duis aute irure dolor in
                                                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                                    culpa qui officia deserunt mollit anim id est laborum.
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </li>
                                        <li>
                                            <Accordion.Item eventKey="1">
                                                <Accordion.Header>
                                                    {/* <h5><IoIosAddCircleOutline className="text-primary" /></h5> */}
                                                    <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout</p>
                                                </Accordion.Header>
                                                <Accordion.Body>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                                    minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                                    aliquip ex ea commodo consequat. Duis aute irure dolor in
                                                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                                    culpa qui officia deserunt mollit anim id est laborum.
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </li>
                                        <li>
                                            <Accordion.Item eventKey="2">
                                                <Accordion.Header>
                                                    {/* <h5><IoIosAddCircleOutline className="text-primary" /></h5> */}
                                                    <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout</p>
                                                </Accordion.Header>
                                                <Accordion.Body>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                                    minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                                    aliquip ex ea commodo consequat. Duis aute irure dolor in
                                                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                                    culpa qui officia deserunt mollit anim id est laborum.
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </li>
                                        <li>
                                            <Accordion.Item eventKey="3">
                                                <Accordion.Header>
                                                    {/* <h5><IoIosAddCircleOutline className="text-primary" /></h5> */}
                                                    <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout</p>
                                                </Accordion.Header>
                                                <Accordion.Body>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                                    minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                                    aliquip ex ea commodo consequat. Duis aute irure dolor in
                                                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                                    culpa qui officia deserunt mollit anim id est laborum.
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </li>
                                    </Accordion>
                                </ul>
                            </div>
                            <div className="col-12 col-md-6 d-flex flex-column align-items-center">
                                <ul className="list-unstyled w-100 text-start">
                                    <Accordion defaultActiveKey="0">
                                        <li>
                                            <Accordion.Item eventKey="0">
                                                <Accordion.Header>
                                                    {/* <h5><IoIosAddCircleOutline className="text-primary" /></h5> */}
                                                    <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout</p>
                                                </Accordion.Header>
                                                <Accordion.Body>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                                    minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                                    aliquip ex ea commodo consequat. Duis aute irure dolor in
                                                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                                    culpa qui officia deserunt mollit anim id est laborum.
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </li>
                                        <li>
                                            <Accordion.Item eventKey="1">
                                                <Accordion.Header>
                                                    {/* <h5><IoIosAddCircleOutline className="text-primary" /></h5> */}
                                                    <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout</p>
                                                </Accordion.Header>
                                                <Accordion.Body>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                                    minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                                    aliquip ex ea commodo consequat. Duis aute irure dolor in
                                                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                                    culpa qui officia deserunt mollit anim id est laborum.
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </li>
                                        <li>
                                            <Accordion.Item eventKey="2">
                                                <Accordion.Header>
                                                    {/* <h5><IoIosAddCircleOutline className="text-primary" /></h5> */}
                                                    <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout</p>
                                                </Accordion.Header>
                                                <Accordion.Body>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                                    minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                                    aliquip ex ea commodo consequat. Duis aute irure dolor in
                                                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                                    culpa qui officia deserunt mollit anim id est laborum.
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </li>
                                        <li>
                                            <Accordion.Item eventKey="3">
                                                <Accordion.Header>
                                                    {/* <h5><IoIosAddCircleOutline className="text-primary" /></h5> */}
                                                    <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout</p>
                                                </Accordion.Header>
                                                <Accordion.Body>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                                    minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                                    aliquip ex ea commodo consequat. Duis aute irure dolor in
                                                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                                    culpa qui officia deserunt mollit anim id est laborum.
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </li>
                                    </Accordion>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="w-100 mt-5">
                <Footer />
            </div>
        </div>
    )
}

export default Home;