import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/use-auth-store';
import LandingPage from './pages/user/LandingPage';
import RegisterPage from './pages/auth/RegisterPage';
import VerifyOtpPage from './pages/auth/VerifyOtpPage';
import { TrainerStepOne } from './pages/user/TrainerOnboarding/TrainerStepOne';
import { ClientStepOne } from './pages/user/ClientOnboarding/ClientStepOne';



const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (isAuthenticated) {
    return <Navigate to={`/onboarding/${user?.role}/step-1`} replace />;
  }
  return <>{children}</>;
};

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/register" replace />;
  return <>{children}</>;
};

export default function App() {
  const { hasHydrated } = useAuthStore();

  if (!hasHydrated) return null;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
        <Route path="/verify-otp" element={<GuestRoute><VerifyOtpPage /></GuestRoute>} />

        <Route path="/onboarding/trainer/step-1" element={<AuthGuard><TrainerStepOne /></AuthGuard>} />
        <Route path="/onboarding/user/step-1" element={<AuthGuard><ClientStepOne /></AuthGuard>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}