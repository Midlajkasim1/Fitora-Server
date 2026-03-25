import { useParams } from "react-router-dom";
import AdvertisementForm from "../../../components/admin/AdvertisementForm";
import { Loader2 } from "lucide-react"; 
import { useAdvertisementById } from "../../../hooks/admin/advertisement/use-admin-advertisementById";
import { useUpdateAdvertisement } from "../../../hooks/admin/advertisement/use-admin-update-advertisement";

const EditAdvertisement = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: initialAd, isLoading } = useAdvertisementById(id!);
  
  const { mutate, isPending } = useUpdateAdvertisement();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#050a05]">
        <Loader2 className="w-10 h-10 text-[#00ff94] animate-spin" />
      </div>
    );
  }

  return (
    <AdvertisementForm
      mode="edit"
      initialData={initialAd}
      onSubmit={(formData: FormData) => mutate({ id: id!, data: formData })}
      isPending={isPending}
    />
  );
};

export default EditAdvertisement;