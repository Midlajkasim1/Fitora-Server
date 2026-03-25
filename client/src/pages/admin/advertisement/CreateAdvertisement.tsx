import AdvertisementForm from "../../../components/admin/AdvertisementForm";
import { useCreateAdvertisement } from "../../../hooks/admin/advertisement/use-create-advertisement";

const CreateAdvertisement = () => {
  const { mutate, isPending } = useCreateAdvertisement();

  return (
 
    <AdvertisementForm 
      mode="create" 
      onSubmit={(formData: FormData) => mutate(formData)} 
      isPending={isPending} 
    />
  );
};

export default CreateAdvertisement;