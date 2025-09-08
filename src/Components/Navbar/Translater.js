import React from "react";

import { useTranslation } from "react-i18next";

const Translater = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <>
            <div className="d-flex align-items-start justify-content-start gap-4 ">
                <button onClick={() => changeLanguage("en")}>English</button>
                <button onClick={() => changeLanguage("fr")}>Français</button>
            </div>
        </>
    )
}


export default Translater;