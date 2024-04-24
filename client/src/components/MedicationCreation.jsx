import React from 'react'
import { useState } from 'react'
import formInput from './utils/formInput'
import formLabel from './utils/formLabel'
import bodyButton from './utils/bodyButton'
import ObjectDetails from './utils/ObjectDetails'

const MedicationCreation = () => {

    const [medication, setMedication] = useState({
        Medication_name: '',
        Active_substance: '',
        Form: '',
        Manufacturer: '',
        Price: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMedication(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted Medication Data:", medication);
        // Add your logic to send the medication data to the server here
    };

    
  return (
    <ObjectDetails title={"Add Medication"}>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className='space-y-4'>
                <label className={formLabel}>
                    Manufacturer:
                    <input
                        type="text"
                        name="Manufacturer"
                        value={medication.Manufacturer}
                        onChange={handleChange}
                        className={formInput}
                    />
                </label>
                <label className={formLabel}>
                    Active Substance:
                    <input
                        type="text"
                        name="Active_substance"
                        value={medication.Active_substance}
                        onChange={handleChange}
                        className={formInput}
                    />
                </label>
                <label className={formLabel}>
                    Form:
                    <input
                        type="text"
                        name="Form"
                        value={medication.Form}
                        onChange={handleChange}
                        className={formInput}
                    />
                </label>
                <label className={formLabel}>
                    Medication Name:
                    <input
                        type="text"
                        name="Medication_name"
                        value={medication.Medication_name}
                        onChange={handleChange}
                        className={formInput}
                    />
                </label>
                <label className={formLabel}>
                    Price:
                    <input
                        type="text"
                        name="Price"
                        value={medication.Price}
                        onChange={handleChange}
                        className={formInput}
                    />
                </label>
            </div>
            <div className="flex justify-center space-x-4"> 
                <button type="submit" className={bodyButton}>Save</button>
            </div>
        </form>
    </ObjectDetails>

  )
}

export default MedicationCreation
