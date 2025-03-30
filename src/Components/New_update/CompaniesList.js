import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { FaLocationDot, FaMapLocationDot, FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { FaTruckLoading, FaTruckMoving, FaStar, FaFilter, FaUserEdit } from "react-icons/fa";
import { HiBadgeCheck } from "react-icons/hi";
import Countries_selector from "../Dashboard/Countries_selector";
import { Rating } from 'react-simple-star-rating';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactPaginate from "react-paginate";
import "bootstrap/dist/css/bootstrap.min.css";

const CompaniesList = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const itemsPerPage = 5;

    const companies = JSON.parse(localStorage.getItem('companyInfo'));
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedPickupCountry, setSelectedPickupCountry] = useState('');
    const [selectedDestinationCountry, setSelectedDestinationCountry] = useState('');
    const [selectedDuration, setSelectedDuration] = useState('');
    const [searchQuery, setSearchQuery] = useState("");


    useEffect(() => {
        if (location.state) {
            setSelectedPickupCountry(location.state.pickupCountry || '');
            setSelectedDestinationCountry(location.state.destinationCountry || '');
            setSelectedServices(location.state.selectedService || '');
        }
    }, [location.state]);

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

            const locationMatch =
                !searchQuery ||
                [company.location1, company.location2, company.location3, company.location4, company.location5,
                company.location6, company.location7, company.location8, company.location9, company.location10]
                    .some(location => location && location.toLowerCase().includes(searchQuery.toLowerCase()));

            // Match input with countries inside the Countries array
            const countryMatch =
                !searchQuery ||
                company.Countries.some((country) =>
                    country.countries.toLowerCase().includes(searchQuery.toLowerCase())
                );


            return serviceMatch && pickupCountryMatch && destinationCountryMatch && durationMatch && (locationMatch || countryMatch);
        }).sort((a) => data.id);
    };

    const filteredData = filterData(companies);
    console.log(filteredData);

    // console.log(filteredData)
    const [company_detail, setCompany_detail] = useState(null);
    // const View_details = (item) => {
    //     setCompany_detail(item);
    // }

    // const View_details = (item) => {
    //     navigate(`/company_details/${item.id}`, { state: { company: item } });
    // };

    const View_details = (item) => {
        // Store company details in localStorage
        localStorage.setItem(`company_${item.id}`, JSON.stringify(item));
    
        // Navigate to company details page
        navigate(`/company_details/${item.id}`, { state: { company: item } });
    };

    const offset = currentPage * itemsPerPage;
    const currentItems = filteredData.slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(filteredData.length / itemsPerPage);

    useEffect(() => {
        const smoothScroll = () => {
            let scrollY = document.documentElement.scrollTop || document.body.scrollTop;
            if (scrollY > 0) {
                window.requestAnimationFrame(smoothScroll);
                window.scrollTo(0, scrollY - scrollY / 8);
            }
        };
    
        smoothScroll();
    }, [currentPage]);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };
    return (
        <div className="d-flex flex-column align-items-center justify-content-center">

            <div className='navbar-wrapper'>
                <div className=" d-flex justify-content-center w-100">
                    <Navbar />
                </div>
            </div>
            {/* <div className="d-flex flex-column justify-content-center align-items-center text-dark px-3" style={{
                width: "100%",
                minHeight: "25vh",
                backgroundColor: "#eff6ff",
                position: "relative",
                zIndex: -1,
            }}>
                <div className="text-center mt-3 w-100">
                    <strong className="fs-3 d-block mb-2">Companies</strong>
                    <p className="w-50 mx-auto">
                        Connect with verified companies to transport your goods, any where in the world.
                    </p>
                </div>
            </div> */}

            <section className="search-result-wrapper w-100">
                <div className="container">
                    <div className="d-flex flex-column flex-md-row justify-content-center align-items-start mt-3 mt-md-5 w-100">
                        <div className="d-flex flex-column align-items-start p-3 ps-5 pb-5 col-12 col-md-3">
                            <div className="title-head">
                                <h3><span style={{ color: ' #FF5722' }}><FaFilter /> </span>Filters by :</h3>
                            </div>
                            <div className="d-flex flex-column align-items-start w-100 mt-3 border-bottom border-2 pb-3">
                                <input type="text"
                                    placeholder="Search here by location ..."
                                    className="shipping-input-field"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)} />
                            </div>
                            <div className="d-flex flex-column align-items-start w-100 mt-3 border-bottom border-2 pb-3">
                                <h6>SERVICES</h6>
                                <div className="gap-3 d-flex mt-2 mb-2">
                                    <input className="form-check-input" type="checkbox" value="containers" id="containers" onChange={handleServiceChange} />
                                    <label className="text-secondary">Containers</label>
                                </div>
                                <div className="gap-3 d-flex mt-2 mb-2">
                                    <input className="form-check-input" type="checkbox" value="car" id="car" onChange={handleServiceChange} />
                                    <label className="text-secondary">Cars</label>
                                </div>
                            </div>
                            <div className="d-flex flex-column align-items-start w-100 mt-4 mb-4 border-bottom border-2 pb-4">
                                <h6>PICK UP COUNTRY</h6>
                                <span className="w-100 w-md-75">
                                    <Countries_selector onSelectCountry={handlePickupCountrySelect} bgcolor='#f6f6f6' borderradiuscount='5px' paddingcount='12px' />
                                </span>
                            </div>
                            <div className="d-flex flex-column align-items-start w-100  mb-4 border-bottom border-2 pb-4">
                                <h6>DESTINATION COUNTRY</h6>
                                <span className="w-100 w-md-75">
                                    <Countries_selector onSelectCountry={handleDestinationCountrySelect} bgcolor='#f6f6f6' borderradiuscount='5px' paddingcount='12px' />
                                </span>
                            </div>
                            <div className="d-flex flex-column align-items-start w-100 mb-4 border-bottom border-2 pb-4">
                                <h6>DURATION</h6>
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
                        <div className="d-flex flex-column align-items-start justify-content-start p-3 ps-4 col-12 col-md-9 border-start border-1">
                            <div className="search-result-wrap w-100">
                                <div className="title-head text-start"   >
                                    <h3>Search Results </h3>
                                </div>
                                {companies ? (
                                    <>
                                        {filteredData.length > 0 ? (
                                            <>
                                                {currentItems.map((item, index) => (
                                                    <div className="search-result-data-wrap" id="listContainer" onClick={() => View_details(item)}>
                                                        <div className="d-flex flex-column align-items-start justify-content-start" key={index}>
                                                            <div className="search-result-logo-wrap">
                                                                <img
                                                                    src={item.logo ? item.logo : "https://png.pngtree.com/png-clipart/20230915/original/pngtree-global-icon-for-web-design-logo-app-isolated-vector-vector-png-image_12189325.png"}
                                                                    alt="Logo"
                                                                />
                                                            </div>
                                                            <div className="d-flex justify-content-between w-100">
                                                                <span><strong className="fs-5 pe-2">{item.company_name}</strong><span className="text-primary"><HiBadgeCheck /></span></span>
                                                                <h6 className="text-primary" onClick={() => View_details(item)}><u>View Details</u></h6>
                                                            </div>
                                                            <p className="mt-2"><span className="text-warning pe-1"><FaStar /></span> 4.65 <span className="text-secondary">(20 Ratings)</span></p>
                                                            <p className="mt-2 text-start text-secondary">{item.description.split(" ").slice(0, 30).join(" ") + "..."}</p>
                                                            <div className="d-flex flex-column flex-md-row gap-4">
                                                                <div className="pe-3 border-end border-1">
                                                                    <FaLocationDot className='fs-4 pe-1 ' style={{ color: '#FF5722' }} /> <span className="text-secondary">{item.location1.split(",")[0].trim()}</span>
                                                                </div>
                                                                <div className="pe-3 border-end border-1">
                                                                    <FaTruckLoading className='fs-4 pe-1    ' style={{ color: '#FF5722' }} /> <span className="text-secondary">2k+ Delivery Completed</span>
                                                                </div>
                                                                <div className="pe-3">
                                                                    <FaTruckMoving className='fs-4 pe-1 ' style={{ color: '#FF5722' }} /> <span className="text-secondary">Offers {item.container_service ? 'Containers' : ''}{item.car_service ? ' & Cars' : ''}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                                <ReactPaginate
                                                    previousLabel={"<"}
                                                    nextLabel={">"}
                                                    breakLabel={"..."}
                                                    pageCount={pageCount}
                                                    marginPagesDisplayed={2}
                                                    pageRangeDisplayed={3}
                                                    onPageChange={handlePageClick}
                                                    containerClassName={"pagination justify-content-center"}
                                                    pageClassName={"page-item"}
                                                    pageLinkClassName={"page-link"}
                                                    previousClassName={"page-item"}
                                                    previousLinkClassName={"page-link"}
                                                    nextClassName={"page-item"}
                                                    nextLinkClassName={"page-link"}
                                                    breakClassName={"page-item"}
                                                    breakLinkClassName={"page-link"}
                                                    activeClassName={"active"}
                                                />
                                            </>
                                        ) : (
                                            <div className="search-result-data-wrap bg-light" >
                                                <div className="d-flex flex-column align-items-start justify-content-start">

                                                    <div className="d-flex flex-column flex-md-row gap-4">

                                                        <h2>No Data</h2>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="search-result-data-wrap bg-light" >
                                        <div className="d-flex flex-column align-items-start justify-content-start">

                                            <div className="d-flex flex-column flex-md-row gap-4">

                                                <h2>No Data</h2>
                                            </div>
                                        </div>
                                    </div>
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
                    </div>
                </div>
            </section>

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