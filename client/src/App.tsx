import Footer from '@/components/Footer';
import GuestFooter from '@/components/GuestFooter';
import GuestNavbar from '@/components/GuestNavbar';
import Navbar from '@/components/Navbar';
import { getCurrentUser } from '@/features/auth/authenticationSlice';
import GuestHome from '@/pages/GuestHome';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Privacy from '@/pages/Privacy';
import Settings from '@/pages/Settings';
import Signup from '@/pages/Signup';
import SpaceDetail from '@/pages/SpaceDetail';
import Terms from '@/pages/Terms';
import { AuthRedirect, PrivateRoute } from '@/routes';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';

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
          <Route path='/dashboard/settings' element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path='/terms' element={<Terms />} />
          <Route path='/privacy' element={<Privacy />} />
        </Routes>
      </main>
      {useLoggedInLayout ? <Footer /> : <GuestFooter />}
      {/* ✅ Toaster inside AppShell - will be visible on all pages */}
      <Toaster position="top-right" richColors expand={false} closeButton />
    </div>
  );
}

function App() {
  const dispatch = useAppDispatch();


  useEffect(() => {
    void dispatch(getCurrentUser());
  }, [dispatch]);

  return (
    <Router>
      <AppShell />
    </Router>
  );
}

export default App;