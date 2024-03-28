import React from 'react'
import MainLayout from './layouts/MainLayout';
import RegisterPatient from './pages/RegisterPatient';
import NotFoundPage from './pages/NotFoundPage';
import DepartmentsPage from './pages/DepartmentsPage';
import DepartmentPage from './pages/DepartmentPage';


import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';


const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<MainLayout />}>
        <Route path ='/register' element={<RegisterPatient />}></Route>
        <Route path ='/departments' element ={<DepartmentsPage />}></Route>
        {/* <Route path='/departments/:id' element={<DepartmentPage />} loader={jobLoader}></Route> */}
        <Route path ='/*' element={<NotFoundPage/>}></Route>
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
