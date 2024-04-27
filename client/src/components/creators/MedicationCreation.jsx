import React from 'react'
import { useState } from 'react'
import formInput from '../utils/formInput'
import formLabel from '../utils/formLabel'
import bodyButton from '../utils/bodyButton'
import ObjectDetails from '../utils/ObjectDetails'
import httpPharmacy from '../../client/httpPharmacy'
import WarningInfo from '../../pages/WarningInfo'

const MedicationCreation = ({refresh}) => {
    const [createMedication, setCreateMedication] = useState(false);
    const [medication, setMedication] = useState({
        Medication_name: '',
        Active_substance: '',
        Form: '',
        Manufacturer: '',
        Price: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        let parsedValue = value;
    
        // Check if the field being updated is "Price"
        if (name === 'Price') {
            // Ensure the input value is a valid number or empty string
            const match = value.match(/^(-?\d*\.?\d{0,2}).*$/);
            parsedValue = match ? match[1] : '';
        }
    
        setMedication(prevState => ({
            ...prevState,
            [name]: parsedValue
        }));
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const allFieldsNotEmpty = Object.values(medication).every(value => value !== '');
        if(allFieldsNotEmpty){
            try{
                await httpPharmacy.post("/add/medication", medication)
                alert("Medication added successfully!");
                setCreateMedication(!createMedication);
                refresh();
                setMedication({Medication_name: '',
                Active_substance: '',
                Form: '',
                Manufacturer: '',
                Price: ''});
                
            }catch(error){
                alert(error.response.data.detail);
                return Promise.reject(error);
            }
        }
        else{
            alert("Make sure every field is not empty!")
        }
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
