import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { RiPencilFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../alert/Alert_message";
import ConfirmationModal from "../../alert/Conform_alert";
import useIsMobile from "../../hooks/useIsMobile";

const Roles = () => {
    const port = process.env.REACT_APP_SECRET;
    const { showAlert } = useAlert();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const [userData, setUserData] = useState([]);
    const [updateUser, setUpdateUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [deleteAction, setDeleteAction] = useState(null);
    const isMobile = useIsMobile();

    const featchAllUsers = () => {
        if (userRole === 'Sadmin') {
            axios.get(`${port}/s_admin/all_users`, {
                headers: {
                    Authorization: token,
                }
            }).then((response) => {
                if (response.data.status === false) {
                    setUserData([]);
                    return;
                }
                setUserData(response.data.message);
            }).catch((error) => { console.log('error featching data', error) });
        } else {
            return;
        }
    }

    useEffect(() => {
        featchAllUsers();
    }, [])
    const ChangeUserRole = (id, role) => {
        if (userRole === 'Sadmin') {
            axios.put(`${port}/s_admin/update_user/${id}`, { role }, {
                headers: {
                    Authorization: token,
                }
            }).then((response) => {
                closeDetails();
                // window.location.reload();
                featchAllUsers();
            }).catch((err) => { console.log(err); });
        } else {
            return;
        }
    }
    const closeDetails = () => {
        setUpdateUser(null);
    };
    const handleDeleteUser = (user) => {
        openDeleteModal(`Are you sure you want to delete ${user.name}?`, () => {
            axios.delete(`${port}/s_admin/delete_user/${user.id}`, {
                headers: {
                    Authorization: token,
                }
            }).then((response) => {
                showAlert(response.data.message);
                // window.location.reload();
                featchAllUsers();
            }).catch((err) => { console.log(err) });
        });
    }
    const handleEditUser = (user) => {
        setUpdateUser(user);
    }
    const openDeleteModal = (message, deleteFunction) => {
        setModalMessage(message);
        setDeleteAction(() => deleteFunction);
        setShowModal(true);
    };
    const cancelDelete = () => {
        setShowModal(false);
        showAlert("Delete canceled");
    };
    const confirmDelete = () => {
        if (deleteAction) {
            deleteAction();
        }
        setShowModal(false);
    };
    return (
        <>
            <ConfirmationModal
                show={showModal}
                message={modalMessage}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
            <div className="bg-light" style={{ width: '100%', overflow: 'auto', paddingBottom: '90px' }}>
                <div className="d-flex flex-wrap justify-content-between align-items-center rounded-1">
                    <div className="d-flex ps-4 w-100 w-md-50 justify-content-start">
                        <label className="fs-3"><strong>Roles & Permissions</strong></label>
                    </div>
                    <div className="w-100 w-md-50 pe-3 d-flex justify-content-start justify-content-md-end mt-2 mt-md-0">
                    </div>
                </div>
                {isMobile ? (
                    <div className="p-3 mt-3 rounded-1">
                        <div className="d-flex flex-column w-100 align-items-center justify-content-center gap-3">
                            {userData ? (
                                <>
                                    {userData.map((item, index) => (
                                        <div className="orders-mobile-card w-100" style={{ cursor: 'pointer' }} >
                                            <div className="d-flex justify-content-between w-100">
                                                <div className="text-start">
                                                    <div className="d-flex gap-2">
                                                        <h5>Name: </h5> <h5>{item.name}</h5>
                                                    </div>
                                                    <div className="d-flex">
                                                        <h5>Email: </h5> <h5>{item.email}</h5>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-center" >
                                                    <button className="btn btn-sm btn-light text-primary pt-0 pb-0"
                                                        onClick={() => handleEditUser(item)}
                                                        disabled={item.role === 'Sadmin'}
                                                        style={{ fontSize: '1.5rem' }}>
                                                        <RiPencilFill />
                                                    </button>
                                                    <button className="btn btn-sm btn-light text-danger pt-0 pb-0"
                                                        onClick={() => handleDeleteUser(item)}
                                                        disabled={item.role === 'Sadmin'}
                                                        style={{ fontSize: '1.5rem' }}>
                                                        <MdDelete />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column justify-content-start align-items-start">
                                                <h5>Role : {item.role === 'Sadmin' ? 'Super Admin' : item.role === 'admin' ? 'Admin' : 'User'}</h5>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <>

                                </>
                            )}

                        </div>
                    </div>
                ) : (
                    <>
                        <div className="d-flex mt-4 p-3 flex-column justify-content-start align-items-start m-5 rounded-1"
                            style={{ boxShadow: '0 0 5px 2px rgba(0, 0, 0, 0.5)' }}>

                            <div className="table-responsive" style={{ width: '100%', overflowX: 'auto' }}>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col"><h6>Name</h6></th>
                                            <th scope="col"><h6>Email ID</h6></th>
                                            <th scope="col"><h6>Role</h6></th>
                                            <th scope="col"><h6>Actions</h6></th>
                                        </tr>
                                    </thead>
                                    {userData ? (
                                        <tbody>
                                            {userData.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="text-secondary">{item.name}</td>
                                                    <td className="text-secondary">{item.email}</td>
                                                    <td className="text-secondary">
                                                        {item.role === 'Sadmin' ? 'Super Admin' : item.role === 'admin' ? 'Admin' : 'User'}
                                                    </td>
                                                    <td className="text-secondary">
                                                        <button className="btn btn-sm btn-light text-primary pt-0 pb-0"
                                                            onClick={() => handleEditUser(item)}
                                                            disabled={item.role === 'Sadmin'}
                                                            style={{ fontSize: '1.5rem' }}>
                                                            <RiPencilFill />
                                                        </button>
                                                        <button className="btn btn-sm btn-light text-danger pt-0 pb-0"
                                                            onClick={() => handleDeleteUser(item)}
                                                            disabled={item.role === 'Sadmin'}
                                                            style={{ fontSize: '1.5rem' }}>
                                                            <MdDelete />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    ) : (
                                        <tbody>
                                            <tr>
                                                <td colSpan="4" className="text-secondary">No Data</td>
                                            </tr>
                                        </tbody>
                                    )}
                                </table>
                            </div>
                        </div>
                    </>
                )}


            </div>

            {updateUser && (
                <div
                    className="position-fixed bg-light p-4 shadow rounded text-center"
                    style={{
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "90%",
                        maxWidth: "500px",
                        zIndex: 1050,
                        animation: "fadeIn 0.3s ease-out",
                    }}
                >
                    <button
                        className="btn-close position-absolute top-0 end-0 m-2"
                        onClick={closeDetails}
                    ></button>
                    <h4 className="mb-4">User Action</h4>
                    <p>
                        <strong>Change user role as -:</strong>
                    </p>
                    <div className="d-flex flex-wrap justify-content-center gap-3">
                        <button className="fs-5 fw-bold btn btn-dark p-2" onClick={() => ChangeUserRole(updateUser.id, 'Sadmin')}>
                            Super Admin
                        </button>
                        <button className="fs-5 fw-bold btn btn-dark p-2" onClick={() => ChangeUserRole(updateUser.id, 'admin')}>
                            Admin
                        </button>
                        <button className="fs-5 fw-bold btn btn-dark p-2" onClick={() => ChangeUserRole(updateUser.id, 'user')}>
                            User
                        </button>
                    </div>
                </div>
            )}

        </>
    )
}

export default Roles;