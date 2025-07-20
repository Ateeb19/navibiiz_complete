import axios from "axios";
import React, { useState } from "react";

const Region_selector = ({ onSelectRegion, label='Select the Region', bgcolor='#d6d6d6', bordercolor= '1px solid #d6d6d6', margincount = '0px', paddingcount = '3px' ,borderradiuscount='0', fontsizefont ='', width = 'auto' }) => {

    const [region, setReion] = useState([
        'Africa',
        'Asia',
        'Europe',
        'North America',
        'South America',
        'Oceania',
        'Caribbean',
        'Central America',
    ]);
    // axios.get('https://countriesnow.space/api/v0.1/countries/positions')
    // .then((response) => {
    //     setCountries(response.data.data);
    // }).catch();
    const [selectedRegion, setSelectedRegion] = useState("");
    const handleChange = (event) => {
        const region = event.target.value;
        localStorage.setItem('selectedRigiion', region);
        setSelectedRegion(region);
        if (onSelectRegion) {
            onSelectRegion(region);  
        }
    };
    return (
        <div className="w-100" style={{width: width}}>
            <select id="region-selector" className='form-select' style={{backgroundColor: bgcolor, border: bordercolor, borderRadius: borderradiuscount,padding:paddingcount , fontSize: fontsizefont, margin: margincount, fontFamily: 'montserrat', cursor: 'pointer' }} value={selectedRegion} onChange={handleChange}>
                <option value="">{label}</option>
                {region.map((region,index) => (
                    <option key={index} value={region}>
                        {region}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default Region_selector;

