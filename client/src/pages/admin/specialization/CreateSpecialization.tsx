import { useCreateSpecialization } from "../../../hooks/admin/specialization/use-create-specialization";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import SpecializationForm from "../../../components/admin/SpecializationForm";
import type { CreateSpecialization } from "../../../type/admin.types";

export default function CreateSpecialization() {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateSpecialization();

  const handleCreate = (data: CreateSpecialization) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Specialization created");
        navigate("/admin/specializations");
      },
    });
  };

  return <SpecializationForm mode="create" onSubmit={handleCreate} isPending={isPending} />;
}