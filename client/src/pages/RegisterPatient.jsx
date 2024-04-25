import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../styles/styles.css";
import bodyButton from '../components/utils/bodyButton';
import httpPatients from '../client/httpPatients';


const containsOnlyDigits= (str) => {
    return /^\d{11}$/.test(str);
}

const formatPhoneNumber = (phoneNumber) => {
    // Remove all non-numeric characters from the input
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    // Apply the pattern "xxx-xxx-xxx"
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,3})$/);
    if (match) {
        return [match[1], match[2], match[3]].filter((group) => group.length > 0).join('-');
    }
    return cleaned.slice(0, 9); // Ensure only 9 digits are displayed
};

const formatPESEL = (pesel) => {
    // Remove all non-numeric characters from the input
    const cleaned = ('' + pesel).replace(/\D/g, '');
    // Apply the pattern "xxxxxxxxxxx"
    return cleaned.slice(0, 11); // Ensure only 11 digits are displayed
};

const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    let day = currentDate.getDate();
    day = day < 10 ? '0' + day : day;
    return `${year}-${month}-${day}`;
};



const RegisterPatient = () => {

    const [values, setValues] = useState({
        First_name: "",
        Last_name: "",
        PESEL: "",
        Date_of_birth: "",
        Gender: "",
        Contact_number: "",
        Address: "",
    });
    
    const handleInputChange = (event) => {
        event.preventDefault();

        const { name, value } = event.target;
        setValues((values) => ({
            ...values,
            [name]: value
        }));
    };
    
    const [submitted, setSubmitted] = useState(false);
    const [valid, setValid] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            values.First_name &&
            values.Last_name &&
            values.PESEL &&
            containsOnlyDigits(values.PESEL) &&
            values.Date_of_birth &&
            values.Gender 
        ) {
            setValid(true);
            try {
                // Send a POST request to the "/create" endpoint with form values as the body
                const response = await httpPatients.post("/create", values);
                console.log("POST request response:", response.data);
                setSubmitted(true);
            } catch (error) {
                console.error('Error sending POST request:', error);
            }
        }
    };

    return (
        <>
            <div className="form-container bg-gray-200 mb-10">
                <div className="title mt-4 text-2xl">
                    <h3>Register Patient</h3>
                </div>
                <form className="register-form" onSubmit={handleSubmit}>
                    {submitted && valid && (
                        <>
                            Registration successful!
                            <Link to='/home' className='text-white bg-indigo-700 hover:bg-indigo-900 rounded-md px-3 py-2 mt-4'>Go Back</Link>
                        </>
                    )}
                    {!valid && (
                        <input
                            className="form-field bg-gray-100"
                            type="text"
                            placeholder="First Name"
                            name="First_name"
                            value={values.First_name}
                            onChange={handleInputChange}
                        />
                    )}
                    {submitted && !values.First_name && (
                        <span id="first-name-error">Please enter a first name</span>
                    )}
                    {!valid && (
                        <input
                            className="form-field bg-gray-100"
                            type="text"
                            placeholder="Last Name"
                            name="Last_name"
                            value={values.Last_name}
                            onChange={handleInputChange}
                        />
                    )}
                    {submitted && !values.Last_name && (
                        <span id="last-name-error">Please enter a last name</span>
                    )}
                    {!valid && (
                        <input
                            className="form-field bg-gray-100"
                            type="text"
                            maxLength={11}
                            placeholder="PESEL number"
                            name="PESEL"
                            value={formatPESEL(values.PESEL)}
                            onChange={handleInputChange}
                        />
                    )}
                    {submitted && !values.PESEL && (
                        <span id="PESEL-error">Please enter a PESEL number</span>
                    )}
                    {!valid && (
                        <input
                        className="form-field bg-gray-100"
                        type="date"
                        placeholder="Date of Birth"
                        name="Date_of_birth"
                        value={values.Date_of_birth}
                        onChange={handleInputChange}
                        max={getCurrentDate()}
                        lang="en"
                    />
                    
                    )}
                    {submitted && !values.Date_of_birth && (
                        <span id="date-of-birth-error">Please enter a date of birth</span>
                    )}
                    {!valid && (
                        <select
                            className="form-field bg-gray-100"
                            name="Gender"
                            value={values.Gender}
                            onChange={handleInputChange}
                        >
=                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    )}
                    {submitted && !values.Gender && (
                        <span id="gender-error">Please select a gender</span>
                    )}
                    {!valid && (
                        
                        <input
                        className="form-field bg-gray-100"
                        type="text"
                        placeholder="Contact Number"
                        name="Contact_number"
                        value={formatPhoneNumber(values.Contact_number)}
                        maxLength={11} // Limit input to 9 digits
                        onChange={handleInputChange}
                    />
                    )}
                    {!valid && (
                        <input
                            className="form-field bg-gray-100"
                            type="text"
                            placeholder="Address"
                            name="Address"
                            value={values.Address}
                            onChange={handleInputChange}
                        />
                    )}
                    {!valid && (
                        <button className={bodyButton} type="submit">
                            Register
                        </button>
                    )}
                </form>
            </div>
        </>
    );
}

export default RegisterPatient;
