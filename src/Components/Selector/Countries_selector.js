// import axios from "axios";
// import React, { useState } from "react";

// const Countries_selector = ({ onSelectCountry, label = 'Select the country', bgcolor = '#d6d6d6', bordercolor = '1px solid #d6d6d6', margincount = '0px', paddingcount = '3px', borderradiuscount = '0', fontsizefont = '', width = 'auto' }) => {

//     const [countries, setCountries] = useState([]);
//     axios.get('https://countriesnow.space/api/v0.1/countries/positions')
//         .then((response) => {
//             setCountries(response.data.data);
//         }).catch();

//     const [selectedCountry, setSelectedCountry] = useState("");
//     const handleChange = (event) => {
//         const country = event.target.value;
//         localStorage.setItem('selectedCountry', country);
//         setSelectedCountry(country);
//         if (onSelectCountry) {
//             onSelectCountry(country);
//         }
//     };
//     return (
//         <div className="w-100" style={{ width: width }}>
//             <select id="country-selector" className='form-select' style={{ backgroundColor: bgcolor, border: bordercolor, borderRadius: borderradiuscount, padding: paddingcount, fontSize: fontsizefont, margin: margincount, fontFamily: 'montserrat', cursor: 'pointer' }} value={selectedCountry} onChange={handleChange}>
//                 <option value="">{label}</option>
//                 {countries.map((country, index) => (
//                     <option key={index} value={country.name}>
//                         {country.name}
//                     </option>
//                 ))}
//             </select>
//         </div>
//     );
// }

// export default Countries_selector;

import React, { useState, useEffect } from "react";
import { getCountries } from "@yusifaliyevpro/countries"; //  New package

const Countries_selector = ({
    onSelectCountry,
    label = "Select the country",
    bgcolor = "#d6d6d6",
    bordercolor = "1px solid #d6d6d6",
    margincount = "0px",
    paddingcount = "3px",
    borderradiuscount = "0",
    fontsizefont = "",
    width = "auto",
}) => {
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        const headers = new Headers();
        headers.append("X-CSCAPI-KEY", "a1hSc1BTUGlyQk5PWmx6eWtuSDMxOG50OGNHZGdoTXl2TGx3SXRBYw==");

        const requestOptions = {
            method: 'GET',
            headers: headers,
            redirect: 'follow'
        };

        fetch("https://api.countrystatecity.in/v1/countries", requestOptions)
            .then(response => response.json()) // parse JSON here
            .then(data => {
                setCountries(data); // set the country data
                // console.log(countries);
            })
            .catch(error => console.log('error', error));
    }, []);

    const [selectedCountry, setSelectedCountry] = useState("");

    const handleChange = (event) => {
        const countryName = event.target.value;

        // Set selected country name
        setSelectedCountry(countryName);

        // Find the selected country object by name
        const selected = countries.find(country => country.name === countryName);

        if (selected) {
            // Save iso2 in localStorage
            localStorage.setItem("selectedCountry", selected.iso2);

            // Optional: pass name to parent
            if (onSelectCountry) {
                onSelectCountry(countryName);
            }
        }
    };


    return (
        <div className="w-100" style={{ width: width }}>
            <select
                id="country-selector"
                className="form-select"
                style={{
                    backgroundColor: bgcolor,
                    border: bordercolor,
                    borderRadius: borderradiuscount,
                    padding: paddingcount,
                    fontSize: fontsizefont,
                    margin: margincount,
                    fontFamily: "montserrat",
                    cursor: "pointer",
                }}
                value={selectedCountry}
                onChange={handleChange}
            >
                <option value="">{label}</option>
                {countries.map((country, index) => (
                    <option key={index} value={country.name}>
                        {country.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Countries_selector;
