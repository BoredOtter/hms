import { useState, useEffect } from 'react';
import bodyButton from '../components/utils/bodyButton';
import keycloak from '../auth/keycloak';
import "../styles/styles.css"
import httpResources from '../client/httpResources';
import loggedUser from '../auth/loggedUser';
import ObjectDetails from '../components/utils/ObjectDetails';

const Home = ({employee_name, employee_id}) => {




  return (
    <>
      <div className='form-container bg-sky-100'>
        <h1 className='text-3xl mb-4'>Welcome to Home Page</h1>
        <div className='mb-4'>
          <p className='text-lg'>Logged User:</p>
          <p className='text-xl'>{employee_name}</p>
        </div>
<button className={bodyButton} onClick={() => keycloak.logout()}> Logout</button>
      </div>

      <div className='grid sm:grid-cols-2 gap-2'>
       

        
      </div>
    </>
  );
};

export default Home;
