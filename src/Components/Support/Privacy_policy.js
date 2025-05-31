import React from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
const Privacy_policy = () => {

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
                        <h2>Privacy Policy </h2>
                        <p>This Privacy Policy explains how Novibiz collects, uses, protects, and shares personal information of users on its platform. Protecting your personal data is a priority for Novibiz, which complies with applicable laws, including the General Data Protection Regulation (GDPR).</p>
                    </div>
                </section>

                <section className="terms-conditon w-100 mt-5 mb-4">
                    <div className="container">
                        <div className="w-100 terms-condition-wrap">
                            <div className="d-flex flex-column w-100 align-items-start justify-content-start text-start gap-4">
                                <div className="d-flex flex-column w-100 text-start condition gap-2">
                                    <h5>1. Data Collection</h5>
                                    <p>Novibiz collects various types of personal data when users register, browse, or use the services on the platform, including:<br />
                                        Identification information: name, email address, phone number, postal address.<br />
                                        Professional information: company type, industry, geographic location.<br />
                                        Shipment details: package descriptions, photos, pickup and delivery addresses.<br />
                                        Payment data: bank or card details used for transactions.<br />
                                        Technical data: IP address, browser type, connection data, cookies, and similar technologies.</p>
                                </div>
                                <div className="d-flex flex-column w-100 text-start condition gap-2">
                                    <h5>2. Use of Data</h5>
                                    <p>Collected data is used for the following purposes:<br />
                                        Creating, managing, and using user accounts.<br />
                                        Facilitating connections between shippers and carriers.<br />
                                        Handling financial transactions on the platform.<br />
                                        Improving the operation, security, and performance of Novibiz.<br />
                                        Communicating with users about orders, offers, or customer support.<br />
                                        Sending marketing communications or newsletters, with prior user consent.</p>
                                </div>
                                <div className="d-flex flex-column w-100 text-start condition gap-2">
                                    <h5>3. Data Sharing</h5>
                                    <p>Novibiz does not sell personal data to third parties. However, some data may be shared with partners or service providers for:<br />
                                        Payment processing (banks, payment providers).<br />
                                        Hosting and technical maintenance.<br />
                                        Marketing and communication services, only with user consent.<br />
                                        Legal authorities when required by law.<br />
                                        All partners are bound by strict confidentiality and security obligations.</p>
                                </div>
                                <div className="d-flex flex-column w-100 text-start condition gap-2">
                                    <h5>4. Data Security</h5>
                                    <p>Novibiz implements appropriate technical and organizational measures to protect personal data against accidental or unlawful destruction, loss, alteration, unauthorized disclosure, or access.</p>
                                </div>
                                <div className="d-flex flex-column w-100 text-start condition gap-2">
                                    <h5>5. Data Retention</h5>
                                    <p>Personal data is retained only as long as necessary for the purposes collected, including account and transaction management, or to comply with legal and tax obligations.</p>
                                </div>
                                <div className="d-flex flex-column w-100 text-start condition gap-2">
                                    <h5>6. User Rights</h5>
                                    <p>Under GDPR, users have the following rights regarding their personal data:<br />
                                        Right of access: obtain a copy of data held.<br />
                                        Right to rectification: correct inaccurate or incomplete data.<br />
                                        Right to erasure: request deletion under certain conditions.<br />
                                        Right to restrict processing: limit the use of data.<br />
                                        Right to object: oppose certain data processing, especially marketing.<br />
                                        Right to data portability: receive data in a structured, commonly used format.<br />
                                        To exercise these rights, users may contact Novibiz at <a href="mailto:privacy@novibiz.com "
                                            style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>privacy@novibiz.com</a>.</p>
                                </div>
                                <div className="d-flex flex-column w-100 text-start condition gap-2">
                                    <h5>7. Cookies and Similar Technologies</h5>
                                    <p>Novibiz uses cookies to enhance user experience, analyze site usage, and personalize content. Users can manage cookie preferences via their browser settings.</p>
                                </div>
                                <div className="d-flex flex-column w-100 text-start condition gap-2">
                                    <h5>8. Policy Changes</h5>
                                    <p>Novibiz reserves the right to update this Privacy Policy at any time. Changes will be posted on the platform with an updated date. Users are encouraged to review it regularly.</p>
                                </div>
                                <div className="d-flex flex-column w-100 text-start condition gap-2">
                                    <h5>9. Contact</h5>
                                    <p>For questions about data protection, please contact:<br />
                                        Novibiz<br />
                                        Email: <a href="mailto:privacy@novibiz.com "
                                            style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>privacy@novibiz.com </a><br />
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

export default Privacy_policy;