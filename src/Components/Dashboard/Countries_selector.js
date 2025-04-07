import axios from "axios";
import React, { useState } from "react";

const Countries_selector = ({ onSelectCountry, label='Select the country', bgcolor='#d6d6d6', bordercolor= '1px solid #d6d6d6', margincount = '0px', paddingcount = '3px' ,borderradiuscount='0', fontsizefont ='', width = 'auto' }) => {

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
        <div className="w-100" style={{width: width}}>
            <select id="country-selector" className='form-select' style={{backgroundColor: bgcolor, border: bordercolor, borderRadius: borderradiuscount,padding:paddingcount , fontSize: fontsizefont, margin: margincount, fontFamily: 'montserrat', cursor: 'pointer' }} value={selectedCountry} onChange={handleChange}>
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

