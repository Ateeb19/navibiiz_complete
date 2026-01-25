import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import { FaBoxOpen, FaUsers, FaUserTie } from "react-icons/fa";
import { MdDashboard, MdKeyboardDoubleArrowDown, MdPayment } from "react-icons/md";
import { FaUserGear } from "react-icons/fa6";
import { RiSecurePaymentFill } from "react-icons/ri";
import { BsBuildingsFill } from "react-icons/bs";
import axios from "axios";
import Navbar from "../Navbar/Navbar";

const Dashboard_layout = () => {
    const port = process.env.REACT_APP_SECRET;
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 800);
    const location = useLocation();
    const [activeSection, setActiveSection] = useState(() => {
        return localStorage.getItem("activeSection") || "dashboard";
    });

    useEffect(() => {
        const path = location.pathname;

        if (path === "/dashboard") setActiveSection("dashboard");
        else if (path.startsWith("/dashboard/admin/companies")) setActiveSection("companies");
        else if (path.startsWith("/dashboard/admin/offers")) setActiveSection("offers");
        else if (path.startsWith("/dashboard/admin/payment")) setActiveSection("payments");
        else if (path.startsWith("/dashboard/admin/roles")) setActiveSection("users");
        else if (path.startsWith("/dashboard/orders")) setActiveSection("orders");
        else if (path.startsWith("/dashboard/offers")) setActiveSection("user_offers");
        else if (path.startsWith("/dashboard/payment")) setActiveSection("payment_history");
    }, [location.pathname]);

    const activeStyle = (key) =>
        activeSection === key
            ? {
                backgroundColor: "#06536e",
                borderRadius: "5px",
                borderRight: "4px solid white",
                textAlign: "left",
            }
            : { textAlign: "left" };


    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 800);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const user_info = () => {
        axios.get(`${port}/user/display_profile`, {
            headers: {
                Authorization: token,
            }
        }).then((response) => {
            setUserInfo(response.data.message);
        }).catch((err) => { console.log(err) });
    }

    const handel_logout = () => {
        localStorage.setItem('userRole', 'user');
        localStorage.setItem('token', '');
        localStorage.setItem('userInfo', '');
        localStorage.setItem('valid', '');
        localStorage.removeItem('activeSection');
        // window.location.reload();
        user_info();
        navigate('/')
    }


    useEffect(() => {
        user_info();
    }, [])
    const Menu = () => {
        const [showMenu, setShowMenu] = useState(false);
        const [selectedItem, setSelectedItem] = useState('Dashboard');

        useEffect(() => {
            const path = location.pathname;

            if (path === "/dashboard") setSelectedItem("Dashboard");
            else if (path.startsWith("/dashboard/admin/companies")) setSelectedItem("Companies");
            else if (path.startsWith("/dashboard/admin/offers")) setSelectedItem("Offers");
            else if (path.startsWith("/dashboard/admin/payment")) setSelectedItem("Payments");
            else if (path.startsWith("/dashboard/admin/roles")) setSelectedItem("Roles & Permissions");
            else if (path.startsWith("/dashboard/orders")) setSelectedItem("Orders");
            else if (path.startsWith("/dashboard/offers")) setSelectedItem("Offers");
            else if (path.startsWith("/dashboard/payment")) setSelectedItem("Payment History");
        }, [location.pathname]);

        return (
            <div className="d-flex flex-column align-items-center position-relative" style={{ backgroundColor: ' #00232f', width: "100%", }}>
                <div className="d-flex align-items-center justify-content-between p-3 w-100 text-white" onClick={() => setShowMenu(!showMenu)} style={{ cursor: "pointer", borderBottom: "1px solid white" }}>
                    <span>{selectedItem}</span>
                    <MdKeyboardDoubleArrowDown size={24} />
                </div>
                {showMenu && (
                    <div className="position-absolute text-white w-100 p-3" style={{ backgroundColor: ' #00232f', top: "50px", zIndex: 1000 }}>
                        <ul className="nav flex-column mt-4 fs-4 w-100">
                            <li className="nav-item mb-4 text-start"
                                // style={activeSection === 'dashboard' ? { backgroundColor: "06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}
                                style={activeStyle("dashboard")}
                            >
                                <Link to="/dashboard" className="nav-link text-white" >
                                    <MdDashboard /> Dashboard
                                </Link>
                            </li>

                            {userRole === 'Sadmin' ? (
                                <>
                                    <li className="nav-item mb-4 text-start"
                                        // style={activeSection === 'companies' ? { backgroundColor: "06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}
                                        style={activeStyle("companies")}
                                    >
                                        <Link to="/dashboard/admin/companies" className="nav-link text-white" >
                                            <BsBuildingsFill /> Companies
                                        </Link>
                                    </li>
                                    <li className="nav-item mb-4 text-start"
                                        // style={activeSection === 'offers' ? { backgroundColor: "06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}
                                        style={activeStyle("offers")}
                                    >
                                        <Link to="/dashboard/admin/offers" className="nav-link text-white" >
                                            <FaUsers /> Offers
                                        </Link>
                                    </li>
                                    <li className="nav-item mb-4 text-start"
                                        // style={activeSection === 'payments' ? { backgroundColor: "06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}
                                        style={activeStyle("payments")}
                                    >
                                        <Link to="/dashboard/admin/payment" className="nav-link text-white" >
                                            <RiSecurePaymentFill /> Payments
                                        </Link>
                                    </li>
                                    <li className="nav-item mb-4 text-start"
                                        // style={activeSection === 'users' ? { backgroundColor: "06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}
                                        style={activeStyle("users")}
                                    >
                                        <Link to="/dashboard/admin/roles" className="nav-link text-white">
                                            <FaUserGear /> Roles & Permissions
                                        </Link>
                                    </li>
                                </>
                            ) : (

                                <>
                                    {userRole === 'user' && (
                                        <>
                                            <li className="nav-item mb-4 text-start"
                                                // style={activeSection === 'orders' ? { backgroundColor: "06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}
                                                style={activeStyle("orders")}
                                            >
                                                <Link to="/dashboard/orders" className="nav-link text-white" >
                                                    <FaBoxOpen /> Orders
                                                </Link>
                                            </li>
                                        </>
                                    )}
                                    <li className="nav-item mb-4 text-start"
                                        // style={activeSection === 'user_offers' ? { backgroundColor: "06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}
                                        style={activeStyle("user_offers")}
                                    >
                                        <Link to="/dashboard/offers" className="nav-link text-white" >
                                            <MdPayment /> Offers
                                        </Link>
                                    </li>
                                    {userRole === 'user' && (
                                        <>
                                            <li className="nav-item mb-4 text-start"
                                                // style={activeSection === 'payment_history' ? { backgroundColor: "06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}
                                                style={activeStyle("payment_history")}
                                            >
                                                <Link to="/dashboard/payment" className="nav-link text-white">
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
        <div className="d-flex flex-column align-items-start justify-content-start w-100" style={{
            marginTop: '80px',
            height: '91vh',
            overflow: isMobile ? 'auto' : 'hidden'
        }}>
            <div className='navbar-wrapper'>
                <div className=" d-flex justify-content-center w-100">
                    <Navbar />
                </div>
            </div>
            <div className="d-flex flex-row align-items-center justify-content-end bg-light w-100" style={{ height: '100%' }}>
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
                                        <li className="nav-item mb-4 text-start"
                                            // style={activeSection === 'dashboard' ? { backgroundColor: "#06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}
                                            style={activeStyle("dashboard")}
                                        >
                                            <Link to="/dashboard" className="nav-link text-white sidebar-links" >
                                                <MdDashboard /> Dashboard
                                            </Link>
                                        </li>

                                        {userRole === 'Sadmin' ? (
                                            <>
                                                <li className="nav-item mb-4 text-start"
                                                    // style={(activeSection === 'companies' && 'company_detail') ? { backgroundColor: "#06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}
                                                    style={activeStyle("companies")}
                                                >
                                                    <Link to="/dashboard/admin/companies" className="nav-link text-white sidebar-links" >
                                                        <BsBuildingsFill /> Companies
                                                    </Link>
                                                </li>
                                                <li className="nav-item mb-4 text-start"
                                                    // style={activeSection === 'offers' ? { backgroundColor: "#06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}
                                                    style={activeStyle("offers")}
                                                >
                                                    <Link to="/dashboard/admin/offers" className="nav-link text-white sidebar-links">
                                                        <FaUsers /> Offers
                                                    </Link>
                                                </li>
                                                <li className="nav-item mb-4 text-start"
                                                    // style={activeSection === 'payments' ? { backgroundColor: "#06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}
                                                    style={activeStyle("payments")}
                                                >
                                                    <Link to="/dashboard/admin/payment" className="nav-link text-white sidebar-links" >
                                                        <RiSecurePaymentFill /> Payments
                                                    </Link>
                                                </li>
                                                <li className="nav-item mb-4 text-start"
                                                    // style={activeSection === 'users' ? { backgroundColor: "#06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}
                                                    style={activeStyle("users")}
                                                >
                                                    <Link to="/dashboard/admin/roles" className="nav-link text-white sidebar-links">
                                                        <FaUserGear /> Roles & Permissions
                                                    </Link>
                                                </li>
                                            </>
                                        ) : (
                                            <>
                                                {userRole === 'user' && (
                                                    <>
                                                        <li className="nav-item mb-4 text-start"
                                                            // style={activeSection === 'orders' ? { backgroundColor: "#06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}
                                                            style={activeStyle("orders")}
                                                        >
                                                            <Link to="/dashboard/orders" className="nav-link text-white sidebar-links">
                                                                <FaBoxOpen /> Orders
                                                            </Link>
                                                        </li>
                                                    </>
                                                )}
                                                <li className="nav-item mb-4 text-start"
                                                    //  style={activeSection === 'user_offers' ? { backgroundColor: "#06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}
                                                    style={activeStyle("user_offers")}
                                                >
                                                    <Link to="/dashboard/offers" className="nav-link text-white sidebar-links">
                                                        <MdPayment /> Offers
                                                    </Link>
                                                </li>
                                                {userRole === 'user' && (
                                                    <>
                                                        <li className="nav-item mb-4 text-start"
                                                            //  style={activeSection === 'payment_history' ? { backgroundColor: "#06536e", textAlign: 'left', borderRadius: '5px', borderRight: '4px solid white' } : { textAlign: 'left' }}
                                                            style={activeStyle("payment_history")}
                                                        >
                                                            <Link to="/dashboard/payment" className="nav-link text-white sidebar-links">
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

                <div className="bg-light" style={{
                    width: '100%', maxWidth: isMobile ? "100%" : "85%", height: '100%'

                }} >

                    {isMobile && (
                        <div className="w-100 d-flex justify-content-start">
                            <Menu />
                        </div>
                    )}

                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center w-100 p-2" style={{ backgroundColor: '#f6f6f6' }}>
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
                                            <button className="btn btn-sm btn-primary mt-1" onClick={() => { setActiveSection('profile_view'); navigate('/dashboard/profile') }}>Profile information</button>
                                            <button className="btn btn-danger btn-sm mt-1" onClick={handel_logout}>Logout</button>
                                        </div>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                    <div className="w-100" style={{ overflow: 'auto', height: '100%' }}>
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard_layout;