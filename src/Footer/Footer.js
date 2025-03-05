import React from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoLogoWhatsapp } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { IoCall } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {

    return (
        <div className="d-flex flex-column align-items-center mt-4 ">

    <h4>Questions we get asked</h4>

    <div className="d-flex flex-column flex-md-row justify-content-center p-3 p-md-5 gap-3 gap-md-5 w-100">
        <div className="col-12 col-md-6 d-flex flex-column align-items-center">
            <ul className="list-unstyled w-100 text-start">
                <li className="d-flex mb-3 mb-md-5 border border-2 p-2 p-md-1 rounded-4 mt-3 mt-md-5"><strong><IoIosAddCircleOutline className="text-primary fs-5 me-2" /></strong><p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout</p></li>
                <li className="d-flex mb-3 mb-md-5 border border-2 p-2 p-md-1 rounded-4 mt-3 mt-md-5"><strong><IoIosAddCircleOutline className="text-primary fs-5 me-2" /></strong><p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout</p></li>
                <li className="d-flex mb-3 mb-md-5 border border-2 p-2 p-md-1 rounded-4 mt-3 mt-md-5"><strong><IoIosAddCircleOutline className="text-primary fs-5 me-2" /></strong><p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout</p></li>
                <li className="d-flex mb-3 mb-md-5 border border-2 p-2 p-md-1 rounded-4 mt-3 mt-md-5"><strong><IoIosAddCircleOutline className="text-primary fs-5 me-2" /></strong><p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout</p></li>
            </ul>
        </div>
        <div className="col-12 col-md-6 d-flex flex-column align-items-center">
            <ul className="list-unstyled w-100 text-start">
                <li className="d-flex mb-3 mb-md-5 border border-2 p-2 p-md-1 rounded-4 mt-3 mt-md-5"><strong><IoIosAddCircleOutline className="text-primary fs-5 me-2" /></strong><p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout</p></li>
                <li className="d-flex mb-3 mb-md-5 border border-2 p-2 p-md-1 rounded-4 mt-3 mt-md-5"><strong><IoIosAddCircleOutline className="text-primary fs-5 me-2" /></strong><p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout</p></li>
                <li className="d-flex mb-3 mb-md-5 border border-2 p-2 p-md-1 rounded-4 mt-3 mt-md-5"><strong><IoIosAddCircleOutline className="text-primary fs-5 me-2" /></strong><p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout</p></li>
                <li className="d-flex mb-3 mb-md-5 border border-2 p-2 p-md-1 rounded-4 mt-3 mt-md-5"><strong><IoIosAddCircleOutline className="text-primary fs-5 me-2" /></strong><p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout</p></li>
            </ul>
        </div>
    </div>

    <div className="row mt-2 w-100">
        <div className="col-12 col-md-1 d-none d-md-block"></div>
        <div className="col-12 col-md-4 d-flex flex-column p-3 p-md-4 text-white text-start rounded-4 gap-3 mb-3 mb-md-0" style={{ backgroundColor: '#0044BC' }}>
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
        <div className="col-12 col-md-6 p-3 p-md-4 text-start bg-light rounded-4">
            <strong className="mb-2 mb-md-3 fs-5">Get in Touch</strong>

            <div className="row g-2 g-md-3 mt-2 mt-md-3">
                <div className="col-12 col-md-6">
                    <label className="form-label">Full Name <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" placeholder="Enter your full name" />
                </div>
                <div className="col-12 col-md-6">
                    <label className="form-label">Email ID <span className="text-danger">*</span></label>
                    <input type="email" className="form-control" placeholder="Enter your email id" />
                </div>
            </div>
            <div className="row g-2 g-md-3 mt-2 mt-md-3">
                <div className="col-12 col-md-6">
                    <label className="form-label">Contact Number <span className="text-danger">*</span></label>
                    <input type="tel" className="form-control" placeholder="Enter your contact number" />
                </div>
                <div className="col-12 col-md-6">
                    <label className="form-label">Country you Live <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" placeholder="Enter your country" />
                </div>
            </div>
            <div className="mt-2 mt-md-3">
                <label className="form-label">Message (if any)</label>
                <textarea className="form-control" rows="4" placeholder="Type here . . ." style={{ resize: 'none' }}></textarea>
            </div>
            <button className="btn mt-3 mt-md-4 text-white w-100" style={{ backgroundColor: 'tomato' }}>SUBMIT</button>
        </div>
        <div className="col-12 col-md-1 d-none d-md-block"></div>
    </div>

    <div className="d-flex flex-column align-items-center mt-4 mt-md-5 text-white p-3 p-md-5 w-100" style={{ backgroundColor: "#0044BC" }}>
        <strong className="fs-5 fs-md-4 text-center">Partner With Us and Grow Your Reach</strong>
        <p className="w-100 w-md-50 p-2 p-md-4 text-center">Join our platform to connect with global customers and expand your logistics business</p>
        <button className="btn text-white" style={{ backgroundColor: "tomato" }}>Register your Company</button>
    </div>

    <div className="d-flex flex-column flex-md-row align-items-start justify-content-between w-100 w-md-75 gap-3 gap-md-5 p-3 p-md-5 border-bottom border-2">
        <div>
            <strong className="fs-3 fs-md-1">Navibiiz</strong>
        </div>

        <div className="d-flex flex-column gap-2 gap-md-3">
            <strong className="fs-6 fs-md-5">Company</strong>
            <p className="text-secondary">About Us</p>
            <p className="text-secondary">Contact Us</p>
            <p className="text-secondary">Privacy Policy</p>
            <p className="text-secondary">Terms of use</p>
            <p className="text-secondary">Code of conduct</p>
        </div>

        <div className="d-flex flex-column gap-2 gap-md-3">
            <strong className="fs-6 fs-md-5">Resources</strong>
            <p className="text-secondary">Blog</p>
            <p className="text-secondary">Company Profiles</p>
            <p className="text-secondary">Partner with us</p>
        </div>

        <div className="d-flex flex-column gap-2 gap-md-3">
            <strong className="fs-6 fs-md-5">Follow Us</strong>
            <div className="d-flex align-items-center gap-2 gap-md-3 fs-4 fs-md-3" style={{ color: "tomato" }}>
                <FaFacebook />
                <FaInstagramSquare />
                <FaLinkedin />
            </div>
        </div>
    </div>
    <div className="w-100 text-center text-secondary mb-5 p-md-3">
        <p>© 2025 Navibiiz. All Rights Reserved.</p>
    </div>
</div>

    )
}

export default Footer;