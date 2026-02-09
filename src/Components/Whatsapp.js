import React from "react";
import { IoLogoWhatsapp } from "react-icons/io";
export default function WhatsappFloat() {
    const handle_whatsapp = () => {
        const phoneNumber = "+4917660906264";
        const message = "Hello, I need a help.";

        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <button
            onClick={handle_whatsapp}
            className="whatsapp-float"
            aria-label="Chat on WhatsApp"
        >
            < IoLogoWhatsapp />
        </button>
    );
}
