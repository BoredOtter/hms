import React from 'react'
import { Link } from 'react-router-dom';
import { useState } from 'react';
import "../styles/styles.css"
import bodyButton from '../components/utils/bodyButton';

function containsOnlyDigits(str) {
    return /^\d{11}$/.test(str);
}

const RegisterPatient = () => {

    const [values, setValues] = useState({
        firstName: "",
        lastName: "",
        pesel: "",
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
        if (values.firstName && values.lastName && values.pesel && containsOnlyDigits(values.pesel)) {
            setValid(true);
        }
        setSubmitted(true);
    };
 
    return (
    <>
            <div className="form-container bg-gray-200">
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
                className="form-field"
                type="text"
                placeholder="First Name"
                name="firstName"
                value={values.firstName}
                onChange={handleInputChange}
                />
            )}

            {submitted && !values.firstName && (
                <span id="first-name-error">Please enter a first name</span>
            )}

            {!valid && (
                <input
                className="form-field"
                type="text"
                placeholder="Last Name"
                name="lastName"
                value={values.lastName}
                onChange={handleInputChange}
                />
            )}

            {submitted && !values.lastName && (
                <span id="last-name-error">Please enter a last name</span>
            )}

            {!valid && (
                <input
                className="form-field"
                type="text"
                maxLength={11}
                placeholder="PESEL number"
                name="pesel"
                value={values.pesel}
                onChange={handleInputChange}
                />
            )}

            {submitted && !values.pesel && (
                <span id="pesel-error">Please enter a pesel number</span>
            )}

            {!valid && (
                <button className={bodyButton} type="submit" >
                Register
                </button>
            )}
            </form>
        </div>
    </>
    );
}

export default RegisterPatient
