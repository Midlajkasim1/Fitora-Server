import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { AdminGuard } from "./guards/AdminGuard";
import { AuthGuard } from "./guards/AuthGuard";
import { GuestGuard } from "./guards/GuestGuard";
import { OnboardingGuard } from "./guards/OnbaordingGuard";

/* Auth Pages */
const LandingPage = lazy(() => import("../pages/user/LandingPage"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("../pages/auth/forgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("../pages/auth/ResetPasswordPage"));
const VerifyPage = lazy(() => import("../pages/auth/VerifyPage"));

/* Onboarding */
const ClientStepOne = lazy(() => import("../pages/user/client/ClientOnboarding/ClientStepOne"));
const ClientStepTwo = lazy(() => import("../pages/user/client/ClientOnboarding/ClientStepTwo"));
const TrainerStepOne = lazy(() => import("../pages/user/trainer/TrainerOnboarding/TrainerStepOne"));
const TrainerStepTwo = lazy(() => import("../pages/user/trainer/TrainerOnboarding/TrainerStepTwo"));
const WaitingApproval = lazy(() => import("../pages/user/trainer/TrainerOnboarding/WaitingApprovalPage"));

/* User - Client */
const UserLayoutPage = lazy(() => import("../layout/client/UserLayout"));
const HomePage = lazy(() => import("../pages/user/client/HomePage"));
const UserProfile = lazy(() => import("../pages/user/client/Profile"));
const ChangePassword = lazy(() => import("../pages/user/client/ChangePassword"));
const UserSpecializationList = lazy(() => import("../pages/user/client/SpecializationPage"));
const UserSpecializationDetails = lazy(() => import("../pages/user/client/SpecializationDetailsPage"));
const UserWorkoutTimeSelectionPage = lazy(() => import("../pages/user/client/WorkoutTimeSelectionPage"));

/* Video Session Page - Positioned for Full Screen */
const UserWorkoutSessionPage = lazy(() => import("../pages/user/client/VideoSessionPage"));

/* User - Trainer */
const TrainerDashboard = lazy(() => import("../pages/user/trainer/TrainerDashboard"));

/* Admin */
const AdminLoginPage = lazy(() => import("../pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const UserManagement = lazy(() => import("../pages/admin/UserManagement"));
const TrainerManagement = lazy(() => import("../pages/admin/TrainerMangement"));
const SpecializationManagement = lazy(() => import("../pages/admin/SpecializationManagement"));
const CreateSpecialization = lazy(() => import("../pages/admin/CreateSpecialization"));
const EditSpecialization = lazy(() => import("../pages/admin/EditSpecialization"));
const TrainerVerificationManagement = lazy(() => import("../pages/admin/TrainerVerificationManagement"));
const TrainerVerificationDetails = lazy(() => import("../pages/admin/TrainerVerificationDetails"));
const WorkoutManagement = lazy(() => import("../pages/admin/WorkoutManagement"));
const CreateWorkoutPage = lazy(() => import("../pages/admin/CreateWorkout"));
const EditWorkoutPage = lazy(() => import("../pages/admin/EditWorkout"));

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
        {/* Public Routes */}
        <Route path="/" element={<GuestGuard><LandingPage /></GuestGuard>} />
        
        {/* Guest Routes */}
        <Route path="/login" element={<GuestGuard><LoginPage /></GuestGuard>} />
        <Route path="/register" element={<GuestGuard><RegisterPage /></GuestGuard>} />
        <Route path="/forgot-password" element={<GuestGuard><ForgotPasswordPage /></GuestGuard>} />
        <Route path="/reset-password" element={<GuestGuard><ResetPasswordPage /></GuestGuard>} />
        <Route path="/verify-otp" element={<GuestGuard><VerifyPage mode="register" /></GuestGuard>} />
        <Route path="/verify-reset-otp" element={<GuestGuard><VerifyPage mode="reset" /></GuestGuard>} />

        {/* Onboarding */}
        <Route path="/onboarding/user/step-1" element={<OnboardingGuard><ClientStepOne /></OnboardingGuard>} />
        <Route path="/onboarding/user/step-2" element={<OnboardingGuard><ClientStepTwo /></OnboardingGuard>} />
        <Route path="/onboarding/trainer/step-1" element={<OnboardingGuard><TrainerStepOne /></OnboardingGuard>} />
        <Route path="/onboarding/trainer/step-2" element={<OnboardingGuard><TrainerStepTwo /></OnboardingGuard>} />

        {/* Full Screen Authenticated Pages (No Layout/Sidebar) */}
        <Route path="/home" element={<AuthGuard><HomePage /></AuthGuard>} />
        <Route path="/trainer/waiting-approval" element={<AuthGuard><WaitingApproval /></AuthGuard>} />
        
        {/* Video Session - Placed outside Layout for full-screen experience */}
        <Route path="/workouts/session/:id" element={<AuthGuard><UserWorkoutSessionPage /></AuthGuard>} />

        {/* User Pages With Layout (Sidebar, Header, etc.) */}
        <Route
          element={
            <AuthGuard>
              <UserLayoutPage />
            </AuthGuard>
          }
        >
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
          <Route path="/workouts" element={<UserSpecializationList />} />
          <Route path="/workouts/:id" element={<UserSpecializationDetails />} />
          <Route path="/select-workouts/:id" element={<UserWorkoutTimeSelectionPage />} />
        </Route>

        {/* Admin Portal */}
        <Route path="/admin-portal" element={<AdminLoginPage />} />

        {/* Admin Dashboard with Sidebar */}
        <Route path="/admin" element={<AdminGuard />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="trainers" element={<TrainerManagement />} />
          <Route path="specializations" element={<SpecializationManagement />} />
          <Route path="create-specializations" element={<CreateSpecialization />} />
          <Route path="edit-specializations/:id" element={<EditSpecialization />} />
          <Route path="trainer/verifications" element={<TrainerVerificationManagement />} />
          <Route path="trainer/verifications/:id" element={<TrainerVerificationDetails />} />
          <Route path="workouts" element={<WorkoutManagement />} />
          <Route path="create-workouts" element={<CreateWorkoutPage />} />
          <Route path="edit-workouts/:id" element={<EditWorkoutPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}