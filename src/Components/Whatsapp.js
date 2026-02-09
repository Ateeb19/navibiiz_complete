import React from "react";
import { IoLogoWhatsapp } from "react-icons/io";
import { useLocation } from "react-router-dom";

export default function WhatsappFloat() {
    const location = useLocation();

    const handle_whatsapp = () => {
        const phoneNumber = "+4917660906264";
        const message = "Hello, I need a help.";
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank", "noopener,noreferrer");
    };

    // check if route contains /dashboard
    const isDashboardRoute = location.pathname.includes("/dashboard");

    return (
        <button
            onClick={handle_whatsapp}
            className={`whatsapp-float ${isDashboardRoute ? "dashboard-bottom" : ""}`}
            aria-label="Chat on WhatsApp"
        >
            <IoLogoWhatsapp />
        </button>
    );
}
