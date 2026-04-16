import { useCreateSpecialization } from "../../../hooks/admin/specialization/use-create-specialization";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import SpecializationForm from "../../../components/admin/SpecializationForm";

export default function CreateSpecialization() {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateSpecialization();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCreate = (data: any) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Specialization created");
        navigate("/admin/specializations");
      },
    });
  };

  return <SpecializationForm mode="create" onSubmit={handleCreate} isPending={isPending} />;
}