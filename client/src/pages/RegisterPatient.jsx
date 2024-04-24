import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../styles/styles.css"
import bodyButton from '../components/utils/bodyButton';

function containsOnlyDigits(str) {
    return /^\d{11}$/.test(str);
}

const RegisterPatient = () => {

    const [values, setValues] = useState({
        First_name: "",
        Last_name: "",
        PESEL: "",
        Date_of_birth: "",
        Gender: "",
        contactNumber: "",
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

    const handleSubmit = (e) => {
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
        }
        setSubmitted(true);
        console.log(values)
    };
 
    return (
        <>
            <div className="form-container bg-gray-200 mb-10">
                <div className = "title mt-4  text-2xl">
                    <h3>Register Patient</h3>
                </div>
                <form className="register-form" onSubmit={handleSubmit}>
                    {submitted && valid && (
                        <>
                            Registration successful!
                            <Link to='/' className='text-white bg-indigo-700 hover:bg-indigo-900 rounded-md px-3 py-2 mt-4'>Go Back</Link>
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
                            value={values.PESEL}
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
                        />
                    )}

                    {submitted && !values.Date_of_birth && (
                        <span id="PESEL-error">Please enter a date of birth</span>
                    )}

                    {!valid && (
                        <select
                            className="form-field bg-gray-100"
                            name="Gender"
                            value={values.Gender}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    )}

                    {submitted && !values.Gender && (
                        <span id="PESEL-error">Please enter a Gender</span>
                    )}

                    {!valid && (
                        <input
                            className="form-field bg-gray-100"
                            type="text"
                            placeholder="Contact Number"
                            name="contactNumber"
                            value={values.contactNumber}
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
