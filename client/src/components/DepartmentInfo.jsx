import React from 'react'
import { useState, useEffect } from 'react';
import ObjectDetails from './utils/ObjectDetails';
import ObjectSlicer from './utils/ObjectSlicer';
import httpResources from '../client/httpResources';

const DepartmentInfo = ({ID_department}) => {

    const [department, setDepartment] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const findDepartment = async () => {
          try{
            const response = await httpResources.get(`get/department/id/${ID_department}`)
            const foundDepartment = response.data;
              setDepartment(foundDepartment);
              setLoading(false);
          } catch(error){
            alert(error.response.data.detail)
          }finally{
            setLoading(false);
          }
          
        }
        findDepartment()
      },[]);
  return (
    loading ? (<WarningInfo loading={true}/>) : (
        <ObjectDetails title={"Department Details"}>
            <ObjectSlicer object={department}/>
        </ObjectDetails>
    )

  )
}

export default DepartmentInfo
