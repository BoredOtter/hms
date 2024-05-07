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
    
        // Sprawdź, czy wszystkie pola formularza są wypełnione
        if (!formData.Procedure_name || !formData.Description || !formData.Costs || selectedEmployees.length === 0) {
            alert("Please fill in all fields and select at least one employee.");
            return;
        }
        try {
            const dataToSend = {
                ...formData,
                Medical_personnel_list: selectedEmployees.map(employee => employee.Employee_uuid)
            };
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
                        <div className='grid grid-cols-2 mt-2'> 
                        {filteredEmployees.map(employee => (
                            <button type="button" className="bg-[#2D9596] p-4 rounded-md mt-4 text-center justify-center items-center" onClick={() => handleAddEmployee(employee)} key={employee.Employee_uuid}>
                                <p className='text-white text-xl'>{employee.First_name} {employee.Last_name}</p>                          
                            </button>
                        ))}
                        </div>
                    }
                    <div className='mt-5'>
                        <h3>Selected Employees:</h3>
                        {selectedEmployees.map((employee) => (
                            <div key={employee.Employee_uuid} className="flex items-center justify-between text-center">
                                <span className="font-bold text-black text-xl pt-1">
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
