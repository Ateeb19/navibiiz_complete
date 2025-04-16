import React, { useState } from "react";
import Regester from '../Dashboard/Registration';
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
const Regester_company = () => {

    return (
        <div className="regester-wrapper w-100">
            <div className='navbar-wrapper'>
                <div className=" d-flex justify-content-center w-100">
                    <Navbar />
                </div>
            </div>
            <div className="container regester-wrap">
                <Regester />
            </div>

            <div>
                <Footer/>
            </div>
        </div>
    )

}

export default Regester_company;