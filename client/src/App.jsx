import React from 'react'
import MainLayout from './layouts/MainLayout';
import RegisterPatient from './pages/RegisterPatient';
import WarningInfo from './pages/WarningInfo';
import DepartmentsPage from './pages/DepartmentsPage';
import DepartmentPage from './pages/DepartmentPage';
import Home from './pages/Home';
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

  const [isLogin, roles] = useAuth();
  // const roles = ['admin', 'doctor', 'nurse']
   const generateRoutes = () => {
    const routes = (
      isLogin ? (
        <Route path='/' element={<MainLayout />}>
          {roles.includes('admin') && (
            <Route path='/register' element={<RegisterPatient />} />
          )}
          {(roles.includes('admin') || roles.includes('user')) && (
            <>
              <Route path='/departments' element={<DepartmentsPage />} />
              <Route path='/departments/:id' element={<DepartmentPage />} />
            </>
          )}
          <Route path='/home' element={<Home />} />
          <Route path='/unauthorized' element={<WarningInfo info="Unauthorized!" />} />
          <Route path='/*' element={<WarningInfo info="404 Not Found!" />} />
        </Route>
      ) : <Route path='/' element={<WarningInfo info="AUTHORIZATION SERVER NOT RUNNING"/>}></Route>
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
