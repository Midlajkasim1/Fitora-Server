import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { GlobalLoader } from "../shared/GlobalLoader";
import { AdminGuard } from "./guards/AdminGuard";
import { AuthGuard } from "./guards/AuthGuard";
import { GuestGuard } from "./guards/GuestGuard";
import { HealthMetricsGuard } from "./guards/HealthMetricsGuard";
import { OnboardingGuard } from "./guards/OnbaordingGuard";
import { SubscriptionGuard } from "./guards/SubscriptionGuard";

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
const WorkoutCompletedPage = lazy(()=>import("../pages/user/client/WorkoutCompletePage"));
const SubscriptionListPage = lazy(()=>import("../pages/user/client/SubscriptionPage"));
const PurchaseHistoryPage = lazy(()=>import("../pages/user/client/PurchaseHistoryPage"));
const PaymentSuccessPage =lazy(()=>import("../pages/user/client/PaymentSucessPage"));
const PaymentFailedPage = lazy(()=>import("../pages/user/client/PaymentFailedPage"));
const ClientHealthMetrics = lazy(()=>import("../pages/user/client/ClientHealthMetricsPage"));
const PremiumDashboardPage = lazy(()=>import("../pages/user/client/PremiumDashboardPage"));
const UpcomingSessionPage = lazy(()=>import("../pages/user/client/slot/UpcomingSessions"))
const CheckSlotsPage = lazy(()=>import("../pages/user/client/slot/CheckSlots"))
const BrowseTrainersPage = lazy(() => import("../pages/user/client/slot/BrowserTrainersPage"));
const UserWorkoutSessionPage = lazy(() => import("../pages/user/client/VideoSessionPage"));
const WebRTCSessionPage = lazy(() => import("../pages/user/client/WebRTCSessionPage"));
const SessionReviewPage = lazy(() => import("../pages/user/client/SessionReviewPage"));


const AiSelectionPage = lazy(() => import("../pages/user/client/ai-workout&diet/AiSelection"));
const AiWorkoutPage = lazy(() => import("../pages/user/client/ai-workout&diet/AiWorkoutPage"));
const AiDietPage = lazy(() => import("../pages/user/client/ai-workout&diet/AiDietPage"));

/*  Trainer */
const TrainerDashboard = lazy(() => import("../pages/user/trainer/TrainerDashboard"));
const TrainerCleintManagement = lazy(() => import("../pages/user/trainer/TrainerClientManagement"));
const UpcomingSlotsPage = lazy(() => import("../pages/user/trainer/UpcomingSlotsPage"));
const TrainerProfilePage = lazy(() => import("../pages/user/trainer/TrainerProfilePage"));
const TrainerChangePassword = lazy(() => import("../pages/user/trainer/TrainerChangePassword"));
const TrainerWalletPage = lazy(() => import("../pages/user/trainer/TrainerWalletPage"));

// const CreateSessionSlotPage = lazy(() => import("../pages/user/trainer/CreateSessionSlotPage"));



/* Admin */
const AdminLoginPage = lazy(() => import("../pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const UserManagement = lazy(() => import("../pages/admin/UserManagement"));
const TrainerManagement = lazy(() => import("../pages/admin/TrainerMangement"));
const SpecializationManagement = lazy(() => import("../pages/admin/specialization/SpecializationManagement"));
const CreateSpecialization = lazy(() => import("../pages/admin/specialization/CreateSpecialization"));
const EditSpecialization = lazy(() => import("../pages/admin/specialization/EditSpecialization"));
const TrainerVerificationManagement = lazy(() => import("../pages/admin/TrainerVerificationManagement"));
const TrainerVerificationDetails = lazy(() => import("../pages/admin/TrainerVerificationDetails"));
const WorkoutManagement = lazy(() => import("../pages/admin/workout/WorkoutManagement"));
const CreateWorkoutPage = lazy(() => import("../pages/admin/workout/CreateWorkout"));
const EditWorkoutPage = lazy(() => import("../pages/admin/workout/EditWorkout"));
const SubscriptionManagement = lazy(()=>import("../pages/admin/subscription/SubscriptionManagement"));
const CreateSpecializationPage = lazy(()=>import("../pages/admin/subscription/CreateSubscription"));
const EditSpecializationPage = lazy(()=>import("../pages/admin/subscription/EditSubscriptionPage"));
const AdvertisementManagementPage = lazy(()=>import("../pages/admin/advertisement/AdvertisementManagement"));
const CreateAdvertisementPage = lazy(()=>import("../pages/admin/advertisement/CreateAdvertisement"));
const EditAdvertisementPage = lazy(()=>import("../pages/admin/advertisement/EditAdvertisementPage"));
const ReportManagement = lazy(() => import("../pages/admin/ReportManagement"));
const ReportDetails = lazy(() => import("../pages/admin/ReportDetails"));
const FinanceManagement = lazy(() => import("../pages/admin/FinanceManagement"));
const NotFound = lazy(() => import("../pages/NotFound"));


const TrainerLayoutPage = lazy(() => import("../layout/trainer/TrainerLayout"));



export default function AppRoutes() {
  return (
    <Suspense
      fallback={<GlobalLoader/>}
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

        <Route path="/home" element={<AuthGuard><HomePage /></AuthGuard>} />
        <Route path="/trainer/waiting-approval" element={<AuthGuard><WaitingApproval /></AuthGuard>} />
        
        <Route path="/workouts/session/:id" element={<AuthGuard><UserWorkoutSessionPage /></AuthGuard>} />
        <Route path="/video-call/:id" element={<AuthGuard><WebRTCSessionPage /></AuthGuard>} />
        <Route path="/session-review/:id" element={<AuthGuard><SessionReviewPage /></AuthGuard>} />


          <Route element={<AuthGuard><UserLayoutPage /></AuthGuard>}>
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/change-password" element={<ChangePassword />} />
         
          <Route path="/workouts" element={<UserSpecializationList />} />
          <Route path="/workouts/:id" element={<UserSpecializationDetails />} />
          <Route path="/select-workouts/:id" element={<UserWorkoutTimeSelectionPage />} />
          <Route path="/workouts/completed" element={<WorkoutCompletedPage />} />
          <Route path="/subscription" element={<SubscriptionListPage />} />
           <Route path="/purchase-history" element={<PurchaseHistoryPage />} />
          <Route  path="/health-metrics"  element={<ClientHealthMetrics />} />  
         <Route path="/payment/success" element={<PaymentSuccessPage />} />
         <Route path="/payment/cancel" element={<PaymentFailedPage />} />
          <Route path="/ai-selection" element={<AiSelectionPage />} />
          <Route path="/ai-workout" element={<AiWorkoutPage />} />
          <Route path="/ai-diet" element={<AiDietPage />} />
          <Route element={<SubscriptionGuard />}>
            <Route element={<HealthMetricsGuard />}>
              <Route path="/browse-trainers" element={<BrowseTrainersPage />} />
              <Route path="/premium-dashboard" element={<PremiumDashboardPage />} />
              <Route path="/upcoming-sessions" element={<UpcomingSessionPage />} />
              <Route path="/check-slots" element={<CheckSlotsPage />} />
            </Route>
          </Route>
        </Route>
{/* trrainer */}
       <Route path="/trainer" element={<AuthGuard><TrainerLayoutPage /></AuthGuard>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TrainerDashboard />} />
          <Route path="clients" element={<TrainerCleintManagement/>}/>
          <Route path="session" element={<UpcomingSlotsPage/>}/>
           <Route path="profile" element={<TrainerProfilePage/>}/>
            <Route path="change-password" element={<TrainerChangePassword/>}/>
            <Route path="wallet" element={<TrainerWalletPage/>}/>


          {/* <Route path="create-slot" element={<CreateSessionSlotPage/>}/> */}


        </Route>

        {/* Admin  */}
        <Route path="/admin-portal" element={<AdminLoginPage />} />

        {/* Admin Dashboard  */}
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
          <Route path="subscriptions" element={<SubscriptionManagement/>}/>
          <Route path="create-subscriptions" element={<CreateSpecializationPage/>}/>
          <Route path="edit-subscriptions/:id" element={<EditSpecializationPage/>}/>
          <Route path="advertisements" element={<AdvertisementManagementPage/>}/>
           <Route path="create-advertisement" element={<CreateAdvertisementPage/>}/>
           <Route path="edit-advertisement/:id" element={<EditAdvertisementPage/>}/>
           <Route path="reports" element={<ReportManagement />} />
           <Route path="reports/:id" element={<ReportDetails />} />
           <Route path="finance" element={<FinanceManagement />} />






        </Route>

        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}