import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../styles/styles.css";
import bodyButton from '../components/utils/bodyButton';
import formInput from '../components/utils/formInput';
import httpPatients from '../client/httpPatients';
import ObjectDetails from '../components/utils/ObjectDetails';


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
        Gender: "Male",
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
        console.log(values)
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
                await httpPatients.post("/create", values);
                alert("Patient registered successfully!")
                setSubmitted(true);
            } catch (error) {
                alert(error.response.data.detail);
            }
        } else {
            alert("Please fill in all required fields correctly.");
        }
    };
    

    return (
        <div className='flex justify-center'>
            <ObjectDetails title={"Register new patient"}>
                <form className='space-y-5'>
                    {!valid && (
                        <input
                            className={formInput}
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
                            className={formInput}
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
                            className={formInput}
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
                        className={formInput}
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
                        className={formInput}
                        name="Gender"
                        value={values.Gender}
                        onChange={handleInputChange}
                    >
                        <option value="Select gender" disabled>Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    )}
                    {submitted && !values.Gender && (
                        <span id="gender-error">Please select a gender</span>
                    )}
                    {!valid && (
                        
                        <input
                        className={formInput}
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
                            className={formInput}
                            type="text"
                            placeholder="Address"
                            name="Address"
                            value={values.Address}
                            onChange={handleInputChange}
                        />
                    )}
                    {!valid && (
                        <button className={bodyButton} onClick={handleSubmit} type="submit">
                            Register
                        </button>
                    )}
                </form>
            </ObjectDetails>
        </div>
    );
}

export default RegisterPatient;
