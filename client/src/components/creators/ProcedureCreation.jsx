import React, { useState, useEffect } from 'react';
import formInput from '../utils/formInput';
import formLabel from '../utils/formLabel';
import bodyButton from '../utils/bodyButton';
import ObjectDetails from '../utils/ObjectDetails';
import SearchBar from '../SearchBar';
import httpResources from '../../client/httpResources';

const ProcedureCreation = ({refresh}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [employees, setEmployees] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [formData, setFormData] = useState({
        Procedure_name: '',
        Description: '',
        Costs: '',
        Medical_personnel_list: []
    });

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await httpResources.get("/get/employee/all");
                const foundEmployees = response.data;
                setEmployees(foundEmployees);
            } catch (error) {
                alert(error.response.data.detail);
            }
        }
        fetchEmployees();
    },[]);

    const filteredEmployees = employees.filter(employee => {
        const fullName = `${employee.First_name} ${employee.Last_name}`.toLowerCase();
        const search = searchTerm.toLowerCase();
    
        return fullName.includes(search) || employee.First_name.toLowerCase().includes(search) || employee.Last_name.toLowerCase().includes(search);
    });

    const handleAddEmployee = (employee) => {
        const isEmployeeSelected = selectedEmployees.some(empl => empl.Employee_uuid === employee.Employee_uuid);
        if (!isEmployeeSelected) {
            setSelectedEmployees([...selectedEmployees, { ...employee }]);
        } else {
            alert("Employee is already added.");
        }
    };
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let parsedValue = value;
    
        if (name === 'Costs') {
            const match = value.match(/^(-?\d*\.?\d{0,2}).*$/);
            parsedValue = match ? match[1] : '';
        }
        setFormData({
            ...formData,
            [name]: parsedValue 
        });
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            const dataToSend = {
                ...formData,
                Medical_personnel_list: selectedEmployees.map(employee => employee.Employee_uuid)
            };
            console.log(dataToSend);
            await httpResources.post("/create/medical_procedure", dataToSend);
            alert("Procedure added successfully!");
            refresh();
            setFormData({
                Procedure_name: '',
                Description: '',
                Costs: '',
                Medical_personnel_list: []
            });
            setSelectedEmployees([]);
            setSearchTerm('');
        } catch (error) {
            alert(error.response.data.detail);
        }
    };
    
    

    const handleDeleteEmployee = (index) => {
        const updatedEmployees = [...selectedEmployees];
        updatedEmployees.splice(index, 1);
        setSelectedEmployees(updatedEmployees);
    };

    return (
        <ObjectDetails title={"Procedure Creation"}>
            <form onSubmit={handleSubmit}>
                <label className={formLabel}>Procedure Name:</label>
                <input
                    type="text"
                    name="Procedure_name"
                    value={formData.Procedure_name}
                    onChange={handleInputChange}
                    className={formInput}
                />
                <label className={formLabel}>Description:</label>
                <input
                    type="text"
                    name="Description"
                    value={formData.Description}
                    onChange={handleInputChange}
                    className={formInput}
                />
                <label className={formLabel}>Costs:</label>
                <input
                    type="text"
                    name="Costs"
                    value={formData.Costs}
                    onChange={handleInputChange}
                    className={formInput}
                />
                <div className='mt-3'>
                    <label className={formLabel}>Search Employee:</label>
                    <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
                    {searchTerm !== '' && 
                        <div className='grid grid-cols-2 gap-2'> 
                        {filteredEmployees.map(employee => (
                            <ObjectDetails key={employee.Employee_uuid} title={`${employee.First_name} ${employee.Last_name}`}>
                                <button type="button" onClick={() => handleAddEmployee(employee)} className={bodyButton}>
                                    Add
                                </button>                           
                            </ObjectDetails>
                        ))}
                        </div>
                    }
                    <div className='mt-5'>
                        <h3>Selected Employees:</h3>
                        {selectedEmployees.map((employee) => (
                            <div key={employee.Employee_uuid} className="flex gap-2 justify-center">
                                <span className="font-bold text-xl mt-1" style={{ color: "black" }}>
                                    {`${employee.First_name} ${employee.Last_name}`}
                                </span>
                                <button onClick={() => handleDeleteEmployee(employee.Employee_uuid)} className={`${bodyButton}`}>
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <button onClick={handleSubmit} className={`${bodyButton} mt-3`}>Submit</button>
            </form>
        </ObjectDetails>
    );
};

export default ProcedureCreation;
