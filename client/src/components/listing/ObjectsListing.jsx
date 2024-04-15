import departments from '../../../departments.json'
import ObjectListing from './ObjectListing';

const ObjectsListing = ({objectsData, objectsTitle, objectLink}) => {

  // const departmentsData = departments.departments || [];

  return (
    <section className='px-4 py-8'>
      <div className='container-xl lg:container m-auto'>
        <h2 className='text-3xl font-bold text-indigo-500 mb-8 text-center'>
          {objectsTitle}
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-5'>
          {objectsData.map((object) => (
            <div key={object.id} className="col-span-1">
              <ObjectListing 
                object={object} 
                objectLink={objectLink}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default ObjectsListing;