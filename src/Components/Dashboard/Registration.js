import React, { useCallback, useRef, useState } from "react";
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { useDropzone } from "react-dropzone";
import { IoMdAddCircleOutline } from "react-icons/io";
import Countries_selector from "./Countries_selector";
import State_selector from "./State_selector";
import Form from 'react-bootstrap/Form';

import axios from "axios";



const DragAndDrop = ({ accept, onFileDrop, label }) => {
    const onDrop = useCallback(
        (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0];
                onFileDrop(file);
            }
        },
        [onFileDrop]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        multiple: false,
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



const Registration = () => {
    const token = localStorage.getItem('token');
    const port = process.env.REACT_APP_SECRET;

    const stepperRef = useRef(null);

    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const [RegistrationDocument, setRegistrationDocument] = useState(null);
    const [FinancialDocument, setFinancialDocument] = useState(null);
    const [PassportCEO_MD, setPassportCEO_MD] = useState(null);

    const [containerService, setContainerService] = useState(false);
    const [carService, setCarService] = useState(false);
    const [groupageService, setGroupageService] = useState(false);

    const handleFileDrop = (file) => {
        setSelectedFile(file); // Store the file object
        setSelectedImage(URL.createObjectURL(file)); // Create a preview
    };

    const [visibleSelectors, setVisibleSelectors] = useState({});
    const [companyName, setCompanyName] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [description, setDescription] = useState("");
    const [locations, setLocations] = useState([
        { country: "", state: "", city: "" },
    ]);
    const handlecountry = (value, index) => {
        const updatedLocations = [...locations];
        updatedLocations[index].country = value;
        setLocations(updatedLocations);
    };

    const toggleSelector = (index) => {
        setVisibleSelectors((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const handlestate = (value, index) => {
        const updatedLocations = [...locations];
        updatedLocations[index].state = value;
        setLocations(updatedLocations);
        setVisibleSelectors((prev) => ({ ...prev, [index]: false }));
    };

    const handlecity = (value, index) => {
        const updatedLocations = [...locations];
        updatedLocations[index].city = value;
        setLocations(updatedLocations);
    };

    const handleAddLocation = () => {
        if (locations.length >= 10) {
            alert("You can only add up to 10 locations.");
            return;
        }

        setLocations([
            ...locations,
            {
                country: "",
                state: "",
                city: "",
            },
        ]);
    };

    const handleRemoveLocation = (index) => {
        if (index > 0) {
            const updatedLocations = [...locations];
            updatedLocations.splice(index, 1);
            setLocations(updatedLocations);
        }
    };
    console.log(locations);

    // const [selectedShippingCountries, setSelectedShippingCountries] = useState([]);
    // const handleShippingCountry = (value) => {
    //     if (value && !selectedShippingCountries.includes(value)) {
    //         setSelectedShippingCountries([...selectedShippingCountries, value]);
    //     }
    // };

    // const handleRemoveSelected = (indexToRemove) => {
    //     const updatedCountries = selectedShippingCountries.filter((_, index) => index !== indexToRemove);
    //     setSelectedShippingCountries(updatedCountries);
    // };

    //Container service
    const [selectedContainerCountries, setSelectedContainerCountries] = useState([]);
    const handleContainerCountry = (value) => {
        if (value && !selectedContainerCountries.some((item) => item.country === value)) {
            setSelectedContainerCountries([...selectedContainerCountries, { country: value, deliveryTime: "" }]);
        }
    };
    const handleDeliveryTimeChange_container = (index, value) => {
        const updatedCountries = [...selectedContainerCountries];
        updatedCountries[index].deliveryTime = value; // Update the delivery time
        setSelectedContainerCountries(updatedCountries);
    };
    const handleRemoveContainerCountry = (indexToRemove) => {
        const updatedCountries = selectedContainerCountries.filter((_, index) => index !== indexToRemove);
        setSelectedContainerCountries(updatedCountries);
    };

    //Groupage service
    const [selectedGroupageCountries, setSelectedGroupageCountries] = useState([]);
    const handleGroupageCountry = (value) => {
        if (value && !selectedGroupageCountries.some((item) => item.country === value)) {
            setSelectedGroupageCountries([...selectedGroupageCountries, { country: value, deliveryTime: "" }]);
        }
    };
    const handleDeliveryTimeChange_groupage = (index, value) => {
        const updatedCountries = [...selectedGroupageCountries];
        updatedCountries[index].deliveryTime = value; // Update the delivery time
        setSelectedGroupageCountries(updatedCountries);
    };
    const handleRemoveGroupageCountry = (indexToRemove) => {
        const updatedCountries = selectedGroupageCountries.filter((_, index) => index !== indexToRemove);
        setSelectedGroupageCountries(updatedCountries);
    };

    //Car service
    const [selectedCarCountries, setSelectedCarCountries] = useState([]);
    const handleCarCountry = (value) => {
        if (value && !selectedCarCountries.some((item) => item.country === value)) {
            setSelectedCarCountries([...selectedCarCountries, { country: value, deliveryTime: "" }]);
        }
    };
    const handleDeliveryTimeChange_car = (index, value) => {
        const updatedCountries = [...selectedCarCountries];
        updatedCountries[index].deliveryTime = value; // Update the delivery time
        setSelectedCarCountries(updatedCountries);
    };
    const handleRemoveCarCountry = (indexToRemove) => {
        const updatedCountries = selectedCarCountries.filter((_, index) => index !== indexToRemove);
        setSelectedCarCountries(updatedCountries);
    };

    const basicDetails = () => {
        if (!companyName || !contactNumber || !emailAddress || !description) return false;

        // Check locations fields
        for (const location of locations) {
            if (!location.country || !location.state || !location.city) return false;
        }

        return true;
    }

    const isTransportationValid = () => {
        if (containerService) {
            if (
                selectedContainerCountries.length === 0 ||
                selectedContainerCountries.some(
                    (item) => !item.deliveryTime || item.deliveryTime <= 0
                )
            ) {
                return false;
            }
        }

        if (carService) {
            if (
                selectedCarCountries.length === 0 ||
                selectedCarCountries.some(
                    (item) => !item.deliveryTime || item.deliveryTime <= 0
                )
            ) {
                return false;
            }
        }

        if (groupageService) {
            if (
                selectedGroupageCountries.length === 0 ||
                selectedGroupageCountries.some(
                    (item) => !item.deliveryTime || item.deliveryTime <= 0
                )
            ) {
                return false;
            }
        }

        return true; // All validations passed
    };



    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('companyName', companyName);
        formData.append('contactNumber', contactNumber);
        formData.append('emailAddress', emailAddress);
        formData.append('description', description);
        formData.append('locations', JSON.stringify(locations));
        if (selectedFile) {
            formData.append('selectedImage', selectedFile);
        }
        formData.append('transportation', JSON.stringify({
            containerService,
            selectedContainerCountries,
            carService,
            selectedCarCountries,
            groupageService,
            selectedGroupageCountries
        }));
        if (RegistrationDocument) {
            formData.append('registrationDocument', RegistrationDocument);
        }
        if (FinancialDocument) {
            formData.append('financialDocument', FinancialDocument);
        }
        if (PassportCEO_MD) {
            formData.append('passportCEO_MD', PassportCEO_MD);
        }

        axios.post(`${port}/company/regester_company`, formData,
            {
                headers: {
                    Authorization: token,
                    'Content-Type': 'multipart/form-data',
                }
            })
            .then(response => {
                if (response.status === 200) {
                    // Handle successful submission
                    alert('Data submitted successfully!');
                } else {
                    // Handle errors
                    alert('Error submitting data');
                }
                console.log(response);
                nextpage();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error submitting data');
            });
    };

    const nextpage = () => {
        stepperRef.current.nextCallback()
    }
    const congratulations = () => {
        window.location.reload();
    }

    return (
        <div className="flex justify-content-start h-100vh">

            <Stepper linear desabled ref={stepperRef} style={{ flexBasis: 'auto' }}>
                <StepperPanel header="Basic Details" >
                    <div className="flex flex-column h-12rem">
                        <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                            <>

                                <div>
                                    <DragAndDrop
                                        accept="image/*"
                                        onFileDrop={handleFileDrop}
                                        // onFileDrop={(file) => setSelectedImage(URL.createObjectURL(file))}
                                        label="Drag and drop an image here, or click to select (only one image allowed)"
                                    />
                                    {selectedImage && (
                                        <div>
                                            <h4>Preview:</h4>
                                            <img
                                                src={selectedImage}
                                                alt="Selected"
                                                className="rounded-circle border border-1 border-dark"
                                                style={{ width: "150px", height: '150px', marginTop: "10px" }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="d-flex flex-md-row align-items-center justify-content-center mt-4 gap-5">
                                    <div className="pe-1 ps-1" style={{ width: '30%' }}>
                                        <label className="form-label text-start w-100">Company Name <span className="text-danger">*</span></label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            placeholder="Enter the company name"
                                            style={{ backgroundColor: ' rgb(214, 214, 214)' }} required />
                                    </div>
                                    <div className="pe-1 ps-1" style={{ width: '30%' }}>
                                        <label className="form-label text-start w-100">Contect Number <span className="text-danger">*</span></label>
                                        <input className="form-control"
                                            type="tel"
                                            placeholder="Enter the company number"
                                            value={contactNumber}
                                            onChange={(e) => setContactNumber(e.target.value)}
                                            style={{ backgroundColor: 'rgb(214, 214, 214)' }}
                                            required />
                                    </div>
                                    <div className="pe-1 ps-1" style={{ width: '30%' }}>
                                        <label className="form-label text-start w-100">Email Address<span className="text-danger">*</span></label>
                                        <input className="form-control"
                                            type="email"
                                            placeholder="Enter the company email id"
                                            value={emailAddress}
                                            onChange={(e) => setEmailAddress(e.target.value)}
                                            style={{ backgroundColor: 'rgb(214, 214, 214)' }}
                                            required />
                                    </div>
                                </div>

                                {locations.map((location, index) => (
                                    <div
                                        className="d-flex flex-md-row align-items-center justify-content-center mt-4 gap-5 position-relative"
                                        key={index}
                                    >
                                        <div className="pe-1 ps-1" style={{ width: "30%" }}>
                                            <label className="form-label text-start w-100">
                                                Country<span className="text-danger">*</span>
                                            </label>
                                            <Countries_selector
                                                onSelectCountry={(value) => handlecountry(value, index)} // Pass index
                                                value={location.country}
                                                required
                                            />
                                        </div>
                                        <div className="pe-1 ps-1" style={{ width: "30%" }}>
                                            <label className="form-label text-start w-100">
                                                State<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={location.state}
                                                className="form-control"
                                                style={{ backgroundColor: 'rgb(214, 214, 214)' }}
                                                readOnly
                                                onClick={() => toggleSelector(index)} // Show selector on click
                                            />
                                            {visibleSelectors[index] && (
                                                <State_selector
                                                    onSelectState={(value) => handlestate(value, index)} // Pass index
                                                    value={location.state}
                                                />
                                            )}
                                        </div>
                                        <div className="pe-1 ps-1" style={{ width: "30%" }}>
                                            <label className="form-label text-start w-100">
                                                City<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                placeholder="Enter the city name"
                                                style={{ backgroundColor: "rgb(214, 214, 214)" }}
                                                value={location.city}
                                                onChange={(e) => handlecity(e.target.value, index)} // Pass index
                                                required
                                            />
                                        </div>
                                        {/* Remove Button for locations added after the first one */}
                                        {index > 0 && (
                                            <button
                                                className="btn btn-danger btn-sm position-absolute"
                                                style={{ top: "-10px", right: "-10px" }}
                                                onClick={() => handleRemoveLocation(index)}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}

                                <div className="d-flex align-items-end justify-content-end">
                                    <button
                                        className="btn btn-light text-info border border-info mt-4"
                                        onClick={handleAddLocation}
                                    // disabled={locations.length >= 10}
                                    >
                                        <IoMdAddCircleOutline className="fs-4" /> Add More Location
                                    </button>
                                </div>

                                <div className="d-flex mt-3 flex-column align-items-start">
                                    <label className="form-label">Brief description about the company <span className="text-danger">*</span></label>
                                    <textarea
                                        className="form-control"
                                        rows="5"
                                        placeholder="Enter the company description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        style={{ backgroundColor: 'rgb(214, 214, 214)' }}
                                        required
                                    ></textarea>
                                </div>

                            </>
                        </div>
                    </div>
                    <div className="d-flex pt-4 justify-content-end">
                        <Button
                            label="Next"
                            icon="pi pi-arrow-right"
                            disabled={!basicDetails()}
                            className="btn btn-primary rounded-2"
                            iconPos="center"
                            onClick={() => stepperRef.current.nextCallback()}
                        />
                    </div>
                </StepperPanel>

                <StepperPanel header="Transportation Offered">
                    <div className="flex flex-column h-12rem">
                        <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">

                            <>

                                <div className="d-flex flex-md-column align-items-center justify-content-center mt-4 gap-5">
                                    <div className="d-flex flex-column justify-content-start align-items-start w-100">
                                        <div className="d-flex align-items-start w-100">
                                            <label>Do you offer containers to transport goods?<span className="text-danger">*</span></label>
                                            <Form.Check // prettier-ignore
                                                type="switch"
                                                id="container"
                                                checked={containerService}
                                                onChange={(e) => setContainerService(e.target.checked)}
                                            />
                                        </div>
                                        {containerService && (
                                            <div className="d-flex flex-column align-items-start justify-content-start mt-4 w-100">
                                                <div className="d-flex w-100 flex-column align-items-start gap-2">
                                                    <label>Countries we ship Container to<span className="text-danger">*</span></label>
                                                    <Countries_selector onSelectCountry={(value) => handleContainerCountry(value)} className="w-100" />
                                                </div>
                                                <div className="d-flex flex-md-row align-items-start justify-content-start w-100">
                                                    <div className="d-flex flex-column align-items-start w-50 p-3 gap-2">
                                                        <lable>Countries Selected</lable>
                                                        {selectedContainerCountries.map((item, index) => (
                                                            <input
                                                                key={index}
                                                                type="text"
                                                                value={item.country}
                                                                className="form-control"
                                                                readOnly
                                                                style={{ backgroundColor: "rgb(214, 214, 214)" }}
                                                            />
                                                        ))}
                                                    </div>
                                                    <div className="d-flex flex-column align-items-start w-50 p-3 gap-2">
                                                        <lable>Estimated Delivery Duration(In Days)<span className="text-danger">*</span></lable>
                                                        {selectedContainerCountries.map((item, index) => (
                                                            <div className="d-flex align-items-center gap-2 w-100" key={index}>
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    placeholder="Enter the delivery duration in days"
                                                                    style={{ backgroundColor: "rgb(214, 214, 214)" }}
                                                                    value={item.deliveryTime}
                                                                    onChange={(e) => handleDeliveryTimeChange_container(index, e.target.value)}
                                                                    required
                                                                />
                                                                <button
                                                                    className="btn btn-danger btn-sm ms-1"
                                                                    onClick={() => handleRemoveContainerCountry(index)}
                                                                >
                                                                    x
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="d-flex align-items-start w-100">
                                        <label>Do you ship Car ?<span className="text-danger">*</span></label>
                                        <Form.Check // prettier-ignore
                                            type="switch"
                                            id="car"
                                            checked={carService}
                                            onChange={(e) => setCarService(e.target.checked)}
                                        />
                                    </div>
                                    {carService && (
                                        <div className="d-flex flex-column align-items-start justify-content-start mt-4 w-100">
                                            <div className="d-flex w-100 flex-column align-items-start gap-2">
                                                <label>Countries we ship Car to<span className="text-danger">*</span></label>
                                                <Countries_selector onSelectCountry={(value) => handleCarCountry(value)} className="w-100" />
                                            </div>
                                            <div className="d-flex flex-md-row align-items-start justify-content-start w-100">
                                                <div className="d-flex flex-column align-items-start w-50 p-3 gap-2">
                                                    <lable>Countries Selected</lable>
                                                    {selectedCarCountries.map((item, index) => (
                                                        <input
                                                            key={index}
                                                            type="text"
                                                            value={item.country}
                                                            className="form-control"
                                                            readOnly
                                                            style={{ backgroundColor: "rgb(214, 214, 214)" }}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="d-flex flex-column align-items-start w-50 p-3 gap-2">
                                                    <lable>Estimated Delivery Duration(In Days)<span className="text-danger">*</span></lable>
                                                    {selectedCarCountries.map((item, index) => (
                                                        <div className="d-flex align-items-center gap-2 w-100" key={index}>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                placeholder="Enter the delivery duration in days"
                                                                style={{ backgroundColor: "rgb(214, 214, 214)" }}
                                                                value={item.deliveryTime}
                                                                onChange={(e) => handleDeliveryTimeChange_car(index, e.target.value)}
                                                                required
                                                            />
                                                            <button
                                                                className="btn btn-danger btn-sm ms-1"
                                                                onClick={() => handleRemoveCarCountry(index)}
                                                            >
                                                                x
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="d-flex align-items-start w-100">
                                        <label>Do you offer groupage to transport goods?<span className="text-danger">*</span></label>
                                        <Form.Check // prettier-ignore
                                            type="switch"
                                            id="groupage"
                                            checked={groupageService}
                                            onChange={(e) => setGroupageService(e.target.checked)}
                                        />
                                    </div>
                                    {groupageService && (
                                        <div className="d-flex flex-column align-items-start justify-content-start mt-4 w-100">
                                            <div className="d-flex w-100 flex-column align-items-start gap-2">
                                                <label>Countries we ship Groupage to<span className="text-danger">*</span></label>
                                                <Countries_selector onSelectCountry={(value) => handleGroupageCountry(value)} className="w-100" />
                                            </div>
                                            <div className="d-flex flex-md-row align-items-start justify-content-start w-100">
                                                <div className="d-flex flex-column align-items-start w-50 p-3 gap-2">
                                                    <lable>Countries Selected</lable>
                                                    {selectedGroupageCountries.map((item, index) => (
                                                        <input
                                                            key={index}
                                                            type="text"
                                                            value={item.country}
                                                            className="form-control"
                                                            readOnly
                                                            style={{ backgroundColor: "rgb(214, 214, 214)" }}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="d-flex flex-column align-items-start w-50 p-3 gap-2">
                                                    <lable>Estimated Delivery Duration(In Days)<span className="text-danger">*</span></lable>
                                                    {selectedGroupageCountries.map((item, index) => (
                                                        <div className="d-flex align-items-center gap-2 w-100" key={index}>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                placeholder="Enter the delivery duration in days"
                                                                style={{ backgroundColor: "rgb(214, 214, 214)" }}
                                                                value={item.deliveryTime}
                                                                onChange={(e) => handleDeliveryTimeChange_groupage(index, e.target.value)}
                                                                required
                                                            />
                                                            <button
                                                                className="btn btn-danger btn-sm ms-1"
                                                                onClick={() => handleRemoveGroupageCountry(index)}
                                                            >
                                                                x
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </div>

                            </>

                        </div>
                    </div>
                    <div className="d-flex pt-4 justify-content-end gap-3">
                        <Button label="Back"
                            severity="secondary"
                            icon="pi pi-arrow-left"
                            className="btn btn-secondary rounded-2"
                            iconPos="center"
                            onClick={() => stepperRef.current.prevCallback()} />
                        <Button label="Next"
                            icon="pi pi-arrow-right"
                            className="btn btn-primary rounded-2"
                            iconPos="center"
                            disabled={!isTransportationValid()}
                            onClick={() => stepperRef.current.nextCallback()} />
                    </div>
                </StepperPanel>
                <StepperPanel header="Additional Information">
                    <div className="flex flex-column h-12rem">
                        <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">

                            <>
                                <div className="d-flex flex-md-column align-items-center justify-content-center mt-4 gap-5 w-100">
                                    <div className="w-100 text-start">
                                        <label className="text-dark mb-1">Attach Registration Documents of the company</label>
                                        <DragAndDrop
                                            accept="application/pdf, image/jpeg"
                                            onFileDrop={(file) => setRegistrationDocument(file)}
                                            label="Drag and drop file to upload or Select file from folder (pdf, jpeg)"
                                        />
                                        <div className="d-flex align-items-start mb-4">
                                            {RegistrationDocument && <label>Uploaded File -:  <span>{RegistrationDocument.name}</span></label>}
                                        </div>

                                        <label className="text-dark mb-1">Attach Financial Documents of the company</label>
                                        <DragAndDrop
                                            accept="application/pdf, image/jpeg"
                                            onFileDrop={(file) => setFinancialDocument(file)}
                                            label="Drag and drop file to upload or Select file from folder (pdf, jpeg)"
                                        />
                                        <div className="d-flex align-items-start mb-4">
                                            {FinancialDocument && <label>Uploaded File -:  <span>{FinancialDocument.name}</span></label>}
                                        </div>

                                        <label className="text-dark mb-1">Passport of CEO / MD of the company</label>
                                        <DragAndDrop
                                            accept="application/pdf, image/jpeg"
                                            onFileDrop={(file) => setPassportCEO_MD(file)}
                                            label="Drag and drop file to upload or Select file from folder (pdf, jpeg)"
                                        />
                                        <div className="d-flex align-items-start mb-4">
                                            {PassportCEO_MD && <label>Uploaded File -:  <span>{PassportCEO_MD.name}</span></label>}
                                        </div>
                                    </div>
                                </div>
                            </>

                        </div>
                    </div>
                    <div className="d-flex pt-4 justify-content-end gap-3">
                        <Button label="Back"
                            severity="secondary"
                            className="btn btn-secondary rounded-2"
                            iconPos="center" icon="pi pi-arrow-left"
                            onClick={() => stepperRef.current.prevCallback()} />
                        <Button label="Submit"
                            onClick={() => { handleSubmit() }}
                            icon="pi pi-arrow-right"
                            className="btn btn-primary rounded-2"
                            iconPos="center" />
                    </div>
                </StepperPanel>
                <StepperPanel header="Success">
                    <div className="flex flex-column h-12rem">
                        <div className="border-2  border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">
                            <div className="w-100 mb-3">
                                <img src="/Images/congratulation.png" alt="CONGRATULATIONS" width='20%' />
                            </div>
                            <h2 className="text-primary"><i>CONGRATULATIONS</i></h2>
                            <h4>You have successfully registered your company</h4>
                            <button className="btn btn-primary mt-3" onClick={congratulations}><h5>Go to Dashboard</h5></button>
                        </div>
                    </div>
                </StepperPanel>

            </Stepper>
        </div>
    );
};
export default Registration;