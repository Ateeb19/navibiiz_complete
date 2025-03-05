import React, { useEffect, useRef, useState } from "react";
import { Form, Navbar } from "react-bootstrap";
import { FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
import Loading from "../Loader/Loader";
import Image from 'react-bootstrap/Image';

const SendTransport = () => {
    const port = process.env.REACT_APP_SECRET;

    const [Loader, setLoader] = useState(false);
    const [yourName, setYourName] = useState('');
    const [yourEmail, setYourEmail] = useState('');
    const [yourContact, setYourContact] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [itemName, setItemName] = useState('');
    const [senderAddress, setSenderAddress] = useState('');
    const [date, setDate] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const handleDetailsClick = (item) => {
        setSelectedItem(item.id === selectedItem?.id ? null : item); // Toggle details visibility
    };

    const inputRef = useRef(null);
    const handleIconClick = () => {
        if (inputRef.current) {
            inputRef.current.showPicker(); // Use the native showPicker() method
        }
    };
    const handleAddItem = () => {
        setShowModal(true); // Show modal
    };

    const closeModal = () => {
        setShowModal(false); // Hide modal
    };

    const [services, setServices] = useState({
        container: false,
        groupage: false,
        car: false,
    });

    const handleServiceToggle = (service) => {
        setServices({ ...services, [service]: !services[service] });
    }

    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files); // Convert FileList to an array
        const totalImages = images.length + selectedFiles.length;

        if (totalImages > 10) {
            alert('You can upload a maximum of 10 images.');
            setImages('');
            return;
        }

        // Update the images state
        setImages((prevImages) => [...prevImages, ...selectedFiles]);

        // Generate image previews
        const previews = selectedFiles.map((file) => URL.createObjectURL(file));
        setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);
    };

    const handleRemoveImage = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
        setImagePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form fields
        if (!itemName || !senderAddress || !date || !from || !to || !description) {
            alert('Please fill in all required fields.');
            return;
        }

        // Prepare form data
        const formData = new FormData();
        formData.append('yourname', yourName);
        formData.append('youremail', yourEmail);
        formData.append('yourcontact', yourContact);
        formData.append('services', JSON.stringify(services));
        formData.append('itemName', itemName);
        formData.append('senderAddress', senderAddress);
        formData.append('date', date);
        formData.append('from', from);
        formData.append('to', to);
        formData.append('description', description);
        if (images) {
            images.forEach((image, index) => {
                formData.append(`image_${index}`, image);
            });
        }
        setLoader(true);
        try {
            const response = await axios.post(`${port}/send_transport/send_transport_create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.data.status === true) {
                alert('Form submitted successfully!');
                setLoader(false);
                window.location.reload();
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to submit the form. Please try again.');
        }
    };

    //display
    const [itemdata, setItemdata] = useState([]);
    const displayitems = () => {
        axios.get(`${port}/send_transport/send_transport_display`)
            .then((response) => {
                // console.log(response.data.message);
                setItemdata(response.data.message);
            }).catch((err) => { console.log(err) });
    }
    console.log(itemdata);
    useEffect(() => {
        displayitems();
    }, [])

    const wordLimit = 180;
    const handleChangedescription = (event) => {
        const inputText = event.target.value;
        const words = inputText.trim().split(/\s+/); // Split the input text into words
        if (words.length <= wordLimit) {
            setDescription(inputText); // Update the state if the word limit is not exceeded
        }
    };

    const wordCount = description.trim() === "" ? 0 : description.trim().split(/\s+/).length;
    return (
        <div className="container mt-5">
            <div className=" d-flex justify-content-end ">
                <Navbar />
            </div>
            {/* Button to Open Modal */}
            <div className="d-flex justify-content-center mb-3">
                <button className="btn btn-primary" onClick={handleAddItem}>
                    Add your item
                </button>
            </div>

            {/* Title */}
            <div className="d-flex justify-content-center align-items-center">
                <h2 className="mb-4">List of Transportation</h2>
            </div>

            {/* Table */}
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>Category</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Date</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemdata.map((item) => (
                            <React.Fragment key={item.id}>
                                <tr>
                                    <td>{item.car_service === '1' ? 'Car Service' : item.container_service === '1' ? 'Container Service' : item.groupage_service === '1' ? 'Groupage Service' : 'No service selected'}</td>
                                    <td>{item.ship_from}</td>
                                    <td>{item.ship_to}</td>
                                    <td>{item.pickup_date}</td>
                                    <td>
                                        <button
                                            className="btn btn-info btn-sm"
                                            onClick={() => handleDetailsClick(item)}
                                        >
                                            {selectedItem?.id === item.id ? 'Hide Details' : 'Show Details'}
                                        </button>
                                    </td>
                                </tr>
                                {selectedItem?.id === item.id && (
                                    <tr>
                                        <td colSpan="1">
                                            <div className="alert alert-info p-1">
                                                <strong className="fs-5">User Info</strong><br />
                                                <span className="fs-6"><strong>User Name -:</strong> {item.sender_name}</span><br />
                                                <span className="fs-6"><strong>User E-Mail -:</strong> {item.sender_email}</span><br />
                                                <span className="fs-6"><strong>User Contact -:</strong> {item.sender_contact}</span><br />
                                                <span className="fs-6"><strong>Pick Up Address -:</strong> {item.sender_address}</span><br />
                                            </div>
                                        </td>
                                        <td colSpan="4">
                                            <div className="alert alert-primary p-1">
                                                <h5>Description -: </h5>
                                                <div className="border border-1 border-secondary rounded-3 ms-3 me-3 mb-2">
                                                    {item.item_description}
                                                </div>
                                                <h5>Images -: </h5>
                                                <div className="image-preview-container d-flex flex-wrap mt-2 justify-content-center">
                                                    {item.img01.length === 1 ? ('') : (
                                                        <div className="preview-item me-2 mb-2 text-center">
                                                            <img
                                                                src={item.img01}
                                                                alt={`Image ${1}`}
                                                                className="img-thumbnail"
                                                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                            />
                                                        </div>
                                                    )}
                                                    {item.img02.length === 1 ? ('') : (
                                                        <div className="">
                                                            <div className="preview-item me-2 mb-2 text-center">
                                                                <img
                                                                    src={item.img02}
                                                                    alt={`Image ${2}`}
                                                                    className="img-thumbnail"
                                                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                    {item.img03.length === 1 ? ('') : (
                                                        <div className="">
                                                            <div className="preview-item me-2 mb-2 text-center">
                                                                <img
                                                                    src={item.img03}
                                                                    alt={`Image ${3}`}
                                                                    className="img-thumbnail"
                                                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                    {item.img04.length === 1 ? ('') : (
                                                        <div className="">
                                                            <div className="preview-item me-2 mb-2 text-center">
                                                                <img
                                                                    src={item.img04}
                                                                    alt={`Image ${4}`}
                                                                    className="img-thumbnail"
                                                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                    {item.img05.length === 1 ? ('') : (
                                                        <div className="">
                                                            <div className="preview-item me-2 mb-2 text-center">
                                                                <img
                                                                    src={item.img05}
                                                                    alt={`Image ${5}`}
                                                                    className="img-thumbnail"
                                                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                    {item.img06.length === 1 ? ('') : (
                                                        <div className="">
                                                            <div className="preview-item me-2 mb-2 text-center">
                                                                <img
                                                                    src={item.img06}
                                                                    alt={`Image ${6}`}
                                                                    className="img-thumbnail"
                                                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                    {item.img07.length === 1 ? ('') : (
                                                        <div className="">
                                                            <div className="preview-item me-2 mb-2 text-center">
                                                                <img
                                                                    src={item.img07}
                                                                    alt={`Image ${7}`}
                                                                    className="img-thumbnail"
                                                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                    {item.img08.length === 1 ? ('') : (
                                                        <div className="">
                                                            <div className="preview-item me-2 mb-2 text-center">
                                                                <img
                                                                    src={item.img08}
                                                                    alt={`Image ${8}`}
                                                                    className="img-thumbnail"
                                                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                    {item.img09.length === 1 ? ('') : (
                                                        <div className="">
                                                            <div className="preview-item me-2 mb-2 text-center">
                                                                <img
                                                                    src={item.img09}
                                                                    alt={`Image ${9}`}
                                                                    className="img-thumbnail"
                                                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                    {item.img10.length === 1 ? ('') : (
                                                        <div className="">
                                                            <div className="preview-item me-2 mb-2 text-center">
                                                                <img
                                                                    src={item.img10}
                                                                    alt={`Image ${10}`}
                                                                    className="img-thumbnail"
                                                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
                    style={{ zIndex: 1050 }}
                > {Loader ? (
                    <Loading />
                ) : (
                    <div
                        className="bg-white p-4 rounded overflow-auto"
                        style={{
                            animation: 'slideIn 0.5s ease-in-out',
                            maxWidth: '500px',
                            width: '100%',
                            maxHeight: '90vh',
                        }}
                    >
                        <h4 className="mb-4 text-center">Add New Item</h4>
                        <form onSubmit={handleSubmit}>
                            {/* Checkboxes */}
                            <div className="mb-3">
                                <label className="form-label fs-4">Your Name</label>
                                <input type="text" value={yourName} className="form-control" placeholder="Your Name" required onChange={(e) => setYourName(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fs-4">Your Email</label>
                                <input type="email" value={yourEmail} className="form-control" placeholder="Your e-mail" required onChange={(e) => setYourEmail(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fs-4">Your Contact</label>
                                <input type="text" value={yourContact} className="form-control" placeholder="Your Contact Info" required onChange={(e) => setYourContact(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fs-4">Options</label>
                                <div className="d-flex felx-row  justify-content-center">
                                    <Form>
                                        <Form.Check
                                            type="switch"
                                            checked={services.container}
                                            onChange={() => handleServiceToggle("container")}
                                            label="Containers"
                                        />
                                        <Form.Check
                                            type="switch"
                                            checked={services.groupage}
                                            onChange={() => handleServiceToggle("groupage")}
                                            label="Groupage"
                                        />
                                        <Form.Check
                                            type="switch"
                                            checked={services.car}
                                            onChange={() => handleServiceToggle("car")}
                                            label="Cars"
                                        />
                                    </Form>
                                </div>
                            </div>

                            {/* Input Fields */}
                            <div className="mb-3">
                                <label htmlFor="itemName" className="form-label fs-4">
                                    Item Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={itemName}
                                    onChange={(e) => setItemName(e.target.value)}
                                    placeholder="Enter item name"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="address" className="form-label fs-4">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={senderAddress}
                                    onChange={(e) => setSenderAddress(e.target.value)}
                                    placeholder="Enter address"
                                />
                            </div>

                            <div className="mb-3 d-flex flex-column align-item-center justify-content-center">
                                <label htmlFor="date" className="form-label fs-4">
                                    Pick Up Date :
                                    <FaCalendarAlt className=" ms-2 fs-5" onClick={handleIconClick} />
                                </label>
                                <div className="d-flex justify-content-center align-item-center">
                                    <input
                                        type='date'
                                        ref={inputRef}
                                        className="form-control"
                                        style={{
                                            opacity: 0,
                                            width: "1px",
                                            height: "1px",
                                            zIndex: 1,
                                        }}
                                        min={new Date().toISOString().split("T")[0]}
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)} />
                                </div>
                                <div className="d-flex flex-row mt-1 justify-content-center">
                                    Selected Date -:
                                    <input
                                        className="form-control ms-1"
                                        style={{ width: '10rem' }}
                                        value={date ? (`${date}`) : ('Not selected')}
                                        readOnly
                                    />
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div className="mb-3">
                                <label htmlFor="imageUpload" className="form-label fs-4">
                                    Upload Image's <spna className="fs-6">(upload less than 10 image's)</spna>
                                </label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="imageUpload"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                />
                                <div className="image-preview-container d-flex flex-wrap mt-2 justify-content-center">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="preview-item me-2 mb-2 text-center">
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="img-thumbnail"
                                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                            /><br />
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm mt-1"
                                                onClick={() => handleRemoveImage(index)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="from" className="form-label fs-4">
                                    From
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                    placeholder="Enter from location"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="to" className="form-label fs-4">
                                    To
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                    placeholder="Enter to location"
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fs-4">
                                    Description of the product
                                </label><br />
                                <span className="fs-6">Word Limit -: {wordCount}/{wordLimit}</span>
                                <textarea
                                    rows="5"
                                    cols="50"
                                    placeholder="Enter the item description here......."
                                    required
                                    value={description}
                                    onChange={handleChangedescription}
                                />
                            </div>
                            {/* Submit and Cancel Buttons */}
                            <div className="d-flex justify-content-end">
                                <button
                                    type="button"
                                    className="btn btn-secondary me-2"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                )}
                </div>
            )}

            {/* Slide-In Animation */}
            <style>
                {`
            @keyframes slideIn {
              from {
                transform: translateY(100%);
              }
              to {
                transform: translateY(0);
              }
            }
          `}
            </style>
        </div>
    );
}

export default SendTransport;