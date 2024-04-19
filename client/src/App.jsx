import React from 'react';
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
import PatientVitals from './components/PatientVitals';
import PatientHistory from './components/PatientHistory';
import httpClient from './client/httpClient';

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
    <Route path='/ward' element={<WardPage />} />
    <Route path='/patients' element={<PatientsPage />} />
    <Route path='/patients/:id' element={<PatientPage />} />
    <Route path='/patients/:id/vitals' element={<PatientVitals />} />
    <Route path='/patients/:id/history' element={<PatientHistory />} />
    <Route path='/departments' element={<DepartmentsPage />} />
    <Route path='/departments/:id' element={<DepartmentPage />} />
  </>
);

const App = () => {
  const [isLogin, roles, name] = useAuth();

  const generateRoutes = () => {
    const routes = (
      isLogin ? (
        <Route path='/' element={<MainLayout loggedUser={roles}/>}>
          {roles.includes('nurse') && generateNurseRoutes()}
          {roles.includes('doctor') && generateDoctorRoutes()}
          <Route path='/home' element={<Home userName={name}/>} />
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
