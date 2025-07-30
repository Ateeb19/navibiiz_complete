import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { Form } from "react-bootstrap";
import Navbar from "../Navbar/Navbar";
import { BiSolidDetail } from "react-icons/bi";
import { IoCall, IoChatbubblesSharp, IoLocationSharp } from "react-icons/io5";
import { FaArrowLeftLong, FaArrowRightLong, FaLocationDot, FaTruckFast } from "react-icons/fa6";
import { MdDeliveryDining, MdEmail, MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { FaBox, FaStar } from "react-icons/fa";
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
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { PiBoxArrowUpBold } from "react-icons/pi";
import { GiCardPickup } from "react-icons/gi";
import { IoIosCall } from "react-icons/io";

const Home = () => {
    const port = process.env.REACT_APP_SECRET;
    console.log('this is the current port for backend api -: ', port);
    const { showAlert } = useAlert();
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const [offers_details, setOffers_details] = useState([]);
    const displayCompany = () => {
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

    const [show_image, setShow_image] = useState(false);
    const [images, setImages] = useState([
        {
            original: '',
            thumbnail: ''
        }
    ]);

    const company_data = localStorage.getItem('companyInfo');
    const [company_info, setCompany_info] = useState([]);
    const companies = () => {
        if (company_data) {
            if (company_data.length > 0) {
                setCompany_info(JSON.parse(localStorage.getItem('companyInfo')));
            }
        }
    }
    useEffect(() => {
        companies();
    }, [])

    const [last_companies, setLast_companies] = useState([]);

    const last_companies_fetch = () => {
        if (company_info.length > 0) {
            const lastFourReversed = company_info.slice(-4).reverse();
            setLast_companies(lastFourReversed);
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
    // const handleSearch = () => {
    //     localStorage.setItem('fromHome', '0')
    //     localStorage.setItem('forcompanies_list', pickupCountry);
    //     navigate('/companies_list', {
    //         state: {
    //             fromHomePage: true,
    //             pickupCountry: pickupCountry,
    //         },
    //     });
    // };

    // In your home page component
    const handleSearch = () => {
        // Prepare the filters object
        const filters = {
            selectedServices: [],
            selectedPickupCountry: pickupCountry,  // This is the key change
            selectedDestinationCountry: "",
            selectedDuration: [],
            searchQuery: ""
        };

        // Save to localStorage
        localStorage.setItem("filters", JSON.stringify(filters));

        // Navigate with state
        navigate('/companies_list', {
            state: {
                fromHomePage: true,
                pickupCountry: pickupCountry
            },
            replace: true  // Prevent back button issues
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
            name: 'Sophie',
            location: 'Paris, France',
            description: '“I compared prices from many logistics companies on Novibiz before shipping a car to Congo. The platform helped me choose the most reliable option at the best rate.”',
            img: '/Images/person02w.webp'
        },
        {
            name: 'Claire',
            location: 'Brussels, Belgium',
            description: '“Before sending my equipment to Cameroon, I compared prices from many providers on Novibiz. It was easy to find the most affordable and trustworthy service.”',
            img: '/Images/person04w.jpeg'
        },
        {
            name: 'Marcel',
            location: 'Berlin, Germany',
            description: '“Shipping electronic devices to South Africa was simple. Novibiz arranged a home pickup, and I didn’t have to worry about logistics. Everything was taken care of.”',
            img: '/Images/person01.jpg'
        },
        {
            name: 'Lena',
            location: 'Cologne, Germany',
            description: '“I had car parts to send to China, and Novibiz offered a home pickup option. It saved me time and made the whole shipping process effortless.”',
            img: '/Images/person05w.jpg'
        },
        {
            name: 'Thomas',
            location: 'Paris, France',
            description: '“I found a reliable freight forwarder through Novibiz’s Yellow Pages to ship goods to the USA. The platform made the search fast and effective.”',
            img: '/Images/profile05.jpg'
        }
    ];

    const [bidAmount, setBidAmount] = useState('');
    const [expetedDate, setExpetedDate] = useState('');
    const [dateError, setDateError] = useState(false);
    const [offer_success, setOffer_success] = useState(false);

    const handleSubmit_offer = (details) => {
        if (bidAmount === '') {
            showAlert('Please fill all the fields');
            return;
        }
        if (!expetedDate) {
            showAlert('Please fill all the fields');
            setDateError(true);
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
                showAlert('Login as a company to submit an offer');
                navigate('/login');
            } else {
                showAlert("Offer Created Successfully!");
                setOffer_success(true);
                setGroupage_detail(null);
                setBidAmount('');
                setExpetedDate('');
            }
        }).catch((err) => {
            showAlert('Login as a company to submit an offer');
            setOffer_success(false);
            navigate('/login');
        });
    };
    const filteredCompanies = company_info.filter(company => company.logo);
    const settings_logo = {
        dots: false,
        infinite: filteredCompanies.length > 1,
        // infinite: true,
        speed: 500,
        slidesToShow: Math.min(filteredCompanies.length, 6),
        // slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1200,
                settings: { slidesToShow: 4 },
            },
            {
                breakpoint: 768,
                settings: { slidesToShow: 3 },
            },
            {
                breakpoint: 480,
                settings: { slidesToShow: 2 },
            },
        ],
    };
    const sliderRef = useRef(null);
    return (
        <div className="d-flex flex-column align-items-center justify-content-center mt-5 pt-5">
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
                                <h1>Delivering Your <span style={{ color: '#FFC31C' }}>Goods</span> Globally with Trusted <span style={{ color: '#FFC31C' }}>Logistics</span> Partners</h1>
                                <p>
                                    Our platform is designed to streamline cross-border shipping by linking you with reliable providers who offer consistent, transparent, and timely service around the globe.
                                </p>
                            </div>
                        </div>

                        {/* <div className="d-flex flex-row justify-content-center align-items-center px-3 pickup-wrap gap-4">
                            <span><Countryselector label='Pick Up Country' borderradiuscount='5px' bgcolor='#ffffff' bordercolor='1px solid #ffffff' margincount='0 0 0 0' paddingcount="12px 10px" onSelectCountry={(country) => setPickupCountry(country)} /></span>

                            <button className="" onClick={handleSearch}><IoSearch /> Search Companies</button>
                        </div> */}
                        <div className="d-flex flex-row justify-content-between align-items-center px-3 pickup-wrap gap-4">
                            <div className='home-country-selector'>
                                <span><Countryselector label='Pick Up Country' borderradiuscount='5px' bgcolor='#ffffff' bordercolor='1px solid #ffffff' margincount='0 0 0 0' paddingcount="12px 10px" onSelectCountry={(country) => setPickupCountry(country)} /></span>
                            </div>

                            <div className="d-flex text-black flex-row align-items-center justify-content-between home-search-country" onClick={handleSearch} >
                                <div>Search companies</div>
                                <div style={{ cursor: 'pointer' }}><IoSearch className="fs-5" /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mt-5 px-3 px-md-4">
                <div className="row g-5">
                    {/* Left Content */}
                    <div className="col-12 col-lg-6 d-flex flex-column justify-content-start align-items-start p-3 p-md-4">
                        <div className="about-head-wrap">
                            <h3>About Us</h3>
                        </div>
                        <div className="about-text-wrap text-start">
                            <h2>Comprehensive End-to-End Logistics Solutions for Reliable and Timely Delivery</h2>
                            <p>At Novibiz, we are committed to transforming the global logistics industry by offering innovative, transparent, and dependable services. Our mission is to enable businesses worldwide to benefit from seamless shipping solutions that exceed expectations, fostering sustainable growth and long-term success.</p>

                            <p>We partner with a trusted global network to ensure the safety and speed of every shipment. With our advanced technology, real-time tracking, and simplified shipment management, logistics become accessible and efficient for all our clients. At Novibiz, your satisfaction is our top priority.</p>
                        </div>
                        <div className="about-btn mt-3">
                            <button onClick={() => navigate('/about_us')}>View More</button>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="col-12 col-lg-6">
                        <div className="about-image-wrap d-flex justify-content-center align-items-center w-100 p-3 p-md-4 mt-4 mt-lg-5">
                            <img className="img-fluid" src="/Images/about_us_img.jpg" alt="About_us" />
                        </div>
                    </div>
                </div>
            </div>



            <div className="container mt-5 mb-4">
                <div className="home-company-wrap d-flex flex-column justify-content-center align-items-center">
                    <div className="home-heading d-flex flex-row align-items-center justify-content-between w-100">
                        <h2>Companies that trusted our services</h2>
                        <div className="d-flex flex-row align-items-center justify-content-center gap-2 slider-btn">
                            <button onClick={() => sliderRef.current?.slickPrev()}>
                                <FaArrowLeftLong />
                            </button>
                            <button onClick={() => sliderRef.current?.slickNext()}>
                                <FaArrowRightLong />
                            </button>
                        </div>
                    </div>

                    <div className="w-100 mx-auto px-3 mt-4">
                        {filteredCompanies.length > 0 ? (
                            <Slider {...settings_logo} ref={sliderRef}>
                                {filteredCompanies.map((company, index) => (
                                    <div key={index} className="px-2">
                                        <img
                                            src={company.logo}
                                            alt={`Company ${index}`}
                                            style={{
                                                width: "100%",
                                                height: "100px",
                                                objectFit: "contain",
                                                padding: "10px",
                                            }}
                                        />
                                    </div>
                                ))}
                            </Slider>
                        ) : (
                            <div className="text-center">
                                <h2>No Data</h2>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mt-5">
                <div className="d-flex flex-column justify-content-center align-items-center w-100">
                    <div className="d-flex align-items-start justify-content-start w-100 mb-4">
                        <div className="home-heading text-start w-100 w-md-60">
                            <h2>How It Works: Simple & Secure Shipping in Four Easy Steps</h2>
                        </div>
                    </div>

                    <div className="d-flex flex-column justify-content-center align-items-center w-100">
                        <div className="row w-100 mt-4 mb-4 gy-4">
                            {/* Step 1 */}
                            <div className="col-12 col-md-6 d-flex flex-column flex-md-row align-items-center justify-content-between pe-md-5">
                                <div className="step-text d-flex flex-column align-items-start text-start gap-3 w-100 w-md-70 mb-3 mb-md-0">
                                    <div className="d-flex flex-row gap-2">
                                        <h5 className="fw-medium" style={{ fontSize: '20px' }}>1.</h5>
                                        <h5>Enter Your Shipping Request</h5>
                                    </div>
                                    <p>Fill out a quick form with shipment details—such as package type, weight, pickup location, and delivery destination.</p>
                                </div>
                                <div className="step-image d-flex justify-content-center">
                                    <img src="/Images/home_img04.jpg" alt="step1" className="img-fluid" />
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="col-12 col-md-6 d-flex flex-column flex-md-row align-items-center justify-content-between ps-md-5">
                                <div className="step-text d-flex flex-column align-items-start text-start gap-3 w-100 w-md-70 mb-3 mb-md-0">
                                    <div className="d-flex flex-row gap-2">
                                        <h5 className="fw-medium" style={{ fontSize: '20px' }}>2.</h5>
                                        <h5>Receive Bids from Verified Carriers</h5>
                                    </div>
                                    <p>Get instant offers from trusted global shipping partners who match your shipment criteria.</p>
                                </div>
                                <div className="step-image d-flex justify-content-center">
                                    <img src="/Images/home_img03.jpg" alt="step2" className="img-fluid" />
                                </div>
                            </div>
                        </div>

                        <div className="row w-100 mt-4 gy-4">
                            {/* Step 3 */}
                            <div className="col-12 col-md-6 d-flex flex-column flex-md-row align-items-center justify-content-between pe-md-5">
                                <div className="step-text d-flex flex-column align-items-start text-start gap-3 w-100 w-md-70 mb-3 mb-md-0">
                                    <div className="d-flex flex-row gap-2">
                                        <h5 className="fw-medium" style={{ fontSize: '20px' }}>3.</h5>
                                        <h5>Select the Best Offer</h5>
                                    </div>
                                    <p>Review the bids, compare prices and delivery times, then choose the carrier that fits your needs.</p>
                                </div>
                                <div className="step-image d-flex justify-content-center">
                                    <img src="/Images/home_img02.jpg" alt="step3" className="img-fluid" />
                                </div>
                            </div>

                            {/* Step 4 */}
                            <div className="col-12 col-md-6 d-flex flex-column flex-md-row align-items-center justify-content-between ps-md-5">
                                <div className="step-text d-flex flex-column align-items-start text-start gap-3 w-100 w-md-70 mb-3 mb-md-0">
                                    <div className="d-flex flex-row gap-2">
                                        <h5 className="fw-medium" style={{ fontSize: '20px' }}>4.</h5>
                                        <h5>Confirm Booking & Track Your Shipment</h5>
                                    </div>
                                    <p>Securely book your shipment, receive tracking details, and monitor your package from pickup to delivery.</p>
                                </div>
                                <div className="step-image d-flex justify-content-center">
                                    <img src="/Images/home_img01.jpg" alt="step4" className="img-fluid" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="about-btn d-flex w-100 align-items-center justify-content-center mt-5">
                        <button onClick={() => navigate('/send_groupage')} className="btn btn-primary px-4 py-2">
                            Start shipping your products
                        </button>
                    </div>
                </div>
            </div>


            <section className="new-add-company-wrapper">
                <div className="container">
                    <div className="d-flex flex-column justify-content-start align-items-start">
                        <div className="home-heading">
                            <h2>Recent Offers Posted</h2>
                        </div>

                        <div className="row justify-content-center w-100 mt-4">
                            {offers_details.length > 0 ? (
                                <>
                                    {offers_details.map((company, index) => (
                                        <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3" onClick={() => submit_offer(company)}>
                                            <div className="company-box-wrap">
                                                <div className="d-flex flex-column align-items-start company-box-text">
                                                    <div className="image-div">
                                                        <img
                                                            src={company.img01 ? company.img01 : "https://png.pngtree.com/png-clipart/20230915/original/pngtree-global-icon-for-web-design-logo-app-isolated-vector-vector-png-image_12189325.png"}
                                                            alt="Logo"
                                                            className="w-100 h-100 object-fit-cover"
                                                        />
                                                    </div>
                                                    <h5 className="mt-3">{company.product_name}</h5>
                                                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                                                        <div className="d-flex flex-row align-items-start justify-content-start gap-2 offer-pickup"><h6>Pickup: </h6> <p>{company.sender_country}</p></div>
                                                        <span className="submit-offer" onClick={() => submit_offer(company)}>Submit Offer <PiBoxArrowUpBold style={{ fontSize: '16px' }} /></span>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <>
                                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3" >
                                        <div className="d-flex flex-column align-items-center">
                                            <h2>No Data</h2>
                                        </div>
                                    </div>
                                </>
                            )}

                        </div>
                        <button className="home-offer-btn" onClick={() => navigate('/offers')}>
                            View All
                        </button>
                    </div>
                </div>
            </section>

            {/* <div className="container mt-4">
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
            </div> */}

            {/* <section className="new-add-company-wrapper">
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
                                        <div className="d-flex flex-column align-items-center">
                                            <h2> No Data </h2>
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
            </section> */}



            {/* <section className="step-wrapper">
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
            </section> */}






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
                            maxWidth: '1100px',
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
                                <h5 className="text-start w-100 mb-3 fs-6">Product Images</h5>
                                <div className="d-flex flex-wrap gap-2"
                                    onClick={() => {
                                        const imageList = [
                                            groupage_detail.img01, groupage_detail.img02, groupage_detail.img03, groupage_detail.img04, groupage_detail.img05,
                                            groupage_detail.img06, groupage_detail.img07, groupage_detail.img08, groupage_detail.img09, groupage_detail.img10,
                                        ].filter(img => img);

                                        const formattedImages = imageList.map(img => ({
                                            original: img,
                                            thumbnail: img,
                                            originalHeight: "500",
                                        }));

                                        setImages(formattedImages);
                                        setShow_image(true);
                                    }}
                                >
                                    {[
                                        groupage_detail.img01, groupage_detail.img02, groupage_detail.img03, groupage_detail.img04, groupage_detail.img05,
                                        groupage_detail.img06, groupage_detail.img07, groupage_detail.img08, groupage_detail.img09, groupage_detail.img10,
                                    ]
                                        .filter(img => img)
                                        .map((img, index) => (
                                            <img
                                                key={index}
                                                src={img}
                                                alt={`Product ${index + 1}`}
                                                style={{
                                                    width: '18%',
                                                    maxWidth: '120px',
                                                    height: 'auto',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                }}
                                            // onClick={() => setShow_image(img)}
                                            />
                                        ))}
                                </div>
                            </div>



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
                                        ><MdOutlineDriveFileRenameOutline /></div>
                                        <div className="d-flex flex-column align-items-start gap-2">
                                            <span className="text-secondary offer-submit-sub-head">Product Name</span>
                                            <h6>{groupage_detail.product_name}</h6>
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
                                        ><RiExpandHeightFill /></div>
                                        <div className="d-flex flex-column align-items-start gap-2">
                                            <span className="text-secondary offer-submit-sub-head">Height</span>
                                            <h6>{groupage_detail.p_height} Cm</h6>
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
                                        <input type="text" className="form-control w-100 w-sm-50 fs-5" onChange={(e) => { const value = e.target.value.replace(/[^0-9.]/g, ""); setBidAmount(value); }} value={`€ ${bidAmount}`} />
                                    </div>
                                    <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between w-100 gap-3 mt-4">
                                        <div className="d-flex flex-column align-items-start justify-content-start gap-2 w-100 w-sm-50">
                                            <span className="text-secondary text-start">How long will this product take to deliver?</span>
                                        </div>
                                        <Form.Select
                                            style={{
                                                border: dateError ? '1px solid rgb(178, 0, 0)' : '',
                                                boxShadow: dateError ? '0 0 10px rgb(178, 0, 0)' : '',
                                            }}
                                            value={expetedDate}
                                            onChange={(e) => {
                                                setExpetedDate(e.target.value);
                                                setDateError(false); // reset error when changed
                                            }}
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

            {show_image && (
                <>
                    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                        style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            zIndex: 99999
                        }}
                    >
                        <div className="bg-light rounded shadow p-4 position-relative border border-2 border-dark"
                            style={{
                                width: '90%',
                                maxWidth: '1100px',
                                height: '95vh',
                                // overflowY: 'auto'
                            }}
                        >
                            <div className="d-flex flex-column justify-content-start">
                                <button className="btn btn-danger position-absolute top-0 end-0 m-2" onClick={() => setShow_image(false)}>
                                    ✕
                                </button>
                                <div className="w-100 pt-4">
                                    <ImageGallery
                                        items={images}
                                        showFullscreenButton={false} />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {offer_success && (
                <>
                    <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center" style={{ zIndex: 1050 }}>

                        <div className="position-relative bg-white p-4 rounded shadow-lg" style={{ width: '580px', height: '25rem' }}>

                            <div className="success-img-wrap">
                                <img src="/Images/Party_Popper.png" alt="congratulation" />
                            </div>

                            <div className="title-head">
                                <h3 style={{ color: ' #1ba300' }}>CONGRATULATIONS</h3>
                            </div>

                            <div className="success-des-wrap">
                                <p>Offer Sent Successfully</p>
                            </div>

                            <div className="success-button">
                                <button className="btn-success" onClick={() => navigate('/dashboard')}>Go To Dashboard</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {/* <section className="step-wrapper">
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
            </section> */}

            <section className="stats-wrapper">
                <div className="container">

                    <div className="w-100 d-flex flex-wrap justify-content-between align-items-center">
                        <div className="flex-grow-1 text-light text-center">
                            <div className="stats-wrap">
                                <h3>50+</h3>
                                <p>Verified Logistics Companies</p>
                            </div>
                        </div>
                        <div className="flex-grow-1 text-light text-center">
                            <div className="stats-wrap">
                                <h3>40+</h3>
                                <p>Countries Covered</p>
                            </div>

                        </div>
                        <div className="flex-grow-1 text-light text-center">
                            <div className="stats-wrap">
                                <h3>5,000+</h3>
                                <p>Shipments Processed</p>
                            </div>

                        </div>
                        <div className="flex-grow-1 text-light text-center">
                            <div className="stats-wrap">
                                <h3>95%</h3>
                                <p>Customer Satisfaction Rate</p>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            <section className="build-wrapper">
                <div className="container">
                    <div className="d-flex flex-column align-items-start justify-content-start w-100">
                        <div className="home-heading">
                            <h2>Build on Trust and Our Core Values</h2>
                            <p>We base our services on trust and strong values to ensure reliability.</p>
                        </div>
                    </div>
                    <div className="row w-100 mt-3">
                        <div className="col-12 col-sm-6 col-lg-3 mb-4">
                            <div className="build-wrap text-start h-100 p-3">
                                <h2><FaBox /></h2>
                                <h5>Easy Shipment Details</h5>
                                <p>Simply provide your shipment information to receive a tailored list of logistics companies.</p>
                            </div>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-3 mb-4">
                            <div className="build-wrap text-start h-100 p-3 ">
                                <h2><FaLocationDot /></h2>
                                <h5>Location-Based Filtering</h5>
                                <p>Filter shipping providers by origin and destination for accurate, relevant results.</p>
                            </div>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-3 mb-4">
                            <div className="build-wrap text-start h-100 p-3">
                                <h2><FaTruckFast /></h2>
                                <h5>Shipping Options</h5>
                                <p>Select your preferred shipping method and connect with the best-suited partners.</p>
                            </div>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-3 mb-4">
                            <div className="build-wrap text-start h-100 p-3">
                                <h2><GiCardPickup /></h2>
                                <h5>Pickup Service</h5>
                                <p>Professional couriers will collect your goods directly from your specified location.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            <section className="container mt-3">
                <div className="d-flex flex-column justify-content-center align-items-center w-100 mt-5">
                    <div className="home-heading w-100 d-flex align-items-start justify-content-start">
                        <h2>Real Stories Real Impact</h2>
                    </div>
                    <div className="w-100 mx-auto mt-4">
                        <Slider {...settings}>
                            {profiles.map((profile, index) => (
                                <div key={index} className="p-3">
                                    <div className="testi-description-box bg-white rounded-3 w-100 p-2 d-flex flex-column align-items-center justify-content-between text-center border review-rating">
                                        <div className="testi-desc-wrapper text-start">
                                            <p>{profile.description}</p>
                                        </div>

                                        <div className="d-flex flex-row align-items-center justify-content-start w-100 pe-4 gap-3">
                                            <div className="testi-img-wrapper">
                                                <img
                                                    src={profile.img}
                                                    alt={profile.name}
                                                />
                                            </div>
                                            <div className="d-flex flex-column align-items-start justify-content-start w-100">
                                                <h5 className="mb-2">{profile.name}</h5>
                                                <h5 className="mb-2">{profile.location}</h5>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
            </section>

            <section className="home-footer-wrapper w-100 mt-5 mb-5 pb-5">
                <div className="container">
                    <div className="d-flex flex-column align-items-start justify-content-start text-start w-100">
                        <div className="heading-footer mt-5 mb-3">
                            <h1>Partner with us and grow your reach</h1>
                            <p>Join our platform to connect with global customers and expand your logistics business</p>
                            <button className="" onClick={() => navigate('/register_company')}>Register your company</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* <section className="footer-touch mb-5 pb-5 w-100">
                <div className="container mt-5">
                    <div className="row w-100">
                        <div className="col-md-8 d-flex flex-column align-items-start justify-content-start text-start">
                            <div className="title-head w-100">
                                <h3>Get In Touch</h3>
                            </div>
                            <div className="row w-100 mt-1">
                                <div className="col-md-6 d-flex flex-column align-items-between justify-content-center">
                                    <div className="d-flex flex-column align-items-start justify-content-start gap-2">
                                        <lable className='input-label'>Full Name</lable>
                                        <input type='text' className="contact-field w-100" />
                                    </div>
                                </div>
                                <div className="col-md-6 d-flex flex-column align-items-between justify-content-center">
                                    <div className="d-flex flex-column align-items-start justify-content-start gap-2">
                                        <lable className='input-label'>Email ID</lable>
                                        <input type='text' className="contact-field w-100" />
                                    </div>
                                </div>
                            </div>

                            <div className="row w-100 mt-1">
                                <div className="col-md-6 d-flex flex-column align-items-between justify-content-center">
                                    <div className="d-flex flex-column align-items-start justify-content-start gap-2">
                                        <lable className='input-label'>Contact Number</lable>
                                        <input type='text' className="contact-field w-100" />
                                    </div>
                                </div>
                                <div className="col-md-6 d-flex flex-column align-items-between justify-content-center">
                                    <div className="d-flex flex-column align-items-start justify-content-start gap-2">
                                        <lable className='input-label'>Country You Live</lable>
                                        <input type='text' className="contact-field w-100" />
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex flex-column align-items-start justify-content-start gap-2">
                                <lable className='input-label'>Description</lable>
                                <textarea cols='95' rows='4' className="contact-field w-100" />
                            </div>
                            <div className="d-flex w-100 about-btn">
                                <button className="w-100 ">Submit</button>
                            </div>
                        </div>
                        <div className="col-md-4 d-flex flex-column align-items-start justify-content-start">
                            <div className="d-flex flex-column text-start align-items-start justify-content-start contact-info w-100" style={{ color: '#FFFFFF' }}>
                                <div className="title-head w-100 text-light d-flex" style={{ marginBottom: '-30px' }}>
                                    <h3>Contact Information</h3>
                                </div>
                                <div className="d-flex flex-column w-100 gap-2 mt-5">
                                    <h6>Call us</h6>
                                    <div className="d-flex flex-row align-items-start justify-content-start w-100 gap-2">
                                        <h6>< IoIosCall /> </h6> <h6>+49 176 60906264</h6>
                                    </div>

                                </div>
                                <div className="d-flex flex-column w-100 gap-2 mt-5">
                                    <h6>Email us</h6>
                                    <div className="d-flex flex-row align-items-start justify-content-start w-100 gap-2">
                                        <h6>< MdEmail /> </h6> <h6>
                                            <a
                                                href="mailto:info@novibiz.com"
                                                style={{ textDecoration: 'none', color: 'inherit' }}
                                            >
                                                info@novibiz.com
                                            </a>
                                        </h6>
                                    </div>

                                </div>
                                <div className="d-flex flex-column w-100 gap-2 mt-5">
                                    <h6>Chat with us</h6>
                                    <div className="d-flex flex-row align-items-start justify-content-start w-100 gap-2">
                                        <h6>< IoChatbubblesSharp /> </h6> <h6>+49 176 60906264</h6>
                                    </div>

                                </div>
                                <div className="d-flex flex-column w-100 gap-2 mt-5">
                                    <h6>Our headquarters</h6>
                                    <div className="d-flex flex-row align-items-start justify-content-start w-100 gap-2">
                                        <h6>< FaLocationDot /> </h6> <h6>
                                            <a
                                                href="https://www.google.com/maps/place/Kaiserswerther+Str.+135,+40474+D%C3%BCsseldorf,+Germany/@51.2456278,6.7672824,17z/data=!3m1!4b1!4m6!3m5!1s0x47b8c9f01ec81eb7:0x6364618294734dc5!8m2!3d51.2456278!4d6.7698573!16s%2Fg%2F11c5bw0ls3?entry=ttu&g_ep=EgoyMDI1MDQwOS4wIKXMDSoJLDEwMjExNDU1SAFQAw%3D%3D"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ textDecoration: 'none', color: '#fff' }}
                                            >
                                                kaiserwerther strabe 135, Dusseldorf, Germany
                                            </a>
                                        </h6>

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}
            {/* 
            <section className="w-100 mb-5 mt-4 pb-5">
                <div className="container">
                    <div className="row w-100">
                        <div className="col-md-7">
                            <div className="d-flex flex-column align-items-start justify-content-start w-100">
                                <div className="home-heading w-100 d-flex align-items-start justify-content-start">
                                    <h2>Have any questions?</h2>
                                </div>
                                <h4 className="question-h4 mt-4 mb-4">We are just one click away</h4>
                                <p className="para-question text-start mb-4">
                                    Join our platform to connect with global customers and expand your logistics business Our platform is designed to streamline cross-border shipping by linking you with reliable providers who offer consistent, transparent, and timely service around the globe.
                                </p>
                                <div className="d-flex flex-row align-items-center justify-content-between w-100">
                                    <div className="d-flex flex-row align-items-center justify-content-start question-call-email w-100 gap-4">
                                        <h5>Call Us</h5>
                                        <h6><IoCall />  <span className="text-dark">+49 176 60906264</span></h6>
                                    </div>
                                    <div className="d-flex flex-row align-items-center justify-content-start question-call-email w-100 gap-4">
                                        <h5>Email us:</h5>
                                        <h6><MdEmail />  <a href="mailto:info@novibiz.com"
                                            style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}><span className="text-dark">info@novibiz.com</span></a></h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-5">
                            <div className="w-100 question-image">
                                <img src="/Images/home-footer.jpg" alt="image" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="footer-bottom w-100">
                <div className="container">
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                        <div className="d-flex flex-column align-items-start justify-content-start">
                            <img src="/Images/novibiz/fulllogo_transparent_nobuffer.png" height='80px' alt="Logo" />
                        </div>

                        <div className="d-flex flex-column text-start align-items-start justify-content-start footer-list">
                            <h4 className="mb-3">Company</h4>
                            <ul>
                                <li onClick={() => navigate('/')}>Home</li>
                                <li onClick={() => navigate('/about_us')}>About Us</li>
                                <li onClick={() => navigate('/companies_list')}>Company List</li>
                                <li onClick={() => navigate('/offers')}>Offers</li>
                                <li onClick={() => navigate('/')}>Contact Us</li>
                            </ul>
                        </div>

                        <div className="d-flex flex-column text-start align-items-start justify-content-start footer-list">
                            <h4 className="mb-3">Support</h4>
                            <ul>
                                <li>Term & Conditions</li>
                                <li>Privacy Policy</li>
                                <li>Refund Policy </li>
                            </ul>
                        </div>

                        <div className="d-flex flex-column text-start align-items-start justify-content-start footer-list">
                            <h4 className="mb-3">Follow Us</h4>
                            <div className="d-flex flex-row align-items-start justify-content-center gap-3">
                                <img src="/Images/icons8-instagram-48.png" height="30px" alt="Instagram" />
                                <img src="/Images/icons8-facebook-48.png" height="30px" alt="Instagram" />
                            </div>
                        </div>

                    </div>
                    <div className="d-flex w-100 align-items-center justify-content-center text-light mt-4 gap-2">
                        <p style={{ fontSize: '12px' }}>Copyright © 2025 – 2026 Novibiz. All rights reserved.</p>

                    </div>
                </div>

            </section> */}
            {/* <section className="faq-wrapper">
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
            </section> */}

            <div className="w-100 mt-5">
                <Footer />
            </div>
        </div>
    )
}

export default Home;