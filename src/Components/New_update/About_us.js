import React from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { CiCalendarDate } from "react-icons/ci";
import { LiaSearchLocationSolid } from "react-icons/lia";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";



const About_us = () => {
    const navigate = useNavigate();
    return (
        <div className="d-flex flex-column align-items-center justify-content-center  mt-5 pt-5">
            <div className='navbar-wrapper'>
                <div className=" d-flex justify-content-center w-100">
                    <Navbar />
                </div>
            </div>

            <section className="about-wrap">
                <div className="container">
                    <div className="d-flex flex-column justify-content-center align-items-center text-light px-3">
                        <div className="text-center mt-3 w-100">
                            <div className="about-wrap-head">
                                <h1>About Us</h1>
                                <p>
                                    Making Global Shipping Simple, Secure & Transparent
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="w-100 px-5">

                <section className="w-100 mt-5 mb-5">
                    <div className="container about-wrapper">
                        <div className="d-flex flex-column flex-lg-row gap-4 justify-content-start align-items-start w-100">
                            {/* Image Block */}
                            <div className="w-100 about-image pt-5">
                                <div className="about-img d-flex justify-content-start">
                                    <img src="/Images/about_group_0001.png" alt="About" />
                                </div>
                            </div>

                            {/* Text Block */}
                            <div className="about-text d-flex flex-column pt-3 pt-lg-4">
                                <div className="about-title-head text-start">
                                    <h3>Reliable Logistic & Transport Solutions That Saves Your Time!</h3>
                                </div>
                                <p>
                                    At Novibiz, we believe international shipping should be easy, affordable, and stress-free—
                                    whether you're a small business expanding abroad or an individual sending packages across
                                    borders. We're a tech-powered logistics platform that connects customers with reliable,
                                    vetted shipping providers to deliver the best shipping experience from start to finish.
                                </p>

                                <div className="d-flex flex-column flex-sm-row gap-4 gap-lg-5 justify-content-between w-100 mt-3">
                                    <div className="d-flex flex-row align-items-start justify-content-start about-track text-start gap-3">
                                        <CiCalendarDate />
                                        <h3>Schedule<br /> Booking</h3>
                                    </div>

                                    <div className="d-flex flex-row align-items-start justify-content-start about-track text-start gap-3">
                                        <LiaSearchLocationSolid />
                                        <h3>Track <br />Shipment</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="w-100 mission-wrappr">
                    <div className="container px-4">
                        <div className="d-flex flex-column align-items-start justify-content-start w-100 our-mission-wrap">
                            <h3>Our Mission</h3>
                            <div className="row our-mission text-start p-0 m-0">
                                {/* Text Block */}
                                <div className="col-12 col-lg-6 d-flex flex-column justify-content-start align-items-start p-4">
                                    <p>
                                        To simplify global logistics by offering a transparent, competitive, and reliable platform
                                        where customers can compare, book, and manage shipments in just a few clicks.
                                    </p>
                                    <div className="our-mission-btn px-4">
                                        <button className="d-flex align-items-center justify-content-center gap-2" onClick={() => navigate('/register_company')}>
                                            Register your company <HiOutlineArrowNarrowRight />
                                        </button>
                                    </div>
                                </div>

                                {/* Image Block */}
                                <div className="col-12 col-lg-6 d-flex justify-content-center justify-content-lg-start mt-4 mt-lg-0">
                                    <div className="about-footer-img">
                                        <img src="/Images/about_group_00002.png" alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <section className="w-100 mt-5 pt-5 mb-5 pb-5">
                <div className="about-choose container-fluid px-3 px-md-5 py-5 overflow-hidden">
                    <div className="text-start">
                        <h3>Why Choose Nobiviz?</h3>
                    </div>
                    <div className="row gx-3 gy-4 mt-4">
                        {/* Box 1 */}
                        <div className="col-12 col-md-6 col-lg-3 d-flex">
                            <div className="about-footer-wrap w-100">
                                <h6>Competitive Price Comparison</h6>
                                <p>
                                    Novibiz enables you to compare shipping offers from multiple verified logistics providers,
                                    helping you find the most cost-effective option tailored to your needs.
                                </p>
                            </div>
                        </div>

                        {/* Box 2 */}
                        <div className="col-12 col-md-6 col-lg-3 d-flex">
                            <div className="about-footer-wrap w-100">
                                <h6>Trusted Network of Logistics Partners</h6>
                                <p>
                                    Gain access to a curated network of reliable shipping Transporter operating across Europe and
                                    internationally, ensuring secure and timely deliveries.
                                </p>
                            </div>
                        </div>

                        {/* Box 3 */}
                        <div className="col-12 col-md-6 col-lg-3 d-flex">
                            <div className="about-footer-wrap w-100">
                                <h6>Flexible Pickup Arrangements</h6>
                                <p>
                                    Some logistics partners may offer pickup services depending on availability. These arrangements
                                    are managed directly between the customer and the carrier.
                                </p>
                            </div>
                        </div>

                        {/* Box 4 */}
                        <div className="col-12 col-md-6 col-lg-3 d-flex">
                            <div className="about-footer-wrap w-100">
                                <h6>Smart Directory Access (Novibiz Yellow Pages)</h6>
                                <p>
                                    Easily locate freight forwarders and customs agents through our business directory — ideal for
                                    shipping vehicles, large packages, or specialized goods.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>




            <div className="w-100">
                <Footer />
            </div>
        </div>
    )
}


export default About_us;