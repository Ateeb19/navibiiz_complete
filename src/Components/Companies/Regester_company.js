import React, { useState } from "react";
import { CountrySelect, StateSelect, CitySelect } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";

const RegisterCompany = () => {
    const [companyName, setCompanyName] = useState("");
    const [countryCount, setCountryCount] = useState(0);
    const [countries, setCountries] = useState([]);

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
                        cities: Array.from({ length: count }, () => null)
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
                country: country.country,
                states: country.states.map(state => ({
                    state: state.state,
                    cities: state.cities
                }))
            }))
        };
        console.log(JSON.stringify(data, null, 2));
    };

    return (
        <div className="container d-flex align-items-center justify-content-center vh-70">
            <div className="card p-4 shadow-lg" style={{ width: "100%", maxWidth: "800px" }}>
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

                <div className="mb-3 text-start">
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
                        <div key={countryIndex} className="border p-2 mb-3">
                            <h5>Country {countryIndex + 1}</h5>
                            <CountrySelect
                                onChange={(e) => handleCountryChange(countryIndex, e)}
                                placeHolder="Select Country"
                                className="form-control"
                            />

                            <div className="mb-3 text-start">
                                <label htmlFor={`states_number_${countryIndex}`} className="form-label fs-5">
                                    Number of states in country {countryIndex + 1}
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id={`states_number_${countryIndex}`}
                                    value={country.statesCount}
                                    onChange={(e) => handleStateCountChange(countryIndex, parseInt(e.target.value, 10))}
                                    required
                                />
                            </div>

                            <div>
                                {country.states.map((state, stateIndex) => (
                                    <div key={stateIndex} className="mb-2">
                                        <StateSelect
                                            countryid={country.country?.id}
                                            onChange={(e) => handleStateChange(countryIndex, stateIndex, e)}
                                            placeHolder="Select State"
                                            className="form-control"
                                        />

                                        <div className="mb-3 text-start">
                                            <label htmlFor={`cities_number_${countryIndex}_${stateIndex}`} className="form-label fs-6">
                                                Number of cities in state {stateIndex + 1}
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id={`cities_number_${countryIndex}_${stateIndex}`}
                                                value={state.citiesCount}
                                                onChange={(e) => handleCityCountChange(countryIndex, stateIndex, parseInt(e.target.value, 10))}
                                                required
                                            />
                                        </div>

                                        <div>
                                            {Array.from({ length: state.citiesCount }, (_, cityIndex) => (
                                                <div key={cityIndex} className="mb-2">
                                                    <CitySelect
                                                        countryid={country.country?.id}
                                                        stateid={state.state?.id}
                                                        onChange={(e) => console.log(`City selected: ${e.name}`)}
                                                        placeHolder="Select City"
                                                        className="form-control"
                                                    />
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