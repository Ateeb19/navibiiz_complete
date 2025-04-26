import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAlert } from "../alert/Alert_message";

const ResetPassword = () => {
    const port = process.env.REACT_APP_SECRET;
    const { token } = useParams();
    const navigate = useNavigate();
    const { showAlert } = useAlert();


    const [form, setForm] = useState({
        password: '',
        confirmpassword: '',
    });


    const handleChange = (e) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${port}/user/reset_password/${token}`, form);
            showAlert(res.data.message);

            if (res.data.status === true) {
                navigate('/login')
            }
        } catch (err) {
            showAlert('You are Offline! Please Connect to Internet');
        }
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center reset-password-wrapper"
        >
            <div className="p-4 shadow bg-white rounded reset-password-wrap">
                <div className='title-head w-100'>
                    <h3 className="text-center mb-4">Reset Your Password</h3>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3 text-start w-100">
                        <label className="input-label">New Password <span className='text-danger'>*</span></label>
                        <input
                            type="password"
                            name="password"
                            className="input-field w-100"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3 text-start w-100">
                        <label className="input-label">Confirm New Password <span className='text-danger'>*</span></label>
                        <input
                            type="password"
                            name="confirmpassword"
                            className="input-field w-100"
                            value={form.confirmpassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
