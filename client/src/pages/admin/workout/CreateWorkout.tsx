
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSpecializationsForFilter } from "../../../hooks/admin/specialization/use-admin-specializationFilter";
import { useCreateWorkout } from "../../../hooks/admin/workout/use-create-workout";
import WorkoutForm from "../../../components/admin/WorkoutForm";
import type { CreateWorkoutFormData } from "../../../validators/admin/workout.Schema";


export default function CreateWorkoutPage() {
    const navigate = useNavigate();
    const mutation = useCreateWorkout();
    const { data: specializations } = useSpecializationsForFilter();

    const onSubmit = (data: CreateWorkoutFormData) => {
        toast.loading("Uploading workout...", { id: "publish" });
        mutation.mutate(data, {
            onSuccess: () => {
                toast.success("Workout published", { id: "publish" });
                navigate("/admin/workouts");
            }
        });
    };

    return (
        <WorkoutForm
            mode="create" 
            specializations={specializations} 
            onSubmit={onSubmit} 
            isPending={mutation.isPending} 
        />
    );
}