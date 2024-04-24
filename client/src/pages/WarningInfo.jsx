import { NavLink } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';
import { FaSpinner } from 'react-icons/fa';

const WarningInfo = ({ info, loading=false }) => {
  return (
    loading ? 
    <div className='flex flex-col justify-center items-center h-screen'>
        <FaSpinner className='text-blue-500 animate-spin text-6xl mb-4' />
        <section className='text-center'>
          <h1 className='text-6xl font-bold mb-4'>LOADING</h1>
        </section>
      </div> :
    <section className='text-center flex flex-col justify-center items-center h-96'>
      <FaExclamationTriangle className='text-yellow-400 text-6xl mb-4' />
      <h1 className='text-6xl font-bold mb-4'>{info}</h1>
      <NavLink
        to="/home"
        className='text-white bg-indigo-700 hover:bg-indigo-900 rounded-md px-3 py-2 mt-4'
      >
        To Home Page
      </NavLink>
    </section>
  );
};

export default WarningInfo;
