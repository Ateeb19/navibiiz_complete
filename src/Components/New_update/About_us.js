import React from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { CiCalendarDate } from "react-icons/ci";
import { LiaSearchLocationSolid } from "react-icons/lia";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";



const About_us = () => {
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

                <section className=" w-100 mt-5 mb-5">
                    <div className="about-wrapper w-100 mb-5 px-5">
                        <div className="d-flex flex-row align-items-betweem justify-content-start w-100">
                            <div className="d-flex flex-row align-items-start justify-content-start pt-5" style={{ width: '75%' }}>
                                <div className="about-img d-flex flex-row align-items-start justify-content-start ps-5 ms-5">
                                    <img className="" src='/Images/bg_image_home.jpg' alt="" />
                                </div>

                                <div className="about-img-2">
                                    <img className="" src='/Images/about_2_img.jpg' alt="" />
                                </div>
                            </div>

                            <div className=" d-flex flex-column about-text" style={{ width: '35%', paddingTop: '20px' }}>
                                <div className="about-title-head text-start">
                                    <h3>Reliable Logistic & Transport Solutions That Saves Your Time!</h3>
                                </div>
                                <p>At Novibiz, we believe international shipping should be easy, affordable, and stress-free-whether you're a small business expanding abroad or an individual sending packages across borders. We're a tech-powered logistics platform that connects customers with reliable, vetted shipping providers to deliver the best shipping experience from start to finish.</p>


                                <div className="d-flex flex-row gap-5 justify-content-between w-100 ">
                                    <div className="d-flex flex-row align-items-start justify-content-center about-track text-start gap-3">
                                        <CiCalendarDate />
                                        <h3>Schedule<br /> Booking</h3>
                                    </div>

                                    <div className="d-flex flex-row align-items-start justify-content-center about-track text-start gap-3">
                                        <LiaSearchLocationSolid />
                                        <h3>Track <br />Shipment</h3>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </section>

                <section className="w-100 mission-wrappr ">
                    <div className="d-flex flex-column align-items-start justify-content-start w-100 our-mission-wrap px-5">
                        <h3>Our Mission</h3>
                        <div className="d-flex flex-row justify-content-between align-itmes-between text-start p-4 our-mission">
                            <div className="-flex flex-column justify-content-start align-itmes-start text-start p-4 w-50">
                                <p>To simplify global logistics by offering a transparent, competitive, and reliable platform where customers can compare, book, and manage shipments in just a few clicks.</p>
                                <div className="our-mission-btn px-4">
                                    <button className="d-flex align-items-center justify-content-center gap-2">Register your compmany < HiOutlineArrowNarrowRight /></button>
                                </div>
                            </div>


                            <div className="w-50">
                                <div className="about-footer-img d-flex flex-row align-items-start justify-content-start ps-5 ms-5">
                                    <img className="" src='/Images/about_mission01.jpg' alt="" />
                                </div>

                                <div className="about-footer-img-2">
                                    <img className="" src='/Images/about_mission02.jpg' alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>


            <section className="w-100 mt-5 pt-5 mb-5 pb-5">
                <div className="d-flex flex-column align-items-start justify-content-start w-100 about-choose px-5 py-5">
                    <div className="px-5">
                        <h3>Why Choose Nobiviz?</h3>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between px-5">
                        <div className="d-flex flex-column align-items-start justify-content-center text-start about-footer-wrap">
                            <h6>Trusted Partners Only</h6>
                            <p>We work exclusively with licensed, reliable logistics providers known for their quality service and global reach.</p>
                        </div>
                        <div className="d-flex flex-column align-items-start justify-content-center text-start about-footer-wrap">
                            <h6>Competitive Pricing</h6>
                            <p >Our marketplace model ensures you receive the best value through instant, side-by-side quotes.</p>
                        </div>
                        <div className="d-flex flex-column align-items-start justify-content-center text-start about-footer-wrap">
                            <h6>Technology-Driven</h6>
                            <p>From smart forms to live tracking, we leverage technology to keep you informed and in control.</p>
                        </div>
                        <div className="d-flex flex-column align-items-start justify-content-center text-start about-footer-wrap">
                            <h6>Trusted Partners Only</h6>
                            <p>We work exclusively with licensed, reliable logistics providers known for their quality service and global reach.</p>
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