import { useNavigate } from "react-router-dom";
import { useCreateSubscriptionPlan } from "../../../hooks/admin/subscription/use-admin-createSubscription";
import SubscriptionForm from "../../../components/admin/SubscriptionForm";
import type { CreateSubscriptionFormData } from "../../../validators/admin/Subcription.Schema";
import toast from "react-hot-toast";

export default function CreateSubscription() {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateSubscriptionPlan();

  const handleCreate = (data: CreateSubscriptionFormData) => {
    // Show loading state
    const toastId = toast.loading("Creating premium tier...");

    mutate(data, {
      onSuccess: () => {
        toast.success("Subscription plan published!", { id: toastId });
        navigate("/admin/subscriptions");
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to create plan", { id: toastId });
      },
    });
  };

  return (
    <SubscriptionForm 
      mode="create" 
      onSubmit={handleCreate} 
      isPending={isPending} 
    />
  );
}