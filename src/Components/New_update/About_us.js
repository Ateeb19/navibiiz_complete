import React, { useState } from "react";
import Alert from "../alert/Alert_message";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const About_us = () => {
    const [showAlert, setShowAlert] = useState(false);
    const [alert_message, setAlert_message] = useState('');
    return (
        <div className="d-flex flex-column align-items-center justify-content-center">
            {showAlert && <Alert message={alert_message} onClose={() => setShowAlert(false)} />}
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
                                <h1>About Us</h1>
                                <p>
                                    Connect with reliable logistics providers to transport goods across borders seamlessly. Our platform ensures efficient and hassle-free global shipping tailored to your needs
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className=" w-100 mt-5">
                <div className="about-wrapper w-100 mb-4">
                    <div className="d-flex flex-row align-items-between justify-content-start w-100">
                        <div className="p-4 px-3" style={{ width: '50%' }}>
                            <div className="about-img">
                                <img className="" src='/Images/about_up01.png' alt="" />
                            </div>
                        </div>

                        <div className="p-4 px-3 d-flex flex-column about-text" style={{ width: '50%', paddingTop: '10px' }}>
                            <div className="title-head text-start">
                                <h3>Our Core Values</h3>
                            </div>
                            <p className="pe-5">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.</p>
                        </div>

                    </div>
                </div>
            </section>

            <section className=" w-100">
                <div className="about-wrapper w-100 mb-4">
                    <div className="d-flex flex-row align-items-between justify-content-start w-100 px-5">
                    <div className="p-4 px-3 d-flex flex-column about-text" style={{ width: '50%', paddingTop: '10px' }}>
                            <div className="title-head text-start">
                                <h3>Our Mission</h3>
                            </div>
                            <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.</p>
                        </div>

                        <div className="p-4 px-3" style={{ width: '50%' }}>
                            <div className="about-img">
                                <img className="" src='/Images/about_us02.png' alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className=" w-100">
                <div className="about-wrapper w-100 mb-4">
                    <div className="d-flex flex-row align-items-between justify-content-start w-100">
                        <div className="p-4 px-3" style={{ width: '50%' }}>
                            <div className="about-img">
                                <img className="" src='/Images/about_us03.png' alt="" />
                            </div>
                        </div>

                        <div className="p-4 px-3 d-flex flex-column about-text" style={{ width: '50%', paddingTop: '10px' }}>
                            <div className="title-head text-start">
                                <h3>Our Vision</h3>
                            </div>
                            <p className="pe-5">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.</p>
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