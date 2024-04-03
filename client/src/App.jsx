import React from 'react'
import MainLayout from './layouts/MainLayout';
import RegisterPatient from './pages/RegisterPatient';
import WarningInfo from './pages/WarningInfo';
import DepartmentsPage from './pages/DepartmentsPage';
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

  // Dynamically generate routes based on roles
  const generateRoutes = () => {
    const routes = (
      <Route path='/' element={<MainLayout />}>
        {roles.includes('admin') && (
          <Route path='/register' element={<RegisterPatient />} />
        )}
        {(roles.includes('admin') || roles.includes('user')) && (
          <Route path='/departments' element={<DepartmentsPage />} />
        )}
        <Route path='/unauthorized' element={<WarningInfo info="Unauthorized!" />} />
        <Route path='/*' element={<WarningInfo info="404 Not Found!" />} />
      </Route>
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
