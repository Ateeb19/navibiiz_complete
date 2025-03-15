import axios from "axios";
import React, { useState } from "react";

const Countries_selector = ({ onSelectCountry, label='Select the country', bgcolor='rgb(214, 214, 214)' }) => {

    const [countries, setCountries] = useState([]);
    axios.get('https://countriesnow.space/api/v0.1/countries/positions')
    .then((response) => {
        // console.log(response.data.data);
        setCountries(response.data.data);
    }).catch((err) => console.log(err));
    const [selectedCountry, setSelectedCountry] = useState("");
    const handleChange = (event) => {
        const country = event.target.value;
        localStorage.setItem('selectedCountry', country);
        setSelectedCountry(country);
        if (onSelectCountry) {
            onSelectCountry(country);  
        }
    };
    return (
        <div className="w-100" style={{width: 'auto'}}>
            <select id="country-selector" className='form-select' style={{backgroundColor: bgcolor}} value={selectedCountry} onChange={handleChange}>
                <option value="">{label}</option>
                {countries.map((country,index) => (
                    <option key={index} value={country.name}>
                        {country.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default Countries_selector;

