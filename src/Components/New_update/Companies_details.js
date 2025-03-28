import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { FaLocationDot, FaMapLocationDot, FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { FaTruckLoading, FaTruckMoving, FaStar, FaFilter, FaUserEdit } from "react-icons/fa";
import { HiBadgeCheck } from "react-icons/hi";
import { Rating } from 'react-simple-star-rating';
import Footer from "../Footer/Footer";
import { useState } from 'react';
import { FaBuilding } from "react-icons/fa";
import { IoIosMailOpen } from "react-icons/io";
import { RiContactsBook3Fill } from "react-icons/ri";



const CompanyDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const company = location.state?.company;
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [details_company, setDetails_company] = useState(false);
    if (!company) {
        return <h2 className="text-danger">Company details not found.</h2>;
    }
    console.log(company, 'this now data');
    const handle_contact = () => {
        if (token) {
            setDetails_company(true);
        } else {
            alert('Please login to contact the company.');
            navigate('/login');
        }
    }
    return (
        <div className="d-flex flex-column align-items-center justify-content-center">
            <div className='navbar-wrapper'>
                <div className=" d-flex justify-content-center w-100">
                    <Navbar />
                </div>
            </div>
            {/* <section className="hero-wrapper">
                <div className="container">
                    <div className="d-flex flex-column justify-content-center align-items-center text-light px-3">
                        <div className="text-center mt-3 w-100">
                            <div className="hero-wrap-head">
                                <h1>Ship Your Goods Worldwide with Reliable and Trusted Logistics Partners</h1>
                                <p>
                                    Connect with reliable logistics providers to transport goods across borders seamlessly. Our platform ensures efficient and hassle-free global shipping tailored to your needs.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}

            <section className='details-wrapper'>

                <div className="row mt-5 ">
                    <div className="col-md-8 border-end border-2 text-start">
                        <div className="d-flex align-items-center gap-4 p-3 company-details-wrap">
                            <div
                                className="rounded-circle overflow-hidden"
                                style={{ width: "80px", aspectRatio: "1/1" }}
                            >
                                <img
                                    src={
                                        company.logo
                                            ? company.logo
                                            : "https://png.pngtree.com/png-clipart/20230915/original/pngtree-global-icon-for-web-design-logo-app-isolated-vector-vector-png-image_12189325.png"
                                    }
                                    alt="Profile"
                                    className="w-100 h-100 object-fit-cover"
                                />
                            </div>
                            <div className='d-flex flex-column w-100'>
                                <div className=''>
                                    <strong className="fs-4 mb-3">
                                        {company.company_name}
                                        <span className="text-primary fs-5 ms-1">
                                            <HiBadgeCheck/>
                                        </span>
                                    </strong>
                                </div>
                                <div className='mt-1'>
                                    <span>
                                        <FaStar className="text-warning" />{" "}
                                        <span className="text-secondary">
                                            4.85{" "}
                                            <span className="text-primary">
                                                (<u>20 Reviews</u>)
                                            </span>
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>


                        <div className="p-4 company-details-wrap mt-4 ">
                            <h4>Company Overview</h4>
                            <p className="text-secondary">{company.description}</p>
                        </div>

                        {/* Company Information */}
                        <div className="p-4 company-details-wrap my-4 gap-3 d-flex flex-column">
                            <h4>Company Information</h4>
                            <span className="text-secondary d-block">
                                <FaUserEdit className="fs-5 me-1" style={{ color: '#FF5722' }} /> Completed 10k+ Orders
                            </span>
                            <span className="text-secondary d-block">
                                <FaLocationDot className="fs-5 me-1" style={{ color: '#FF5722' }} /> Based in{" "}
                                {company.location1}
                            </span>
                            <span className="text-secondary d-block">
                                <FaTruckMoving className="fs-5 me-1" style={{ color: '#FF5722' }} /> Offers{" "}
                                {company.container_service ? "Containers" : ""}
                                {company.car_service ? " & Cars" : ""}
                            </span>
                            <span className="text-secondary d-block">
                                <FaMapLocationDot className="fs-5 me-1" style={{ color: '#FF5722' }} /> Ship to -{" "}
                                {company.Countries.map((item, index) => (
                                    <span key={index}>{item.countries}, </span>
                                ))}
                            </span>
                        </div>

                        <div className="p-4 company-details-wrap">
                            <h4>Ratings & Reviews</h4>
                            <span className="text-primary">20 Reviews</span>
                            <div className="rounded p-3 mt-3" style={{ backgroundColor: '#fff' }}>
                                <Rating initialValue={4.5} readonly allowFraction size={25} />
                                <p className="text-secondary mt-2">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                    eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </p>
                                <div className="d-flex align-items-center gap-3">
                                    <div
                                        className="rounded-circle overflow-hidden"
                                        style={{ width: "60px", aspectRatio: "1/1" }}
                                    >
                                        <img
                                            src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
                                            alt="Profile"
                                            className="w-100 h-100 object-fit-cover"
                                        />
                                    </div>
                                    <strong className="fs-5">Micheal Wilson</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 text-start">
                        <div className="d-flex flex-column align-items-start">
                            <div
                                className="d-flex flex-column align-items-center gap-3 p-3 rounded w-100"
                                style={{ backgroundColor: "#E9FFE4" }}
                            >
                                {company.financialDocument &&
                                    company.passport_CEO_MD &&
                                    company.registrationDocument ? (
                                    <>
                                        <FaCircleCheck className="text-success fs-1" />
                                        <h6>Company background is verified</h6>
                                        <span className="text-secondary">
                                            (All documents submitted)
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <FaCircleXmark className="text-danger fs-1" />
                                        <h6>Company background not verified</h6>
                                        <span className="text-secondary">
                                            (Documents are not submitted)
                                        </span>
                                    </>
                                )}
                            </div>
                            <button className="w-100 btn-main mt-4" onClick={handle_contact}>
                                Contact Company
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {details_company && (
                <>
                    <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center" style={{ zIndex: 1050 }}>
                        <div className="position-relative bg-white p-4 rounded shadow-lg" style={{ width: '580px', height: 'auto' }}>
                            <button
                                className="btn-close position-absolute top-0 end-0 m-2"
                                onClick={() => setDetails_company(false)}
                            ></button>

                            <div className='d-flex flex-column align-items-start'>
                                <div className='title-head'><h3>Company Details</h3></div>

                                <div className='details-wrap w-100 text-start'>
                                    <span>< FaBuilding className='fs-4 me-2' style={{ color: '#FF5722', width: '20px' }} />Name -: {company.company_name}</span>
                                </div>

                                <div className='details-wrap w-100 text-start'>
                                    <span>< IoIosMailOpen className='fs-4 me-2' style={{ color: '#FF5722', width: '20px' }} />E-mail -: <a href={`mailto:"${company.email}"`}>{company.email}</a></span>
                                </div>

                                <div className='details-wrap w-100 text-start'>
                                    <span>< RiContactsBook3Fill className='fs-4 me-2' style={{ color: '#FF5722', width: '20px' }} />Contact Number-: {company.contect_no}</span>
                                </div>

                                <div className='details-wrap w-100 text-start'>
                                    <span>< FaLocationDot className='fs-4 me-2' style={{ color: '#FF5722', width: '20px' }} />Location -: {company.location1}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </>
            )}
            <div className="d-flex flex-column align-items-center my-5 text-white p-3 p-md-5 w-100" style={{ backgroundColor: "#0044BC" }}>
                <strong className="fs-3 text-center">Unable to Find Your Preferred Shipping Companies?</strong>
                <p className="w-100 w-md-50 my-3 text-center">Reach out to us for tailored shipping solutions that meet your needs</p>
                <button className="btn-main" style={{ marginTop: '0px' }}>Ship Your Goods with Us</button>
            </div>

            <div className='w-100'>
                < Footer />
            </div>

        </div>
    );
};

export default CompanyDetails;
