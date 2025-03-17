import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { FaLocationDot, FaMapLocationDot, FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { FaTruckLoading, FaTruckMoving, FaStar, FaFilter, FaUserEdit } from "react-icons/fa";
import { HiBadgeCheck } from "react-icons/hi";
import Countries_selector from "../Dashboard/Countries_selector";
import { Rating } from 'react-simple-star-rating';

const CompaniesList = () => {

    const companies = JSON.parse(localStorage.getItem('companyInfo'));

    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedPickupCountry, setSelectedPickupCountry] = useState('');
    const [selectedDestinationCountry, setSelectedDestinationCountry] = useState('');
    const [selectedDuration, setSelectedDuration] = useState('');
    const handleServiceChange = (e) => {
        const value = e.target.value;
        setSelectedServices((prev) =>
            prev.includes(value) ? prev.filter((service) => service !== value) : [...prev, value]
        );
    };

    const handlePickupCountrySelect = (country) => {
        setSelectedPickupCountry(country);
    };

    const handleDestinationCountrySelect = (country) => {
        setSelectedDestinationCountry(country);
    };

    const handleDurationChange = (e) => {
        const value = e.target.value;
        setSelectedDuration(value);
    };

    const filterData = (data) => {
        return data.filter((company) => {
            const serviceMatch =
                selectedServices.length === 0 ||
                selectedServices.includes('containers') && company.container_service === '1' ||
                selectedServices.includes('car') && company.car_service === '1';

            const pickupCountryMatch =
                !selectedPickupCountry ||
                company.Countries.some((country) => country.countries === selectedPickupCountry) ||
                [company.location1, company.location2, company.location3, company.location4, company.location5, company.location6, company.location7, company.location8, company.location9, company.location10]
                    .some(location => location && location.includes(selectedPickupCountry));

            const destinationCountryMatch =
                !selectedDestinationCountry ||
                company.Countries.some((country) => country.countries === selectedDestinationCountry);

            const durationMatch =
                !selectedDuration ||
                company.Countries.some((country) => {
                    const duration = parseInt(country.duration, 10);
                    if (selectedDuration === '92') return duration <= 92;
                    if (selectedDuration === '60') return duration <= 60;
                    if (selectedDuration === '30') return duration <= 30;
                    if (selectedDuration === '45') return duration <= 15;
                    return true;
                });

            return serviceMatch && pickupCountryMatch && destinationCountryMatch && durationMatch;
        });
    };

    const filteredData = filterData(companies);

    // console.log(filteredData)
    const [company_detail, setCompany_detail] = useState(null);
    const View_details = (item) => {
        setCompany_detail(item);
    }

    return (
        <div className="d-flex flex-column align-items-center justify-content-center">

            <div className=" d-flex justify-content-center w-100">
                <Navbar />
            </div>
            <div className="d-flex flex-column justify-content-center align-items-center text-light px-3" style={{
                width: "100%",
                minHeight: "40vh", 
                borderRadius: "0% 0% 2% 2% / 28% 28% 20% 20%",
                backgroundColor: "#0044BC",
                position: "relative", 
                zIndex: -1, 
            }}>
                <div className="text-center mt-3 w-100">
                    <strong className="fs-3 d-block mb-2">Ship Your Goods Worldwide with Reliable and Trusted Logistics Partners</strong>
                    <p className="w-50 mx-auto">
                        Connect with reliable logistics providers to transport goods across borders seamlessly. Our platform ensures efficient and hassle-free global shipping tailored to your needs.
                    </p>
                </div>
            </div>

            <div className="d-flex flex-column flex-md-row justify-content-center align-items-start mt-4 mt-md-5 w-100">
                <div className="d-flex flex-column align-items-start p-3 ps-5 pb-5 col-12 col-md-3">
                    <strong className="fs-3"><span style={{ color: 'tomato' }}><FaFilter /> </span>Filters by :</strong>
                    <div className="d-flex flex-column align-items-start w-100 mt-5 border-bottom border-2 pb-3">
                        <h5>SERVICES</h5>
                        <div className="gap-3 d-flex mt-2 mb-2">
                            <input className="form-check-input" type="checkbox" value="containers" id="containers" onChange={handleServiceChange} />
                            <label className="text-secondary">Containers</label>
                        </div>
                        <div className="gap-3 d-flex mt-2 mb-2">
                            <input className="form-check-input" type="checkbox" value="car" id="car" onChange={handleServiceChange} />
                            <label className="text-secondary">Cars</label>
                        </div>
                    </div>
                    <div className="d-flex flex-column align-items-start w-100 mt-5 border-bottom border-2 pb-3">
                        <h5>PICK UP COUNTRY</h5>
                        <span className="w-100 w-md-75">
                            <Countries_selector onSelectCountry={handlePickupCountrySelect} />
                        </span>
                    </div>
                    <div className="d-flex flex-column align-items-start w-100 mt-5 border-bottom border-2 pb-3">
                        <h5>DESTINATION COUNTRY</h5>
                        <span className="w-100 w-md-75">
                            <Countries_selector onSelectCountry={handleDestinationCountrySelect} />
                        </span>
                    </div>
                    <div className="d-flex flex-column align-items-start w-100 mt-5 border-bottom border-2 pb-3">
                        <h5>DURATION</h5>
                        <div className="gap-3 d-flex mt-2 mb-2">
                            <input className="form-check-input" type="checkbox" value="92" id="92" onChange={handleDurationChange} />
                            <label className="text-secondary">0 - 3 Months</label>
                        </div>
                        <div className="gap-3 d-flex mt-2 mb-2">
                            <input className="form-check-input" type="checkbox" value="60" id="60" onChange={handleDurationChange} />
                            <label className="text-secondary">Less than 2 months</label>
                        </div>
                        <div className="gap-3 d-flex mt-2 mb-2">
                            <input className="form-check-input" type="checkbox" value="30" id="30" onChange={handleDurationChange} />
                            <label className="text-secondary">Less than 30 Days</label>
                        </div>
                        <div className="gap-3 d-flex mt-2 mb-2">
                            <input className="form-check-input" type="checkbox" value="45" id="45" onChange={handleDurationChange} />
                            <label className="text-secondary">1 - 15 days</label>
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-column align-items-start justify-content-start p-3 ps-4 col-12 col-md-9 border-start border-3" style={{height: '100vh', overflowY: 'auto'}}>
                    <strong className="fs-3">Search Results </strong>
                    {companies ? (
                        <>
                            {filteredData.length > 0 ? (
                                <>
                                    {filteredData.map((item, index) => (
                                        <div className="d-flex flex-column align-items-start justify-content-start w-100 mt-5 pt-3 ps-5 pe-5 " key={index}>
                                            <div className="rounded-circle overflow-hidden" style={{ width: '80px', maxWidth: '110px', aspectRatio: '1/1' }}>
                                                <img
                                                    src={item.logo ? item.logo : "https://png.pngtree.com/png-clipart/20230915/original/pngtree-global-icon-for-web-design-logo-app-isolated-vector-vector-png-image_12189325.png"}
                                                    alt="Profile"
                                                    className="w-100 h-100 object-fit-cover"
                                                />
                                            </div>
                                            <div className="d-flex justify-content-between w-100">
                                                <span><strong className="fs-3">{item.company_name}</strong><span className="text-primary"><HiBadgeCheck /></span></span>
                                                <h5 className="text-primary" style={{ cursor: 'default' }} onClick={() => View_details(item)}><u>View Details</u></h5>
                                            </div>
                                            <p className="mt-2"><span className="text-warning"><FaStar /></span> 4.65 <span className="text-secondary">(20 Ratings)</span></p>
                                            <p className="mt-2 text-start text-secondary">{item.description.split(" ").slice(0, 30).join(" ") + "..."}</p>
                                            <div className="d-flex flex-column flex-md-row gap-4">
                                                <div className="p-3 border-end border-3">
                                                    <FaLocationDot className='fs-4' style={{ color: 'tomato' }} /> <span className="text-secondary">{item.location1.split(",")[0].trim()}</span>
                                                </div>
                                                <div className="p-3 border-end border-3">
                                                    <FaTruckLoading className='fs-4' style={{ color: 'tomato' }} /> <span className="text-secondary">2k+ Delivery Completed</span>
                                                </div>
                                                <div className="p-3">
                                                    <FaTruckMoving className='fs-4' style={{ color: 'tomato' }} /> <span className="text-secondary">Offers {item.container_service ? 'Containers' : ''}{item.car_service ? ' & Cars' : ''}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <strong className="fs-4 w-100 mt-5">No Data</strong>
                            )}
                        </>
                    ) : (
                        <strong className="fs-4 w-100 mt-5">No Data</strong>
                    )}
                    {company_detail && (
                        <div
                            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                            style={{
                                backgroundColor: "rgba(0, 0, 0, 0.7)",
                                zIndex: 9999,
                            }}
                        >
                            <div
                                className="bg-light rounded shadow p-4 position-relative border border-2 border-dark container"
                                style={{
                                    maxWidth: "90%",
                                    height: "80vh",
                                    overflowY: "auto",
                                }}
                            >
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
                                                        company_detail.logo
                                                            ? company_detail.logo
                                                            : "https://png.pngtree.com/png-clipart/20230915/original/pngtree-global-icon-for-web-design-logo-app-isolated-vector-vector-png-image_12189325.png"
                                                    }
                                                    alt="Profile"
                                                    className="w-100 h-100 object-fit-cover"
                                                />
                                            </div>
                                            <div>
                                                <strong className="fs-4">
                                                    {company_detail.company_name}
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
                                            <p className="text-secondary">{company_detail.description}</p>
                                        </div>

                                        {/* Company Information */}
                                        <div className="p-3">
                                            <h5>Company Information</h5>
                                            <span className="text-secondary d-block">
                                                <FaUserEdit className="fs-5 text-danger" /> Completed 10k+ Orders
                                            </span>
                                            <span className="text-secondary d-block">
                                                <FaLocationDot className="fs-5 text-danger" /> Based in{" "}
                                                {company_detail.location1}
                                            </span>
                                            <span className="text-secondary d-block">
                                                <FaTruckMoving className="fs-5 text-danger" /> Offers{" "}
                                                {company_detail.container_service ? "Containers" : ""}
                                                {company_detail.car_service ? " & Cars" : ""}
                                            </span>
                                            <span className="text-secondary d-block">
                                                <FaMapLocationDot className="fs-5 text-danger" /> Ship to -{" "}
                                                {company_detail.Countries.map((item, index) => (
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
                                        <button
                                            className="btn btn-danger position-absolute top-0 end-0 m-2"
                                            onClick={() => setCompany_detail(null)}
                                        >
                                            ✕
                                        </button>

                                        <div className="d-flex flex-column align-items-start mt-5">
                                            <div
                                                className="d-flex flex-column align-items-start gap-3 p-3 border border-4 rounded"
                                                style={{ backgroundColor: "rgb(174, 237, 252)" }}
                                            >
                                                {company_detail.financialDocument &&
                                                    company_detail.passport_CEO_MD &&
                                                    company_detail.registrationDocument ? (
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
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="d-flex flex-column align-items-center mt-4 mt-md-5 text-white p-3 p-md-5 w-100" style={{ backgroundColor: "#0044BC" }}>
                <strong className="fs-3 fs-md-4 text-center">Unable to Find Your Preferred Shipping Companies?</strong>
                <p className="w-100 w-md-50 p-2 p-md-4 text-center">Reach out to us for tailored shipping solutions that meet<br /> your needs</p>
                <button className="btn text-white" style={{ backgroundColor: "tomato" }}>Ship Your Goods with Us</button>
            </div>

            <div className="w-100 mt-5">
                <Footer />
            </div>
        </div>
    );
}

export default CompaniesList;