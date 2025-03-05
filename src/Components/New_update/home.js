import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { CountrySelect } from "react-country-state-city";
import { Form } from "react-bootstrap";
import Navbar from "../Navbar/Navbar";
import { BiSolidDetail } from "react-icons/bi";
import { IoLocationSharp } from "react-icons/io5";
import { FaTruckFast } from "react-icons/fa6";
import { MdDeliveryDining } from "react-icons/md";
import Footer from "../../Footer/Footer";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Home = () => {
    const port = process.env.REACT_APP_SECRET;
    // console.log(port);
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole')
    const displayCompany = () => {
        // localStorage.setItem('companyInfo');
        axios.get(`${port}/company/display_company`)
        .then((response) => {
            // console.log(response.data.message);
            localStorage.setItem('companyInfo', JSON.stringify(response.data.message));
        }).catch((err) => {console.log('error', err)});
    }
    useEffect(() => {
      displayCompany();
    },[])
    const [company_info, setCompany_info] = useState([]);
    const companies = () => {
        if (localStorage.getItem('companyInfo').length > 0) {
            setCompany_info(JSON.parse(localStorage.getItem('companyInfo')));
        }
    }
    useEffect(() => {
        companies();
    }, [])
    const last_companies = company_info.slice(-4);
    console.log(last_companies);
    const navigate = useNavigate();

    const settings = {
        dots: true,
        infinite: true,
        speed: 100,
        slidesToShow: 2.7,
        slidesToScroll: 1,
        appendDots: dots => (
            <ul style={{ margin: '0px', padding: '10px' }}> {dots} </ul>
        ),
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2.7,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 1.7,
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
    return (
        <div className="d-flex flex-column align-items-center justify-content-center">
            <div className=" d-flex justify-content-center w-100">
                <Navbar />
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

            <div className="container" style={{ marginTop: "-3%" }}>
                <div className="row bg-light rounded-3 p-3 shadow border border-3">
                    <div className="col-12 col-md-3 border-end border-3 p-3 text-center text-md-start">
                        <h5>Pick Up</h5>
                        <span>Search Country</span>
                    </div>
                    <div className="col-12 col-md-3 border-end border-3 p-3 text-center text-md-start">
                        <h5>Delivery</h5>
                        <span>Search Country</span>
                    </div>
                    <div className="col-12 col-md-3 p-3 text-center text-md-start">
                        <h5>Service</h5>
                        <span>Select Service</span>
                    </div>
                    <div className="col-12 col-md-3 p-3 text-center">
                        <button className="btn btn-light border border-danger text-danger w-100">
                            Search Shipping Companies
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mt-4">
                <div className="row g-4 text-center">
                    <div className="col-12 col-sm-6 col-md-3">
                        <div className="d-flex flex-column align-items-center">
                            <span style={{ fontSize: '3rem', color: 'tomato' }}><BiSolidDetail /></span>
                            <h5>Easy Shipment Details</h5>
                            <p className="text-secondary">Simply provide your shipment details to get a tailored list of logistics companies</p>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-3">
                        <div className="d-flex flex-column align-items-center">
                            <span style={{ fontSize: '3rem', color: 'tomato' }}><IoLocationSharp /></span>
                            <h5>Location-based Filtering</h5>
                            <p className="text-secondary">Filter shipping companies by your destination and origin for precise results</p>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-3">
                        <div className="d-flex flex-column align-items-center">
                            <span style={{ fontSize: '3rem', color: 'tomato' }}><FaTruckFast /></span>
                            <h5>Shipping Methods</h5>
                            <p className="text-secondary">Choose your preferred shipping method and connect with the right partners</p>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-md-3">
                        <div className="d-flex flex-column align-items-center">
                            <span style={{ fontSize: '3rem', color: 'tomato' }}><MdDeliveryDining /></span>
                            <h5>Pickup Service</h5>
                            <p className="text-secondary">Shipping companies will send their professionals to pick up your goods from your location</p>
                        </div>
                    </div>
                </div>
            </div>


            <div className="d-flex flex-column justify-content-center align-items-center ps-3 w-100 mt-5">
                <div className="text-start mb-4">
                    <strong className="fs-4">Newly Added Companies</strong>
                </div>

                <div className="container">
                    <div className="row justify-content-center">
                        {last_companies.map((company, index) => (
                            <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                <div className="p-3 border rounded-4 border-3 d-flex flex-column align-items-start">
                                    <div className="rounded-circle overflow-hidden" style={{ width: '30%', maxWidth: '130px', aspectRatio: '1/1' }}>
                                        <img
                                            src={company.logo ? company.logo : "https://png.pngtree.com/png-clipart/20230915/original/pngtree-global-icon-for-web-design-logo-app-isolated-vector-vector-png-image_12189325.png"}
                                            alt="Logo"
                                            className="w-100 h-100 object-fit-cover"
                                        />
                                    </div>
                                    <h5>{company.company_name}</h5>
                                    <span className="text-secondary">4.5 (20 Ratings)</span>
                                    <p className="text-secondary text-start mt-1">{company.description.split(" ").slice(0, 10).join(" ") + "..."}</p>
                                    <span className="text-danger" style={{ cursor: "pointer" }}>View Details</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button className="btn text-light px-4 py-2 mt-4" onClick={() => navigate('/companies_list')} style={{ backgroundColor: 'tomato' }}>
                    View All
                </button>
            </div>


            <div className="container mt-5">
                <div className="text-center mb-4">
                    <strong className="fs-3">How It Works: Simple & Secure Shipping in Four Easy Steps</strong>
                </div>

                <div className="row w-75 mx-auto align-items-center mb-4">
                    <div className="col-12 col-md-6 order-2 order-md-2 text-start">
                        <h4 style={{ color: 'tomato' }}>1</h4>
                        <h5>Provide Your Shipment Details</h5>
                        <p className="text-secondary">Fill out a simple form with your shipment details, including type of goods, origin, and destination.</p>
                    </div>
                    <div className="col-12 col-md-6 order-1 order-md-1 ">
                        <img src="/Images/image.png" alt="Step 1" className="img-fluid w-100" />
                    </div>
                </div>

                <div className="row w-75 mx-auto align-items-center mb-4">
                    <div className="col-12 col-md-6 order-1 order-md-1 text-start">
                        <h4 style={{ color: 'tomato' }}>2</h4>
                        <h5>Receive Offers from Multiple Companies</h5>
                        <p className="text-secondary">Get competitive quotes from trusted shipping providers tailored to your needs.</p>
                    </div>
                    <div className="col-12 col-md-6 order-2 order-md-2 ">
                        <img src="/Images/image copy.png" alt="Step 2" className="img-fluid w-100" />
                    </div>
                </div>

                <div className="row w-75 mx-auto align-items-center mb-4">
                    <div className="col-12 col-md-6 order-1 order-md-1 ">
                        <img src="/Images/image copy 2.png" alt="Step 3" className="img-fluid w-100" />
                    </div>
                    <div className="col-12 col-md-6 order-2 order-md-2 text-start">
                        <h4 style={{ color: 'tomato' }}>3</h4>
                        <h5>Choose the Best Offer</h5>
                        <p className="text-secondary">Compare pricing, delivery times, and services to select the most suitable option.</p>
                    </div>
                </div>

                <div className="row w-75 mx-auto align-items-center mb-4">
                    <div className="col-12 col-md-6 order-1 order-md-1 text-start">
                        <h4 style={{ color: 'tomato' }}>4</h4>
                        <h5>Make Payment & Get Provider Details</h5>
                        <p className="text-secondary">Securely complete your booking and receive the provider’s details. The shipping company will contact you to confirm pickup arrangements and provide the estimated delivery timeline.</p>
                    </div>
                    <div className="col-12 col-md-6 order-2 order-md-2">
                        <img src="/Images/image copy 3.png" alt="Step 4" className="img-fluid w-100" />
                    </div>
                </div>

                <div className="text-center mt-4">
                    <button className="btn text-light px-4 py-2" style={{ backgroundColor: "tomato" }}>
                        Start Shipping your products
                    </button>
                </div>
            </div>

            <div className="d-flex flex-column justify-content-center align-items-center ps-3 w-100 mt-5">
                <div className="text-start mb-4">
                    <strong className="fs-4">Recent Offers Posted</strong>
                </div>

                <div className="container">
                    <div className="row justify-content-center">
                        {last_companies.map((company, index) => (
                            <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                <div className="p-3 border rounded-4 border-3 d-flex flex-column align-items-start">
                                    {/* Company Logo */}
                                    <div className="d-flex align-items-start mb-3">
                                        <img
                                            src={company.logo ? company.logo : "https://png.pngtree.com/png-clipart/20230915/original/pngtree-global-icon-for-web-design-logo-app-isolated-vector-vector-png-image_12189325.png"}
                                            alt="Logo"
                                            className="rounded-circle"
                                            style={{
                                                backgroundColor: 'rgb(175, 175, 175)',
                                                width: "60px",
                                                height: "60px",
                                                objectFit: "cover"
                                            }}
                                        />
                                    </div>

                                    {/* Company Details */}
                                    <h5>{company.company_name}</h5>
                                    <span className="text-secondary">4.5 (20 Ratings)</span>
                                    <p className="text-secondary text-start mt-1">{company.description.split(" ").slice(0, 10).join(" ") + "..."}</p>
                                    <span className="text-danger" style={{ cursor: "pointer" }}>View Details</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button className="btn text-light px-4 py-2 mt-4" style={{ backgroundColor: 'tomato' }}>
                    View All
                </button>
            </div>

            <div className="container mt-5">
                <div className="text-center mb-4">
                    <strong className="fs-3">How It Works: Effortless Shipping in Four Easy Steps</strong>
                </div>

                <div className="row w-75 mx-auto align-items-center mb-4">
                    <div className="col-12 col-md-6 order-2 order-md-2 text-start">
                        <h4 style={{ color: 'tomato' }}>1</h4>
                        <h5>Provide Your Shipment Details</h5>
                        <p className="text-secondary">Fill out a simple form with your shipment details, including type of goods, origin, and destination</p>
                    </div>
                    <div className="col-12 col-md-6 order-1 order-md-1 ">
                        <img src="/Images/image.png" alt="Step 1" className="img-fluid w-100" />
                    </div>
                </div>

                <div className="row w-75 mx-auto align-items-center mb-4">
                    <div className="col-12 col-md-6 order-1 order-md-1 text-start">
                        <h4 style={{ color: 'tomato' }}>2</h4>
                        <h5>Get Matched with Trusted Companies</h5>
                        <p className="text-secondary">Receive a curated list of trusted shipping companies that can handle your shipment</p>
                    </div>
                    <div className="col-12 col-md-6 order-2 order-md-2 ">
                        <img src="/Images/image copy.png" alt="Step 2" className="img-fluid w-100" />
                    </div>
                </div>

                <div className="row w-75 mx-auto align-items-center mb-4">
                    <div className="col-12 col-md-6 order-1 order-md-1 ">
                        <img src="/Images/image copy 2.png" alt="Step 3" className="img-fluid w-100" />
                    </div>
                    <div className="col-12 col-md-6 order-2 order-md-2 text-start">
                        <h4 style={{ color: 'tomato' }}>3</h4>
                        <h5>Choose Your Preferred Company</h5>
                        <p className="text-secondary">Review the list of companies and select the one that best fits your needs based on their services</p>
                    </div>
                </div>

                <div className="row w-75 mx-auto align-items-center mb-4">
                    <div className="col-12 col-md-6 order-1 order-md-1 text-start">
                        <h4 style={{ color: 'tomato' }}>4</h4>
                        <h5>Contact the Company Directly</h5>
                        <p className="text-secondary">The shipping company will contact you to confirm pickup arrangements and provide the estimated delivery timeline</p>
                    </div>
                    <div className="col-12 col-md-6 order-2 order-md-2">
                        <img src="/Images/image copy 3.png" alt="Step 4" className="img-fluid w-100" />
                    </div>
                </div>

                <div className="text-center mt-4">
                    <button className="btn text-light px-4 py-2" style={{ backgroundColor: "tomato" }}>
                        Start Shipping your products
                    </button>
                </div>
            </div>

            <div className="w-100 d-flex flex-wrap justify-content-between align-items-center p-4 mt-5"
                style={{ backgroundColor: "#0044BC" }}>
                <div className="flex-grow-1 text-light text-center">
                    <strong className="fs-4">100+</strong>
                    <p>Verified Logistics Companies</p>
                </div>
                <div className="flex-grow-1 text-light text-center">
                    <strong className="fs-4">100+</strong>
                    <p>Countries Covered</p>
                </div>
                <div className="flex-grow-1 text-light text-center">
                    <strong className="fs-4">10,000+</strong>
                    <p>Shipments Processed</p>
                </div>
                <div className="flex-grow-1 text-light text-center">
                    <strong className="fs-4">98%</strong>
                    <p>Customer Satisfaction Rate</p>
                </div>
            </div>

            <div className="d-flex flex-column justify-content-center align-items-center w-100 mt-5">
                <strong className="fs-4">Real stories, Real impact</strong>

                <div className="w-75 mx-auto py-3 px-3">
                    <Slider {...settings}>
                        {profiles.map((profile, index) => (
                            <div key={index} className="p-4">
                                <div className="bg-white shadow-lg rounded-3 w-100 p-4 d-flex flex-column align-items-center text-center border">
                                    <img
                                        src={profile.img}
                                        alt={profile.name}
                                        style={{
                                            width: '40%',
                                            height: '5rem'
                                        }}
                                        className="rounded-circle mb-4 mt-2"
                                    />
                                    <p className="text-secondary ">{profile.description}</p>
                                    <h5 className="mb-2">{profile.name}</h5>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
            <div className="w-100 mt-5">
                <Footer />
            </div>
        </div>
    )
}

export default Home;