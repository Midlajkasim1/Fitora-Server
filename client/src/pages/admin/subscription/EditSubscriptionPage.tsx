import { useNavigate, useParams } from "react-router-dom";
import {  Loader2 } from "lucide-react";
import type { CreateSubscriptionFormData } from "../../../validators/admin/Subcription.Schema";
import { useSubscriptionPlanById } from "../../../hooks/admin/subscription/use-admin-subscriptionById";
import { useUpdateSubscriptionPlan } from "../../../hooks/admin/subscription/use-admin-editSubscription";
import SubscriptionForm from "../../../components/admin/SubscriptionForm";

export default function EditSubscription() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: subscription, isLoading } = useSubscriptionPlanById(id!);
  const { mutate, isPending } = useUpdateSubscriptionPlan();

  const handleUpdate = (data: CreateSubscriptionFormData) => {
    mutate({ id: id!, data }, {
      onSuccess: () => navigate("/admin/subscriptions"),
    });
  };
console.log("Raw Subscription Data from Backend:", subscription);
  if (isLoading) return (
    <div className="h-screen w-full bg-[#050a05] flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-[#00ff94] animate-spin" />
    </div>
  );

  return (
    <SubscriptionForm 
    key={subscription?.id || "loading"} 
    mode="edit" 
    initialData={subscription} 
    onSubmit={handleUpdate} 
    isPending={isPending} 
  />
  );
}