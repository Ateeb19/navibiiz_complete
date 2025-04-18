// import logo from './logo.svg';
import React, { useEffect, useState, useRef } from 'react';
import './App.css';
// import { Nav } from 'react-bootstrap';
import { IoMdHome } from "react-icons/io";
import { MdDashboardCustomize } from "react-icons/md";
import { Link, Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import LoginPage from './Components/User/LoginPage';
// import Regester_company from './Components/Companies/Regester_company';
// import newRegester_company from './Components/Companies/newregester';
// import Companies from './Components/Companies/Companies';
// import { TbUserPentagon } from "react-icons/tb";
import Home from './Components/New_update/home';
// import Containers from './Components/New_update/Container';
// import Groupage from './Components/New_update/Groupage';
// import Cars from './Components/New_update/Cars';
// import SendTransport from './Components/New_update/Send_Transport';
import CompleateDashbboard from './Components/Dashboard/Dashboard';
import Regesteration from './Components/Dashboard/Check ';
import axios from 'axios';
import CompaniesList from './Components/New_update/CompaniesList';
import send_groupage from './Components/send_groupage/Send_groupage';
import Offers from './Components/New_update/Offers';
import CompanyDetails from './Components/New_update/Companies_details';
import Notification from './Components/New_update/Notification';
import Regester_company from './Components/Regester/Regester_company';
import ScrollToTop from "./ScrollToTop";
import Navbar from './Components/Navbar/Navbar';
import About_us from './Components/New_update/About_us';
import { AlertProvider } from "./Components/alert/Alert_message";
import ResetPassword from './Components/User/ResetPassword';
import useInactivityLogout from "./Components/Activity_check/Activity_check";



const AppContent = () => {
  useInactivityLogout();

  return (
    <div className="App">
      <ScrollToTop />
      <Routes>
        <Route Component={CompleateDashbboard} path='/dashboard' />
        <Route Component={Home} path='/' />
        <Route Component={Offers} path='/offers' />
        <Route Component={CompaniesList} path='/companies_list' />
        <Route Component={send_groupage} path='/send_groupage' />
        <Route Component={Notification} path='/notification' />
        <Route Component={Regester_company} path='/register_company' />
        <Route Component={About_us} path='/about_us' />
        <Route Component={LoginPage} path='/login' />
        <Route Component={ResetPassword} path='/reset_password/:token' />
        <Route path="/company_details/:id" element={<CompanyDetails />} />
      </Routes>
    </div>
  );
};


const App = () => {
  const port = process.env.REACT_APP_SECRET;
  // useInactivityLogout();
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isMobileView, setMobileView] = useState(false);
  const sidebarRef = useRef(null);
  const toggleButtonRef = useRef(null);

  const userRole = localStorage.getItem('userRole');
  // console.log(userRole);
  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 900);
      if (window.innerWidth >= 900) {
        setSidebarVisible(false); // Reset sidebar state for larger screens
      }
    };

    handleResize(); // Initialize on component mount
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target) &&
      toggleButtonRef.current &&
      !toggleButtonRef.current.contains(event.target)
    ) {
      setSidebarVisible(false);
    }
  };

  const handleNavItemClick = () => {
    setSidebarVisible(false);
  };

  useEffect(() => {
    if (isSidebarVisible) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isSidebarVisible]);



  //company inof
  const displayCompany = () => {
    axios.get(`${port}/company/display_company`)
      .then((response) => {
        if(response.data.status){
          localStorage.setItem('companyInfo', JSON.stringify(response.data.message));
        }else{
          localStorage.setItem('companyInfo', '');
        }
      }).catch((err) => { console.log('error', err); localStorage.setItem('companyInfo', ''); });
  }
  useEffect(() => {
    displayCompany();
  }, [])



  return (
    <>
      <AlertProvider>
        <AppContent />
        {/* <div className="App">
            <div className="d-flex flex-column" style={{ width: "100" }}>
              <ScrollToTop />
              <Routes>
                <Route Component={CompleateDashbboard} path='/dashboard'></Route>
                <Route Component={Home} path='/'></Route>
                <Route Component={Offers} path='/offers'></Route>
                <Route Component={CompaniesList} path='/companies_list'></Route>
                <Route Component={send_groupage} path='/send_groupage'></Route>
                <Route Component={Notification} path='/notification'></Route>
                <Route Component={Regester_company} path='/register_company'></Route>
                <Route Component={About_us} path='/about_us'></Route>
                <Route Component={LoginPage} path='/login'></Route>
                <Route Component={ResetPassword} path='/reset_password/:token'></Route>
                <Route path="/company_details/:id" element={<CompanyDetails />} />
              </Routes>
            </div>
          </div> */}
      </AlertProvider>
    </>

  );
}

export default App;
