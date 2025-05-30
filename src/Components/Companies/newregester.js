import React, { useEffect, useState } from "react";
import { CountrySelect, StateSelect, CitySelect } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";

const RegisterCompany = () => {
    const [companyName, setCompanyName] = useState("");
    const [countryCount, setCountryCount] = useState(0);
    const [countries, setCountries] = useState([]);
    const [isSidebarVisible, setSidebarVisible] = useState(false);


    useEffect(() => {
        const handleResize = () => {
            // setMobileView(window.innerWidth < 900);
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
    // Add countries dynamically based on countryCount
    const handleAddCountries = () => {
        const count = parseInt(countryCount, 10);
        if (!isNaN(count) && count > 0) {
            const newCountries = Array.from({ length: count }, (_, index) => ({
                id: index,
                country: null,  // Initialize country as null
                statesCount: 0,
                states: []
            }));
            setCountries(newCountries);
        }
    };

    // Update selected country for a specific country index
    const handleCountryChange = (index, selectedCountry) => {
        setCountries(prevCountries => prevCountries.map((country, i) =>
            i === index ? { ...country, country: selectedCountry } : country
        ));
    };

    // Update number of states for a specific country
    const handleStateCountChange = (countryIndex, count) => {
        setCountries(prevCountries => prevCountries.map((country, i) =>
            i === countryIndex ? {
                ...country,
                statesCount: count,
                states: Array.from({ length: count }, (_, index) => ({
                    id: index,
                    state: null,
                    citiesCount: 0,
                    cities: []
                }))
            } : country
        ));
    };

    // Update selected state for a specific state index within a country
    const handleStateChange = (countryIndex, stateIndex, selectedState) => {
        setCountries(prevCountries => prevCountries.map((country, i) =>
            i === countryIndex ? {
                ...country,
                states: country.states.map((state, j) =>
                    j === stateIndex ? { ...state, state: selectedState } : state
                )
            } : country
        ));
    };

    // Update number of cities for a specific state within a country
    const handleCityCountChange = (countryIndex, stateIndex, count) => {
        setCountries(prevCountries => prevCountries.map((country, i) =>
            i === countryIndex ? {
                ...country,
                states: country.states.map((state, j) =>
                    j === stateIndex ? {
                        ...state,
                        citiesCount: count,
                        cities: Array.from({ length: count }, () => ({
                            city: null,
                            branchDetails: {
                                email: "",
                                contactNo: "",
                                address: "",
                                phone_code: "",
                                check: [],
                                expectedDays: "",
                                expectedHours: ""
                            }
                        }))
                    } : state
                )
            } : country
        ));
    };

    // Update selected city for a specific city index within a state
    const handleCityChange = (countryIndex, stateIndex, cityIndex, selectedCity) => {
        setCountries(prevCountries => prevCountries.map((country, i) =>
            i === countryIndex ? {
                ...country,
                states: country.states.map((state, j) =>
                    j === stateIndex ? {
                        ...state,
                        cities: state.cities.map((city, k) =>
                            k === cityIndex ? { ...city, city: selectedCity } : city
                        )
                    } : state
                )
            } : country
        ));
    };

    // Update branch details for a specific city
    const handleBranchDetailsChange = (countryIndex, stateIndex, cityIndex, key, value) => {
        setCountries(prevCountries => prevCountries.map((country, i) =>
            i === countryIndex ? {
                ...country,
                states: country.states.map((state, j) =>
                    j === stateIndex ? {
                        ...state,
                        cities: state.cities.map((city, k) =>
                            k === cityIndex ? {
                                ...city,
                                branchDetails: {
                                    ...city.branchDetails,
                                    [key]: value
                                }
                            } : city
                        )
                    } : state
                )
            } : country
        ));
    };

    // Compile all data into JSON format
    const compileDataToJson = () => {
        const data = {
            companyName,
            countries: countries.map(country => ({
                country: country.country?.name,
                states: country.states.map(state => ({
                    state: state.state?.name,
                    cities: state.cities.map(city => ({
                        city: city.city?.name,
                        branchDetails: city.branchDetails
                    }))
                }))
            }))
        };
        console.log(data);
        // console.log(JSON.stringify(data, null, 2));
    };

    return (
        <div className="container d-flex align-items-center justify-content-center vh-70">
            <div className={`card p-2 shadow-lg`} style={{ width: "700px", maxWidth: "700px" }}>
                <h2 className="text-center mb-4 shadow pb-1">Register Company</h2>

                <div className="mb-3 text-start">
                    <label htmlFor="company_name" className="form-label fs-5">Company Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="company_name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-1 text-start">
                    <div className="row">
                        <div className="col-3">
                            <label htmlFor="countries_number" className="form-label fs-5">
                                Number of countries
                            </label>
                        </div>
                        <div className="col-3">
                            <input
                                type="number"
                                className="form-control"
                                id="countries_number"
                                placeholder="Number"
                                value={countryCount}
                                onChange={(e) => setCountryCount(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-2">
                            <button
                                type="button"
                                className="btn btn-info"
                                onClick={handleAddCountries}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    {countries.map((country, countryIndex) => (
                        <div key={countryIndex} className="p-2 mb-5 border border-dark border-3" style={{ backgroundColor: 'rgba(0, 216, 115, 0.45)' }}>
                            <h5>{country.country?.name} Country {countryIndex + 1}</h5>
                            <div className="row p-1">
                                <div className="col-4">
                                    <CountrySelect
                                        onChange={(e) => handleCountryChange(countryIndex, e)}
                                        placeHolder="Select Country"
                                        className="form-control"
                                    />
                                </div>
                                <div className="col-5">
                                    <label htmlFor={`states_number_${countryIndex}`} className="form-label fs-5">
                                        Number of states in {country.country?.name}
                                    </label>
                                </div>
                                <div className="col-3">
                                    <input
                                        type="number"
                                        className="form-control"
                                        id={`states_number_${countryIndex}`}
                                        value={country.statesCount}
                                        onChange={(e) => handleStateCountChange(countryIndex, parseInt(e.target.value, 10))}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                {country.states.map((state, stateIndex) => (
                                    <div key={stateIndex} className="mb-2 p-1" style={{ backgroundColor: 'rgba(0, 101, 216, 0.45)' }}>
                                        <h5>{country.country?.name} state {state.state?.name}</h5>
                                        <div className="row">
                                            <div className="col-4">
                                                <StateSelect
                                                    countryid={country.country?.id}
                                                    onChange={(e) => handleStateChange(countryIndex, stateIndex, e)}
                                                    placeHolder="Select State"
                                                    className="form-control"
                                                />
                                            </div>
                                            <div className="col-5">
                                                <label htmlFor={`cities_number_${countryIndex}_${stateIndex}`} className="form-label fs-6">
                                                    Number of cities in {state.state?.name}
                                                </label>
                                            </div>
                                            <div className="col-3">
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id={`cities_number_${countryIndex}_${stateIndex}`}
                                                    value={state.citiesCount}
                                                    onChange={(e) => handleCityCountChange(countryIndex, stateIndex, parseInt(e.target.value, 10))}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            {Array.from({ length: state.citiesCount }, (_, cityIndex) => (
                                                <div key={cityIndex} className="mb-2 p-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.29)' }}>
                                                    <h5>{state.state?.name} city info</h5>
                                                    <div className="row">
                                                        <div className="col-4">
                                                            <CitySelect
                                                                countryid={country.country?.id}
                                                                stateid={state.state?.id}
                                                                onChange={(e) => handleCityChange(countryIndex, stateIndex, cityIndex, e)}
                                                                placeHolder="Select City"
                                                                className="form-control"
                                                            />
                                                        </div>
                                                        <div className="col-7 ms-3 border border-2">
                                                            <div className="text-center">
                                                                <h5>Branch details</h5>
                                                            </div>
                                                            <div className="mb-1 text-start">
                                                                <div className="row">
                                                                    <div className="col-3">
                                                                        <label htmlFor={`branch_email_${countryIndex}_${stateIndex}_${cityIndex}`} className="form-label fs-5">Email</label>
                                                                    </div>
                                                                    <div className="col-9">
                                                                        <input
                                                                            type="email"
                                                                            className="form-control"
                                                                            id={`branch_email_${countryIndex}_${stateIndex}_${cityIndex}`}
                                                                            value={state.cities[cityIndex].branchDetails.email}
                                                                            onChange={(e) => handleBranchDetailsChange(countryIndex, stateIndex, cityIndex, 'email', e.target.value)}
                                                                            required
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="row">
                                                                    <div className="col-3">
                                                                        <label htmlFor={`branch_contact_${countryIndex}_${stateIndex}_${cityIndex}`} className="form-label fs-5">Contact No.</label>
                                                                    </div>
                                                                    <div className="col-9 mt-2 d-flex">
                                                                        <input type="text" className="form-control p-1 me-1" value={`+${country.country?.phone_code}`} readOnly style={{ width: '50px' }}
                                                                            onChange={(e) => handleBranchDetailsChange(countryIndex, stateIndex, cityIndex, 'phone_code', country.country?.phone_code)} />
                                                                        <input
                                                                            type="telephone"
                                                                            className="form-control p-1"
                                                                            onChange={(e) => handleBranchDetailsChange(countryIndex, stateIndex, cityIndex, 'contactNo', e.target.value)} />
                                                                    </div>
                                                                    <div className="col-7 mt-2">
                                                                    </div>
                                                                </div>

                                                                <div className="row">
                                                                    <div className="col-3">
                                                                        <label htmlFor={`branch_address_${countryIndex}_${stateIndex}_${cityIndex}`} className="form-label fs-5">Address</label>
                                                                    </div>
                                                                    <div className="col-9">
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            id={`branch_address_${countryIndex}_${stateIndex}_${cityIndex}`}
                                                                            value={state.cities[cityIndex].branchDetails.address}
                                                                            onChange={(e) => handleBranchDetailsChange(countryIndex, stateIndex, cityIndex, 'address', e.target.value)}
                                                                            required
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="row m-1">
                                                                    <div className="col-3 p-1">
                                                                        <label htmlFor="branch_check" className="form-label fs-5">Check</label>
                                                                    </div>
                                                                    <div className="col-9 p-1 bg-light rounded-3">
                                                                        <div className="btn-group" role="group" aria-label="Basic checkbox toggle button group">
                                                                            <input type="checkbox" className="btn-check" id={`btncheck1_${countryIndex}_${stateIndex}_${cityIndex}`} autoComplete="off" />
                                                                            <label className="btn btn-outline-primary" htmlFor={`btncheck1_${countryIndex}_${stateIndex}_${cityIndex}`}>Container</label>

                                                                            <input type="checkbox" className="btn-check" id={`btncheck2_${countryIndex}_${stateIndex}_${cityIndex}`} autoComplete="off" />
                                                                            <label className="btn btn-outline-primary" htmlFor={`btncheck2_${countryIndex}_${stateIndex}_${cityIndex}`}>Groupage</label>

                                                                            <input type="checkbox" className="btn-check" id={`btncheck3_${countryIndex}_${stateIndex}_${cityIndex}`} autoComplete="off" />
                                                                            <label className="btn btn-outline-primary" htmlFor={`btncheck3_${countryIndex}_${stateIndex}_${cityIndex}`}>Cars</label>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="p-1 m-1 border border-1 text-center">
                                                                    <h6>Expected days and hours from other countries-:</h6>
                                                                    <table className="table table-bordered table-striped">
                                                                        <thead className="table-dark">
                                                                            <tr>
                                                                                <th>Countries</th>
                                                                                <th>Days</th>
                                                                                <th>Hours</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {countries.slice(0, -1).map((country, countryIndex) => (
                                                                                <tr key={countryIndex}>
                                                                                    <td>Country {country.id + 1}</td>
                                                                                    <td><input type="text" className="form-control" value={state.cities[cityIndex].branchDetails.expectedDays} onChange={e => handleBranchDetailsChange(countryIndex, stateIndex, cityIndex, 'expectedDays', e.target.value)} /></td>
                                                                                    <td><input type="text" className="form-control" value={state.cities[cityIndex].branchDetails.expectedHours} onChange={e => handleBranchDetailsChange(countryIndex, stateIndex, cityIndex, 'expectedHours', e.target.value)} /></td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <button className="btn btn-primary" onClick={compileDataToJson}>
                        Print JSON Data
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegisterCompany;