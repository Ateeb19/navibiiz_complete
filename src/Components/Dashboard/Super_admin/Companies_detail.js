import React, { useCallback, useEffect, useState } from "react";
import CountriesSelector from "../../Selector/Countries_selector";
import Region_countries_selector from "../../Selector/Region_country_selector";
import Region_selector from "../../Selector/Region_selector";
import { GoPencil } from "react-icons/go";
import { FaCity, FaInfoCircle, FaPassport, FaPaypal, FaPhoneAlt } from "react-icons/fa";
import { MdEmail, MdFileDownload, MdSwitchAccount } from "react-icons/md";
import { IoMdDocument } from "react-icons/io";
import { BsBank2 } from "react-icons/bs";
import { useParams } from "react-router-dom";
import { IoStar } from "react-icons/io5";
import { RiPencilFill } from "react-icons/ri";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../alert/Alert_message";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import ConfirmationModal from '../../alert/Conform_alert';
import { FaLocationDot } from "react-icons/fa6";



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

const Companies_detail = () => {
    const port = process.env.REACT_APP_SECRET;
    const { showAlert } = useAlert();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const [selectedCompany, setSelectedCompany] = useState(null);
    const { id: companyId } = useParams();
    const [editPopupOpen, setEditPopupOpen] = useState(false);
    const [newValue, setNewValue] = useState('');
    const [editField, setEditField] = useState({ label: '', previousValue: '' });
    const [edit_company_document, setEdit_company_document] = useState(false);
    const [company_document, setCompany_document] = useState(null);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [newCountryData, setNewCountryData] = useState({
        region: '',
        country: '',
        duration: '',
        name: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [activeRegion, setActiveRegion] = useState('');
    const [change_password_admin, setChange_password_admin] = useState(false);
    const [change_password, setChange_password] = useState(false);
    const [confirm_password, setConfirm_password] = useState('');
    const [new_password, setNew_password] = useState('');
    const [previous_password, setPrevious_password] = useState('');
    const [handle_profile_edit, setHandle_profile_edit] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [edit_company, setEdit_company] = useState(false);
    const [userInfo, setUserInfo] = useState('');


    useEffect(() => {
        if (!token) {
            navigate('/');
        }
        if (userRole !== 'admin' && userRole !== 'Sadmin' && userRole !== 'user') {
            navigate('/');
        } else {
            axios.get(`${port}/user/display_profile`, {
                headers: {
                    Authorization: token,
                }
            }).then((response) => {
                setUserInfo(response.data.message);
            }).catch((err) => { console.log(err) });
        }
    }, [userRole]);

    const fetch_company_detail = async () => {
        try {
            const response = await axios.get(`${port}/s_admin/company_info_detail/${companyId}`, {
                headers: { Authorization: token },
            });

            const data = response.data;

            if (data.status && data.message.length > 0) {
                setSelectedCompany(data.message[0]);
            } else {
                console.error('No data received or invalid format');
            }
        } catch (error) {
            console.error('Failed to fetch company details:', error);
        }
    }
    useEffect(() => {
        fetch_company_detail();
    }, [])

console.log(selectedCompany);



    const handle_edit_company = (company) => {
        setEdit_company(!edit_company);
    }
    const handleScrollToMore = () => {
        const targetDiv = document.getElementById("more");
        if (targetDiv) {
            targetDiv.scrollIntoView({ behavior: "smooth" });
        }
    };
    const handleDeleteRow = async (index) => {
        if (userRole === 'admin') {
            const row = selectedCompany.tableData[index];
            const company_id = selectedCompany.id;
            const row_id = row.id;

            try {
                const response = await axios.delete(`${port}/admin/delete_company_country`, {
                    data: { company_id, row_id },
                    headers: {
                        Authorization: token,
                    }
                });

                if (response.data.status) {
                    const updatedData = [...selectedCompany.tableData];
                    updatedData.splice(index, 1);
                    setSelectedCompany(prev => ({
                        ...prev,
                        tableData: updatedData
                    }));
                    showAlert(response.data.message);
                } else {
                    showAlert('Failed to delete row from the server!');
                }
            } catch (error) {
                console.error('Error deleting row:', error);
                showAlert('Something went wrong while deleting the row!');
            }
            return;
        }
        const row = selectedCompany.tableData[index];
        const company_id = selectedCompany.id;
        const row_id = row.id;

        try {
            const response = await axios.delete(`${port}/s_admin/delete_company_country`, {
                data: { company_id, row_id },
                headers: {
                    Authorization: token,
                }
            });

            if (response.data.status) {
                const updatedData = [...selectedCompany.tableData];
                updatedData.splice(index, 1);
                setSelectedCompany(prev => ({
                    ...prev,
                    tableData: updatedData
                }));
                showAlert(response.data.message);
            } else {
                showAlert('Failed to delete row from the server!');
            }
        } catch (error) {
            console.error('Error deleting row:', error);
            showAlert('Something went wrong while deleting the row!');
        }
    };
    const handle_change_password_admin = () => {
        setChange_password_admin(!change_password_admin)
    }
    const handleFileDrop = (file) => {
        setSelectedFile(file);
        setSelectedImage(URL.createObjectURL(file));
    };
    const handle_logo_update = async () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append("image", selectedFile);

            try {
                const response = await fetch(`${port}/admin/edit_logo/${selectedCompany.id}`, {
                    method: "POST",
                    headers: {
                        Authorization: token,
                    },
                    body: formData,
                });

                if (response) {
                    const result = await response.json();
                    showAlert(result.message);
                    // setTimeout(() => {
                    //     window.location.reload();
                    // }, 2500);
                    fetch_company_detail();
                    setHandle_profile_edit(false);
                    setSelectedFile('');
                    setSelectedImage('');
                } else {
                    console.error("Failed to upload image");
                }
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        } else {
            showAlert('Please select a Logo');
        }
    }
    const query_update_password = () => {
        if (previous_password === '' || new_password === '' || confirm_password === '') {
            showAlert('Please fill all the fields.');
        } else {
            if (new_password !== confirm_password) {
                showAlert('Confirm password not matched.');
                return;
            }
            axios.put(`${port}/user/update_password`, {
                editPasswordInputOld: previous_password,
                editPasswordInputNew: new_password,
            }, {
                headers: {
                    Authorization: token,
                }
            }).then((response) => {
                showAlert(response.data.message);
                if (response.data.status === true) {
                    setPrevious_password('');
                    setNew_password('');
                    setConfirm_password('');
                    setChange_password(false);
                    setChange_password_admin(false);
                }
            }).catch((err) => { console.log(err); });
        }

    }
    const handel_forget_password = async () => {
        try {
            const res = await axios.post(`${port}/user/forget_password`, {
                email: userInfo.email,
            });

            showAlert(res.data.message);
        } catch (error) {
            showAlert('Something went wrong. Please try again.');
        }
    }
    const handle_region = (value) => {
        setActiveRegion(value);
        setNewCountryData(prev => ({
            ...prev,
            region: value
        }));
    };
    const handle_region_country = (value) => {
        if (activeRegion) {
            setNewCountryData({ region: activeRegion, country: value, duration: '', name: '' });
        } else {
            return;
        }
    }
    const handleServiceCheckboxChange = (e) => {
        const { value } = e.target;
        setNewCountryData(prev => ({
            ...prev,
            name: value
        }));
    };

    const handle_add_new_country = () => {
        if (selectedCompany.tableData[0].region) {
            // if(!newCountryData.region )
            if (!newCountryData.region && !newCountryData.country) {
                showAlert("Select Region or Country");
                return;
            }
            if (!newCountryData.duration || !newCountryData.name) {
                showAlert('Fill Duration and service');
                return;
            }
        }

        if (userRole === 'admin') {
            axios.post(`${port}/admin/add_new_country/${selectedCompany.id}`, newCountryData, {
                headers: {
                    Authorization: token,
                }
            }).then((response) => {
                if (response.data.status) {
                    showAlert(response.data.message);
                    setShowAddPopup(false);
                    const newRow = {
                        id: response.data.insertedId,
                        region: newCountryData.region,
                        countries: newCountryData.country,
                        duration: newCountryData.duration,
                        service_type: newCountryData.name
                    };

                    setSelectedCompany(prev => ({
                        ...prev,
                        tableData: [...prev.tableData, newRow]
                    }));

                    setNewCountryData({
                        region: '',
                        country: '',
                        duration: '',
                        name: '',
                    });

                } else {
                    showAlert('Failed to add new country!');
                }
            }).catch((err) => {
                console.error('Error adding new country:', err);
                showAlert('Something went wrong!');
            });
            return;
        }


        axios.post(`${port}/s_admin/add_new_country/${selectedCompany.id}`, newCountryData, {
            headers: {
                Authorization: token,
            }
        }).then((response) => {
            if (response.data.status) {
                showAlert(response.data.message);
                setShowAddPopup(false);
                const newRow = {
                    id: response.data.insertedId,
                    region: newCountryData.region,
                    countries: newCountryData.country,
                    duration: newCountryData.duration,
                    service_type: newCountryData.name
                };

                setSelectedCompany(prev => ({
                    ...prev,
                    tableData: [...prev.tableData, newRow]
                }));

                setNewCountryData({
                    region: '',
                    country: '',
                    duration: '',
                    name: '',
                });

            } else {
                showAlert('Failed to add new country!');
            }
        }).catch((err) => {
            console.error('Error adding new country:', err);
            showAlert('Something went wrong!');
        });
    };
    const handle_edit_company_document = async () => {
        if (userRole === 'admin') {
            if (company_document) {
                const formData = new FormData();
                formData.append("type", editField.label);
                formData.append("image", company_document);

                try {
                    const response = await fetch(`${port}/admin/edit_company_document/${selectedCompany.id}`, {
                        method: "POST",
                        headers: {
                            Authorization: token,
                        },
                        body: formData,
                    });

                    if (response) {
                        const result = await response.json();
                        showAlert(result.message);
                        // setTimeout(() => {
                        //     window.location.reload();
                        // }, 2500);
                        fetch_company_detail();
                        setHandle_profile_edit(false);
                        setSelectedFile('');
                        setSelectedImage('');
                    } else {
                        console.error("Failed to upload image");
                    }
                } catch (error) {
                    console.error("Error uploading image:", error);
                }
            } else {
                showAlert('Please select a Logo');
            }
        } else if (userRole === 'Sadmin') {
            if (company_document) {
                const formData = new FormData();
                formData.append("type", editField.label);
                formData.append("image", company_document);

                try {
                    const response = await fetch(`${port}/s_admin/edit_company_document/${selectedCompany.id}`, {
                        method: "POST",
                        headers: {
                            Authorization: token,
                        },
                        body: formData,
                    });

                    if (response) {
                        const result = await response.json();
                        showAlert(result.message);
                        // setTimeout(() => {
                        //     window.location.reload();
                        // }, 2500);
                        fetch_company_detail();
                        setHandle_profile_edit(false);
                        setSelectedFile('');
                        setSelectedImage('');
                    } else {
                        console.error("Failed to upload image");
                    }
                } catch (error) {
                    console.error("Error uploading image:", error);
                }
            } else {
                showAlert('Please select a Logo');
            }
        }
    }

    const handle_edit_company_query = () => {
        if (userRole === 'admin') {
            axios.put(`${port}/admin/edit_company/${selectedCompany.id}`, { editField, newValue }, {
                headers: {
                    Authorization: token,
                }
            }).then((response) => {
                setEditPopupOpen(false);
                // window.location.reload();
                fetch_company_detail();
            }
            ).catch((err) => { console.log(err); });
            return;
        }
        axios.put(`${port}/s_admin/edit_company/${selectedCompany.id}`, { editField, newValue }, {
            headers: {
                Authorization: token,
            }
        }).then((response) => {
            setEditPopupOpen(false);
            // window.location.reload();
            fetch_company_detail();
        }
        ).catch((err) => { console.log(err); });
    }

    return (
        <>
            <div className="bg-light px-md-3" style={{paddingBottom: '90px', width: '100%', overflow: 'auto' }}>

                <div className="d-flex ps-4 w-100 justify-content-start">
                    <label className="fs-3"><strong>Company Information</strong></label>
                </div>

                <div className="dashboard-wrapper-box">
                    <div className="table-wrap">
                        <div className="table-filter-wrap">

                            {selectedCompany ? (
                                <>
                                    <div className="row align-items-center text-start">
                                        <div className="col-12 col-md-2 d-flex  justify-content-start" onClick={() => setHandle_profile_edit(!handle_profile_edit)}>
                                            <img src={selectedCompany.logo ? selectedCompany.logo : '/Images/avtar_webloon.webp'} alt="" className="img-fluid rounded-circle" width="150px" />
                                            {edit_company && (
                                                <>
                                                    <div className="ms-2 fs-4 text-primary">
                                                        <GoPencil />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div className="col-12 col-md-6 text-start mt-3 mt-md-0">
                                            <h2>{selectedCompany.company_name}</h2>
                                            <label className="d-flex align-items-center justify-content-start">
                                                <IoStar className="text-warning fs-5" />
                                                <span className="text-secondary"> {selectedCompany.avg_rating}</span>
                                                <span className="text-primary"> ({selectedCompany.total_reviews} Reviews)</span>
                                            </label>
                                        </div>
                                        <div className="col-12 col-md-4 text-end mt-3 mt-md-0">
                                            <h4 className="text-primary" style={{ cursor: 'pointer' }} onClick={handle_edit_company}><RiPencilFill /> Edit Details</h4>
                                        </div>
                                    </div>

                                    <div className="row mt-5 text-start">
                                        {[
                                            { icon: <FaPhoneAlt />, label: 'Contact Number', value: selectedCompany.contect_no },
                                            { icon: <MdEmail />, label: 'Email ID', value: selectedCompany.email },
                                            { icon: <FaLocationDot />, label: 'Country', value: selectedCompany.location1?.split(",")[0].trim() || '-' },
                                            // { icon: <FaLocationDot />, label: 'Country', value: selectedCompany.location1 ? selectedCompany.location1.split(",")[0].trim() : 'Location' },
                                        ].map((item, index) => {
                                            const isEditable = edit_company && index !== 1;
                                            return (
                                                <div key={index} className="col-12 col-md-4 d-flex align-items-start justify-content-start  mb-3"
                                                    onClick={() => {
                                                        if (!isEditable) return;

                                                        const isLocationField = item.label === 'Country' || item.label === 'State' || item.label === 'City';

                                                        if (isLocationField) {
                                                            const [country, state, city] = selectedCompany.location1.split(',').map(val => val.trim());
                                                            setEditField({
                                                                label: 'Location',
                                                                previousValue: { country, state, city },
                                                            });
                                                            setNewValue({ country, state, city });
                                                        } else {
                                                            setEditField({
                                                                label: item.label,
                                                                previousValue: item.value,
                                                            });
                                                            setNewValue('');
                                                        }

                                                        setEditPopupOpen(true);
                                                    }}>
                                                    <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                        style={{
                                                            width: '3rem',
                                                            height: '3rem',
                                                            backgroundColor: '#E1F5FF',
                                                            aspectRatio: '1 / 1'
                                                        }}

                                                    >
                                                        <h5>{item.icon}</h5>
                                                    </div>
                                                    <label className="text-secondary ms-3 d-flex flex-column">
                                                        {item.label}
                                                        <h5 className="text-dark">{item.value}</h5>
                                                    </label>
                                                    {isEditable ? (
                                                        item.label !== 'Email ID' ? (
                                                            <div className="ms-2 fs-4 text-primary">
                                                                <GoPencil />
                                                            </div>
                                                        ) : (
                                                            <div className="ms-2 fs-4" style={{ width: '1.5rem' }}></div> // placeholder to keep layout
                                                        )
                                                    ) : null}
                                                </div>
                                            )
                                        })}
                                    </div>

                                    <div className="row mt-4 text-start">
                                        {[
                                            { icon: <FaCity />, label: 'State', value: selectedCompany.location1?.split(",")[1]?.trim() || '-' },
                                            { icon: <FaCity />, label: 'City', value: selectedCompany.location1?.split(",")[2]?.trim() || '-' },

                                            // { icon: <FaCity />, label: 'State', value: selectedCompany.location1.split(",")[1]?.trim() },
                                            // { icon: <FaCity />, label: 'City', value: selectedCompany.location1.split(",")[2]?.trim() },
                                            {
                                                icon: <FaLocationDot />,
                                                label: 'Shipping Countries',
                                                value: selectedCompany.tableData?.[0]?.countries || 'N/A',
                                                extra: <span className="text-primary" onClick={handleScrollToMore}> & more</span>
                                            },
                                        ].map((item, index) => {
                                            const isEditable = edit_company && index !== 2; // disable editing for 3rd item

                                            return (
                                                <div
                                                    key={index}
                                                    className="col-12 col-md-4 d-flex align-items-start justify-content-start mb-3"
                                                    onClick={() => {
                                                        if (!isEditable) return;

                                                        const isLocationField = item.label === 'Country' || item.label === 'State' || item.label === 'City';

                                                        if (isLocationField) {
                                                            const [country, state, city] = selectedCompany.location1.split(',').map(val => val.trim());
                                                            setEditField({
                                                                label: 'Location',
                                                                previousValue: { country, state, city },
                                                            });
                                                            setNewValue({ country, state, city });
                                                        } else {
                                                            setEditField({
                                                                label: item.label,
                                                                previousValue: item.value,
                                                            });
                                                            setNewValue('');
                                                        }

                                                        setEditPopupOpen(true);
                                                    }}
                                                    style={{ cursor: isEditable ? 'pointer' : 'default' }}
                                                >
                                                    <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                        style={{
                                                            width: '3rem',
                                                            height: '3rem',
                                                            backgroundColor: '#E1F5FF',
                                                            aspectRatio: '1 / 1'
                                                        }}>
                                                        <h5>{item.icon}</h5>
                                                    </div>
                                                    <label className="text-secondary ms-3 d-flex flex-column">
                                                        {item.label}
                                                        <h5 className="text-dark">{item.value}{item.extra}</h5>
                                                    </label>

                                                    {isEditable && (
                                                        <div className="ms-2 fs-4 text-primary">
                                                            <GoPencil />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>


                                    <div className="row mt-4 text-start">
                                        {[
                                            { icon: <FaPaypal />, label: 'Paypal Id', value: selectedCompany?.paypal_id ? selectedCompany.paypal_id : '-' },
                                            { icon: <MdSwitchAccount />, label: 'Account Holder Name', value: selectedCompany.account_holder_name ? selectedCompany.account_holder_name : '-' },
                                            { icon: <BsBank2 />, label: 'IBA Number', value: selectedCompany.iban_number ? selectedCompany.iban_number : '-' },
                                        ].map((item, index) => (
                                            <div key={index} className="col-12 col-md-4 d-flex align-items-start justify-content-start mb-3"
                                                onClick={() => {
                                                    if (!edit_company) return;
                                                    setEditPopupOpen(true);
                                                    setEditField({
                                                        label: item.label,
                                                        previousValue: item.value,
                                                    });
                                                    setNewValue('');
                                                }}
                                            >
                                                <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                    style={{
                                                        width: '3rem',
                                                        height: '3rem',
                                                        backgroundColor: '#E1F5FF',
                                                        aspectRatio: '1 / 1'
                                                    }}>
                                                    <h5>{item.icon}</h5>
                                                </div>
                                                <label className="text-secondary ms-3 d-flex flex-column">
                                                    {item.label}
                                                    <h5 className="text-dark">{item.value}{item.extra}</h5>
                                                </label>
                                                {edit_company && (<div className="ms-2 fs-4 text-primary"> < GoPencil /></div>)}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="row mt-5 text-start">
                                        {[
                                            { icon: <IoMdDocument />, label: 'Financial Document', value: selectedCompany.financialDocument ? selectedCompany.financialDocument : 'N/A' },
                                            { icon: <FaPassport />, label: 'Passport CEO MD', value: selectedCompany.passport_CEO_MD ? selectedCompany.passport_CEO_MD : 'N/A' },
                                            { icon: <IoMdDocument />, label: 'Registration Document', value: selectedCompany.registrationDocument ? selectedCompany.registrationDocument : 'N/A' },
                                        ].map((item, index) => (
                                            <div key={index}
                                                className="col-12 col-md-4 d-flex align-items-start justify-content-start mb-3"
                                                onClick={() => {
                                                    if (!edit_company) return;
                                                    setEdit_company_document(true);
                                                    setEditField({
                                                        label: item.label,
                                                        previousValue: item.value,
                                                    });
                                                    setNewValue('');
                                                }}
                                            >
                                                <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                                    style={{
                                                        width: '3rem',
                                                        height: '3rem',
                                                        backgroundColor: '#E1F5FF',
                                                        aspectRatio: '1 / 1'
                                                    }}>
                                                    <h5>{item.icon}</h5>
                                                </div>
                                                <label className="text-secondary ms-3 d-flex flex-column">
                                                    {item.label}
                                                    {item.value !== 'N/A' ? (
                                                        <div className="d-flex align-items-center mt-1">
                                                            <img width="50px" src={item.value} alt={item.label} />
                                                            <a
                                                                href={item.value}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="rounded-circle d-flex justify-content-center align-items-center text-primary ms-2"
                                                                style={{
                                                                    width: '1.8rem',
                                                                    height: '1.8rem',
                                                                    backgroundColor: '#E1F5FF',
                                                                    aspectRatio: '1 / 1'
                                                                }}
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <MdFileDownload />
                                                            </a>
                                                        </div>

                                                    ) : (
                                                        <span className="text-dark  ms-3">-</span>
                                                    )}
                                                </label>
                                                {edit_company && (<div className="ms-2 fs-4 text-primary"> <GoPencil /></div>)}
                                            </div>
                                        ))}
                                    </div>


                                    <div className="d-flex flex-row align-items-between justify-contents-start w-100 gap-5 mt-3"
                                        onClick={() => {
                                            if (!edit_company) return;
                                            setEditPopupOpen(true);
                                            setEditField({
                                                label: 'About Company',
                                                previousValue: selectedCompany.description,
                                            });
                                            setNewValue('');
                                        }}>
                                        <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-3" style={{ width: '100%' }}>
                                            <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary" style={{
                                                width: '3rem',
                                                height: '3rem',
                                                backgroundColor: '#E1F5FF',
                                                aspectRatio: '1 / 1'
                                            }}><FaInfoCircle /></div>
                                            <div className="d-flex flex-column align-items-start">
                                                <span className="text-secondary">About Company</span>
                                                <p className="text-start"><h6>{selectedCompany.description}</h6></p>
                                            </div>
                                        </div>
                                        {edit_company && (<div className="ms-2 fs-4 text-primary"> < GoPencil /></div>)}
                                    </div>

                                    <div id="more" className="d-flex mt-3 p-1 justify-content-center align-items-center">
                                        <div className="border-top border-2" style={{ width: '85%' }}>
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th scope="col"><h6>Transport Offered</h6></th>
                                                        <th scope="col"><h6>Destination Region</h6></th>
                                                        <th scope="col"><h6>Destination Countries</h6></th>
                                                        <th scope="col"><h6>Delivery Duration</h6></th>
                                                        {edit_company && <th scope="col"><h6>Action</h6></th>}
                                                    </tr>
                                                </thead>
                                                {selectedCompany.tableData ? (
                                                    <tbody>
                                                        {selectedCompany.tableData.map((item, index) => (
                                                            <tr key={index}>
                                                                <td className="text-secondary text-start text-md-center">{item.service_type ? item.service_type : '-'}</td>
                                                                <td className="text-secondary text-start text-md-center">{item.region && item.region.trim() !== "" ? item.region : "-"}</td>
                                                                <td className="text-secondary text-start text-md-center">{item.countries ? item.countries : '-'}</td>
                                                                <td className="text-secondary text-start text-md-center">{item.duration ? item.duration : '-'}</td>
                                                                {edit_company && (
                                                                    <td>
                                                                        <button
                                                                            className="btn btn-sm btn-outline-danger"
                                                                            onClick={() => handleDeleteRow(index)}
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </td>
                                                                )}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                ) : (
                                                    <tbody>
                                                        <tr>
                                                            <td colSpan={edit_company ? 4 : 3} className="text-secondary text-center">
                                                                No Data
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                )}
                                            </table>
                                            {edit_company && (
                                                <div className="d-flex justify-content-center mt-3 pe-4">
                                                    <button className="btn-change-password" onClick={() => setShowAddPopup(true)}>
                                                        Add more countries
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-end align-items-start  mt-3">
                                        <button className="btn-change-password" onClick={handle_change_password_admin}> Change Password </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h2> NO selected company</h2>
                                </>
                            )}

                        </div>
                    </div>
                </div>

                {handle_profile_edit && (
                    <div
                        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}
                    >
                        <div
                            className="bg-white p-4 rounded shadow position-relative"
                            style={{ width: '90%', maxWidth: '500px' }}
                        >
                            <div className="title-head text-start">
                                <h3>Change Logo</h3>
                            </div>

                            <div className="row">
                                <div className="col-12">
                                    <div className="border-2 border-dashed surface-border border-round surface-ground p-3 text-center">
                                        <DragAndDrop
                                            accept="image/*"
                                            onFileDrop={handleFileDrop}
                                            label="Drag and drop an image here, or click to select (only one image allowed)"
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

                            <div className="d-flex gap-2">
                                <button className="btn-change-password" onClick={handle_logo_update}>Update</button>
                                <button className="btn btn-secondary" onClick={() => setHandle_profile_edit(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
                {change_password_admin && (
                    <div
                        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}
                    >
                        <div
                            className="bg-white p-4 rounded shadow position-relative"
                            style={{ width: '90%', maxWidth: '500px' }}
                        >
                            <div className="title-head text-start">
                                <h3>Change Password</h3>
                            </div>

                            <>
                                <div className="text-start w-100">
                                    <label className="input-label">Previous Password</label>
                                    <input
                                        type="password"
                                        className="input-field w-100"
                                        placeholder="Enter previous password"
                                        onChange={(e) => setPrevious_password(e.target.value)}
                                        value={previous_password}
                                    />
                                </div>

                                <div className="text-start w-100">
                                    <label className="input-label">New Password</label>
                                    <input
                                        type="password"
                                        className="input-field w-100"
                                        placeholder="Enter new password"
                                        onChange={(e) => setNew_password(e.target.value)}
                                        value={new_password}
                                    />
                                </div>

                                <div className="text-start w-100">
                                    <label className="input-label">Confirm Password</label>
                                    <input
                                        type="password"
                                        className="input-field w-100"
                                        placeholder="Confirm new password"
                                        onChange={(e) => setConfirm_password(e.target.value)}
                                        value={confirm_password}
                                    />
                                </div>

                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <div className="d-flex gap-2">
                                        <button className="btn-change-password" onClick={query_update_password}>Update</button>
                                        <button className="btn btn-secondary" onClick={() => { setChange_password(false); setChange_password_admin(false) }}>Cancel</button>
                                    </div>
                                    <span
                                        className="text-primary"
                                        style={{ cursor: 'pointer', fontSize: '0.9rem' }}
                                        onClick={handel_forget_password}
                                    >
                                        Forgot Password?
                                    </span>
                                </div>
                            </>
                        </div>
                    </div>
                )}

                {showAddPopup && (
                    <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog">
                            <div className="modal-content p-4">
                                <div className="head-title text-start">
                                    <h3>Add New Country</h3>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3 text-start">
                                        <label className="input-label w-100">Region</label>
                                        <span><Region_selector
                                            onSelectRegion={handle_region}
                                            // onSelectRegion={(value) =>
                                            //   setNewCountryData({ ...newCountryData, region: value })
                                            // }
                                            label="Select the region"
                                            value={newCountryData.country}
                                            paddingcount='12px 18px' fontsizefont='15px' bgcolor='#ebebeb' bordercolor='1px solid #ebebeb' borderradiuscount='6px'
                                            required
                                        /></span>
                                    </div>

                                    {activeRegion ? (
                                        <>
                                            <div className="mb-3 text-start">
                                                <label className="input-label w-100">Country</label>
                                                <span><Region_countries_selector
                                                    selectedRegion={activeRegion}
                                                    onSelectCountry={handle_region_country}
                                                    // selectedRegion={(value) =>
                                                    //   setNewCountryData({ ...newCountryData, country: value })
                                                    // }            
                                                    label="Select the country"
                                                    value={newCountryData.country}
                                                    paddingcount='12px 18px' fontsizefont='15px' bgcolor='#ebebeb' bordercolor='1px solid #ebebeb' borderradiuscount='6px'
                                                    required
                                                /></span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="mb-3 text-start">
                                                <label className="input-label w-100">Country</label>
                                                <span>
                                                    <CountriesSelector
                                                        onSelectCountry={(value) => setNewCountryData({ ...newCountryData, regioin: '', country: value })}
                                                        label="Select the country"
                                                        value={newCountryData.country}
                                                        paddingcount='12px 18px' fontsizefont='15px' bgcolor='#ebebeb' bordercolor='1px solid #ebebeb' borderradiuscount='6px'
                                                        required
                                                    />
                                                </span>
                                            </div>
                                        </>
                                    )}

                                    <div className="mb-3 text-start">
                                        <label className="input-label w-100">Delivary Duration</label>
                                        <input
                                            type="number"
                                            className="input-field w-100"
                                            value={newCountryData.duration}
                                            min="1"
                                            onChange={(e) => setNewCountryData({ ...newCountryData, duration: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3 text-start">
                                        <label className="input-label w-100 mb-2">Service</label>

                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id="container"
                                                name="service"
                                                value="container"
                                                checked={newCountryData.name === 'container'}
                                                onChange={(e) => handleServiceCheckboxChange(e)}
                                            />
                                            <label className="form-check-label" htmlFor="container">Container</label>
                                        </div>

                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id="cars"
                                                name="service"
                                                value="cars"
                                                checked={newCountryData.name === 'cars'}
                                                onChange={(e) => handleServiceCheckboxChange(e)}
                                            />
                                            <label className="form-check-label" htmlFor="cars">Cars</label>
                                        </div>

                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id="groupage"
                                                name="service"
                                                value="groupage"
                                                checked={newCountryData.name === 'groupage'}
                                                onChange={(e) => handleServiceCheckboxChange(e)}
                                            />
                                            <label className="form-check-label" htmlFor="groupage">Groupage</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-start gap-3
                                  ">
                                    <button
                                        type="button"
                                        className="btn-change-password"
                                        onClick={handle_add_new_country}
                                    >
                                        update
                                    </button>
                                    <button
                                        type="button"
                                        style={{ border: '1px solid #6c757d', backgroundColor: '#6c757d' }}
                                        className="btn-change-password"
                                        onClick={() => setShowAddPopup(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {edit_company_document && (
                    <>
                        <div
                            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}
                        >
                            <div className="bg-white p-4 rounded shadow" style={{ width: '90%', maxWidth: '500px' }}>
                                <h5 className="mb-3 text-center">Edit {editField.label}</h5>

                                <label className="shipping-input-label">Attach Registration Documents of the company</label>
                                <DragAndDrop
                                    accept="application/pdf, image/jpeg"
                                    onFileDrop={(file) => setCompany_document(file)}
                                    label="Drag and drop file to upload or Select file from folder (pdf, jpeg)"
                                />
                                <div className="d-flex align-items-start mb-4">
                                    {company_document && <label>Uploaded File -:  <span>{company_document.name}</span></label>}
                                </div>

                                <div className="d-flex justify-content-center gap-2">
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => {
                                            handle_edit_company_document();
                                            setEdit_company_document(false);
                                        }}
                                    >
                                        Update
                                    </button>
                                    <button className="btn btn-secondary" onClick={() => setEdit_company_document(false)}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {editPopupOpen && (
                    <div
                        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}
                    >
                        <div className="bg-white p-4 rounded shadow" style={{ width: '90%', maxWidth: '500px' }}>
                            <h5 className="mb-3 text-center">Edit {editField.label}</h5>

                            {editField.label === 'Location' ? (
                                <>
                                    <div className="mb-3 text-start">
                                        <label className="input-label">Previous Value</label>
                                        <input
                                            type="text"
                                            className="input-field w-100"
                                            value={`${editField.previousValue.country}, ${editField.previousValue.state}, ${editField.previousValue.city}`}
                                            readOnly
                                        />
                                    </div>

                                    <div className="mb-3 text-start">
                                        <label className="input-label">New Value</label>
                                        <input
                                            type="text"
                                            className="input-field w-100 mb-2"
                                            placeholder="Country"
                                            value={newValue.country}
                                            onChange={(e) => setNewValue({ ...newValue, country: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            className="input-field w-100 mb-2"
                                            placeholder="State"
                                            value={newValue.state}
                                            onChange={(e) => setNewValue({ ...newValue, state: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            className="input-field w-100"
                                            placeholder="City"
                                            value={newValue.city}
                                            onChange={(e) => setNewValue({ ...newValue, city: e.target.value })}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="mb-3 text-start">
                                        <label className="input-label">Previous Value</label>
                                        <input type="text" className="input-field w-100" value={editField.previousValue} readOnly />
                                    </div>

                                    <div className="mb-3 text-start">
                                        <label className="input-label">New Value</label>
                                        <input
                                            type="text"
                                            className="input-field w-100"
                                            value={newValue}
                                            onChange={(e) => setNewValue(e.target.value)}
                                        />
                                    </div>
                                </>
                            )}

                            <div className="d-flex justify-content-center gap-2">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        handle_edit_company_query();
                                        setEditPopupOpen(false);
                                    }}
                                >
                                    Update
                                </button>
                                <button className="btn btn-secondary" onClick={() => setEditPopupOpen(false)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </>
    )
}

export default Companies_detail;