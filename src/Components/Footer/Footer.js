import React, { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoLogoWhatsapp } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { IoCall } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import '../../assets/css/style.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Alert from "../alert/Alert_message";

const Footer = () => {
    const port = process.env.REACT_APP_SECRET;

    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false);
    const [alert_message, setAlert_message] = useState('');

    const [user_name, setUser_name] = useState('');
    const [email_id, setEmail_id] = useState('');
    const [contact_number, setContact_number] = useState('');
    const [country, setCountry] = useState('');
    const [message, setmessage] = useState('');

    const handle_sumbit = () => {
        if (!user_name || !email_id || !contact_number || !country || !message) {
            setShowAlert(true);
            setAlert_message('Please fill all the fieldes!');
            setTimeout(() => {
                setShowAlert(false);
            }, 2000);
            return;
        }
        const value = {
            user_name: user_name,
            email_id: email_id,
            contact_number: contact_number,
            country: country,
            message: message,
        }
        axios.post(`${port}/user/send_message`, value, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            console.log(response.data);
            setShowAlert(true);
            setAlert_message('Message send success');
            setTimeout(() => {
                setShowAlert(false);
                setUser_name('');
                setEmail_id('');
                setContact_number('');
                setCountry('');
                setmessage('');
            }, 2000);
        })
            .catch((err) => { console.log(err) });
    }
    return (
        <>
            <section className="contact-form-wrapper">
                {showAlert && <Alert message={alert_message} onClose={() => setShowAlert(false)} />}
                <div className="container">
                    <div className="contact-form-wrap">
                        <div className="row mt-2 w-100">
                            <div className="col-12 col-md-5 d-flex flex-column p-3 p-md-4 text-white text-start rounded-4 gap-3 mb-3 mb-md-0" style={{ backgroundColor: '#0044BC' }}>
                                <strong className="mb-2 mb-md-3 fs-5">Contact Information</strong>
                                <div>
                                    <p className="mb-1">Chat with us</p>
                                    <p><IoLogoWhatsapp className="me-2 text-danger" />0721 / 170 5522</p>
                                </div>
                                <div>
                                    <p className="mb-1">Email Us</p>
                                    <p><MdEmail className="me-2 text-danger" />support@navibiiz.de</p>
                                </div>
                                <div>
                                    <p className="mb-1">Call Us</p>
                                    <p><IoCall className="me-2 text-danger" />0721 / 170 5522</p>
                                </div>
                                <div>
                                    <p className="mb-1">Our Headquarters</p>
                                    <p><FaLocationDot className="me-2 text-danger" />Demo Address</p>
                                </div>
                            </div>
                            <div className="col-12 col-md-7 p-3 ps-4 text-start">
                                <h4>Get in Touch</h4>

                                <div className="row">
                                    <div className="col-12 col-md-6">
                                        <label className="input-label">Full Name <span className="text-danger">*</span></label>
                                        <input type="text" className="contact-field" value={user_name} onChange={(e) => setUser_name(e.target.value)} placeholder="Enter your full name" />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className="input-label">Email ID <span className="text-danger">*</span></label>
                                        <input type="email" className="contact-field" value={email_id} onChange={(e) => setEmail_id(e.target.value)} placeholder="Enter your email id" />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 col-md-6">
                                        <label className="input-label">Contact Number <span className="text-danger">*</span></label>
                                        <input type="tel" className="contact-field" value={contact_number} onChange={(e) => setContact_number(e.target.value)} placeholder="Enter your contact number" />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className="input-label">Country you Live <span className="text-danger">*</span></label>
                                        <input type="text" className="contact-field" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Enter your country" />
                                    </div>
                                </div>
                                <div className="">
                                    <label className="input-label">Message (if any)</label>
                                    <textarea className="contact-field" value={message} onChange={(e) => setmessage(e.target.value)} rows="4" placeholder="Type here . . ." style={{ resize: 'none' }}></textarea>
                                </div>
                                <button className="btn p-3 text-white w-100" style={{ backgroundColor: ' #FF5722' }} onClick={handle_sumbit}>SUBMIT</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="promo-wrapper">
                <div className="d-flex flex-column align-items-center mt-4 mt-md-5 text-white p-3 p-md-5 w-100" style={{ backgroundColor: "#0044BC" }}>
                    <div className="title-head">
                        <h2>Partner With Us and Grow Your Reach</h2>
                    </div>
                    <p className="">Join our platform to connect with global customers and expand your logistics business</p>
                    <button className="btn-register" onClick={() => navigate('/register_company')}>Register your Company</button>
                </div>
            </section>

            <section className="footer-wrapper">
                <div className="container">
                    <div className="footer-wrap">
                        <div className="d-flex flex-row">
                            <div className="col-12 col-md-3 footer-logo-wrap">
                                <img src="/Images/novibiz/fulllogo_nobuffer.jpg" alt="Novibiiz" onClick={() => navigate('/')} />
                            </div>

                            <div className="col-12 col-md-3">
                                <h3 >Company</h3>
                                <ul>
                                    <li>About Us</li>
                                    <li>Contact Us</li>
                                    <li>Privacy Policy</li>
                                    <li>Terms of use</li>
                                    <li>Code of conduct</li>
                                </ul>
                            </div>

                            <div className="col-12 col-md-3">
                                <h3 >Resources</h3>
                                <ul>
                                    <li>Blog</li>
                                    <li>Company Profiles</li>
                                    <li>Partner with us</li>
                                </ul>
                            </div>

                            <div className="col-12 col-md-3">
                                <h3>Follow Us</h3>
                                <ul className="follow">
                                    <li> <FaFacebook /></li>
                                    <li><FaInstagramSquare /></li>
                                    <li><FaLinkedin /></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="w-100 text-center text-secondary mt-4">
                        <p>© 2025 Navibiiz. All Rights Reserved.</p>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Footer;