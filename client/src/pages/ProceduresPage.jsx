import React from 'react'
import httpResources from '../client/httpResources'
import ObjectsListing from '../components/listing/ObjectsListing'
import { useState, useEffect } from 'react'
import ProcedureCreation from '../components/creators/ProcedureCreation'

const ProceduresPage = () => {
    const [procedures, setProcedures] = useState([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const refresh = () => {
        setRefreshing(!refreshing);
    }

    useEffect(() => {
        const fetchProcedures = async () => {
            try {
                const response = await httpResources.get(`/get/medical_procedure/all`);
                const foundProcedures = response.data;
                setProcedures(foundProcedures);
                setLoading(false);
            } catch (error) {}
            finally{
                setLoading(false);
            }
        };
        fetchProcedures();
    }, [refreshing]);
    
  return (
    <>
        <ProcedureCreation refresh={refresh}></ProcedureCreation>
        <ObjectsListing objectsData={procedures} objectKey={"ID_procedure"} objectsTitle={"Procedures"} objectLink={"/procedures"}>
        </ObjectsListing>
    </>
  )
}

export default ProceduresPage
