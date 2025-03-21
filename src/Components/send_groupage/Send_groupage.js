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

    const [currentStep, setCurrentStep] = useState(1);
    useEffect(() => {
        if (!token || token.length <= 0) {
            navigate('/login')
            alert("Login first!");
            // console.log(token.length);
        }
    })

    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileDrop = (files) => {
        if (selectedFiles.length + files.length > 10) {
            alert("You can only upload up to 10 images.");
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
                alert('data submited');
                // window.location.reload();
                navigate('/');
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };
    return (
        <div className="d-flex flex-column align-items-center justify-content-center">
            <div className=" d-flex justify-content-center w-100">
                <Navbar />
            </div>
            <div className="d-flex flex-column align-items-start justify-content-start w-100 mt-5">
                <strong className="fs-4">Shipping Information</strong>

                <div className="row align-items-between justify-content-between w-100 mt-2 ps-3">
                    <div className="d-flex flex-column align-items-start justify-content-start col-md-9 col-12  border border-3 border-end-0 rounded-4">
                        <Stepper linear desabled ref={stepperRef} onStepChange={(step) => setCurrentStep(step)} style={{ flexBasis: 'auto', width: '100%' }}>
                            <StepperPanel header="Product Information">
                                <StepperPanel header="Basic Details">
                                    <div className="container-fluid">
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
                                                    <div className="row mt-3">
                                                        <div className="col-12 col-md-6 mb-2">
                                                            <label className="form-label">Product Name <span className="text-danger">*</span></label>
                                                            <input
                                                                className="form-control"
                                                                type="text"
                                                                value={productName}
                                                                onChange={(e) => setProductName(e.target.value)}
                                                                placeholder="Enter the product name"
                                                                style={{ backgroundColor: "rgb(214, 214, 214)" }}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="col-12 col-md-6 mb-2">
                                                            <label className="form-label">Product Type</label>
                                                            <input
                                                                className="form-control"
                                                                type="text"
                                                                value={productType}
                                                                onChange={(e) => setProductType(e.target.value)}
                                                                placeholder="Enter the product type"
                                                                style={{ backgroundColor: "rgb(214, 214, 214)" }}
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Product Dimensions (Responsive Grid) */}
                                                    <div className="row mt-3">
                                                        <div className="col-6 col-md-3 mb-2">
                                                            <label className="form-label">Weight (kg)</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                onChange={(e) => setPweight(e.target.value.replace(/[^0-9.]/g, ""))}
                                                                value={Pweight}
                                                                placeholder="Eg: 0"
                                                                style={{ backgroundColor: "rgb(214, 214, 214)" }}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="col-6 col-md-3 mb-2">
                                                            <label className="form-label">Height (cm)</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                onChange={(e) => setPheight(e.target.value.replace(/[^0-9.]/g, ""))}
                                                                value={Pheight}
                                                                placeholder="Eg: 0"
                                                                style={{ backgroundColor: "rgb(214, 214, 214)" }}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="col-6 col-md-3 mb-2">
                                                            <label className="form-label">Length (cm)</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                onChange={(e) => setPlength(e.target.value.replace(/[^0-9.]/g, ""))}
                                                                value={Plength}
                                                                placeholder="Eg: 0"
                                                                style={{ backgroundColor: "rgb(214, 214, 214)" }}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="col-6 col-md-3 mb-2">
                                                            <label className="form-label">Width (cm)</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
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
                                <div className="container-fluid">
                                    <div className="row mt-4 g-3">
                                        <div className="col-12 col-md-4">
                                            <label className="form-label">Full Name <span className="text-danger">*</span></label>
                                            <input className="form-control" type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Enter your full name" style={{ backgroundColor: 'rgb(214, 214, 214)' }} required />
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <label className="form-label">Contact Number <span className="text-danger">*</span></label>
                                            <input className="form-control" type="tel" placeholder="Enter your contact number" value={userNumber} onChange={(e) => setUserNumber(e.target.value)} style={{ backgroundColor: 'rgb(214, 214, 214)' }} required />
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <label className="form-label">Email Address<span className="text-danger">*</span></label>
                                            <input className="form-control" type="email" placeholder="Enter your email id" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} style={{ backgroundColor: 'rgb(214, 214, 214)' }} required />
                                        </div>
                                    </div>

                                    <div className="row mt-4 g-3">
                                        <div className="col-12 col-md-4">
                                            <label className="form-label">Country<span className="text-danger">*</span></label>
                                            <Countries_selector onSelectCountry={(value) => setUserCountry(value)} value={userCountry} required />
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <label className="form-label">State<span className="text-danger">*</span></label>
                                            <State_selector onSelectState={(value) => setUserState(value)} value={userState} />
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <label className="form-label">City<span className="text-danger">*</span></label>
                                            <input className="form-control" type="text" placeholder="Enter the city name" style={{ backgroundColor: "rgb(214, 214, 214)" }} value={userCity} onChange={(e) => setUserCity(e.target.value)} required />
                                        </div>
                                    </div>

                                    <div className="row mt-4 g-3">
                                        <div className="col-12 col-md-4">
                                            <label className="form-label">Street Address <span className="text-danger">*</span></label>
                                            <input className="form-control" type="text" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} placeholder="Enter your Street Address" style={{ backgroundColor: 'rgb(214, 214, 214)' }} required />
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <label className="form-label">Zip Code <span className="text-danger">*</span></label>
                                            <input className="form-control" type="number" placeholder="Enter your Zip Code" value={zipCode} onChange={(e) => setZipCode(e.target.value)} style={{ backgroundColor: 'rgb(214, 214, 214)' }} required />
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <label className="form-label">Picking Period<span className="text-danger">*</span></label>
                                            <div style={{ position: "relative", width: "100%" }}>
                                                <input type="text" readOnly className="form-control" value={state[0].endDate ? `${format(state[0].startDate, "dd/MM/yyyy")} - ${format(state[0].endDate, "dd/MM/yyyy")}` : `${format(state[0].startDate, "dd/MM/yyyy")} - Select End Date`} onClick={() => setShowCalendar(!showCalendar)} style={{ cursor: "pointer", backgroundColor: 'rgb(214, 214, 214)' }} />
                                                {showCalendar && (
                                                    <div style={{ position: "absolute", top: "45px", left: "0", right: "0", zIndex: 1000, background: "#fff", borderRadius: "8px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}>
                                                        <DateRange editableDateInputs={true} onChange={item => setState([item.selection])} moveRangeOnFirstSelection={false} ranges={state} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mt-4">
                                        <div className="col-12">
                                            <label className="form-label">Notes (if any)</label>
                                            <textarea className="form-control" style={{ backgroundColor: 'rgb(214, 214, 214)' }} rows="4" value={userDescription} onChange={(e) => setUserDescription(e.target.value)} placeholder="Type here ....."></textarea>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-center mt-4">
                                        <Button label="Back" severity="secondary" icon="pi pi-arrow-left" className="btn btn-secondary rounded-2" iconPos="center" onClick={() => { stepperRef.current.prevCallback(); setCurrentStep((prev) => prev - 1); }} />
                                    </div>
                                </div>
                            </StepperPanel>


                            <StepperPanel header="Delivery Information">
                                <div className="row justify-content-center mt-4 g-4">
                                    <div className="col-md-4">
                                        <label className="form-label">Receiver Full Name <span className="text-danger">*</span></label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={senderName}
                                            onChange={(e) => setSenderName(e.target.value)}
                                            placeholder="Enter Receiver's full name"
                                            required
                                            style={{ backgroundColor: 'rgb(214, 214, 214)' }}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Receiver Contact Number <span className="text-danger">*</span></label>
                                        <input
                                            className="form-control"
                                            type="tel"
                                            value={senderNumber}
                                            onChange={(e) => setSenderNumber(e.target.value)}
                                            placeholder="Enter Receiver's contact number"
                                            required
                                            style={{ backgroundColor: 'rgb(214, 214, 214)' }}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Receiver Email Address <span className="text-danger">*</span></label>
                                        <input
                                            className="form-control"
                                            type="email"
                                            value={senderEmail}
                                            onChange={(e) => setSenderEmail(e.target.value)}
                                            placeholder="Enter Receiver's email"
                                            required
                                            style={{ backgroundColor: 'rgb(214, 214, 214)' }}
                                        />
                                    </div>
                                </div>

                                <div className="row justify-content-center mt-4 g-4">
                                    <div className="col-md-4">
                                        <label className="form-label">Country <span className="text-danger">*</span></label>
                                        <Countries_selector
                                            onSelectCountry={(value) => setSenderCountry(value)}
                                            value={senderCountry}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">State <span className="text-danger">*</span></label>
                                        <State_selector
                                            onSelectState={(value) => setSenderState(value)}
                                            value={senderState}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">City <span className="text-danger">*</span></label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={senderCity}
                                            onChange={(e) => setSenderCity(e.target.value)}
                                            placeholder="Enter City Name"
                                            required
                                            style={{ backgroundColor: 'rgb(214, 214, 214)' }}
                                        />
                                    </div>
                                </div>

                                <div className="row justify-content-center mt-4 g-4">
                                    <div className="col-md-4">
                                        <label className="form-label">Receiver Street Address</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={senderStreetAddress}
                                            onChange={(e) => setSenderStreetAddress(e.target.value)}
                                            placeholder="Enter Receiver's Street Address"
                                            required
                                            style={{ backgroundColor: 'rgb(214, 214, 214)' }}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Receiver Zip Code</label>
                                        <input
                                            className="form-control"
                                            type="number"
                                            value={senderZipCode}
                                            onChange={(e) => setSenderZipCode(e.target.value)}
                                            placeholder="Enter Receiver's Zip Code"
                                            required
                                            style={{ backgroundColor: 'rgb(214, 214, 214)' }}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Preferred Departure Date</label>
                                        <input
                                            className="form-control"
                                            type="date"
                                            value={departure_date}
                                            onChange={(e) => setDeparture_date(e.target.value)}
                                            min={new Date().toISOString().split("T")[0]}
                                            required
                                            style={{ backgroundColor: 'rgb(214, 214, 214)' }}
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="form-label">Notes (if any)</label>
                                    <textarea
                                        className="form-control"
                                        value={senderDescription}
                                        onChange={(e) => setSenderDescription(e.target.value)}
                                        placeholder="Type here..."
                                        rows="4"
                                        style={{ backgroundColor: 'rgb(214, 214, 214)' }}
                                    />
                                </div>

                                <div className="mt-4">
                                    <Button
                                        label="Back"
                                        severity="secondary"
                                        icon="pi pi-arrow-left"
                                        className="btn btn-secondary rounded-2"
                                        iconPos="center"
                                        onClick={() => {
                                            stepperRef.current.prevCallback();
                                            setCurrentStep((prev) => prev - 1);
                                        }}
                                    />
                                </div>
                            </StepperPanel>


                            <StepperPanel header="Additional Information">
                                <div className="d-flex flex-column align-items-center w-100 justify-content-center mt-4 gap-3">
                                    <label className="text-dark fw-semibold">Attach any product documents (if any)</label>
                                    <DragAndDrop
                                        accept="application/pdf, image/jpeg"
                                        style={{ width: '80%', maxWidth: '500px' }} // Ensures proper width on larger screens
                                        multiple={false}
                                        onFileDrop={(file) => setDocument(file)}
                                        label="Drag & drop a file or select from folder (PDF, JPEG)"
                                    />
                                </div>
                                <div className="mt-4 text-center">
                                    <Button
                                        label="Back"
                                        severity="secondary"
                                        icon="pi pi-arrow-left"
                                        className="btn btn-secondary rounded-2"
                                        iconPos="center"
                                        onClick={() => {
                                            stepperRef.current.prevCallback();
                                            setCurrentStep((prev) => prev - 1);
                                        }}
                                    />
                                </div>
                            </StepperPanel>


                        </Stepper>
                    </div>
                    <div className="d-flex flex-column align-items-start justify-content-start col-md-3 cod-12  border border-3 rounded-4">

                        <div className="d-flex flex-column align-items-start w-100">
                            <div className="p-3">
                                <strong className="fs-4">Order Details</strong>
                            </div>
                            <div className="d-flex flex-column align-items-start p-3 w-100">
                                {currentStep === 1 ? (
                                    <>
                                        <h5>Product Infromation</h5>
                                        <div className="d-flex flex-column align-items-start w-100">
                                            <div className="d-flex justify-content-between w-100 p-2"> <span className="text-secondary">Product Name :</span> <span className="text-dark"> {productName ? (<h6>{productName}</h6>) : (<span>N/A</span>)}</span></div>
                                            <div className="d-flex justify-content-between w-100 p-2"> <span className="text-secondary">Weight :</span> <span className="text-dark"> {Pweight ? (<h6>{Pweight} Kg</h6>) : (<span>N/A</span>)}</span></div>
                                            <div className="d-flex justify-content-between w-100 p-2"> <span className="text-secondary">Height :</span> <span className="text-dark"> {Pheight ? (<h6>{Pheight} Cm</h6>) : (<span>N/A</span>)}</span></div>
                                            <div className="d-flex justify-content-between w-100 p-2"> <span className="text-secondary">Length : </span> <span className="text-dark"> {Plength ? (<h6>{Plength} Cm</h6>) : (<span>N/A</span>)}</span></div>
                                            <div className="d-flex justify-content-between w-100 p-2"> <span className="text-secondary">Width : </span> <span className="text-dark"> {Pwidth ? (<h6>{Pwidth} Cm</h6>) : (<span>N/A</span>)}</span></div>
                                        </div>
                                    </>
                                ) : currentStep === 2 ? (
                                    <>
                                        <h5>Pick Up Information</h5>
                                        <div className="d-flex flex-column align-items-start w-100">
                                            <div className="d-flex justify-content-between w-100 p-2"> <span className="text-secondary">Full Name :</span> <span className="text-dark"> {userName ? (<h6>{userName}</h6>) : (<span>N/A</span>)}</span></div>
                                            <div className="d-flex justify-content-between w-100 p-2"> <span className="text-secondary">Contact Number :</span> <span className="text-dark"> {userNumber ? (<h6>{userNumber}</h6>) : (<span>N/A</span>)}</span></div>
                                            <div className="d-flex justify-content-between w-100 p-2"> <span className="text-secondary">Email ID :</span> <span className="text-dark"> {userEmail ? (<h6>{userEmail}</h6>) : (<span>N/A</span>)}</span></div>
                                            <div className="d-flex justify-content-between w-100 p-2"> <span className="text-secondary">Country :</span> <span className="text-dark"> {userCountry ? (<h6>{userCountry}</h6>) : (<span>N/A</span>)}</span></div>
                                            <div className="d-flex justify-content-between w-100 p-2"> <span className="text-secondary">State :</span> <span className="text-dark"> {userState ? (<h6>{userState}</h6>) : (<span>N/A</span>)}</span></div>
                                            <div className="d-flex justify-content-between w-100 p-2"> <span className="text-secondary">City :</span> <span className="text-dark"> {userCity ? (<h6>{userCity}</h6>) : (<span>N/A</span>)}</span></div>
                                            <div className="d-flex justify-content-between w-100 p-2"> <span className="text-secondary">Street Address :</span> <span className="text-dark"> {streetAddress ? (<h6>{streetAddress}</h6>) : (<span>N/A</span>)}</span></div>
                                            <div className="d-flex justify-content-between w-100 p-2"> <span className="text-secondary">Zip Code :</span> <span className="text-dark"> {zipCode ? (<h6>{zipCode}</h6>) : (<span>N/A</span>)}</span></div>
                                            <div className="d-flex justify-content-between w-100 p-2"> <span className="text-secondary">Picking Period :</span> <span className="text-dark"> {picking_period ? (<h6>{picking_period}</h6>) : (<span>N/A</span>)}</span></div>
                                        </div>
                                    </>
                                ) : currentStep === 3 ? (
                                    <>
                                        <h5>Delivery Information</h5>
                                        <div className="d-flex flex-column align-items-start w-100">
                                            <div className="d-flex justify-content-between w-100 p-2"> <span className="text-secondary">Full Name :</span> <span className="text-dark"> {senderName ? (<h6>{senderName}</h6>) : (<span>N/A</span>)}</span></div>
                                            <div className="d-flex justify-content-between w-100 p-2"> <span className="text-secondary">Contact Number :</span> <span className="text-dark"> {senderNumber ? (<h6>{senderNumber}</h6>) : (<span>N/A</span>)}</span></div>
                                            <div className="d-flex justify-content-between w-100 p-2"> <span className="text-secondary">Email ID :</span> <span className="text-dark"> {senderEmail ? (<h6>{senderEmail}</h6>) : (<span>N/A</span>)}</span></div>
                                            <div className="d-flex justify-content-between w-100 p-2"> <span className="text-secondary">Country :</span> <span className="text-dark"> {senderCountry ? (<h6>{senderCountry}</h6>) : (<span>N/A</span>)}</span></div>
                                            <div className="d-flex justify-content-between w-100 p-2"> <span className="text-secondary">State :</span> <span className="text-dark"> {senderState ? (<h6>{senderState}</h6>) : (<span>N/A</span>)}</span></div>
                                            <div className="d-flex justify-content-between w-100 p-2"> <span className="text-secondary">City :</span> <span className="text-dark"> {senderCity ? (<h6>{senderCity}</h6>) : (<span>N/A</span>)}</span></div>
                                            <div className="d-flex justify-content-between w-100 p-2"> <span className="text-secondary">Street Address :</span> <span className="text-dark"> {senderStreetAddress ? (<h6>{senderStreetAddress}</h6>) : (<span>N/A</span>)}</span></div>
                                            <div className="d-flex justify-content-between w-100 p-2"> <span className="text-secondary">Zip Code :</span> <span className="text-dark"> {senderZipCode ? (<h6>{senderZipCode}</h6>) : (<span>N/A</span>)}</span></div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h5 className="mb-3">Additional Information</h5>
                                        <div className="d-flex flex-column align-items-start w-100">
                                            <div className="d-flex justify-content-between w-100 p-2">
                                                <span className="text-secondary">Product Document:</span>
                                                <span className="text-dark">
                                                    {document ? <strong>{document.name}</strong> : <span>N/A</span>}
                                                </span>
                                            </div>
                                        </div>

                                    </>
                                )}

                            </div>
                        </div>
                        <div className="d-flex pt-4 justify-content-end w-100 p-3">
                            <Button
                                label="Next"
                                icon="pi pi-arrow-right"
                                className="btn btn-primary rounded-2 w-100"
                                iconPos="center"
                                disabled={isNextButtonDisabled()}
                                onClick={() => {
                                    if (currentStep < 4) {
                                        stepperRef.current.nextCallback();
                                        setCurrentStep((prev) => prev + 1);
                                    } else {
                                        setIsVisible(true);
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
                {isVisible && (
                    <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center" style={{ zIndex: 1050 }}>
                        <div className="position-relative bg-white p-4 rounded shadow-lg" style={{ width: '500px', height: '40rem', overflowY: 'auto' }}>
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
            </div>

            <div className=" d-flex justify-content-center w-100">
                <Footer />
            </div>
        </div>
    )
}

export default Send_groupage;