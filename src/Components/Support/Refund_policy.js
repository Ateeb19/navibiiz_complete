import React from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
const Refund_policy = () => {

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
                        <h2>Refund Policy</h2>
                        <p>At Novibiz, customer satisfaction is important. This Refund Policy explains the conditions under which refunds may be granted and the procedures to request one.</p>
                    </div>
                </section>

                <section className="terms-conditon w-100 mt-5 mb-4">
                    <div className="container">
                        <div className="w-100 terms-condition-wrap">
                            <div className="d-flex flex-column w-100 align-items-start justify-content-start text-start gap-4">
                                <div className="d-flex flex-column w-100 text-start condition gap-2">
                                    <h5>1. Eligibility for Refunds</h5>
                                    <p>Refunds may be considered in the following situations:<br />
                                        If a service purchased on the Novibiz platform was not delivered as described or agreed.<br />
                                        If a shipment or service was canceled by Novibiz or the service provider without user consent.<br />
                                        In case of technical issues that prevent access to purchased services for a prolonged period.<br />
                                        Other exceptional cases evaluated on a case-by-case basis.</p>
                                </div>
                                <div className="d-flex flex-column w-100 text-start condition gap-2">
                                    <h5>2. Non-Refundable Cases</h5>
                                    <p>Refunds will generally not be granted for:<br />
                                        Change of mind or buyer's remorse after service confirmation.<br />
                                        Delays or issues caused by third-party carriers or external factors beyond Novibiz's control.<br />
                                        Partial use or incomplete cancellation of service after acceptance.</p>
                                </div>
                                <div className="d-flex flex-column w-100 text-start condition gap-2">
                                    <h5>3. Refund Request Procedure</h5>
                                    <p>To request a refund, users must:<br />
                                        Contact Novibiz support within 14 calendar days of the issue or service date via <a href="mailto:support@novibiz.com"
                                            style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>support@novibiz.com</a>.<br />
                                        Provide relevant details, such as order number, description of the problem, and any supporting evidence (screenshots, correspondence).</p>
                                </div>
                                <div className="d-flex flex-column w-100 text-start condition gap-2">
                                    <h5>4. Refund Processing</h5>
                                    <p>Upon receiving a refund request, Novibiz will review the case within 7 business days.<br />
                                        If approved, the refund will be processed within 14 calendar days to the original payment method.<br />
                                        Novibiz reserves the right to partially refund or deny refund requests based on the review.</p>
                                </div>
                                <div className="d-flex flex-column w-100 text-start condition gap-2">
                                    <h5>5. Modifications</h5>
                                    <p>Novibiz may update this Refund Policy at any time. Users are encouraged to review the policy regularly.</p>
                                </div>
                                <div className="d-flex flex-column w-100 text-start condition gap-2">
                                    <h5>6. Contact</h5>
                                    <p>For any questions or refund requests, please contact:<br />
                                        Novibiz<br />
                                        Email: <a href="mailto:support@novibiz.com"
                                            style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>support@novibiz.com</a><br />
                                        Address: Kaiserswerther Str. 135, 40474 Düsseldorf</p>
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

export default Refund_policy;