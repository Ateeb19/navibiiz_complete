import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { FaLocationDot, FaMapLocationDot, FaWeightHanging, FaWeightScale } from "react-icons/fa6";
import { FaTruckLoading, FaTruckMoving, FaStar, FaFilter, FaCity, FaCalendarAlt } from "react-icons/fa";
import Countries_selector from "../Selector/Countries_selector";
import axios from "axios";
import { BsFillBoxSeamFill, BsFillFileZipFill, BsFillSendFill } from "react-icons/bs";
import { SiAnytype, SiNamemc } from "react-icons/si";
import { RiExpandHeightFill, RiExpandWidthFill } from "react-icons/ri";
import { FaRuler } from "react-icons/fa";
import Form from 'react-bootstrap/Form';
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAlert } from "../alert/Alert_message";
import { MdAttachEmail, MdOutlineDriveFileRenameOutline } from "react-icons/md";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { RxCross2, RxDimensions } from "react-icons/rx";
import { BiSolidContact, BiWorld } from "react-icons/bi";
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import ToggleButton from 'react-toggle-button';
import { IoIosInformationCircle } from "react-icons/io";
import { GiCardPickup } from "react-icons/gi";

const Offers = () => {
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const itemsPerPage = 5;
    const port = process.env.REACT_APP_SECRET;
    const token = localStorage.getItem('token');
    const [groupage, setGroupage] = useState([]);

    const [selectedPickupCountry, setSelectedPickupCountry] = useState('');
    const [selectedDestinationCountry, setSelectedDestinationCountry] = useState('');
    const [bidAmount, setBidAmount] = useState('');
    const [expetedDate, setExpetedDate] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [toggleValue, setToggleValue] = useState(true);
    const [office_address, setOffice_address] = useState('');
    // const handlePickupCountrySelect = (country) => {
    //     setSelectedPickupCountry(country);
    // };

    useEffect(() => {
        const filtersToSave = {
            selectedPickupCountry,
            selectedDestinationCountry,
            searchQuery
        };
        localStorage.setItem("offerFilters", JSON.stringify(filtersToSave));
    }, [selectedPickupCountry, selectedDestinationCountry, searchQuery]);


    useEffect(() => {
        const savedFilters = JSON.parse(localStorage.getItem("filters")) || {};

        if (savedFilters.selectedPickupCountry) {
            setSelectedPickupCountry(savedFilters.selectedPickupCountry);
        }
        if (savedFilters.selectedDestinationCountry) {
            setSelectedDestinationCountry(savedFilters.selectedDestinationCountry);
        }
        if (savedFilters.searchQuery) {
            setSearchQuery(savedFilters.searchQuery);
        }
    }, []);


    useEffect(() => {
        const savedFilters = JSON.parse(localStorage.getItem("offerFilters"));

        if (savedFilters) {
            const { selectedPickupCountry, selectedDestinationCountry, searchQuery } = savedFilters;

            if (selectedPickupCountry) {
                setSelectedPickupCountry(selectedPickupCountry);
                handlePickupCountrySelect(selectedPickupCountry);

                // Force the select element to show the saved value
                const pickupSelect = document.querySelector('#pickup-selector select');
                if (pickupSelect) pickupSelect.value = selectedPickupCountry;
            }

            if (selectedDestinationCountry) {
                setSelectedDestinationCountry(selectedDestinationCountry);
                handleDestinationCountrySelect(selectedDestinationCountry);

                // Same for destination selector
                const destinationSelect = document.querySelector('#destination-selector select');
                if (destinationSelect) destinationSelect.value = selectedDestinationCountry;
            }

            if (searchQuery) {
                setSearchQuery(searchQuery);
            }
        }
        axios.get(`${port}/send_groupage/show_grouage`, {
            headers: {
                Authorization: token,
            },
        }).then((response) => {
            const updatedData = response.data.message.map(item => ({
                ...item,
                days_ago: getDaysAgo(item.created_at)
            }));
            setGroupage(updatedData);
        }).catch((err) => {
            console.log(err);
        });
    }, []);

    const getDaysAgo = (createdAt) => {
        const createdDate = new Date(createdAt);
        const currentDate = new Date();
        const timeDiff = currentDate - createdDate;
        const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        return daysAgo === 0 ? "Today" : `${daysAgo} days ago`;
    };

    const handlePickupCountrySelect = (country) => {
        setSelectedPickupCountry(country);
        const filters = JSON.parse(localStorage.getItem("filters")) || {};
        filters.selectedPickupCountry = country;
        localStorage.setItem("filters", JSON.stringify(filters));
    };


    const handleDestinationCountrySelect = (country) => {
        setSelectedDestinationCountry(country);
        const filters = JSON.parse(localStorage.getItem("filters")) || {};
        filters.selectedDestinationCountry = country;
        localStorage.setItem("filters", JSON.stringify(filters));
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        const filters = JSON.parse(localStorage.getItem("filters")) || {};
        filters.searchQuery = value;
        localStorage.setItem("filters", JSON.stringify(filters));
    };

    const clearPickupFilter = () => {
        setSelectedPickupCountry('');
        const filters = JSON.parse(localStorage.getItem("filters")) || {};
        filters.selectedPickupCountry = '';
        localStorage.setItem("filters", JSON.stringify(filters));
    };

    const clearDestinationFilter = () => {
        setSelectedDestinationCountry('');
        const filters = JSON.parse(localStorage.getItem("filters")) || {};
        filters.selectedDestinationCountry = '';
        localStorage.setItem("filters", JSON.stringify(filters));
    };

    const filterData = (data) => {
        return data
            .filter((groupage) => {
                const pickupCountryMatch =
                    !selectedPickupCountry || groupage.sender_country === selectedPickupCountry;

                const destinationCountryMatch =
                    !selectedDestinationCountry || groupage.receiver_country === selectedDestinationCountry;

                const searchMatch =
                    !searchQuery ||
                    [
                        groupage.receiver_city,
                        groupage.receiver_country,
                        groupage.receiver_state,
                        groupage.sender_city,
                        groupage.sender_country,
                        groupage.sender_state
                    ]
                        .filter(Boolean)
                        .some((location) =>
                            location.toLowerCase().includes(searchQuery.toLowerCase())
                        );

                return pickupCountryMatch && destinationCountryMatch && searchMatch;
            })
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    };
    const filteredData = filterData(groupage);
    const [groupage_detail, setGroupage_detail] = useState(null);
    const View_details = (item) => {
        setGroupage_detail(item);
    }

    const [dateError, setDateError] = useState(false);
    const [offer_success, setOffer_success] = useState(false);

    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        },
    ]);

    const formattedRange = `${dateRange[0].startDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })} - ${dateRange[0].endDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })}`;

    const handleSelect = (ranges) => {
        setDateRange([ranges.selection]);
        console.log(formattedRange);
    };

    const handleSubmit_offer = (details) => {
        if (bidAmount === '') {
            showAlert('Please fill all the fields');
            return;
        }

        if (!dateRange) {
            showAlert('Please fill all the fields');
            setDateError(true);
            return;
        }

        const integerBidAmount = parseFloat(parseFloat(bidAmount).toFixed(2));
        if (integerBidAmount < 1) {
            showAlert('Bid amount cannot be Zero 0');
            return;
        }

        if (!toggleValue) {
            if (!office_address) {
                showAlert("Fill the Office Address");
                return;
            }
        }


        const data = {
            offer_id: details.id,
            offer_amount: integerBidAmount,
            expected_date: formattedRange,
            office_address: office_address,
        };

        axios.post(`${port}/send_groupage/create_offer`, data, {
            headers: {
                Authorization: token,
            },
        }).then((response) => {
            if (response.data.status === false) {
                showAlert('Login as a transporter to submit an offer');
                navigate('/login');
            } else {
                showAlert("Offer Created Successfully!");
                setOffer_success(true);
                setGroupage_detail(null);
                setBidAmount('');
                setExpetedDate('');
            }
        }).catch((err) => {
            showAlert('Login as a transporter to submit an offer');
            setOffer_success(false);
            navigate('/login');
        });
    };

    console.log(groupage_detail)
    const [show_image, setShow_image] = useState(false);

    const [currentPage, setCurrentPage] = useState(0);
    const offset = currentPage * itemsPerPage;
    const currentItems = filteredData.slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(filteredData.length / itemsPerPage);

    useEffect(() => {
        const smoothScroll = () => {
            let scrollY = window.scrollY || document.documentElement.scrollTop;
            if (scrollY > 0) {
                window.scrollTo(0, scrollY - Math.max(20, scrollY / 0));
                requestAnimationFrame(smoothScroll);
            }
        };

        smoothScroll();
    }, [currentPage]);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const [images, setImages] = useState([
        {
            original: '',
            thumbnail: ''
        }
    ]);


    return (
        <div className="d-flex flex-column align-items-center justify-content-center mt-5 pt-5">
            <div className='navbar-wrapper'>
                <div className=" d-flex justify-content-center w-100">
                    <Navbar />
                </div>
            </div>
            <section className="search-result-wrapper w-100">
                <div className="container">
                    <div className="d-flex flex-column flex-md-row justify-content-center align-items-start mt-3 mt-md-5 w-100">
                        <div className="d-flex flex-column align-items-start p-3 ps-md-5 pb-5 col-12 col-md-3">
                            <div className="title-head">
                                <h3><span style={{ color: ' #de8316' }}><FaFilter /> </span>Filters by :</h3>
                            </div>
                            {(selectedPickupCountry || selectedDestinationCountry) && (
                                <div className="d-flex flex-column align-items-start w-100 mt-3 border-bottom border-2 pb-1 text-start">
                                    {selectedPickupCountry && (
                                        <span className="mb-2 w-100">
                                            <h6 style={{ fontWeight: '600' }}>Pick up Country:</h6>
                                            <div className="d-flex justify-content-between align-items-center w-100">
                                                {selectedPickupCountry}
                                                <RxCross2 onClick={clearPickupFilter} />
                                            </div>
                                        </span>
                                    )}
                                    {selectedDestinationCountry && (
                                        <span className="w-100">
                                            <h6 style={{ fontWeight: '600' }}>Destination Country:</h6>
                                            <div className="d-flex justify-content-between align-items-center w-100">
                                                {selectedDestinationCountry}
                                                <RxCross2 onClick={clearDestinationFilter} />
                                            </div>
                                        </span>
                                    )}
                                </div>
                            )}

                            <div className="d-flex flex-column align-items-start w-100 mt-3 border-bottom border-2 pb-3">
                                <input
                                    type="text"
                                    placeholder="Search here by location ..."
                                    className="shipping-input-field"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </div>
                            <div className="d-flex flex-column align-items-start w-100 mt-4 mb-4 border-bottom border-2 pb-4">
                                <h6>PICK UP COUNTRY</h6>
                                <span className="w-100 w-md-75">
                                    <Countries_selector
                                        selectedCountry={selectedPickupCountry}
                                        onSelectCountry={handlePickupCountrySelect}
                                        bgcolor='#f6f6f6'
                                        borderradiuscount='5px'
                                        paddingcount='12px'
                                    />
                                </span>
                            </div>
                            <div className="d-flex flex-column align-items-start w-100 mt-4 mb-4 border-bottom border-2 pb-4">
                                <h6>DESTINATION COUNTRY</h6>
                                <span className="w-100 w-md-75">
                                    <Countries_selector
                                        selectedCountry={selectedDestinationCountry}
                                        onSelectCountry={handleDestinationCountrySelect}
                                        bgcolor='#f6f6f6'
                                        borderradiuscount='5px'
                                        paddingcount='12px'
                                    />
                                </span>
                            </div>

                        </div>
                        <div className="d-flex flex-column align-items-start justify-content-start p-3 ps-md-4 col-12 col-md-9 border-start border-1">
                            <div className="search-result-wrap w-100">
                                <div className="title-head text-start">
                                    <h3>Search Results </h3>
                                </div>
                                {groupage ? (
                                    <>
                                        {filteredData.length > 0 ? (
                                            <>
                                                {currentItems.map((item, index) => (
                                                    <div className="search-result-data-wrap" key={index} onClick={() => View_details(item)}>
                                                        <div className="d-flex flex-column align-items-start justify-content-start">
                                                            <div className="search-result-logo-wrap">
                                                                <img
                                                                    src={item.img01 ? item.img01 : "https://png.pngtree.com/png-clipart/20230915/original/pngtree-global-icon-for-web-design-logo-app-isolated-vector-vector-png-image_12189325.png"}
                                                                    alt="Profile"
                                                                />
                                                            </div>
                                                            <div className="d-flex justify-content-between w-100">
                                                                <span><strong className="fs-5 pe-2">{item.product_name ? item.product_name : 'Boxes'}</strong></span>
                                                                <h5 className="" style={{ color: '#de8316' }} onClick={() => View_details(item)}><u>Submit Offer</u></h5>
                                                            </div>
                                                            <p className="mt-2 me-1">
                                                                {item.sender_country?.slice(0, 3)}{" "}
                                                                <span className="text-primary me-1"><BsFillSendFill /></span>
                                                                {item.receiver_country?.slice(0, 3)}
                                                            </p>
                                                            {/* <p className="mt-2 text-start text-secondary">{item.sender_description ? item.sender_description.split(" ").slice(0, 30).join(" ") + "..." : item.sender_description}</p> */}
                                                            <div className="d-flex flex-column flex-md-row gap-4 text-start">

                                                                <div className="pe-3">
                                                                    <FaCalendarAlt className='fs-5 pe-1' style={{ color: '#de8316' }} /> <span className="text-secondary">Posted {item.days_ago} </span>
                                                                </div>
                                                                <div className="pe-3 border-end border-1">
                                                                    {item.box ? <>
                                                                        <BsFillBoxSeamFill className='fs-4 pe-1' style={{ color: '#de8316' }} /> <span className="text-secondary">{item.box ? `Box No. : ${item.box_number}` : `Weight: ${item.p_weight}`}</span>
                                                                    </> : <>

                                                                        {/* <FaWeightHanging className='fs-4 pe-1' style={{ color: '#de8316' }} /> <span className="text-secondary">{item.box ? `Box No. : ${item.box_number}` : `Weight: ${item.p_weight}`}</span> */}
                                                                    </>}
                                                                </div>
                                                                {/* <div className="pe-3 border-end border-1">
                                                                    <FaTruckLoading className='fs-4 pe-1' style={{ color: '#de8316' }} /> <span className="text-secondary">Pick up: {
                                                                        // item.pickup_date ? item.pickup_date.includes('Select End Date') ? item.pickup_date.split(' - ')[0] : item.pickup_date : 'null'
                                                                        item.pickup_date && item.pickup_date !== 'null'
                                                                            ? item.pickup_date.includes('Select End Date')
                                                                                ? item.pickup_date.split(' - ')[0] || '-'
                                                                                : item.pickup_date.split(' - ')[0] || '-'
                                                                            : '-'
                                                                    }</span>
                                                                </div> */}
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
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="search-result-data-wrap bg-light" >
                                        <div className="d-flex flex-column align-items-start justify-content-start">

                                            <div className="d-flex flex-column flex-md-row gap-4">
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {groupage_detail && (
                                    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                                        style={{
                                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                            zIndex: 9999
                                        }}
                                    >
                                        <div className="bg-light rounded shadow p-4 position-relative border border-2 border-dark"
                                            style={{
                                                width: '90%',
                                                maxWidth: '1100px',
                                                height: '90vh',
                                                overflowY: 'auto'
                                            }}
                                        >
                                            <div className="d-flex flex-column justify-content-start">
                                                <button className="btn btn-danger position-absolute top-0 end-0 m-2" onClick={() => setGroupage_detail(null)}>
                                                    ✕
                                                </button>

                                                <div className="title-head text-start">
                                                    <h3>Submitting an Offer</h3>
                                                </div>
                                                <span className="mt-2 text-start w-100">Offer ID: <span className="text-primary"> #{groupage_detail.id}</span></span>

                                                <div className="offer-details-wrap">
                                                    <h5 className="text-start w-100 mb-3 fs-6">{groupage_detail.box ? "Box Images" : "Product Images"}</h5>
                                                    <div className="d-flex flex-wrap gap-2"
                                                        onClick={() => {
                                                            const imageList = [
                                                                groupage_detail.img01, groupage_detail.img02, groupage_detail.img03, groupage_detail.img04, groupage_detail.img05,
                                                                groupage_detail.img06, groupage_detail.img07, groupage_detail.img08, groupage_detail.img09, groupage_detail.img10,
                                                            ].filter(img => img);

                                                            const formattedImages = imageList.map(img => ({
                                                                original: img,
                                                                thumbnail: img,
                                                                originalHeight: "500",
                                                            }));

                                                            setImages(formattedImages);
                                                            setShow_image(true);
                                                        }}
                                                    >
                                                        {groupage_detail.img01 ? (
                                                            <>
                                                                {[
                                                                    groupage_detail.img01, groupage_detail.img02, groupage_detail.img03, groupage_detail.img04, groupage_detail.img05,
                                                                    groupage_detail.img06, groupage_detail.img07, groupage_detail.img08, groupage_detail.img09, groupage_detail.img10,
                                                                ]
                                                                    .filter(img => img)
                                                                    .map((img, index) => (
                                                                        <img
                                                                            key={index}
                                                                            src={img}
                                                                            alt={`Product ${index + 1}`}
                                                                            style={{
                                                                                width: '18%',
                                                                                maxWidth: '120px',
                                                                                height: 'auto',
                                                                                objectFit: 'cover',
                                                                                borderRadius: '8px',
                                                                            }}
                                                                        // onClick={() => setShow_image(img)}
                                                                        />
                                                                    ))}
                                                            </>
                                                        ) : <>
                                                            <span>No Image provided.</span>
                                                        </>}

                                                    </div>
                                                </div>


                                                {groupage_detail.box ? <>
                                                    <div className="offer-details-wrap">
                                                        <h5 className="text-start w-100 mb-3 fs-6">Box Details</h5>

                                                        <div className="d-flex flex-column flex-md-row flex-md-wrap gap-3 w-100">
                                                            <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 shipping-selection" style={{ width: '100%', maxWidth: '45%' }}>
                                                                <div
                                                                    className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                                    style={{
                                                                        width: '3rem',
                                                                        height: '3rem',
                                                                        backgroundColor: '#E1F5FF',
                                                                        aspectRatio: '1 / 1'
                                                                    }}
                                                                ><RxDimensions /></div>
                                                                <div className="d-flex flex-column align-items-start gap-2">
                                                                    <span className="text-secondary offer-submit-sub-head">Box dimensions</span>
                                                                    <h6>{groupage_detail.box_dimension}</h6>
                                                                </div>
                                                            </div>

                                                            <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 shipping-selection" style={{ width: '100%', maxWidth: '45%' }}>
                                                                <div
                                                                    className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                                    style={{
                                                                        width: '3rem',
                                                                        height: '3rem',
                                                                        backgroundColor: '#E1F5FF',
                                                                        aspectRatio: '1 / 1'
                                                                    }}
                                                                >
                                                                    <BsFillBoxSeamFill />
                                                                </div>
                                                                <div className="d-flex flex-column align-items-start gap-2">
                                                                    <span className="text-secondary offer-submit-sub-head">Number of Boxes</span>
                                                                    <h6>{groupage_detail.box_number}</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex flex-column flex-md-row flex-md-wrap gap-3 w-100">

                                                            <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 shipping-selection" style={{ width: '100%', maxWidth: '90%' }}>
                                                                <div
                                                                    className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                                    style={{
                                                                        width: '3rem',
                                                                        height: '3rem',
                                                                        backgroundColor: '#E1F5FF',
                                                                        aspectRatio: '1 / 1'
                                                                    }}
                                                                ><IoIosInformationCircle /></div>
                                                                <div className="d-flex flex-column align-items-start gap-2">
                                                                    <span className="text-secondary offer-submit-sub-head">Box Info</span>
                                                                    <h6>{groupage_detail.box_info ? groupage_detail.box_info : 'null'}</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </> : <>
                                                    <div className="offer-details-wrap">
                                                        <h5 className="text-start w-100 mb-3 fs-6">Product Details</h5>

                                                        <div className="d-flex flex-column flex-md-row flex-md-wrap gap-3 w-100">
                                                            <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 shipping-selection" style={{ width: '100%', maxWidth: '30%' }}>
                                                                <div
                                                                    className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                                    style={{
                                                                        width: '3rem',
                                                                        height: '3rem',
                                                                        backgroundColor: '#E1F5FF',
                                                                        aspectRatio: '1 / 1'
                                                                    }}
                                                                ><MdOutlineDriveFileRenameOutline /></div>
                                                                <div className="d-flex flex-column align-items-start gap-2">
                                                                    <span className="text-secondary offer-submit-sub-head">Product Name</span>
                                                                    <h6>{groupage_detail.product_name}</h6>
                                                                </div>
                                                            </div>

                                                            {/* <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 shipping-selection" style={{ width: '100%', maxWidth: '30%' }}>
                                                                <div
                                                                    className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                                    style={{
                                                                        width: '3rem',
                                                                        height: '3rem',
                                                                        backgroundColor: '#E1F5FF',
                                                                        aspectRatio: '1 / 1'
                                                                    }}
                                                                >
                                                                    <SiAnytype />
                                                                </div>
                                                                <div className="d-flex flex-column align-items-start gap-2">
                                                                    <span className="text-secondary offer-submit-sub-head">Product Type</span>
                                                                    <h6>{groupage_detail.product_type ? groupage_detail.product_type : '-'}</h6>
                                                                </div>
                                                            </div>

                                                            <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 shipping-selection" style={{ width: '100%', maxWidth: '30%' }}>
                                                                <div
                                                                    className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                                    style={{
                                                                        width: '3rem',
                                                                        height: '3rem',
                                                                        backgroundColor: '#E1F5FF',
                                                                        aspectRatio: '1 / 1'
                                                                    }}
                                                                ><FaWeightScale /></div>
                                                                <div className="d-flex flex-column align-items-start gap-2">
                                                                    <span className="text-secondary offer-submit-sub-head">Weight</span>
                                                                    <h6>{groupage_detail.p_weight} Kg</h6>
                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className="d-flex flex-column flex-md-row flex-md-wrap gap-3 w-100">

                                                            <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 shipping-selection" style={{ width: '100%', maxWidth: '30%' }}>
                                                                <div
                                                                    className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                                    style={{
                                                                        width: '3rem',
                                                                        height: '3rem',
                                                                        backgroundColor: '#E1F5FF',
                                                                        aspectRatio: '1 / 1'
                                                                    }}
                                                                ><RiExpandHeightFill /></div>
                                                                <div className="d-flex flex-column align-items-start gap-2">
                                                                    <span className="text-secondary offer-submit-sub-head">Height</span>
                                                                    <h6>{groupage_detail.p_height} Cm</h6>
                                                                </div>
                                                            </div>

                                                            <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 shipping-selection" style={{ width: '100%', maxWidth: '30%' }}>
                                                                <div
                                                                    className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                                    style={{
                                                                        width: '3rem',
                                                                        height: '3rem',
                                                                        backgroundColor: '#E1F5FF',
                                                                        aspectRatio: '1 / 1'
                                                                    }}
                                                                ><FaRuler /></div>
                                                                <div className="d-flex flex-column align-items-start gap-2">
                                                                    <span className="text-secondary offer-submit-sub-head">Length</span>
                                                                    <h6>{groupage_detail.p_length} Cm</h6>
                                                                </div>
                                                            </div>

                                                            <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 shipping-selection" style={{ width: '100%', maxWidth: '30%' }}>
                                                                <div
                                                                    className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                                    style={{
                                                                        width: '3rem',
                                                                        height: '3rem',
                                                                        backgroundColor: '#E1F5FF',
                                                                        aspectRatio: '1 / 1'
                                                                    }}
                                                                ><RiExpandWidthFill /></div>
                                                                <div className="d-flex flex-column align-items-start gap-2">
                                                                    <span className="text-secondary offer-submit-sub-head">Width</span>
                                                                    <h6>{groupage_detail.p_width} Cm</h6>
                                                                </div>
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                </>}


                                                <div className="offer-details-wrap">
                                                    <h5 className="text-start w-100 mb-3 fs-6">Pick Up Information</h5>

                                                    <div className="d-flex flex-column flex-md-row flex-md-wrap gap-3 w-100">
                                                        <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 shipping-selection" style={{ width: '100%', maxWidth: '30%' }}>
                                                            <div
                                                                className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                                style={{
                                                                    width: '3rem',
                                                                    height: '3rem',
                                                                    backgroundColor: '#E1F5FF',
                                                                    aspectRatio: '1 / 1'
                                                                }}
                                                            ><BiWorld /></div>
                                                            <div className="d-flex flex-column align-items-start gap-2">
                                                                <span className="text-secondary offer-submit-sub-head">Country</span>
                                                                <h6>{groupage_detail.sender_country}</h6>
                                                            </div>
                                                        </div>

                                                        <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 shipping-selection" style={{ width: '100%', maxWidth: '30%' }}>
                                                            <div
                                                                className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                                style={{
                                                                    width: '3rem',
                                                                    height: '3rem',
                                                                    backgroundColor: '#E1F5FF',
                                                                    aspectRatio: '1 / 1'
                                                                }}
                                                            ><FaMapLocationDot /></div>
                                                            <div className="d-flex flex-column align-items-start gap-2">
                                                                <span className="text-secondary offer-submit-sub-head">State</span>
                                                                <h6>{groupage_detail.sender_state}</h6>
                                                            </div>
                                                        </div>

                                                        <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 shipping-selection" style={{ width: '100%', maxWidth: '30%' }}>
                                                            <div
                                                                className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                                style={{
                                                                    width: '3rem',
                                                                    height: '3rem',
                                                                    backgroundColor: '#E1F5FF',
                                                                    aspectRatio: '1 / 1'
                                                                }}
                                                            ><FaCity /></div>
                                                            <div className="d-flex flex-column align-items-start gap-2">
                                                                <span className="text-secondary offer-submit-sub-head">City</span>
                                                                <h6>{groupage_detail.sender_city}</h6>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="d-flex flex-column flex-md-row flex-md-wrap gap-3 w-100">
                                                        <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 shipping-selection" style={{ width: '100%', maxWidth: '30%' }}>
                                                            <div
                                                                className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                                style={{
                                                                    width: '3rem',
                                                                    height: '3rem',
                                                                    backgroundColor: '#E1F5FF',
                                                                    aspectRatio: '1 / 1'
                                                                }}
                                                            ><SiNamemc /></div>
                                                            <div className="d-flex flex-column align-items-start gap-2">
                                                                <span className="text-secondary offer-submit-sub-head">Customer Name</span>
                                                                <h6>XXXX</h6>
                                                            </div>
                                                        </div>

                                                        <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 shipping-selection" style={{ width: '100%', maxWidth: '30%' }}>
                                                            <div
                                                                className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                                style={{
                                                                    width: '3rem',
                                                                    height: '3rem',
                                                                    backgroundColor: '#E1F5FF',
                                                                    aspectRatio: '1 / 1'
                                                                }}
                                                            ><BiSolidContact /></div>
                                                            <div className="d-flex flex-column align-items-start gap-2">
                                                                <span className="text-secondary offer-submit-sub-head">Contact Number </span>
                                                                <h6>{groupage_detail.sender_contact}...</h6>
                                                            </div>
                                                        </div>

                                                        <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 shipping-selection" style={{ width: '100%', maxWidth: '30%' }}>
                                                            <div
                                                                className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                                style={{
                                                                    width: '3rem',
                                                                    height: '3rem',
                                                                    backgroundColor: '#E1F5FF',
                                                                    aspectRatio: '1 / 1'
                                                                }}
                                                            ><MdAttachEmail /></div>
                                                            <div className="d-flex flex-column align-items-start gap-2">
                                                                <span className="text-secondary offer-submit-sub-head">Email ID</span>
                                                                <h6>XXXX</h6>
                                                            </div>
                                                        </div>
                                                    </div>


                                                    {/* <div className="d-flex flex-column flex-md-row flex-md-wrap gap-3 w-100">
                                                        <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 shipping-selection" style={{ width: '100%', maxWidth: '30%' }}>
                                                            <div
                                                                className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                                style={{
                                                                    width: '3rem',
                                                                    height: '3rem',
                                                                    backgroundColor: '#E1F5FF',
                                                                    aspectRatio: '1 / 1'
                                                                }}
                                                            ><BsFillFileZipFill /></div>
                                                            <div className="d-flex flex-column align-items-start gap-2">
                                                                <span className="text-secondary offer-submit-sub-head">Zip Code</span>
                                                                <h6>{groupage_detail.sender_zipcode ? groupage_detail.sender_zipcode : '-'}</h6>
                                                            </div>
                                                        </div>

                                                        <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 shipping-selection" style={{ width: '100%', maxWidth: '30%' }}>
                                                            <div
                                                                className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                                style={{
                                                                    width: '3rem',
                                                                    height: '3rem',
                                                                    backgroundColor: '#E1F5FF',
                                                                    aspectRatio: '1 / 1'
                                                                }}
                                                            ><GiCardPickup /></div>
                                                            <div className="d-flex flex-column align-items-start gap-2">
                                                                <span className="text-secondary offer-submit-sub-head">Pick Up Date</span>
                                                                <h6 className="text-start">{
                                                                    groupage_detail.pickup_date && groupage_detail.pickup_date !== 'null'
                                                                        ? groupage_detail.pickup_date.includes('Select End Date')
                                                                            ? groupage_detail.pickup_date.split(' - ')[0] || '-'
                                                                            : groupage_detail.pickup_date.split(' - ')[0] || '-'
                                                                        : '-'
                                                                    // groupage_detail.pickup_date ? groupage_detail.pickup_date.includes('Select End Date') ? groupage_detail.pickup_date.split('-')[0] : groupage_detail.pickup_date : 'null'
                                                                }</h6>
                                                            </div>
                                                        </div>
                                                    </div> */}
                                                </div>

                                                <div className="offer-details-wrap">

                                                    <h5 className="text-start w-100 mb-3 fs-6">Delivery Information</h5>

                                                    <div className="d-flex flex-column flex-md-row flex-md-wrap gap-3 w-100">
                                                        <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 shipping-selection" style={{ width: '100%', maxWidth: '30%' }}>
                                                            <div
                                                                className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                                style={{
                                                                    width: '3rem',
                                                                    height: '3rem',
                                                                    backgroundColor: '#E1F5FF',
                                                                    aspectRatio: '1 / 1'
                                                                }}
                                                            ><SiNamemc /></div>
                                                            <div className="d-flex flex-column align-items-start gap-2">
                                                                <span className="text-secondary offer-submit-sub-head">Receiver’s Name</span>
                                                                <h6>XXXX</h6>
                                                            </div>
                                                        </div>

                                                        <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 shipping-selection" style={{ width: '100%', maxWidth: '30%' }}>
                                                            <div
                                                                className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                                style={{
                                                                    width: '3rem',
                                                                    height: '3rem',
                                                                    backgroundColor: '#E1F5FF',
                                                                    aspectRatio: '1 / 1'
                                                                }}
                                                            ><BiSolidContact /></div>
                                                            <div className="d-flex flex-column align-items-start gap-2">
                                                                <span className="text-secondary offer-submit-sub-head">Contact Number </span>
                                                                <h6>{groupage_detail.receiver_contact}...</h6>
                                                            </div>
                                                        </div>

                                                        <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 shipping-selection" style={{ width: '100%', maxWidth: '30%' }}>
                                                            <div
                                                                className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                                style={{
                                                                    width: '3rem',
                                                                    height: '3rem',
                                                                    backgroundColor: '#E1F5FF',
                                                                    aspectRatio: '1 / 1'
                                                                }}
                                                            ><BiWorld /></div>
                                                            <div className="d-flex flex-column align-items-start gap-2">
                                                                <span className="text-secondary offer-submit-sub-head">Country</span>
                                                                <h6>{groupage_detail.receiver_country ? groupage_detail.receiver_country : '-'}</h6>
                                                            </div>
                                                        </div>

                                                        {/* <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 shipping-selection" style={{ width: '100%', maxWidth: '30%' }}>
                                                            <div
                                                                className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                                style={{
                                                                    width: '3rem',
                                                                    height: '3rem',
                                                                    backgroundColor: '#E1F5FF',
                                                                    aspectRatio: '1 / 1'
                                                                }}
                                                            ><MdAttachEmail /></div>
                                                            <div className="d-flex flex-column align-items-start gap-2">
                                                                <span className="text-secondary offer-submit-sub-head">Email ID</span>
                                                                <h6>XXXX@gmail.com</h6>
                                                            </div>
                                                        </div> */}
                                                    </div>
                                                    {/* <div className="d-flex flex-column flex-md-row flex-md-wrap gap-3 w-100">
                                                        <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 shipping-selection" style={{ width: '100%', maxWidth: '30%' }}>
                                                            <div
                                                                className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                                style={{
                                                                    width: '3rem',
                                                                    height: '3rem',
                                                                    backgroundColor: '#E1F5FF',
                                                                    aspectRatio: '1 / 1'
                                                                }}
                                                            ><BiWorld /></div>
                                                            <div className="d-flex flex-column align-items-start gap-2">
                                                                <span className="text-secondary offer-submit-sub-head">Country</span>
                                                                <h6>{groupage_detail.receiver_country ? groupage_detail.receiver_country : '-'}</h6>
                                                            </div>
                                                        </div>

                                                        <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 shipping-selection" style={{ width: '100%', maxWidth: '30%' }}>
                                                            <div
                                                                className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                                style={{
                                                                    width: '3rem',
                                                                    height: '3rem',
                                                                    backgroundColor: '#E1F5FF',
                                                                    aspectRatio: '1 / 1'
                                                                }}
                                                            ><FaMapLocationDot /></div>
                                                            <div className="d-flex flex-column align-items-start gap-2">
                                                                <span className="text-secondary offer-submit-sub-head">State</span>
                                                                <h6>{groupage_detail.receiver_state ? groupage_detail.receiver_state : '-'}</h6>
                                                            </div>
                                                        </div>

                                                        <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 shipping-selection" style={{ width: '100%', maxWidth: '30%' }}>
                                                            <div
                                                                className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                                style={{
                                                                    width: '3rem',
                                                                    height: '3rem',
                                                                    backgroundColor: '#E1F5FF',
                                                                    aspectRatio: '1 / 1'
                                                                }}
                                                            ><FaCity /></div>
                                                            <div className="d-flex flex-column align-items-start gap-2">
                                                                <span className="text-secondary offer-submit-sub-head">City</span>
                                                                <h6>{groupage_detail.receiver_city ? groupage_detail.receiver_city : '-'}</h6>
                                                            </div>
                                                        </div>
                                                    </div> */}
                                                </div>

                                                {/* <div className="offer-details-wrap">
                                                    <h5 className="text-start w-100 mb-3 fs-6">Customer Information</h5>

                                                    <div className="d-flex flex-column flex-md-row flex-md-wrap gap-3 w-100">
                                                        <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 shipping-selection" style={{ width: '100%', maxWidth: '30%' }}>
                                                            <div
                                                                className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                                style={{
                                                                    width: '3rem',
                                                                    height: '3rem',
                                                                    backgroundColor: '#E1F5FF',
                                                                    aspectRatio: '1 / 1'
                                                                }}
                                                            ><SiNamemc /></div>
                                                            <div className="d-flex flex-column align-items-start gap-2">
                                                                <span className="text-secondary offer-submit-sub-head">Customer Name</span>
                                                                <h6>XXXX</h6>
                                                            </div>
                                                        </div>

                                                        <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 shipping-selection" style={{ width: '100%', maxWidth: '30%' }}>
                                                            <div
                                                                className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                                style={{
                                                                    width: '3rem',
                                                                    height: '3rem',
                                                                    backgroundColor: '#E1F5FF',
                                                                    aspectRatio: '1 / 1'
                                                                }}
                                                            ><BiSolidContact /></div>
                                                            <div className="d-flex flex-column align-items-start gap-2">
                                                                <span className="text-secondary offer-submit-sub-head">Contact Number </span>
                                                                <h6>{groupage_detail.sender_contact}...</h6>
                                                            </div>
                                                        </div>

                                                        <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 shipping-selection" style={{ width: '100%', maxWidth: '30%' }}>
                                                            <div
                                                                className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                                style={{
                                                                    width: '3rem',
                                                                    height: '3rem',
                                                                    backgroundColor: '#E1F5FF',
                                                                    aspectRatio: '1 / 1'
                                                                }}
                                                            ><MdAttachEmail /></div>
                                                            <div className="d-flex flex-column align-items-start gap-2">
                                                                <span className="text-secondary offer-submit-sub-head">Email ID</span>
                                                                <h6>XXXX</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div> */}

                                                <div className="offer-details-wrap">
                                                    <div className="d-flex flex-column align-items-start justify-content-start w-100 p-3 text-start">
                                                        <div className="title-head">
                                                            <h3 >Bidding Information</h3>
                                                        </div>
                                                        <span className="mt-1">What is the full amount you want to bid for this order?</span>
                                                        <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between w-100 gap-3 mt-4 border-bottom border-2 pb-2">
                                                            <div className="d-flex flex-column align-items-start justify-content-start gap-2 w-100 w-sm-50">
                                                                <span className="fs-5">Bid Amount</span>
                                                                <span className="text-secondary text-start">Total amount the client will see on your proposal</span>
                                                            </div>
                                                            <input type="text" className="form-control w-100 w-sm-50 fs-5" onChange={(e) => { const value = e.target.value.replace(/[^0-9.]/g, ""); setBidAmount(value); }} value={`€ ${bidAmount}`} />
                                                        </div>
                                                        <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-start justify-content-between w-100 gap-3 border-bottom border-2 pb-2 mt-4">
                                                            <div className="d-flex flex-column align-items-start justify-content-start gap-2 w-50 w-sm-50">
                                                                <span className="text-secondary text-start">How long will this product take to deliver?</span>


                                                                <div style={{ marginTop: '1rem' }}>
                                                                    <span className="fs-6">From:</span> {dateRange[0].startDate.toDateString()}<br />
                                                                    <span className="fs-6">To:</span> {dateRange[0].endDate.toDateString()}
                                                                </div>
                                                            </div>
                                                            {/* <Form.Select
                                                                style={{
                                                                    border: dateError ? '1px solid rgb(178, 0, 0)' : '',
                                                                    boxShadow: dateError ? '0 0 10px rgb(178, 0, 0)' : '',
                                                                }}
                                                                value={expetedDate}
                                                                onChange={(e) => {
                                                                    setExpetedDate(e.target.value);
                                                                    setDateError(false); // reset error when changed
                                                                }}
                                                            >
                                                                <option value="">Select Expected Days</option>
                                                                <option value="less_than_15_days">Less Than 15 Days</option>
                                                                <option value="more_than_15_days">More Than 15 Days</option>
                                                                <option value="more_than_30_days">More Than 30 Days</option>
                                                            </Form.Select> */}

                                                            <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
                                                                <DateRange
                                                                    ranges={dateRange}
                                                                    onChange={handleSelect}
                                                                    moveRangeOnFirstSelection={false}
                                                                    editableDateInputs={true}
                                                                />
                                                            </div>

                                                        </div>

                                                        <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between w-100 gap-3 mt-4 pb-2">
                                                            <div className="d-flex flex-column align-items-start justify-content-start gap-2 w-100 w-sm-100">
                                                                <span className="text-secondary text-start">Will you pick up the goods at the customer's given address?</span>
                                                            </div>
                                                            <div className="d-flex flex-column align-items-start justify-content-start gap-2 w-25 w-sm-100">
                                                                <ToggleButton
                                                                    value={toggleValue}
                                                                    onToggle={(val) => setToggleValue(!val)}
                                                                    activeLabel="Yes"
                                                                    inactiveLabel="No"
                                                                    colors={{
                                                                        activeThumb: {
                                                                            base: 'rgb(0, 17, 255)',
                                                                        },
                                                                        inactiveThumb: {
                                                                            base: 'rgba(78, 155, 255, 1)',
                                                                        },
                                                                        active: {
                                                                            base: 'rgb(44, 121, 253)',
                                                                            hover: 'rgb(55, 105, 190)',
                                                                        },
                                                                        inactive: {
                                                                            base: 'rgb(75, 75, 75)',
                                                                            hover: 'rgb(175, 175, 175)',
                                                                        },
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        {!toggleValue && (
                                                            <>
                                                                <div className="form-floating w-100">
                                                                    <textarea class="form-control" style={{ height: '100px' }} value={office_address} onChange={(e) => setOffice_address(e.target.value)} />
                                                                    <label for="floatingTextarea2">Office Address</label>
                                                                </div>
                                                            </>
                                                        )}

                                                        {/* <div className="d-flex w-100 flex-column align-items-start  justify-content-start">                                           
                                                            <span className="text-secondary text-start">Office Address -:</span>
                                                            <textarea className="w-100" cols={5} rows={5} />
                                                        </div> */}
                                                    </div>
                                                </div>
                                                <div className="d-flex w-100 justify-content-end">
                                                    <button className="btn-main-offer" onClick={() => handleSubmit_offer(groupage_detail)}>Submit Offer</button>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                )}

                                {show_image && (
                                    <>
                                        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                                            style={{
                                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                                zIndex: 99999
                                            }}
                                        >
                                            <div className="bg-light rounded shadow p-4 position-relative border border-2 border-dark"
                                                style={{
                                                    width: '90%',
                                                    maxWidth: '1100px',
                                                    height: '95vh',
                                                    // overflowY: 'auto'
                                                }}
                                            >
                                                <div className="d-flex flex-column justify-content-start">
                                                    <button className="btn btn-danger position-absolute top-0 end-0 m-2" onClick={() => setShow_image(false)}>
                                                        ✕
                                                    </button>
                                                    <div className="w-100 pt-4">
                                                        <ImageGallery
                                                            items={images}
                                                            showFullscreenButton={false} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {offer_success && (
                                    <>
                                        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center" style={{ zIndex: 1050 }}>

                                            <div className="position-relative bg-white p-4 rounded shadow-lg" style={{ width: '580px', height: '25rem' }}>

                                                <div className="success-img-wrap">
                                                    <img src="/Images/Party_Popper.png" alt="congratulation" />
                                                </div>

                                                <div className="title-head">
                                                    <h3 style={{ color: ' #1ba300' }}>CONGRATULATIONS</h3>
                                                </div>

                                                <div className="success-des-wrap">
                                                    <p>Offer Sent Successfully</p>
                                                </div>

                                                <div className="success-button">
                                                    <button className="btn-success" onClick={() => navigate('/dashboard')}>Go To Dashboard</button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            <div className="d-flex flex-column align-items-center mt-4 mt-md-5 text-white p-3 p-md-5 w-100" style={{ backgroundColor: "#0044BC" }}>
                <strong className="fs-3 fs-md-4 text-center">Unable to Find Your Preferred Shipping Transporters?</strong>
                <p className="w-100 w-md-50 p-2 p-md-4 text-center">Reach out to us for tailored shipping solutions that meet<br /> your needs</p>
                <button className="btn-register" onClick={() => navigate('/send_groupage')}>Ship Your Goods with Us</button>
            </div>

            <div className="w-100 mt-5">
                <Footer />
            </div>
        </div >
    );
}
export default Offers;