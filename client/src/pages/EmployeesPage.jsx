import React from 'react'
import { useState, useEffect } from 'react';
import httpResources from '../client/httpResources';
import SearchBar from '../components/SearchBar';
import ObjectsListing from '../components/listing/ObjectsListing';
import WarningInfo from './WarningInfo';

const EmployeesPage = () => {
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await httpResources.get("/get/employee/all");
                setEmployees(response.data);
            } catch (error) {
               alert("Cannot fetch emoployees")
            }finally{
                setLoading(false);
            }
        };
        fetchData();
        return () => {
    };
    }, []);
      const filteredEmployees = employees.filter(employee => {
        const fullName = `${employee.First_name} ${employee.Last_name}`.toLowerCase();
        const search = searchTerm.toLowerCase();
        return fullName.includes(search) || employee.First_name.toLowerCase().includes(search) || employee.Last_name.toLowerCase().includes(search);
      });
  return (
    loading ? <WarningInfo loading={true}/>
    :<div className="container mx-auto px-4 py-8">
      <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
      <ObjectsListing 
        objectsData={filteredEmployees} 
        objectsTitle={"Employees"}
        objectLink={"/employees"}
        objectKey={"Employee_uuid"}
      />
    </div>
  )
}

export default EmployeesPage
