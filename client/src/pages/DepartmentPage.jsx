import React from 'react'
import departments from '../../departments.json'
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Department from '../components/Department';
import HospitalRoom from '../components/HospitalRoom';

const DepartmentPage = () => {
  const {id} = useParams();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const foundDepartment = departments.departments.find(dep => dep.id === id);
    if (foundDepartment) {
      setDepartment(foundDepartment);
      setLoading(false);
    }
  }, [id]);

  return (
    loading ? <p>Loading...</p>
    : <>
      <Department department={department}/>
      <HospitalRoom/>
    </>
  );
};

export  { DepartmentPage as default}
