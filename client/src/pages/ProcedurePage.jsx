import React, { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import httpResources from '../client/httpResources';
import ObjectDetails from '../components/utils/ObjectDetails';
import WarningInfo from './WarningInfo';
import bodyButton from '../components/utils/bodyButton';
import ObjectSlicer from '../components/utils/ObjectSlicer';

const ProcedurePage = () => {
  const { id } = useParams();
  const [procedure, setProcedure] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProcedure = async () => {
      try {
        const response = await httpResources.get(`/get/medical_procedure/id/${id}`);
        setProcedure(response.data);
      } catch (error) {
        console.error('Error fetching procedure:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProcedure();
  }, []);

  const handleDeleteProcedure = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this procedure?');
    if (confirmDelete) {
      try {
        await httpResources.delete(`/delete/medical_procedure/${id}`);
        window.location.href = "/procedures";
        alert('Procedure successfully deleted!');
      } catch (error) {
        console.error('Error deleting procedure:', error);
        alert('Failed to delete procedure. Please try again later.');
      }
    }
  };

  return (
    <>
      {loading ? (
        <WarningInfo loading={true} />
      ) : procedure ? (
        <>
        <h2 className='text-3xl font-bold text-black-100 mb-8 text-center mt-8'>
              Procedure Details
            </h2>
          <ObjectDetails>
            <ObjectSlicer object={procedure} />
            <div className='flex justify-center gap-2'>
            <button className={bodyButton} onClick={handleDeleteProcedure}>
                Delete Procedure
              </button>
              <NavLink to={'/procedures'} className={bodyButton}>Back</NavLink>
              </div>
            </ObjectDetails>
            
          </>
      ) : (
        <WarningInfo info="Procedure not found!" />
      )}
    </>
  );
};

export default ProcedurePage;
