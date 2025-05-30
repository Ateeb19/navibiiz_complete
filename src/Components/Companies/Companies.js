import React, { useEffect, useState } from "react";
import { LuChevronsDown } from "react-icons/lu";

import './Companies.css';
const Companies = () => {
    const [data, setData] = useState([]);
    const [countriesData, setCountriesData] = useState([]);
    const [mode, setMode] = useState('online');

    const [searchTerm, setSearchTerm] = useState("");
    const filteredData = data.filter(
        (item) =>
            (typeof item.name === "string" && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            // (typeof item.email === "string" && item.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            // (typeof item.phone === "string" && item.phone.includes(searchTerm)) ||
            (typeof item.lastName === "string" && item.lastName.toLowerCase().includes(searchTerm.toLowerCase()))

    );

    const [expandedRow, setExpandedRow] = useState(null);
    const handleRowClick = (index) => {
        setExpandedRow(expandedRow === index ? null : index); // Toggle the expanded row
    };

    const [selectedCountry, setSelectedCountry] = useState(null); // State to track the selected country
    const [detailsPosition, setDetailsPosition] = useState({ top: 0, left: 0 });
    const handleCountryClick = (event, country) => {
        // setExpandeDiv(expandedDiv === country ? null : country); // Toggle the expanded row
        const rect = event.target.getBoundingClientRect();
        setDetailsPosition({
            top: rect.bottom + window.scrollY, // Position below the clicked element
            left: rect.left + window.scrollX, // Align with the left of the clicked element
        });
        // setSelectedCountry(selectedCountry === country ? null: country);
        setSelectedCountry(country);
    };


    const userdata = () => {
        // let url = 'https://jsonplaceholder.typicode.com/users';
        let url = 'https://dummyjson.com/users';
        fetch(url).then((response) => {
            response.json().then((result) => {
                setData(result.users);
                localStorage.setItem("users", JSON.stringify(result.users));
            })
        }).catch((err) => {
            let collection = localStorage.getItem('users');
            setData(JSON.parse(collection));
            setMode('offline');
        })
    }

    const countries = () => {
        let url = 'https://countriesnow.space/api/v0.1/countries/info?returns=currency';
        fetch(url).then((response) => {
            response.json().then((result) => {
                let data = result.data.slice(0, 20);
                setCountriesData(data);
                localStorage.setItem("countries", JSON.stringify(data));
            })
        }).catch((err) => {
            let collection = localStorage.getItem('countries');
            setCountriesData(JSON.parse(collection));
            setMode('offline');
        })
    }
    useEffect(() => {
        userdata();
        countries();
    }, [])

    return (
        <div className="container-fluid company-outter-div">
            <h2 className="mb-4">Shipping Companies List</h2>
            <div>
                {
                    mode === 'offline' ?
                        <div class="bg-danger bg-gradient p-1" role="alert">
                            <h6>You are in offline mode or some issue with connection!</h6>
                        </div> :
                        null
                }
            </div>

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by Name, Country"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="company-list">

                <div className="table-responsive">

                    <table className="table table-bordered table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>S/N</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Countries</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <tr key={index}
                                            onClick={() => handleRowClick(index)}>
                                            <td>{index + 1}</td>
                                            <td>{typeof item.firstName === "string" ? item.firstName : "N/A"}</td>
                                            <td>{typeof item.email === "string" ? item.email : "N/A"}</td>
                                            <td>{typeof item.phone === "string" ? item.phone : "N/A"}</td>
                                            <td onClick={(e) =>
                                                handleCountryClick(e, item.firstName)
                                            }>
                                                {typeof item.lastName === "string" ? (
                                                    <>
                                                        <LuChevronsDown className="me-2 text-primary" />
                                                        <span
                                                            style={{ color: "blue", cursor: "pointer" }}
                                                        >
                                                            {item.lastName}
                                                        </span>
                                                    </>
                                                ) : (
                                                    "N/A"
                                                )}
                                            </td>
                                        </tr>

                                        {/* Dynamic Div Below the Row */}
                                        {expandedRow === index && (
                                            <>
                                                <tr>
                                                    <td colSpan="5">
                                                        <div className="pt-1 border bg-dark fw-normal text-light">
                                                            <h5>{item.firstName || "N/A"} Company sectors</h5>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colSpan="5">
                                                        <div className="pt-1 border bg-info fw-normal text-light">
                                                            <h5>Container</h5>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colSpan="5">
                                                        <div className="pt-1 border bg-info fw-normal text-light">
                                                            <h5>Groupage</h5>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colSpan="5">
                                                        <div className="pt-1 border bg-info fw-normal text-light">
                                                            <h5>Cars</h5>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </>
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        No matching records found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {selectedCountry && (
                    <div className="details-box position-absolute p-3 border border-secondary rounded"
                        style={{
                            top: `${detailsPosition.top}px`,
                            left: `${detailsPosition.left}px`,
                            backgroundColor: "rgba(0, 0, 0, 0.76)",
                            color: "white",
                            width: "9rem",
                            zIndex: 10,
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        }}
                    >
                        <button
                            type="button"
                            className="btn-close position-absolute"
                            aria-label="Close"
                            onClick={() => setSelectedCountry(null)}
                            style={{
                                top: "2px",
                                right: "2px",
                                backgroundColor: "red",
                            }}
                        ></button>
                        <h4>Countries-:</h4>
                        <ul className="list-group">
                            {countriesData.map((country, index) => (
                                <li key={index} className="list-group">
                                    {country.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

            </div>
        </div>
    )
}

export default Companies;