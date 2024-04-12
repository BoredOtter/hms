import departments from '../../../departments.json'
import ObjectListing from './ObjectListing';

const ObjectsListing = ({objectsData, objectsTitle, objectLink, display}) => {

  // const departmentsData = departments.departments || [];

  return (
    <section className='bg-blue-50 px-4 py-10'>
      <div className='container-xl lg:container m-auto'>
        <h2 className='text-3xl font-bold text-indigo-500 mb-8 text-center'>
          {objectsTitle}
        </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-5'>
            {objectsData.map((object) => (
              <ObjectListing 
                key={object.id} 
                object={object} 
                objectLink={objectLink}
                display={display}
              />
            ))}
          </div>
      </div>
    </section>
  );
};
export default ObjectsListing;