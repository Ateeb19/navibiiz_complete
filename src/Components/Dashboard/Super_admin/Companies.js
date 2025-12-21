import React, { useCallback, useEffect, useState } from "react";
import CountriesSelector from "../../Selector/Countries_selector";
import Region_countries_selector from "../../Selector/Region_country_selector";
import Region_selector from "../../Selector/Region_selector";
import { GoPencil } from "react-icons/go";
import { FaCity, FaInfoCircle, FaPassport, FaPaypal, FaPhoneAlt } from "react-icons/fa";
import { MdEmail, MdFileDownload, MdSwitchAccount } from "react-icons/md";
import { IoMdDocument } from "react-icons/io";
import { BsBank2 } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import { IoStar } from "react-icons/io5";
import { RiPencilFill } from "react-icons/ri";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../alert/Alert_message";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import ConfirmationModal from '../../alert/Conform_alert';




const Companies = () => {
    const port = process.env.REACT_APP_SECRET;
    const { showAlert } = useAlert();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [filter_selectedService, setFilter_selectedService] = useState('');
    const [filter_companyName, setFilter_companyName] = useState('');
    const [userInfo, setUserInfo] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [deleteAction, setDeleteAction] = useState(null);
    const [filter_selectedCountry, setFilter_selectedCountry] = useState('');
    const [companyData, setCompanyData] = useState([]);

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
    const confirmDelete = () => {
        if (deleteAction) {
            deleteAction();
        }
        setShowModal(false);
    };
    const cancelDelete = () => {
        setShowModal(false);
        showAlert("Delete canceled");
    };
    const featchCompanydata = () => {
        if (userRole === 'Sadmin') {
            axios.get(`${port}/s_admin/display_company`, {
                headers: {
                    Authorization: token,
                }
            }).then((response) => {
                setCompanyData(response.data.data);
            }).catch((error) => {
                if (error.response && error.response.status === 403) {
                    showAlert("Token expired. Redirection to login .....");
                    navigate('/login');
                } else {
                    console.error("Error fetching data:", error);
                }
            });
        }
        if (userRole === 'admin') {
            axios.get(`${port}/admin/display_company`, {
                headers: {
                    Authorization: token,
                }
            }).then((response) => {
                setCompanyData(response.data.data);
            }).catch((error) => {
                if (error.response && error.response.status === 403) {
                    showAlert('Token expirted. Redirection to login ...');
                    navigate('/login');
                } else {
                    console.error("Error fetching data:", error);
                }
            });
        }
    }

    useEffect(() => {
        featchCompanydata();
    }, [])
    let filteredCompanies = [];
    if (userRole === 'Sadmin' && Array.isArray(companyData)) {
        filteredCompanies = companyData.filter((company) => {
            const providesService = (service) => company[`${service}_service`] === "1";
            const shipsToCountry = (country) =>
                company.tableData?.some((data) =>
                    data.countries.toLowerCase().includes(country.toLowerCase())
                );

            return (
                (filter_companyName === '' || company.company_name.toLowerCase().includes(filter_companyName.toLowerCase())) &&
                (filter_selectedCountry === '' || shipsToCountry(filter_selectedCountry)) &&
                (filter_selectedService === '' || providesService(filter_selectedService))
            );
        }).sort((a, b) => b.id - a.id);
    }

    const [activeSection, setActiveSection] = useState(() => {
        return localStorage.getItem("activeSection") || "dashboard";
    });
    const handleViewClick = async (company) => {
        const companyId = company.id;
        navigate(`/dashboard/admin/companies/${companyId}`);
        localStorage.setItem('selected_company_id', companyId);
        localStorage.setItem('activeSection', 'company_detail');
        localStorage.setItem('shouldReloadOnce', 'true');

        // try {
        //     const response = await axios.get(`${port}/s_admin/company_info_detail/${companyId}`, {
        //         headers: { Authorization: token },
        //     });

        //     const data = response.data;

        //     if (data.status && data.message.length > 0) {
        //         setSelectedCompany(data.message[0]);
        //         setActiveSection('company_detail');

        //         // setTimeout(() => {
        //         //   window.location.reload();
        //         // }, 200);
        //     } else {
        //         console.error('No data received or invalid format');
        //     }
        // } catch (error) {
        //     console.error('Failed to fetch company details:', error);
        // }
    };
    const handleSelectCountry = (country) => {
        setFilter_selectedCountry(country);
    }
    const openDeleteModal = (message, deleteFunction) => {
        setModalMessage(message);
        setDeleteAction(() => deleteFunction);
        setShowModal(true);
    };


    const handleDelete = (company) => {
        openDeleteModal(
            `Are you sure you want to delete ${company.company_name} company?`,
            () => {
                showAlert(`Deleting ${company.company_name}`);
                const endpoint =
                    userRole === "Sadmin"
                        ? `${port}/s_admin/delete_compnay/company_${company.id}`
                        : `${port}/admin/delete_compnay/'company'_${company.id}`;

                axios
                    .delete(endpoint, { headers: { Authorization: token } })
                    .then((response) => {
                        featchCompanydata()
                    })
                    .catch((error) => console.error("Error deleting:", error));
            }
        );
    };




    return (
        <>
            <ConfirmationModal
                show={showModal}
                message={modalMessage}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
            {userRole === 'Sadmin' && (
                <>
                    <div className="bg-light px-md-3" style={{ paddingBottom: '90px', width: '100%', overflow: 'auto' }}>

                        <div className="d-flex justify-content-start align-items-center rounded-1">
                            <div className="d-flex ps-4 w-50 justify-content-start">
                                <label className="fs-3"><strong>Companies List</strong></label>
                            </div>
                        </div>

                        <div className="d-flex mt-3 p-3 pt-1 flex-column justify-content-start align-items-start m-2 rounded-1 dashboard-wrap-box" >

                            <div className="d-flex flex-column align-items-start justify-content-start ps-2 my-3 w-100">
                                <h5>Filters By:</h5>
                                <div className="row w-100">
                                    <div className="col-12 col-md-4 d-flex flex-column align-items-start">
                                        <input
                                            type="text"
                                            className="shipping-input-field"
                                            placeholder="Search company name here..."
                                            value={filter_companyName}
                                            onChange={(e) => setFilter_companyName(e.target.value)}
                                        />
                                    </div>

                                    <div className="col-12 col-md-4 d-flex flex-column align-items-start">
                                        <CountriesSelector onSelectCountry={handleSelectCountry} label="Destination Countries" paddingcount='12px 18px' fontsizefont='15px' bgcolor='#ebebeb' bordercolor='1px solid #ebebeb' borderradiuscount='6px' />
                                    </div>

                                    {/* Services Offered Filter */}
                                    <div className="col-12 col-md-4 d-flex flex-column align-items-start">
                                        <Form.Select
                                            value={filter_selectedService}
                                            onChange={(e) => setFilter_selectedService(e.target.value)}
                                            style={{ backgroundColor: '#ebebeb', border: '#ebebeb', padding: '12px 18px' }}
                                        >
                                            <option value="">Select Services Offered</option>
                                            <option value="container">Container</option>
                                            <option value="groupage">Groupage</option>
                                            <option value="car">Car</option>
                                        </Form.Select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="container mt-4">
                            <div className="row justify-content-center">
                                {filteredCompanies ? (
                                    filteredCompanies.length > 0 ? (
                                        filteredCompanies.map((item, index) => (
                                            <div className="col-12 col-md-6 col-lg-4 mb-4" key={index}>
                                                <div className="dashboard-wrap-box ">
                                                    <h5>{item.company_name}</h5>
                                                    <p className="text-start" style={{ fontSize: '0.9rem' }}>description-: Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                                    <label className="text-primary w-100 text-start my-1" style={{ fontSize: '1rem' }}><FaPhoneAlt /> <span className="text-dark ms-1">{item.contect_no}</span> </label>
                                                    <label className="text-primary w-100 text-start my-1" style={{ fontSize: '1rem' }}><MdEmail /> <span className="text-dark ms-1">{item.email}</span> </label>
                                                    <label className="text-primary w-100 text-start my-1" style={{ fontSize: '1rem' }}><FaLocationDot /> <span className="text-dark ms-1">{item.location1}</span> </label>
                                                    <button className="btn btn-primary btn-sm w-100 mt-3 fs-5" onClick={() => { handleViewClick(item); setActiveSection('company_detail') }}>View Details</button>
                                                    <button className="btn btn-outline-danger btn-sm w-100 mt-3 fs-5" onClick={() => handleDelete(item)}>Delete</button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div>No company data available</div>
                                    )
                                ) : (
                                    <div>Loading...</div>
                                )}
                            </div>
                        </div>

                    </div>
                </>
            )}


        </>
    )
}

export default Companies;