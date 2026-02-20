
import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";


import { AuthGuard } from "./guards/AuthGuard";
import { GuestGuard } from "./guards/GuestGuard";
import { OnboardingGuard } from "./guards/OnbaordingGuard";
import { AdminGuard } from "./guards/AdminGuard";

/* Auth Pages */
const LandingPage = lazy(() => import("../pages/user/LandingPage"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("../pages/auth/forgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("../pages/auth/ResetPasswordPage"));
const VerifyPage = lazy(() => import("../pages/auth/VerifyPage"));

/* Onboarding  */
const ClientStepOne = lazy(() => import("../pages/user/client/ClientOnboarding/ClientStepOne"));
const ClientStepTwo = lazy(() => import("../pages/user/client/ClientOnboarding/ClientStepTwo"));
const TrainerStepOne = lazy(() => import("../pages/user/trainer/TrainerOnboarding/TrainerStepOne"));
const TrainerStepTwo = lazy(() => import("../pages/user/trainer/TrainerOnboarding/TrainerStepTwo"));
const WaitingApproval = lazy(() => import("../pages/user/trainer/TrainerOnboarding/WaitingApprovalPage"));

/* Dashboard */
const HomePage = lazy(() => import("../pages/user/client/HomePage"));
const TrainerDashboard = lazy(() => import("../pages/user/trainer/TrainerDashboard"));

/* admin*/
const AdminLoginPage = lazy(() => import("../pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"))
const UserManagement = lazy(() => import("../pages/admin/UserManagement"));
const TrainerManagement = lazy(() => import("../pages/admin/TrainerMangement"));

export default function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full bg-[#0a1810] flex items-center justify-center text-[#00ff94] font-black italic tracking-widest animate-pulse">
          LOADING ....
        </div>
      }
    >
      <Routes>
        {/* public routs */}
       <Route  path="/"  element={ <GuestGuard><LandingPage /></GuestGuard>} />
        {/* guest routes */}
        <Route path="/login" element={<GuestGuard><LoginPage /></GuestGuard>} />
        <Route path="/register" element={<GuestGuard><RegisterPage /></GuestGuard>} />
        <Route path="/forgot-password" element={<GuestGuard><ForgotPasswordPage /></GuestGuard>} />
        <Route path="/reset-password" element={<GuestGuard><ResetPasswordPage /></GuestGuard>} />

        <Route path="/verify-otp" element={<GuestGuard><VerifyPage mode="register" /></GuestGuard>}/>
        <Route path="/verify-reset-otp" element={<GuestGuard><VerifyPage mode="reset" /></GuestGuard>}/>

        {/* onboarding */}
        <Route path="/onboarding/user/step-1" element={<OnboardingGuard><ClientStepOne /></OnboardingGuard>} />
        <Route path="/onboarding/user/step-2" element={<OnboardingGuard><ClientStepTwo /></OnboardingGuard>} />
        <Route path="/onboarding/trainer/step-1" element={<OnboardingGuard><TrainerStepOne /></OnboardingGuard>} />
        <Route path="/onboarding/trainer/step-2" element={<OnboardingGuard><TrainerStepTwo /></OnboardingGuard>} />

        {/* user */}
       <Route path="/trainer/waiting-approval" element={<AuthGuard><WaitingApproval /> </AuthGuard>}/>

     
        <Route path="/home" element={<AuthGuard><HomePage /></AuthGuard>} />
        <Route path="/trainer/dashboard" element={<AuthGuard><TrainerDashboard /></AuthGuard>} />

        {/* admin */}
        <Route path="/admin-portal" element={<GuestGuard><AdminLoginPage /></GuestGuard>} />
        <Route path="/admin" element={<AdminGuard />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="trainers" element={<TrainerManagement/>}/>
        </Route>

       {/* common */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}