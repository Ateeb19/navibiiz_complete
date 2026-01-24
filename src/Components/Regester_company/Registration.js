import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { useDropzone } from "react-dropzone";
import { IoMdAddCircleOutline } from "react-icons/io";
import Countries_selector from "../Selector/Countries_selector";
import Region_selector from "../Selector/Region_selector";
import State_selector from "../Selector/State_selector";
import Region_countries_selector from "../Selector/Region_country_selector";
import Form from 'react-bootstrap/Form';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../alert/Alert_message";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    const { showAlert } = useAlert();
    const port = process.env.REACT_APP_SECRET;
    const navigate = useNavigate();
    const stepperRef = useRef(null);

    const fetchToken = () => {
        axios
            .get(`${port}/user/check_token`, {
                headers: {
                    Authorization: token,
                },
            }).then((response) => {

            }).catch((err) => {
                console.log(err);
            });
    };
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const [RegistrationDocument, setRegistrationDocument] = useState(null);
    const [FinancialDocument, setFinancialDocument] = useState(null);
    const [PassportCEO_MD, setPassportCEO_MD] = useState(null);

    const [containerService, setContainerService] = useState(false);
    const [carService, setCarService] = useState(false);
    const [groupageService, setGroupageService] = useState(false);

    const handleFileDrop = (file) => {
        setSelectedFile(file);
        setSelectedImage(URL.createObjectURL(file));
    };

    const [step, setStep] = useState(1);
    const [visibleSelectors, setVisibleSelectors] = useState({});
    const [companyName, setCompanyName] = useState("");
    const [contact_person_name, setContact_person_name] = useState("");
    const [password, setPassword] = useState("");
    const [confirm_password, setConfirm_password] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [description, setDescription] = useState("");
    const [locations, setLocations] = useState([
        { country: "", state: "", city: "" },
    ]);
    const [bankaccount, setBankaccount] = useState("");
    const [account_number, setAccount_number] = useState('');
    const [iban_number, setIban_number] = useState('');
    const [paypal_id, setPaypal_id] = useState("");
    const [paypal_id_check, setPaypal_id_check] = useState('');
    const [selectedCountry, setSelectedCountry] = useState("");

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

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            const hasChanges =
                selectedImage ||
                selectedFile ||
                RegistrationDocument ||
                FinancialDocument ||
                PassportCEO_MD ||
                containerService ||
                carService ||
                groupageService ||
                companyName.trim() !== "" ||
                contact_person_name.trim() !== "" ||
                password.trim() !== "" ||
                confirm_password.trim() !== "" ||
                contactNumber.trim() !== "" ||
                emailAddress.trim() !== "" ||
                description.trim() !== "" ||
                bankaccount.trim() !== "" ||
                account_number.trim() !== "" ||
                iban_number.trim() !== "" ||
                paypal_id.trim() !== "" ||
                paypal_id_check.trim() !== "" ||
                locations.some(
                    (loc) =>
                        loc.country.trim() !== "" ||
                        loc.state.trim() !== "" ||
                        loc.city.trim() !== ""
                );

            if (hasChanges) {
                localStorage.setItem('email_is', emailAddress);
                event.preventDefault();
                event.returnValue =
                    "The page is about to reload, and your form data will be reset. Do you want to continue?";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        fetchToken();

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);

        };
    }, [
        selectedImage,
        selectedFile,
        RegistrationDocument,
        FinancialDocument,
        PassportCEO_MD,
        containerService,
        carService,
        groupageService,
        companyName,
        contact_person_name,
        password,
        confirm_password,
        contactNumber,
        emailAddress,
        description,
        bankaccount,
        account_number,
        iban_number,
        paypal_id,
        paypal_id_check,
        locations
    ]);

    useEffect(() => {
        let isReload = false;

        // Try modern way first
        const navEntries = performance.getEntriesByType("navigation");
        if (navEntries.length > 0 && navEntries[0].type === "reload") {
            isReload = true;
        }

        // Fallback for older browsers
        if (performance.navigation.type === 1) {
            isReload = true;
        }

        if (isReload) {
            const emailaddress = localStorage.getItem('email_is');
            localStorage.setItem('valid', 'false');

            axios.post(`${port}/user/delete_user`, { email: emailaddress })
                .then((response) => {
                    console.log(response.data);
                })
                .catch((error) => {
                    console.error('Error deleting user:', error);
                });
            console.log('Page was reloaded');
        }
    }, []);


    // useEffect(() => {
    //     const navEntries = performance.getEntriesByType("navigation");
    //     if (navEntries.length > 0 && navEntries[0].type === "reload") {
    //         const emailaddress = localStorage.getItem('email_is');
    //         localStorage.setItem('valid', 'false');
    //         axios.post(`${port}/user/delete_user`, { email: emailaddress })
    //             .then((response) => {
    //                 console.log(response.data);
    //             }).catch((error) => {
    //                 console.error('Error deleting user:', error);
    //             });
    //         console.log('Page was reloaded');
    //     }
    // }, []);


    const handleAddLocation = () => {
        if (locations.length >= 10) {
            showAlert("You can only add up to 10 locations.");
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


    //countiner
    const [selectedContainerCountries, setSelectedContainerCountries] = useState([]);
    const [activeRegion, setActiveRegion] = useState(" ");
    const [activeCountry, setActiveCountry] = useState(" ");

    const handleContainerRegion = (value) => {
        setActiveRegion(value);
        setActiveCountry(" ");
    };
    // const handleContainerRegion = (value) => {
    //     if (value && !selectedContainerCountries.some((item) => item.country === value)) {
    //         setSelectedContainerCountries([...selectedContainerCountries, { region: value, country: '', deliveryTime: "" }]);
    //     }
    // };

    const handleContainerCountry = (value) => {
        setActiveCountry(value);


        // if (!value || !activeRegion) return;

        // setSelectedContainerCountries(prev => {
        //     const alreadyExists = prev.some(
        //         item => item.region === activeRegion && item.country === value
        //     );

        //     if (alreadyExists) return prev;

        //     return [
        //         ...prev,
        //         { region: activeRegion, country: value, deliveryTime: "" }
        //     ];
        // });
    };

    const handle_add_country_region = () => {
        if (!activeRegion && !activeCountry) {
            showAlert("Select Region or Country");
            return;
        }
        setSelectedContainerCountries(prev => {
            const alreadyExists = prev.some(
                item => item.region === activeRegion && item.country === activeCountry
            );

            if (alreadyExists) return prev;

            return [
                ...prev,
                { region: activeRegion, country: activeCountry, deliveryTime: "" }
            ];
        });
    }
    // const handleContainerCountry = (index, value) => {
    //     if (value && !selectedContainerCountries.some((item) => item.country === value)) {
    //         const updateCountry = [...selectedContainerCountries];
    //         updateCountry[index].country = value.country;
    //         setSelectedContainerCountries(updateCountry);
    //     }
    // };
    const handleDeliveryTimeChange_container = (index, value) => {
        const updatedCountries = [...selectedContainerCountries];
        updatedCountries[index].deliveryTime = value;
        setSelectedContainerCountries(updatedCountries);
    };
    const handleRemoveContainerCountry = (indexToRemove) => {
        setSelectedContainerCountries(prev =>
            prev.filter((_, index) => index !== indexToRemove)
        );
    };
    // const handleRemoveContainerCountry = (indexToRemove) => {
    //     const updatedCountries = selectedContainerCountries.filter((_, index) => index !== indexToRemove);
    //     setSelectedContainerCountries(updatedCountries);
    // };

    //Groupage service
    const [selectedGroupageCountries, setSelectedGroupageCountries] = useState([]);
    const [activeGroupageRegion, setActiveGroupageRegion] = useState(" ");
    const [activeGroupageCountry, setActiveGroupageCountry] = useState(" ");

    const handleGroupageRegion = (value) => {
        setActiveGroupageRegion(value);
        setActiveGroupageCountry(" ");
    };
    const handleGroupageCountry = (value) => {
        setActiveGroupageCountry(value);

        // if (!value || !activeGroupageRegion) return;

        // setSelectedGroupageCountries(prev => {
        //     const alreadyExists = prev.some(
        //         item => item.region === activeGroupageRegion && item.country === value
        //     );

        //     if (alreadyExists) return prev;

        //     return [
        //         ...prev,
        //         { region: activeGroupageRegion, country: value, deliveryTime: "" }
        //     ];
        // });
    };
    const handle_groupage_add_country_region = () => {
        if (!activeGroupageRegion && !activeGroupageCountry) {
            showAlert("Select Region or Country");
            return;
        }
        setSelectedGroupageCountries(prev => {
            const alreadyExists = prev.some(
                item => item.region === activeGroupageRegion && item.country === activeGroupageCountry
            );

            if (alreadyExists) return prev;

            return [
                ...prev,
                { region: activeGroupageRegion, country: activeGroupageCountry, deliveryTime: "" }
            ];
        });
    }
    // const handleGroupageCountry = (value) => {
    //     if (value && !selectedGroupageCountries.some((item) => item.country === value)) {
    //         setSelectedGroupageCountries([...selectedGroupageCountries, { country: value, deliveryTime: "" }]);
    //     }
    // };

    const handleDeliveryTimeChange_groupage = (index, value) => {
        const updatedCountries = [...selectedGroupageCountries];
        updatedCountries[index].deliveryTime = value;
        setSelectedGroupageCountries(updatedCountries);
    };

    const handleRemoveGroupageCountry = (indexToRemove) => {
        setSelectedGroupageCountries(prev =>
            prev.filter((_, index) => index !== indexToRemove)
        );
    };

    //Car service
    const [selectedCarCountries, setSelectedCarCountries] = useState([]);
    const [activeCarRegion, setActiveCarRegion] = useState(" ");
    const [activeCarCountry, setActiveCarCountry] = useState(" ");

    const handleCarRegion = (value) => {
        setActiveCarRegion(value);
        setActiveCarCountry(" ");
    };
    const handleCarCountry = (value) => {
        setActiveCarCountry(value);

        // if (!value || !activeCarRegion) return;

        // setSelectedCarCountries(prev => {
        //     const alreadyExists = prev.some(
        //         item => item.region === activeCarRegion && item.country === value
        //     );

        //     if (alreadyExists) return prev;

        //     return [
        //         ...prev,
        //         { region: activeCarRegion, country: value, deliveryTime: "" }
        //     ];
        // });
    };

    const handle_car_add_country_region = () => {
        if (!activeCarRegion && !activeCarCountry) {
            showAlert("Select Region or Country");
            return;
        }
        setSelectedCarCountries(prev => {
            const alreadyExists = prev.some(
                item => item.region === activeCarRegion && item.country === activeCarCountry
            );

            if (alreadyExists) return prev;

            return [
                ...prev,
                { region: activeCarRegion, country: activeCarCountry, deliveryTime: "" }
            ];
        });
    }

    const handleDeliveryTimeChange_car = (index, value) => {
        const updatedCountries = [...selectedCarCountries];
        updatedCountries[index].deliveryTime = value;
        setSelectedCarCountries(updatedCountries);
    };
    const handleRemoveCarCountry = (indexToRemove) => {
        setSelectedCarCountries(prev =>
            prev.filter((_, index) => index !== indexToRemove)
        );
    };
    // const handleRemoveCarCountry = (indexToRemove) => {
    //     const updatedCountries = selectedCarCountries.filter((_, index) => index !== indexToRemove);
    //     setSelectedCarCountries(updatedCountries);
    // };

    const handleregester = async () => {
        const value = {
            name: companyName,
            email: emailAddress,
            password: password,
            user_type: 'company',
        };
        if (localStorage.getItem('valid') === 'true') {
            return true;
        }
        try {
            const response = await axios.post(`${port}/user/regester`, value, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.status === true) {
                localStorage.setItem('valid', 'true');
                return true;
            } else {
                showAlert(response.data.message);;
                localStorage.setItem('valid', 'false');
                return false;
            }
        } catch (err) {
            localStorage.setItem('valid', 'false');
            showAlert('You are Offline! Please Connect to Internet');
            return false;
        }
    };

    // const basicDetails = useMemo(() => {
    //     if (!companyName || !password || !confirm_password || !contactNumber || !emailAddress || !description)
    //         return false;
    //     for (const location of locations) {
    //         if (!location.country || !location.state || !location.city) return false;
    //     }
    //     return true;
    // }, [companyName, password, confirm_password, paypal_id, contactNumber, emailAddress, description, locations]);

    const basicDetails = useMemo(() => {
        if (!companyName || !password || !confirm_password || !contactNumber || !emailAddress)
            return false;
        for (const location of locations) {
            if (!location.country) return false;
        }
        return true;
    }, [companyName, password, confirm_password, contactNumber, emailAddress, locations]);


    const isTransportationValid = useMemo(() => {
        if (containerService && selectedContainerCountries.length === 0) return false;
        if (carService && selectedCarCountries.length === 0) return false;
        if (groupageService && selectedGroupageCountries.length === 0) return false;

        if (!containerService && !carService && !groupageService) return false;

        return true;
    }, [
        containerService,
        carService,
        groupageService,
        selectedContainerCountries,
        selectedCarCountries,
        selectedGroupageCountries
    ]);


    const isPaymentValid = () => {
        if (bankaccount) {
            if (!account_number || !iban_number) {
                return false;
            } else {
                return true;
            }
        }

        if (paypal_id_check) {
            if (!paypal_id) {
                return false;
            } else {
                return true;
            }
        }
        return true;
    }

    const [congrat, setCongrat] = useState(false);

    // Utility function to upload a file to Cloudinary
    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'company_upload'); 

        try {
            const response = await fetch('https://api.cloudinary.com/v1_1/dizzgvtgf/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            return data.secure_url; // The final hosted file URL
        } catch (err) {
            console.error('Cloudinary upload failed:', err);
            return '';
        }
    };
    const [RegistrationDocument_selected, setRegistrationDocument_selected] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);

    const handleZoomIn = () => {
        setZoomLevel((prev) => Math.min(prev + 0.2, 3));
    };

    const handleZoomOut = () => {
        setZoomLevel((prev) => Math.max(prev - 0.2, 0.5));
    };
    const [validate, setValidate] = useState(false);
    const handleSubmit = async () => {
        try {
            // 1. Upload each file to Cloudinary (if it exists)
            const imageUrl = selectedFile ? await uploadToCloudinary(selectedFile) : '';
            const regDocUrl = RegistrationDocument ? await uploadToCloudinary(RegistrationDocument) : '';
            const finDocUrl = FinancialDocument ? await uploadToCloudinary(FinancialDocument) : '';
            const passportUrl = PassportCEO_MD ? await uploadToCloudinary(PassportCEO_MD) : '';

            // 2. Build JSON object with Cloudinary URLs and all form fields
            const formData = {
                companyName,
                contactNumber,
                contact_person_name,
                emailAddress,
                password,
                paypal_id,
                account_number,
                iban_number,
                description,
                locations: JSON.stringify(locations),
                transportation: JSON.stringify({
                    containerService,
                    selectedContainerCountries,
                    carService,
                    selectedCarCountries,
                    groupageService,
                    selectedGroupageCountries
                }),
                files: {
                    selectedImage: imageUrl,
                    registrationDocument: regDocUrl,
                    financialDocument: finDocUrl,
                    passportCEO_MD: passportUrl
                }
            };
            setValidate(true);
            console.log('Form Data:', formData);
            // 3. Send data to backend via Axios
            const response = await axios.post(`${port}/company/regester_company`, formData, {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200) {
                showAlert('Data submitted successfully!');
                setValidate(false);
                setCongrat(true);
            } else {
                showAlert('Error submitting data');
            }

        } catch (error) {
            if (error.response) {
                setValidate(false);
                console.error("Server Error:", error.response.data);
                console.error("Status Code:", error.response.status);
                showAlert(`Error: ${error.response.status} - ${error.response.data.message || "Server error"}`);
            } else if (error.request) {
                console.error("No response received from server");
                showAlert("No response from server");
            } else {
                console.error("Error setting up the request", error.message);
                showAlert("Error setting up request");
            }
        }
    };

    // const [congrat, setCongrat] = useState(false);
    // const handleSubmit = async () => {
    //     const formData = new FormData();
    //     formData.append('companyName', companyName);
    //     formData.append('contactNumber', contactNumber);
    //     formData.append('contact_person_name', contact_person_name);
    //     formData.append('emailAddress', emailAddress);
    //     formData.append('password', password);
    //     formData.append('paypal_id', paypal_id);
    //     formData.append('account_number', account_number);
    //     formData.append('iban_number', iban_number);
    //     formData.append('description', description);
    //     formData.append('locations', JSON.stringify(locations));
    //     if (selectedFile) {
    //         formData.append('selectedImage', selectedFile);
    //     }
    //     formData.append('transportation', JSON.stringify({
    //         containerService,
    //         selectedContainerCountries,
    //         carService,
    //         selectedCarCountries,
    //         groupageService,
    //         selectedGroupageCountries
    //     }));
    //     if (RegistrationDocument) {
    //         formData.append('registrationDocument', RegistrationDocument);
    //     }
    //     if (FinancialDocument) {
    //         formData.append('financialDocument', FinancialDocument);
    //     }
    //     if (PassportCEO_MD) {
    //         formData.append('passportCEO_MD', PassportCEO_MD);
    //     }

    //     axios.post(`${port}/company/regester_company`, formData,
    //         {
    //             headers: {
    //                 Authorization: token,
    //                 'Content-Type': 'multipart/form-data',
    //             }
    //         })
    //         .then(response => {
    //             if (response.status === 200) {
    //                 showAlert('Data submited Successfully!');
    //             } else {
    //                 showAlert('Error submitting data');
    //             }
    //             setCongrat(true);
    //         })
    //         .catch(error => {
    //             if (error.response) {
    //                 console.error("Server Error:", error.response.data);
    //                 console.error("Status Code:", error.response.status);
    //                 showAlert(`Error: ${error.response.status} - ${error.response.data.message || "Server error"}`);
    //             } else if (error.request) {
    //                 console.error("No response received from server");
    //                 showAlert("No response from server");
    //             } else {
    //                 console.error("Error setting up the request", error.message);
    //                 showAlert("Error setting up request");
    //             }
    //         });

    //     // .catch(error => {
    //     //     console.error('Error:', error);
    //     //     showAlert('You are Offline! Please Connect to Internet');
    //     // });
    // };


    return (
        <div className="flex justify-content-start h-100vh">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="border-2 border-dashed surface-border border-round surface-ground p-3 text-center">
                            <DragAndDrop
                                accept="image/*"
                                onFileDrop={handleFileDrop}
                                label="Drag and drop company logo here, or click to select (only one image allowed)"
                            />
                            {selectedImage && (
                                <div className="mt-3">
                                    <h4>Preview:</h4>
                                    <img
                                        src={selectedImage}
                                        alt="Selected"
                                        className="rounded-circle border border-1 border-dark"
                                        style={{ width: "150px", height: '150px' }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col-12 col-md-6 col-lg-4 mb-3 d-flex flex-column align-items-start">
                        <label className="shipping-input-label">Transporter Name <span className="text-danger">*</span></label>
                        <input
                            className="shipping-input-field"
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Enter the company name"
                            style={{ backgroundColor: 'rgb(214, 214, 214)' }}
                            disabled={localStorage.getItem('valid') === 'true'}
                            required
                        />
                    </div>
                    {/* <div className="col-12 col-md-6 col-lg-4 mb-3 d-flex flex-column align-items-start">
                                <label className="shipping-input-label">Contact Person Name</label>
                                <input
                                    className="shipping-input-field"
                                    type="text"
                                    placeholder="Enter the contact person name"
                                    value={contact_person_name}
                                    onChange={(e) => setContact_person_name(e.target.value)}
                                    style={{ backgroundColor: 'rgb(214, 214, 214)' }}
                                    required
                                />
                            </div> */}
                    <div className="col-12 col-md-6 col-lg-4 mb-3 d-flex flex-column align-items-start">
                        <label className="shipping-input-label">Contact Number <span className="text-danger">*</span></label>
                        <PhoneInput
                            international
                            className="shipping-input-field-contact"
                            style={{ backgroundColor: 'rgb(214, 214, 214)' }}
                            defaultCountry="DE"
                            value={contactNumber}
                            onChange={setContactNumber} />
                        {/* <input
                                    className="shipping-input-field"
                                    type="tel"
                                    placeholder="Enter the company number"
                                    value={contactNumber}
                                    onChange={(e) => setContactNumber(e.target.value)}
                                    style={{ backgroundColor: 'rgb(214, 214, 214)' }}
                                    required
                                /> */}
                    </div>
                    <div className="col-12 col-md-6 col-lg-4 mb-3 d-flex flex-column align-items-start">
                        <label className="shipping-input-label">Email Address <span className="text-danger">*</span></label>
                        <input
                            className="shipping-input-field"
                            type="email"
                            placeholder="Enter the company email"
                            value={emailAddress}
                            onChange={(e) => setEmailAddress(e.target.value)}
                            style={{ backgroundColor: 'rgb(214, 214, 214)' }}
                            disabled={localStorage.getItem('valid') === 'true'}
                            required
                        />
                    </div>
                </div>

                <div className="row mt-4">
                    {/* <div className="col-12 col-md-6 col-lg-4 mb-3 d-flex flex-column align-items-start">
                                <label className="shipping-input-label">Email Address <span className="text-danger">*</span></label>
                                <input
                                    className="shipping-input-field"
                                    type="email"
                                    placeholder="Enter the company email"
                                    value={emailAddress}
                                    onChange={(e) => setEmailAddress(e.target.value)}
                                    style={{ backgroundColor: 'rgb(214, 214, 214)' }}
                                    disabled={localStorage.getItem('valid') === 'true'}
                                    required
                                />
                            </div> */}
                    <div className="col-12 col-md-6 col-lg-4 mb-3 d-flex flex-column align-items-start">
                        <label className="shipping-input-label">Password <span className="text-danger">*</span></label>
                        <input
                            className="shipping-input-field"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter the password"
                            style={{ backgroundColor: 'rgb(214, 214, 214)' }}
                            disabled={localStorage.getItem('valid') === 'true'}
                            required
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-4 mb-3 d-flex flex-column align-items-start">
                        <label className="shipping-input-label">Confirm Password<span className="text-danger">*</span></label>
                        <input
                            className="shipping-input-field"
                            type="password"
                            placeholder="Enter the confirm password"
                            value={confirm_password}
                            onChange={(e) => setConfirm_password(e.target.value)}
                            style={{ backgroundColor: 'rgb(214, 214, 214)' }}
                            disabled={localStorage.getItem('valid') === 'true'}
                            required
                        />
                    </div>
                </div>

                {locations.map((location, index) => (
                    <div className="row mt-3 position-relative" key={index}>
                        <div className="col-12 col-md-12 mb-3 d-flex flex-column align-items-start">
                            <label className="shipping-input-label">Country <span className="text-danger">*</span></label>
                            <Countries_selector
                                onSelectCountry={(value) => { handlecountry(value, index); setSelectedCountry(value) }}
                                label="Select the country"
                                value={location.country}
                                paddingcount='12px 18px' fontsizefont='15px' bgcolor='#ebebeb' bordercolor='1px solid #ebebeb' borderradiuscount='6px'
                                required
                            />
                        </div>
                        {/* <div className="col-12 col-md-4 mb-3 d-flex flex-column align-items-start">
                                    <label className="shipping-input-label">State <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        value={location.state}
                                        className="shipping-input-field"
                                        style={{ backgroundColor: 'rgb(214, 214, 214)' }}
                                        readOnly
                                        onClick={() => toggleSelector(index)}
                                    />
                                    {visibleSelectors[index] && (
                                        <div className="w-100">
                                            <State_selector
                                                selectedCountry={selectedCountry}
                                                onSelectState={(value) => handlestate(value, index)}
                                                value={location.state}
                                                paddingcount='12px 18px' fontsizefont='15px' bgcolor='#ebebeb' bordercolor='1px solid #ebebeb' borderradiuscount='6px'
                                            />
                                        </div>
                                    )}
                                </div> */}
                        {/* <div className="col-12 col-md-4 mb-3 d-flex flex-column align-items-start">
                            <label className="shipping-input-label ">City <span className="text-danger">*</span></label>
                            <input
                                className="shipping-input-field"
                                type="text"
                                placeholder="Enter the city name"
                                style={{ backgroundColor: "rgb(214, 214, 214)" }}
                                value={location.city}
                                onChange={(e) => handlecity(e.target.value, index)}
                                required
                            />
                        </div> */}

                        {index > 0 && (
                            <div className="">
                                <button
                                    className="btn btn-danger btn-sm position-absolute"
                                    style={{ top: "-10px", right: "20px" }}
                                    onClick={() => handleRemoveLocation(index)}
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                <div className="d-flex justify-content-end mt-3">
                    <button
                        className="btn btn-light text-info border border-info"
                        onClick={handleAddLocation}
                    >
                        <IoMdAddCircleOutline className="fs-4" /> Add More Location
                    </button>
                </div>

                {/* <div className="row mt-4">
                    <div className="col-12 d-flex flex-column align-items-start">
                        <label className="shipping-input-label">Brief description about the company <span className="text-danger">*</span></label>
                        <textarea
                            className="shipping-input-field"
                            rows="5"
                            placeholder="Enter the company description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{ backgroundColor: 'rgb(214, 214, 214)' }}
                            required
                        ></textarea>
                    </div>
                </div> */}

                {/* <div className="d-flex pt-4 justify-content-end">
                    <Button
                        label="Next"
                        icon="pi pi-arrow-right"
                        disabled={!basicDetails}
                        className="btn rounded-2 "
                        style={{ backgroundColor: '#1fa4e6', width: '100px', color: '#fff', fontWeight: '400' }}
                        iconPos="center"
                        onClick={async () => {
                            if (password !== confirm_password) {
                                showAlert('Password and confirm password does not match');
                                return;
                            }
                            const done = await handleregester();
                            if (done) {
                                if (localStorage.getItem('valid') === 'true') {
                                    stepperRef.current.nextCallback();
                                    setStep((prev) => prev + 1);
                                }
                            }
                            window.scrollTo({ top: 0 });
                        }}
                    />
                </div> */}
            </div>

            <div className="flex flex-column h-12rem">
                
                <div className="d-flex pt-4 justify-content-end w-100 p-2">
                    <Button label="Submit"
                        // disabled={!(basicDetails && isTransportationValid)}
                        disabled={!(basicDetails)}
                        onClick={
                            async () => {
                                if (password !== confirm_password) {
                                    showAlert('Password and confirm password does not match');
                                    return;
                                }
                                const done = await handleregester();
                                if (done) {
                                    if (localStorage.getItem('valid') === 'true') {
                                        handleSubmit();
                                        setValidate(true);
                                        window.scrollTo({ top: 0 });
                                    }
                                }
                            }
                        }
                        // onClick={() => { handleSubmit(); setValidate(true); setStep((prev) => prev + 1); window.scrollTo({ top: 0 }); }}
                        icon="pi pi-arrow-right"
                        className="btn rounded-2 "
                        style={{ backgroundColor: '#1fa4e6', width: '100px', color: '#fff', fontWeight: '400' }}
                        iconPos="center" />
                </div>
            </div>

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
                                <p>You have successfully registered your company.<br /> Login with company email and password</p>
                            </div>

                            <div className="success-button">
                                <button className="btn-success" onClick={() => navigate('/login')}>Go To Login</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
export default Registration;