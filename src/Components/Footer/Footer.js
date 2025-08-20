import React, { useRef, useState } from "react";
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
import { useAlert } from "../alert/Alert_message";

const Footer = () => {
    const port = process.env.REACT_APP_SECRET;
    const { showAlert } = useAlert();
    const navigate = useNavigate();
    const sectionRef = useRef(null);
    const handleScroll = () => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    const [user_name, setUser_name] = useState('');
    const [email_id, setEmail_id] = useState('');
    const [contact_number, setContact_number] = useState('');
    const [country, setCountry] = useState('');
    const [message, setmessage] = useState('');

    const handle_sumbit = () => {
        if (!user_name || !email_id || !contact_number || !country || !message) {
            showAlert('Please fill all the fieldes!');
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
            showAlert('Message send success');
            setUser_name('');
            setEmail_id('');
            setContact_number('');
            setCountry('');
            setmessage('');
        })
            .catch((err) => { console.log(err) });
    }
    return (
        <>

            <section className="w-100 mb-5 mt-4 pb-5" ref={sectionRef} >
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
                                <div className="d-flex flex-row align-items-center justify-content-between w-100 text-start">
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
                            <img src="/Images/novibiz/fulllogo_transparent_nobuffer.png" className="footer_img" alt="Logo" />
                        </div>

                        <div className="d-flex flex-column text-start align-items-start justify-content-start footer-list">
                            <h4 className="mb-3">Company</h4>
                            <ul>
                                <li onClick={() => navigate('/')}>Home</li>
                                <li onClick={() => navigate('/about_us')}>About Us</li>
                                <li onClick={() => navigate('/transporters_list')}>Company List</li>
                                <li onClick={() => navigate('/offers')}>Offers</li>
                                <li onClick={() => navigate('/contact_us')}>Contact Us</li>
                            </ul>
                        </div>

                        <div className="d-flex flex-column text-start align-items-start justify-content-start footer-list">
                            <h4 className="mb-3">Support</h4>
                            <ul>
                                <li onClick={() => navigate('/terms_conditions')}>Term & Conditions</li>
                                <li onClick={() => navigate('/privacy_policy')}>Privacy Policy</li>
                                <li onClick={() => navigate('/refund_policy')}>Refund Policy </li>
                            </ul>
                        </div>

                        <div className="d-flex flex-column text-start align-items-start justify-content-start footer-list">
                            <h4 className="mb-3">Follow Us</h4>
                            <div className="d-flex flex-wrap align-items-center justify-content-start gap-3">
                                <a href="https://www.instagram.com/novibiz1/" target="_blank" rel="noopener noreferrer">
                                    <img src="/Images/icons8-instagram-48.png" height="30px" alt="Instagram" />
                                </a>
                                <a href="https://www.facebook.com/people/Novibiz/61575119008770/?rdid=yNdJTlpnqoJ4ZeN0&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1EjDMKXW6B%2F" target="_blank" rel="noopener noreferrer">
                                    <img src="/Images/icons8-facebook-48.png" height="30px" alt="Facebook" />
                                </a>
                                <a href="https://www.linkedin.com/company/107430950/admin/page-posts/published/" target="_blank" rel="noopener noreferrer">
                                    <img src="/Images/icons8-linkedin-48.png" height="30px" alt="LinkedIn" />
                                </a>

                            </div>
                        </div>


                    </div>
                    <div className="d-flex w-100 align-items-center justify-content-center text-light mt-4 gap-2">
                        <p style={{ fontSize: '12px' }}>Copyright © 2025 – 2026 Novibiz. All rights reserved.</p>

                    </div>
                </div>

            </section>
            {/* <section className="contact-form-wrapper">
                <div className="container">
                    <div className="contact-form-wrap">
                        <div className="row mt-2 w-100">
                            <div className="col-12 col-md-5 d-flex flex-column p-3 p-md-4 text-white text-start rounded-4 gap-3 mb-3 mb-md-0" style={{ backgroundColor: '#0044BC' }}>
                                <strong className="mb-2 mb-md-3 fs-5">Contact Information</strong>
                                <div>
                                    <p className="mb-1">Chat with us</p>
                                    <p><IoLogoWhatsapp className="me-2 " style={{ color: ' #de8316' }} />+49 176 60906264</p>
                                </div>
                                <div>
                                    <p className="mb-1">Email Us</p>
                                    <p>
                                        <MdEmail className="me-2" style={{ color: '#de8316' }} />
                                        <a
                                            href="mailto:info@novibiz.com"
                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                        >
                                            info@novibiz.com
                                        </a>
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-1">Call Us</p>
                                    <p><IoCall className="me-2" style={{ color: ' #de8316' }} />+49 176 60906264</p>
                                </div>
                                <div>
                                    <p className="mb-1">Our Headquarters</p>
                                    <p><FaLocationDot className="me-2 " style={{ color: ' #de8316' }} /><a
                                        href="https://www.google.com/maps/place/Kaiserswerther+Str.+135,+40474+D%C3%BCsseldorf,+Germany/@51.2456278,6.7672824,17z/data=!3m1!4b1!4m6!3m5!1s0x47b8c9f01ec81eb7:0x6364618294734dc5!8m2!3d51.2456278!4d6.7698573!16s%2Fg%2F11c5bw0ls3?entry=ttu&g_ep=EgoyMDI1MDQwOS4wIKXMDSoJLDEwMjExNDU1SAFQAw%3D%3D"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ textDecoration: 'none', color: '#fff' }}
                                    >
                                        Kaiserswerther Straße 135, Düsseldorf, Germany
                                    </a></p>
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
                                <button className="btn p-3 text-white w-100" style={{ backgroundColor: ' #de8316' }} onClick={handle_sumbit}>SUBMIT</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="promo-wrapper">
                <div className="d-flex flex-column align-items-center mt-4 mt-md-5 text-white p-3 p-md-5 w-100 text-center" style={{ backgroundColor: "#0044BC" }}>
                    <div className="title-head">
                        <h2>Partner With Us and Grow Your Reach</h2>
                    </div>
                    <p>Join our platform to connect with global customers and expand your logistics business</p>
                    <button className="btn-register" onClick={() => navigate('/register_company')}>Register your Company</button>
                </div>
            </section>

            <section className="footer-wrapper">
                <div className="container">
                    <div className="footer-wrap">
                        <div className="row">
                            <div className="col-12 col-md-3 footer-logo-wrap mb-3 mb-md-0">
                                <img src="/Images/novibiz/fulllogo_nobuffer.jpg" alt="Novibiiz" onClick={() => navigate('/')} className="img-fluid" />
                            </div>

                            <div className="col-12 col-md-3 mb-3 mb-md-0">
                                <h3>Company</h3>
                                <ul>
                                    <li>About Us</li>
                                    <li>Contact Us</li>
                                    <li>Privacy Policy</li>
                                    <li>Terms of use</li>
                                    <li>Code of conduct</li>
                                </ul>
                            </div>

                            <div className="col-12 col-md-3 mb-3 mb-md-0">
                                <h3>Resources</h3>
                                <ul>
                                    <li>Blog</li>
                                    <li>Company Profiles</li>
                                    <li>Partner with us</li>
                                </ul>
                            </div>

                            <div className="col-12 col-md-3">
                                <h3>Follow Us</h3>
                                <ul className="follow d-flex gap-3 ps-0">
                                    <li><FaFacebook /></li>
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
            </section> */}
        </>
    )
}

export default Footer;