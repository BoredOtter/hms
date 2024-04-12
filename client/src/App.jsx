import React from 'react'
import MainLayout from './layouts/MainLayout';
import RegisterPatient from './pages/RegisterPatient';
import WarningInfo from './pages/WarningInfo';
import DepartmentsPage from './pages/DepartmentsPage';
import DepartmentPage from './pages/DepartmentPage';
import Home from './pages/Home';
import WardPage from './pages/WardPage';
import PatientsPage from './pages/PatientsPage';
import PatientPage from './pages/PatientPage';
import useAuth from './auth/useAuth';

import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Routes
} from 'react-router-dom';


const NurseDoctorRoutes = () => (
  <Routes>
    <Route path='/departments' element={<DepartmentsPage />} />
    <Route path='/*' element={<WarningInfo info="404 Not Found!" />} />
  </Routes>
);


const App = () => {

  // const [isLogin, roles] = useAuth();
  const roles = ['admin', 'doctor', 'nurse']
   const generateRoutes = () => {
    const routes = (
      // isLogin ? (
        <Route path='/' element={<MainLayout />}>
          {roles.includes('nurse') && (
            <Route path='/register' element={<RegisterPatient />} />
          )}
          {roles.includes('doctor') && (
            <>
              <Route path='/ward' element={<WardPage />} />
              <Route path='/patients' element={<PatientsPage/>} />
              <Route path='/patients:id' element={<PatientPage/>} />

            </>
          )}
          {(roles.includes('admin') || roles.includes('doctor')) && (
            <>
              <Route path='/departments' element={<DepartmentsPage />} />
              <Route path='/departments/:id' element={<DepartmentPage />} />
            </>
          )}
          <Route path='/home' element={<Home />} />
          <Route path='/unauthorized' element={<WarningInfo info="Unauthorized!" />} />
          <Route path='/*' element={<WarningInfo info="404 Not Found!" />} />
        </Route>
      // ) : <Route path='/' element={<WarningInfo info="AUTHORIZATION SERVER NOT RUNNING"/>}></Route>
    );

    return routes;
  };

  // Create router from generated routes
  const router = createBrowserRouter(createRoutesFromElements(generateRoutes()));

  return (  
    <RouterProvider router={router} />
  );
};

export default App;
