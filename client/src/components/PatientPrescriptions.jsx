import React, { useState, useEffect } from 'react';
import httpPharmacy from '../client/httpPharmacy';
import WarningInfo from '../pages/WarningInfo';
import bodyButton from './utils/bodyButton';

const PatientPrescriptions = ({ patient_id }) => {
  const [loading, setLoading] = useState(true);
  const [prescriptions, setPrescriptions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [medication, setMedication] = useState({
    ID_medication: '',
    Quantity: '',
    Dosage: ''
  });

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

  const handleDeletePrescription = async (prescriptionId) => {
    try {
      await httpPharmacy.delete(`/delete/prescription/${prescriptionId}`);
      alert("Prescription deleted successfully");
      const response = await httpPharmacy.get(`/get/prescriptions/${patient_id}`);
      const foundPrescriptions = response.data;
      setPrescriptions(foundPrescriptions);
    } catch (error) {
      setPrescriptions([]);
    }
  };

  return (
    <>
      {loading ? (
        <WarningInfo loading={true} />
      ) : (
        <>
          <h2 className='text-3xl font-bold text-indigo-500 mb-8 text-center mt-8'>
            Prescriptions
          </h2>
          <div className='mt-5 '>
            {prescriptions.length > 0 && (
              prescriptions.map((prescription, index) => (
                <div key={index} className="container-xl lg:container m-auto bg-sky-100 rounded-xl p-3.5 hover:bg-sky shadow-md relative mb-10">
                  <div className="font-bold text-l flex mb-2">
                    <p className="font-bold mr-2">Doctor ID:</p>
                    <p>{prescription.ID_doctor}</p>
                  </div>
                  <div className="font-bold text-l flex mb-2">
                    <p className="font-bold mr-2">Prescription ID:</p>
                    <p>{prescription.ID_prescription}</p>
                  </div>
                  <h2 className="font-bold text-l mb-2">Medication List:</h2>
                  <div className='grid grid-cols-2 gap-3'>
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
                  <button className={bodyButton} onClick={() => handleDeletePrescription(prescription.ID_prescription)}>Delete Prescription</button>
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
