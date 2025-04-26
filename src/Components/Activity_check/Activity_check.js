import { useEffect, useRef } from "react";
import { useAlert } from "../alert/Alert_message";
import { useNavigate } from "react-router-dom";

const useInactivityLogout = () => {
    const navigate = useNavigate();
    const timer = useRef(null);
    const { showAlert } = useAlert();
    const resetTimer = () => {
        if (timer.current) clearTimeout(timer.current);

        timer.current = setTimeout(() => {
            localStorage.removeItem("token");
            showAlert("User logout since no activity for 2 Hours")
            navigate('/');
        }, 2 * 60 * 60 * 1000); 
    };

    useEffect(() => {
        const events = ["mousemove", "keydown", "click", "scroll"];

        events.forEach(event =>
            window.addEventListener(event, resetTimer)
        );

        resetTimer();

        return () => {
            events.forEach(event =>
                window.removeEventListener(event, resetTimer)
            );
            if (timer.current) clearTimeout(timer.current);
        };
    }, []);
};

export default useInactivityLogout;
