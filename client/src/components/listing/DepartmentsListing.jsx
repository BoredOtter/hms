import departments from '../../../departments.json'
import DepartmentListing from './DepartmentListing';
// import Spinner from './Spinner';

const DepartmentsListing = ({ isHome = false }) => {

    const departmentsData = departments.departments || [];

  return (
    <section className='bg-blue-50 px-4 py-10'>
      <div className='container-xl lg:container m-auto'>
        <h2 className='text-3xl font-bold text-indigo-500 mb-8 text-center'>
          Departments
        </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {departmentsData.map((department) => (
              <DepartmentListing key={department.id} department={department} />
            ))}
          </div>
      </div>
    </section>
  );
};
export default DepartmentsListing;