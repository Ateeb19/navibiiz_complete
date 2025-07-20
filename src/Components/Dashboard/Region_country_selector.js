import axios from "axios";
import React, { useState, useEffect } from "react";

const Region_countries_selector = ({
  selectedRegion,
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
  const [selectedCountry, setSelectedCountry] = useState("");

  useEffect(() => {
    if (selectedRegion) {
        console.log("this is the region -: ", selectedRegion);
      axios
        .get(`https://restcountries.com/v3.1/region/${selectedRegion}`)
        .then((response) => {
          // restcountries.com v3 API returns an array of objects with `name.common`
          const countryList = response.data.map((c) => ({
            name: c.name.common,
          }));
          setCountries(countryList);
        })
        .catch((err) => console.log(err));
    } else {
      setCountries([]);
    }
  }, [selectedRegion]);

  const handleChange = (event) => {
    const country = event.target.value;
    localStorage.setItem("selectedCountry", country);
    setSelectedCountry(country);
    if (onSelectCountry) {
      onSelectCountry(country);
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

export default Region_countries_selector;
