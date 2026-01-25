import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import '../src/assets/css/style.css'
import '../src/assets/css/responsive.css'
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import LoginPage from './Components/User/LoginPage';
import Home from './Components/Main_component/home';
import Dashboard_layout from './Components/Dashboard/Dashboard_layout';
import Dashboard from './Components/Dashboard/Dashboard';
import axios from 'axios';
import CompaniesList from './Components/Main_component/CompaniesList';
import Send_groupage from './Components/send_groupage/Send_groupage';
import Offers from './Components/Main_component/Offers';
import CompanyDetails from './Components/Main_component/Companies_details';
import Notification from './Components/Main_component/Notification';
import Regester_company from './Components/Regester_company/Regester_company';
import ScrollToTop from "./ScrollToTop";
import About_us from './Components/Main_component/About_us';
import { AlertProvider } from "./Components/alert/Alert_message";
import ResetPassword from './Components/User/ResetPassword';
import useInactivityLogout from "./Components/Activity_check/Activity_check";
import Terms_conditions from './Components/Support/Terms_conditions';
import Privacy_policy from './Components/Support/Privacy_policy';
import Refund_policy from './Components/Support/Refund_policy';
import Contact_us from './Components/Main_component/Contact_us.';
import Companies from './Components/Dashboard/Super_admin/Companies';
import Offers_super from './Components/Dashboard/Super_admin/Offers';
import Payment from './Components/Dashboard/Super_admin/Payment';
import Roles from './Components/Dashboard/Super_admin/Roles';
import Profile from './Components/Dashboard/Profile/Profile';
import Orders from './Components/Dashboard/Admin_User/Orders';
import Offers_user from './Components/Dashboard/Admin_User/Offers';
import Payment_user from './Components/Dashboard/Admin_User/Payment';
import Companies_detail from './Components/Dashboard/Super_admin/Companies_detail';
// import Test from './Components/Dashboard/Test'
const AppContent = () => {
  useInactivityLogout();

  return (
    <div className="App">
      <ScrollToTop />
      <Routes>
        {/* <Route Component={Test} path='/test' /> */}
        <Route path='/dashboard' element={<Dashboard_layout />}>
          <Route index element={<Dashboard />} />
          <Route path='admin/companies' element={<Companies />} />
          <Route path='admin/companies/:id' element={<Companies_detail />} />
          <Route path='admin/offers' element={<Offers_super />} />
          <Route path='admin/payment' element={<Payment />} />
          <Route path='admin/roles' element={<Roles />} />
          <Route path='profile' element={<Profile />} /> 
          <Route path='orders' element={<Orders />} /> 
          <Route path='offers' element={<Offers_user />} /> 
          <Route path='payment' element={<Payment_user />} />
        </Route>
        <Route Component={Home} path='/' />
        <Route Component={Offers} path='/offers' />
        {/* <Route Component={CompaniesList} path='/transporters_list' /> */}
        {/* <Route Component={send_groupage} path='/send_groupage' /> */}
        <Route path="/send_groupage" element={<Navigate to="/send_groupage/item" />} />
        <Route path="/send_groupage/:type" element={<Send_groupage />} />
        <Route Component={Notification} path='/notification' />
        <Route Component={Regester_company} path='/register_company' />
        <Route Component={About_us} path='/about_us' />
        <Route Component={LoginPage} path='/login' />
        <Route Component={Terms_conditions} path='/terms_conditions' />
        <Route Component={Privacy_policy} path='/privacy_policy' />
        <Route Component={Refund_policy} path='/refund_policy' />
        <Route Component={Contact_us} path='/contact_us' />
        <Route Component={ResetPassword} path='/reset_password/:token' />
        <Route path="/transporter_details/:id" element={<CompanyDetails />} />
      </Routes>
    </div>
  );
};


const App = () => {
  const port = process.env.REACT_APP_SECRET;
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isMobileView, setMobileView] = useState(false);
  const sidebarRef = useRef(null);
  const toggleButtonRef = useRef(null);

  const userRole = localStorage.getItem('userRole');
  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 900);
      if (window.innerWidth >= 900) {
        setSidebarVisible(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


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

  const displayCompany = () => {
    axios.get(`${port}/company/display_company`)
      .then((response) => {
        if (response.data.status) {
          localStorage.setItem('companyInfo', JSON.stringify(response.data.message));
        } else {
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
      </AlertProvider>
    </>

  );
}

export default App;
