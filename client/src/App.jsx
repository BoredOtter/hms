import React, { createContext } from 'react';
import MainLayout from './layouts/MainLayout';
import RegisterPatient from './pages/RegisterPatient';
import WarningInfo from './pages/WarningInfo';
import DepartmentsPage from './pages/DepartmentsPage';
import DepartmentPage from './pages/DepartmentPage';
import MedicationsPage from './pages/MedicationsPage';
import MedicationPage from './pages/MedicationPage';
import Home from './pages/Home';
import PatientsPage from './pages/PatientsPage';
import PatientPage from './pages/PatientPage';
import useAuth from './auth/useAuth';
import EmployeeSchedule from './components/EmployeeSchedule';
import OperationRooms from './components/OperationRooms';
import OperationRoomPage from './pages/OperationRoomPage';
import EmployeesPage from './pages/EmployeesPage';
import EmployeePage from './pages/EmployeePage';
import RoomPage from './pages/RoomPage';
import RoomsPage from './pages/RoomsPage';


import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';



const generateNurseRoutes = () => (
  <Route path='/register' element={<RegisterPatient />} />
);

const generateDoctorRoutes = () => (
  <>
    <Route path='/register' element={<RegisterPatient />} />
    <Route path='/medications' element={<MedicationsPage/>} />
    <Route path='/medications/:id' element={<MedicationPage/>} />
    <Route path='/patients' element={<PatientsPage />} />
    <Route path='/patients/:id' element={<PatientPage />} />
    <Route path='/departments' element={<DepartmentsPage />} />
    <Route path='/departments/:id' element={<DepartmentPage />} />
    <Route path='/schedules' element={<Home/>}/>
    <Route path='/schedules/:id' element={<EmployeeSchedule/>}/>
    <Route path='/operating_rooms' element={<OperationRooms/>}/>
    <Route path='/operating_rooms/:id' element={<OperationRoomPage/>}/>
    <Route path='/employees' element={<EmployeesPage/>}/>
    <Route path='/employees/:id' element={<EmployeePage/>}/>
    <Route path='/rooms/:id' element={<RoomPage/>}/>
    <Route path='/rooms' element={<RoomsPage/>}/>
  </>
);

const App = () => {

  const [isLogin, roles, username] = useAuth();

  const generateRoutes = () => {
    const routes = (
      isLogin ? (
        <Route path='/' element={<MainLayout loggedUser={roles}/>}>
          {roles.includes('nurse') && generateNurseRoutes()}
          {roles.includes('doctor') && generateDoctorRoutes()}
          <Route path='/home' element={<Home userName={username}/>} />
          <Route path='/unauthorized' element={<WarningInfo info="Unauthorized!" />} />
          <Route path='/*' element={<WarningInfo info="404 Not Found!" />} />
        </Route>
      ) : (
        <Route path='/*' element={<WarningInfo loading={true} />} />
      )
    );

    return routes;
  };

  const router = createBrowserRouter(createRoutesFromElements(generateRoutes()));

  return (
    <RouterProvider router={router} />
  );
};

export default App;
