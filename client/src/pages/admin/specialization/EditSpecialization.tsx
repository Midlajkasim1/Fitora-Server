import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import SpecializationForm from "../../../components/admin/SpecializationForm";
import { useSpecializationById } from "../../../hooks/admin/specialization/use-specializationById";
import { useUpdateSpecialization } from "../../../hooks/admin/specialization/use-update-specialization";
import type { UpdateSpecialization } from "../../../type/admin.types";

export default function EditSpecialization() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = useSpecializationById(id!);
  const { mutate, isPending } = useUpdateSpecialization();

  const handleUpdate = (formData: Omit<UpdateSpecialization, "id">) => {
    mutate(
      { id: id!, ...formData },
      {
        onSuccess: () => {
          toast.success("Specialization updated");
          navigate("/admin/specializations");
        },
      }
    );
  };

  return (
    <SpecializationForm
  key={data?.imageUrl || id} 
  mode="edit" 
  initialData={data} 
  onSubmit={handleUpdate} 
  isPending={isPending} 
/>
  );
}