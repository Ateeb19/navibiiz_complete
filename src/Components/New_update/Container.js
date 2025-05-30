import React, { useEffect, useState } from "react";
import { RiArrowUpDownFill } from "react-icons/ri";
import { FaAnglesDown } from "react-icons/fa6";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Navbar from "../Navbar/Navbar";


const Containers = () => {
    const port = process.env.REACT_APP_SECRET;

    const [isMobileView, setMobileView] = useState(false);
    const [mode, setMode] = useState('online');

    useEffect(() => {
        const handleResize = () => {
            setMobileView(window.innerWidth < 900);
        };

        handleResize(); // Initialize on component mount
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    // console.log(isMobileView);

    // console.log(localStorage.getItem('companyInfo').length);
    const [company_info, setCompany_info] = useState([]);
    const companies = () => {
        if (localStorage.getItem('companyInfo').length > 0) {
            setCompany_info(JSON.parse(localStorage.getItem('companyInfo')));
        }

    }
    useEffect(() => {
        companies();
    }, [])
    const [expandedCompanyId, setExpandedCompanyId] = useState(null);

    const toggleDetails = (id) => {
        setExpandedCompanyId((prev) => (prev === id ? null : id));
    };
    // console.log(company_info.length);
    const filteredCompanies = company_info.filter((item) => item.container_service === "1");

    const [shipFrom, setShipFrom] = useState("");
    const [shipTo, setShipTo] = useState("");
    const [duration, setDuration] = useState(""); // State for duration filter

    const filteredAndSearchedCompanies = filteredCompanies.filter((company) =>
        company.Countries.some(
            (country) =>
                (shipFrom === "" || country.ship_from.toLowerCase().includes(shipFrom.toLowerCase())) &&
                (shipTo === "" || country.ship_to.toLowerCase().includes(shipTo.toLowerCase())) &&
                (duration === "" || parseInt(country.duration) == parseInt(duration))
        )
    );
    return (
        <div>
            <div className=" d-flex justify-content-end ">
                <Navbar />
            </div>
            <h2 className="text-uppercase">container</h2>
            <div>
                {
                    mode === 'offline' ?
                        <div class="bg-danger bg-gradient p-1" role="alert">
                            <h6>You are in offline mode or some issue with connection!</h6>
                        </div> :
                        null
                }
            </div>
            <div className="d-flex flex-column justify-content-center align-items-center ">
                <div className={`${isMobileView ? '' : 'mt-5 p-3 row'} `}>
                    <div className={`${isMobileView ? 'd-flex justify-content-center align-items-center' : 'col-5'}`}>
                        <div className="d-flex column align-items-center">
                            <div className="ms-3 d-flex flex-column">
                                <h3>From</h3>
                                <input type='text' placeholder="Country" className=" mt-1 mb-1 form-control" value={shipFrom} onChange={(e) => setShipFrom(e.target.value)} />
                                {/* <input type='text' placeholder="State" className=" mt-1 mb-1 form-control" />
                                <input type='text' placeholder="City" className=" mt-1 mb-1 form-control" /> */}
                            </div>
                        </div>
                    </div>

                    <div className={`${isMobileView ? 'd-flex justify-content-center align-items-center' : 'col-2 mt-5'} `}>
                        <h2><RiArrowUpDownFill /></h2>
                    </div>

                    <div className={`${isMobileView ? 'd-flex justify-content-center align-items-center' : 'col-5'}`}>
                        <div className="d-flex column align-items-center">
                            <div className="ms-3 d-flex flex-column">
                                <h3>To</h3>
                                <input type='text' placeholder="Country" className=" mt-1 mb-1 form-control" value={shipTo} onChange={(e) => setShipTo(e.target.value)} />
                                {/* <input type='text' placeholder="State" className=" mt-1 mb-1 form-control" />
                                <input type='text' placeholder="City" className=" mt-1 mb-1 form-control" /> */}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-row">
                    <h4>Duration Days</h4> <input type='text' placeholder="Days" className=" mt-1 mb-1 form-control" value={duration} onChange={(e) => setDuration(e.target.value)} />
                </div>

                <div className='container py-3 row'>
                    {filteredAndSearchedCompanies.length > 0 ? (
                        filteredAndSearchedCompanies.map((item, index) => (
                            <div key={index} className={`${isMobileView ? 'col-12' : 'col-3'}`}>
                                <Card className="mb-4 shadow" key={item.id}>
                                    <Card.Header className="bg-primary text-white">{item.company_name}</Card.Header>
                                    <Card.Body>
                                        <Card.Text className="text-start">
                                            <strong>Email:</strong> {item.email} <br />
                                            <strong>Contact No:</strong> {item.contect_no} <br />
                                            <strong>Website:</strong>{" "}
                                            <a href={item.webSite_url} target="_blank" rel="noopener noreferrer">
                                                {item.webSite_url}
                                            </a> <br />
                                            <strong>Address:</strong> {item.address} <br />
                                            <strong className="col-3">Services:-</strong>
                                            <div className="d-flex flex-row">
                                                <strong className="col-4 ms-1 me-1">{item.container_service === '1' && "Conotainer"}</strong>
                                                <strong className="col-4 ms-1 me-1">{item.groupage_service === '1' && "Groupage"}</strong>
                                                <strong className="col-4 ms-1 me-1">{item.car_service === '1' && "Car"}</strong>
                                            </div>
                                        </Card.Text>
                                        <Button
                                            variant="primary"
                                            onClick={() => toggleDetails(item.id)}
                                        >
                                            {expandedCompanyId === item.id ? "Hide Countries" : "Show Countries"}
                                        </Button>
                                    </Card.Body>

                                    {expandedCompanyId === item.id && (
                                        <Card.Footer>
                                            <h6 className="text-secondary">Country Details</h6>
                                            {item.Countries.map((country, index) => (
                                                <Card key={index} className="mb-3">
                                                    <Card.Body>
                                                        <Card.Text>
                                                            <strong>Ship From:</strong> {country.ship_from} <br />
                                                            <strong>Ship To:</strong> {country.ship_to} <br />
                                                            <strong>Duration:</strong> {country.duration} <br />
                                                            {/* <strong>Date:</strong> {country.date} */}
                                                        </Card.Text>
                                                    </Card.Body>
                                                </Card>
                                            ))}
                                        </Card.Footer>
                                    )}
                                </Card>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-muted">No companies available with container service.</div>
                    )}
                </div>
            </div>

            <div className="" style={{ width: "100%" }}>
            </div>
        </div>
    )
}

export default Containers;