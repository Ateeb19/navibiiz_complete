import axios from "axios";
import React, { useState } from "react";

const State_selector = ({ onSelectState, paddingcount='', fontsizefont='', bgcolor='', bordercolor='', borderradiuscount='', margincount='' }) => {


    const country = localStorage.getItem('selectedCountry');
    const [state, setState] = useState([]);
    axios.post(
        "https://countriesnow.space/api/v0.1/countries/states",
        { country },
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    )
        .then((response) => {
            // console.log(response.data.data.states);
            setState(response.data.data.states);
        }).catch((err) => console.log(err));


    const [selectedCountry, setSelectedCountry] = useState("");


    const handleChange = (event) => {
        const state = event.target.value;
        setSelectedCountry(state);
        if (onSelectState) {
            onSelectState(state);  // Call the callback function with the selected country
        }
    };

    return (
        <div className="" style={{ width: 'auto' }}>
            <select id="state-selector" className='form-select' style={{ backgroundColor: bgcolor, border: bordercolor, borderRadius: borderradiuscount,padding:paddingcount , fontSize: fontsizefont, margin: margincount, fontFamily: 'montserrat', cursor: 'pointer' }} value={selectedCountry} onChange={handleChange}>
                <option value="">Select the state</option>
                {state.map((state, index) => (
                    <option key={index} value={state.name}>
                        {state.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default State_selector;

