import React from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
const Terms_conditions = () => {

    return (
        <>
            <div className="d-flex flex-column align-items-center justify-content-center mt-5 pt-5">
                <div className='navbar-wrapper'>
                    <div className=" d-flex justify-content-center w-100">
                        <Navbar />
                    </div>
                </div>
                <section className="terms-condition-weapper">
                    <div className="title-head-terms w-100 d-flex flex-column align-items-center justify-content-center">
                        <h2>Terms and Conditions (General Terms and Conditions) </h2>
                        <p>Last Updated Jun 1, 2025</p>
                    </div>
                </section>

                <section className="terms-conditon w-100 mt-5 mb-4">
                    <div className="container">
                        <div className="w-100 terms-condition-wrap">
                            <div className="d-flex flex-column w-100 align-items-start justify-content-start text-start gap-4">
                                <div className="d-flex flex-column w-100 text-start condition gap-2">
                                    <h5>1. Introduction</h5>
                                    <p>Novibiz is a digital platform that connects individuals and businesses seeking to ship goods with transport providers offering available space in their containers.</p>
                                </div>
                                <div className="d-flex flex-column w-100 text-start condition gap-2">
                                    <h5>2. Scope of Application</h5>
                                    <p>These Terms and Conditions govern the use of the Novibiz  platform by all users, including both shippers and transport providers.</p>
                                </div>
                                <div className="d-flex flex-column w-100 text-start condition gap-2">
                                    <h5>3. Account Registration</h5>
                                    <p>All users must create an account to access the platform's features.<br />
                                        Information provided must be accurate, current, and complete.<br />
                                        Users are responsible for maintaining the confidentiality of their login credentials.</p>
                                </div>
                                <div className="d-flex flex-column w-100 text-start condition gap-2">
                                    <h5>4. Platform Use</h5>
                                    <p>Shippers can post transport requests and compare offers.<br />
                                        Transport providers can list available container space.<br />
                                        Novibiz acts solely as an intermediary and is not involved in the actual transport process.</p>
                                </div>
                                <div className="d-flex flex-column w-100 text-start condition gap-2">
                                    <h5>5. Liability</h5>
                                    <p>Novibiz is not liable for losses, damages, or disputes arising between users.<br />
                                        Users are solely responsible for complying with applicable local and international laws concerning goods transportation.</p>
                                </div>
                                <div className="d-flex flex-column w-100 text-start condition gap-2">
                                    <h5>6. Payments and Fees</h5>
                                    <p>Novibiz may charge a commission on bookings made through the platform.<br />
                                        Payment terms are clearly stated for each transaction.</p>
                                </div>
                                <div className="d-flex flex-column w-100 text-start condition gap-2">
                                    <h5>7. User Content and Conduct</h5>
                                    <p>t is strictly prohibited to post illegal, misleading, or offensive content.<br />
                                        Novibiz reserves the right to suspend or delete accounts that violate these rules.
                                    </p>
                                </div>
                                <div className="d-flex flex-column w-100 text-start condition gap-2">
                                    <h5>8. Data Protection</h5>
                                    <p>Personal data is handled in accordance with our Privacy Policy.<br />
                                        No personal data will be sold to third parties without prior consent.</p>
                                </div>
                                <div className="d-flex flex-column w-100 text-start condition gap-2">
                                    <h5>9. Changes to the Terms</h5>
                                    <p>Novibiz reserves the right to update these Terms and Conditions at any time. Users will be notified via email or directly on the platform.</p>
                                </div>
                                <div className="d-flex flex-column w-100 text-start condition gap-2">
                                    <h5>10. Governing Law</h5>
                                    <p>These Terms and Conditions are governed by German law. In case of legal disputes, the competent courts in Germany shall have jurisdiction.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="w-100 mt-5">
                    <Footer />
                </div>
            </div>
        </>
    )
};

export default Terms_conditions;