import React, { useEffect, useState } from "react";

const Test = () => {
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
                console.log(countries);
            })
            .catch(error => console.log('error', error));
    }, []);

    return (
        <>
            <h1>This is test</h1>
            <ul>
                {countries.map((country, index) => (
                    <li key={index}>{country.name}</li>
                ))}
            </ul>
        </>
    );
};

export default Test;
