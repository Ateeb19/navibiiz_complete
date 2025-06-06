import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import { IoLogoWhatsapp } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { IoCall } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import axios from "axios";
import { useAlert } from "../alert/Alert_message";
import Footer from "../Footer/Footer";

const Contact_us = () => {


    const port = process.env.REACT_APP_SECRET;
    const { showAlert } = useAlert();
    const [user_name, setUser_name] = useState('');
    const [email_id, setEmail_id] = useState('');
    const [contact_number, setContact_number] = useState('');
    const [country, setCountry] = useState('')
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
            <div className="d-flex flex-column align-items-center justify-content-center  mt-5 pt-5">
                <div className='navbar-wrapper'>
                    <div className=" d-flex justify-content-center w-100">
                        <Navbar />
                    </div>
                </div>

                <div className="container w-100 mt-5 mb-5">
                    <section className="contact-form-wrapper">
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
                </div>

                <div className="w-100">
                    <Footer/>
                </div>
            </div>
        </>
    )
}


export default Contact_us;