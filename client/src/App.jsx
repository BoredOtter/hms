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
} from 'react-router-dom';



const App = () => {
  const [isLogin, token, roles] = useAuth();
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<MainLayout />}>
        <Route path ='/register' element={<RegisterPatient />}/>
        <Route path ='/departments' element ={<DepartmentsPage />}/>
        {/* <Route path='/departments/:id' element={<DepartmentPage />} loader={jobLoader}></Route> */}
        <Route path ='/unauthorized' element={<WarningInfo info="Unauthorized!"/>}/>
        <Route path ='/*' element={<WarningInfo info="404 Not Found!"/>}/>
      </Route>
    )
  );
  console.log(isLogin)
  return (  
      <RouterProvider router={router} />
  );
}


export default App;
