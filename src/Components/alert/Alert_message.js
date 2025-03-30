import React, { useState, useEffect } from "react";

const Alert = ({ message, onClose = () => {} }) => { 
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      onClose(); 
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div className={`alert-overlay ${visible ? "show" : "hide"}`}>
      <div className="alert-box">{message}</div>
    </div>
  );
};

export default Alert;
