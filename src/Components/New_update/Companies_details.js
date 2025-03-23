import { useLocation, useParams } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { FaLocationDot, FaMapLocationDot, FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { FaTruckLoading, FaTruckMoving, FaStar, FaFilter, FaUserEdit } from "react-icons/fa";
import { HiBadgeCheck } from "react-icons/hi";
import { Rating } from 'react-simple-star-rating';
import Footer from "../Footer/Footer";


const CompanyDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const company = location.state?.company;

    if (!company) {
        return <h2 className="text-danger">Company details not found.</h2>;
    }

    return (
        <div className="d-flex flex-column align-items-center justify-content-center">
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
                                <h1>Ship Your Goods Worldwide with Reliable and Trusted Logistics Partners</h1>
                                <p>
                                    Connect with reliable logistics providers to transport goods across borders seamlessly. Our platform ensures efficient and hassle-free global shipping tailored to your needs.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="row">
                {/* Left Section */}
                <div className="col-md-8 border-end border-2 text-start">
                    <div className="d-flex align-items-center gap-4 p-3">
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
                        <div>
                            <strong className="fs-4">
                                {company.company_name}
                                <span className="text-primary fs-5">
                                    <HiBadgeCheck />
                                </span>
                            </strong>
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

                    {/* Company Overview */}
                    <div className="p-3">
                        <h4>Company Overview</h4>
                        <p className="text-secondary">{company.description}</p>
                    </div>

                    {/* Company Information */}
                    <div className="p-3">
                        <h5>Company Information</h5>
                        <span className="text-secondary d-block">
                            <FaUserEdit className="fs-5 text-danger" /> Completed 10k+ Orders
                        </span>
                        <span className="text-secondary d-block">
                            <FaLocationDot className="fs-5 text-danger" /> Based in{" "}
                            {company.location1}
                        </span>
                        <span className="text-secondary d-block">
                            <FaTruckMoving className="fs-5 text-danger" /> Offers{" "}
                            {company.container_service ? "Containers" : ""}
                            {company.car_service ? " & Cars" : ""}
                        </span>
                        <span className="text-secondary d-block">
                            <FaMapLocationDot className="fs-5 text-danger" /> Ship to -{" "}
                            {company.Countries.map((item, index) => (
                                <span key={index}>{item.countries}, </span>
                            ))}
                        </span>
                    </div>

                    {/* Ratings & Reviews */}
                    <div className="p-3">
                        <h4>Ratings & Reviews</h4>
                        <span className="text-primary">20 Reviews</span>
                        <div className="border rounded p-3 mt-3">
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

                {/* Right Section */}
                <div className="col-md-4 text-start">
                    <div className="d-flex flex-column align-items-start mt-5">
                        <div
                            className="d-flex flex-column align-items-start gap-3 p-3 border border-4 rounded"
                            style={{ backgroundColor: "rgb(174, 237, 252)" }}
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
                        <button className="btn w-100 text-light mt-4" style={{ backgroundColor: "tomato" }}>
                            Contact Company
                        </button>
                    </div>
                </div>
            </div>
            <div className="d-flex flex-column align-items-center mt-4 mt-md-5 text-white p-3 p-md-5 w-100" style={{ backgroundColor: "#0044BC" }}>
                <strong className="fs-3 fs-md-4 text-center">Unable to Find Your Preferred Shipping Companies?</strong>
                <p className="w-100 w-md-50 p-2 p-md-4 text-center">Reach out to us for tailored shipping solutions that meet<br /> your needs</p>
                <button className="btn text-white" style={{ backgroundColor: "tomato" }}>Ship Your Goods with Us</button>
            </div>

            <div>
                < Footer />
            </div>

        </div>

        // <div className="container mt-5">
        //     <div className="d-flex flex-column align-items-center">
        //         <div className="rounded-circle overflow-hidden" style={{ width: '150px', height: '150px' }}>
        //             <img
        //                 src={company.logo ? company.logo : "https://png.pngtree.com/png-clipart/20230915/original/pngtree-global-icon-for-web-design-logo-app-isolated-vector-vector-png-image_12189325.png"}
        //                 alt="Company Logo"
        //                 className="w-100 h-100 object-fit-cover"
        //             />
        //         </div>
        //         <h2 className="mt-3">{company.company_name}</h2>
        //         <p className="text-secondary">{company.description}</p>
        //     </div>

        //     <div className="mt-4 p-3 border rounded shadow">
        //         <h4>Company Information</h4>
        //         <p><strong>Location:</strong> {company.location1}</p>
        //         <p><strong>Services:</strong> {company.container_service ? 'Containers' : ''} {company.car_service ? '& Cars' : ''}</p>
        //         <p><strong>Deliveries Completed:</strong> 2k+</p>
        //     </div>
        // </div>
    );
};

export default CompanyDetails;
