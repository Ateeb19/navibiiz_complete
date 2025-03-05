import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import { MdDashboard } from "react-icons/md";
import { BsBuildingsFill } from "react-icons/bs";
import { FaUsers } from "react-icons/fa6";
import { FaUserGear } from "react-icons/fa6";
import { FaUserTie } from "react-icons/fa6";
import Dropdown from 'react-bootstrap/Dropdown';
import { FaBell } from "react-icons/fa";
import { PiShippingContainerDuotone } from "react-icons/pi";
import { BsCarFrontFill } from "react-icons/bs";
import { FaTruckLoading } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import Countries_selector from "./Countries_selector";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { IoStar } from "react-icons/io5";
import { RiPencilFill } from "react-icons/ri";
import { FaCity } from "react-icons/fa6";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { RiSecurePaymentFill } from "react-icons/ri";

import Registration from "./Registration";


const Dashboard = () => {
  const port = process.env.REACT_APP_SECRET;
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  // const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [userInfo, setUserInfo] = useState('');
  useEffect(() => {
    if (userRole !== 'admin' && userRole !== 'Sadmin') {
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


  //edit profile
  const [editName, setEditName] = useState(null);
  const [editPassword, setEditPassword] = useState(null);
  const [editNameInput, setEditNameInput] = useState('');
  const [editPasswordInputOld, setEditPasswordInputOld] = useState('');
  const [editPasswordInputNew, setEditPasswordInputNew] = useState('');
  const handlEditName = () => {
    axios.put(`${port}/user/update_name`, { editNameInput }, {
      headers: {
        Authorization: token,
      }
    }).then((response) => {
      window.location.reload();
    }).catch((err) => { console.log(err) });
  }
  const handleEditPassword = () => {
    axios.put(`${port}/user/update_password`, { editPasswordInputOld, editPasswordInputNew }, {
      headers: {
        Authorization: token,
      }
    }).then((response) => {
      window.location.reload();
    }).catch((err) => { console.log(err) });
  }

  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 700);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [editCompany, setEditCompany] = useState(null);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [companyData, setCompanyData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [updateUser, setUpdateUser] = useState(null);
  const [editCompanyContent, setEditCompanyContent] = useState(null);
  const [editCompanyInput, setEditCompanyInput] = useState('');
  const [editCompanyService, setEditCompanyService] = useState(null);
  const [addNewCountry, setAddNewCountry] = useState(null);
  const [from_NewCountryValue, setFrom_NewCountryValue] = useState('');
  const [to_NewCountryValue, setTo_NewCountryValue] = useState('');
  const [duration_NewCountryValue, setDuration_NewCountryValue] = useState('');
  const [change_date, setChange_date] = useState('');
  const [new_change_date, setNew_change_date] = useState('');
  const [request_user, setRequest_user] = useState([]);
  const handel_logout = () => {
    localStorage.setItem('userRole', 'user');
    localStorage.setItem('token', '');
    localStorage.setItem('userInfo', '');
    window.location.reload();
  }

  //all users
  const featchAllUsers = () => {
    if (userRole === 'Sadmin') {
      axios.get(`${port}/s_admin/all_users`, {
        headers: {
          Authorization: token,
        }
      }).then((response) => {
        if (response.data.status === false) {
          setUserData([]);
          return;
        }
        setUserData(response.data.message);
      }).catch((error) => { console.log('error featching data', error) });
    } else {
      return;
    }
  }
  const handleEditUser = (user) => {
    setUpdateUser(user);
  }

  const handleDeleteUser = (user) => {
    const confirmed = window.confirm(`Are you sure you want to delete ${user.name}?`);
    if (confirmed) {
      axios.delete(`${port}/s_admin/delete_user/${user.id}`, {
        headers: {
          Authorization: token,
        }
      }).then((response) => {
        console.log(response.data);
        alert(response.data.message);
        window.location.reload();
      }).catch((err) => { console.log(err) });
    } else {
      alert("Delete canceled.");
    }
  }

  //Change user Role
  const ChangeUserRole = (id, role) => {
    if (userRole === 'Sadmin') {
      axios.put(`${port}/s_admin/update_user/${id}`, { role }, {
        headers: {
          Authorization: token,
        }
      }).then((response) => {
        console.log(response.data);
        closeDetails();
        window.location.reload();
      }).catch((err) => { console.log(err); });
    } else {
      return;
    }
  }

  //company Data
  const featchCompanydata = () => {
    if (userRole === 'Sadmin') {
      axios.get(`${port}/s_admin/display_company`, {
        headers: {
          Authorization: token,
        }
      }).then((response) => {
        // console.log("Data fetched successfully:", response.data);
        setCompanyData(response.data.data);
      }).catch((error) => {
        if (error.response && error.response.status === 403) {
          alert('Token expired. Redirecting to login...');
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
        // console.log("Data fetched successfully:", response.data);
        setCompanyData(response.data.data);
      }).catch((error) => {
        if (error.response && error.response.status === 403) {
          alert('Token expired. Redirecting to login...');
          navigate('/login');
        } else {
          console.error("Error fetching data:", error);
        }
      });
    }
  }
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 700);
    };

    window.addEventListener("resize", handleResize);
    featchCompanydata();
    featchAllUsers();
    // user_requests();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleViewClick = (company) => {
    setSelectedCompany(company);
  };
  const handleEditClick = (company) => {
    setEditCompany(company);
  }

  //delete company 
  const handleDelete = (company) => {
    const userConfirmed = window.confirm(`Are you sure you want to delete ${company.company_name} company?`);
    if (userConfirmed) {
      alert(`Deleting ${company.company_name}`);
      if (userRole === 'Sadmin') {
        axios.delete(`${port}/s_admin/delete_compnay/${company.company_name}_${company.id}`, {
          headers: {
            Authorization: token,
          }
        }).then((response) => {
          console.log("Data fetched successfully:", response.data);
          window.location.reload();
        }).catch((error) => { console.error("Error fetching data:", error); }
        );
      }
      if (userRole === 'admin') {
        axios.delete(`${port}/admin/delete_compnay/${company.company_name}_${company.id}`, {
          headers: {
            Authorization: token,
          }
        }).then((response) => {
          console.log("Data fetched successfully:", response.data);
          window.location.reload();
        }).catch((error) => { console.error("Error fetching data:", error); }
        );
      }

    } else {
      alert(`Cancel deleting ${company.company_name}`);
    }
  };

  const closeDetails = () => {
    setSelectedCompany(null);
    setUpdateUser(null);
    setEditCompany(null);
  };

  const handleRegisterCompany = () => {
    setShowRegisterPopup(true);
  };

  const closeRegisterPopup = () => {
    setShowRegisterPopup(false);
  };



  //edit company 
  const EditCompany = (data, id, type) => {
    const Data = {
      data: data,
      id: id,
      type: type,
    }
    setEditCompanyContent(Data);
  }

  const editCompanyButton = (editCompanyData) => {
    if (editCompanyData.type === 'name') {
      const id = editCompanyData.id;
      const old_name = editCompanyData.data;
      const new_name = editCompanyInput;
      axios.put(`${port}/company/update_company_name/${id}`, { new_name, old_name }, {
        headers: {
          Authorization: token,
        }
      }).then((response) => {
        console.log(response.data);
        window.location.reload();
      }).catch((error) => { console.log(error); });
    }
    if (editCompanyData.type === 'email') {
      const id = editCompanyData.id;
      const email = editCompanyInput;
      axios.put(`${port}/company/update_company_email/${id}`, { email }, {
        headers: {
          Authorization: token,
        }
      }).then((response) => {
        console.log(response.data);
        window.location.reload();
      }).catch((error) => { console.log(error); });
    }
    if (editCompanyData.type === 'contect_no') {
      axios.put(`${port}/company/update_company_contact/${editCompanyData.id}`, { contact: editCompanyInput }, {
        headers: {
          Authorization: token,
        }
      }).then((response) => {
        console.log(response.data);
        window.location.reload();
      }).catch((error) => { console.log(error); });
    }
    if (editCompanyData.type === 'Url') {
      axios.put(`${port}/company/update_company_webSite/${editCompanyData.id}`, { webSite_url: editCompanyInput }, {
        headers: {
          Authorization: token,
        }
      }).then((response) => {
        console.log(response.data);
        window.location.reload();
      }).catch((error) => { console.log(error); });
    }
    if (editCompanyData.type === 'address') {
      axios.put(`${port}/company/update_company_address/${editCompanyData.id}`, { address: editCompanyInput }, {
        headers: {
          Authorization: token,
        }
      }).then((response) => {
        console.log(response.data);
        window.location.reload();
      }).catch((error) => { console.log(error); });
    }
    setEditCompanyContent('');
  }
  const EditCompanyService = (car, container, groupage, id) => {
    setEditCompanyService({ car, container, groupage, id });
  }
  const sendEditCompnayService = (serviceData) => {
    let car = 0;
    let container = 0;
    let groupage = 0;
    if (serviceData.car) {
      car = 1;
    }
    if (serviceData.container) {
      container = 1;
    }
    if (serviceData.groupage) {
      groupage = 1;
    }
    axios.put(`${port}/company/update_company_service/${serviceData.id}`, { car, container, groupage }, {
      headers: {
        Authorization: token,
      }
    }).then((response) => {
      console.log(response);
      window.location.reload();
    }).catch((err) => { console.log(err); })
    console.log(car, container, groupage)
  }
  const closeEditCompany = () => {
    setEditCompanyContent(null);
  }
  //add new country
  const Add_new_country = (tablename) => {
    setAddNewCountry(tablename);
  }

  const handle_Add_NewCountry = () => {
    if (from_NewCountryValue === '' || to_NewCountryValue === '' || duration_NewCountryValue === '' || from_NewCountryValue === '') {
      alert('Please select all the fildes.');
      return;
    }
    axios.put(`${port}/company/add_new_country`, { from_NewCountryValue, to_NewCountryValue, duration_NewCountryValue, addNewCountry }, {
      headers: {
        Authorization: token,
      }
    }).then((response) => {
      console.log(response.data);
      window.location.reload();
    }).catch((err) => { console.log(err) });
    console.log(from_NewCountryValue, to_NewCountryValue, duration_NewCountryValue, 'table name:', addNewCountry);
  }

  //remove country
  const removeCountry = (tableId, companyId, company_name) => {
    const tablename = company_name + '_' + companyId;
    axios.put(`${port}/company/delete_country`, { tableId, tablename }, {
      headers: {
        Authorization: token,
      }
    }).then((response) => {
      console.log(response.data);
      window.location.reload();
    }).catch((err) => { console.log(err) });
    console.log(tableId, tablename);
  }

  //change date
  const handleChangeDate = (tableId, companyId, company_name) => {
    const tablename = company_name + '_' + companyId;
    const data = { tablename: tablename, tableId: tableId };
    setChange_date(data);
    // console.log(tableId, companyId, company_name);
  }

  const handleNew_DateChange = (e) => {
    setNew_change_date(e)
  }

  const send_query = () => {
    const tableId = change_date.tableId;
    const tablename = change_date.tablename;
    const newdate = new_change_date;

    axios.put(`${port}/company/change_date`, { tableId, tablename, newdate }, {
      headers: {
        Authorization: token,
      }
    }).then((response) => {
      console.log(response.data);
      window.location.reload();
    }).catch((err) => { console.log(err) });
    // console.log(change_date.tableId, change_date.tablename, new_change_date);
  }
  //Regestration of company backend api 
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [address, setAddress] = useState("");
  const [services, setServices] = useState({
    container: false,
    groupage: false,
    car: false,
  });
  const [tableData, setTableData] = useState([]);
  const [fromCountry, setFromCountry] = useState("");
  const [toCountry, setToCountry] = useState("");

  const handleServiceToggle = (service) => {
    setServices({ ...services, [service]: !services[service] });
  };

  const handleAddCountry = () => {
    if (fromCountry && toCountry) {
      setTableData([...tableData, { from: fromCountry, to: toCountry, duration: "", date: "" }]);
      setFromCountry("");
      setToCountry("");
    } else {
      alert('Please select both "From" and "To" countries.');
    }
  };

  const handleRemoveRow = (index) => {
    const newData = [...tableData];
    newData.splice(index, 1);
    setTableData(newData);
  };

  const handleDurationChange = (index, value) => {
    const newData = [...tableData];
    newData[index].duration = value;
    setTableData(newData);
  };

  const handleDateChange = (index, value) => {
    const newData = [...tableData];
    newData[index].date = value;
    setTableData(newData);
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      companyName,
      email,
      contact,
      websiteUrl,
      address,
      services,
      shippingCountries: tableData,
    };

    axios.post(`${port}/company/regester_company`, payload, {
      headers: {
        Authorization: token,
      }
    })
      .then((response) => {
        console.log("Data submitted successfully:", response.data);
        closeRegisterPopup(); // Close the popup on success
        // Reset the form state
        setCompanyName("");
        setEmail("");
        setContact("");
        setWebsiteUrl("");
        setAddress("");
        setServices({ container: false, groupage: false, car: false });
        setTableData([]);
        setFromCountry("");
        setToCountry("");
        window.location.reload();
      }).catch((error) => {
        console.error("Error submitting data:", error);
      });
  };

  const [filter_companyName, setFilter_companyName] = useState('');
  const [filter_selectedCountry, setFilter_selectedCountry] = useState('');
  const [filter_selectedService, setFilter_selectedService] = useState('');

  const handleSelectCountry = (country) => {
    setFilter_selectedCountry(country);
  }

  const filteredCompanies = companyData.filter((company) => {
    const providesService = (service) => company[`${service}_service`] === "1";
    const shipsToCountry = (country) => company.tableData.some((data) => data.countries.toLowerCase().includes(country.toLowerCase()));

    return (
      (filter_companyName === '' || company.company_name.toLowerCase().includes(filter_companyName.toLowerCase())) &&
      (filter_selectedCountry === '' || shipsToCountry(filter_selectedCountry)) &&
      (filter_selectedService === '' || providesService(filter_selectedService))
    );
  });
  const handleScrollToMore = () => {
    const targetDiv = document.getElementById("more");
    if (targetDiv) {
      targetDiv.scrollIntoView({ behavior: "smooth" }); // Smooth scrolling to the div
    }
  };
  // console.log(filter_companyName, filter_selectedCountry, filter_selectedService);
  // console.log(companyData);
  console.log(filteredCompanies);
  return (
    <div className="vh-100">

      <div className=" d-flex justify-content-end ">
        <Navbar />
      </div>
      <div className="d-flex flex-row align-items-center justify-content-end vh-100 bg-light">
        <div className="d-flex flex-column align-items-center" style={{ backgroundColor: '#010037', width: "100%", maxWidth: "20%", height: '100vh' }}>
          <div className="d-flex align-items-start justify-content-start w-100 mt-5">
            <ul className="nav flex-column mt-4 fs-4 w-100">
              <li className="nav-item mb-4 text-start" style={activeSection === 'dashboard' ? { backgroundColor: "rgb(0, 56, 111)", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}>
                <Link to="#" className="nav-link text-white" onClick={() => { setActiveSection("dashboard"); setSelectedCompany(''); setShowRegisterPopup(false) }}>
                  <MdDashboard /> Dashboard
                </Link>
              </li>
              <li className="nav-item mb-4 text-start" style={activeSection === 'companies' ? { backgroundColor: "rgb(0, 56, 111)", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}>
                <Link to="#" className="nav-link text-white" onClick={() => { setActiveSection("companies"); setSelectedCompany(''); setShowRegisterPopup(false) }}>
                  <BsBuildingsFill /> Companies
                </Link>
              </li>
              <li className="nav-item mb-4 text-start" style={activeSection === 'offers' ? { backgroundColor: "rgb(0, 56, 111)", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}>
                <Link to="#" className="nav-link text-white" onClick={() => { setActiveSection("offers"); setSelectedCompany(''); setShowRegisterPopup(false) }}>
                  <FaUsers /> Offers
                </Link>
              </li>
              <li className="nav-item mb-4 text-start" style={activeSection === 'payments' ? { backgroundColor: "rgb(0, 56, 111)", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}>
                <Link to="#" className="nav-link text-white" onClick={() => { setActiveSection("payments"); setSelectedCompany(''); setShowRegisterPopup(false) }}>
                  <RiSecurePaymentFill /> Payments
                </Link>
              </li>
              {userData.length > 0 && (
                <li className="nav-item mb-4 text-start" style={activeSection === 'users' ? { backgroundColor: "rgb(0, 56, 111)", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}>
                  <Link to="#" className="nav-link text-white" onClick={() => { setActiveSection("users"); setSelectedCompany(''); setShowRegisterPopup(false) }}>
                    <FaUserGear /> Roles & Permissions
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        {activeSection === "dashboard" && (
          <div className="bg-light" style={{ width: '100%', maxWidth: '80%', height: '100vh', overflow: 'auto' }}>
            <div className=" d-flex justify-content-end mt-2">
              <div className="p-3 pe-5">
                <FaBell className="fs-3 text-primary" onClick={() => { setActiveSection("notification"); setSelectedCompany(''); setShowRegisterPopup(false) }} />
              </div>
              <div className="border-start p-2 border-3 border-dark">
                <Dropdown style={{ width: '13rem' }}>
                  <Dropdown.Toggle className="fs-5 w-100 text-secondary" variant="light" id="dropdown-basic">
                    <FaUserTie /> <strong className="text-capitalize">{userInfo.name}</strong>
                  </Dropdown.Toggle>
                  <Dropdown.Menu style={{ width: '13rem' }}>
                    <div className="d-flex flex-column justify-content-center align-items-center">
                      <label><strong>Role-:</strong> {userInfo.role === 'Sadmin' ? 'Super Admin' : userInfo.role === 'admin' ? 'Admin' : 'User'}</label>
                      <label><strong>Email-:</strong> {userInfo.email}</label>
                      <label><button className="btn btn-secondary btn-sm">Edit Name</button> <button className="btn btn-secondary btn-sm">Edit Password</button></label>
                      <button className="btn btn-danger btn-sm mt-1" onClick={handel_logout}>Logout</button>
                    </div>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>

            <div className="d-flex justify-content-start align-items-center mt-2 rounded-1" style={{ backgroundColor: 'rgb(177, 177, 177)' }}>
              <div className="d-flex ps-4 w-50 justify-content-start">
                <label className="fs-3">Hi,<strong>Joel</strong></label>
              </div>
              <div className="w-50 pe-3 d-flex justify-content-end">
                <label className="text-success fs-5">Updated 2 min ago</label>
              </div>
            </div>

            <div className="d-flex mt-5 flex-row justify-content-center align-items-center">
              <div className="ms-4 me-4 p-3 rounded-4 d-flex flex-column judtify-content-center align-items-center" style={{ boxShadow: '0 0 10px 2px rgba(0, 0, 0, 0.5)', width: '30%' }}>
                <div className="rounded-circle fs-1 d-flex justify-content-center align-items-center text-primary" style={{ width: '5rem', height: '5rem', backgroundColor: 'rgb(174, 252, 255)' }}><PiShippingContainerDuotone /></div>
                <strong className="mt-3">20</strong>
                <label className="text-success fs-6">+5% Last Month</label>
                <label className="fs-4">Total Containers</label>
              </div>
              <div className="ms-4 me-4 p-3 rounded-4 d-flex flex-column judtify-content-center align-items-center" style={{ boxShadow: '0 0 10px 2px rgba(0, 0, 0, 0.5)', width: '30%' }}>
                <div className="rounded-circle fs-1 d-flex justify-content-center align-items-center text-primary" style={{ width: '5rem', height: '5rem', backgroundColor: 'rgb(174, 252, 255)' }}><BsCarFrontFill /></div>
                <strong className="mt-3">15</strong>
                <label className="text-danger fs-6">-2% Last Month</label>
                <label className="fs-4">Total Cars</label>
              </div>
              <div className="ms-4 me-4 p-3 rounded-4 d-flex flex-column judtify-content-center align-items-center" style={{ boxShadow: '0 0 10px 2px rgba(0, 0, 0, 0.5)', width: '30%' }}>
                <div className="rounded-circle fs-1 d-flex justify-content-center align-items-center text-primary" style={{ width: '5rem', height: '5rem', backgroundColor: 'rgb(174, 252, 255)' }}><FaTruckLoading /></div>
                <strong className="mt-3">25</strong>
                <label className="text-success fs-6">+10% Last Month</label>
                <label className="fs-4">Total Groupage</label>
              </div>
            </div>

            <div className="d-flex mt-5 flex-row justify-content-center align-items-center">
              <div className="ms-4 me-4 p-3 rounded-4 d-flex flex-column judtify-content-center align-items-center" style={{ boxShadow: '0 0 10px 2px rgba(0, 0, 0, 0.5)', width: '45%' }}>
                <div className="rounded-circle fs-1 d-flex justify-content-center align-items-center text-primary" style={{ width: '5rem', height: '5rem', backgroundColor: 'rgb(174, 252, 255)' }}><BsBuildingsFill /></div>
                <strong className="mt-3">06</strong>
                <label className="text-success fs-6">+7% Last Month</label>
                <label className="fs-4">Companies Regestered</label>
              </div>
              <div className="ms-4 me-4 p-3 rounded-4 d-flex flex-column judtify-content-center align-items-center" style={{ boxShadow: '0 0 10px 2px rgba(0, 0, 0, 0.5)', width: '45%' }}>
                <div className="rounded-circle fs-1 d-flex justify-content-center align-items-center text-primary" style={{ width: '5rem', height: '5rem', backgroundColor: 'rgb(174, 252, 255)' }}><FaUsers /></div>
                <strong className="mt-3">40</strong>
                <label className="text-danger fs-6">+2% Last Month</label>
                <label className="fs-4">Customers Regestered</label>
              </div>
            </div>
          </div>
        )}


        {activeSection === "companies" && (
          <>
            <div className="bg-light" style={{ width: '100%', maxWidth: '80%', height: '100vh', overflow: 'auto' }}>
              <div className=" d-flex justify-content-end mt-2">
                <div className="p-3 pe-5">
                  <FaBell className="fs-3 text-primary" onClick={() => { setActiveSection("notification"); setSelectedCompany(''); setShowRegisterPopup(false) }} />
                </div>
                <div className="border-start p-2 border-3 border-dark">
                  <Dropdown style={{ width: '13rem' }}>
                    <Dropdown.Toggle className="fs-5 w-100 text-secondary" variant="light" id="dropdown-basic">
                      <FaUserTie /> <strong className="text-capitalize">{userInfo.name}</strong>
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{ width: '13rem' }}>
                      <div className="d-flex flex-column justify-content-center align-items-center">
                        <label><strong>Role-:</strong>{userInfo.role === 'Sadmin' ? 'Super Admin' : userInfo.role === 'admin' ? 'Admin' : 'User'}</label>
                        <label><strong>Email-:</strong> {userInfo.email}</label>
                        <label><button className="btn btn-secondary btn-sm">Edit Name</button> <button className="btn btn-secondary btn-sm">Edit Password</button></label>
                        <button className="btn btn-danger btn-sm mt-1" onClick={handel_logout}>Logout</button>
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>

              <div className="d-flex justify-content-start align-items-center mt-2 rounded-1">
                <div className="d-flex ps-4 w-50 justify-content-start">
                  <label className="fs-3"><strong>Comapnies List</strong></label>
                </div>
                <div className="w-50 pe-3 d-flex justify-content-end">
                  <button className="btn btn-primary btn-sm text-light fs-5 ps-3 pe-3" onClick={() => setShowRegisterPopup(true)}><IoIosAddCircleOutline /> Add New Comapny</button>
                </div>
              </div>

              <div className="d-flex mt-3 p-3 pt-1 flex-column justify-content-start align-items-start m-2 rounded-1" style={{ boxShadow: '0 0 5px 2px rgba(0, 0, 0, 0.5)' }}>
                <div className="d-flex w-50 justify-content-start">
                  <h4>Filters By:</h4>
                </div>
                <div className="w-50 pe-3 d-flex justify-content-start align-items-start w-100">
                  <div className="d-flex flex-column align-items-start" style={{ width: '33%' }}>
                    <label className="text-secondary fs-5">Company Name</label>
                    <div className="d-flex p-1 rounded-3 mt-1 w-75" style={{ backgroundColor: 'rgb(214, 214, 214)' }}><input type="text" className="form-control mt-1" style={{ backgroundColor: 'rgb(214, 214, 214)' }} placeholder="Search here..." value={filter_companyName} onChange={(e) => setFilter_companyName(e.target.value)} /><div className="fs-4 ms-1 text-primary p-0"><FaSearch /> </div></div>
                  </div>
                  <div className="d-flex flex-column align-items-start" style={{ width: '33%' }}>
                    <label className="text-secondary fs-5">Destination Countries</label>
                    <div className="p-1 rounded-3 mt-1 w-75" style={{ backgroundColor: 'rgb(214, 214, 214)' }}>
                      <Countries_selector onSelectCountry={handleSelectCountry} />
                    </div>
                  </div>
                  <div className="d-flex flex-column align-items-start" style={{ width: '33%' }}>
                    <label className="text-secondary fs-5">Services Offered</label>
                    <div className="d-flex p-1 rounded-3 mt-1 w-75" style={{ backgroundColor: 'rgb(214, 214, 214)' }}>
                      <Form.Select value={filter_selectedService} onChange={(e) => setFilter_selectedService(e.target.value)} style={{ backgroundColor: 'rgb(214, 214, 214)' }}>
                        <option value="">Select the modes</option>
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
                          <div className="ms-4 me-4 p-3 rounded-4 d-flex flex-column justify-content-start align-items-start" style={{ boxShadow: '0 0 8px 2px rgba(0, 0, 0, 0.5)', height: 'auto' }}>
                            <h5>{item.company_name}</h5>
                            <p className="text-start" style={{ fontSize: '0.9rem' }}>description-: Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                            <label className="text-primary w-100 text-start" style={{ fontSize: '1rem' }}><FaPhoneAlt /> <span className="text-dark">{item.contect_no}</span> </label>
                            <label className="text-primary w-100 text-start" style={{ fontSize: '1rem' }}><MdEmail /> <span className="text-dark">{item.email}</span> </label>
                            <label className="text-primary w-100 text-start" style={{ fontSize: '1rem' }}><FaLocationDot /> <span className="text-dark">{item.location1}</span> </label>
                            <button className="btn btn-primary btn-sm w-100 mt-3 fs-5" onClick={() => handleViewClick(item)}>View Details</button>
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

            {selectedCompany && (
              <div className="bg-light position-fixed pb-3" style={{ width: '100%', maxWidth: '79%', height: '100vh', overflow: 'auto' }}>
                <div className=" d-flex justify-content-end mt-2">
                  <div className="p-3 pe-5">
                    <FaBell className="fs-3 text-primary" onClick={() => { setActiveSection("notification"); setSelectedCompany(''); setShowRegisterPopup(false) }} />
                  </div>
                  <div className="border-start p-2 border-3 border-dark">
                    <Dropdown style={{ width: '13rem' }}>
                      <Dropdown.Toggle className="fs-5 w-100 text-secondary" variant="light" id="dropdown-basic">
                        <FaUserTie /> <strong className="text-capitalize">{userInfo.name}</strong>
                      </Dropdown.Toggle>
                      <Dropdown.Menu style={{ width: '13rem' }}>
                        <div className="d-flex flex-column justify-content-center align-items-center">
                          <label><strong>Role-:</strong>{userInfo.role === 'Sadmin' ? 'Super Admin' : userInfo.role === 'admin' ? 'Admin' : 'User'}</label>
                          <label><strong>Email-:</strong> {userInfo.email}</label>
                          <label><button className="btn btn-secondary btn-sm">Edit Name</button> <button className="btn btn-secondary btn-sm">Edit Password</button></label>
                          <button className="btn btn-danger btn-sm mt-1" onClick={handel_logout}>Logout</button>
                        </div>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
                <div className="d-flex flex-column justify-content-center align-items-center mt-2 rounded-1">
                  <div className="d-flex ps-4 w-100 justify-content-start">
                    <label className="fs-3"><strong>Comapany Information</strong></label>
                  </div>
                  <div className="mt-4 rounded-4" style={{ boxShadow: '0 0 5px 2px rgba(0, 0, 0, 0.5)', width: '95%', overflow: 'auto' }}>

                    {selectedCompany && (
                      <>
                        <div className="d-flex flex-row align-items-start p-3 justify-content-start">
                          <div className="d-flex align-items-start" style={{ width: '25%' }}>
                            <img src="/Images/webloon_logo.png" className="img-fluid rounded-circle" width="150px" />
                          </div>
                          <div className="mt-4 d-flex flex-column align-items-start" style={{ width: '35%' }}>
                            <h2>{selectedCompany.company_name}</h2>
                            <label className="d-flex align-items-center justify-content-start"><IoStar className="text-warning fs-5" /><span className="text-secondary"> 4.85</span> <span className="text-primary"> (20 Reviews)</span></label>
                          </div>
                          <div className="d-flex mt-4 justify-content-end" style={{ width: '40%' }}>
                            <h3 className="text-primary"><RiPencilFill /> Edit Details</h3>
                          </div>
                        </div>
                        <div className="d-flex mb-4 mt-5 flex-row justify-content-center align-items-center">
                          <div className="d-flex justify-content-start align-items-center" style={{ width: '28%' }}>
                            <div className="rounded-circle pt-1 pb-1 text-primary" style={{ backgroundColor: 'rgb(147, 246, 255)', width: '15%' }}><h3><FaPhoneAlt /></h3></div>
                            <label className="text-secondary d-flex ms-3 flex-column align-items-start">Contect Number<h5 className="text-dark">{selectedCompany.contect_no}</h5></label>
                          </div>
                          <div className="d-flex justify-content-start align-items-center" style={{ width: '28%' }}>
                            <div className="rounded-circle pt-1 pb-1 text-primary" style={{ backgroundColor: 'rgb(147, 246, 255)', width: '15%' }}><h3><MdEmail /></h3></div>
                            <label className="text-secondary d-flex ms-3 flex-column align-items-start">Email ID<h5 className="text-dark">{selectedCompany.email}</h5></label>
                          </div>
                          <div className="d-flex justify-content-start align-items-center" style={{ width: '28%' }}>
                            <div className="rounded-circle pt-1 pb-1 text-primary" style={{ backgroundColor: 'rgb(147, 246, 255)', width: '15%' }}><h3><FaLocationDot /></h3></div>
                            <label className="text-secondary d-flex ms-3 flex-column align-items-start">Country<h5 className="text-dark">{selectedCompany.location1.split(",")[0].trim()}</h5></label>
                          </div>
                        </div>
                        <div className="d-flex mt-5 mb-4 flex-row justify-content-center align-items-center">
                          <div className="d-flex justify-content-start align-items-center" style={{ width: '28%' }}>
                            <div className="rounded-circle pt-1 pb-1 text-primary" style={{ backgroundColor: 'rgb(147, 246, 255)', width: '15%' }}><h3><FaCity /></h3></div>
                            <label className="text-secondary d-flex ms-3 flex-column align-items-start">State<h5 className="text-dark">{selectedCompany.location1.split(",")[1].trim()}</h5></label>
                          </div>
                          <div className="d-flex justify-content-start align-items-center" style={{ width: '28%' }}>
                            <div className="rounded-circle pt-1 pb-1 text-primary" style={{ backgroundColor: 'rgb(147, 246, 255)', width: '15%' }}><h3><FaCity /></h3></div>
                            <label className="text-secondary d-flex ms-3 flex-column align-items-start">City<h5 className="text-dark">{selectedCompany.location1.split(",")[2].trim()}</h5></label>
                          </div>
                          <div className="d-flex justify-content-start align-items-center" style={{ width: '28%' }}>
                            <div className="rounded-circle pt-1 pb-1 text-primary" style={{ backgroundColor: 'rgb(147, 246, 255)', width: '15%' }}><h3><FaLocationDot /></h3></div>
                            <label className="text-secondary d-flex ms-3 flex-column align-items-start">Shipping Countries<h5 className="text-dark">{selectedCompany.tableData[0].countries}<sapn className='text-primary' onClick={handleScrollToMore}> & more</sapn></h5></label>
                          </div>
                        </div>
                        <div className="d-flex flex-row justify-content-center align-items-start">
                          <div className="d-flex justify-content-end" style={{ width: '12%' }}>
                            <div className="rounded-circle pt-1 pb-1 text-primary" style={{ backgroundColor: 'rgb(147, 246, 255)', width: '40%' }}><h3><BsFillInfoCircleFill /></h3></div>
                          </div>
                          <div className="d-flex flex-column ps-3 pe-4 justify-content-start align-items-start" style={{ width: "88%" }}>
                            <label className="text-secondary fs-5 mb-2">About Comapny</label>
                            <p className="text-start" style={{ fontSize: '0.8rem' }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                          </div>
                        </div>


                        <div id="more" className="d-flex mt-3 pb-5 p-1 justify-content-center align-items-center">
                          <div className="border-top border-2 " style={{ width: '85%' }}>
                            <table class="table">
                              <thead>
                                <tr>
                                  <th scope="col"><h6>Transport Offered</h6></th>
                                  <th scope="col"><h6>Destination Countries</h6></th>
                                  <th scope="col"><h6>Delivery Duration</h6></th>
                                </tr>
                              </thead>
                              {selectedCompany.tableData ? (
                                <tbody >
                                  {selectedCompany.tableData.map((item, index) => (
                                    <tr>
                                      <td className="text-secondary">{item.service_type}</td>
                                      <td className="text-secondary">{item.countries}</td>
                                      <td className="text-secondary">{item.duration}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              ) : (
                                <tbody>
                                  <tr>
                                    <td colSpan='4' className="text-secondary">No Data</td>
                                  </tr>
                                </tbody>
                              )}
                            </table>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}



            {showRegisterPopup && (
              <>
                <div className="bg-light position-fixed pb-3" style={{ width: '100%', maxWidth: '79%', height: '100vh', overflow: 'auto' }}>
                  <div className=" d-flex justify-content-end mt-2">
                    <div className="p-3 pe-5">
                      <FaBell className="fs-3 text-primary" onClick={() => { setActiveSection("notification"); setSelectedCompany(''); setShowRegisterPopup(false) }} />
                    </div>
                    <div className="border-start p-2 border-3 border-dark">
                      <Dropdown style={{ width: '13rem' }}>
                        <Dropdown.Toggle className="fs-5 w-100 text-secondary" variant="light" id="dropdown-basic">
                          <FaUserTie /> <strong className="text-capitalize">{userInfo.name}</strong>
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{ width: '13rem' }}>
                          <div className="d-flex flex-column justify-content-center align-items-center">
                            <label><strong>Role-:</strong>{userInfo.role === 'Sadmin' ? 'Super Admin' : userInfo.role === 'admin' ? 'Admin' : 'User'}</label>
                            <label><strong>Email-:</strong> {userInfo.email}</label>
                            <label><button className="btn btn-secondary btn-sm">Edit Name</button> <button className="btn btn-secondary btn-sm">Edit Password</button></label>
                            <button className="btn btn-danger btn-sm mt-1" onClick={handel_logout}>Logout</button>
                          </div>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                  <div className="d-flex flex-column justify-content-center align-items-center mt-2 rounded-1">
                    <div className="d-flex ps-4 w-100 justify-content-start">
                      <label className="fs-3"><strong>Comapany Regesteration</strong></label>
                    </div>
                  </div>
                  <div className="d-flex flex-column align-items-center w-100">
                    <div className="mt-4 rounded-4 p-1 mb-5" style={{ boxShadow: '0 0 5px 2px rgba(0, 0, 0, 0.5)', width: '95%', overflow: 'auto' }}>
                      <Registration />
                    </div>
                  </div>
                </div>
              </>
            )}

          </>
        )}

        {activeSection === "offers" && (
          <>
            <div className="bg-light" style={{ width: '100%', maxWidth: '80%', height: '100vh', overflow: 'auto' }}>
              <div className=" d-flex justify-content-end mt-2">
                <div className="p-3 pe-5">
                  <FaBell className="fs-3 text-primary" onClick={() => { setActiveSection("notification"); setSelectedCompany(''); setShowRegisterPopup(false) }} />
                </div>
                <div className="border-start p-2 border-3 border-dark">
                  <Dropdown style={{ width: '13rem' }}>
                    <Dropdown.Toggle className="fs-5 w-100 text-secondary" variant="light" id="dropdown-basic">
                      <FaUserTie /> <strong className="text-capitalize">{userInfo.name}</strong>
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{ width: '13rem' }}>
                      <div className="d-flex flex-column justify-content-center align-items-center">
                        <label><strong>Role-:</strong>{userInfo.role === 'Sadmin' ? 'Super Admin' : userInfo.role === 'admin' ? 'Admin' : 'User'}</label>
                        <label><strong>Email-:</strong> {userInfo.email}</label>
                        <label><button className="btn btn-secondary btn-sm">Edit Name</button> <button className="btn btn-secondary btn-sm">Edit Password</button></label>
                        <button className="btn btn-danger btn-sm mt-1" onClick={handel_logout}>Logout</button>
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>

              <div className="d-flex justify-content-start align-items-center mt-2 rounded-1">
                <div className="d-flex ps-4 w-50 justify-content-start">
                  <label className="fs-3"><strong>Offers List</strong></label>
                </div>
              </div>

              <div className="d-flex mt-4 p-3 flex-column justify-content-start align-items-start m-2 rounded-1" style={{ boxShadow: '0 0 5px 2px rgba(0, 0, 0, 0.5)' }}>
                <div className="d-flex w-50 justify-content-start">
                  <h4>Latest Offers</h4>
                </div>
                <div className="d-flex w-50 justify-content-start mt-3">
                  <h5>Filters By:</h5>
                </div>
                <div className="pe-3 d-flex justify-content-start align-items-start w-100 mb-3">
                  <div className="d-flex flex-column align-items-start" style={{ width: '40%' }}>
                    <label className="text-secondary fs-5">Serch here</label>
                    <div className="d-flex p-1 rounded-3 mt-1 " style={{ width: '90%', backgroundColor: 'rgb(214, 214, 214)' }}>
                      <input type="text" className="form-control mt-1" style={{ backgroundColor: 'rgb(214, 214, 214)' }} placeholder="Search here..." />
                    </div>
                  </div>
                  <div className="d-flex flex-column align-items-start" style={{ width: '20%' }}>
                    <label className="text-secondary fs-5">Pick up Country</label>
                    <div className="p-1 rounded-3 mt-1 " style={{ width: '90%', backgroundColor: 'rgb(214, 214, 214)' }}>
                      <Countries_selector />
                    </div>
                  </div>
                  <div className="d-flex flex-column align-items-start" style={{ width: '20%' }}>
                    <label className="text-secondary fs-5">Destination Country</label>
                    <div className="p-1 rounded-3 mt-1 " style={{ width: '90%', backgroundColor: 'rgb(214, 214, 214)' }}>
                      <Countries_selector />
                    </div>
                  </div>
                  <div className="d-flex flex-column align-items-start" style={{ width: '20%' }}>
                    <label className="text-secondary fs-5">Pick up date</label>
                    <div className="d-flex p-1 rounded-3 mt-1 " style={{ width: '90%', backgroundColor: 'rgb(214, 214, 214)' }}>
                      <input type="date" className="form-control mt-1" style={{ backgroundColor: 'rgb(214, 214, 214)' }} placeholder="Pick up date" />
                    </div>
                  </div>
                </div>

                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col"><h6>Order Id</h6></th>
                      <th scope="col"><h6>Product Name</h6></th>
                      <th scope="col"><h6>Offer Created By</h6></th>
                      <th scope="col"><h6>Pricr ($)</h6></th>
                      <th scope="col"><h6>Offer Received By</h6></th>
                      <th scope="col"><h6>Payment Status ($)</h6></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-primary">#1827</td>
                      <td className="text-secondary">Television</td>
                      <td className="text-secondary">Alex Smith</td>
                      <td className="text-dark"><b>450</b></td>
                      <td className="text-secondary">Test Company</td>
                      <td className="text-secondary"><span className="p-2 pe-4 ps-4 text-success fw-bold" style={{ backgroundColor: 'rgb(145, 255, 128)' }}>Paid</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeSection === "payments" && (
          <>
            <div className="bg-light" style={{ width: '100%', maxWidth: '80%', height: '100vh', overflow: 'auto' }}>
              <div className=" d-flex justify-content-end mt-2">
                <div className="p-3 pe-5">
                  <FaBell className="fs-3 text-primary" onClick={() => { setActiveSection("notification"); setSelectedCompany(''); setShowRegisterPopup(false) }} />
                </div>
                <div className="border-start p-2 border-3 border-dark">
                  <Dropdown style={{ width: '13rem' }}>
                    <Dropdown.Toggle className="fs-5 w-100 text-secondary" variant="light" id="dropdown-basic">
                      <FaUserTie /> <strong className="text-capitalize">{userInfo.name}</strong>
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{ width: '13rem' }}>
                      <div className="d-flex flex-column justify-content-center align-items-center">
                        <label><strong>Role-:</strong>{userInfo.role === 'Sadmin' ? 'Super Admin' : userInfo.role === 'admin' ? 'Admin' : 'User'}</label>
                        <label><strong>Email-:</strong> {userInfo.email}</label>
                        <label><button className="btn btn-secondary btn-sm">Edit Name</button> <button className="btn btn-secondary btn-sm">Edit Password</button></label>
                        <button className="btn btn-danger btn-sm mt-1" onClick={handel_logout}>Logout</button>
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>

              <div className="d-flex justify-content-start align-items-center mt-2 rounded-1">
                <div className="d-flex ps-4 w-50 justify-content-start">
                  <label className="fs-3"><strong>Payments</strong></label>
                </div>
              </div>

              <div className="d-flex mt-4 p-3 flex-column justify-content-start align-items-start m-2 rounded-1" style={{ boxShadow: '0 0 5px 2px rgba(0, 0, 0, 0.5)' }}>
                <div className="d-flex w-50 justify-content-start">
                  <h4>Latest Offers</h4>
                </div>
                <div className="d-flex w-50 justify-content-start mt-3">
                  <h5>Filters By:</h5>
                </div>
                <div className="pe-3 d-flex justify-content-start align-items-start w-100 mb-3">
                  <div className="d-flex flex-column align-items-start" style={{ width: '40%' }}>
                    <label className="text-secondary fs-5">Serch here</label>
                    <div className="d-flex p-1 rounded-3 mt-1 " style={{ width: '90%', backgroundColor: 'rgb(214, 214, 214)' }}>
                      <input type="text" className="form-control mt-1" style={{ backgroundColor: 'rgb(214, 214, 214)' }} placeholder="Search here..." />
                    </div>
                  </div>
                  <div className="d-flex flex-column align-items-start" style={{ width: '20%' }}>
                    <label className="text-secondary fs-5">Pick up Country</label>
                    <div className="p-1 rounded-3 mt-1 " style={{ width: '90%', backgroundColor: 'rgb(214, 214, 214)' }}>
                      <Countries_selector />
                    </div>
                  </div>
                  <div className="d-flex flex-column align-items-start" style={{ width: '20%' }}>
                    <label className="text-secondary fs-5">Destination Country</label>
                    <div className="p-1 rounded-3 mt-1 " style={{ width: '90%', backgroundColor: 'rgb(214, 214, 214)' }}>
                      <Countries_selector />
                    </div>
                  </div>
                  <div className="d-flex flex-column align-items-start" style={{ width: '20%' }}>
                    <label className="text-secondary fs-5">Pick up date</label>
                    <div className="d-flex p-1 rounded-3 mt-1 " style={{ width: '90%', backgroundColor: 'rgb(214, 214, 214)' }}>
                      <input type="date" className="form-control mt-1" style={{ backgroundColor: 'rgb(214, 214, 214)' }} placeholder="Pick up date" />
                    </div>
                  </div>
                </div>

                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col"><h6>Order Id</h6></th>
                      <th scope="col"><h6>Company Name</h6></th>
                      <th scope="col"><h6>Payment Date</h6></th>
                      <th scope="col"><h6>Amount($)</h6></th>
                      <th scope="col"><h6>Offer Received By</h6></th>
                      <th scope="col"><h6>Status</h6></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-primary">#561256</td>
                      <td className="text-secondary">Test Company</td>
                      <td className="text-secondary">Jan 18, 2025</td>
                      <td className="text-dark"><b>450</b></td>
                      <td className="text-secondary">Test Company</td>
                      <td className="text-secondary"><span className="p-2 pe-4 ps-4 text-success fw-bold" style={{ backgroundColor: 'rgb(145, 255, 128)' }}>Paid</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          </>
        )}

        {activeSection === "notification" && (
          <>
            <div className="bg-light" style={{ width: '100%', maxWidth: '80%', height: '100vh', overflow: 'auto' }}>
              <div className=" d-flex justify-content-end mt-2">
                <div className="p-3 pe-5">
                  <FaBell className="fs-3 text-primary" onClick={() => { setActiveSection("notification"); setSelectedCompany(''); setShowRegisterPopup(false) }} />
                </div>
                <div className="border-start p-2 border-3 border-dark">
                  <Dropdown style={{ width: '13rem' }}>
                    <Dropdown.Toggle className="fs-5 w-100 text-secondary" variant="light" id="dropdown-basic">
                      <FaUserTie /> <strong className="text-capitalize">{userInfo.name}</strong>
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{ width: '13rem' }}>
                      <div className="d-flex flex-column justify-content-center align-items-center">
                        <label><strong>Role-:</strong>{userInfo.role === 'Sadmin' ? 'Super Admin' : userInfo.role === 'admin' ? 'Admin' : 'User'}</label>
                        <label><strong>Email-:</strong> {userInfo.email}</label>
                        <label><button className="btn btn-secondary btn-sm">Edit Name</button> <button className="btn btn-secondary btn-sm">Edit Password</button></label>
                        <button className="btn btn-danger btn-sm mt-1" onClick={handel_logout}>Logout</button>
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>

              <div className="d-flex justify-content-start align-items-center mt-2 rounded-1">
                <div className="d-flex ps-4 w-50 justify-content-start">
                  <label className="fs-3"><strong>Notification</strong></label>
                </div>
              </div>

              <div className="d-flex mt-4 p-3 flex-column justify-content-start align-items-start m-5 rounded-1" style={{ boxShadow: '0 0 5px 2px rgba(0, 0, 0, 0.5)' }}>
                <div className="d-flex mt-2 p-2 w-100">
                  <strong>New</strong>
                  <div className="d-flex flex-column mt-2 ps-5 p-2 w-100">
                    <div className="d-flex flex-row align-items-center w-100 justify-content-between mt-3 mb-3">
                      <div className="rounded-circle border border-1 border-secondary d-flex align-items-center justify-content-center" style={{ width: '3.5rem', height: '3.5rem' }}>
                        Logo
                      </div>
                      <div className="ps-3 flex-grow-1">
                        <p className="mb-0 text-start">
                          A new company named <strong>Test Company</strong> Pvt Ltd has been registered
                          <br />
                          <span className="text-secondary">2 hours ago</span>
                        </p>
                      </div>
                      <div className="text-primary">
                        <span>See Details</span>
                      </div>
                    </div>

                    <div className="d-flex flex-row align-items-center w-100 justify-content-between mb-3 mt-3">
                      <div className="rounded-circle border border-1 border-secondary d-flex align-items-center justify-content-center" style={{ width: '3.5rem', height: '3.5rem' }}>
                        Pic
                      </div>
                      <div className="ps-3 flex-grow-1">
                        <p className="mb-0 text-start">
                          <strong>Alex Smith</strong> has placed an order request
                          <br />
                          <span className="text-secondary">1 hours ago</span>
                        </p>
                      </div>
                      <div className="text-primary">
                        <span>See Details</span>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="d-flex mt-2 p-2 w-100">
                  <strong>Earlier</strong>
                  <div className="d-flex flex-column mt-2 ps-5 p-2 w-100">
                    <div className="d-flex flex-row align-items-center w-100 justify-content-between mt-3 mb-3">
                      <div className="rounded-circle border border-1 border-secondary d-flex align-items-center justify-content-center" style={{ width: '3.5rem', height: '3.5rem' }}>
                        Logo
                      </div>
                      <div className="ps-3 flex-grow-1">
                        <p className="mb-0 text-start">
                          A new company named <strong>Test Company</strong> Pvt Ltd has been registered
                          <br />
                          <span className="text-secondary">2 hours ago</span>
                        </p>
                      </div>
                      <div className="text-primary">
                        <span>See Details</span>
                      </div>
                    </div>

                    <div className="d-flex flex-row align-items-center w-100 justify-content-between mb-3 mt-3">
                      <div className="rounded-circle border border-1 border-secondary d-flex align-items-center justify-content-center" style={{ width: '3.5rem', height: '3.5rem' }}>
                        Pic
                      </div>
                      <div className="ps-3 flex-grow-1">
                        <p className="mb-0 text-start">
                          <strong>Alex Smith</strong> has placed an order request
                          <br />
                          <span className="text-secondary">1 hours ago</span>
                        </p>
                      </div>
                      <div className="text-primary">
                        <span>See Details</span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </>
        )}

        {activeSection === "users" && (
          <>
            <div className="bg-light" style={{ width: '100%', maxWidth: '80%', height: '100vh', overflow: 'auto' }}>
              <div className=" d-flex justify-content-end mt-2">
                <div className="p-3 pe-5">
                  <FaBell className="fs-3 text-primary" onClick={() => { setActiveSection("notification"); setSelectedCompany(''); setShowRegisterPopup(false) }} />
                </div>
                <div className="border-start p-2 border-3 border-dark">
                  <Dropdown style={{ width: '13rem' }}>
                    <Dropdown.Toggle className="fs-5 w-100 text-secondary" variant="light" id="dropdown-basic">
                      <FaUserTie /> <strong className="text-capitalize">{userInfo.name}</strong>
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{ width: '13rem' }}>
                      <div className="d-flex flex-column justify-content-center align-items-center">
                        <label><strong>Role-:</strong>{userInfo.role === 'Sadmin' ? 'Super Admin' : userInfo.role === 'admin' ? 'Admin' : 'User'}</label>
                        <label><strong>Email-:</strong> {userInfo.email}</label>
                        <label><button className="btn btn-secondary btn-sm">Edit Name</button> <button className="btn btn-secondary btn-sm">Edit Password</button></label>
                        <button className="btn btn-danger btn-sm mt-1" onClick={handel_logout}>Logout</button>
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>

              <div className="d-flex justify-content-start align-items-center mt-2 rounded-1">
                <div className="d-flex ps-4 w-50 justify-content-start">
                  <label className="fs-3"><strong>Roles & Permissions</strong></label>
                </div>
                <div className="w-50 pe-3 d-flex justify-content-end">
                  <button className="btn btn-primary btn-sm text-light fs-5 ps-3 pe-3" onClick={() => setShowRegisterPopup(true)}><IoIosAddCircleOutline /> Add New Role</button>
                </div>
              </div>

              <div className="d-flex mt-4 p-3 flex-column justify-content-start align-items-start m-5 rounded-1" style={{ boxShadow: '0 0 5px 2px rgba(0, 0, 0, 0.5)' }}>

                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col"><h6>Name</h6></th>
                      <th scope="col"><h6>Email ID</h6></th>
                      <th scope="col"><h6>Role</h6></th>
                      <th scope="col"><h6>Actions</h6></th>
                    </tr>
                  </thead>
                  {userData ? (
                    <tbody >
                      {userData.map((item, index) => (
                        <tr>
                          <td className="text-secondary">{item.name}</td>
                          <td className="text-secondary">{item.email}</td>
                          <td className="text-secondary">{item.role === 'Sadmin' ? ('Super Admin') : item.role === 'admin' ? ('Admin') : item.role === 'user' && ('User')}</td>
                          <td className="text-secondary"><button className="btn btn-sm btn-light text-primary pt-0 pb-0" onClick={() => handleEditUser(item)} style={{ fontSize: '1.5rem' }}><RiPencilFill /></button><button className="btn btn-sm btn-light text-danger pt-0 pb-0" onClick={() => handleDeleteUser(item)} style={{ fontSize: '1.5rem' }}><MdDelete /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <tbody>
                      <tr>
                        <td colSpan='4' className="text-secondary">No Data</td>
                      </tr>
                    </tbody>
                  )}
                </table>
              </div>
            </div>

            {updateUser && (
              <div
                className="position-fixed bg-light p-4 shadow rounded"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "90%",
                  maxWidth: "500px",
                  zIndex: 1050,
                  animation: "fadeIn 0.3s ease-out",
                }}
              >
                <button
                  className="btn-close position-absolute top-0 end-0 m-2"
                  onClick={closeDetails}
                ></button>
                <h4 className="mb-4">User Action</h4>
                <p>
                  <strong>Change user role as -:</strong>
                </p>
                <p>
                  <button className="ms-4 me-4 fs-5 fw-bold btn btn-dark p-2" onClick={() => ChangeUserRole(updateUser.id, 'Sadmin')}>Super Admin</button>
                  <button className="ms-4 me-4 fs-5 fw-bold btn btn-dark p-2" onClick={() => ChangeUserRole(updateUser.id, 'admin')}>Admin</button>
                  <button className="ms-4 me-4 fs-5 fw-bold btn btn-dark p-2" onClick={() => ChangeUserRole(updateUser.id, 'user')}>User</button>
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* <div className="d-flex me-4">
        {isSmallScreen ? (
          <h1>Small Screen</h1>
        ) : (
          <div
            style={{
              maxWidth: "25%",
              backgroundColor: "rgb(0, 136, 255)",
              height: "100vh",
            }}
          >
            <div className="d-flex flex-column justify-content-center align-items-center p-4">
              <h3 className="text-center mt-5">Dashboard</h3>
              <ul className="nav flex-column mt-4">
                <li className="nav-item">
                  <Link to="#" className="nav-link text-white" onClick={() => setActiveSection("companies")}>
                    Companies
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="#" className="nav-link text-white" onClick={() => setActiveSection("customers")}>
                    Customers
                  </Link>
                </li>
                {userData.length > 0 && (
                  <li className="nav-item">
                    <Link to="#" className="nav-link text-white" onClick={() => setActiveSection("users")}>
                      Users
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link to="#" className="nav-link text-white" onClick={() => setActiveSection("profile")}>
                    Profile
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
        {activeSection === "companies" && (
          <div
            className="container mt-4 position-relative"
            style={{
              maxWidth: "75%",
              height: "100vh",
            }}
          >
            <div className="d-flex flex-row justify-content-between mb-3">
              <h2>Shipping Companies</h2>
              <button className="btn btn-info" onClick={handleRegisterCompany}>
                Register Company
              </button>
            </div>
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                  <tr>
                    <th>#</th>
                    <th>Company Name</th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {companyData ? (
                    companyData.length > 0 ? (
                      companyData.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.company_name}</td>
                          <td>{item.email}</td>
                          <td>{item.contect_no}</td>
                          <td>
                            <div className="d-flex flex-column">
                              <button
                                className="btn btn-primary mb-2 p-0"
                                onClick={() => handleViewClick(item)}
                              >
                                View
                              </button>
                              <button
                                className="btn btn-primary mb-2 p-0"
                                onClick={() => handleEditClick(item)}
                              >Edit</button>
                              <button
                                className="btn btn-danger p-0"
                                onClick={() => handleDelete(item)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">No Data</td>
                      </tr>
                    )
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">No Data</td>
                    </tr>

                  )}
                </tbody>
              </table>
            </div>

            {selectedCompany && (
              <div
                className="position-fixed bg-light p-4 shadow rounded border"
                style={{
                  top: "50%",
                  left: "50%",
                  height: '40rem',
                  overflowY: "auto",
                  transform: "translate(-50%, -50%)",
                  width: "90%",
                  maxWidth: "500px",
                  zIndex: 1050,
                  animation: "fadeIn 0.3s ease-out",
                }}
              >
                <button
                  className="btn-close position-absolute top-0 end-0 m-2"
                  onClick={closeDetails}
                ></button>
                {userRole === 'Sadmin' && (
                  <p>
                    <strong>Regester By:</strong> {selectedCompany.created_by} :-: <strong>Role:</strong> {selectedCompany.user_role === 'Sadmin' ? ('Super Admin') : selectedCompany.user_role === 'admin' ? ('Admin') : ('')}
                  </p>
                )}
                <h4 className="mb-4">Company Details</h4>
                <p>
                  <strong>Company Name:</strong> {selectedCompany.company_name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedCompany.email}
                </p>
                <p>
                  <strong>Contect:</strong> {selectedCompany.contect_no}
                </p>
                <p>
                  <strong>URL:</strong> {selectedCompany.webSite_url}
                </p>
                <p>
                  <strong>Address:</strong> {selectedCompany.address}
                </p>
                <p>
                  <strong>Services:</strong> {selectedCompany.car_service === "1" ? <h6>Cars</h6> : ""} {selectedCompany.container_service === "1" ? <h6>Containers</h6> : ""} {selectedCompany.groupage_service === "1" ? <h6>Groupage</h6> : ""}
                </p>
                <h5>Shipping Countries-:</h5>
                {selectedCompany.tableData ? (
                  <>
                    <table className="table table-info table-bordered">
                      <thead className="thead-dark">
                        <tr>
                          <th>S/N</th>
                          <th>From</th>
                          <th>To</th>
                          <th>Duration</th>
                          <th>Groupage Next Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCompany.tableData.map((row, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{row.ship_from}</td>
                            <td>{row.ship_to}</td>
                            <td>{row.duration}</td>
                            <td>{row.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                ) : <>
                  No data found
                </>}
              </div>
            )}

            {editCompany && (
              <div
                className="position-fixed bg-light p-4 shadow rounded border"
                style={{
                  top: "50%",
                  left: "50%",
                  height: '40rem',
                  overflowY: "auto",
                  transform: "translate(-50%, -50%)",
                  width: "90%",
                  maxWidth: "500px",
                  zIndex: 1050,
                  animation: "fadeIn 0.3s ease-out",
                }}
              >
                <button
                  className="btn-close position-absolute top-0 end-0 m-2"
                  onClick={closeDetails}
                ></button>
                {userRole === 'Sadmin' && (
                  <p>
                    <strong>Regester By:</strong> {editCompany.created_by} :-: <strong>Role:</strong> {editCompany.user_role}
                  </p>
                )}
                <h4 className="mb-4">Edit Company Details</h4>
                <p>
                  <strong>Company Name:</strong> {editCompany.company_name}<button className="ms-2 p-0 ps-1 pe-1 btn btn-info btn-sm" onClick={() => EditCompany(editCompany.company_name, editCompany.id, 'name')}>Edit</button>
                </p>
                <p>
                  <strong>Email:</strong> {editCompany.email}<button className="ms-2 p-0 ps-1 pe-1 btn btn-info btn-sm" onClick={() => EditCompany(editCompany.email, editCompany.id, 'email')}>Edit</button>
                </p>
                <p>
                  <strong>Contect:</strong> {editCompany.contect_no}<button className="ms-2 p-0 ps-1 pe-1 btn btn-info btn-sm" onClick={() => EditCompany(editCompany.contect_no, editCompany.id, 'contect_no')}>Edit</button>
                </p>
                <p>
                  <strong>URL:</strong> {editCompany.webSite_url}<button className="ms-2 p-0 ps-1 pe-1 btn btn-info btn-sm" onClick={() => EditCompany(editCompany.webSite_url, editCompany.id, 'Url')}>Edit</button>
                </p>
                <p>
                  <strong>Address:</strong> {editCompany.address}<button className="ms-2 p-0 ps-1 pe-1 btn btn-info btn-sm" onClick={() => EditCompany(editCompany.address, editCompany.id, 'address')}>Edit</button>
                </p>
                <p>
                  <strong>Services:</strong><button className="ms-2 p-0 ps-1 pe-1 btn btn-info btn-sm" onClick={() => EditCompanyService(editCompany.car_service, editCompany.container_service, editCompany.groupage_service, editCompany.id)}>Edit</button> {editCompany.car_service === "1" ? <h6>Cars</h6> : ""} {editCompany.container_service === "1" ? <h6>Containers</h6> : ""} {editCompany.groupage_service === "1" ? <h6>Groupage</h6> : ""}
                </p>
                <h5>Shipping Countries-: <button className="ms-2 p-0 ps-1 pe-1 btn btn-success btn-sm" onClick={() => Add_new_country(editCompany.company_name + '_' + editCompany.id)}>Add</button></h5>
                {editCompany.tableData ? (
                  <>
                    <table className="table table-info table-bordered">
                      <thead className="thead-dark">
                        <tr>
                          <th>S/N</th>
                          <th>From</th>
                          <th>To</th>
                          <th>Duration</th>
                          <th>Groupage Next Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {editCompany.tableData.map((row, index) => (
                          <tr key={index}>
                            <td>{index + 1}<br /><button className="p-0 ps-1 pe-1 btn btn-danger btn-sm" onClick={() => removeCountry(row.id, editCompany.id, editCompany.company_name)}>Remove</button></td>
                            <td>{row.ship_from}</td>
                            <td>{row.ship_to}</td>
                            <td>{row.duration}</td>
                            <td>{row.date}<button className="btn btn-sm btn-info" onClick={() => handleChangeDate(row.id, editCompany.id, editCompany.company_name)}>Change</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                ) : <>
                  No data found
                </>}
              </div>
            )}

            {editCompanyContent && (
              <div className="position-fixed p-3 shadow rounded border border-3 border-dark"
                style={{
                  top: "50%",
                  left: "50%",
                  backgroundColor: "rgba(138, 249, 255, 0.94)",
                  transform: "translate(-50%, -50%)",
                  width: "90%",
                  maxWidth: "400px",
                  zIndex: 1051,
                  animation: "fadeIn 0.3s ease-out",
                }}>
                <button
                  className="btn-close position-absolute top-0 end-0 m-2"
                  onClick={closeEditCompany}
                ></button>
                <p>
                  Old -: <strong>{editCompanyContent.data}</strong>
                </p><h6>Edit</h6>
                <input type="text" className="form-control border border-1 border-dark" onChange={(e) => setEditCompanyInput(e.target.value)} />
                <button className="btn btn-primary btn-sm mt-2" onClick={() => editCompanyButton(editCompanyContent)}>Save</button>
              </div>
            )}

            {editCompanyService && (
              <div className="position-fixed p-3 shadow rounded border border-3 border-dark d-flex flex-column justify-content-center align-items-center"
                style={{
                  top: "50%",
                  left: "50%",
                  backgroundColor: "rgba(138, 249, 255, 0.94)",
                  transform: "translate(-50%, -50%)",
                  width: "90%",
                  maxWidth: "400px",
                  zIndex: 1051,
                  animation: "fadeIn 0.3s ease-out",
                }}>
                <button
                  className="btn-close position-absolute top-0 end-0 m-2"
                  onClick={() => setEditCompanyService(null)}
                ></button>
                <h4>Edit Services</h4>
                <div className="d-flex flex-column" style={{ width: "30%" }}>
                  <Form.Check
                    type="switch"
                    checked={editCompanyService.container}
                    onChange={() => setEditCompanyService({ ...editCompanyService, container: !editCompanyService.container })}
                    label="Containers"
                  />
                  <Form.Check
                    type="switch"
                    checked={editCompanyService.groupage}
                    onChange={() => setEditCompanyService({ ...editCompanyService, groupage: !editCompanyService.groupage })}
                    label="Groupage"
                  />
                  <Form.Check
                    type="switch"
                    checked={editCompanyService.car}
                    onChange={() => setEditCompanyService({ ...editCompanyService, car: !editCompanyService.car })}
                    label="Cars"
                  />
                </div>
                <button className="btn btn-primary mt-2" onClick={() => sendEditCompnayService(editCompanyService)}>Save</button>
              </div>
            )}

            {addNewCountry && (
              <div className="position-fixed p-3 shadow rounded border border-3 border-dark d-flex flex-column justify-content-center align-items-center"
                style={{
                  top: "50%",
                  left: "50%",
                  backgroundColor: "rgba(138, 249, 255, 0.94)",
                  transform: "translate(-50%, -50%)",
                  width: "90%",
                  maxWidth: "400px",
                  zIndex: 1051,
                  animation: "fadeIn 0.3s ease-out",
                }}>
                <button
                  className="btn-close position-absolute top-0 end-0 m-2"
                  onClick={() => setAddNewCountry(null)}
                ></button>
                <h4>Add New Country</h4>
                <div className="d-flex flex-row">
                  <div className="me-0">
                    <h5>From</h5>
                    <CountrySelect
                      value={fromCountry}
                      onChange={(value) => setFrom_NewCountryValue(value.name)}
                      placeHolder="Select Country"
                      className="form-control"
                    />
                  </div>
                  <div className="ms-0">
                    <h5>To</h5>
                    <CountrySelect
                      value={toCountry}
                      onChange={(value) => setTo_NewCountryValue(value.name)}
                      placeHolder="Select Country"
                      className="form-control"
                    />
                  </div>
                </div>
                <input type="text" className="form-control mt-2" onChange={(e) => setDuration_NewCountryValue(e.target.value)} style={{ width: "8rem" }} placeholder="Duration" />
                <button className="btn btn-primary mt-2" onClick={() => handle_Add_NewCountry()}>Regester</button>
              </div>
            )}
            {change_date && (
              <div className="position-fixed p-3 shadow rounded border border-3 border-dark d-flex flex-column justify-content-center align-items-center"
                style={{
                  top: "50%",
                  left: "50%",
                  backgroundColor: "rgba(138, 249, 255, 0.94)",
                  transform: "translate(-50%, -50%)",
                  width: "90%",
                  maxWidth: "400px",
                  zIndex: 1051,
                  animation: "fadeIn 0.3s ease-out",
                }}>
                <button
                  className="btn-close position-absolute top-0 end-0 m-2"
                  onClick={() => setChange_date('')}
                ></button>
                <h4>Change Date</h4>
                <div className="row">
                  <div className="col-3">
                    <input
                      type="date"
                      placeholder="yyyy-mm-dd"
                      className="form-control col-4"
                      min={new Date().toISOString().split("T")[0]}
                      value={new_change_date}
                      onChange={(e) => handleNew_DateChange(e.target.value)}
                    />
                  </div>
                  <div className="col-9">
                    <h5>Date -: {new_change_date}</h5>
                  </div>
                </div>
                <button onClick={send_query} className="btn btn-primary mt-3">Change</button>
              </div>
            )}

            {showRegisterPopup && (
              <div
                className="position-fixed p-4 shadow rounded"
                style={{
                  bottom: "0",
                  left: "50%",
                  maxHeight: "80vh",
                  overflowY: "auto",
                  backgroundColor: "rgb(168, 168, 168)",
                  transform: "translate(-50%, 0)",
                  width: "90%",
                  maxWidth: "500px",
                  zIndex: 1050,
                  animation: "slideUp 0.3s ease-out forwards",
                }}
              >
                <button
                  className="btn-close position-absolute top-0 end-0 m-2"
                  onClick={closeRegisterPopup}
                ></button>
                <h4>Register Company</h4>
                <form className="mt-3 border p-2" onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label"><h5>Company Name</h5></label>
                    <input
                      type="text"
                      className="form-control"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label"><h5>Email</h5></label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label"><h5>Contact</h5></label>
                    <input
                      type="text"
                      className="form-control"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label"><h5>Web-site Url</h5></label>
                    <input
                      type="url"
                      className="form-control"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label"><h5>Address</h5></label>
                    <input
                      type="text"
                      className="form-control"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label"><h5>Select Services</h5></label>
                    <div className="d-flex felx-row  justify-content-center">
                      <Form>
                        <Form.Check
                          type="switch"
                          checked={services.container}
                          onChange={() => handleServiceToggle("container")}
                          label="Containers"
                        />
                        <Form.Check
                          type="switch"
                          checked={services.groupage}
                          onChange={() => handleServiceToggle("groupage")}
                          label="Groupage"
                        />
                        <Form.Check
                          type="switch"
                          checked={services.car}
                          onChange={() => handleServiceToggle("car")}
                          label="Cars"
                        />
                      </Form>
                    </div>
                  </div>

                  <div className="mt-3">
                    <h5>Shipping Countries</h5>
                    <div className="d-flex flex-column justify-content-center">
                      <div className="d-flex flex-row justify-content-center">
                        <div className="col-6">
                          <h5>From</h5>
                        </div>
                        <div className="col-4">
                          <h5>To</h5>
                        </div>
                        <div className="col-2"></div>
                      </div>
                      <div className="d-flex flex-row justify-content-center">
                        <div className="me-1 ms-1">
                          <CountrySelect
                            value={fromCountry}
                            onChange={(value) => setFromCountry(value.name)}
                            placeHolder="Select Country"
                            className="form-control"
                          />
                        </div>
                        <div className="me-1 ms-1">
                          <CountrySelect
                            value={toCountry}
                            onChange={(value) => setToCountry(value.name)}
                            placeHolder="Select Country"
                            className="form-control"
                          />
                        </div>
                        <div
                          className="ms-1 fs-3 bg-success rounded-5 ps-2 pe-2 text-light"
                          style={{ cursor: 'pointer' }}
                          onClick={handleAddCountry}
                        >
                          +
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <table className="table table-info table-bordered">
                        <thead className="thead-dark">
                          <tr>
                            <th>S/N</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tableData.map((row, index) => (
                            <tr key={index}>
                              <td>{index + 1}
                                <br />
                                <button
                                  className="btn btn-danger btn-sm mt-1"
                                  onClick={() => handleRemoveRow(index)}
                                >
                                  Remove
                                </button></td>
                              <td>{row.from}</td>
                              <td>{row.to}</td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Days or Hours"
                                  value={row.duration}
                                  onChange={(e) =>
                                    handleDurationChange(index, e.target.value)
                                  }
                                  required
                                />
                                {services.groupage && (
                                  <div className="d-flex flex-column mt-2 border border-1 border-dark">
                                    <div className="">
                                      <lable className="form-lable"><h6>Groupage Next Date: </h6></lable>
                                    </div>
                                    <div className="row">
                                      <div className="col-4">
                                        <input
                                          type="date"
                                          placeholder="yyyy-mm-dd"
                                          className="form-control"
                                          min={new Date().toISOString().split("T")[0]}
                                          value={row.date}
                                          onChange={(e) => handleDateChange(index, e.target.value)}
                                        />
                                      </div>
                                      <div className="col-8">
                                        <h6>Date-: </h6><h6>{row.date}</h6>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Regester
                  </button>
                </form>
              </div>
            )}
          </div>
        )}


        {activeSection === "customers" && (
          <div
            className="container mt-4 position-relative"
            style={{
              maxWidth: "75%",
              height: "100vh",
            }}
          >
            Customers
          </div>
        )}


        {activeSection === "users" && (
          <div
            className="container mt-4 position-relative"
            style={{
              maxWidth: "75%",
              height: "100vh",
            }}
          >
            <h2>Users</h2>
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                  <tr>
                    <th>S/N</th>
                    <th>User Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {userData ? (
                    userData.length > 0 ? (
                      userData.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                          <td>{item.email}</td>
                          <td>{item.role === 'Sadmin' ? ('Super Admin') : item.role === 'admin' ? ('Admin') : ('User')}</td>
                          <td>
                            <div className="d-flex flex-column">
                              <button
                                className="btn btn-primary mb-2 p-0"
                                onClick={() => handleEditUser(item)}
                              >Edit</button>
                              <button
                                className="btn btn-danger p-0"
                                onClick={() => handleDeleteUser(item)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">No Data</td>
                      </tr>
                    )
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">No Data</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {updateUser && (
          <div
            className="position-fixed bg-light p-4 shadow rounded"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: "500px",
              zIndex: 1050,
              animation: "fadeIn 0.3s ease-out",
            }}
          >
            <button
              className="btn-close position-absolute top-0 end-0 m-2"
              onClick={closeDetails}
            ></button>
            <h4 className="mb-4">User Action</h4>
            <p>
              <strong>Change user role as -:</strong>
            </p>
            <p>
              <button className="ms-4 me-4 fs-5 fw-bold btn btn-dark p-2" onClick={() => ChangeUserRole(updateUser.id, 'Sadmin')}>Super Admin</button>
              <button className="ms-4 me-4 fs-5 fw-bold btn btn-dark p-2" onClick={() => ChangeUserRole(updateUser.id, 'admin')}>Admin</button>
              <button className="ms-4 me-4 fs-5 fw-bold btn btn-dark p-2" onClick={() => ChangeUserRole(updateUser.id, 'user')}>User</button>
            </p>
          </div>
        )}

        {activeSection === "profile" && (
          <div
            className="container mt-4 position-relative"
            style={{
              maxWidth: "75%",
              height: "100vh",
            }}>
            <h2 className="mb-3"><strong>Profile Section</strong></h2>
            <h5>Role -: {userRole === 'Sadmin' ? ('Super Admin') : userRole === 'admin' ? ('Admin') : ('')}</h5>
            <h5>E-Mail -: {userInfo.email}</h5>
            <h5>Name -: {userInfo.name}</h5>
            <button className="btn btn-sm btn-info mb-4" onClick={() => setEditName(userInfo.name)}><strong>Edit name</strong></button><br />
            <button className="btn btn-sm btn-info mb-4" onClick={() => setEditPassword(userInfo.name)}><strong>change Password</strong></button>
            <h5><button className="btn btn-danger" onClick={handel_logout}>LogOut</button></h5>
          </div>
        )}

        {editName && (
          <>
            <div
              className="position-fixed p-4 shadow rounded border"
              style={{
                top: "50%",
                left: "55%",
                backgroundColor: 'rgb(145, 168, 250)',
                overflowY: "auto",
                transform: "translate(-50%, -50%)",
                width: "30%",
                maxWidth: "400px",
                zIndex: 1050,
                animation: "fadeIn 0.3s ease-out",
              }}
            >
              <button
                className="btn-close position-absolute top-0 end-0 m-2"
                onClick={() => setEditName(null)}
              ></button>
              <h4 className="mb-4">Old Name -: <strong>{editName}</strong></h4>
              <input type="text" className="form-control" onChange={(e) => setEditNameInput(e.target.value)}></input><br />
              <button className="btn btn-primary" onClick={handlEditName} >Change</button>
            </div>
          </>
        )}

        {editPassword && (
          <>
            <div
              className="position-fixed p-4 shadow rounded border"
              style={{
                top: "50%",
                left: "55%",
                backgroundColor: 'rgb(145, 168, 250)',
                overflowY: "auto",
                transform: "translate(-50%, -50%)",
                width: "30%",
                maxWidth: "400px",
                zIndex: 1050,
                animation: "fadeIn 0.3s ease-out",
              }}
            >
              <button
                className="btn-close position-absolute top-0 end-0 m-2"
                onClick={() => setEditPassword(null)}
              ></button>
              <h2 className="mb-3"><strong>Change Password</strong></h2>
              <h5>Old Password</h5><input type="password" className="form-control" onChange={(e) => setEditPasswordInputOld(e.target.value)} /><br />
              <h5>New Password</h5><input type="password" className="form-control" onChange={(e) => setEditPasswordInputNew(e.target.value)} /><br />
              <button className="btn btn-primary" onClick={handleEditPassword}>Change Password</button>
            </div>
          </>
        )}

        {activeSection === "user_request" && (
          <div
            className="container mt-4 position-relative"
            style={{
              maxWidth: "75%",
              height: "100vh",
            }}
          >
            <h2>Requested Users</h2>
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                  <tr>
                    <th>S/N</th>
                    <th>User Id</th>
                    <th>User Name</th>
                    <th>User Email</th>
                    <th>Role</th>
                    <th>Date</th>
                    <th>Access</th>
                  </tr>
                </thead>
                <tbody>
                  {request_user ? (
                    request_user.length > 0 ? (
                      request_user.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.user_id}</td>
                          <td>{item.user_name}</td>
                          <td>{item.user_email}</td>
                          <td>{item.user_role}</td>
                          <td>{item.date}</td>
                          <td>
                            <div className="d-flex flex-column">
                              <button
                                className="btn btn-primary btn-sm mb-2 p-0"
                                onClick={() => handle_give_access(item)}
                              >Admin</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">No Data</td>
                      </tr>
                    )
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">No Data</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div> */}
    </div>
  );
};

export default Dashboard;