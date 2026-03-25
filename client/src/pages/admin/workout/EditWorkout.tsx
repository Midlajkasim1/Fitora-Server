
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useSpecializationsForFilter } from "../../../hooks/admin/specialization/use-admin-specializationFilter";
import { useUpdateWorkout } from "../../../hooks/admin/workout/use-edit-workout";
import { useGetWorkoutById } from "../../../hooks/admin/workout/use-workoutById";
import WorkoutForm from "../../../components/admin/WorkoutForm";


export default function EditWorkoutPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, isLoading } = useGetWorkoutById(id!);
    const mutation = useUpdateWorkout(id!);
    const { data: specializations } = useSpecializationsForFilter();

    const onSubmit = (formData: any) => {
        toast.loading("Saving changes...", { id: "update" });
        mutation.mutate(formData, {
            onSuccess: () => {
                                navigate("/admin/workouts");
                toast.success("Workout updated", { id: "update" });
            }
        });
    };

    if (isLoading) return <div className="p-10 text-[#00ff94] font-black italic animate-pulse">LOADING SOURCE DATA...</div>;

    return (
        <WorkoutForm
            key={`${id}-${data?.videoUrl}`} 
            mode="edit" 
            initialData={data} 
            specializations={specializations} 
            onSubmit={onSubmit} 
            isPending={mutation.isPending} 
        />
    );
}