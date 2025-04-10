import React, { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import { MdDashboard, MdPayment, MdEmail, MdDelete, MdAttachEmail, MdConfirmationNumber, MdKeyboardDoubleArrowDown } from "react-icons/md";
import { FaUsers, FaUserGear, FaWeightScale, FaUserTie, FaLocationDot, FaCity, FaBuildingFlag } from "react-icons/fa6";
import Dropdown from 'react-bootstrap/Dropdown';
import { FaBell, FaPhoneAlt, FaBoxOpen, FaEye, FaTruckLoading, FaSearch, FaRuler, FaUser, FaFlag, FaMapPin, FaCalendarCheck, FaInfoCircle } from "react-icons/fa";
import { PiShippingContainerDuotone } from "react-icons/pi";
import { BsCarFrontFill, BsFillInfoCircleFill, BsBuildingsFill, BsWindowSidebar } from "react-icons/bs";
import { IoIosAddCircleOutline, IoMdAddCircleOutline } from "react-icons/io";
import Countries_selector from "./Countries_selector";
import { IoStar, IoCall } from "react-icons/io5";
import { RiPencilFill, RiSecurePaymentFill, RiExpandHeightFill, RiExpandWidthFill } from "react-icons/ri";
import { SiAnytype } from "react-icons/si";
import { DateRange } from 'react-date-range';
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";
import Registration from "./Registration";
import { formatDistanceToNow } from "date-fns";
import Paypal_payment from "./Paypal_payment";
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import { useAlert } from "../alert/Alert_message";
import ConfirmationModal from '../alert/Conform_alert';

// import 'datatables.net-select-dt';
// import 'datatables.net-responsive-dt';

import $ from "jquery";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net";


DataTable.use(DT);

const Dashboard = () => {
  const port = process.env.REACT_APP_SECRET;
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  // const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [userInfo, setUserInfo] = useState('');
  const [admin_notification, setAdmin_notification] = useState([]);
  const [super_admin_notification, setSuper_admin_notification] = useState([]);
  const [user_notification, setUser_notification] = useState([]);
  useEffect(() => {
    const notification = () => {
      if (userRole === 'admin') {
        axios.get(`${port}/notification/admin_notification`, {
          headers: {
            Authorization: token,
          }
        }).then((response) => {
          if (response.data.status === true) {
            setAdmin_notification(response.data.message);
          }
        }).catch((err) => { console.log(err) })
      }
      if (userRole === 'Sadmin') {
        axios.get(`${port}/notification/SuperAdmin_notification`, {
          headers: {
            Authorization: token,
          }
        }).then((response) => {
          if (response.data.status === true) {
            setSuper_admin_notification(response.data.message);
          }
        }).catch((err) => { console.log(err) });
      }
      if (userRole === 'user') {
        axios.get(`${port}/notification/user_notification`, {
          headers: {
            Authorization: token,
          }
        }).then((response) => {
          if (response.data.status === true) {
            setUser_notification(response.data.message);
          }
        }).catch((err) => { console.log(err) });
      }
    }
    notification();

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


  const notification_groupageData = super_admin_notification.filter(
    (item) => item.groupage_created_at && item.groupage_created_by
  ).slice(0, 4); // Ensure only first 4 items

  const notification_companyData = super_admin_notification.filter(
    (item) => item.company_info_logo !== null && item.company_info_name !== null
  ).slice(0, 4);

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

  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem("activeSection") || "dashboard";
  });
  useEffect(() => {
    localStorage.setItem("activeSection", activeSection);
  }, [activeSection]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 800);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handel_logout = () => {
    localStorage.setItem('userRole', 'user');
    localStorage.setItem('token', '');
    localStorage.setItem('userInfo', '');
    localStorage.setItem('valid', '');
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
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [deleteAction, setDeleteAction] = useState(null);

  const openDeleteModal = (message, deleteFunction) => {
    setModalMessage(message);
    setDeleteAction(() => deleteFunction);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (deleteAction) {
      deleteAction(); // Execute the stored delete function
    }
    setShowModal(false);
  };

  const cancelDelete = () => {
    setShowModal(false);
    showAlert("Delete canceled");
  };


  const handleDeleteUser = (user) => {
    openDeleteModal(`Are you sure you want to delete ${user.name}?`, () => {
      axios.delete(`${port}/s_admin/delete_user/${user.id}`, {
        headers: {
          Authorization: token,
        }
      }).then((response) => {
        console.log(response.data);
        showAlert(response.data.message);
        window.location.reload();
      }).catch((err) => { console.log(err) });
    });
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
        // console.log("Data fetched successfully:", response.data);
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
  const [total_companies, setTotal_companies] = useState('');
  const [total_user, setTotal_user] = useState('');

  const total_company = () => {
    axios.get(`${port}/s_admin/count_companies`, {
      headers: {
        Authorization: token,
      }
    }).then((response) => {
      if (response.data.status === true) {
        setTotal_companies(response.data.message.count);
      } else {
        setTotal_companies('');
      }
      // console.log(response.data, 'this is the data 1');
    }).catch((err) => { console.log(err) });
  }

  const total_users = () => {
    axios.get(`${port}/s_admin/count_users`, {
      headers: {
        Authorization: token,
      }
    }).then((response) => {
      if (response.data.status === true) {
        setTotal_user(response.data.message.count);
      } else {
        setTotal_user('');
      }
      // console.log(response.data, 'this is the data 2');
    }).catch((err) => { console.log(err) });
  }


  useEffect(() => {
    featchCompanydata();
    featchAllUsers();
    displayGroupageUser();
    offersForUser();
    displayallOffers();
    display_admin_Offers();
    total_company();
    total_users();
    payment_history_user();
    payment_history();
    display_admin_total_offers();
    display_admin_accecepted_offers();
    total_user_orders();
    // user_requests();
  }, []);

  const [admin_total_offers, setAdmin_total_offers] = useState('');
  const display_admin_total_offers = () => {
    if (userRole === 'admin') {
      axios.get(`${port}/admin/total_offers_sent`, {
        headers: {
          Authorization: token,
        }
      }).then((response) => {
        console.log(response.data, 'this is the data 3');
        if (response.data.status === true) {
          setAdmin_total_offers(response.data.message);
        } else {
          setAdmin_total_offers('');
        }
      })
    }
  }
  const [admin_offer_accecepted, setAdmin_offer_accecepted] = useState('');
  const display_admin_accecepted_offers = () => {
    if (userRole === 'admin') {
      axios.get(`${port}/admin/total_offer_accepted`, {
        headers: {
          Authorization: token,
        }
      }).then((response) => {
        if (response.data.status === true) {
          setAdmin_offer_accecepted(response.data.message);
        } else {
          setAdmin_offer_accecepted('');
        }
      })
    }
  }

  const [user_numbers_orders, setUser_numbers_orders] = useState('');
  const total_user_orders = () => {
    axios.get(`${port}/user/total_orders_number`, {
      headers: {
        Authorization: token,
      }
    }).then((response) => {
      console.log(response.data, 'this is the data 4');
      if (response.data.status === true) {
        setUser_numbers_orders(response.data.message);
      } else {
        setUser_numbers_orders('');
      }
    }).catch((err) => { console.log(err) });
  }
  const [user_payment_history, setUser_payment_history] = useState([]);
  const payment_history_user = () => {
    axios.get(`${port}/user/payment_history`, {
      headers: {
        Authorization: token,
      }
    }).then((response) => {
      if (response.data.status === true) {
        setUser_payment_history(response.data.message);
      } else {
        setUser_payment_history('');
      }
    }).catch((err) => { console.log(err) });
  }
  // console.log(user_payment_history, 'this is the payment');

  const [S_admin_payment, setS_admin_payment] = useState([]);
  const payment_history = () => {
    axios.get(`${port}/S_admin/payment_history`, {
      headers: {
        Authorization: token,
      }
    }).then((response) => {
      if (response.data.status === true) {
        setS_admin_payment(response.data.message);
      } else {
        setS_admin_payment('');
      }
    }).catch((err) => { console.log(err) });
  }

  const handleViewClick = (company) => {
    setSelectedCompany(company);
  };
  const handleEditClick = (company) => {
    setEditCompany(company);
  }

  //delete company 
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
            console.log(response.data);
            window.location.reload();
          })
          .catch((error) => console.error("Error deleting:", error));
      }
    );

    // const userConfirmed = window.confirm(`Are you sure you want to delete ${company.company_name} company?`);
    // if (userConfirmed) {
    //   setShowAlert(true);
    //   setAlert_message(`Deleting ${company.company_name}`);
    //   if (userRole === 'Sadmin') {
    //     axios.delete(`${port}/s_admin/delete_compnay/company_${company.id}`, {
    //       headers: {
    //         Authorization: token,
    //       }
    //     }).then((response) => {
    //       // console.log("Data fetched successfully:", response.data);
    //       window.location.reload();
    //     }).catch((error) => { console.error("Error fetching data:", error); }
    //     );
    //   }
    //   if (userRole === 'admin') {
    //     axios.delete(`${port}/admin/delete_compnay/'company'_${company.id}`, {
    //       headers: {
    //         Authorization: token,
    //       }
    //     }).then((response) => {
    //       console.log("Data fetched successfully:", response.data);
    //       window.location.reload();
    //     }).catch((error) => { console.error("Error fetching data:", error); }
    //     );
    //   }

    // } else {
    //   setShowAlert(true);
    //   setAlert_message(`Cancel deleting ${company.company_name}`);
    // }
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
      showAlert('Please select all the fieldes.');
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
      showAlert('Please select both "From" and "To" countries.');
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

  //display groupage user
  const [groupageUser, setGroupageUser] = useState([]);
  const displayGroupageUser = () => {
    axios.get(`${port}/send_groupage/display_user_dashboard`, {
      headers: {
        Authorization: token,
      }
    }).then((response) => {
      setGroupageUser(response.data.message);
    }).catch((err) => { console.log(err); });
  }

  const [selected_groupage, setSelected_groupage] = useState(null);
  const handle_show_groupage_details = (item) => {
    setSelected_groupage(item);
  }
  const handle_show_groupage_delete = (item) => {

    openDeleteModal(`Are you sure you want to delete ${item.name}?`, () => {
      axios.delete(`${port}/send_groupage/delete_groupage/${item.id}`, {
        headers: { Authorization: token },
      })
        .then((response) => {
          console.log(response.data);
          showAlert(response.data.message);
          window.location.reload();
        })
        .catch((err) => console.log(err));
    });

    // const confirmed = window.confirm(`Are you sure you want to delete ${item.name}?`);
    // if (confirmed) {
    //   axios.delete(`${port}/send_groupage/delete_groupage/${item.id}`, {
    //     headers: {
    //       Authorization: token,
    //     }
    //   }).then((response) => {
    //     console.log(response.data);
    //     setShowAlert(true);
    //     setAlert_message(response.data.message);
    //     window.location.reload();
    //   }).catch((err) => { console.log(err); });
    // } else {
    //   setShowAlert(true);
    //   setAlert_message('Delete canceled');
    // }
  }
  const [offers, setOffers] = useState([]);
  const offersForUser = () => {
    axios.get(`${port}/send_groupage/show_offer_user`, {
      headers: {
        Authorization: token,
      }
    }).then((response) => {
      if (response.data.status === true) {
        setOffers(response.data.message);
      } else {
        setOffers([]);
      }
      // console.log(response.data, 'offers');
    }).catch((err) => { console.log(err); });
  }
  const [selected_offer, setSelected_offer] = useState(null);
  const handleShowOffer = (item) => {
    axios.get(`${port}/send_groupage/groupage_info/${item.order_id}`, {
      headers: {
        Authorization: token,
      }
    }).then((response) => {
      setSelected_offer({ ...response.data.message, ...item });
    }).catch((err) => { console.log(err); });
  }
  // console.log(selected_offer, 'this is the selected offer');
  const handleDeleteoffer = (item) => {
    openDeleteModal("Are you sure you want to delete this offer?", () => {
      axios.delete(`${port}/send_groupage/delete_offer_user/${item}`, {
        headers: { Authorization: token },
      })
        .then((response) => {
          showAlert(response.data.message);
          window.location.reload();
        })
        .catch((err) => console.log(err));
    });

    // const confirmed = window.confirm(`Are you sure you want to delete?`);
    // if (confirmed) {
    //   axios.delete(`${port}/send_groupage/delete_offer_user/${item}`, {
    //     headers: {
    //       Authorization: token,
    //     }
    //   }).then((response) => {
    //     setShowAlert(true);
    //     setAlert_message(response.data.message);
    //     window.location.reload();
    //   }).catch((err) => { console.log(err); });
    // } else {
    //   setShowAlert(true);
    //   setAlert_message('Delete canceled');
    // }
  }

  const duration_calculate = (departure_date, pickup_date) => {
    const firstPickupDate = pickup_date.split(" - ")[0];

    const departureDateObj = new Date(departure_date);
    const pickupDateObj = new Date(firstPickupDate.split("/").reverse().join("-")); // Convert DD/MM/YYYY to YYYY-MM-DD

    const diffInTime = departureDateObj - pickupDateObj;

    const durationInDays = diffInTime / (1000 * 60 * 60 * 24);

    const duration =
      durationInDays >= 30
        ? `${Math.floor(durationInDays / 30)} month(s)`
        : `${durationInDays} day(s)`;
    return duration;
  }

  const handleAcceptOffer = (item) => {
  }

  const [admin_offer, setAdmin_offer] = useState([]);
  const display_admin_Offers = () => {
    axios.get(`${port}/admin/display_offer`, {
      headers: {
        Authorization: token,
      }
    }).then((response) => {
      if (response.data.status === true) {
        setAdmin_offer(response.data.message);
      } else {
        setAdmin_offer([]);
      }
      // console.log(response.data);
    }).catch((err) => { });
  }
  const [allOffers, setAllOffers] = useState([]);
  const displayallOffers = () => {
    axios.get(`${port}/s_admin/show_all_offers`, {
      headers: {
        Authorization: token,
      }
    }).then((response) => {
      // console.log(response.data);
      setAllOffers(response.data.data);
    }).catch((err) => { });
  }

  // console.log(allOffers);


  const tableRef = useRef(null);

  useEffect(() => {
    if (tableRef.current) {
      $(tableRef.current).DataTable({
        data: allOffers.map((offer) => [
          offer.offer_id,
          offer.product_name,
          offer.created_by_email,
          `$${offer.amount}`,
          offer.receiver_email,
          offer.payment_status ? offer.payment_status : "Pending",
        ]),
        columns: [
          { title: "Order Id" },
          { title: "Product Name" },
          { title: "Offer Created By" },
          { title: "Price ($)" },
          { title: "Offer Received By" },
          { title: "Payment Status" },
        ],
        destroy: true, // Prevent re-initialization error
      });
    }
  }, [allOffers]);

  const [showOfferDetails, setShowOfferDetails] = useState(null);
  const show_offer_details = (item) => {
    setShowOfferDetails(item);
  }
  // console.log(showOfferDetails);
  // console.log(selectedCompany)
  const Menu = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [selectedItem, setSelectedItem] = useState('Dashboard');

    const handleSelect = (item) => {
      // console.log("Selected Item:", item);
      setSelectedItem(item);
      setShowMenu(false);
    };

    return (
      <div className="d-flex flex-column align-items-center position-relative" style={{ backgroundColor: ' #00232f', width: "100%", }}>
        <div className="d-flex align-items-center justify-content-between p-3 w-100 text-white" onClick={() => setShowMenu(!showMenu)} style={{ cursor: "pointer", borderBottom: "1px solid white" }}>
          <span>{selectedItem}</span>
          <MdKeyboardDoubleArrowDown size={24} />
        </div>
        {showMenu && (
          <div className="position-absolute text-white w-100 p-3" style={{ backgroundColor: ' #00232f', top: "50px", zIndex: 1000 }}>
            <ul className="nav flex-column mt-4 fs-4 w-100">
              <li className="nav-item mb-4 text-start" style={activeSection === 'dashboard' ? { backgroundColor: "06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}>
                <Link to="#" className="nav-link text-white" onClick={() => { handleSelect("Dashboard"); setActiveSection("dashboard"); localStorage.setItem("activeSection", "dashboard"); setSelectedCompany(''); setShowOfferDetails(null); setSelected_groupage(null); setShowRegisterPopup(false) }}>
                  <MdDashboard /> Dashboard
                </Link>
              </li>

              {userRole === 'Sadmin' || userRole === 'admin' ? (
                <>
                  <li className="nav-item mb-4 text-start" style={activeSection === 'companies' ? { backgroundColor: "06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}>
                    <Link to="#" className="nav-link text-white" onClick={() => { handleSelect("Companies"); setActiveSection("companies"); localStorage.setItem("activeSection", "companies"); setSelectedCompany(''); setShowOfferDetails(null); setShowRegisterPopup(false) }}>
                      <BsBuildingsFill /> Companies
                    </Link>
                  </li>
                  <li className="nav-item mb-4 text-start" style={activeSection === 'offers' ? { backgroundColor: "06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}>
                    <Link to="#" className="nav-link text-white" onClick={() => { handleSelect("Offers"); setActiveSection("offers"); localStorage.setItem("activeSection", "offers"); setSelectedCompany(''); setShowOfferDetails(null); setShowRegisterPopup(false) }}>
                      <FaUsers /> Offers
                    </Link>
                  </li>
                  <li className="nav-item mb-4 text-start" style={activeSection === 'payments' ? { backgroundColor: "06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}>
                    <Link to="#" className="nav-link text-white" onClick={() => { handleSelect("Payments"); setActiveSection("payments"); localStorage.setItem("activeSection", "payments"); setSelectedCompany(''); setShowOfferDetails(null); setShowRegisterPopup(false) }}>
                      <RiSecurePaymentFill /> Payments
                    </Link>
                  </li>
                  {userData.length > 0 && (
                    <li className="nav-item mb-4 text-start" style={activeSection === 'users' ? { backgroundColor: "06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}>
                      <Link to="#" className="nav-link text-white" onClick={() => { handleSelect("Roles & Permissions"); setActiveSection("users"); localStorage.setItem("activeSection", "users"); setSelectedCompany(''); setShowOfferDetails(null); setShowRegisterPopup(false) }}>
                        <FaUserGear /> Roles & Permissions
                      </Link>
                    </li>
                  )}
                </>
              ) : (
                <>
                  <li className="nav-item mb-4 text-start" style={activeSection === 'orders' ? { backgroundColor: "06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}>
                    <Link to="#" className="nav-link text-white" onClick={() => { handleSelect("Orders"); setActiveSection("orders"); localStorage.setItem("activeSection", "orders"); setSelectedCompany(''); setSelected_groupage(null); setShowRegisterPopup(false) }}>
                      <FaBoxOpen /> Orders
                    </Link>
                  </li>

                  <li className="nav-item mb-4 text-start" style={activeSection === 'user_offers' ? { backgroundColor: "06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}>
                    <Link to="#" className="nav-link text-white" onClick={() => { handleSelect("Offers"); setActiveSection("user_offers"); localStorage.setItem("activeSection", "user_offers"); setSelectedCompany(''); setSelected_groupage(null); setShowRegisterPopup(false) }}>
                      <MdPayment /> Offers
                    </Link>
                  </li>

                  <li className="nav-item mb-4 text-start" style={activeSection === 'payment_history' ? { backgroundColor: "06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}>
                    <Link to="#" className="nav-link text-white" onClick={() => { handleSelect("Payment History"); setActiveSection("payment_history"); localStorage.setItem("activeSection", "payment_history"); setSelectedCompany(''); setSelected_groupage(null); setShowRegisterPopup(false) }}>
                      <MdPayment /> Payment History
                    </Link>
                  </li>
                </>
              )}

            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="vh-100">
      {/* {showAlert && <Alert message={alert_message} onClose={() => setShowAlert(false)} />} */}
      <ConfirmationModal
        show={showModal}
        message={modalMessage}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
      <div className='navbar-wrapper'>
        <div className=" d-flex justify-content-center w-100">
          <Navbar />
        </div>
      </div>
      <div className="d-flex flex-row align-items-center justify-content-end bg-light" style={{ height: '100%' }}>
        {isMobile ? (
          <>

          </>
        ) : (
          <>
            <section className="d-flex flex-column align-items-start sidebar-wrapper"
            // style={{ backgroundColor: ' #010037', width: "100%", maxWidth: "20%", height: '100vh' }}
            >
              <div className="sidebar-wrap w-100">
                <div className="d-flex align-items-start justify-content-start mt-5">
                  <ul className="nav flex-column mt-4 fs-4 w-100">
                    <li className="nav-item mb-4 text-start" style={activeSection === 'dashboard' ? { backgroundColor: "#06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}>
                      <Link to="#" className="nav-link text-white sidebar-links" onClick={() => { setActiveSection("dashboard"); localStorage.setItem("activeSection", "dashboard"); setSelectedCompany(''); setShowOfferDetails(null); setSelected_groupage(null); setShowRegisterPopup(false) }}>
                        <MdDashboard /> Dashboard
                      </Link>
                    </li>

                    {userRole === 'Sadmin' ? (
                      <>
                        <li className="nav-item mb-4 text-start" style={activeSection === 'companies' ? { backgroundColor: "#06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}>
                          <Link to="#" className="nav-link text-white sidebar-links" onClick={() => { setActiveSection("companies"); localStorage.setItem("activeSection", "companies"); setSelectedCompany(''); setShowOfferDetails(null); setShowRegisterPopup(false) }}>
                            <BsBuildingsFill /> Companies
                          </Link>
                        </li>
                        <li className="nav-item mb-4 text-start" style={activeSection === 'offers' ? { backgroundColor: "#06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}>
                          <Link to="#" className="nav-link text-white sidebar-links" onClick={() => { setActiveSection("offers"); localStorage.setItem("activeSection", "offers"); setSelectedCompany(''); setShowOfferDetails(null); setShowRegisterPopup(false) }}>
                            <FaUsers /> Offers
                          </Link>
                        </li>
                        <li className="nav-item mb-4 text-start" style={activeSection === 'payments' ? { backgroundColor: "#06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}>
                          <Link to="#" className="nav-link text-white sidebar-links" onClick={() => { setActiveSection("payments"); localStorage.setItem("activeSection", "payments"); setSelectedCompany(''); setShowOfferDetails(null); setShowRegisterPopup(false) }}>
                            <RiSecurePaymentFill /> Payments
                          </Link>
                        </li>
                        {userData.length > 0 && (
                          <li className="nav-item mb-4 text-start" style={activeSection === 'users' ? { backgroundColor: "#06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}>
                            <Link to="#" className="nav-link text-white sidebar-links" onClick={() => { setActiveSection("users"); localStorage.setItem("activeSection", "users"); setSelectedCompany(''); setShowOfferDetails(null); setShowRegisterPopup(false) }}>
                              <FaUserGear /> Roles & Permissions
                            </Link>
                          </li>
                        )}
                      </>
                    ) : (
                      <>
                        {userRole === 'user' && (
                          <>
                            <li className="nav-item mb-4 text-start" style={activeSection === 'orders' ? { backgroundColor: "#06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}>
                              <Link to="#" className="nav-link text-white sidebar-links" onClick={() => { setActiveSection("orders"); localStorage.setItem("activeSection", "orders"); setSelectedCompany(''); setSelected_groupage(null); setShowRegisterPopup(false) }}>
                                <FaBoxOpen /> Orders
                              </Link>
                            </li>
                          </>
                        )}

                        <li className="nav-item mb-4 text-start" style={activeSection === 'user_offers' ? { backgroundColor: "#06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}>
                          <Link to="#" className="nav-link text-white sidebar-links" onClick={() => { setActiveSection("user_offers"); localStorage.setItem("activeSection", "user_offers"); setSelectedCompany(''); setSelected_groupage(null); setShowRegisterPopup(false) }}>
                            <MdPayment /> Offers
                          </Link>
                        </li>

                        {userRole === 'user' && (
                          <>
                            <li className="nav-item mb-4 text-start" style={activeSection === 'payment_history' ? { backgroundColor: "#06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}>
                              <Link to="#" className="nav-link text-white sidebar-links" onClick={() => { setActiveSection("payment_history"); localStorage.setItem("activeSection", "payment_history"); setSelectedCompany(''); setSelected_groupage(null); setShowRegisterPopup(false) }}>
                                <MdPayment /> Payment History
                              </Link>
                            </li>
                          </>
                        )}
                      </>
                    )}

                  </ul>
                </div>
              </div>
            </section>
          </>
        )}


        {activeSection === "dashboard" && (
          <>
            {userRole === 'Sadmin' ? (
              <>
                <div className="bg-light" style={{ width: '100%', maxWidth: isMobile ? "100%" : "85%", height: '100%' }}>
                  <div className="dashbord-info-wrap">

                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center w-100 p-2">
                      {isMobile && (
                        <div className="w-100 d-flex justify-content-start">
                          <Menu />
                        </div>
                      )}
                      <div className="d-flex align-items-center justify-content-end w-100 mt-2 mt-md-0">
                        <div className="p-3">
                        </div>
                        <div className="border-start p-2 border-3 border-dark">
                          <Dropdown>
                            <Dropdown.Toggle className="fs-5 w-100 text-secondary" variant="light" id="dropdown-basic">
                              <FaUserTie /> <strong className="text-capitalize">{userInfo.name}</strong>
                            </Dropdown.Toggle>
                            <Dropdown.Menu align="end">
                              <div className="d-flex flex-column justify-content-center align-items-center gap-2">
                                {/* <div className="text-capitalize">
                                  <strong>Role:</strong> {userInfo.role === 'Sadmin' ? 'Super Admin' : userInfo.role === 'admin' ? 'Admin' : 'User'}
                                </div>
                                <div>
                                  <strong>Email:</strong> {userInfo.email}
                                </div>
                                <button className="btn btn-secondary btn-sm">Edit Name</button>
                                <button className="btn btn-secondary btn-sm">Edit Password</button> */}
                                <button className="btn btn-sm btn-primary mt-1">Profile information</button>
                                <button className="btn btn-danger btn-sm mt-1" onClick={handel_logout}>Logout</button>
                              </div>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-start align-items-center mt-2 rounded-1" >
                      <div className="d-flex  w-50 justify-content-start">
                        <label className="fs-3">Hi, <strong>{userInfo.name}</strong></label>
                      </div>
                      <div className="w-50 pe-3 d-flex justify-content-end">
                        <label className="text-success fs-5">Updated 2 min ago</label>
                      </div>
                    </div>


                    <div className="dashboard-wraper-box">
                      <div className="row mt-3 g-3 justify-content-center">
                        {[{ count: 'N/A', change: "+5%", text: "Amount Received", icon: <PiShippingContainerDuotone /> },
                        { count: 'N/A', change: "-2%", text: "Commission Earned", icon: <BsCarFrontFill /> },
                        { count: 'N/A', change: "+10%", text: "Total Amount Paid", icon: <FaTruckLoading /> }
                        ].map((item, index) => (
                          <div key={index} className="col-12 col-sm-6 col-md-4 d-flex justify-content-center">
                            <div className=" dashboard-wrap-box ">
                              <div className="rounded-circle fs-1 d-flex justify-content-center align-items-center text-primary mx-auto" style={{ width: '5rem', height: '5rem', backgroundColor: '#e1f5ff' }}>
                                {item.icon}
                              </div>
                              <h3 className="mt-3 fw-bold d-block">{item.count}</h3>
                              <label className="text-success fs-6 p-2">{item.change} Last Month</label>
                              <label className="fs-5 d-block">{item.text}</label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="dashboard-wraper-box ">
                      <div className="row mt-3 g-3 justify-content-center">
                        {[{ count: total_companies, change: "+7%", text: "Companies Registered", icon: <BsBuildingsFill /> },
                        { count: total_user, change: "+2%", text: "Customers Registered", icon: <FaUsers /> }
                        ].map((item, index) => (
                          <div key={index} className="col-12 col-sm-6 col-md-4 d-flex justify-content-center">
                            <div className=" dashboard-wrap-box ">
                              <div className="rounded-circle fs-1 d-flex justify-content-center align-items-center text-primary mx-auto" style={{ width: '5rem', height: '5rem', backgroundColor: '#e1f5ff' }}>
                                {item.icon}
                              </div>
                              <h3 className="mt-3 fw-bold d-block">{item.count}</h3>
                              <label className="text-success fs-6 p-2">{item.change} Last Month</label>
                              <label className="fs-5 d-block">{item.text}</label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </>
            ) : userRole === 'admin' ? (
              <>
                <div className="bg-light" style={{ width: '100%', maxWidth: isMobile ? "100%" : "85%", height: '100%' }}>
                  <div className="dashbord-info-wrap">

                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center w-100 p-2">
                      {isMobile && (
                        <div className="w-100 d-flex justify-content-start">
                          <Menu />
                        </div>
                      )}
                      <div className="d-flex align-items-center justify-content-end w-100 mt-2 mt-md-0">
                        <div className="p-3">
                        </div>
                        <div className="border-start p-2 border-3 border-dark">
                          <Dropdown>
                            <Dropdown.Toggle className="fs-5 w-100 text-secondary" variant="light" id="dropdown-basic">
                              <FaUserTie /> <strong className="text-capitalize">{userInfo.name}</strong>
                            </Dropdown.Toggle>
                            <Dropdown.Menu align="end">
                              <div className="d-flex flex-column justify-content-center align-items-center gap-2">
                                {/* <div className="text-capitalize">
                                  <strong>Role:</strong> {userInfo.role === 'Sadmin' ? 'Super Admin' : userInfo.role === 'admin' ? 'Admin' : 'User'}
                                </div>
                                <div>
                                  <strong>Email:</strong> {userInfo.email}
                                </div>
                                <button className="btn btn-secondary btn-sm">Edit Name</button>
                                <button className="btn btn-secondary btn-sm">Edit Password</button> */}
                                <button className="btn btn-sm btn-primary mt-1">Profile information</button>
                                <button className="btn btn-danger btn-sm mt-1" onClick={handel_logout}>Logout</button>
                              </div>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-start align-items-center mt-2 rounded-1" >
                      <div className="d-flex  w-50 justify-content-start">
                        <label className="fs-3">Hi, <strong>{userInfo.name}</strong></label>
                      </div>
                      <div className="w-50 pe-3 d-flex justify-content-end">
                        <label className="text-success fs-5">Updated 2 min ago</label>
                      </div>
                    </div>


                    <div className="dashboard-wraper-box">
                      <div className="row mt-3 g-3 justify-content-center">
                        {[{ count: 'N/A', change: "+5%", text: "Amount Received", icon: <PiShippingContainerDuotone /> },
                        { count: admin_total_offers, change: "-2%", text: "Total Offers Sent", icon: <BsCarFrontFill /> },
                        { count: admin_offer_accecepted, change: "+10%", text: "Offers Accepted ", icon: <FaTruckLoading /> }
                        ].map((item, index) => (
                          <div key={index} className="col-12 col-sm-6 col-md-4 d-flex justify-content-center">
                            <div className=" dashboard-wrap-box ">
                              <div className="rounded-circle fs-1 d-flex justify-content-center align-items-center text-primary mx-auto" style={{ width: '5rem', height: '5rem', backgroundColor: '#e1f5ff' }}>
                                {item.icon}
                              </div>
                              <h3 className="mt-3 fw-bold d-block">{item.count}</h3>
                              <label className="text-success fs-6 p-2">{item.change} Last Month</label>
                              <label className="fs-5 d-block">{item.text}</label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{ width: '100%', maxWidth: isMobile ? "100%" : "85%", height: '100vh', overflow: 'auto' }}>
                  <div className="dashbord-info-wrap">
                    <div className="d-flex flex-wrap justify-content-end align-items-center mt-2 gap-3">
                      {isMobile && (
                        <div className="w-100 d-flex justify-content-start">
                          <Menu />
                        </div>
                      )}
                      <div className="border-start p-2 border-3 border-dark">
                        <Dropdown>
                          <Dropdown.Toggle className="fs-5 w-100 text-secondary" variant="light" id="dropdown-basic">
                            <FaUserTie /> <strong className="text-capitalize">{userInfo.name}</strong>
                          </Dropdown.Toggle>
                          <Dropdown.Menu align="end">
                            <div className="d-flex flex-column justify-content-center align-items-center gap-2">
                              {/* <div className="text-capitalize">
                                  <strong>Role:</strong> {userInfo.role === 'Sadmin' ? 'Super Admin' : userInfo.role === 'admin' ? 'Admin' : 'User'}
                                </div>
                                <div>
                                  <strong>Email:</strong> {userInfo.email}
                                </div>
                                <button className="btn btn-secondary btn-sm">Edit Name</button>
                                <button className="btn btn-secondary btn-sm">Edit Password</button> */}
                              <button className="btn btn-sm btn-primary mt-1">Profile information</button>
                              <button className="btn btn-danger btn-sm mt-1" onClick={handel_logout}>Logout</button>
                            </div>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                    <div className="d-flex justify-content-start align-items-center mt-2 rounded-1" >
                      <div className="d-flex  w-50 justify-content-start">
                        <label className="fs-3">Hi, <strong>{userInfo.name}</strong></label>
                      </div>
                      <div className="w-50 pe-3 d-flex justify-content-end">
                        <label className="text-success fs-5">Updated 2 min ago</label>
                      </div>
                    </div>

                    <div className="dashboard-wraper-box">
                      <div className="row mt-3 g-3 justify-content-center">
                        {[{ count: user_numbers_orders, change: "+5%", text: "Total Orders", icon: <PiShippingContainerDuotone /> },
                        { count: 15, change: "-2%", text: "Upcoming Pick up", icon: <BsCarFrontFill /> },
                        { count: 25, change: "+10%", text: "Total Spending", icon: <FaTruckLoading /> }
                        ].map((item, index) => (
                          <div key={index} className="col-12 col-sm-6 col-md-4 d-flex justify-content-center">
                            <div className=" dashboard-wrap-box ">
                              <div className="rounded-circle fs-1 d-flex justify-content-center align-items-center text-primary mx-auto" style={{ width: '5rem', height: '5rem', backgroundColor: '#e1f5ff' }}>
                                {item.icon}
                              </div>
                              <h3 className="mt-3 fw-bold d-block">{item.count}</h3>
                              <label className="text-success fs-6 p-2">{item.change} Last Month</label>
                              <label className="fs-5 d-block">{item.text}</label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </>
            )}
          </>

        )}

        {activeSection === 'orders' && (
          <>
            <div className="bg-light" style={{ width: '100%', maxWidth: isMobile ? "100%" : "85%", height: '100vh', overflow: 'auto' }}>
              {isMobile && (
                <div className="w-100 d-flex justify-content-start">
                  <Menu />
                </div>
              )}
              <div className="d-flex flex-wrap justify-content-end align-items-center mt-2 gap-3">
                <div className="p-3 pe-lg-5 pe-3">
                </div>
                <div className="border-start p-2 border-3 border-dark">
                  <Dropdown>
                    <Dropdown.Toggle className="fs-5 w-100 text-secondary" variant="light" id="dropdown-basic">
                      <FaUserTie /> <strong className="text-capitalize">{userInfo.name}</strong>
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="end">
                      <div className="d-flex flex-column justify-content-center align-items-center gap-2">
                        {/* <div className="text-capitalize">
                                  <strong>Role:</strong> {userInfo.role === 'Sadmin' ? 'Super Admin' : userInfo.role === 'admin' ? 'Admin' : 'User'}
                                </div>
                                <div>
                                  <strong>Email:</strong> {userInfo.email}
                                </div>
                                <button className="btn btn-secondary btn-sm">Edit Name</button>
                                <button className="btn btn-secondary btn-sm">Edit Password</button> */}
                        <button className="btn btn-sm btn-primary mt-1">Profile information</button>
                        <button className="btn btn-danger btn-sm mt-1" onClick={handel_logout}>Logout</button>
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
              <div className="d-flex justify-content-start align-items-center mt-2 ps-3 rounded-1" >
                <div className="d-flex ps-4 w-100 justify-content-start">
                  <label className="fs-3"><strong>Order List</strong></label>
                </div>
              </div>

              <div className="dashboard-wrapper-box">
                <div className="table-wrap">
                  <div className="d-flex flex-column justify-content-start align-items-start ">

                    {/* <div className="d-flex flex-row justify-content-start align-items-start border-bottom border-dark w-100 mb-3">
                      <div className="p-3 border-end">
                        <span>All</span>
                      </div>
                      <div className="p-3 border-end">
                        <span>Unpaid</span>
                      </div>
                      <div className="p-3 border-end">
                        <span>Paid</span>
                      </div>
                    </div> */}
                    <div className="table-filter-wrap">
                      <div className="d-flex flex-column align-items-start justify-content-start ps-2 mb-3 w-100">
                        <h5>Filter By:</h5>

                        <div className="row w-100 g-2 mt-1 ">
                          <div className="col-12 col-md-6 col-lg-3">
                            <input type="text" placeholder="Search by product name or order id" className="shipping-input-field" />
                          </div>
                          <div className="col-12 col-md-6 col-lg-3">
                            <Countries_selector paddingcount='12px 18px' fontsizefont='15px' bgcolor='#ebebeb' bordercolor='1px solid #ebebeb' borderradiuscount='6px' label="Pick Up Country" />
                          </div>
                          <div className="col-12 col-md-6 col-lg-3">
                            <Countries_selector paddingcount='12px 18px' fontsizefont='15px' bgcolor='#ebebeb' bordercolor='1px solid #ebebeb' borderradiuscount='6px' label="Destination Country" />
                          </div>
                          <div className="col-12 col-md-6 col-lg-3">
                            <div style={{ position: "relative", width: "100%" }}>
                              <input
                                type="text"
                                readOnly
                                className="shipping-input-field"
                                value={
                                  state[0].endDate
                                    ? `${format(state[0].startDate, "dd/MM/yyyy")} - ${format(state[0].endDate, "dd/MM/yyyy")}`
                                    : `${format(state[0].startDate, "dd/MM/yyyy")} - Select End Date`
                                }
                                onClick={() => setShowCalendar(!showCalendar)}
                                style={{ cursor: "pointer" }}
                              />
                              {showCalendar && (
                                <div style={{
                                  position: "absolute",
                                  top: "40px",
                                  zIndex: 1000,
                                  background: "#fff",
                                  borderRadius: "8px",
                                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)"
                                }}>
                                  <DateRange
                                    editableDateInputs={true}
                                    onChange={item => setState([item.selection])}
                                    moveRangeOnFirstSelection={false}
                                    ranges={state}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="table-responsive w-100 ">
                      <table className="table">
                        <thead>
                          <tr>
                            <th scope="col"><h6>Order Id</h6></th>
                            <th scope="col"><h6>Product Name</h6></th>
                            <th scope="col"><h6>Pick up</h6></th>
                            <th scope="col"><h6>Delivery</h6></th>
                            <th scope="col"><h6>Pick up Date</h6></th>
                            <th scope="col"><h6>Payment Status</h6></th>
                            <th scope="col"><h6>Actions</h6></th>
                          </tr>
                        </thead>
                        {groupageUser && groupageUser.length > 0 ? (
                          <tbody>
                            {groupageUser.map((item, index) => (
                              <tr key={index}>
                                <td className="text-primary" style={{ cursor: 'pointer' }} onClick={() => handle_show_groupage_details(item)}>#{item.id}</td>
                                <td className="text-secondary">{item.product_name}</td>
                                <td className="text-secondary">{item.sender_country}</td>
                                <td className="text-secondary">{item.receiver_country}</td>
                                <td className="text-secondary">{item.pickup_date.includes('Select End Date') ? item.pickup_date.split(' - ')[0] : item.pickup_date}</td>
                                <td className="text-secondary">
                                  <span className="p-2 fw-bold" style={{
                                    backgroundColor: item.payment_status === 'panding' ? 'rgb(255, 191, 191)' : 'rgb(188, 255, 186)',
                                    color: item.payment_status === 'panding' ? 'rgb(252, 30, 30)' : 'rgb(16, 194, 0)'
                                  }}>
                                    {item.payment_status === 'panding' ? 'Unpaid' : 'Paid'}
                                  </span>
                                </td>
                                <td className="text-secondary">
                                  <button className="btn btn-sm btn-light text-primary pt-0 pb-0" onClick={() => handle_show_groupage_details(item)} style={{ fontSize: '1.5rem' }}>
                                    <FaEye />
                                  </button>
                                  <button className="btn btn-sm btn-light text-danger pt-0 pb-0" onClick={() => handle_show_groupage_delete(item)} style={{ fontSize: '1.5rem' }}>
                                    <MdDelete />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        ) : (
                          <tbody>
                            <tr>
                              <td colSpan='7' className="text-secondary text-center">No Data Available</td>
                            </tr>
                          </tbody>
                        )}
                      </table>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </>
        )}

        {selected_groupage && (
          <>

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
                <div className="d-flex flex-column justify-content-start align-items-start w-100">
                  <button className="btn btn-danger position-absolute top-0 end-0 m-2" onClick={() => setSelected_groupage(null)}>
                    ✕
                  </button>
                  <div className="d-flex justify-content-start align-items-center mt-2 ps-3 rounded-1" >
                    <div className="d-flex w-100 justify-content-start">
                      <label className="fs-3"><strong>Order Details</strong></label>
                    </div>
                  </div>



                  <div className="d-flex flex-row justify-content-start align-items-center">
                    <div className="m-2 w-25 border border-3 border-secondary rounded-1">
                      <img src={selected_groupage.img01} alt="product image" style={{ width: '100%', height: '100%' }} />
                    </div>
                    <div className="ms-5 d-flex flex-column align-items-start justify-content-start">
                      <strong className="fs-4">{selected_groupage.product_name}</strong>
                      <span className="text-secondary">ID: #{selected_groupage.id}</span>
                    </div>
                  </div>
                  <div className="offer-details-wrap">
                    <h5 className="text-start w-100 mb-3 fs-6">Product Information</h5>

                    <div className="row w-100 g-3">
                      <div className="col-12 col-md-4">
                        <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2">
                          <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                            style={{
                              width: '3rem',
                              height: '3rem',
                              backgroundColor: '#E1F5FF',
                              aspectRatio: '1 / 1'
                            }}>
                            <SiAnytype />
                          </div>
                          <div className="d-flex flex-column align-items-start gap-2">
                            <span className="text-secondary offer-submit-sub-head">Product Type</span>
                            <h6>{selected_groupage.product_type}</h6>
                          </div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4">
                        <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2">
                          <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                            style={{
                              width: '3rem',
                              height: '3rem',
                              backgroundColor: '#E1F5FF',
                              aspectRatio: '1 / 1'
                            }}>
                            <FaWeightScale />
                          </div>
                          <div className="d-flex flex-column align-items-start gap-2">
                            <span className="text-secondary offer-submit-sub-head">Weight</span>
                            <h6>{selected_groupage.p_weight} Kg</h6>
                          </div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4">
                        <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2">
                          <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                            style={{
                              width: '3rem',
                              height: '3rem',
                              backgroundColor: '#E1F5FF',
                              aspectRatio: '1 / 1'
                            }}>
                            <RiExpandHeightFill />
                          </div>
                          <div className="d-flex flex-column align-items-start gap-2">
                            <span className="text-secondary offer-submit-sub-head">Height</span>
                            <h6>{selected_groupage.p_height} Cm</h6>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row w-100 g-3 mt-3">
                      <div className="col-12 col-md-4">
                        <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2">
                          <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                            style={{
                              width: '3rem',
                              height: '3rem',
                              backgroundColor: '#E1F5FF',
                              aspectRatio: '1 / 1'
                            }}>
                            <FaRuler />
                          </div>
                          <div className="d-flex flex-column align-items-start gap-2">
                            <span className="text-secondary offer-submit-sub-head">Length</span>
                            <h6>{selected_groupage.p_length} Cm</h6>
                          </div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4">
                        <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2">
                          <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                            style={{
                              width: '3rem',
                              height: '3rem',
                              backgroundColor: '#E1F5FF',
                              aspectRatio: '1 / 1'
                            }}>
                            <RiExpandWidthFill />
                          </div>
                          <div className="d-flex flex-column align-items-start gap-2">
                            <span className="text-secondary offer-submit-sub-head">Width</span>
                            <h6>{selected_groupage.p_width} Cm</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="offer-details-wrap">
                    <div className="d-flex flex-column align-items-start justify-content-start mt-4 w-100">
                      <h5 className="text-start w-100 mb-3 fs-6">Pick Up Information</h5>
                      <div className="row w-100 g-3 mt-2">
                        <div className="col-md-4 col-12">
                          <div className="d-flex align-items-start p-2 gap-2">
                            <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                              style={{
                                width: '3rem',
                                height: '3rem',
                                backgroundColor: '#E1F5FF',
                                aspectRatio: '1 / 1'
                              }}>
                              <FaUser />
                            </div>
                            <div className="d-flex flex-column align-items-start gap-2">
                              <span className="text-secondary offer-submit-sub-head">Full Name</span>
                              <h6>{selected_groupage.sender_name}</h6>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4 col-12">
                          <div className="d-flex align-items-start p-2 gap-2">
                            <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                              style={{
                                width: '3rem',
                                height: '3rem',
                                backgroundColor: '#E1F5FF',
                                aspectRatio: '1 / 1'
                              }}>
                              <IoCall />
                            </div>
                            <div className="d-flex flex-column align-items-start gap-2">
                              <span className="text-secondary offer-submit-sub-head">Contact Number</span>
                              <h6>{selected_groupage.sender_contact}</h6>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4 col-12">
                          <div className="d-flex align-items-start p-2 gap-2">
                            <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                              style={{
                                width: '3rem',
                                height: '3rem',
                                backgroundColor: '#E1F5FF',
                                aspectRatio: '1 / 1'
                              }}>
                              <MdAttachEmail />
                            </div>
                            <div className="d-flex flex-column align-items-start gap-2">
                              <span className="text-secondary offer-submit-sub-head text-start">Email Address</span>
                              <h6>{selected_groupage.sender_email}</h6>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4 col-12">
                          <div className="d-flex align-items-start p-2 gap-2">
                            <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                              style={{
                                width: '3rem',
                                height: '3rem',
                                backgroundColor: '#E1F5FF',
                                aspectRatio: '1 / 1'
                              }}>
                              <FaFlag />
                            </div>
                            <div className="d-flex flex-column align-items-start gap-2">
                              <span className="text-secondary offer-submit-sub-head text-start">Country</span>
                              <h6>{selected_groupage.sender_country}</h6>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4 col-12">
                          <div className="d-flex align-items-start p-2 gap-2">
                            <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                              style={{
                                width: '3rem',
                                height: '3rem',
                                backgroundColor: '#E1F5FF',
                                aspectRatio: '1 / 1'
                              }}>
                              <FaBuildingFlag />
                            </div>
                            <div className="d-flex flex-column align-items-start gap-2">
                              <span className="text-secondary offer-submit-sub-head text-start">State</span>
                              <h6>{selected_groupage.sender_state}</h6>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4 col-12">
                          <div className="d-flex align-items-start p-2 gap-2">
                            <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                              style={{
                                width: '3rem',
                                height: '3rem',
                                backgroundColor: '#E1F5FF',
                                aspectRatio: '1 / 1'
                              }}>
                              <FaCity />
                            </div>
                            <div className="d-flex flex-column align-items-start gap-2">
                              <span className="text-secondary offer-submit-sub-head text-start">City</span>
                              <h6>{selected_groupage.sender_city}</h6>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4 col-12">
                          <div className="d-flex align-items-start p-2 gap-2">
                            <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                              style={{
                                width: '3rem',
                                height: '3rem',
                                backgroundColor: '#E1F5FF',
                                aspectRatio: '1 / 1'
                              }}>
                              <FaMapPin />
                            </div>
                            <div className="d-flex flex-column align-items-start gap-2">
                              <span className="text-secondary offer-submit-sub-head text-start">Street Address</span>
                              <h6>{selected_groupage.sender_address}</h6>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4 col-12">
                          <div className="d-flex align-items-start p-2 gap-2">
                            <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                              style={{
                                width: '3rem',
                                height: '3rem',
                                backgroundColor: '#E1F5FF',
                                aspectRatio: '1 / 1'
                              }}>
                              <MdConfirmationNumber />
                            </div>
                            <div className="d-flex flex-column align-items-start gap-2">
                              <span className="text-secondary offer-submit-sub-head text-start">Zip Code</span>
                              <h6>{selected_groupage.sender_zipcode}</h6>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4 col-12">
                          <div className="d-flex align-items-start p-2 gap-2">
                            <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                              style={{
                                width: '3rem',
                                height: '3rem',
                                backgroundColor: '#E1F5FF',
                                aspectRatio: '1 / 1'
                              }}>
                              <FaCalendarCheck />
                            </div>
                            <div className="d-flex flex-column align-items-start gap-2">
                              <span className="text-secondary offer-submit-sub-head text-start">Pick Up Date</span>
                              <h6>{selected_groupage.pickup_date.includes('Select End Date') ? `${selected_groupage.pickup_date.split(' - ')[0]} -` : selected_groupage.pickup_date}</h6>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="d-flex align-items-start p-2 gap-2">
                            <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                              style={{
                                width: '3rem',
                                height: '3rem',
                                backgroundColor: '#E1F5FF',
                                aspectRatio: '1 / 1'
                              }}>
                              <FaInfoCircle />
                            </div>
                            <div className="d-flex flex-column align-items-start gap-2">
                              <span className="text-secondary offer-submit-sub-head text-start">Pick Up Notes</span>
                              <p className="text-start"><h6>{selected_groupage.sender_description}</h6></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="offer-details-wrap">
                    <div className="d-flex flex-column align-items-start justify-content-start mt-4 w-100">
                      <h5 className="text-start w-100 mb-3 fs-6">Delivery Information</h5>

                      <div className="row w-100 g-3 mt-2">
                        <div className="col-md-4 col-12">
                          <div className="d-flex align-items-start p-2 gap-2">
                            <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                              style={{
                                width: '3rem',
                                height: '3rem',
                                backgroundColor: '#E1F5FF',
                                aspectRatio: '1 / 1'
                              }}>
                              <FaUser />
                            </div>
                            <div className="d-flex flex-column align-items-start gap-2">
                              <span className="text-secondary offer-submit-sub-head text-start">Full Name</span>
                              <h6 className="text-start">{selected_groupage.receiver_name}</h6>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4 col-12">
                          <div className="d-flex align-items-start p-2 gap-2">
                            <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                              style={{
                                width: '3rem',
                                height: '3rem',
                                backgroundColor: '#E1F5FF',
                                aspectRatio: '1 / 1'
                              }}>
                              <IoCall />
                            </div>
                            <div className="d-flex flex-column align-items-start gap-2">
                              <span className="text-secondary offer-submit-sub-head text-start">Contact Number</span>
                              <h6>{selected_groupage.receiver_contact}</h6>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4 col-12">
                          <div className="d-flex align-items-start p-2 gap-2">
                            <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                              style={{
                                width: '3rem',
                                height: '3rem',
                                backgroundColor: '#E1F5FF',
                                aspectRatio: '1 / 1'
                              }}>
                              <MdAttachEmail />
                            </div>
                            <div className="d-flex flex-column align-items-start gap-2">
                              <span className="text-secondary offer-submit-sub-head text-start">Email Address</span>
                              <h6>{selected_groupage.receiver_email}</h6>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4 col-12">
                          <div className="d-flex align-items-start p-2 gap-2">
                            <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                              style={{
                                width: '3rem',
                                height: '3rem',
                                backgroundColor: '#E1F5FF',
                                aspectRatio: '1 / 1'
                              }}>
                              <FaFlag />
                            </div>
                            <div className="d-flex flex-column align-items-start gap-2">
                              <span className="text-secondary offer-submit-sub-head text-start">Country</span>
                              <h6>{selected_groupage.receiver_country}</h6>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4 col-12">
                          <div className="d-flex align-items-start p-2 gap-2">
                            <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                              style={{
                                width: '3rem',
                                height: '3rem',
                                backgroundColor: '#E1F5FF',
                                aspectRatio: '1 / 1'
                              }}>
                              <FaBuildingFlag />
                            </div>
                            <div className="d-flex flex-column align-items-start gap-2">
                              <span className="text-secondary offer-submit-sub-head text-start">State</span>
                              <h6>{selected_groupage.receiver_state}</h6>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4 col-12">
                          <div className="d-flex align-items-start p-2 gap-2">
                            <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                              style={{
                                width: '3rem',
                                height: '3rem',
                                backgroundColor: '#E1F5FF',
                                aspectRatio: '1 / 1'
                              }}>
                              <FaCity />
                            </div>
                            <div className="d-flex flex-column align-items-start gap-2">
                              <span className="text-secondary offer-submit-sub-head text-start">City</span>
                              <h6>{selected_groupage.receiver_city}</h6>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4 col-12">
                          <div className="d-flex align-items-start p-2 gap-2">
                            <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                              style={{
                                width: '3rem',
                                height: '3rem',
                                backgroundColor: '#E1F5FF',
                                aspectRatio: '1 / 1'
                              }}>
                              <FaMapPin />
                            </div>
                            <div className="d-flex flex-column align-items-start gap-2">
                              <span className="text-secondary offer-submit-sub-head text-start">Street Address</span>
                              <h6 className="text-start">{selected_groupage.receiver_address}</h6>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4 col-12">
                          <div className="d-flex align-items-start p-2 gap-2">
                            <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                              style={{
                                width: '3rem',
                                height: '3rem',
                                backgroundColor: '#E1F5FF',
                                aspectRatio: '1 / 1'
                              }}>
                              <MdConfirmationNumber />
                            </div>
                            <div className="d-flex flex-column align-items-start gap-2">
                              <span className="text-secondary offer-submit-sub-head text-start">Zip Code</span>
                              <h6 className="text-start">{selected_groupage.receiver_zipcode}</h6>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4 col-12">
                          <div className="d-flex align-items-start p-2 gap-2">
                            <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                              style={{
                                width: '3rem',
                                height: '3rem',
                                backgroundColor: '#E1F5FF',
                                aspectRatio: '1 / 1'
                              }}>
                              <FaCalendarCheck />
                            </div>
                            <div className="d-flex flex-column align-items-start gap-2">
                              <span className="text-secondary offer-submit-sub-head text-start">Preferred Delivery Date</span>
                              <h6 className="text-start">{selected_groupage.departure_date}</h6>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="d-flex align-items-start p-2 gap-2">
                            <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                              style={{
                                width: '3rem',
                                height: '3rem',
                                backgroundColor: '#E1F5FF',
                                aspectRatio: '1 / 1'
                              }}>
                              <FaInfoCircle />
                            </div>
                            <div className="d-flex flex-column align-items-start gap-2">
                              <span className="text-secondary offer-submit-sub-head text-start">Delivery Notes</span>
                              <p className="text-start"><h6>{selected_groupage.receiver_description}</h6></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </>
        )}

        {activeSection === 'payment_history' && (
          <>
            <div className="bg-light" style={{ width: '100%', maxWidth: isMobile ? "100%" : "85%", height: '100vh', overflow: 'auto' }}>
              {isMobile && (
                <div className="w-100 d-flex justify-content-start">
                  <Menu />
                </div>
              )}
              <div className="d-flex justify-content-end mt-2">
                <div className="border-start p-2 border-3 border-dark">
                  <Dropdown>
                    <Dropdown.Toggle className="fs-5 w-100 text-secondary" variant="light" id="dropdown-basic">
                      <FaUserTie /> <strong className="text-capitalize">{userInfo.name}</strong>
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="end">
                      <div className="d-flex flex-column justify-content-center align-items-center gap-2">
                        {/* <div className="text-capitalize">
                                  <strong>Role:</strong> {userInfo.role === 'Sadmin' ? 'Super Admin' : userInfo.role === 'admin' ? 'Admin' : 'User'}
                                </div>
                                <div>
                                  <strong>Email:</strong> {userInfo.email}
                                </div>
                                <button className="btn btn-secondary btn-sm">Edit Name</button>
                                <button className="btn btn-secondary btn-sm">Edit Password</button> */}
                        <button className="btn btn-sm btn-primary mt-1">Profile information</button>
                        <button className="btn btn-danger btn-sm mt-1" onClick={handel_logout}>Logout</button>
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>

              <div className="d-flex justify-content-start align-items-center mt-2 ps-3 rounded-1" >
                <div className="d-flex ps-4 w-100 justify-content-start">
                  <label className="fs-3"><strong>Payment History</strong></label>
                </div>
              </div>
              <div className="dashboard-wrapper-box">
                <div className="table-wrap">
                  <div className="table-responsive" style={{
                    width: "100%",
                    overflowX: "auto",
                    whiteSpace: "nowrap",
                  }}>
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col"><h6>Order Id</h6></th>
                          <th scope="col"><h6>Transaction Id</h6></th>
                          <th scope="col"><h6>Offer Id</h6></th>
                          <th scope="col"><h6>Amount ($)</h6></th>
                          <th scope="col"><h6>Status</h6></th>
                        </tr>
                      </thead>
                      {user_payment_history && user_payment_history.length > 0 ? (
                        <tbody>
                          {user_payment_history.map((item, index) => (
                            <tr key={index}>
                              <td className="text-secondary">{item.order_id}</td>
                              <td className="text-secondary">{item.transaction_id}</td>
                              <td className="text-secondary">{item.offer_id}</td>
                              <td className="text-secondary">{item.amount}</td>
                              <td className="text-secondary">{item.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      ) : (
                        <tbody>
                          <tr>
                            <td colSpan="6" className="text-center text-secondary">No Data</td>
                          </tr>
                        </tbody>
                      )}
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeSection === 'user_offers' && (
          <>
            <div className="bg-light" style={{ width: '100%', maxWidth: isMobile ? "100%" : "85%", height: '100vh', overflow: 'auto' }}>
              {isMobile && (
                <div className="w-100 d-flex justify-content-start">
                  <Menu />
                </div>
              )}
              <div className=" d-flex justify-content-end mt-2">
                <div className="border-start p-2 border-3 border-dark">
                  <Dropdown>
                    <Dropdown.Toggle className="fs-5 w-100 text-secondary" variant="light" id="dropdown-basic">
                      <FaUserTie /> <strong className="text-capitalize">{userInfo.name}</strong>
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="end">
                      <div className="d-flex flex-column justify-content-center align-items-center gap-2">
                        {/* <div className="text-capitalize">
                                  <strong>Role:</strong> {userInfo.role === 'Sadmin' ? 'Super Admin' : userInfo.role === 'admin' ? 'Admin' : 'User'}
                                </div>
                                <div>
                                  <strong>Email:</strong> {userInfo.email}
                                </div>
                                <button className="btn btn-secondary btn-sm">Edit Name</button>
                                <button className="btn btn-secondary btn-sm">Edit Password</button> */}
                        <button className="btn btn-sm btn-primary mt-1">Profile information</button>
                        <button className="btn btn-danger btn-sm mt-1" onClick={handel_logout}>Logout</button>
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>

              <div className="d-flex justify-content-start align-items-center mt-2 ps-3 rounded-1" >
                <div className="d-flex ps-4 w-100 justify-content-start">
                  <label className="fs-3"><strong>Offers List</strong></label>
                </div>
              </div>

              {userRole === 'admin' ? (
                <>
                  <div className="dashboard-wrapper-box">
                    <div className="table-wrap">

                      <div className="table-filter-wrap">
                        <div className="d-flex flex-column align-items-start justify-content-start ps-2 mb-3 w-100">
                          <h5>Filter By:</h5>
                          <div className="row w-100 g-2 mt-1 ">
                            <div className="col-12 col-md-6 col-lg-3">
                              <input
                                type="text"
                                placeholder="Search by product name or order id"
                                className="shipping-input-field"
                              />
                            </div>
                            <div className="col-12 col-md-6 col-lg-3">
                              <Countries_selector label="Pick Up Country" paddingcount='12px 18px' fontsizefont='15px' bgcolor='#ebebeb' bordercolor='1px solid #ebebeb' borderradiuscount='6px' />
                            </div>
                            <div className="col-12 col-md-6 col-lg-3">
                              <Countries_selector label="Destination Country" paddingcount='12px 18px' fontsizefont='15px' bgcolor='#ebebeb' bordercolor='1px solid #ebebeb' borderradiuscount='6px' />
                            </div>
                            <div className="col-12 col-md-6 col-lg-3 position-relative">
                              <input
                                type="text"
                                readOnly
                                className="shipping-input-field"
                                value={
                                  state[0].endDate
                                    ? `${format(state[0].startDate, "dd/MM/yyyy")} - ${format(state[0].endDate, "dd/MM/yyyy")}`
                                    : `${format(state[0].startDate, "dd/MM/yyyy")} - Select End Date`
                                }
                                onClick={() => setShowCalendar(!showCalendar)}
                                style={{ cursor: "pointer" }}
                              />
                              {showCalendar && (
                                <div
                                  className="position-absolute bg-white rounded shadow-sm p-2"
                                  style={{ top: "40px", zIndex: 1000 }}
                                >
                                  <DateRange
                                    editableDateInputs={true}
                                    onChange={(item) => setState([item.selection])}
                                    moveRangeOnFirstSelection={false}
                                    ranges={state}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="table-responsive" style={{
                        width: "100%",
                        overflowX: "auto",
                        whiteSpace: "nowrap",
                      }}>
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col"><h6>Order Id</h6></th>
                              <th scope="col"><h6>Product Name</h6></th>
                              <th scope="col"><h6>Offer From</h6></th>
                              <th scope="col"><h6>Price ($)</h6></th>
                              <th scope="col"><h6>Pick Up Date</h6></th>
                              <th scope="col"><h6>Offer Status</h6></th>
                            </tr>
                          </thead>
                          {admin_offer && admin_offer.length > 0 ? (
                            <tbody>
                              {admin_offer.map((item, index) => (
                                <tr key={index}>
                                  <td className="text-primary">#{item.offer_id}</td>
                                  <td className="text-secondary">{item.product_name}</td>
                                  <td className="text-secondary">{item.sender_name}</td>
                                  <td className="text-secondary">{item.amount}</td>
                                  <td className="text-secondary">{item.pickup_date}</td>
                                  <td className="text-secondary"><span className="px-3 py-2" style={item.status === 'pending' ? { fontWeight: '600', backgroundColor: ' #FFEF9D', color: '#9B8100' } : { fontWeight: '600', backgroundColor: ' #CBFFCF', color: '#006E09' }}>{item.status}</span></td>
                                </tr>
                              ))}
                            </tbody>
                          ) : (
                            <tbody>
                              <tr>
                                <td colSpan="6" className="text-center text-secondary">No Data</td>
                              </tr>
                            </tbody>
                          )}
                        </table>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="dashboard-wrapper-box">
                    <div className="table-wrap">

                      <div className="table-filter-wrap">
                        <div className="d-flex flex-column align-items-start justify-content-start ps-2 mb-3 w-100">
                          <h5>Filter By:</h5>
                          <div className="row w-100 g-2 mt-1 ">
                            <div className="col-12 col-md-6 col-lg-3">
                              <input
                                type="text"
                                placeholder="Search by product name or order id"
                                className="shipping-input-field"
                              />
                            </div>
                            <div className="col-12 col-md-6 col-lg-3">
                              <Countries_selector label="Pick Up Country" paddingcount='12px 18px' fontsizefont='15px' bgcolor='#ebebeb' bordercolor='1px solid #ebebeb' borderradiuscount='6px' />
                            </div>
                            <div className="col-12 col-md-6 col-lg-3">
                              <Countries_selector label="Destination Country" paddingcount='12px 18px' fontsizefont='15px' bgcolor='#ebebeb' bordercolor='1px solid #ebebeb' borderradiuscount='6px' />
                            </div>
                            <div className="col-12 col-md-6 col-lg-3 position-relative">
                              <input
                                type="text"
                                readOnly
                                className="shipping-input-field"
                                value={
                                  state[0].endDate
                                    ? `${format(state[0].startDate, "dd/MM/yyyy")} - ${format(state[0].endDate, "dd/MM/yyyy")}`
                                    : `${format(state[0].startDate, "dd/MM/yyyy")} - Select End Date`
                                }
                                onClick={() => setShowCalendar(!showCalendar)}
                                style={{ cursor: "pointer" }}
                              />
                              {showCalendar && (
                                <div
                                  className="position-absolute bg-white rounded shadow-sm p-2"
                                  style={{ top: "40px", zIndex: 1000 }}
                                >
                                  <DateRange
                                    editableDateInputs={true}
                                    onChange={(item) => setState([item.selection])}
                                    moveRangeOnFirstSelection={false}
                                    ranges={state}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="table-responsive" style={{
                        width: "100%",
                        overflowX: "auto",
                        whiteSpace: "nowrap",
                      }}>
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col"><h6>Order Id</h6></th>
                              <th scope="col"><h6>Product Name</h6></th>
                              <th scope="col"><h6>Offer From</h6></th>
                              <th scope="col"><h6>Price ($)</h6></th>
                              <th scope="col"><h6>Delivery Duration</h6></th>
                              <th scope="col"><h6>Actions</h6></th>
                            </tr>
                          </thead>
                          {offers && offers.length > 0 ? (
                            <tbody>
                              {offers.map((item, index) => (
                                <tr key={index}>
                                  <td className="text-primary">#{item.order_id}</td>
                                  <td className="text-secondary">{item.product_name}</td>
                                  <td className="text-secondary">XXXXX-XXX</td>
                                  <td className="text-secondary">{item.price}</td>
                                  <td className="text-secondary">{item.delivery_duration}</td>
                                  <td className="d-flex align-items-center justify-content-center w-100 gap-3">
                                    <button className="btn btn-sm text-light " style={{ backgroundColor: '#31b23c' }} onClick={() => handleShowOffer(item)}>
                                      Accept
                                    </button>
                                    <button className="btn btn-sm text-light" style={{ backgroundColor: '#c63d3d' }} onClick={() => handleDeleteoffer(item.offer_id)}>
                                      Reject
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          ) : (
                            <tbody>
                              <tr>
                                <td colSpan="6" className="text-center text-secondary">No Data</td>
                              </tr>
                            </tbody>
                          )}
                        </table>
                      </div>
                    </div>
                  </div>
                </>
              )}

            </div>
          </>
        )}

        {selected_offer && (
          <>
            <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                zIndex: 9999
              }}
            >
              <div className="bg-light rounded shadow p-4 position-relative border border-2 border-dark"
                style={{
                  width: '55%',
                  height: '90vh',
                  overflowY: 'auto'
                }}
              >
                <div className="d-flex flex-column justify-content-start align-items-start w-100">
                  <button className="btn btn-danger position-absolute top-0 end-0 m-2" onClick={() => setSelected_offer(null)}>
                    ✕
                  </button>

                  <strong className="fs-4">Offer Details</strong>

                  <h5 className="mt-3">Product Information</h5>
                  <div className="d-flex flex-column align-items-start justify-content-start mt-1 w-100 border-bottom pb-3 border-2 gap-2">
                    <div className=" d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Product ID : </span>
                      <span>{selected_offer.id}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Product Name : </span>
                      <span>{selected_offer.product_name}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Weight : </span>
                      <span>{selected_offer.p_weight}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Height :  </span>
                      <span>{selected_offer.p_height}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Length : </span>
                      <span>{selected_offer.p_length}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Width : </span>
                      <span>{selected_offer.p_width}</span>
                    </div>
                  </div>

                  <h5 className="mt-3">Company Information</h5>
                  <div className="d-flex flex-column align-items-start justify-content-start mt-1 w-100 border-bottom pb-3 border-2 gap-2">
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Company Name : </span>
                      <span>XXXX-XX</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Price Offered : </span>
                      <span className="fw-bold">${selected_offer.price}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Offer Received Date : </span>
                      <span>{selected_offer.created_at.split("T")[0]}</span>
                    </div>
                  </div>

                  <h5 className="mt-3">Pick Up Information</h5>
                  <div className="d-flex flex-column align-items-start justify-content-start mt-1 w-100 border-bottom pb-3 border-2 gap-2">
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Full Name : </span>
                      <span>{selected_offer.sender_name}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Contact Number : </span>
                      <span>{selected_offer.sender_contact}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Email ID : </span>
                      <span>{selected_offer.sender_email}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Country : </span>
                      <span>{selected_offer.sender_country}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">State : </span>
                      <span>{selected_offer.sender_state}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">City : </span>
                      <span>{selected_offer.sender_city}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Street Address : </span>
                      <span>{selected_offer.sender_address}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Zip Code : </span>
                      <span>{selected_offer.sender_zipcode}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Pick Up Date : </span>
                      <span>{selected_offer.pickup_date.includes('Select End Date') ? selected_offer.pickup_date.split(' - ')[0] : selected_offer.pickup_date}</span>
                    </div>
                  </div>

                  <h5 className="mt-3">Delivery Information</h5>
                  <div className="d-flex flex-column align-items-start justify-content-start mt-1 w-100 border-bottom pb-3 border-2 gap-2">
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Full Name : </span>
                      <span>{selected_offer.receiver_name}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Contact Number : </span>
                      <span>{selected_offer.receiver_contact}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Email ID : </span>
                      <span>{selected_offer.receiver_email}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Country : </span>
                      <span>{selected_offer.receiver_country}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">State : </span>
                      <span>{selected_offer.receiver_state}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">City : </span>
                      <span>{selected_offer.receiver_city}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Street Address : </span>
                      <span>{selected_offer.receiver_address}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Zip Code : </span>
                      <span>{selected_offer.receiver_zipcode}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Delivery Duration : </span>
                      <span>{duration_calculate(selected_offer.delivery_duration, selected_offer.pickup_date)}</span>
                    </div>
                  </div>

                  <div className="d-flex flex-column w-100 justify-content-center align-items-center">
                    <button className="btn btn-light border border-2 border-dark mt-3 w-100"><strong>Accept</strong> <br></br>
                      <Paypal_payment
                        selected_offer={selected_offer}
                        handleAcceptOffer={handleAcceptOffer}
                      />
                    </button>

                    <button className="btn btn-danger mt-3  w-100" onClick={() => handleDeleteoffer(selected_offer.offer_id)}>Reject</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeSection === "companies" && (
          <>
            <div className="bg-light px-3" style={{ width: '100%', maxWidth: isMobile ? "100%" : "85%", height: '100vh', overflow: 'auto' }}>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center w-100 p-2">
                {isMobile && (
                  <div className="w-100 d-flex justify-content-start">
                    <Menu />
                  </div>
                )}
                <div className="d-flex align-items-center justify-content-end w-100 mt-2 mt-md-0">
                  <div className="border-start p-2 border-3 border-dark">
                    <Dropdown>
                      <Dropdown.Toggle className="fs-5 w-100 text-secondary" variant="light" id="dropdown-basic">
                        <FaUserTie /> <strong className="text-capitalize">{userInfo.name}</strong>
                      </Dropdown.Toggle>
                      <Dropdown.Menu align="end">
                        <div className="d-flex flex-column justify-content-center align-items-center gap-2">
                          {/* <div className="text-capitalize">
                                  <strong>Role:</strong> {userInfo.role === 'Sadmin' ? 'Super Admin' : userInfo.role === 'admin' ? 'Admin' : 'User'}
                                </div>
                                <div>
                                  <strong>Email:</strong> {userInfo.email}
                                </div>
                                <button className="btn btn-secondary btn-sm">Edit Name</button>
                                <button className="btn btn-secondary btn-sm">Edit Password</button> */}
                          <button className="btn btn-sm btn-primary mt-1">Profile information</button>
                          <button className="btn btn-danger btn-sm mt-1" onClick={handel_logout}>Logout</button>
                        </div>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-start align-items-center mt-2 rounded-1">
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
                      <Countries_selector onSelectCountry={handleSelectCountry} label="Destination Countries" paddingcount='12px 18px' fontsizefont='15px' bgcolor='#ebebeb' bordercolor='1px solid #ebebeb' borderradiuscount='6px' />
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
                  <div className="d-flex flex-column justify-content-start align-items-start w-100">
                    <button className="btn btn-danger position-absolute top-0 end-0 m-2" onClick={() => setSelectedCompany(null)}>
                      ✕
                    </button>
                  </div>

                  <div className="d-flex ps-4 w-100 justify-content-start">
                    <label className="fs-3"><strong>Comapany Information</strong></label>
                  </div>
                  {selectedCompany && (
                    <>
                      <div className="row p-3 align-items-start">
                        <div className="col-12 col-md-3 d-flex justify-content-center">
                          <img src="/Images/webloon_logo.png" className="img-fluid rounded-circle" width="150px" />
                        </div>
                        <div className="col-12 col-md-5 text-center text-md-start mt-3 mt-md-0">
                          <h2>{selectedCompany.company_name}</h2>
                          <label className="d-flex align-items-center justify-content-center justify-content-md-start">
                            <IoStar className="text-warning fs-5" />
                            <span className="text-secondary"> 4.85</span>
                            <span className="text-primary"> (20 Reviews)</span>
                          </label>
                        </div>
                        {/* <div className="col-12 col-md-4 text-center text-md-end mt-3 mt-md-0">
                          <h3 className="text-primary"><RiPencilFill /> Edit Details</h3>
                        </div> */}
                      </div>

                      <div className="row mt-5 text-center text-md-start">
                        {[
                          { icon: <FaPhoneAlt />, label: 'Contact Number', value: selectedCompany.contect_no },
                          { icon: <MdEmail />, label: 'Email ID', value: selectedCompany.email },
                          { icon: <FaLocationDot />, label: 'Country', value: selectedCompany.location1.split(",")[0].trim() },
                        ].map((item, index) => (
                          <div key={index} className="col-12 col-md-4 d-flex align-items-center justify-content-center justify-content-md-start mb-3">
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
                              <h5 className="text-dark">{item.value}</h5>
                            </label>
                          </div>
                        ))}
                      </div>

                      <div className="row mt-4 text-center text-md-start">
                        {[
                          { icon: <FaCity />, label: 'State', value: selectedCompany.location1.split(",")[1].trim() },
                          { icon: <FaCity />, label: 'City', value: selectedCompany.location1.split(",")[2].trim() },
                          { icon: <FaLocationDot />, label: 'Shipping Countries', value: selectedCompany.tableData[0].countries, extra: <span className="text-primary" onClick={handleScrollToMore}> & more</span> },
                        ].map((item, index) => (
                          <div key={index} className="col-12 col-md-4 d-flex align-items-center justify-content-center justify-content-md-start mb-3">
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
                          </div>
                        ))}
                      </div>



                      <div className="d-flex flex-row align-items-between justify-contents-start w-100 gap-5 mt-3">
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
                      </div>

                      <div id="more" className="d-flex mt-3 pb-5 p-1 justify-content-center align-items-center mb-5">
                        <div className="border-top border-2" style={{ width: '85%' }}>
                          <table className="table">
                            <thead>
                              <tr>
                                <th scope="col"><h6>Transport Offered</h6></th>
                                <th scope="col"><h6>Destination Countries</h6></th>
                                <th scope="col"><h6>Delivery Duration</h6></th>
                              </tr>
                            </thead>
                            {selectedCompany.tableData ? (
                              <tbody>
                                {selectedCompany.tableData.map((item, index) => (
                                  <tr key={index}>
                                    <td className="text-secondary">{item.service_type}</td>
                                    <td className="text-secondary">{item.countries}</td>
                                    <td className="text-secondary">{item.duration}</td>
                                  </tr>
                                ))}
                              </tbody>
                            ) : (
                              <tbody>
                                <tr>
                                  <td colSpan='3' className="text-secondary text-center">No Data</td>
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



            )}
          </>
        )}

        {activeSection === "offers" && (
          <>
            <div className="bg-light" style={{ width: '100%', maxWidth: isMobile ? "100%" : "85%", height: '100vh', overflow: 'auto' }}>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center w-100 p-2">
                {isMobile && (
                  <div className="w-100 d-flex justify-content-start">
                    <Menu />
                  </div>
                )}
                <div className="d-flex align-items-center justify-content-end w-100 mt-2 mt-md-0">
                  <div className="border-start p-2 border-3 border-dark">
                    <Dropdown>
                      <Dropdown.Toggle className="fs-5 w-100 text-secondary" variant="light" id="dropdown-basic">
                        <FaUserTie /> <strong className="text-capitalize">{userInfo.name}</strong>
                      </Dropdown.Toggle>
                      <Dropdown.Menu align="end">
                        <div className="d-flex flex-column justify-content-center align-items-center gap-2">
                          {/* <div className="text-capitalize">
                                  <strong>Role:</strong> {userInfo.role === 'Sadmin' ? 'Super Admin' : userInfo.role === 'admin' ? 'Admin' : 'User'}
                                </div>
                                <div>
                                  <strong>Email:</strong> {userInfo.email}
                                </div>
                                <button className="btn btn-secondary btn-sm">Edit Name</button>
                                <button className="btn btn-secondary btn-sm">Edit Password</button> */}
                          <button className="btn btn-sm btn-primary mt-1">Profile information</button>
                          <button className="btn btn-danger btn-sm mt-1" onClick={handel_logout}>Logout</button>
                        </div>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-start align-items-center mt-2 rounded-1">
                <div className="d-flex ps-4 w-50 justify-content-start">
                  <label className="fs-3"><strong>Offers List</strong></label>
                </div>
              </div>

              <div className="dashboard-wrapper-box">
                <div className="table-wrap">
                  <div className="table-filter-wrap">
                    <div className="d-flex flex-column align-items-start justify-content-start ps-2 mb-3 w-100">
                      <h5>Filter By:</h5>
                      <div className="row w-100 g-2 mt-1 ">
                        <div className="col-12 col-md-6 col-lg-3">
                          <input type="text" className="shipping-input-field" placeholder="Search here..." />
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                          <Countries_selector label="Pick Up Country" paddingcount='12px 18px' fontsizefont='15px' bgcolor='#ebebeb' bordercolor='1px solid #ebebeb' borderradiuscount='6px' />
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                          <Countries_selector label="Destination Country" paddingcount='12px 18px' fontsizefont='15px' bgcolor='#ebebeb' bordercolor='1px solid #ebebeb' borderradiuscount='6px' />
                        </div>
                        <div className="col-12 col-md-6 col-lg-3 position-relative">
                          <input type="date" className="shipping-input-field" placeholder="Pick up date" />
                        </div>
                      </div>
                    </div>



                    <div className="table-responsive w-100">



                      {/* <table ref={tableRef} className="display">
                    <thead>
                      <tr>
                        <th>Order Id</th>
                        <th>Product Name</th>
                        <th>Offer Created By</th>
                        <th>Price ($)</th>
                        <th>Offer Received By</th>
                        <th>Payment Status ($)</th>
                      </tr>
                    </thead>
                  </table> */}

                      {/* <DataTable data={tableRef} ref={tableRef} className="display">
                    <thead>
                      <tr>
                        <th>Order Id</th>
                        <th>Product Name</th>
                        <th>Offer Created By</th>
                        <th>Price ($)</th>
                        <th>Offer Received By</th>
                        <th>Payment Status ($)</th>
                      </tr>
                    </thead>
                  </DataTable> */} <table className="table">
                        <thead>
                          <tr>
                            <th scope="col"><h6>Order Id</h6></th>
                            <th scope="col"><h6>Product Name</h6></th>
                            <th scope="col"><h6>Offer Created By</h6></th>
                            <th scope="col"><h6>Price ($)</h6></th>
                            <th scope="col"><h6>Offer Received By</h6></th>
                            <th scope="col"><h6>Payment Status ($)</h6></th>
                          </tr>
                        </thead>
                        <tbody>
                          {allOffers && allOffers.length > 0 ? (
                            allOffers.map((item, index) => (
                              <tr key={index}>
                                <td className="text-primary" style={{ cursor: 'pointer' }} onClick={() => show_offer_details(item)}>#{item.offer_id}</td>
                                <td className="text-secondary">{item.product_name}</td>
                                <td className="text-secondary">{item.created_by}</td>
                                <td className="text-dark"><b>{item.amount}</b></td>
                                <td className="text-secondary">{item.created_by_email}</td>
                                <td className="text-secondary">
                                  <span
                                    className={`p-2 pe-4 ps-4 fw-bold ${item.status === 'pending' ? 'text-warning' : 'text-success'}`}
                                    style={{ backgroundColor: item.status === 'pending' ? 'rgb(255, 242, 128)' : 'rgb(145, 255, 128)' }}
                                  >
                                    {item.status === 'pending' ? 'Pending' : 'Success'}
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="text-center text-secondary">No Data Available</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </>
        )}

        {showOfferDetails && (
          <>

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
                <div className="d-flex flex-column justify-content-start align-items-start w-100">
                  <button className="btn btn-danger position-absolute top-0 end-0 m-2" onClick={() => setShowOfferDetails(null)}>
                    ✕
                  </button>
                  <div className="d-flex justify-content-start align-items-center mt-2 ps-3 rounded-1" >
                    <div className="d-flex ps-4 w-100 justify-content-start">
                      <label className="fs-3"><strong>Offer Details</strong></label>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-row justify-content-start align-items-center">
                  <div className="m-2 border border-1 border-secondary rounded-1" style={{ width: '10%' }}>
                    <img src={showOfferDetails.img01} alt="product image" style={{ width: '100%', height: '100%' }} />
                  </div>
                  <div className="ms-5 d-flex flex-column align-items-start justify-content-start">
                    <strong className="fs-4">{showOfferDetails.product_name}</strong>
                    <span className="text-secondary">Offer ID: #{showOfferDetails.offer_id}</span>
                  </div>
                </div>

                <div className="offer-details-wrap">
                  <h5 className="text-start w-100 mb-3" >Payment Information</h5>
                  {[
                    [
                      { icon: <SiAnytype />, label: "Amount Received", value: "Testing" },
                      { icon: <FaWeightScale />, label: "Commission Earned", value: "Testing" },
                      { icon: <RiExpandHeightFill />, label: "Payment Status", value: "Testing" }
                    ],
                    [
                      { icon: <SiAnytype />, label: "Paid By", value: "Testing" },
                      { icon: <FaWeightScale />, label: "Paypal ID", value: "Testing" },
                      { icon: <RiExpandHeightFill />, label: "Offers Received", value: "Testing" }
                    ],
                    [
                      { icon: <SiAnytype />, label: "Company Name", value: "Testing" },
                      { icon: <FaWeightScale />, label: "Contact Number", value: "Testing" },
                      { icon: <RiExpandHeightFill />, label: "Company Email ID", value: "Testing" }
                    ]
                  ].map((row, index) => (
                    <div key={index} className="d-flex flex-wrap w-100 gap-3 gap-lg-5">
                      {row.map((item, idx) => (
                        <div key={idx} className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '30%' }}>
                          <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                            style={{
                              width: '3rem',
                              height: '3rem',
                              backgroundColor: '#E1F5FF',
                              aspectRatio: '1 / 1'
                            }}>
                            {item.icon}
                          </div>
                          <div className="d-flex flex-column align-items-start gap-2">
                            <span className="text-secondary">{item.label}</span>
                            <h6>{item.value}</h6>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="offer-details-wrap">

                  <h5 className="text-start w-100 mb-3">Product Information</h5>

                  <div className="d-flex flex-wrap w-100 gap-3 gap-lg-5 ">
                    {[
                      { icon: <SiAnytype />, label: "Product Type", value: showOfferDetails.product_type },
                      { icon: <FaWeightScale />, label: "Weight", value: `${showOfferDetails.p_weight} Kg` },
                      { icon: <RiExpandHeightFill />, label: "Height", value: `${showOfferDetails.p_height} Cm` }
                    ].map((item, idx) => (
                      <div key={idx} className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '30%' }}>
                        <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                          style={{
                            width: '3rem',
                            height: '3rem',
                            backgroundColor: '#E1F5FF',
                            aspectRatio: '1 / 1'
                          }}>
                          {item.icon}
                        </div>
                        <div className="d-flex flex-column align-items-start gap-2">
                          <span className="text-secondary">{item.label}</span>
                          <h6>{item.value}</h6>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="d-flex flex-wrap w-100 gap-3 gap-lg-5 mt-3">
                    {[
                      { icon: <FaRuler />, label: "Length", value: `${showOfferDetails.p_length} Cm` },
                      { icon: <RiExpandWidthFill />, label: "Width", value: `${showOfferDetails.p_width} Cm` }
                    ].map((item, idx) => (
                      <div key={idx} className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '30%' }}>
                        <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                          style={{
                            width: '3rem',
                            height: '3rem',
                            backgroundColor: '#E1F5FF',
                            aspectRatio: '1 / 1'
                          }}>
                          {item.icon}
                        </div>
                        <div className="d-flex flex-column align-items-start gap-2">
                          <span className="text-secondary">{item.label}</span>
                          <h6>{item.value}</h6>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

                <div className="offer-details-wrap">
                  <h5 className="text-start w-100 mb-3">Pick Up Information</h5>
                  <div className="d-flex flex-row flex-wrap flex-md-nowrap align-items-between justify-content-start w-100 gap-5">
                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '30%' }}>
                      <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                        style={{
                          width: '3rem',
                          height: '3rem',
                          backgroundColor: '#E1F5FF',
                          aspectRatio: '1 / 1'
                        }}>
                        <FaUser />
                      </div>
                      <div className="d-flex flex-column align-items-start gap-2">
                        <span className="text-secondary">Full Name</span>
                        <h6>{showOfferDetails.sender_name}</h6>
                      </div>
                    </div>

                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '30%' }}>
                      <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                        style={{
                          width: '3rem',
                          height: '3rem',
                          backgroundColor: '#E1F5FF',
                          aspectRatio: '1 / 1'
                        }}>
                        <IoCall />
                      </div>
                      <div className="d-flex flex-column align-items-start gap-2">
                        <span className="text-secondary">Contact Number</span>
                        <h6>{showOfferDetails.sender_contact}</h6>
                      </div>
                    </div>

                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '30%' }}>
                      <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                        style={{
                          width: '3rem',
                          height: '3rem',
                          backgroundColor: '#E1F5FF',
                          aspectRatio: '1 / 1'
                        }}>
                        <MdAttachEmail />
                      </div>
                      <div className="d-flex flex-column align-items-start gap-2">
                        <span className="text-secondary">Email Address</span>
                        <h6>{showOfferDetails.sender_email}</h6>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex flex-row flex-wrap flex-md-nowrap align-items-start justify-content-start w-100 gap-5 mt-3">
                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '30%' }}>
                      <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                        style={{
                          width: '3rem',
                          height: '3rem',
                          backgroundColor: '#E1F5FF',
                          aspectRatio: '1 / 1'
                        }}>
                        <FaFlag />
                      </div>
                      <div className="d-flex flex-column align-items-start gap-2">
                        <span className="text-secondary">Country</span>
                        <h6>{showOfferDetails.sender_country}</h6>
                      </div>
                    </div>

                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '30%' }}>
                      <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                        style={{
                          width: '3rem',
                          height: '3rem',
                          backgroundColor: '#E1F5FF',
                          aspectRatio: '1 / 1'
                        }}>
                        <FaBuildingFlag />
                      </div>
                      <div className="d-flex flex-column align-items-start gap-2">
                        <span className="text-secondary">State</span>
                        <h6>{showOfferDetails.sender_state}</h6>
                      </div>
                    </div>

                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '30%' }}>
                      <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                        style={{
                          width: '3rem',
                          height: '3rem',
                          backgroundColor: '#E1F5FF',
                          aspectRatio: '1 / 1'
                        }}>
                        <FaCity />
                      </div>
                      <div className="d-flex flex-column align-items-start gap-2">
                        <span className="text-secondary">City</span>
                        <h6>{showOfferDetails.sender_city}</h6>
                      </div>
                    </div>
                  </div>


                  <div className="d-flex flex-row flex-wrap flex-md-nowrap align-items-start justify-content-start w-100 gap-5 mt-3">
                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '30%' }}>
                      <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                        style={{
                          width: '3rem',
                          height: '3rem',
                          backgroundColor: '#E1F5FF',
                          aspectRatio: '1 / 1'
                        }}>
                        <FaMapPin />
                      </div>
                      <div className="d-flex flex-column align-items-start gap-2">
                        <span className="text-secondary">Street Address</span>
                        <h6>{showOfferDetails.sender_address}</h6>
                      </div>
                    </div>

                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '30%' }}>
                      <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                        style={{
                          width: '3rem',
                          height: '3rem',
                          backgroundColor: '#E1F5FF',
                          aspectRatio: '1 / 1'
                        }}>
                        <MdConfirmationNumber />
                      </div>
                      <div className="d-flex flex-column align-items-start gap-2">
                        <span className="text-secondary">Zip Code</span>
                        <h6>{showOfferDetails.sender_zipcode}</h6>
                      </div>
                    </div>

                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '30%' }}>
                      <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                        style={{
                          width: '3rem',
                          height: '3rem',
                          backgroundColor: '#E1F5FF',
                          aspectRatio: '1 / 1'
                        }}>
                        <FaCalendarCheck />
                      </div>
                      <div className="d-flex flex-column align-items-start gap-2">
                        <span className="text-secondary">Pick Up Date</span>
                        <h6>{showOfferDetails.pickup_date.includes('Select End Date') ? `${showOfferDetails.pickup_date.split(' - ')[0]} -` : showOfferDetails.pickup_date}</h6>
                      </div>
                    </div>
                  </div>


                  <div className="d-flex flex-row align-items-between justify-contents-start w-100 gap-5 mt-3">
                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-3" style={{ width: '100%' }}>
                      <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary" style={{
                        width: '3rem',
                        height: '3rem',
                        backgroundColor: '#E1F5FF',
                        aspectRatio: '1 / 1'
                      }}><FaInfoCircle /></div>
                      <div className="d-flex flex-column align-items-start">
                        <span className="text-secondary">Pick Up Notes</span>
                        <p className="text-start"><h6>{showOfferDetails.sender_description}</h6></p>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="offer-details-wrap">

                  <h5 className="text-start w-100 mb-3">Delivery Information</h5>
                  <div className="d-flex flex-row flex-wrap flex-md-nowrap align-items-start justify-content-start w-100 gap-5">
                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '30%' }}>
                      <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                        style={{
                          width: '3rem',
                          height: '3rem',
                          backgroundColor: '#E1F5FF',
                          aspectRatio: '1 / 1'
                        }}>
                        <FaUser />
                      </div>
                      <div className="d-flex flex-column align-items-start gap-2">
                        <span className="text-secondary">Full Name</span>
                        <h6>{showOfferDetails.receiver_name}</h6>
                      </div>
                    </div>

                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '30%' }}>
                      <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                        style={{
                          width: '3rem',
                          height: '3rem',
                          backgroundColor: '#E1F5FF',
                          aspectRatio: '1 / 1'
                        }}>
                        <IoCall />
                      </div>
                      <div className="d-flex flex-column align-items-start gap-2">
                        <span className="text-secondary">Contact Number</span>
                        <h6>{showOfferDetails.receiver_contact}</h6>
                      </div>
                    </div>

                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '30%' }}>
                      <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                        style={{
                          width: '3rem',
                          height: '3rem',
                          backgroundColor: '#E1F5FF',
                          aspectRatio: '1 / 1'
                        }}>
                        <MdAttachEmail />
                      </div>
                      <div className="d-flex flex-column align-items-start gap-2">
                        <span className="text-secondary">Email Address</span>
                        <h6>{showOfferDetails.receiver_email}</h6>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex flex-row flex-wrap flex-md-nowrap align-items-start justify-content-start w-100 gap-5 mt-3">
                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '30%' }}>
                      <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                        style={{
                          width: '3rem',
                          height: '3rem',
                          backgroundColor: '#E1F5FF',
                          aspectRatio: '1 / 1'
                        }}>
                        <FaFlag />
                      </div>
                      <div className="d-flex flex-column align-items-start gap-2">
                        <span className="text-secondary">Country</span>
                        <h6>{showOfferDetails.receiver_country}</h6>
                      </div>
                    </div>

                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '30%' }}>
                      <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                        style={{
                          width: '3rem',
                          height: '3rem',
                          backgroundColor: '#E1F5FF',
                          aspectRatio: '1 / 1'
                        }}>
                        <FaBuildingFlag />
                      </div>
                      <div className="d-flex flex-column align-items-start gap-2">
                        <span className="text-secondary">State</span>
                        <h6>{showOfferDetails.receiver_state}</h6>
                      </div>
                    </div>

                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '30%' }}>
                      <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                        style={{
                          width: '3rem',
                          height: '3rem',
                          backgroundColor: '#E1F5FF',
                          aspectRatio: '1 / 1'
                        }}>
                        <FaCity />
                      </div>
                      <div className="d-flex flex-column align-items-start gap-2">
                        <span className="text-secondary">City</span>
                        <h6>{showOfferDetails.receiver_city}</h6>
                      </div>
                    </div>
                  </div>


                  <div className="d-flex flex-row flex-wrap flex-md-nowrap align-items-start justify-content-start w-100 gap-5 mt-3">
                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '30%' }}>
                      <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                        style={{
                          width: '3rem',
                          height: '3rem',
                          backgroundColor: '#E1F5FF',
                          aspectRatio: '1 / 1'
                        }}>
                        <FaMapPin />
                      </div>
                      <div className="d-flex flex-column align-items-start gap-2">
                        <span className="text-secondary">Street Address</span>
                        <h6>{showOfferDetails.receiver_address}</h6>
                      </div>
                    </div>

                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '30%' }}>
                      <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                        style={{
                          width: '3rem',
                          height: '3rem',
                          backgroundColor: '#E1F5FF',
                          aspectRatio: '1 / 1'
                        }}>
                        <MdConfirmationNumber />
                      </div>
                      <div className="d-flex flex-column align-items-start gap-2">
                        <span className="text-secondary">Zip Code</span>
                        <h6>{showOfferDetails.receiver_zipcode}</h6>
                      </div>
                    </div>

                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '30%' }}>
                      <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                        style={{
                          width: '3rem',
                          height: '3rem',
                          backgroundColor: '#E1F5FF',
                          aspectRatio: '1 / 1'
                        }}>
                        <FaCalendarCheck />
                      </div>
                      <div className="d-flex flex-column align-items-start gap-2">
                        <span className="text-secondary">Preferred Delivery Date</span>
                        <h6>{showOfferDetails.departure_date}</h6>
                      </div>
                    </div>
                  </div>


                  <div className="d-flex flex-row flex-wrap align-items-start justify-content-start w-100 gap-5 mt-3">
                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2" style={{ width: '100%' }}>
                      <div className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                        style={{
                          width: '3rem',
                          height: '3rem',
                          backgroundColor: '#E1F5FF',
                          aspectRatio: '1 / 1'
                        }}>
                        <FaInfoCircle />
                      </div>
                      <div className="d-flex flex-column align-items-start gap-2">
                        <span className="text-secondary">Delivery Notes</span>
                        <h6 className="text-start">{showOfferDetails.receiver_description}</h6>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </>
        )}

        {activeSection === "payments" && (
          <>
            <div className="bg-light" style={{ width: '100%', maxWidth: isMobile ? "100%" : "85%", height: '100vh', overflow: 'auto' }}>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center w-100 p-2">
                {isMobile && (
                  <div className="w-100 d-flex justify-content-start">
                    <Menu />
                  </div>
                )}
                <div className="d-flex align-items-center justify-content-end w-100 mt-2 mt-md-0">
                  <div className="border-start p-2 border-3 border-dark">
                    <Dropdown>
                      <Dropdown.Toggle className="fs-5 w-100 text-secondary" variant="light" id="dropdown-basic">
                        <FaUserTie /> <strong className="text-capitalize">{userInfo.name}</strong>
                      </Dropdown.Toggle>
                      <Dropdown.Menu align="end">
                        <div className="d-flex flex-column justify-content-center align-items-center gap-2">
                          {/* <div className="text-capitalize">
                                  <strong>Role:</strong> {userInfo.role === 'Sadmin' ? 'Super Admin' : userInfo.role === 'admin' ? 'Admin' : 'User'}
                                </div>
                                <div>
                                  <strong>Email:</strong> {userInfo.email}
                                </div>
                                <button className="btn btn-secondary btn-sm">Edit Name</button>
                                <button className="btn btn-secondary btn-sm">Edit Password</button> */}
                          <button className="btn btn-sm btn-primary mt-1">Profile information</button>
                          <button className="btn btn-danger btn-sm mt-1" onClick={handel_logout}>Logout</button>
                        </div>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-start align-items-center mt-2 ps-3 rounded-1" >
                <div className="d-flex ps-4 w-100 justify-content-start">
                  <label className="fs-3"><strong>Payment History</strong></label>
                </div>
              </div>
              <div className="dashboard-wrapper-box">
                <div className="table-wrap">
                  <div className="table-responsive" style={{
                    width: "100%",
                    overflowX: "auto",
                    whiteSpace: "nowrap",
                  }}>
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col"><h6>Order Id</h6></th>
                          <th scope="col"><h6>Transaction Id</h6></th>
                          <th scope="col"><h6>Offer Id</h6></th>
                          <th scope="col"><h6>Amount ($)</h6></th>
                          <th scope="col"><h6>Status</h6></th>
                        </tr>
                      </thead>
                      {S_admin_payment && S_admin_payment.length > 0 ? (
                        <tbody>
                          {S_admin_payment.map((item, index) => (
                            <tr key={index}>
                              <td className="text-secondary">{item.order_id}</td>
                              <td className="text-secondary">{item.transaction_id}</td>
                              <td className="text-secondary">{item.offer_id}</td>
                              <td className="text-secondary">{item.amount}</td>
                              <td className="text-secondary">{item.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      ) : (
                        <tbody>
                          <tr>
                            <td colSpan="6" className="text-center text-secondary">No Data</td>
                          </tr>
                        </tbody>
                      )}
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeSection === "notification" && (
          <>
            {/* <div className="bg-light" style={{ width: '100%', maxWidth: isMobile ? "100%" : "85%", height: '100vh', overflow: 'auto' }}>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center w-100 p-2">
                {isMobile && (
                  <div className="w-100 d-flex justify-content-start">
                    <Menu />
                  </div>
                )}
                <div className="d-flex align-items-center justify-content-end w-100 mt-2 mt-md-0">
                  <div className="border-start p-2 border-3 border-dark">
                    <Dropdown>
                      <Dropdown.Toggle className="fs-5 w-100 text-secondary" variant="light" id="dropdown-basic">
                        <FaUserTie /> <strong className="text-capitalize">{userInfo.name}</strong>
                      </Dropdown.Toggle>
                      <Dropdown.Menu align="end">
                        <div className="d-flex flex-column justify-content-center align-items-center gap-2 p-2">
                          <div className="text-capitalize">
                            <strong>Role:</strong> {userInfo.role === 'Sadmin' ? 'Super Admin' : userInfo.role === 'admin' ? 'Admin' : 'User'}
                          </div>
                          <div>
                            <strong>Email:</strong> {userInfo.email}
                          </div>
                          <button className="btn btn-secondary btn-sm">Edit Name</button>
                          <button className="btn btn-secondary btn-sm">Edit Password</button>
                          <button className="btn btn-danger btn-sm mt-1" onClick={handel_logout}>Logout</button>
                        </div>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-start align-items-center mt-2 rounded-1">
                <div className="d-flex ps-4 w-50 justify-content-start">
                  <label className="fs-3"><strong>Notification</strong></label>
                </div>
              </div>

              <div className="d-flex mt-4 p-3 flex-column justify-content-start align-items-start m-5 rounded-1" style={{ boxShadow: '0 0 5px 2px rgba(0, 0, 0, 0.5)' }}>
                <div className="d-flex flex-column align-items-start justify-content-start mt-2 p-2 w-100">

                  {userRole === 'admin' ? (
                    <>
                      <strong>New Offers</strong>
                      {admin_notification && (
                        <>
                          <div className="d-flex flex-column align-items-start justify-content-start">
                            {admin_notification.map((item, index) => (
                              <div className="d-flex flex-row align-items-start w-100 justify-content-start mt-3 mb-3">
                                <div
                                  className="rounded-circle border border-1 border-secondary d-flex align-items-center justify-content-center overflow-hidden"
                                  style={{ width: '3.5rem', height: '3.5rem' }}
                                >
                                  <img
                                    src={item.img01}
                                    alt="Item"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                </div>
                                <div className="ps-3 flex-grow-1">
                                  <p className="mb-0 text-start">
                                    A new product name <strong>{item.product_name}</strong> has been added for groupage
                                    <br />
                                    <span className="text-secondary">{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</span>
                                  </p>
                                </div>
                                <div className="text-primary">
                                  <span onClick={() => navigate('/offers')}>See Details</span>
                                </div>
                              </div>
                            ))}
                          </div>

                        </>
                      )}
                    </>
                  ) : userRole === 'Sadmin' ? (
                    <>
                      <strong>New Groupage Created</strong>
                      {notification_groupageData && (
                        <>
                          <div className="d-flex flex-column align-items-start justify-content-start">
                            {notification_groupageData.map((item, index) => (
                              <div className="d-flex flex-row align-items-start w-100 justify-content-start mt-3 mb-3">
                                <div
                                  className="rounded-circle border border-1 border-secondary d-flex align-items-center justify-content-center overflow-hidden"
                                  style={{ width: '3.5rem', height: '3.5rem' }}
                                >
                                  <img
                                    src={item.img01}
                                    alt="Item"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                </div>
                                <div className="ps-3 flex-grow-1">
                                  <p className="mb-0 text-start">
                                    A new product name <strong>{item.product_name}</strong> has been added for groupage
                                    <br />
                                    <span className="text-secondary">{formatDistanceToNow(new Date(item.groupage_created_at), { addSuffix: true })}</span>
                                  </p>
                                </div>
                                <div className="text-primary">
                                  <span onClick={() => navigate('/offers')}>See Details</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                      <strong>New Companies Regestered</strong>
                      {notification_companyData && (
                        <>
                          <div className="d-flex flex-column align-items-start justify-content-start">
                            {notification_companyData.map((item, index) => (
                              <div className="d-flex flex-row align-items-start w-100 justify-content-start mt-3 mb-3" key={index}>
                                <div
                                  className="rounded-circle border border-1 border-secondary d-flex align-items-center justify-content-center overflow-hidden"
                                  style={{ width: '3.5rem', height: '3.5rem' }}
                                >
                                  <img
                                    src={item.comapny_info_logo}
                                    alt="Logo"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                </div>
                                <div className="ps-3 flex-grow-1">
                                  <p className="mb-0 text-start">
                                    A new company name <strong>{item.company_info_name}</strong> has been regestered
                                  </p>
                                </div>
                                <div className="text-primary">
                                  <span onClick={() => navigate('/companies_list')}>See Details</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {user_notification && (
                        <>
                          <div className="d-flex flex-column align-items-start justify-content-start w-100">
                            {user_notification.map((item, index) => (
                              <div className="d-flex flex-row align-items-start w-100 justify-content-start mt-3 mb-3">
                                <div
                                  className="rounded-circle border border-1 border-secondary d-flex align-items-center justify-content-center overflow-hidden"
                                  style={{ width: '3.5rem', height: '3.5rem' }}
                                >
                                  <img
                                    src={item.logo}
                                    alt="logo"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                </div>
                                <div className="ps-3 flex-grow-1">
                                  <p className="mb-0 text-start">
                                    A new company name <strong>{item.company_name}</strong> has been added
                                  </p>
                                </div>
                                <div className="text-primary">
                                  <span onClick={() => navigate('/companies_list')}>See Details</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  )}

                </div>
              </div>
            </div> */}
          </>
        )}

        {activeSection === "users" && (
          <>
            <div className="bg-light" style={{ width: '100%', maxWidth: isMobile ? "100%" : "85%", height: '100vh', overflow: 'auto' }}>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center w-100 p-2">
                {isMobile && (
                  <div className="w-100 d-flex justify-content-start">
                    <Menu />
                  </div>
                )}
                <div className="d-flex align-items-center justify-content-end w-100 mt-2 mt-md-0">
                  <div className="border-start p-2 border-3 border-dark">
                    <Dropdown>
                      <Dropdown.Toggle className="fs-5 w-100 text-secondary" variant="light" id="dropdown-basic">
                        <FaUserTie /> <strong className="text-capitalize">{userInfo.name}</strong>
                      </Dropdown.Toggle>
                      <Dropdown.Menu align="end">
                        <div className="d-flex flex-column justify-content-center align-items-center gap-2">
                          {/* <div className="text-capitalize">
                                  <strong>Role:</strong> {userInfo.role === 'Sadmin' ? 'Super Admin' : userInfo.role === 'admin' ? 'Admin' : 'User'}
                                </div>
                                <div>
                                  <strong>Email:</strong> {userInfo.email}
                                </div>
                                <button className="btn btn-secondary btn-sm">Edit Name</button>
                                <button className="btn btn-secondary btn-sm">Edit Password</button> */}
                          <button className="btn btn-sm btn-primary mt-1">Profile information</button>
                          <button className="btn btn-danger btn-sm mt-1" onClick={handel_logout}>Logout</button>
                        </div>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-wrap justify-content-between align-items-center mt-2 rounded-1">
                <div className="d-flex ps-4 w-100 w-md-50 justify-content-start">
                  <label className="fs-3"><strong>Roles & Permissions</strong></label>
                </div>
                <div className="w-100 w-md-50 pe-3 d-flex justify-content-start justify-content-md-end mt-2 mt-md-0">
                  {/* <button className="btn btn-primary btn-sm text-light fs-5 ps-3 pe-3"
                    onClick={() => setShowRegisterPopup(true)}>
                    <IoIosAddCircleOutline /> Add New Role
                  </button> */}
                </div>
              </div>


              <div className="d-flex mt-4 p-3 flex-column justify-content-start align-items-start m-5 rounded-1"
                style={{ boxShadow: '0 0 5px 2px rgba(0, 0, 0, 0.5)' }}>

                <div className="table-responsive" style={{ width: '100%', overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col"><h6>Name</h6></th>
                        <th scope="col"><h6>Email ID</h6></th>
                        <th scope="col"><h6>Role</h6></th>
                        <th scope="col"><h6>Actions</h6></th>
                      </tr>
                    </thead>
                    {userData ? (
                      <tbody>
                        {userData.map((item, index) => (
                          <tr key={index}>
                            <td className="text-secondary">{item.name}</td>
                            <td className="text-secondary">{item.email}</td>
                            <td className="text-secondary">
                              {item.role === 'Sadmin' ? 'Super Admin' : item.role === 'admin' ? 'Admin' : 'User'}
                            </td>
                            <td className="text-secondary">
                              <button className="btn btn-sm btn-light text-primary pt-0 pb-0"
                                onClick={() => handleEditUser(item)}
                                style={{ fontSize: '1.5rem' }}>
                                <RiPencilFill />
                              </button>
                              <button className="btn btn-sm btn-light text-danger pt-0 pb-0"
                                onClick={() => handleDeleteUser(item)}
                                style={{ fontSize: '1.5rem' }}>
                                <MdDelete />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    ) : (
                      <tbody>
                        <tr>
                          <td colSpan="4" className="text-secondary">No Data</td>
                        </tr>
                      </tbody>
                    )}
                  </table>
                </div>
              </div>
            </div>

            {updateUser && (
              <div
                className="position-fixed bg-light p-4 shadow rounded text-center"
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
                <div className="d-flex flex-wrap justify-content-center gap-3">
                  <button className="fs-5 fw-bold btn btn-dark p-2" onClick={() => ChangeUserRole(updateUser.id, 'Sadmin')}>
                    Super Admin
                  </button>
                  <button className="fs-5 fw-bold btn btn-dark p-2" onClick={() => ChangeUserRole(updateUser.id, 'admin')}>
                    Admin
                  </button>
                  <button className="fs-5 fw-bold btn btn-dark p-2" onClick={() => ChangeUserRole(updateUser.id, 'user')}>
                    User
                  </button>
                </div>
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
    </div >
  );
};

export default Dashboard;