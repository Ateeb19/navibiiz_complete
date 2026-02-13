import React, { useState } from "react";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import { HiMiniRectangleStack } from "react-icons/hi2";
import { FaBoxOpen } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const How_it_works = () => {
    const userRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [open2, setOpen2] = useState(false);
    const canOpenGroupage = token ? userRole !== 'admin' : true;

    return (
        <>
            <div className="d-flex flex-column align-items-center justify-content-center  mt-5 pt-5">
                <div className=" d-flex justify-content-center w-100">
                    <Navbar />
                </div>

                <div className="container mt-5" id="how-it-works">
                    <div className="d-flex flex-column justify-content-center align-items-center w-100">
                        <div className="d-flex align-items-start justify-content-start w-100 mb-4">
                            <div className="home-heading text-center w-100 w-md-60">
                                <h2>How It Works: Simple & Secure Shipping in Four Easy Steps</h2>
                            </div>
                        </div>

                        <div className="d-flex flex-column justify-content-center align-items-center w-100">
                            <div className="row w-100 mb-4 gy-4">
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
                                            <h5>Receive the transporter information</h5>
                                        </div>
                                        <p>Receive complete transporter details including contact information, and pickup schedule for smooth coordination.</p>
                                        {/* <p>Securely book your shipment, receive tracking details, and monitor your package from pickup to delivery.</p> */}
                                    </div>
                                    <div className="step-image d-flex justify-content-center">
                                        <img src="/Images/home_img01.jpg" alt="step4" className="img-fluid" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="about-btn d-flex w-100 align-items-center justify-content-center mt-5 w-100">
                            <div
                                className="how-groupage-btn position-relative d-inline-block"
                                // onMouseEnter={() => canOpenGroupage && setOpen2(true)}
                                // onMouseLeave={() => canOpenGroupage && setOpen2(false)}
                                onMouseEnter={() => {
                                    if (!canOpenGroupage) return;
                                    setOpen2(true);
                                }}

                                onMouseLeave={() => {
                                    if (!canOpenGroupage) return;
                                    setOpen2(false);
                                }}
                            >
                                <button
                                    // onClick={() => canOpenGroupage && setOpen2(!open2)}
                                    // disabled={!canOpenGroupage}
                                    onClick={() => {
                                        if (!canOpenGroupage) return;
                                        setOpen2(!open2);
                                    }}
                                    disabled={!canOpenGroupage}
                                    className="btn btn-primary px-4 py-2 w-100"
                                >
                                    Start shipping your products
                                </button>

                                {open2 && canOpenGroupage && (
                                    <div
                                        className="dropdown-menu dropdown-menu-home d-flex flex-column align-items-center gap-1 text-start show"
                                        style={{
                                            width: '100%',
                                            position: 'absolute',
                                            top: '100%',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            zIndex: 1000
                                        }}
                                    >
                                        <button
                                            onClick={() => { navigate('/send_groupage/item'); setOpen2(false); }}
                                            className="btn groupage-btn-home w-100 m-0 p-2"
                                        >
                                            <HiMiniRectangleStack className="fs-5 me-1" /> Send Items
                                        </button>

                                        <button
                                            onClick={() => { navigate('/send_groupage/box'); setOpen2(false); }}
                                            className="btn groupage-btn-home w-100 m-0 p-2"
                                        >
                                            <FaBoxOpen className="fs-5 me-1" /> Send Boxes
                                        </button>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>

                <div className="w-100 mt-5">
                    <Footer />
                </div>
            </div>
        </>
    )
}

export default How_it_works;