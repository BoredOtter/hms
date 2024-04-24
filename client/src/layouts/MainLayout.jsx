import { Outlet } from 'react-router-dom';
import Footer from '../components/footer/Footer';
import Navbar from '../components/navigation/Navbar';

const MainLayout = ({loggedUser}) => {
  return (
    <>
      <Navbar loggedUser={loggedUser}/>
      <Outlet />
      <Footer />
    </>
  );
};
export default MainLayout;