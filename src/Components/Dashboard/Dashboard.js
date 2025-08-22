import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import { MdDashboard, MdPayment, MdEmail, MdDelete, MdAttachEmail, MdConfirmationNumber, MdKeyboardDoubleArrowDown, MdSwitchAccount, MdAlternateEmail, MdOutlineKey, MdFileDownload, MdPermContactCalendar, MdOutlineDateRange } from "react-icons/md";
import { FaUsers, FaUserGear, FaWeightScale, FaUserTie, FaLocationDot, FaCity, FaBuildingFlag, FaSackDollar } from "react-icons/fa6";
import Dropdown from 'react-bootstrap/Dropdown';
import { FaPhoneAlt, FaBoxOpen, FaEye, FaTruckLoading, FaRuler, FaUser, FaFlag, FaMapPin, FaCalendarCheck, FaInfoCircle, FaPaypal, FaUserCheck, FaPassport, FaBuilding, FaUserAlt, FaRegCheckCircle } from "react-icons/fa";
import { PiContactlessPaymentFill, PiHandCoinsBold, PiShippingContainerDuotone } from "react-icons/pi";
import { BsCarFrontFill, BsBuildingsFill, BsBank2, BsBuildingFillCheck } from "react-icons/bs";
import { IoIosMailOpen, IoMdDocument } from "react-icons/io";
import CountriesSelector from "./Countries_selector";
import { IoStar, IoCall } from "react-icons/io5";
import { RiPencilFill, RiSecurePaymentFill, RiExpandHeightFill, RiExpandWidthFill, RiContactsBook3Fill } from "react-icons/ri";
import { SiAnytype } from "react-icons/si";
import { DateRange } from 'react-date-range';
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";
import PaypalPayment from "./Paypal_payment";
import { useAlert } from "../alert/Alert_message";
import ConfirmationModal from '../alert/Conform_alert';
import { GoPencil } from "react-icons/go";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
// import PayPalButton from "./Paypal_0222";
import { AiFillDelete } from "react-icons/ai";
import Region_selector from "./Region_selector";
import Region_countries_selector from "./Region_country_selector";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { LuCircleX } from "react-icons/lu";


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

const Dashboard = () => {
  const port = process.env.REACT_APP_SECRET;
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const [userInfo, setUserInfo] = useState('');

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileDrop = (file) => {
    setSelectedFile(file);
    setSelectedImage(URL.createObjectURL(file));
  };
  const isRedirecting = useRef(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      axios
        .get(`${port}/user/check_token`, {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          if (response.data.status === false) {
            localStorage.removeItem('token');
            if (!isRedirecting.current) {
              isRedirecting.current = true;
              showAlert('Token expired. Please login again.');
              navigate('/login');
            }
          } else if (response.data.status === true) {
            localStorage.setItem('userRole', response.data.message);
          }
        })
        .catch((err) => {
          if (err.response && err.response.status === 403 && !isRedirecting.current) {
            isRedirecting.current = true;
            localStorage.removeItem('token');
            showAlert('Token expired. Please login again.');
            navigate('/login');
          } else {
            console.error('Unexpected error:', err);
          }
        });
    }, 5000);

    return () => clearInterval(intervalId);
  }, [navigate, token]);


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
          setTimeout(() => {
            window.location.reload();
          }, 2500);
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

  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem("activeSection") || "dashboard";
  });

  useEffect(() => {
    localStorage.setItem("activeSection", activeSection);
  }, [activeSection]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyData, setCompanyData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [updateUser, setUpdateUser] = useState(null);

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
    localStorage.removeItem('activeSection');
    window.location.reload();
  }

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
      deleteAction();
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
        showAlert(response.data.message);
        window.location.reload();
      }).catch((err) => { console.log(err) });
    });
  }

  const ChangeUserRole = (id, role) => {
    if (userRole === 'Sadmin') {
      axios.put(`${port}/s_admin/update_user/${id}`, { role }, {
        headers: {
          Authorization: token,
        }
      }).then((response) => {
        closeDetails();
        window.location.reload();
      }).catch((err) => { console.log(err); });
    } else {
      return;
    }
  }

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
    }).catch((err) => { console.log(err) });
  }



  const [total_amount_received, setTotal_amount_received] = useState('');
  const [total_commission, setTotal_commission] = useState('');
  const [amount_to_pay, setAmount_to_pay] = useState('');
  const total_sadmin_amount = async () => {
    if (userRole === 'Sadmin') {
      axios.get(`${port}/s_admin/total_amount_received`, {
        headers: {
          Authorization: token,
        }
      }).then((res) => {
        let amount = 0;
        if (res.data.status) {
          const data = res.data.message;
          data.forEach(item => {
            amount += parseFloat(item.payment_info_amount || 0);
          });
        }
        setTotal_amount_received(amount);
      });
    }
  }

  const total_sadmin_commission = () => {
    if (userRole === 'Sadmin') {
      axios.get(`${port}/s_admin/total_commission`, {
        headers: {
          Authorization: token,
        }
      }).then((res) => {
        let commission = 0;
        if (res.data.status) {
          const data = res.data.message;
          data.forEach(item => {
            commission += parseFloat(item.commission || 0);
          });
        }
        setTotal_commission(commission);
      })
    }
  }

  const total_sadmin_amount_to_pay = () => {
    if (userRole === 'Sadmin') {
      axios.get(`${port}/s_admin/amount_to_pay`, {
        headers: {
          Authorization: token,
        }
      }).then((res) => {
        let pay = 0;
        if (res.data.status) {
          const data = res.data.message;
          data.forEach(item => {
            pay += parseFloat(item.amount || 0);
          });
        }
        setAmount_to_pay(pay);
      })
    }
  }


  const [admin_total_offers, setAdmin_total_offers] = useState('');
  const display_admin_total_offers = () => {
    if (userRole === 'admin') {
      axios.get(`${port}/admin/total_offers_sent`, {
        headers: {
          Authorization: token,
        }
      }).then((response) => {
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

  const [user_upcomming, setUser_upcomming] = useState([]);
  const upcomming = () => {
    axios.get(`${port}/user/user_upcomming`, {
      headers: {
        Authorization: token,
      }
    }).then((response) => {
      if (response.data.status === true) {
        setUser_upcomming(response.data.message);
      } else {
        setUser_upcomming('');
      }
    }).catch((err) => { console.log(err) });
  }
  const [user_numbers_orders, setUser_numbers_orders] = useState('');
  const total_user_orders = () => {
    axios.get(`${port}/user/total_orders_number`, {
      headers: {
        Authorization: token,
      }
    }).then((response) => {
      if (response.data.status === true) {
        setUser_numbers_orders(response.data.message);
      } else {
        setUser_numbers_orders('');
      }
    }).catch((err) => { console.log(err) });
  }
  const [user_payment_history, setUser_payment_history] = useState([]);
  let total_spending = 0;
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

  if (user_payment_history) {
    total_spending = user_payment_history.reduce((total, record) => {
      return total + parseFloat(record.payment_info_amount);
    }, 0);
  }

  const [S_admin_payment, setS_admin_payment] = useState([]);
  const payment_history = () => {
    if (userRole === 'Sadmin') {
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
  }

  const [payment_search, setPayment_search] = useState('');
  const [payment_date, setPayment_date] = useState('');

  const filteredPayments = S_admin_payment.filter((item) => {
    const matchesSearch = payment_search === "" ||
      item.transaction_id?.toLowerCase().includes(payment_search.toLowerCase()) ||
      item.offer_id?.toString().includes(payment_search) ||
      item.payment_info_amount?.toString().includes(payment_search);

    const matchesDate = payment_date === "" ||
      (item.payment_time && new Date(item.payment_time).toISOString().split("T")[0] === payment_date);

    return matchesSearch && matchesDate;
  });


  // const handleViewClick = async (company) => {
  //   const companyId = company.id;

  //   localStorage.setItem('selected_company_id', companyId);
  //   localStorage.setItem('activeSection', 'company_detail');



  //   try {
  //     const response = await axios.get(`${port}/s_admin/company_info_detail/${companyId}`, {
  //       headers: {
  //         Authorization: token,
  //       }
  //     });
  //     const data = response.data;
  //     if (data.status && data.message.length > 0) {
  //       setSelectedCompany(data.message);
  //       setActiveSection('company_detail');
  //       console.log(selectedCompany);
  //     } else {
  //       console.error('No data received or invalid format');
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch company details:', error);
  //   }
  // };

  const handleViewClick = async (company) => {
    const companyId = company.id;

    localStorage.setItem('selected_company_id', companyId);
    localStorage.setItem('activeSection', 'company_detail');
    localStorage.setItem('shouldReloadOnce', 'true');

    try {
      const response = await axios.get(`${port}/s_admin/company_info_detail/${companyId}`, {
        headers: { Authorization: token },
      });

      const data = response.data;

      if (data.status && data.message.length > 0) {
        setSelectedCompany(data.message[0]);
        setActiveSection('company_detail');

        // setTimeout(() => {
        //   window.location.reload();
        // }, 200);
      } else {
        console.error('No data received or invalid format');
      }
    } catch (error) {
      console.error('Failed to fetch company details:', error);
    }
  };

  useEffect(() => {
    const initializeCompany = async () => {
      if (userRole === 'admin') {
        try {
          const res = await axios.get(`${port}/admin/display_company`, {
            headers: { Authorization: token },
          });
          setSelectedCompany(res.data.message[0]);
        } catch (err) {
          console.error('Failed to fetch admin company details:', err);
        }
        return
      }
      const storedId = localStorage.getItem('selected_company_id');
      const active = localStorage.getItem('activeSection');

      if (storedId && active === 'company_detail') {
        axios.get(`${port}/s_admin/company_info_detail/${storedId}`, {
          headers: {
            Authorization: token,
          }
        })
          .then(res => {
            const data = res.data;
            if (data.status && data.message.length > 0) {
              setSelectedCompany(data.message[0]);
            } else {
              console.error('Company not found or invalid response');
            }
          })
          .catch(err => console.error('Error fetching company on load:', err));
      }
    };

    initializeCompany();
  }, [userRole, port, token]);

  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingField, setEditingField] = useState('');
  const [previousValue, setPreviousValue] = useState('');
  const [updatedValue, setUpdatedValue] = useState('');

  const handleEditClick = (field) => {
    setEditingField(field);
    setPreviousValue(userInfo[field]);
    setUpdatedValue('');
    setShowEditPopup(true);
  };

  const handleFieldUpdate = () => {
    if (!updatedValue) {
      showAlert('Please enter a value to update.');
      return;
    }

    if (editingField === 'email') {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatedValue);
      if (!isValidEmail) {
        showAlert('Please enter a valid email address!');
        return;
      }
    }

    axios.put(`${port}/user/update_name`, {
      editNameInput: updatedValue,
    }, {
      headers: {
        Authorization: token,
      }
    }).then((response) => {
      showAlert(response.data.message, '\n Login Again to see the change Name!');
      setShowEditPopup(false);
    }).catch((error) => {
      console.error('Error updating field:', error);
      showAlert('Failed to update the field.');
    });
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
            window.location.reload();
          })
          .catch((error) => console.error("Error deleting:", error));
      }
    );
  };

  const closeDetails = () => {
    setSelectedCompany(null);
    setUpdateUser(null);
  };

  const [filter_companyName, setFilter_companyName] = useState('');
  const [filter_selectedCountry, setFilter_selectedCountry] = useState('');
  const [filter_selectedService, setFilter_selectedService] = useState('');

  const handleSelectCountry = (country) => {
    setFilter_selectedCountry(country);
  }

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

  const handleScrollToMore = () => {
    const targetDiv = document.getElementById("more");
    if (targetDiv) {
      targetDiv.scrollIntoView({ behavior: "smooth" });
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
          showAlert(response.data.message);
          window.location.reload();
        })
        .catch((err) => console.log(err));
    });

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
  console.log('data-: ', selected_offer);

  const [show_company_details, setShow_company_details] = useState(null);
  const handle_user_offer_details = (offer_id, groupage_id, price, commission) => {
    axios.get(`${port}/user/company_details/${offer_id}`, {
      headers: {
        Authorization: token,
      }
    }).then((res) => {
      if (res.data.status === true) {
        setShow_company_details({
          data: res.data.message,
          price: price - commission,
          commission: commission
        });
      } else {
        setShow_company_details(null);
      }
    }).catch((err) => console.log(err));
  }
  console.log('companydata-: ', show_company_details);


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

  }

  const duration_calculate = (departure_date, pickup_date) => {
    // Handle null, undefined, or "null" pickup_date
    if (!pickup_date || pickup_date === "null") {
      return "Pickup date not available";
    }

    const isDateRange = /^([A-Za-z]{3,}) \d{1,2}, \d{4} - ([A-Za-z]{3,}) \d{1,2}, \d{4}$/.test(departure_date);

    if (!isDateRange) {
      // If not a date range, return the string (cleaned)
      return departure_date.replaceAll("_", " ");
    }

    // If it's a date range, extract the end date
    const endDateStr = departure_date.split(" - ")[1];
    const endDateObj = new Date(endDateStr);

    let pickupDateStr = pickup_date;

    if (pickup_date.includes(" - ")) {
      pickupDateStr = pickup_date.split(" - ")[0];
    }

    // Try to parse pickupDateStr (assume it's in dd/mm/yyyy or yyyy-mm-dd)
    let pickupDateObj;
    if (pickupDateStr.includes("/")) {
      pickupDateObj = new Date(pickupDateStr.split("/").reverse().join("-")); // dd/mm/yyyy → yyyy-mm-dd
    } else {
      pickupDateObj = new Date(pickupDateStr);
    }

    const diffInMs = endDateObj - pickupDateObj;
    const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

    if (isNaN(diffInDays)) return "Invalid duration";

    return diffInDays >= 30
      ? `${Math.floor(diffInDays / 30)} month(s)`
      : `${diffInDays} day(s)`;
  };


  // const duration_calculate = (departure_date, pickup_date) => {
  //   const firstPickupDate = pickup_date.split(" - ")[0];

  //   const departureDateObj = new Date(departure_date);
  //   const pickupDateObj = new Date(firstPickupDate.split("/").reverse().join("-"));

  //   const diffInTime = departureDateObj - pickupDateObj;

  //   const durationInDays = diffInTime / (1000 * 60 * 60 * 24);

  //   const duration =
  //     durationInDays >= 30
  //       ? `${Math.floor(durationInDays / 30)} month(s)`
  //       : `${durationInDays} day(s)`;
  //   return duration;
  // }

  const delete_offer_admin = (offer_id) => {
    openDeleteModal(`Are you sure you want to delete this offer ?`, () => {
      axios.delete(`${port}/admin/delete_offer/${offer_id}`, {
        headers: {
          Authorization: token,
        }
      }).then((response) => {
        if (response.data.status === true) {
          showAlert(response.data.message);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      }).catch((err) => { console.log(err) });
    });
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
    }).catch((err) => { });
  }

  const [show_admin_offer, setShow_admin_offer] = useState('');
  const handle_admin_selected_offer = (offer_id, groupage_id) => {
    axios.get(`${port}/admin/selected_offer`, {
      params: {
        offer_id: offer_id,
        groupage_id: groupage_id,
      },
      headers: {
        Authorization: token,
      }
    }).then((res) => {
      setShow_admin_offer(res.data.message);
    })
      .catch((err) => console.log(err));
  }

  const [allOffers, setAllOffers] = useState([]);
  const displayallOffers = () => {
    if (userRole === 'Sadmin') {
      axios.get(`${port}/s_admin/show_all_offers`, {
        headers: {
          Authorization: token,
        }
      }).then((response) => {
        setAllOffers(response.data.data);
      }).catch((err) => { console.log(err) });
    }
  }

  const [offersearch, setOffersearch] = useState('');
  const [offerdate, setOfferdate] = useState('');

  const filteredOffers = allOffers.filter((item) => {
    const matchesSearch = offersearch === "" || (
      item.offer_id?.toString().includes(offersearch) ||
      item.product_name?.toLowerCase().includes(offersearch.toLowerCase()) ||
      item.userName?.toLowerCase().includes(offersearch.toLowerCase()) ||
      item.company_name?.toLowerCase().includes(offersearch.toLowerCase()) ||
      ((parseFloat(item.amount) || 0) +
        (item.commission === 'null' || item.commission == null ? 0 : parseFloat(item.commission)))
        .toString()
        .includes(offersearch)
    );

    const matchesDate = offerdate === "" ||
      (item.created_at && new Date(item.created_at).toISOString().split("T")[0] === offerdate);

    return matchesSearch && matchesDate;
  });
  const [edit_company, setEdit_company] = useState(false);
  const handle_edit_company = (company) => {
    setEdit_company(!edit_company);
  }

  const [handle_profile_edit, setHandle_profile_edit] = useState(false);
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [edit_company_document, setEdit_company_document] = useState(false);
  const [company_document, setCompany_document] = useState(null);
  const [editField, setEditField] = useState({ label: '', previousValue: '' });
  const [newValue, setNewValue] = useState('');



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
            setTimeout(() => {
              window.location.reload();
            }, 2500);
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
            setTimeout(() => {
              window.location.reload();
            }, 2500);
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
        window.location.reload();
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
      window.location.reload();
    }
    ).catch((err) => { console.log(err); });
  }

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

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newCountryData, setNewCountryData] = useState({
    region: '',
    country: '',
    duration: '',
    name: ''
  });

  const [activeRegion, setActiveRegion] = useState('');
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

  console.log(selectedCompany);
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
    upcomming();
    total_user_orders();
    total_sadmin_amount();
    total_sadmin_commission();
    total_sadmin_amount_to_pay();
  }, []);

  const [profile_edit, setProfile_edit] = useState(false);
  const [change_password, setChange_password] = useState(false);
  const handle_change_password = () => {
    setChange_password(!change_password);
  }

  const [change_password_admin, setChange_password_admin] = useState(false);
  const handle_change_password_admin = () => {
    setChange_password_admin(!change_password_admin)
  }
  const [previous_password, setPrevious_password] = useState('');
  const [new_password, setNew_password] = useState('');
  const [confirm_password, setConfirm_password] = useState('');

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

  const [showOfferDetails, setShowOfferDetails] = useState(null);
  const show_offer_details = (item) => {
    setShowOfferDetails(item);
  }
  const initialOptions = {
    "client-id": "Ae-QJja_9j4sH-PmGLdd6ghIT_9_A1IUicHytfy9i0sV4ZDZLsUn8bcfyW1SBF_3CNc0OGQoGZGOZ_8a",
    currency: "USD",
    components: "buttons",
  };

  const commission_percentage = 1.3;
  const [payment_details, setPayment_details] = useState('');
  const S_admin_payment_status = (item) => {
    axios.post(`${port}/s_admin/payment_information`,
      {
        user_email: item.user_email,
        offer_id: item.offer_id,
      },
      {
        headers: {
          Authorization: token,
        }
      }
    )
      .then((response) => {
        if (response.data.status === true) {
          const combinedDetails = {
            ...item,
            ...response.data.message
          };
          setPayment_details(combinedDetails);
        } else {
          setPayment_details(null);
        }
      })
      .catch((err) => {
        console.error('API error:', err);
      });
  };

  const Link11 = ({ id, children, title }) => (
    <OverlayTrigger overlay={<Tooltip id={id}>{title}</Tooltip>}>
      <span>{children}</span>
    </OverlayTrigger>
  );

  const Menu = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [selectedItem, setSelectedItem] = useState('Dashboard');

    const handleSelect = (item) => {
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
                <Link to="#" className="nav-link text-white" onClick={() => { handleSelect("Dashboard"); setActiveSection("dashboard"); localStorage.setItem("activeSection", "dashboard"); setShowOfferDetails(null); setSelected_groupage(null); }}>
                  <MdDashboard /> Dashboard
                </Link>
              </li>

              {userRole === 'Sadmin' ? (
                <>
                  <li className="nav-item mb-4 text-start" style={activeSection === 'companies' ? { backgroundColor: "06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}>
                    <Link to="#" className="nav-link text-white" onClick={() => { handleSelect("Companies"); setActiveSection("companies"); localStorage.setItem("activeSection", "companies"); setShowOfferDetails(null); }}>
                      <BsBuildingsFill /> Companies
                    </Link>
                  </li>
                  <li className="nav-item mb-4 text-start" style={activeSection === 'offers' ? { backgroundColor: "06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}>
                    <Link to="#" className="nav-link text-white" onClick={() => { handleSelect("Offers"); setActiveSection("offers"); localStorage.setItem("activeSection", "offers"); setShowOfferDetails(null); }}>
                      <FaUsers /> Offers
                    </Link>
                  </li>
                  <li className="nav-item mb-4 text-start" style={activeSection === 'payments' ? { backgroundColor: "06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}>
                    <Link to="#" className="nav-link text-white" onClick={() => { handleSelect("Payments"); setActiveSection("payments"); localStorage.setItem("activeSection", "payments"); setShowOfferDetails(null); }}>
                      <RiSecurePaymentFill /> Payments
                    </Link>
                  </li>
                  {userData.length > 0 && (
                    <li className="nav-item mb-4 text-start" style={activeSection === 'users' ? { backgroundColor: "06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}>
                      <Link to="#" className="nav-link text-white" onClick={() => { handleSelect("Roles & Permissions"); setActiveSection("users"); localStorage.setItem("activeSection", "users"); setShowOfferDetails(null); }}>
                        <FaUserGear /> Roles & Permissions
                      </Link>
                    </li>
                  )}
                </>
              ) : (

                <>
                  {userRole === 'user' && (
                    <>
                      <li className="nav-item mb-4 text-start" style={activeSection === 'orders' ? { backgroundColor: "06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}>
                        <Link to="#" className="nav-link text-white" onClick={() => { handleSelect("Orders"); setActiveSection("orders"); localStorage.setItem("activeSection", "orders"); setSelected_groupage(null); }}>
                          <FaBoxOpen /> Orders
                        </Link>
                      </li>
                    </>
                  )}
                  <li className="nav-item mb-4 text-start" style={activeSection === 'user_offers' ? { backgroundColor: "06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}>
                    <Link to="#" className="nav-link text-white" onClick={() => { handleSelect("Offers"); setActiveSection("user_offers"); localStorage.setItem("activeSection", "user_offers"); setSelected_groupage(null); }}>
                      <MdPayment /> Offers
                    </Link>
                  </li>
                  {userRole === 'user' && (
                    <>
                      <li className="nav-item mb-4 text-start" style={activeSection === 'payment_history' ? { backgroundColor: "06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}>
                        <Link to="#" className="nav-link text-white" onClick={() => { handleSelect("Payment History"); setActiveSection("payment_history"); localStorage.setItem("activeSection", "payment_history"); setSelected_groupage(null); }}>
                          <MdPayment /> Payment History
                        </Link>
                      </li>
                    </>
                  )}
                </>
              )}

            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="" style={{
      marginTop: '80px',
      height: '89vh',
      overflow: isMobile ? 'auto' : 'hidden'
    }}>
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
            <section className="d-flex flex-column align-items-start sidebar-wrapper mt-5 pt-5"
            >
              <div className="sidebar-wrap w-100">
                <div className="d-flex align-items-start justify-content-start mt-5">
                  <ul className="nav flex-column mt-4 fs-4 w-100">
                    <li className="nav-item mb-4 text-start" style={activeSection === 'dashboard' ? { backgroundColor: "#06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}>
                      <Link to="#" className="nav-link text-white sidebar-links" onClick={() => { setActiveSection("dashboard"); localStorage.setItem("activeSection", "dashboard"); setShowOfferDetails(null); setSelected_groupage(null); }}>
                        <MdDashboard /> Dashboard
                      </Link>
                    </li>

                    {userRole === 'Sadmin' ? (
                      <>
                        <li className="nav-item mb-4 text-start" style={(activeSection === 'companies' && 'company_detail') ? { backgroundColor: "#06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}>
                          <Link to="#" className="nav-link text-white sidebar-links" onClick={() => { setActiveSection("companies"); localStorage.setItem("activeSection", "companies"); setShowOfferDetails(null); }}>
                            <BsBuildingsFill /> Companies
                          </Link>
                        </li>
                        <li className="nav-item mb-4 text-start" style={activeSection === 'offers' ? { backgroundColor: "#06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}>
                          <Link to="#" className="nav-link text-white sidebar-links" onClick={() => { setActiveSection("offers"); localStorage.setItem("activeSection", "offers"); setShowOfferDetails(null); }}>
                            <FaUsers /> Offers
                          </Link>
                        </li>
                        <li className="nav-item mb-4 text-start" style={activeSection === 'payments' ? { backgroundColor: "#06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}>
                          <Link to="#" className="nav-link text-white sidebar-links" onClick={() => { setActiveSection("payments"); localStorage.setItem("activeSection", "payments"); setShowOfferDetails(null); }}>
                            <RiSecurePaymentFill /> Payments
                          </Link>
                        </li>
                        {userData.length > 0 && (
                          <li className="nav-item mb-4 text-start" style={activeSection === 'users' ? { backgroundColor: "#06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}>
                            <Link to="#" className="nav-link text-white sidebar-links" onClick={() => { setActiveSection("users"); localStorage.setItem("activeSection", "users"); setShowOfferDetails(null); }}>
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
                              <Link to="#" className="nav-link text-white sidebar-links" onClick={() => { setActiveSection("orders"); localStorage.setItem("activeSection", "orders"); setSelected_groupage(null); }}>
                                <FaBoxOpen /> Orders
                              </Link>
                            </li>
                          </>
                        )}

                        <li className="nav-item mb-4 text-start" style={activeSection === 'user_offers' ? { backgroundColor: "#06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}>
                          <Link to="#" className="nav-link text-white sidebar-links" onClick={() => { setActiveSection("user_offers"); localStorage.setItem("activeSection", "user_offers"); setSelected_groupage(null); }}>
                            <MdPayment /> Offers
                          </Link>
                        </li>

                        {userRole === 'user' && (
                          <>
                            <li className="nav-item mb-4 text-start" style={activeSection === 'payment_history' ? { backgroundColor: "#06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}>
                              <Link to="#" className="nav-link text-white sidebar-links" onClick={() => { setActiveSection("payment_history"); localStorage.setItem("activeSection", "payment_history"); setSelected_groupage(null); }}>
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
                <div className="bg-light" style={{ width: '100%', maxWidth: isMobile ? "100%" : "85%", height: '100%', paddingBottom: '40px', overflow: 'auto' }}>
                  {isMobile && (
                    <div className="w-100 d-flex justify-content-start">
                      <Menu />
                    </div>
                  )}
                  <div className="dashbord-info-wrap">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center w-100 p-2">
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
                                <button className="btn btn-sm btn-primary mt-1" onClick={() => { setActiveSection('profile_view') }}>Profile information</button>
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
                        {[{ count: total_amount_received ? parseFloat(total_amount_received).toFixed(2) : 'N/A', change: "+5%", text: "Amount Received", icon: <PiShippingContainerDuotone /> },
                        { count: total_commission ? parseFloat(total_commission).toFixed(2) : 'N/A', change: "-2%", text: "Commission Earned", icon: <BsCarFrontFill /> },
                        { count: amount_to_pay ? parseFloat(amount_to_pay).toFixed(2) : 'N/A', change: "+10%", text: "Total Amount Paid", icon: <FaTruckLoading /> }
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
                <div className="bg-light" style={{ width: '100%', maxWidth: isMobile ? "100%" : "85%", height: '100%', paddingBottom: '40px', overflow: 'auto' }}>
                  {isMobile && (
                    <div className="w-100 d-flex justify-content-start">
                      <Menu />
                    </div>
                  )}
                  <div className="dashbord-info-wrap">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center w-100 p-2">
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
                                <button className="btn btn-sm btn-primary mt-1" onClick={() => { setActiveSection('company_detail') }}>Profile information</button>

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
                        { count: admin_total_offers ? admin_total_offers : 'N/A', change: "-2%", text: "Total Offers Sent", icon: <BsCarFrontFill /> },
                        { count: admin_offer_accecepted ? admin_offer_accecepted : 'N/A', change: "+10%", text: "Offers Accepted ", icon: <FaTruckLoading /> }
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
                <div style={{ width: '100%', maxWidth: isMobile ? "100%" : "85%", height: '100vh', overflow: 'auto', marginTop: '80px', paddingBottom: '40px' }}>
                  {isMobile && (
                    <div className="w-100 d-flex justify-content-start">
                      <Menu />
                    </div>
                  )}
                  <div className="dashbord-info-wrap">
                    <div className="d-flex flex-wrap justify-content-end align-items-center mt-2 gap-3">
                      <div className="border-start p-2 border-3 border-dark">
                        <Dropdown>
                          <Dropdown.Toggle className="fs-5 w-100 text-secondary" variant="light" id="dropdown-basic">
                            <FaUserTie /> <strong className="text-capitalize">{userInfo.name}</strong>
                          </Dropdown.Toggle>
                          <Dropdown.Menu align="end">
                            <div className="d-flex flex-column justify-content-center align-items-center gap-2">
                              <button className="btn btn-sm btn-primary mt-1" onClick={() => { setActiveSection('profile_view') }}>Profile information</button>

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
                        {[{ count: user_numbers_orders ? user_numbers_orders : 'N/A', change: "+5%", text: "Total Orders", icon: <PiShippingContainerDuotone /> },
                        { count: user_upcomming ? user_upcomming : 'N/A', change: "-2%", text: "Upcoming Pick up", icon: <BsCarFrontFill /> },
                        { count: total_spending ? total_spending : 'N/A', change: "+10%", text: "Total Spending", icon: <FaTruckLoading /> }
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

        {activeSection === 'profile_view' && (
          <>
            <div className="bg-light px-md-3" style={{ marginTop: '80px', paddingBottom: '90px', width: '100%', maxWidth: isMobile ? "100%" : "85%", height: '100vh', overflow: 'auto' }}>
              {isMobile && (
                <div className="w-100 d-flex justify-content-start">
                  <Menu />
                </div>
              )}
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center w-100 py-2 px-md-2">

                <div className="d-flex align-items-center justify-content-end w-100 mt-2 mt-md-0">
                  <div className="border-start p-2 border-3 border-dark">
                    <Dropdown>
                      <Dropdown.Toggle className="fs-5 w-100 text-secondary" variant="light" id="dropdown-basic">
                        <FaUserTie /> <strong className="text-capitalize">{userInfo.name}</strong>
                      </Dropdown.Toggle>
                      <Dropdown.Menu align="end">
                        <div className="d-flex flex-column justify-content-center align-items-center gap-2">
                          <button className="btn btn-sm btn-primary mt-1" onClick={() => { setActiveSection('profile_view') }}>Profile information</button>

                          <button className="btn btn-danger btn-sm mt-1" onClick={handel_logout}>Logout</button>
                        </div>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              </div>

              <div className="d-flex ps-4 w-100 justify-content-start">
                <label className="fs-3"><strong>Profile Information</strong></label>
              </div>


              <div className="dashboard-wrapper-box">
                <div className="table-wrap">
                  <div className="table-filter-wrap">
                    <div className="d-flex justify-content-end align-items-start mb-3">
                      <div>
                        <h4 className='text-primary' style={{ cursor: 'pointer' }} onClick={() => setProfile_edit(!profile_edit)}><RiPencilFill /> Edit Profile</h4>
                      </div>
                    </div>

                    <div className={`d-flex flex-wrap justify-content-between ${userRole === 'Sadmin' ? 'w-100' : 'w-75'}`}>
                      <div
                        className="d-flex flex-row align-items-start justify-content-start p-2 gap-2"
                        onClick={() => {
                          if (profile_edit) {
                            handleEditClick('name');
                          }
                        }}
                      >
                        <div
                          className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                          style={{
                            width: '3rem',
                            height: '3rem',
                            backgroundColor: '#E1F5FF',
                            aspectRatio: '1 / 1',
                          }}
                        >
                          <FaUserCheck />
                        </div>
                        <div className="d-flex flex-column align-items-start gap-1">
                          <span className="text-secondary fs-4">Name</span>
                          <h5 className="text-uppercase">{userInfo.name}</h5>
                        </div>
                        {profile_edit && (
                          <div className="ms-2 fs-4 text-primary">
                            <GoPencil />
                          </div>
                        )}
                      </div>

                      <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 mb-3">
                        <div
                          className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                          style={{
                            width: '3rem',
                            height: '3rem',
                            backgroundColor: '#E1F5FF',
                            aspectRatio: '1 / 1',
                          }}
                        >
                          <MdAlternateEmail />
                        </div>
                        <div className="d-flex flex-column align-items-start gap-1">
                          <span className="text-secondary fs-4">Email</span>
                          <h5>{userInfo.email}</h5>
                        </div>
                      </div>

                      {userRole === 'Sadmin' && (
                        <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 mb-2">
                          <div
                            className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                            style={{
                              width: '3rem',
                              height: '3rem',
                              backgroundColor: '#E1F5FF',
                              aspectRatio: '1 / 1',
                            }}
                          >
                            <MdOutlineKey />
                          </div>
                          <div className="d-flex flex-column align-items-start gap-1">
                            <span className="text-secondary fs-4">Role</span>
                            <h5>{userInfo.role}</h5>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="d-flex justify-content-start align-items-start gap-2 mt-3">
                      <button className="btn-change-password" onClick={handle_change_password}> Change Password </button>
                      <button className="btn-logout" onClick={handel_logout}> Log Out </button>
                    </div>

                  </div>
                </div>
              </div>

              {showEditPopup && (
                <div
                  className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}
                >
                  <div className="bg-white p-4 rounded shadow" style={{ width: '90%', maxWidth: '500px' }}>
                    <div className="title-head text-start">
                      <h3 className="mb-3">Name {editField === 'name' ? 'Name' : 'Email'}</h3>
                    </div>

                    <div className="text-start">
                      <label className="input-label">Previous Name</label>
                      <input
                        type="text"
                        className="input-field"
                        value={previousValue}
                        readOnly
                      />
                    </div>

                    <div className="text-start">
                      <label className="input-label">New Name</label>
                      <input
                        type={editingField === 'email' ? 'email' : 'text'}
                        className="input-field"
                        placeholder={`Enter new ${editingField}`}
                        value={updatedValue}
                        onChange={(e) => setUpdatedValue(e.target.value)}
                      />

                    </div>

                    <div className="d-flex justify-content-end gap-2">
                      <button className="btn-change-password" onClick={handleFieldUpdate}>Change</button>
                      <button className="btn btn-secondary" onClick={() => setShowEditPopup(false)}>Cancel</button>
                    </div>
                  </div>
                </div>
              )}

              {change_password && (
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
                          <button className="btn btn-secondary" onClick={() => setChange_password(false)}>Cancel</button>
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

            </div>
          </>
        )}

        {activeSection === 'orders' && (
          <>
            <div className="bg-light" style={{ marginTop: '80px', paddingBottom: '90px', width: '100%', maxWidth: isMobile ? "100%" : "85%", height: '100vh', overflow: 'auto' }}>
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
                        <button className="btn btn-sm btn-primary mt-1" onClick={() => { setActiveSection('profile_view') }}>Profile information</button>

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
                    <div className="table-filter-wrap">
                      <div className="d-flex flex-column align-items-start justify-content-start ps-2 mb-3 w-100">
                        <h5>Filter By:</h5>

                        <div className="row w-100 g-2 mt-1 ">
                          <div className="col-12 col-md-6 col-lg-3">
                            <input type="text" placeholder="Search by product name or order id" className="shipping-input-field" />
                          </div>
                          <div className="col-12 col-md-6 col-lg-3">
                            <CountriesSelector paddingcount='12px 18px' fontsizefont='15px' bgcolor='#ebebeb' bordercolor='1px solid #ebebeb' borderradiuscount='6px' label="Pick Up Country" />
                          </div>
                          <div className="col-12 col-md-6 col-lg-3">
                            <CountriesSelector paddingcount='12px 18px' fontsizefont='15px' bgcolor='#ebebeb' bordercolor='1px solid #ebebeb' borderradiuscount='6px' label="Destination Country" />
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
                                <td className="text-secondary d-flex align-items-center justify-content-center">
                                  <span className="p-2 fw-bold d-flex flex-column align-items-center justify-content-center w-75 user-offer-width" style={{
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
                      <img src={selected_groupage.img01} alt="" style={{ width: '100%', height: '100%' }} />
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
            <div className="bg-light" style={{ marginTop: '80px', paddingBottom: '90px', width: '100%', maxWidth: isMobile ? "100%" : "85%", height: '100vh', overflow: 'auto' }}>
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
                        <button className="btn btn-sm btn-primary mt-1" onClick={() => { setActiveSection('profile_view') }}>Profile information</button>

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
                          <th scope="col"><h6>Paypal Id</h6></th>
                          <th scope="col"><h6>Offer Id</h6></th>
                          <th scope="col"><h6>Amount (€)</h6></th>
                        </tr>
                      </thead>
                      {user_payment_history && user_payment_history.length > 0 ? (
                        <tbody>
                          {user_payment_history.map((item, index) => (
                            <tr key={index}>
                              <td className="text-secondary">{item.order_id}</td>
                              <td className="text-secondary">{item.transaction_id}</td>
                              <td className="text-secondary">{item.paypal_id}</td>
                              <td className="text-secondary">{item.offer_id}</td>
                              <td className="text-secondary">{item.payment_info_amount}</td>
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
            <div className="bg-light" style={{ marginTop: '80px', paddingBottom: '90px', width: '100%', maxWidth: isMobile ? "100%" : "85%", height: '100vh', overflow: 'auto' }}>
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
                        <button className="btn btn-sm btn-primary mt-1" onClick={() => { userRole === 'admin' ? setActiveSection('company_detail') : setActiveSection('profile_view') }}>Profile information</button>

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
                              <CountriesSelector label="Pick Up Country" paddingcount='12px 18px' fontsizefont='15px' bgcolor='#ebebeb' bordercolor='1px solid #ebebeb' borderradiuscount='6px' />
                            </div>
                            <div className="col-12 col-md-6 col-lg-3">
                              <CountriesSelector label="Destination Country" paddingcount='12px 18px' fontsizefont='15px' bgcolor='#ebebeb' bordercolor='1px solid #ebebeb' borderradiuscount='6px' />
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
                              <th scope="col"><h6>Offer To</h6></th>
                              <th scope="col"><h6>Price (€)</h6></th>
                              {/* <th scope="col"><h6>Platform fee (€)</h6></th> */}
                              {/* <th scope="col"><h6>Amount Receive (€)</h6></th> */}
                              <th scope="col"><h6>Pick Up Date</h6></th>
                              <th scope="col"><h6>Product Pick Up</h6></th>
                              <th scope="col"><h6>Offer Status</h6></th>
                            </tr>
                          </thead>
                          {admin_offer && admin_offer.length > 0 ? (
                            <tbody>
                              {admin_offer.map((item, index) => (
                                <tr key={index}>
                                  <td className="text-primary" style={{ cursor: 'pointer' }} onClick={() => {
                                    if (item.status === 'pending') {
                                      showAlert("Offer is not yet accepted by customer");
                                    } else if (item.status === 'rejected') {
                                      showAlert("Your offer is Rejected");
                                    } else {
                                      handle_admin_selected_offer(item.offer_id, item.groupage_id);
                                    }
                                  }}>#{item.offer_id}</td>
                                  <td className="text-secondary">{item.product_name}</td>
                                  <td className="text-secondary">{item.sender_name}</td>
                                  <td className="text-secondary">{item.amount}</td>
                                  {/* <td className="text-secondary">{item.commission}</td> */}
                                  {/* <td className="text-secondary"><Link11 title="This is the final amount you will receive from customer" id="t-1">{item.amount - item.commission}</Link11></td> */}
                                  <td className="text-secondary">{item.pickup_date}</td>
                                  <td className="text-secondary">{item.office_address ? 'No': 'Yes'}</td>
                                  <td className="text-secondary"
                                    style={item.status === 'rejected' ? { cursor: 'pointer' } : {}}
                                    onClick={() => { if (item.status === 'rejected') { delete_offer_admin(item.offer_id) } }}
                                  ><span className="px-3 py-2" style={item.status === 'pending' ? { fontWeight: '600', backgroundColor: ' #FFEF9D', color: ' #9B8100' } : item.status === 'rejected' ? { fontWeight: '600', backgroundColor: '#ffcbcb', color: 'rgb(110, 0, 0)' } : { fontWeight: '600', backgroundColor: ' #CBFFCF', color: ' #006E09' }}>{item.status === 'complete' ? 'Accepted' : item.status === 'pending' ? 'Pending' : 'Rejected'}{item.status === 'rejected' && (<span className=""><AiFillDelete /></span>)}</span>
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
                              <CountriesSelector label="Pick Up Country" paddingcount='12px 18px' fontsizefont='15px' bgcolor='#ebebeb' bordercolor='1px solid #ebebeb' borderradiuscount='6px' />
                            </div>
                            <div className="col-12 col-md-6 col-lg-3">
                              <CountriesSelector label="Destination Country" paddingcount='12px 18px' fontsizefont='15px' bgcolor='#ebebeb' bordercolor='1px solid #ebebeb' borderradiuscount='6px' />
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
                              <th scope="col"><h6>Total Amount (€)</h6></th>
                              <th scope="col"><h6>Amount to pay now (€)</h6></th>
                              <th scope="col"><h6>Delivery Duration</h6></th>
                              <th scope="col"><h6>Transporter Pickup</h6></th>
                              <th scope="col"><h6>Actions</h6></th>
                            </tr>
                          </thead>
                          {offers && offers.length > 0 ? (
                            <tbody>
                              {offers
                                .filter(item => item.status !== 'rejected')
                                .map((item, index) => (
                                  <tr
                                    key={index}
                                    onClick={() =>
                                      item.accepted === '1'
                                        ? handle_user_offer_details(item.offer_id, item.groupage_id, item.price, item.commission)
                                        : null
                                    }
                                    style={{ cursor: item.accepted === '1' ? 'pointer' : 'default' }}
                                  >
                                    <td className="text-primary">#{item.order_id}</td>
                                    <td className="text-secondary">{item.product_name}</td>
                                    <td className="text-secondary">XXXXX-XXX</td>
                                    <td className="text-secondary">{parseFloat(item.price) + parseFloat(item.commission)}</td>
                                    <td className="text-secondary"><Link11 title="You are paying 10% of the amount now and the remaining amount you can pay directly to the company" id="t-1">{item.commission}</Link11></td>
                                    <td className="text-secondary">
                                      {item.delivery_duration.replace(/_/g, ' ')}
                                    </td>
                                    <td className="text-secondary">{item.office_address ? <>No</> : <>Yes</>}</td>
                                    <td className="d-flex align-items-center justify-content-center w-100 gap-3">
                                      <button
                                        className="btn btn-sm text-light"
                                        style={{ backgroundColor: '#31b23c' }}
                                        onClick={() => handleShowOffer(item)}
                                        disabled={item.accepted === '1'}
                                      >
                                        <FaRegCheckCircle className="fs-3"/>                                        
                                      </button>
                                      <button
                                        className="btn btn-sm text-light"
                                        style={{ backgroundColor: '#c63d3d' }}
                                        onClick={() => handleDeleteoffer(item.offer_id)}
                                        disabled={item.accepted === '1'}
                                      >
                                        <LuCircleX className="fs-3"/>
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

        {show_admin_offer && (
          <>
            <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                zIndex: 9999
              }}
            >
              <div className="bg-light rounded shadow p-4 position-relative border border-2 border-dark dashboard-offer-selection"
                style={{
                  width: '55%',
                  height: '90vh',
                  overflowY: 'auto'
                }}
              >
                <div className="d-flex flex-column justify-content-start align-items-start w-100">
                  <button className="btn btn-danger position-absolute top-0 end-0 m-2" onClick={() => setShow_admin_offer('')}>
                    ✕
                  </button>

                  <strong className="fs-4">Offer Details</strong>

                  <h5 className="mt-3">Product Information</h5>
                  <div className="d-flex flex-column align-items-start justify-content-start mt-1 w-100 border-bottom pb-3 border-2 gap-2">
                    <div className=" d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Product ID : </span>
                      <span>{show_admin_offer.id}</span>
                    </div>
                    <div className={show_admin_offer.img01 ? 'd-flex flex-column align-items-start justify-content-between w-100' : 'd-flex flex-row align-items-start justify-content-between w-100'}>
                      <span className="text-secondary">Product Image : </span>
                      {!show_admin_offer.img01 ? (
                        <>
                          <span>N/A</span>
                        </>
                      ) : (
                        <>
                          <div className="d-flex flex-wrap justify-content-center gap-3 w-100 ms-3">
                            {Object.keys(show_admin_offer)
                              .filter(key => key.startsWith('img') && show_admin_offer[key])
                              .slice(0, 10)
                              .map((key, index) => (
                                <div key={index} className="image-wrapper-offers">
                                  <img
                                    src={show_admin_offer[key]}
                                    alt={`preview-${index}`}
                                    className="img-fluid rounded shadow-sm"
                                  />
                                </div>
                              ))}
                          </div>
                        </>
                      )}
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Product Name : </span>
                      <span>{show_admin_offer.product_name}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Product Type : </span>
                      <span>{show_admin_offer.product_type}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Weight : </span>
                      <span>{show_admin_offer.p_weight}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Height :  </span>
                      <span>{show_admin_offer.p_height}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Length : </span>
                      <span>{show_admin_offer.p_length}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Width : </span>
                      <span>{show_admin_offer.p_width}</span>
                    </div>
                  </div>


                  <h5 className="mt-3">Pick Up Information</h5>
                  <div className="d-flex flex-column align-items-start justify-content-start mt-1 w-100 border-bottom pb-3 border-2 gap-2">
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Full Name : </span>
                      <span>{show_admin_offer.sender_name}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Contact Number : </span>
                      <span>{show_admin_offer.sender_contact}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Email ID : </span>
                      <span>{show_admin_offer.sender_email}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Country : </span>
                      <span>{show_admin_offer.sender_country}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">State : </span>
                      <span>{show_admin_offer.sender_state}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">City : </span>
                      <span>{show_admin_offer.sender_city}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Street Address : </span>
                      <span>{show_admin_offer.sender_address}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Zip Code : </span>
                      <span>{show_admin_offer.sender_zipcode}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Pick Up Date : </span>
                      <span>{show_admin_offer.pickup_date.includes('Select End Date') ? show_admin_offer.pickup_date.split(' - ')[0] : show_admin_offer.pickup_date}</span>
                    </div>
                  </div>

                  <h5 className="mt-3">Delivery Information</h5>
                  <div className="d-flex flex-column align-items-start justify-content-start mt-1 w-100 border-bottom pb-3 border-2 gap-2">
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Full Name : </span>
                      <span>{show_admin_offer.receiver_name}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Contact Number : </span>
                      <span>{show_admin_offer.receiver_contact}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Email ID : </span>
                      <span>{show_admin_offer.receiver_email}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Country : </span>
                      <span>{show_admin_offer.receiver_country}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">State : </span>
                      <span>{show_admin_offer.receiver_state}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">City : </span>
                      <span>{show_admin_offer.receiver_city}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Street Address : </span>
                      <span>{show_admin_offer.receiver_address}</span>
                    </div>
                    <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Zip Code : </span>
                      <span>{show_admin_offer.receiver_zipcode}</span>
                    </div>
                    {/* <div className="d-flex flex-row align-items-start justify-content-between w-100">
                      <span className="text-secondary">Delivery Duration : </span>
                      <span>{show_admin_offer.expeted_date}</span>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {show_company_details !== null && (
          <>
            <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center" style={{ zIndex: 1050 }}>
              <div className="position-relative bg-white p-4 rounded shadow-lg" style={{ width: '580px', height: 'auto' }}>
                <button
                  className="btn-close position-absolute top-0 end-0 m-2"
                  onClick={() => setShow_company_details(null)}
                ></button>

                <div className='d-flex flex-column align-items-start'>
                  <div className='title-head'><h3>Transporter Details</h3></div>

                  <div className='details-wrap w-100 text-start'>
                    <span>< FaBuilding className='fs-4 me-2' style={{ color: '#de8316', width: '20px' }} />Name -: {show_company_details?.data?.company_name}</span>
                  </div>

                  <div className='details-wrap w-100 text-start'>
                    <span>< IoIosMailOpen className='fs-4 me-2' style={{ color: '#de8316', width: '20px' }} />E-mail -: <a href={`mailto:"${show_company_details?.data?.email}"`}>{show_company_details?.data?.email}</a></span>
                  </div>

                  <div className='details-wrap w-100 text-start'>
                    <span>< RiContactsBook3Fill className='fs-4 me-2' style={{ color: '#de8316', width: '20px' }} />Contact Number-: {show_company_details?.data?.contect_no}</span>
                  </div>
                  {show_company_details?.data?.office_address && (
                    <>
                      <div className='details-wrap w-100 text-start'>
                        <span>< RiContactsBook3Fill className='fs-4 me-2' style={{ color: '#de8316', width: '20px' }} />Office Address-: {show_company_details?.data?.office_address}</span>
                      </div>
                    </>
                  )}
                  <div className='details-wrap w-100 text-start'>
                    <span>< RiContactsBook3Fill className='fs-4 me-2' style={{ color: '#de8316', width: '20px' }} />Amount pay to Transporter-: €{parseFloat(show_company_details?.price) + parseFloat(show_company_details?.commission)}</span>
                  </div>

                  <div className='details-wrap w-100 text-start'>
                    <span>< RiContactsBook3Fill className='fs-4 me-2' style={{ color: '#de8316', width: '20px' }} />Amount payed-: €{show_company_details?.commission}</span>
                  </div>
                </div>
              </div>

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
              <div className="bg-light rounded shadow p-4 position-relative border border-2 border-dark dashboard-offer-selection"
                style={{
                  width: '55%',
                  height: '90vh',
                  overflowY: 'auto'
                }}
              >
                {/* <PayPalScriptProvider options={{ "client-id": "AabacLi27CRoLZCcaHTYgUesly35TFDCyoMmm3Vep3pSPbHrLuBNL7-LYbdvtNsFVnWNHoK1Nyq5dDSX", currency: "EUR" }}> */}
                <PayPalScriptProvider options={{ "client-id": "AVNh59zTvpqrmnQPV_gTPRJiduXU4Fdp8_y2ESR-XhvYWEZflyR8TEpE8zA3-IE2UZR1SOhxGYgepYGL", currency: "EUR" }}>


                  {/* <PayPalScriptProvider options={{ "client-id": "AZOcns1edlBV838gnlQgdp25SJW-RXc8Kle0FL3dTj0t289XKg2W7hXOJFG9zngWOko3VQqERais4-aY", currency: "EUR" }}> */}
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
                        <span className="fw-bold">€{parseFloat(selected_offer.price) + parseFloat(selected_offer.commission)}</span>
                      </div>
                      <div className="d-flex flex-row align-items-start justify-content-between w-100">
                        <span className="text-secondary">10% Amount to Pay : </span>
                        <span className="fw-bold">€{selected_offer.commission}</span>
                      </div>
                      <div className="d-flex flex-row align-items-start justify-content-between w-100">
                        <span className="text-secondary">Amount pay to Transporter : </span>
                        <span className="fw-bold">€{selected_offer.price}</span>
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
                      {/* <div className="d-flex flex-row align-items-start justify-content-between w-100">
                        <span className="text-secondary">Delivery Duration : </span>
                        <span>{duration_calculate(selected_offer.delivery_duration, selected_offer.pickup_date)}</span>
                        <span>{duration_calculate(selected_offer.delivery_duration, selected_offer.pickup_date)}</span>
                      </div> */}
                      {/* {selected_offer.office_address && (
                        <>
                          <div className="d-flex flex-row align-items-start justify-content-between w-100">
                            <span className="text-secondary">Office Address : </span>
                            <span>{selected_offer.office_address}</span>
                          </div>
                        </>
                      )} */}
                    </div>

                    {/* <button onClick={() => {
                      axios.post(`${port}/paypal/api/test_api`, {
                        offerId: selected_offer.offer_id,
                        amount: selected_offer.price,
                      }, {
                        headers: {
                          Authorization: token,
                        }
                      }).then((res) => {
                        if (res.data.current_status === true) {
                          showAlert(`Transaction successful: ${res.data.transaction_ID}`);
                        }
                      }).catch((err) => { console.log(err) });
                    }}>test payment button</button>
                     */}
                    <div className="d-flex flex-column w-100 justify-content-center align-items-center">
                      <PaypalPayment
                        key={selected_offer?.offer_id}
                        selected_offer={selected_offer}
                      />

                      <button className="btn btn-danger mt-3  w-100" onClick={() => handleDeleteoffer(selected_offer.offer_id)}>Reject</button>
                    </div>
                  </div>
                </PayPalScriptProvider>

              </div>
            </div>
          </>
        )}

        {activeSection === "companies" && (
          <>
            {userRole === 'Sadmin' && (
              <>
                <div className="bg-light px-md-3" style={{ marginTop: '80px', paddingBottom: '90px', width: '100%', maxWidth: isMobile ? "100%" : "85%", height: '100vh', overflow: 'auto' }}>

                  {isMobile && (
                    <div className="w-100 d-flex justify-content-start">
                      <Menu />
                    </div>
                  )}
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-center w-100 p-2">
                    <div className="d-flex align-items-center justify-content-end w-100 mt-2 mt-md-0">
                      <div className="border-start p-2 border-3 border-dark">
                        <Dropdown>
                          <Dropdown.Toggle className="fs-5 w-100 text-secondary" variant="light" id="dropdown-basic">
                            <FaUserTie /> <strong className="text-capitalize">{userInfo.name}</strong>
                          </Dropdown.Toggle>
                          <Dropdown.Menu align="end">
                            <div className="d-flex flex-column justify-content-center align-items-center gap-2">
                              <button className="btn btn-sm btn-primary mt-1" onClick={() => { setActiveSection('profile_view') }}>Profile information</button>

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
        )}
        {activeSection === "company_detail" && (
          <>

            <div className="bg-light px-md-3" style={{ marginTop: '80px', paddingBottom: '90px', width: '100%', maxWidth: isMobile ? "100%" : "85%", height: '100vh', overflow: 'auto' }}>

              {isMobile && (
                <div className="w-100 d-flex justify-content-start">
                  <Menu />
                </div>
              )}
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center w-100 p-2">
                <div className="d-flex align-items-center justify-content-end w-100 mt-2 mt-md-0">
                  <div className="border-start p-2 border-3 border-dark">
                    <Dropdown>
                      <Dropdown.Toggle className="fs-5 w-100 text-secondary" variant="light" id="dropdown-basic">
                        <FaUserTie /> <strong className="text-capitalize">{userInfo.name}</strong>
                      </Dropdown.Toggle>
                      <Dropdown.Menu align="end">
                        <div className="d-flex flex-column justify-content-center align-items-center gap-2">
                          <button className="btn btn-sm btn-primary mt-1" onClick={() => { userRole === 'admin' ? setActiveSection('company_detail') : setActiveSection('profile_view') }}>Profile information</button>

                          <button className="btn btn-danger btn-sm mt-1" onClick={handel_logout}>Logout</button>
                        </div>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              </div>

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
                            { icon: <FaLocationDot />, label: 'Country', value: selectedCompany.location1?.split(",")[0].trim() || 'Location' },
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
                            { icon: <FaCity />, label: 'State', value: selectedCompany.location1?.split(",")[1]?.trim() || 'Location' },
                            { icon: <FaCity />, label: 'City', value: selectedCompany.location1?.split(",")[2]?.trim() || 'Location' },

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
                            { icon: <FaPaypal />, label: 'Paypal Id', value: selectedCompany?.paypal_id ? selectedCompany.paypal_id : 'N/A' },
                            { icon: <MdSwitchAccount />, label: 'Account Holder Name', value: selectedCompany.account_holder_name ? selectedCompany.account_holder_name : 'N/A' },
                            { icon: <BsBank2 />, label: 'IBA Number', value: selectedCompany.iban_number ? selectedCompany.iban_number : 'N/A' },
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
                                  <span className="text-dark  ms-3">N/A</span>
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
                                      <td className="text-secondary text-start text-md-center">{item.service_type}</td>
                                      <td className="text-secondary text-start text-md-center">{item.region}</td>
                                      <td className="text-secondary text-start text-md-center">{item.countries}</td>
                                      <td className="text-secondary text-start text-md-center">{item.duration}</td>
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
        )}


        {activeSection === "offers" && (
          <>
            <div className="bg-light" style={{ marginTop: '80px', paddingBottom: '90px', width: '100%', maxWidth: isMobile ? "100%" : "85%", height: '100vh', overflow: 'auto' }}>
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
                          <button className="btn btn-sm btn-primary mt-1" onClick={() => { setActiveSection('profile_view') }}>Profile information</button>

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
                        <div className="col-12 col-md-6 col-lg-8">
                          <input type="text" className="shipping-input-field" placeholder="Search here..." onChange={(e) => setOffersearch(e.target.value)} value={offersearch} />
                        </div>

                        <div className="col-12 col-md-6 col-lg-4 position-relative">
                          <input type="date" className="shipping-input-field" placeholder="Pick up date" onChange={(e) => setOfferdate(e.target.value)} value={offerdate} />
                        </div>
                      </div>
                    </div>

                    <div className="table-responsive w-100">

                      <table className="table">
                        <thead>
                          <tr>
                            <th scope="col"><h6>Offer Id</h6></th>
                            <th scope="col"><h6>Product Name</h6></th>
                            <th scope="col"><h6>Date</h6></th>
                            <th scope="col"><h6>Offer Created By</h6></th>
                            <th scope="col"><h6>Price (€)</h6></th>
                            <th scope="col"><h6>Offer From</h6></th>
                            <th scope="col"><h6>Status</h6></th>
                            {/* <th scope="col"><h6>Payment Status ($)</h6></th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {allOffers && allOffers.length > 0 ? (
                            filteredOffers.map((item, index) => (
                              <tr key={index}>
                                <td className="text-primary" style={{ cursor: 'pointer' }} onClick={() => {
                                  if (item.status === 'rejected') {
                                    showAlert("The offer is rejected");
                                    return;
                                  }
                                  show_offer_details(item)
                                }}>#{item.offer_id}</td>
                                <td className="text-secondary">{item.product_name}</td>
                                <td className="text-secondary">
                                  {item.created_at ? new Date(item.created_at).toISOString().split("T")[0] : ""}
                                </td>
                                <td className="text-secondary">{item.userName}</td>
                                <td className="text-dark"><b>{(parseFloat(item.amount) || 0) + (item.commission === 'null' || item.commission == null ? 0 : parseFloat(item.commission))}</b></td>
                                <td className="text-secondary">{item.company_name}</td>
                                <td className="text-secondary"
                                  style={item.status === 'rejected' ? { cursor: 'pointer' } : {}}
                                  onClick={() => { if (item.status === 'rejected') { delete_offer_admin(item.offer_id) } }}
                                >
                                  <span className="px-3 py-2 d-flex flex-column w-100 text-center align-items-center justify-content-center" style={item.status === 'pending' ? { fontWeight: '600', backgroundColor: ' #FFEF9D', color: ' #9B8100' } : item.status === 'rejected' ? { fontWeight: '600', backgroundColor: '#ffcbcb', color: 'rgb(110, 0, 0)' } : { fontWeight: '600', backgroundColor: ' #CBFFCF', color: ' #006E09' }}>{item.status === 'complete' ? 'Accepted' : item.status === 'pending' ? 'Pending' : (<span className="d-flex flex-row text-center align-items-center justify-content-center gap-2 w-100">Rejected <AiFillDelete /></span>)}</span>
                                </td>
                                {/* <td className="text-secondary">
                                  <span
                                    className={`p-2 pe-4 ps-4 fw-bold ${item.status === 'pending' ? 'text-warning' : item.status === 'rejected' ? 'text-danger' : 'text-success'}`}
                                    style={{ backgroundColor: item.status === 'pending' ? 'rgb(255, 242, 128)' : item.status === 'rejected' ? 'rgb(255, 128, 128)' : 'rgb(145, 255, 128)' }}
                                  >
                                    {item.status === 'pending' ? 'Pending' : item.status === 'rejected' ? 'Rejected' : 'Success'}
                                  </span>
                                </td> */}
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
              <div className="bg-light rounded shadow p-4 position-relative border border-2 border-dark "
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

                <div className="d-flex flex-row justify-content-start align-items-start">
                  <div className="m-2 border border-1 border-secondary rounded-1" style={{ width: '10%' }}>
                    <img src={showOfferDetails.img01} alt='' style={{ width: '100%', height: '100%' }} />
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
                      { icon: <SiAnytype />, label: "Amount Received", value: showOfferDetails.payment_info_amount ? showOfferDetails.payment_info_amount : 'N/A' },
                      { icon: <FaWeightScale />, label: "Commission Earned", value: showOfferDetails.commission },
                      { icon: <RiExpandHeightFill />, label: "Payment Status", value: showOfferDetails.payment_info_status ? showOfferDetails.payment_info_status : 'N/A' }
                    ],
                    [
                      { icon: <SiAnytype />, label: "Paid By", value: showOfferDetails.user_email ? showOfferDetails.user_email : 'N/A' },
                      { icon: <FaWeightScale />, label: "Transaction ID", value: showOfferDetails.transaction_id ? showOfferDetails.transaction_id : 'N/A' },
                      { icon: <RiExpandHeightFill />, label: "Offer Status ", value: showOfferDetails.status === 'pending' ? 'Pending' : showOfferDetails.status === 'rejected' ? 'Rejected' : 'Success' }
                    ],
                    [
                      { icon: <SiAnytype />, label: "Company Name", value: showOfferDetails.company_name },
                      { icon: <FaWeightScale />, label: "Company Contact Number", value: showOfferDetails.contect_no },
                      { icon: <RiExpandHeightFill />, label: "Company Email ID", value: showOfferDetails.created_by_email ? showOfferDetails.created_by_email : 'N/A' }
                    ]
                  ].map((row, index) => (
                    <div key={index} className="d-flex flex-column flex-md-row flex-wrap w-100 gap-3 gap-lg-5">
                      {row.map((item, idx) => (
                        <div key={idx} className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
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

                  <div className="d-flex flex-column flex-md-row flex-wrap w-100 gap-3 gap-lg-5 ">
                    {[
                      { icon: <SiAnytype />, label: "Product Type", value: showOfferDetails.product_type },
                      { icon: <FaWeightScale />, label: "Weight", value: `${showOfferDetails.p_weight} Kg` },
                      { icon: <RiExpandHeightFill />, label: "Height", value: `${showOfferDetails.p_height} Cm` }
                    ].map((item, idx) => (
                      <div key={idx} className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
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

                  <div className="d-flex flex-column flex-md-row flex-wrap w-100 gap-3 gap-lg-5 mt-3">
                    {[
                      { icon: <FaRuler />, label: "Length", value: `${showOfferDetails.p_length} Cm` },
                      { icon: <RiExpandWidthFill />, label: "Width", value: `${showOfferDetails.p_width} Cm` }
                    ].map((item, idx) => (
                      <div key={idx} className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
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
                  {/* <div className="d-flex flex-row flex-wrap flex-md-nowrap align-items-between justify-content-start w-100 gap-5"> */}
                  <div className="d-flex flex-column flex-md-row flex-wrap align-items-start justify-content-start w-100 gap-4 gap-md-5">
                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
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

                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
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

                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
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

                  <div className="d-flex flex-column flex-md-row flex-wrap align-items-start justify-content-start w-100 gap-4 gap-md-5 mt-3">
                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
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

                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
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

                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
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


                  <div className="d-flex flex-column flex-md-row flex-wrap align-items-start justify-content-start w-100 gap-4 gap-md-5 mt-3">
                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
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

                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
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

                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
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
                  <div className="d-flex flex-column flex-md-row flex-wrap align-items-start justify-content-start w-100 gap-4 gap-md-5">
                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
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

                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
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

                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
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

                  <div className="d-flex flex-column flex-md-row flex-wrap align-items-start justify-content-start w-100 gap-4 gap-md-5 mt-3">
                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
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

                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
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

                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
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


                  <div className="d-flex flex-column flex-md-row flex-wrap align-items-start justify-content-start w-100 gap-4 gap-md-5 mt-3">
                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
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

                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
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

                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
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
            <div className="bg-light" style={{ marginTop: '80px', paddingBottom: '90px', width: '100%', maxWidth: isMobile ? "100%" : "85%", height: '100vh', overflow: 'auto' }}>
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
                          <button className="btn btn-sm btn-primary mt-1" onClick={() => { setActiveSection('profile_view') }}>Profile information</button>

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
                  <div className="table-filter-wrap">
                    <div className="d-flex flex-column align-items-start justify-content-start ps-2 mb-3 w-100">
                      <h5>Filter By:</h5>
                      <div className="row w-100 g-2 mt-1 ">
                        <div className="col-12 col-md-6 col-lg-8">
                          <input type="text" className="shipping-input-field" placeholder="Search here..." onChange={(e) => setPayment_search(e.target.value)} value={payment_search} />
                        </div>

                        <div className="col-12 col-md-6 col-lg-4 position-relative">
                          <input type="date" className="shipping-input-field" placeholder="Pick up date" onChange={(e) => setPayment_date(e.target.value)} value={payment_date} />
                        </div>
                      </div>
                    </div>

                    <div className="table-responsive w-100">

                      <table className="table">
                        <thead>
                          <tr>
                            <th scope="col"><h6>Offer Id</h6></th>
                            <th scope="col"><h6>Transaction Id</h6></th>
                            <th scope="col"><h6>Payment Receive Date</h6></th>
                            <th scope="col"><h6>Amount (€)</h6></th>
                            <th scope="col"><h6>Commission</h6></th>
                          </tr>
                        </thead>
                        {S_admin_payment && S_admin_payment.length > 0 ? (
                          <tbody>
                            {filteredPayments.map((item, index) => (
                              <tr key={index}>
                                <td className="text-primary" style={{ cursor: 'pointer' }} onClick={() => S_admin_payment_status(item)}>#{item.offer_id}</td>
                                <td className="text-secondary">{item.transaction_id}</td>
                                <td className="text-secondary">{item.payment_time ? new Date(item.payment_time).toISOString().split("T")[0] : ""}</td>
                                <td className="text-secondary">{item.payment_info_amount}</td>
                                <td className="text-secondary">
                                  {(() => {
                                    const T = parseFloat(item.payment_info_amount);
                                    const com = T - (T / commission_percentage);
                                    return com.toFixed(2);
                                  })()}
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
              </div>
              {payment_details && (
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
                        height: '60vh',
                        overflowY: 'auto'
                      }}
                    >
                      <div className="d-flex flex-column justify-content-start align-items-start w-100">
                        <button className="btn btn-danger position-absolute top-0 end-0 m-2" onClick={() => setPayment_details(null)}>
                          ✕
                        </button>
                        <div className="d-flex justify-content-start align-items-center mt-2 ps-3 rounded-1" >
                          <div className="d-flex w-100 justify-content-start">
                            <label className="fs-3"><strong>Payment Details</strong></label>
                          </div>
                        </div>

                        <div className="offer-details-wrap">
                          {[
                            [
                              { icon: <BsBuildingFillCheck />, label: "Company Name", value: payment_details.company_name ? payment_details.company_name : 'N/A' },
                              { icon: <MdAttachEmail />, label: "Company Email", value: payment_details.company_email ? payment_details.company_email : 'N/A' },
                              { icon: <MdPermContactCalendar />, label: "Company Contact No. ", value: payment_details.company_contact ? payment_details.company_contact : 'N/A' }
                            ],
                            [
                              { icon: <FaUserAlt />, label: "User Name", value: payment_details.user_name ? payment_details.user_name : 'N/A' },
                              { icon: <MdAttachEmail />, label: "User Email", value: payment_details.user_email ? payment_details.user_email : 'N/A' },
                              { icon: <FaSackDollar />, label: "Amount Paid", value: payment_details.payment_info_amount ? payment_details.payment_info_amount : 'N/A' }
                            ],
                            [
                              {
                                icon: <PiHandCoinsBold />,
                                label: "Commission Earned",
                                value: payment_details.payment_info_amount
                                  ? (() => {
                                    const T = parseFloat(payment_details.payment_info_amount);
                                    const com = T - (T / commission_percentage);
                                    return com.toFixed(2);
                                  })()
                                  : 'N/A'
                              },
                              { icon: <MdOutlineDateRange />, label: "Payment Date", value: payment_details.payment_time ? new Date(payment_details.payment_time).toISOString().split("T")[0] : 'N/A' },
                              { icon: <PiContactlessPaymentFill />, label: "Payment Status", value: payment_details.payment_info_status ? payment_details.payment_info_status : 'N/A' }
                            ],
                            [
                              {
                                icon: <FaUserAlt />, label: "Amount Bid", value: payment_details.payment_info_amount ? (() => {
                                  const Amount = parseFloat(payment_details.payment_info_amount);
                                  const com = Amount - (Amount / commission_percentage);
                                  const bid = Amount - com;
                                  return bid.toFixed(2);
                                })() : 'N/A'
                              },

                              {
                                icon: <FaUserAlt />, label: "Amount To Pay", value: payment_details.payment_info_amount ? (() => {
                                  const Amount = parseFloat(payment_details.payment_info_amount);
                                  const com = Amount - (Amount / commission_percentage);
                                  const bid = Amount - com;
                                  return bid.toFixed(2);
                                })() : 'N/A'
                              },
                            ]
                          ].map((row, index) => (
                            <div key={index} className="d-flex flex-column flex-md-row flex-wrap w-100 gap-3 gap-lg-5">
                              {row.map((item, idx) => (
                                <div key={idx} className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 super-admin-offer" style={{ width: '30%' }}>
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

                      </div>
                    </div>
                  </div>

                </>
              )}
            </div>
          </>
        )}

        {activeSection === "users" && (
          <>
            <div className="bg-light" style={{ marginTop: '80px', paddingBottom: '90px', width: '100%', maxWidth: isMobile ? "100%" : "85%", height: '100vh', overflow: 'auto' }}>
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
                          <button className="btn btn-sm btn-primary mt-1" onClick={() => { setActiveSection('profile_view') }}>Profile information</button>

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
                                disabled={item.role === 'Sadmin'}
                                style={{ fontSize: '1.5rem' }}>
                                <RiPencilFill />
                              </button>
                              <button className="btn btn-sm btn-light text-danger pt-0 pb-0"
                                onClick={() => handleDeleteUser(item)}
                                disabled={item.role === 'Sadmin'}
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
    </div >
  );
};

export default Dashboard;