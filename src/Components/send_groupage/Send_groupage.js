import React, { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useNavigate } from 'react-router-dom'
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import { useDropzone } from "react-dropzone";
import Countries_selector from "../Dashboard/Countries_selector";
import State_selector from "../Dashboard/State_selector";
import axios from "axios";
import { Calendar } from "react-date-range";

import { DateRange } from 'react-date-range';
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";
import Alert from "../alert/Alert_message";



const DragAndDrop = ({ accept, onFileDrop, label, multiple = true }) => {
    const onDrop = useCallback(
        (acceptedFiles) => {
            if (multiple) {
                onFileDrop(acceptedFiles);
            } else if (acceptedFiles.length > 0) {
                onFileDrop(acceptedFiles[0]);
            }
        },
        [onFileDrop, multiple]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        multiple,
    });

    return (
        <div
            {...getRootProps()}
            style={{
                border: "2px dashed #ddd",
                padding: "20px",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: isDragActive ? "#f0f8ff" : "white",
                marginBottom: "20px",
            }}
        >
            <input {...getInputProps()} />
            <p>{label}</p>
        </div>
    );
};

const Send_groupage = () => {
    const token = localStorage.getItem('token');
    const port = process.env.REACT_APP_SECRET;
    const navigate = useNavigate();
    const stepperRef = useRef(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alert_message, setAlert_message] = useState('');
    const [currentStep, setCurrentStep] = useState(1);
    useEffect(() => {
        if (!token || token.length <= 0) {
            setShowAlert(true);
            setAlert_message('Login first!');
            setTimeout(() => {
                setShowAlert(false);
                navigate('/login')
            }, 2000);
            // console.log(token.length);
        }
    })

    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileDrop = (files) => {
        if (selectedFiles.length + files.length > 10) {
            setShowAlert(true);
            setAlert_message('You can only upload up to 10 images.');
            return;
        }

        const newFiles = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    };

    const handleRemoveImage = (index) => {
        setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const [showCalendar, setShowCalendar] = useState(false);
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: null,
            key: 'selection'
        }
    ]);
    // Ensure endDate is not null before formatting
    const startDateFormatted = format(state[0].startDate, "dd/MM/yyyy");
    const endDateFormatted = state[0].endDate ? format(state[0].endDate, "dd/MM/yyyy") : "Select End Date";
    const picking_period = `${startDateFormatted} - ${endDateFormatted}`;


    // // Storing the Calendar in a variable
    // const calendarElement = (
    //     <Calendar date={selectedDate} onChange={handleSelect} />
    // );

    // const [state, setState] = useState([
    //     {
    //         startDate: new Date(),
    //         endDate: null,
    //         key: 'selection'
    //     }
    // ]);
    const [productName, setProductName] = useState(null);
    const [productType, setProductType] = useState(null);
    const [Pweight, setPweight] = useState(null);
    const [Pheight, setPheight] = useState(null);
    const [Plength, setPlength] = useState(null);
    const [Pwidth, setPwidth] = useState(null);

    const [userName, setUserName] = useState(null);
    const [userNumber, setUserNumber] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [streetAddress, setStreetAddress] = useState(null);
    const [zipCode, setZipCode] = useState(null);
    const [pick_up_date, setPick_up_date] = useState(null);
    const [userCountry, setUserCountry] = useState(null);
    const [userState, setUserState] = useState(null);
    const [userCity, setUserCity] = useState(null);
    const [userDescription, setUserDescription] = useState(null);

    const [senderName, setSenderName] = useState(null);
    const [senderNumber, setSenderNumber] = useState(null);
    const [senderEmail, setSenderEmail] = useState(null);
    const [senderStreetAddress, setSenderStreetAddress] = useState(null);
    const [senderZipCode, setSenderZipCode] = useState(null);
    const [departure_date, setDeparture_date] = useState(null);
    const [senderCountry, setSenderCountry] = useState(null);
    const [senderState, setSenderState] = useState(null);
    const [senderCity, setSenderCity] = useState(null);
    const [document, setDocument] = useState(null);
    const [senderDescription, setSenderDescription] = useState(null);


    const validateStep1 = () => {
        return productName;
    };
    const validateStep2 = () => {
        return userName && userNumber && userEmail && userCountry && userState && userCity && streetAddress && zipCode && state;
    };
    const validateStep3 = () => {
        return senderName && senderNumber && senderEmail && senderCountry && senderState && senderCity;
    };
    const isNextButtonDisabled = () => {
        if (currentStep === 1) return !validateStep1();
        if (currentStep === 2) return !validateStep2();
        if (currentStep === 3) return !validateStep3();
        return false;
    };
    const [isVisible, setIsVisible] = useState(false);
    const [congrat, setCongrat] = useState(false);

    const handleClose = () => {
        setIsVisible(false);
    };

    const submitData = async () => {
        const formData = new FormData();
        formData.append("productName", productName);
        formData.append("productType", productType);
        formData.append("Pweight", Pweight);
        formData.append("Pheight", Pheight);
        formData.append("Plength", Plength);
        formData.append("Pwidth", Pwidth);
        selectedFiles.forEach((fileObj, index) => {
            formData.append("images", fileObj.file);
        });
        formData.append("userName", userName);
        formData.append("userNumber", userNumber);
        formData.append("userEmail", userEmail);
        formData.append("userCountry", userCountry);
        formData.append("userState", userState);
        formData.append("userCity", userCity);
        formData.append("streetAddress", streetAddress);
        formData.append("zipCode", zipCode);
        formData.append("picking_period", picking_period);
        formData.append("userDescription", userDescription);
        formData.append("senderName", senderName);
        formData.append("senderNumber", senderNumber);
        formData.append("senderEmail", senderEmail);
        formData.append("senderCountry", senderCountry);
        formData.append("senderState", senderState);
        formData.append("senderCity", senderCity);
        formData.append("senderStreetAddress", senderStreetAddress);
        formData.append("senderZipCode", senderZipCode);
        formData.append("departureDate", departure_date);
        formData.append("senderDescription", senderDescription);
        if (document) {
            formData.append("document", document);
        }
        try {
            const response = await axios.post(
                `${port}/send_groupage/send_groupage_submit`,
                formData,
                {
                    headers: {
                        Authorization: token,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log("Success:", response.data);
            if (response.data.status === true) {
                // alert('data submited');
                setIsVisible(false);
                setCongrat(true);

                // setTimeout(() => {
                //     setCongrat(false);
                //     navigate('/dashboard')
                // }, 5000);
                // window.location.reload();
                // navigate('/');
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };
    return (
        <div className="d-flex flex-column align-items-center justify-content-center">
            {showAlert && <Alert message={alert_message} onClose={() => setShowAlert(false)} />}
            <div className='navbar-wrapper'>
                <div className=" d-flex justify-content-center w-100">
                    <Navbar />
                </div>
            </div>
            <div className="d-flex flex-column align-items-center justify-content-start w-100 mt-5">

                <section className="shipping-wrapper w-100">
                    <div className="container-fluid">
                        <div className="shipping-wrap-box w-100 pe-4 ps-5 ">
                            <div className="title-head text-start">
                                <h3>Shipping Information</h3>
                            </div>
                            <div className="shipping-wrap">
                                <div className="row align-items-between justify-content-between w-100 mt-4 ps-3">
                                    <div className="d-flex flex-column align-items-start justify-content-start col-md-9 col-12  border border-1 rounded-2" style={{ width: '73%' }}>


                                        <Stepper linear desabled ref={stepperRef} onStepChange={(step) => setCurrentStep(step)} style={{ flexBasis: 'auto', width: '100%' }}>
                                            <StepperPanel header="Product Information">
                                                <StepperPanel header="Basic Details">
                                                    <div className="shipping-form-wrapper">
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <div className="border-2 border-dashed surface-border border-round surface-ground p-1">
                                                                    {/* Image Upload Section */}
                                                                    <div className="text-center mb-3">
                                                                        <DragAndDrop
                                                                            accept="image/*"
                                                                            multiple={true}
                                                                            onFileDrop={handleFileDrop}
                                                                            label="Drag and drop images here, or click to select (Max: 10 images)"
                                                                        />
                                                                    </div>

                                                                    {/* Preview Images */}
                                                                    {selectedFiles.length > 0 && (
                                                                        <div className="d-flex flex-wrap justify-content-center gap-2">
                                                                            {selectedFiles.map((img, index) => (
                                                                                <div key={index} className="position-relative">
                                                                                    <img
                                                                                        src={img.preview}
                                                                                        alt={`Selected ${index}`}
                                                                                        className="rounded border border-1 border-dark"
                                                                                        style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                                                                    />
                                                                                    <button
                                                                                        onClick={() => handleRemoveImage(index)}
                                                                                        className="btn btn-danger btn-sm position-absolute top-0 end-0 rounded-circle"
                                                                                        style={{
                                                                                            transform: "translate(50%, -50%)",
                                                                                            width: "20px",
                                                                                            height: "20px",
                                                                                            display: "flex",
                                                                                            alignItems: "center",
                                                                                            justifyContent: "center",
                                                                                            padding: "0",
                                                                                        }}
                                                                                    >
                                                                                        ×
                                                                                    </button>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}

                                                                    {/* Product Name & Type */}

                                                                    <div className="row mt-4">
                                                                        <div className="col-12 col-md-6 mb-2 text-start">
                                                                            <label className="shipping-input-label">Product Name <span className="text-danger">*</span></label>
                                                                            <input
                                                                                className="shipping-input-field"
                                                                                type="text"
                                                                                value={productName}
                                                                                onChange={(e) => setProductName(e.target.value)}
                                                                                placeholder="Enter the product name"
                                                                                style={{ backgroundColor: "rgb(214, 214, 214)" }}
                                                                                autofill="on"
                                                                                required
                                                                            />
                                                                        </div>
                                                                        <div className="col-12 col-md-6 mb-2 text-start">
                                                                            <label className="shipping-input-label">Product Type</label>
                                                                            <input
                                                                                className="shipping-input-field"
                                                                                type="text"
                                                                                value={productType}
                                                                                onChange={(e) => setProductType(e.target.value)}
                                                                                placeholder="Enter the product type"
                                                                                autofill="on"
                                                                                style={{ backgroundColor: "rgb(214, 214, 214)" }}
                                                                                required
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    {/* Product Dimensions (Responsive Grid) */}
                                                                    <div className="row mt-4">
                                                                        <div className="col-6 col-md-3 mb-2 text-start">
                                                                            <label className="shipping-input-label">Weight (kg)</label>
                                                                            <input
                                                                                type="text"
                                                                                className="shipping-input-field"
                                                                                onChange={(e) => setPweight(e.target.value.replace(/[^0-9.]/g, ""))}
                                                                                value={Pweight}
                                                                                placeholder="Eg: 0"
                                                                                style={{ backgroundColor: "rgb(214, 214, 214)" }}
                                                                                required
                                                                            />
                                                                        </div>
                                                                        <div className="col-6 col-md-3 mb-2 text-start">
                                                                            <label className="shipping-input-label">Height (cm)</label>
                                                                            <input
                                                                                type="text"
                                                                                className="shipping-input-field"
                                                                                onChange={(e) => setPheight(e.target.value.replace(/[^0-9.]/g, ""))}
                                                                                value={Pheight}
                                                                                placeholder="Eg: 0"
                                                                                style={{ backgroundColor: "rgb(214, 214, 214)" }}
                                                                                required
                                                                            />
                                                                        </div>
                                                                        <div className="col-6 col-md-3 mb-2 text-start">
                                                                            <label className="shipping-input-label">Length (cm)</label>
                                                                            <input
                                                                                type="text"
                                                                                className="shipping-input-field"
                                                                                onChange={(e) => setPlength(e.target.value.replace(/[^0-9.]/g, ""))}
                                                                                value={Plength}
                                                                                placeholder="Eg: 0"
                                                                                style={{ backgroundColor: "rgb(214, 214, 214)" }}
                                                                                required
                                                                            />
                                                                        </div>
                                                                        <div className="col-6 col-md-3 mb-2 text-start">
                                                                            <label className="shipping-input-label">Width (cm)</label>
                                                                            <input
                                                                                type="text"
                                                                                className="shipping-input-field"
                                                                                onChange={(e) => setPwidth(e.target.value.replace(/[^0-9.]/g, ""))}
                                                                                value={Pwidth}
                                                                                placeholder="Eg: 0"
                                                                                style={{ backgroundColor: "rgb(214, 214, 214)" }}
                                                                                required
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </StepperPanel>
                                            </StepperPanel>


                                            <StepperPanel header="Pick-up Information">
                                                <div className=""
                                                    onClick={() => {
                                                        if (showCalendar === true) {
                                                            setShowCalendar(false);
                                                        }
                                                    }}
                                                >
                                                    <div className="row mt-4 ">
                                                        <div className="col-12 col-md-4 text-start ">
                                                            <label className="shipping-input-label">Full Name <span className="text-danger">*</span></label>
                                                            <input className="shipping-input-field" type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Enter your full name" style={{ backgroundColor: 'rgb(214, 214, 214)' }} required />
                                                        </div>
                                                        <div className="col-12 col-md-4 text-start ">
                                                            <label className="shipping-input-label">Contact Number <span className="text-danger">*</span></label>
                                                            <input className="shipping-input-field" type="tel" placeholder="Enter your contact number" value={userNumber} onChange={(e) => setUserNumber(e.target.value)} style={{ backgroundColor: 'rgb(214, 214, 214)' }} required />
                                                        </div>
                                                        <div className="col-12 col-md-4 text-start">
                                                            <label className="shipping-input-label">Email Address<span className="text-danger">*</span></label>
                                                            <input className="shipping-input-field" type="email" placeholder="Enter your email id" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} style={{ backgroundColor: 'rgb(214, 214, 214)' }} required />
                                                        </div>
                                                    </div>

                                                    <div className="row mt-4">
                                                        <div className="col-12 col-md-4 text-start">
                                                            <label className="shipping-input-label">Country<span className="text-danger">*</span></label>
                                                            <Countries_selector onSelectCountry={(value) => setUserCountry(value)} value={userCountry} paddingcount='12px 18px' fontsizefont='15px' bgcolor='#ebebeb' bordercolor='1px solid #ebebeb' borderradiuscount='6px' required />
                                                        </div>
                                                        <div className="col-12 col-md-4 text-start">
                                                            <label className="shipping-input-label">State<span className="text-danger">*</span></label>
                                                            <State_selector onSelectState={(value) => setUserState(value)} value={userState} paddingcount='12px 18px' fontsizefont='15px' bgcolor='#ebebeb' bordercolor='1px solid #ebebeb' borderradiuscount='6px' required />
                                                        </div>
                                                        <div className="col-12 col-md-4 text-start">
                                                            <label className="shipping-input-label">City<span className="text-danger">*</span></label>
                                                            <input className="shipping-input-field" type="text" placeholder="Enter the city name" style={{ backgroundColor: "rgb(214, 214, 214)" }} value={userCity} onChange={(e) => setUserCity(e.target.value)} required />
                                                        </div>
                                                    </div>

                                                    <div className="row mt-4">
                                                        <div className="col-12 col-md-4 text-start">
                                                            <label className="shipping-input-label">Street Address <span className="text-danger">*</span></label>
                                                            <input className="shipping-input-field" type="text" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} placeholder="Enter your Street Address" style={{ backgroundColor: 'rgb(214, 214, 214)' }} required />
                                                        </div>
                                                        <div className="col-12 col-md-4 text-start">
                                                            <label className="shipping-input-label">Zip Code <span className="text-danger">*</span></label>
                                                            <input className="shipping-input-field" type="number" placeholder="Enter your Zip Code" value={zipCode} onChange={(e) => setZipCode(e.target.value)} style={{ backgroundColor: 'rgb(214, 214, 214)' }} required />
                                                        </div>
                                                        <div className="col-12 col-md-4 text-start">
                                                            <label className="shipping-input-label">Picking Period<span className="text-danger">*</span></label>
                                                            <div style={{ position: "relative", width: "100%" }}>
                                                                <input type="text" readOnly className="shipping-input-field" value={state[0].endDate ? `${format(state[0].startDate, "dd/MM/yyyy")} - ${format(state[0].endDate, "dd/MM/yyyy")}` : `${format(state[0].startDate, "dd/MM/yyyy")} - Select End Date`} onClick={() => setShowCalendar(!showCalendar)} style={{ cursor: "pointer", backgroundColor: 'rgb(214, 214, 214)' }} />
                                                                {showCalendar && (
                                                                    <div style={{ position: "absolute", top: "45px", left: "0", right: "0", zIndex: 1000, background: "#fff", borderRadius: "8px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}>
                                                                        <DateRange editableDateInputs={true} onChange={item => setState([item.selection])} moveRangeOnFirstSelection={false} ranges={state} />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row mt-4  text-start">
                                                        <div className="col-12  text-start">
                                                            <label className="shipping-input-label">Notes (if any)</label>
                                                            <textarea className="shipping-input-field" style={{ backgroundColor: 'rgb(214, 214, 214)' }} rows="4" value={userDescription} onChange={(e) => setUserDescription(e.target.value)} placeholder="Type here ....."></textarea>
                                                        </div>
                                                    </div>


                                                </div>
                                            </StepperPanel>


                                            <StepperPanel header="Delivery Information">
                                                <div className="row justify-content-center mt-4">
                                                    <div className="col-md-4  text-start">
                                                        <label className="shipping-input-label">Receiver Full Name <span className="text-danger">*</span></label>
                                                        <input
                                                            className="shipping-input-field"
                                                            type="text"
                                                            value={senderName}
                                                            onChange={(e) => setSenderName(e.target.value)}
                                                            placeholder="Enter Receiver's full name"
                                                            required
                                                            style={{ backgroundColor: 'rgb(214, 214, 214)' }}
                                                        />
                                                    </div>
                                                    <div className="col-md-4  text-start">
                                                        <label className="shipping-input-label">Receiver Contact Number <span className="text-danger">*</span></label>
                                                        <input
                                                            className="shipping-input-field"
                                                            type="tel"
                                                            value={senderNumber}
                                                            onChange={(e) => setSenderNumber(e.target.value)}
                                                            placeholder="Enter Receiver's contact number"
                                                            required
                                                            style={{ backgroundColor: 'rgb(214, 214, 214)' }}
                                                        />
                                                    </div>
                                                    <div className="col-md-4  text-start">
                                                        <label className="shipping-input-label">Receiver Email Address <span className="text-danger">*</span></label>
                                                        <input
                                                            className="shipping-input-field"
                                                            type="email"
                                                            value={senderEmail}
                                                            onChange={(e) => setSenderEmail(e.target.value)}
                                                            placeholder="Enter Receiver's email"
                                                            required
                                                            style={{ backgroundColor: 'rgb(214, 214, 214)' }}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="row justify-content-center mt-4">
                                                    <div className="col-md-4  text-start">
                                                        <label className="shipping-input-label">Country <span className="text-danger">*</span></label>
                                                        <Countries_selector
                                                            onSelectCountry={(value) => setSenderCountry(value)}
                                                            value={senderCountry} paddingcount='12px 18px' fontsizefont='15px' bgcolor='#ebebeb' bordercolor='1px solid #ebebeb' borderradiuscount='6px'
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-4  text-start">
                                                        <label className="shipping-input-label">State <span className="text-danger">*</span></label>
                                                        <State_selector
                                                            onSelectState={(value) => setSenderState(value)}
                                                            value={senderState} paddingcount='12px 18px' fontsizefont='15px' bgcolor='#ebebeb' bordercolor='1px solid #ebebeb' borderradiuscount='6px'
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-4  text-start">
                                                        <label className="shipping-input-label">City <span className="text-danger">*</span></label>
                                                        <input
                                                            className="shipping-input-field"
                                                            type="text"
                                                            value={senderCity}
                                                            onChange={(e) => setSenderCity(e.target.value)}
                                                            placeholder="Enter City Name"
                                                            required
                                                            style={{ backgroundColor: 'rgb(214, 214, 214)' }}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="row justify-content-center mt-4">
                                                    <div className="col-md-4  text-start">
                                                        <label className="shipping-input-label">Receiver Street Address</label>
                                                        <input
                                                            className="shipping-input-field"
                                                            type="text"
                                                            value={senderStreetAddress}
                                                            onChange={(e) => setSenderStreetAddress(e.target.value)}
                                                            placeholder="Enter Receiver's Street Address"
                                                            required
                                                            style={{ backgroundColor: 'rgb(214, 214, 214)' }}
                                                        />
                                                    </div>
                                                    <div className="col-md-4  text-start">
                                                        <label className="shipping-input-label">Receiver Zip Code</label>
                                                        <input
                                                            className="shipping-input-field"
                                                            type="number"
                                                            value={senderZipCode}
                                                            onChange={(e) => setSenderZipCode(e.target.value)}
                                                            placeholder="Enter Receiver's Zip Code"
                                                            required
                                                            style={{ backgroundColor: 'rgb(214, 214, 214)' }}
                                                        />
                                                    </div>
                                                    <div className="col-md-4  text-start">
                                                        <label className="shipping-input-label">Preferred Departure Date</label>
                                                        <input
                                                            className="shipping-input-field"
                                                            type="date"
                                                            value={departure_date}
                                                            onChange={(e) => setDeparture_date(e.target.value)}
                                                            min={new Date().toISOString().split("T")[0]}
                                                            required
                                                            style={{ backgroundColor: 'rgb(214, 214, 214)' }}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mt-4  text-start">
                                                    <label className="shipping-input-label">Notes (if any)</label>
                                                    <textarea
                                                        className="shipping-input-field"
                                                        value={senderDescription}
                                                        onChange={(e) => setSenderDescription(e.target.value)}
                                                        placeholder="Type here..."
                                                        rows="4"
                                                        style={{ backgroundColor: 'rgb(214, 214, 214)' }}
                                                    />
                                                </div>
                                            </StepperPanel>


                                            {/* <StepperPanel header="Additional Information">
                                                <div className="d-flex flex-column align-items-start justify-content-center gap-3 w-100">
                                                    <label className="shipping-input-label text-start">Attach any product documents (if any)</label>
                                                    <div className="w-100">
                                                        <DragAndDrop
                                                            accept="application/pdf, image/jpeg"
                                                            className='w-100'
                                                            multiple={false}
                                                            onFileDrop={(file) => setDocument(file)}
                                                            label="Drag & drop a file or select from folder (PDF, JPEG)"
                                                        />
                                                    </div>
                                                </div>
                                            </StepperPanel> */}


                                        </Stepper>
                                    </div>
                                    <div className="d-flex flex-column align-items-start justify-content-start col-md-3 cod-12  border border-1 rounded-2">

                                        <div className="d-flex flex-column align-items-start w-100">
                                            <div className="p-2 pt-3">
                                                <strong className="fs-5">Order Details</strong>
                                            </div>
                                            <div className="d-flex flex-column align-items-start w-100">
                                                {currentStep === 1 ? (
                                                    <>
                                                        <h5 className="p-2" style={{ fontSize: '16px', fontWeight: '500' }}>Product Information</h5>
                                                        <div className="d-flex flex-column align-items-start w-100 order-details-wrap">
                                                            <div className="d-flex justify-content-between w-100 p-2"> <span>Product Name :</span> <span> {productName ? (<h6>{productName.slice(0, 4)}...</h6>) : (<span>N/A</span>)}</span></div>
                                                            <div className="d-flex justify-content-between w-100 p-2"> <span>Weight :</span> <span> {Pweight ? (<h6>{Pweight.slice(0, 4)}... Kg</h6>) : (<span>N/A</span>)}</span></div>
                                                            <div className="d-flex justify-content-between w-100 p-2"> <span>Height :</span> <span> {Pheight ? (<h6>{Pheight.slice(0, 4)}... Cm</h6>) : (<span>N/A</span>)}</span></div>
                                                            <div className="d-flex justify-content-between w-100 p-2"> <span>Length : </span> <span> {Plength ? (<h6>{Plength.slice(0, 4)}... Cm</h6>) : (<span>N/A</span>)}</span></div>
                                                            <div className="d-flex justify-content-between w-100 p-2"> <span>Width : </span> <span> {Pwidth ? (<h6>{Pwidth.slice(0, 4)}... Cm</h6>) : (<span>N/A</span>)}</span></div>
                                                        </div>
                                                    </>
                                                ) : currentStep === 2 ? (
                                                    <>
                                                        <h5 className="p-2" style={{ fontSize: '16px', fontWeight: '500' }}>Pick Up Information</h5>
                                                        <div className="d-flex flex-column align-items-start w-100 order-details-wrap">
                                                            <div className="d-flex justify-content-between w-100 p-2"> <span >Full Name :</span> <span > {userName ? (<h6>{userName.slice(0, 4)}...</h6>) : (<span>N/A</span>)}</span></div>
                                                            <div className="d-flex justify-content-between w-100 p-2"> <span >Contact Number :</span> <span > {userNumber ? (<h6>{userNumber.slice(0, 4)}...</h6>) : (<span>N/A</span>)}</span></div>
                                                            <div className="d-flex justify-content-between w-100 p-2"> <span >Email ID :</span> <span > {userEmail ? (<h6>{userEmail.slice(0, 4)}...</h6>) : (<span>N/A</span>)}</span></div>
                                                            <div className="d-flex justify-content-between w-100 p-2"> <span >Country :</span> <span > {userCountry ? (<h6>{userCountry.slice(0, 4)}...</h6>) : (<span>N/A</span>)}</span></div>
                                                            <div className="d-flex justify-content-between w-100 p-2"> <span >State :</span> <span > {userState ? (<h6>{userState.slice(0, 4)}...</h6>) : (<span>N/A</span>)}</span></div>
                                                            <div className="d-flex justify-content-between w-100 p-2"> <span >City :</span> <span > {userCity ? (<h6>{userCity.slice(0, 4)}...</h6>) : (<span>N/A</span>)}</span></div>
                                                            <div className="d-flex justify-content-between w-100 p-2"> <span >Street Address :</span> <span > {streetAddress ? (<h6>{streetAddress.slice(0, 4)}...</h6>) : (<span>N/A</span>)}</span></div>
                                                            <div className="d-flex justify-content-between w-100 p-2"> <span >Zip Code :</span> <span > {zipCode ? (<h6>{zipCode.slice(0, 4)}...</h6>) : (<span>N/A</span>)}</span></div>
                                                            <div className="d-flex justify-content-between w-100 p-2"> <span >Picking Period :</span> <span > {picking_period ? (<h6>{picking_period.slice(0, 4)}...</h6>) : (<span>N/A</span>)}</span></div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <h5 className="p-2" style={{ fontSize: '16px', fontWeight: '500' }}>Delivery Information</h5>
                                                        <div className="d-flex flex-column align-items-start w-100 order-details-wrap">
                                                            <div className="d-flex justify-content-between w-100 p-2"> <span>Full Name :</span> <span > {senderName ? (<h6>{senderName.slice(0, 4)}...</h6>) : (<span>N/A</span>)}</span></div>
                                                            <div className="d-flex justify-content-between w-100 p-2"> <span>Contact Number :</span> <span > {senderNumber ? (<h6>{senderNumber.slice(0, 4)}...</h6>) : (<span>N/A</span>)}</span></div>
                                                            <div className="d-flex justify-content-between w-100 p-2"> <span>Email ID :</span> <span > {senderEmail ? (<h6>{senderEmail.slice(0, 4)}...</h6>) : (<span>N/A</span>)}</span></div>
                                                            <div className="d-flex justify-content-between w-100 p-2"> <span>Country :</span> <span > {senderCountry ? (<h6>{senderCountry.slice(0, 4)}...</h6>) : (<span>N/A</span>)}</span></div>
                                                            <div className="d-flex justify-content-between w-100 p-2"> <span>State :</span> <span > {senderState ? (<h6>{senderState.slice(0, 4)}...</h6>) : (<span>N/A</span>)}</span></div>
                                                            <div className="d-flex justify-content-between w-100 p-2"> <span>City :</span> <span > {senderCity ? (<h6>{senderCity.slice(0, 4)}...</h6>) : (<span>N/A</span>)}</span></div>
                                                            <div className="d-flex justify-content-between w-100 p-2"> <span>Street Address :</span> <span > {senderStreetAddress ? (<h6>{senderStreetAddress.slice(0, 4)}...</h6>) : (<span>N/A</span>)}</span></div>
                                                            <div className="d-flex justify-content-between w-100 p-2"> <span>Zip Code :</span> <span > {senderZipCode ? (<h6>{senderZipCode.slice(0, 4)}...</h6>) : (<span>N/A</span>)}</span></div>
                                                        </div>
                                                    </>
                                                ) 
                                                // : (
                                                //     <>
                                                //         <h5 className="p-2" style={{ fontSize: '16px', fontWeight: '500' }}>Additional Information</h5>
                                                //         <div className="d-flex flex-column align-items-start w-100 order-details-wrap">
                                                //             <div className="d-flex justify-content-between w-100 p-2">
                                                //                 <span>Product Document:</span>
                                                //                 <span>
                                                //                     {document ? <h6>{document.name.slice(0, 4)}...</h6> : <span>N/A</span>}
                                                //                 </span>
                                                //             </div>
                                                //         </div>

                                                //     </>
                                                // )
                                                }

                                            </div>
                                        </div>
                                        <div className="d-flex pt-4 justify-content-end w-100 p-2">
                                            <Button
                                                label="Next"
                                                icon="pi pi-arrow-right"
                                                className="btn rounded-2 w-100"
                                                style={{ backgroundColor: '#1fa4e6', color: '#fff', fontWeight: '400' }}
                                                iconPos="center"
                                                disabled={isNextButtonDisabled()}
                                                onClick={() => {
                                                    if (currentStep < 3) {
                                                        stepperRef.current.nextCallback();
                                                        setCurrentStep((prev) => prev + 1);
                                                    } else {
                                                        setIsVisible(true);
                                                    }
                                                }}
                                            />
                                        </div>

                                        {currentStep !== 1 && (
                                            <div className="d-flex pt-2 pb-4 justify-content-end w-100 p-2">
                                                <Button
                                                    label="Back"
                                                    severity="secondary"
                                                    icon="pi pi-arrow-left"
                                                    className="btn rounded-2 w-100"
                                                    style={{ backgroundColor: 'transparent', border: '1px solid #ccc', color: '#1f1f1f', fontWeight: '400' }}
                                                    iconPos="center"
                                                    onClick={() => { stepperRef.current.prevCallback(); setCurrentStep((prev) => prev - 1); }}
                                                />
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>

                </section>

                {isVisible && (
                    <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center" style={{ zIndex: 1050 }}>
                        <div className="position-relative bg-white p-4 rounded shadow-lg" style={{ width: '580px', height: '40rem', overflowY: 'auto' }}>
                            <button
                                className="btn-close position-absolute top-0 end-0 m-2"
                                onClick={handleClose}
                            ></button>
                            <div className="d-flex flex-column align-items-start w-100">
                                <strong className="fs-5">Review your order</strong>
                                <div className="d-flex flex-column align-items-start w-100 gap-2 pt-2 border-bottom border-2 pb-3">
                                    <strong className="fs-6 pb-1">Product Information</strong>
                                    <div className="d-flex justify-content-between w-100"><span className="text-secondary">Product Name :</span> <span>{productName ? (<>{productName}</>) : (<>N/A</>)}</span>  </div>
                                    <div className="d-flex justify-content-between w-100"><span className="text-secondary">Weight :</span> <span>{Pweight ? (<>{Pweight} Kg</>) : (<>N/A</>)}</span>  </div>
                                    <div className="d-flex justify-content-between w-100"><span className="text-secondary">Height :</span> <span>{Pheight ? (<>{Pheight} Cm</>) : (<>N/A</>)}</span>  </div>
                                    <div className="d-flex justify-content-between w-100"><span className="text-secondary">Length :</span> <span>{Plength ? (<>{Plength} Cm</>) : (<>N/A</>)}</span>  </div>
                                    <div className="d-flex justify-content-between w-100"><span className="text-secondary">Width :</span> <span>{Pwidth ? (<>{Pwidth} Cm</>) : (<>N/A</>)}</span>  </div>
                                </div>

                                <div className="d-flex flex-column align-items-start w-100 gap-2 pt-4 border-bottom border-2 pb-3">
                                    <strong className="fs-6 pb-1">Pick Up Information</strong>
                                    <div className="d-flex justify-content-between w-100"> <span className="text-secondary">Full Name :</span> <span className="text-dark"> {userName ? (<span>{userName}</span>) : (<span>N/A</span>)}</span></div>
                                    <div className="d-flex justify-content-between w-100"> <span className="text-secondary">Contact Number :</span> <span className="text-dark"> {userNumber ? (<span>{userNumber}</span>) : (<span>N/A</span>)}</span></div>
                                    <div className="d-flex justify-content-between w-100"> <span className="text-secondary">Email ID :</span> <span className="text-dark"> {userEmail ? (<span>{userEmail}</span>) : (<span>N/A</span>)}</span></div>
                                    <div className="d-flex justify-content-between w-100"> <span className="text-secondary">Country :</span> <span className="text-dark"> {userCountry ? (<span>{userCountry}</span>) : (<span>N/A</span>)}</span></div>
                                    <div className="d-flex justify-content-between w-100"> <span className="text-secondary">State :</span> <span className="text-dark"> {userState ? (<span>{userState}</span>) : (<span>N/A</span>)}</span></div>
                                    <div className="d-flex justify-content-between w-100"> <span className="text-secondary">City :</span> <span className="text-dark"> {userCity ? (<span>{userCity}</span>) : (<span>N/A</span>)}</span></div>
                                    <div className="d-flex justify-content-between w-100"> <span className="text-secondary">Street Address :</span> <span className="text-dark"> {streetAddress ? (<span>{streetAddress}</span>) : (<span>N/A</span>)}</span></div>
                                    <div className="d-flex justify-content-between w-100"> <span className="text-secondary">Zip Code :</span> <span className="text-dark"> {zipCode ? (<span>{zipCode}</span>) : (<span>N/A</span>)}</span></div>
                                    <div className="d-flex justify-content-between w-100"> <span className="text-secondary">Picking Period :</span> <span className="text-dark"> {picking_period ? (<span>{picking_period}</span>) : (<span>N/A</span>)}</span></div>
                                </div>

                                <div className="d-flex flex-column align-items-start w-100 gap-2 pt-4 pb-3">
                                    <strong className="fs-6 pb-1">Delivery Information</strong>
                                    <div className="d-flex justify-content-between w-100"> <span className="text-secondary">Full Name :</span> <span className="text-dark"> {senderName ? (<span>{senderName}</span>) : (<span>N/A</span>)}</span></div>
                                    <div className="d-flex justify-content-between w-100"> <span className="text-secondary">Contact Number :</span> <span className="text-dark"> {senderNumber ? (<span>{senderNumber}</span>) : (<span>N/A</span>)}</span></div>
                                    <div className="d-flex justify-content-between w-100"> <span className="text-secondary">Email ID :</span> <span className="text-dark"> {senderEmail ? (<span>{senderEmail}</span>) : (<span>N/A</span>)}</span></div>
                                    <div className="d-flex justify-content-between w-100"> <span className="text-secondary">Country :</span> <span className="text-dark"> {senderCountry ? (<span>{senderCountry}</span>) : (<span>N/A</span>)}</span></div>
                                    <div className="d-flex justify-content-between w-100"> <span className="text-secondary">State :</span> <span className="text-dark"> {senderState ? (<span>{senderState}</span>) : (<span>N/A</span>)}</span></div>
                                    <div className="d-flex justify-content-between w-100"> <span className="text-secondary">City :</span> <span className="text-dark"> {senderCity ? (<span>{senderCity}</span>) : (<span>N/A</span>)}</span></div>
                                    <div className="d-flex justify-content-between w-100"> <span className="text-secondary">Street Address :</span> <span className="text-dark"> {senderStreetAddress ? (<span>{senderStreetAddress}</span>) : (<span>N/A</span>)}</span></div>
                                    <div className="d-flex justify-content-between w-100"> <span className="text-secondary">Zip Code :</span> <span className="text-dark"> {senderZipCode ? (<span>{senderZipCode}</span>) : (<span>N/A</span>)}</span></div>
                                    <div className="d-flex justify-content-between w-100"> <span className="text-secondary">Preferred Departure Date :</span> <span className="text-dark"> {departure_date ? (<span>{departure_date}</span>) : (<span>N/A</span>)}</span></div>
                                </div>
                            </div>
                            <div className="w-100 pt-4">
                                <button className="btn btn-primary w-100" onClick={submitData}>Submit</button>
                            </div>
                        </div>
                    </div>
                )}

                {congrat && (
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
                                    <p>We have received your order request, we will send the offers from
                                        different companies to your email & profile id within 24 hours</p>
                                </div>

                                <div className="success-button">
                                    <button className="btn-success" onClick={() => navigate('/dashboard')}>Go To Dashboard</button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="w-100">
                <Footer />
            </div>
        </div>
    )
}

export default Send_groupage;