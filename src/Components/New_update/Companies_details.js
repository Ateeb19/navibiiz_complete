import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { FaLocationDot, FaMapLocationDot, FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { FaTruckMoving, FaStar, FaFilter, FaUserEdit } from "react-icons/fa";
import { HiBadgeCheck } from "react-icons/hi";
import { Rating } from 'react-simple-star-rating';
import Footer from "../Footer/Footer";
import { useEffect, useState } from 'react';
import { FaBuilding } from "react-icons/fa";
import { IoIosMailOpen, IoMdArrowRoundBack } from "react-icons/io";
import { RiContactsBook3Fill } from "react-icons/ri";
import { useAlert } from "../alert/Alert_message";
import Form from 'react-bootstrap/Form';
import { MdOutlineDescription, MdOutlineRateReview } from 'react-icons/md';
import axios from 'axios';

const CompanyDetails = () => {
    const port = process.env.REACT_APP_SECRET;
    const { id } = useParams();
    const { showAlert } = useAlert();
    const [company, setCompany] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [details_company, setDetails_company] = useState(false);

    const [rating, setRating] = useState(0)

    const handleRating = (rate: number) => {
        setRating(rate)
    }
    const [description, setDescrition] = useState("");


    useEffect(() => {
        const storedCompany = localStorage.getItem(`company_${id}`);
        if (storedCompany) {
            setCompany(JSON.parse(storedCompany));
        }
    }, [id]);


    const [review, setReview] = useState(false);

    const handle_contact = () => {
        if (token) {
            setDetails_company(true);
        } else {
            showAlert('Please login to contact the company.');
            localStorage.setItem("redirectAfterLogin", `/company_details/${id}`);
            navigate('/login');
        }
    }

    const display_review = () => {
        if (token) {
            setReview(true)
        } else {
            showAlert('Please login to add a review.');
            localStorage.setItem("redirectAfterLogin", `/company_details/${id}`);
            navigate('/login');
        }
    }
    const onsubmit_review = () => {
        if (rating === '') {
            showAlert("Give Ratting ")
            return;
        }
        if (rating < 0.5) {
            showAlert("Ratting Should be more than 0")
            return;
        }
        if (description === '') {
            showAlert("Enter the description")
            return;
        }
        axios.put(`${port}/company/add/review`, {
            company_id: id,
            rating: rating,
            description: description,
        }, {
            headers: {
                Authorization: token,
            }
        }).then((response) => {
            if (response.data.status === true) {
                setReview(false);
                setDescrition("");
                setRating('');
                showAlert(response.data.message);
            }
            console.log(response.data);
        }).catch((err) => console.log(err));
    }
    if (!company) {
        return <h2 className="text-danger">Company details not found.</h2>
    }



    return (
        <div className="d-flex flex-column align-items-center justify-content-center  mt-5 pt-5">
            <div className='navbar-wrapper'>
                <div className=" d-flex justify-content-center w-100">
                    <Navbar />
                </div>
            </div>
            <div className='container'>
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
                                                <HiBadgeCheck />
                                            </span>
                                        </strong>
                                    </div>
                                    <div className='mt-1'>
                                        <span className="text-primary">
                                            <span className="text-warning pe-1"><FaStar /></span>
                                            {company.Ratting && company.Ratting.length > 0
                                                ? (
                                                    company.Ratting.reduce((acc, cur) => acc + parseFloat(cur.ratting), 0) /
                                                    company.Ratting.length
                                                ).toFixed(2)
                                                : "No Ratings"}{" "}
                                            <u>({company.Ratting.length} Reviews)</u>
                                        </span>
                                    </div>
                                </div>
                            </div>


                            <div className="p-4 company-details-wrap mt-4 ">
                                <h4>Company Overview</h4>
                                <p className="text-secondary">{company.description}</p>
                            </div>

                            <div className="p-4 company-details-wrap my-4 gap-3 d-flex flex-column">
                                <h4>Company Information</h4>
                                <span className="text-secondary d-block">
                                    <FaUserEdit className="fs-5 me-1" style={{ color: '#de8316' }} /> Completed {company.total_delivery} Orders
                                </span>
                                <span className="text-secondary d-block">
                                    <FaLocationDot className="fs-5 me-1" style={{ color: '#de8316' }} /> Based in{" "}
                                    {company.location1}
                                </span>
                                {company.location2 && (
                                    <>
                                        <span className="text-secondary d-block">
                                            <FaLocationDot className="fs-5 me-1" style={{ color: '#de8316' }} /> Based in{" "}
                                            {company.location2}
                                        </span>
                                    </>
                                )}
                                {company.location3 && (
                                    <>
                                        <span className="text-secondary d-block">
                                            <FaLocationDot className="fs-5 me-1" style={{ color: '#de8316' }} /> Based in{" "}
                                            {company.location3}
                                        </span>
                                    </>
                                )}
                                {company.location4 && (
                                    <>
                                        <span className="text-secondary d-block">
                                            <FaLocationDot className="fs-5 me-1" style={{ color: '#de8316' }} /> Based in{" "}
                                            {company.location4}
                                        </span>
                                    </>
                                )}
                                {company.location5 && (
                                    <>
                                        <span className="text-secondary d-block">
                                            <FaLocationDot className="fs-5 me-1" style={{ color: '#de8316' }} /> Based in{" "}
                                            {company.location5}
                                        </span>
                                    </>
                                )}
                                {company.location6 && (
                                    <>
                                        <span className="text-secondary d-block">
                                            <FaLocationDot className="fs-5 me-1" style={{ color: '#de8316' }} /> Based in{" "}
                                            {company.location6}
                                        </span>
                                    </>
                                )}
                                {company.location7 && (
                                    <>
                                        <span className="text-secondary d-block">
                                            <FaLocationDot className="fs-5 me-1" style={{ color: '#de8316' }} /> Based in{" "}
                                            {company.location7}
                                        </span>
                                    </>
                                )}
                                {company.location8 && (
                                    <>
                                        <span className="text-secondary d-block">
                                            <FaLocationDot className="fs-5 me-1" style={{ color: '#de8316' }} /> Based in{" "}
                                            {company.location8}
                                        </span>
                                    </>
                                )}
                                {company.location9 && (
                                    <>
                                        <span className="text-secondary d-block">
                                            <FaLocationDot className="fs-5 me-1" style={{ color: '#de8316' }} /> Based in{" "}
                                            {company.location9}
                                        </span>
                                    </>
                                )}
                                {company.location10 && (
                                    <>
                                        <span className="text-secondary d-block">
                                            <FaLocationDot className="fs-5 me-1" style={{ color: '#de8316' }} /> Based in{" "}
                                            {company.location10}
                                        </span>
                                    </>
                                )}
                                <span className="text-secondary d-block">
                                    <FaTruckMoving className="fs-5 me-1" style={{ color: '#de8316' }} /> Shipping{" "}
                                    {company.container_service === '1' && company.car_service === '1'
                                        ? "Containers & Cars"
                                        : company.container_service === '1'
                                            ? "Containers"
                                            : company.car_service === '1'
                                                ? "Cars"
                                                : ""}
                                    {/* {company.container_service === '1' ? "Containers" : "Containers"}
                                    {(company.car_service === '1' && company.container_service === '1') ? " & " : ""}
                                    {company.car_service === '1' ? "Cars" : ""} */}
                                </span>
                                <span className="text-secondary d-block">
                                    <FaMapLocationDot className="fs-5 me-1" style={{ color: '#de8316' }} /> Ship to –{" "}
                                    {[...new Set(company.Countries.map(item => item.countries.trim()))].map((country, index, arr) => (
                                        <span key={index}>
                                            {country}
                                            {index < arr.length - 1 ? ", " : ""}
                                        </span>
                                    ))}
                                </span>
                            </div>

                            <div className="p-4 company-details-wrap">
                                <div className='d-flex flex-row align-items-between justify-content-between'>
                                    <div className=''>
                                        <h4>Ratings & Reviews</h4>
                                        <span className="text-primary">{company.Ratting.length} Review</span>
                                    </div>
                                    <div className=''>
                                        <button className='btn-main-review' onClick={display_review}>Add a Review</button>
                                    </div>
                                </div>

                                {company.Ratting.length > 0 ? (
                                    <>
                                        {company.Ratting.map((item, index) => (
                                            <>
                                                <div className="rounded p-3 mt-3" style={{ backgroundColor: '#fff' }}>
                                                    <Rating initialValue={item.ratting} readonly allowFraction size={25} />
                                                    <p className="text-secondary mt-2">
                                                        {item.description}
                                                    </p>
                                                    <div className="d-flex align-items-center gap-3">
                                                        <strong className="fs-5">{item.user_name}</strong>
                                                    </div>
                                                </div>
                                            </>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        <h5> No Review</h5>
                                    </>
                                )}
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
            </div>


            {review && (
                <>
                    <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center" style={{ zIndex: 1050 }}>
                        <div className="position-relative bg-white p-4 rounded shadow-lg" style={{ width: '580px', height: 'auto' }}>
                            <button
                                className="btn-close position-absolute top-0 end-0 m-2"
                                onClick={() => setReview(false)}
                            ></button>

                            <div className='d-flex flex-column align-items-start'>
                                <div className='title-head'><h3>Submit Review</h3></div>

                                <div className='details-wrap d-flex flex-row align-items-between justify-content-between w-100 text-start'>
                                    <span className="w-50 gap-3"> < MdOutlineRateReview className='fs-4' style={{ color: '#de8316' }} /> Rating -: </span>

                                    <Rating
                                        onClick={handleRating}
                                        initialValue={rating}
                                        allowFraction
                                        size={30}
                                    />
                                </div>

                                <div className='details-wrap w-100 text-start'>
                                    <span className=''>< MdOutlineDescription className='fs-4' style={{ color: '#de8316' }} />  Description :</span>
                                    <textarea cols="45" rows="4" className='input-field-review mt-3' placeholder="Enter description here..." value={description} onChange={(e) => setDescrition(e.target.value)} />
                                </div>

                                <div className='review-submit-btn w-100 d-flex justify-content-end'>
                                    <button onClick={onsubmit_review}>Submit</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </>
            )}



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
                                    <span>< FaBuilding className='fs-4 me-2' style={{ color: '#de8316', width: '20px' }} />Name -: {company.company_name}</span>
                                </div>

                                <div className='details-wrap w-100 text-start'>
                                    <span>< IoIosMailOpen className='fs-4 me-2' style={{ color: '#de8316', width: '20px' }} />E-mail -: <a href={`mailto:"${company.email}"`}>{company.email}</a></span>
                                </div>

                                <div className='details-wrap w-100 text-start'>
                                    <span>< RiContactsBook3Fill className='fs-4 me-2' style={{ color: '#de8316', width: '20px' }} />Contact Number-: {company.contect_no}</span>
                                </div>

                                <div className='details-wrap w-100 text-start'>
                                    <span>< FaLocationDot className='fs-4 me-2' style={{ color: '#de8316', width: '20px' }} />Location -: {company.location1.split(",")[2].trim()} {company.location2 && <>, {company.location2.split(",")[2].trim()}</>} {company.location3 && <>, {company.location3.split(",")[2].trim()}</>} {company.location4 && <>, {company.location4.split(",")[2].trim()}</>} {company.location6 && <>, {company.location6.split(",")[2].trim()}</>} {company.location7 && <>, {company.location7.split(",")[2].trim()}</>} {company.location8 && <>, {company.location8.split(",")[2].trim()}</>} {company.location9 && <>, {company.location9.split(",")[2].trim()}</>} {company.location10 && <>, {company.location10.split(",")[2].trim()}</>} {company.location10 && <>, {company.location10.split(",")[2].trim()}</>}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </>
            )}
            <div className="d-flex flex-column align-items-center my-5 text-white p-3 p-md-5 w-100" style={{ backgroundColor: "#0044BC" }}>
                <strong className="fs-3 text-center">Unable to Find Your Preferred Shipping Companies?</strong>
                <p className="w-100 w-md-50 my-3 text-center">Reach out to us for tailored shipping solutions that meet your needs</p>
                <button className="btn-main" style={{ marginTop: '0px' }} onClick={() => navigate('/send_groupage')}>Ship Your Goods with Us</button>
            </div>

            <div className='w-100'>
                < Footer />
            </div>

        </div>
    );
};

export default CompanyDetails;
