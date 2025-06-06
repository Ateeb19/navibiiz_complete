// import axios from "axios";
// import React, { useState } from "react";

// const State_selector = ({ onSelectState, paddingcount='', fontsizefont='', bgcolor='', bordercolor='', borderradiuscount='', margincount='' }) => {


//     const country = localStorage.getItem('selectedCountry');
//     const [state, setState] = useState([]);
//     axios.post(
//         "https://countriesnow.space/api/v0.1/countries/states",
//         { country },
//         {
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         }
//     )
//         .then((response) => {
//             setState(response.data.data.states);
//         }).catch((err) => console.log(err));


//     const [selectedCountry, setSelectedCountry] = useState("");


//     const handleChange = (event) => {
//         const state = event.target.value;
//         setSelectedCountry(state);
//         if (onSelectState) {
//             onSelectState(state); 
//         }
//     };

//     return (
//         <div className="" style={{ width: 'auto' }}>
//             <select id="state-selector" className='form-select' style={{ backgroundColor: bgcolor, border: bordercolor, borderRadius: borderradiuscount,padding:paddingcount , fontSize: fontsizefont, margin: margincount, fontFamily: 'montserrat', cursor: 'pointer' }} value={selectedCountry} onChange={handleChange}>
//                 <option value="">Select the state</option>
//                 {state.map((state, index) => (
//                     <option key={index} value={state.name}>
//                         {state.name}
//                     </option>
//                 ))}
//             </select>
//         </div>
//     );
// }

// export default State_selector;

import axios from "axios";
import React, { useState, useEffect } from "react";

const State_selector = ({
  selectedCountry,
  onSelectState,
  paddingcount = "",
  fontsizefont = "",
  bgcolor = "",
  bordercolor = "",
  borderradiuscount = "",
  margincount = "",
}) => {
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");

  useEffect(() => {
    if (selectedCountry) {
      axios
        .post(
          "https://countriesnow.space/api/v0.1/countries/states",
          { country: selectedCountry },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          setStates(response.data.data.states || []);
        })
        .catch((err) => console.log(err));
    }
  }, [selectedCountry]); // only runs when selectedCountry changes

  const handleChange = (event) => {
    const state = event.target.value;
    setSelectedState(state);
    if (onSelectState) {
      onSelectState(state);
    }
  };

  return (
    <div className="" style={{ width: "auto" }}>
      <select
        id="state-selector"
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
        value={selectedState}
        onChange={handleChange}
      >
        <option value="">Select the state</option>
        {states.map((state, index) => (
          <option key={index} value={state.name}>
            {state.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default State_selector;
