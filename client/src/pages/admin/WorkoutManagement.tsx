import { useState } from "react";
import { AdminLayout } from "../../layout/admin/AdminLayout";
import { ManagementHeader } from "../../components/admin/ManagementHeader";
import { DataTable } from "../../components/admin/DataTable";
import { Pagination } from "../../components/admin/Pagination";
import { ConfirmModal } from "../../shared/ConfirmModal";
import { Ban, Pencil, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { WorkoutManagement } from "../../type/admin.types";
import { useWorkoutManagement } from "../../hooks/admin/workout/use-admin-workoutManagement";
import { useWorkoutToggleStatus } from "../../hooks/admin/workout/use-admin-workoutToggle";

export default function WorkoutManagementPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetWorkout, setTargetWorkout] =
    useState<WorkoutManagement | null>(null);

  const navigate = useNavigate();

  const { data, isLoading } = useWorkoutManagement({
    page,
    search,
    status,
  });

  const toggleMutation = useWorkoutToggleStatus();

  const handleToggle = () => {
    if (!targetWorkout) return;
    toggleMutation.mutate(targetWorkout.id);
    setIsModalOpen(false);
  };

  const workouts = data?.workouts ?? [];
  const total = data?.total ?? 0;

  const columns = [
    {
      header: "Video",
      render: (item: WorkoutManagement) => (
        <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-700">
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>
      ),
    },
    {
      header: "Title",
      render: (item: WorkoutManagement) => (
        <span className="text-white font-semibold">
          {item.title}
        </span>
      ),
    },
    {
      header: "Duration",
      render: (item: WorkoutManagement) => (
        <span>{item.duration} mins</span>
      ),
    },
    {
      header: "Difficulty",
      render: (item: WorkoutManagement) => (
        <span className="capitalize">{item.difficulty}</span>
      ),
    },
    {
      header: "Status",
      render: (item: WorkoutManagement) => (
        <span
          className={`px-3 py-1 rounded-full text-xs ${
            item.status === "active"
              ? "bg-green-500/10 text-green-500"
              : "bg-red-500/10 text-red-500"
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (w: WorkoutManagement) => (
        <div className="flex gap-2">
          <button
            onClick={() =>
              navigate(`/admin/edit-workouts/${w.id}`)
            }
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => {
              setTargetWorkout(w);
              setIsModalOpen(true);
            }}
          >
            <Ban size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="p-10 space-y-8">
        <header className="flex justify-between items-center">
          <h2 className="text-3xl text-white font-bold">
            Workout Management
          </h2>

              <button
                        onClick={() =>navigate("/admin/create-workouts")}
                        className="flex items-center gap-2 bg-[#00ff94] text-black px-5 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition"
                    >
                        <Plus size={18} />
                        Create Workout
                    </button>
        </header>

        <ManagementHeader
          placeholder="Search workout..."
          onSearch={setSearch}
          filters={[
            {
              label: "Status",
              options: [
                { label: "active", value: "active" },
                { label: "blocked", value: "blocked" },
              ],
              onChange: setStatus,
            },
          ]}
        />

        <DataTable
          columns={columns}
          data={workouts}
          isLoading={isLoading}
        />

        {total > 0 && (
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(total / 10)}
            totalResults={total}
            resultsPerPage={10}
            onPageChange={setPage}
          />
        )}

        <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleToggle}
          title="Change Workout Status?"
        />
      </div>
    </AdminLayout>
  );
}