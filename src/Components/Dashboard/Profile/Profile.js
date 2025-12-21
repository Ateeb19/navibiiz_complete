import React, { useEffect, useState } from "react";
import { FaUserCheck, FaUserTie } from "react-icons/fa";
import { GoPencil } from "react-icons/go";
import { MdAlternateEmail, MdOutlineKey } from "react-icons/md";
import { RiPencilFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import { useAlert } from "../../alert/Alert_message";
import axios from "axios";

const Profile = () => {
    const port = process.env.REACT_APP_SECRET;
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const { showAlert } = useAlert();
    const [change_password, setChange_password] = useState(false);
    const [confirm_password, setConfirm_password] = useState('');
    const [previous_password, setPrevious_password] = useState('');
    const [new_password, setNew_password] = useState('')
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [updatedValue, setUpdatedValue] = useState('');
    const [editingField, setEditingField] = useState('');
    const [previousValue, setPreviousValue] = useState('');
    const [editField, setEditField] = useState({ label: '', previousValue: '' });
    const [userInfo, setUserInfo] = useState('');
    const userRole = localStorage.getItem('userRole');
    const [handle_profile_edit, setHandle_profile_edit] = useState(false);
    const [profile_edit, setProfile_edit] = useState(false);
    const [change_password_admin, setChange_password_admin] = useState(false);


    useEffect(() => {
        if (!token) {
            navigate('/');
        }
        if (userRole !== 'admin' && userRole !== 'Sadmin' && userRole !== 'user') {
            navigate('/');
        } else {
            axios.get(`${port}/user/display_profile`, {
                headers: {
                    Authorization: token,
                }
            }).then((response) => {
                setUserInfo(response.data.message);
            }).catch((err) => { console.log(err) });
        }
    }, [userRole]);

    const get_user_info = () => {
        if (!token) {
            navigate('/');
        }
        if (userRole !== 'admin' && userRole !== 'Sadmin' && userRole !== 'user') {
            navigate('/');
        } else {
            axios.get(`${port}/user/display_profile`, {
                headers: {
                    Authorization: token,
                }
            }).then((response) => {
                setUserInfo(response.data.message);
            }).catch((err) => { console.log(err) });
        }
    }

    const handleEditClick = (field) => {
        setEditingField(field);
        setPreviousValue(userInfo[field]);
        setUpdatedValue('');
        setShowEditPopup(true);
    };
    const handel_logout = () => {
        localStorage.setItem('userRole', 'user');
        localStorage.setItem('token', '');
        localStorage.setItem('userInfo', '');
        localStorage.setItem('valid', '');
        localStorage.removeItem('activeSection');
        get_user_info();
        navigate('/');
    }
    const handle_change_password = () => {
        setChange_password(!change_password);
    }
    const handleFieldUpdate = () => {
        if (!updatedValue) {
            showAlert('Please enter a value to update.');
            return;
        }

        if (editingField === 'email') {
            const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatedValue);
            if (!isValidEmail) {
                showAlert('Please enter a valid email address!');
                return;
            }
        }

        axios.put(`${port}/user/update_name`, {
            editNameInput: updatedValue,
        }, {
            headers: {
                Authorization: token,
            }
        }).then((response) => {
            showAlert(response.data.message);
            setShowEditPopup(false);
            get_user_info();
        }).catch((error) => {
            console.error('Error updating field:', error);
            showAlert('Failed to update the field.');
        });
    };

    const query_update_password = () => {
        if (previous_password === '' || new_password === '' || confirm_password === '') {
            showAlert('Please fill all the fields.');
        } else {
            if (new_password !== confirm_password) {
                showAlert('Confirm password not matched.');
                return;
            }
            axios.put(`${port}/user/update_password`, {
                editPasswordInputOld: previous_password,
                editPasswordInputNew: new_password,
            }, {
                headers: {
                    Authorization: token,
                }
            }).then((response) => {
                showAlert(response.data.message);
                if (response.data.status === true) {
                    setPrevious_password('');
                    setNew_password('');
                    setConfirm_password('');
                    setChange_password(false);
                    setChange_password_admin(false);
                }
            }).catch((err) => { console.log(err); });
        }

    }

    const handel_forget_password = async () => {
        try {
            const res = await axios.post(`${port}/user/forget_password`, {
                email: userInfo.email,
            });

            showAlert(res.data.message);
        } catch (error) {
            showAlert('Something went wrong. Please try again.');
        }
    }
    return (
        <>
            <div className="bg-light px-md-3" style={{ width: '100%', overflow: 'auto', paddingBottom: '80px'  }}>        

                <div className="d-flex ps-4 w-100 justify-content-start">
                    <label className="fs-3"><strong>Profile Information</strong></label>
                </div>


                <div className="dashboard-wrapper-box">
                    <div className="table-wrap">
                        <div className="table-filter-wrap">
                            <div className="d-flex justify-content-end align-items-start mb-3">
                                <div>
                                    <h4 className='text-primary' style={{ cursor: 'pointer' }} onClick={() => setProfile_edit(!profile_edit)}><RiPencilFill /> Edit Profile</h4>
                                </div>
                            </div>

                            <div className={`d-flex flex-wrap justify-content-between ${userRole === 'Sadmin' ? 'w-100' : 'w-75'}`}>
                                <div
                                    className="d-flex flex-row align-items-start justify-content-start p-2 gap-2"
                                    onClick={() => {
                                        if (profile_edit) {
                                            handleEditClick('name');
                                        }
                                    }}
                                >
                                    <div
                                        className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                        style={{
                                            width: '3rem',
                                            height: '3rem',
                                            backgroundColor: '#E1F5FF',
                                            aspectRatio: '1 / 1',
                                        }}
                                    >
                                        <FaUserCheck />
                                    </div>
                                    <div className="d-flex flex-column align-items-start gap-1">
                                        <span className="text-secondary fs-4">Name</span>
                                        <h5 className="text-uppercase">{userInfo.name}</h5>
                                    </div>
                                    {profile_edit && (
                                        <div className="ms-2 fs-4 text-primary">
                                            <GoPencil />
                                        </div>
                                    )}
                                </div>

                                <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 mb-3">
                                    <div
                                        className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                        style={{
                                            width: '3rem',
                                            height: '3rem',
                                            backgroundColor: '#E1F5FF',
                                            aspectRatio: '1 / 1',
                                        }}
                                    >
                                        <MdAlternateEmail />
                                    </div>
                                    <div className="d-flex flex-column align-items-start gap-1">
                                        <span className="text-secondary fs-4">Email</span>
                                        <h5>{userInfo.email}</h5>
                                    </div>
                                </div>

                                {userRole === 'Sadmin' && (
                                    <div className="d-flex flex-row align-items-start justify-content-start p-2 gap-2 mb-2">
                                        <div
                                            className="rounded-circle fs-4 d-flex justify-content-center align-items-center text-primary"
                                            style={{
                                                width: '3rem',
                                                height: '3rem',
                                                backgroundColor: '#E1F5FF',
                                                aspectRatio: '1 / 1',
                                            }}
                                        >
                                            <MdOutlineKey />
                                        </div>
                                        <div className="d-flex flex-column align-items-start gap-1">
                                            <span className="text-secondary fs-4">Role</span>
                                            <h5>{userInfo.role}</h5>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="d-flex justify-content-start align-items-start gap-2 mt-3">
                                <button className="btn-change-password" onClick={handle_change_password}> Change Password </button>
                                <button className="btn-logout" onClick={handel_logout}> Log Out </button>
                            </div>

                        </div>
                    </div>
                </div>

                {showEditPopup && (
                    <div
                        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}
                    >
                        <div className="bg-white p-4 rounded shadow" style={{ width: '90%', maxWidth: '500px' }}>
                            <div className="title-head text-start">
                                <h3 className="mb-3">Name {editField === 'name' ? 'Name' : 'Email'}</h3>
                            </div>

                            <div className="text-start">
                                <label className="input-label">Previous Name</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={previousValue}
                                    readOnly
                                />
                            </div>

                            <div className="text-start">
                                <label className="input-label">New Name</label>
                                <input
                                    type={editingField === 'email' ? 'email' : 'text'}
                                    className="input-field"
                                    placeholder={`Enter new ${editingField}`}
                                    value={updatedValue}
                                    onChange={(e) => setUpdatedValue(e.target.value)}
                                />

                            </div>

                            <div className="d-flex justify-content-end gap-2">
                                <button className="btn-change-password" onClick={handleFieldUpdate}>Change</button>
                                <button className="btn btn-secondary" onClick={() => setShowEditPopup(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                {change_password && (
                    <div
                        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}
                    >
                        <div
                            className="bg-white p-4 rounded shadow position-relative"
                            style={{ width: '90%', maxWidth: '500px' }}
                        >
                            <div className="title-head text-start">
                                <h3>Change Password</h3>
                            </div>

                            <>
                                <div className="text-start w-100">
                                    <label className="input-label">Previous Password</label>
                                    <input
                                        type="password"
                                        className="input-field w-100"
                                        placeholder="Enter previous password"
                                        onChange={(e) => setPrevious_password(e.target.value)}
                                        value={previous_password}
                                    />
                                </div>

                                <div className="text-start w-100">
                                    <label className="input-label">New Password</label>
                                    <input
                                        type="password"
                                        className="input-field w-100"
                                        placeholder="Enter new password"
                                        onChange={(e) => setNew_password(e.target.value)}
                                        value={new_password}
                                    />
                                </div>

                                <div className="text-start w-100">
                                    <label className="input-label">Confirm Password</label>
                                    <input
                                        type="password"
                                        className="input-field w-100"
                                        placeholder="Confirm new password"
                                        onChange={(e) => setConfirm_password(e.target.value)}
                                        value={confirm_password}
                                    />
                                </div>

                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <div className="d-flex gap-2">
                                        <button className="btn-change-password" onClick={query_update_password}>Update</button>
                                        <button className="btn btn-secondary" onClick={() => setChange_password(false)}>Cancel</button>
                                    </div>
                                    <span
                                        className="text-primary"
                                        style={{ cursor: 'pointer', fontSize: '0.9rem' }}
                                        onClick={handel_forget_password}
                                    >
                                        Forgot Password?
                                    </span>
                                </div>
                            </>
                        </div>
                    </div>
                )}

            </div>
        </>
    )
}

export default Profile;