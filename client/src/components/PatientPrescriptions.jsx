import React, { useState, useEffect } from 'react';
import httpPharmacy from '../client/httpPharmacy';
import PrescriptionCreation from './creators/PrescriptionCreation';
import ObjectsListing from './listing/ObjectsListing';


const PatientPrescriptions = ({ patient_id }) => {
  const [loading, setLoading] = useState(true);
  const [prescriptions, setPrescriptions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [medication, setMedication] = useState({
    ID_medication: '',
    Quantity: '',
    Dosage: ''
  });

  const refresh = () => {
    setRefreshing(!refresh);
  }

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await httpPharmacy.get(`/get/prescriptions/${patient_id}`);
        const foundPrescriptions = response.data;
        setPrescriptions(foundPrescriptions);
      } catch (error) {
        } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [refreshing]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setMedication({ ...medication, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await httpPharmacy.post('/add/medication', medication);
      const response = await httpPharmacy.get(`/get/prescriptions/${patient_id}`);
      const updatedPrescriptions = response.data;
      setPrescriptions(updatedPrescriptions);
      setMedication({
        ID_medication: '',
        Quantity: '',
        Dosage: ''
      });
    } catch (error) {
      console.error("Error adding medication:", error);
    }
  };

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
        <PrescriptionCreation refresh={refresh} ID_patient={patient_id} ID_doctor={"#TODO"}/>
        <h2 className='text-3xl font-bold text-indigo-500 mb-8 text-center'>Prescriptions</h2>
        <div className='mt-5 grid grid-cols-1 md:grid-cols-2 gap-2'>
          {prescriptions.length > 0 && (
            prescriptions.map((prescription, index) => (
              <div key={index} className="m-auto bg-sky-100 rounded-xl p-3.5 hover:bg-sky shadow-md relative mb-10">
                  <div className="font-bold text-l flex mb-2">
                    <p className="font-bold mr-2">Doctor ID:</p>
                    <p>{prescription.ID_doctor}</p>
                  </div>
                  <div className="font-bold text-l flex mb-2">
                    <p className="font-bold mr-2">Prescription ID:</p>
                    <p>{prescription.ID_prescription}</p>
                    </div>
                  <h2 className="font-bold text-l mb-2">Medication List:</h2>
                  <div >
                    {prescription.prescription_medications.length > 0 ? (
                      prescription.prescription_medications.map((medication, medIndex) => (
                        <div key={medIndex} className="bg-gray-200 rounded-xl p-3.5 hover:bg-sky shadow-md hover:shadow-lg relative mb-2">
                          <div className="font-bold text-l flex mb-2">
                            <p className="font-bold mr-2">Medication ID:</p>
                            <p>{medication.ID_medication}</p>
                          </div>
                          <div className="font-bold text-l flex mb-2">
                            <p className="font-bold mr-2">Quantity:</p>
                            <p>{medication.Quantity}</p>
                          </div>
                          <div className="font-bold text-l flex mb-2">
                            <p className="font-bold mr-2">Dosage:</p>
                            <p>{medication.Dosage}</p>
                          </div>
                          <div className="font-bold text-l flex mb-2">
                            <p className="font-bold mr-2">Medication Name:</p>
                            <p>{medication.medication.Medication_name}</p>
                          </div>
                          <div className="font-bold text-l flex mb-2">
                            <p className="font-bold mr-2">Active Substance:</p>
                            <p>{medication.medication.Active_substance}</p>
                          </div>
                          <div className="font-bold text-l flex mb-2">
                            <p className="font-bold mr-2">Manufacturer:</p>
                            <p>{medication.medication.Manufacturer}</p>
                          </div>
                          <div className="font-bold text-l flex mb-2">
                            <p className="font-bold mr-2">Form:</p>
                            <p>{medication.medication.Form}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No medications prescribed</p>
                    )}
                  </div>
              </div>
            ))
          )} 
        </div>
        </>
      )}
    </>
  );
  
  
};

export default PatientPrescriptions;
