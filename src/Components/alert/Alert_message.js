import { createContext, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const showAlert = (message) => {
    toast(message, {
      autoClose: 2500, 
      progressClassName: "custom-progress-bar",
    });
  };
  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <ToastContainer />
    </AlertContext.Provider>
  );
};

// Custom hook to use the alert function anywhere
export const useAlert = () => useContext(AlertContext);
