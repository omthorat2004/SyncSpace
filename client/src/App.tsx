import Footer from '@/components/Footer';
import GuestFooter from '@/components/GuestFooter';
import GuestNavbar from '@/components/GuestNavbar';
import LoadingShimmer from '@/components/LoadingShimmer';
import Navbar from '@/components/Navbar';
import { selectAuthLoading } from '@/features/auth/authenticationSlice';
import GuestHome from '@/pages/GuestHome';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import SpaceDetail from '@/pages/SpaceDetail';
import { AuthRedirect, PrivateRoute } from '@/routes';
import { useAppSelector } from '@/store/hook';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';

function AppShell() {
  const location = useLocation();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  const useLoggedInLayout = isAuthenticated && isDashboardRoute;

  return (
    <div className="flex flex-col min-h-screen">
      {useLoggedInLayout ? <Navbar /> : <GuestNavbar />}
      <main>
        <Routes>
          <Route path="/" element={<GuestHome />} />
          <Route path='/signup' element={<AuthRedirect><Signup /></AuthRedirect>} />
          <Route path='/login' element={<AuthRedirect><Login /></AuthRedirect>} />
          <Route path='/dashboard' element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path='/dashboard/spaces/:spaceId' element={<PrivateRoute><SpaceDetail /></PrivateRoute>} />
        </Routes>
      </main>
      {useLoggedInLayout ? <Footer /> : <GuestFooter />}
    </div>
  );
}

function App() {

  const isLoading = useAppSelector(selectAuthLoading);




  // useEffect(() => {
  //   void dispatch(refreshSession())
  // }, [dispatch]);

  if (isLoading) {
    return <LoadingShimmer />;
  }

  return (
    <Router>
      <AppShell />
    </Router>
  );
}

export default App;