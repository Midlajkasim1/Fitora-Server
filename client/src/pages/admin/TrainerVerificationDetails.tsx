import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "../../layout/admin/AdminLayout";
import { useState } from "react";
import { ConfirmModal } from "../../shared/ConfirmModal";
import { useTrainerVerificationById } from "../../hooks/admin/use-trainer-verification-byId";
import { useUpdateTrainerApproval } from "../../hooks/admin/use-updateTrainerVerificationStatus";

export default function TrainerVerificationDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, isLoading } = useTrainerVerificationById(id!);
    const updateMutation = useUpdateTrainerApproval();

    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    if (isLoading) {
        return <div className="p-10 text-white">Loading...</div>;
    }

    if (!data) return null;

    const statusStyles =
        data.approvalStatus === "approved"
            ? "bg-green-500/10 text-green-400"
            : data.approvalStatus === "rejected"
                ? "bg-red-500/10 text-red-400"
                : "bg-yellow-500/10 text-yellow-400";
    return (
        <AdminLayout>
            <div className="p-10 space-y-8">

                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-gray-500 text-sm">
                            Verification Requests › Details
                        </p>
                        <h2 className="text-3xl font-black text-white">
                            Trainer Verification
                        </h2>
                    </div>

                    <span
                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase ${statusStyles}`}
                    >
                        {data.approvalStatus}
                    </span>
                </div>

                {/* MAIN CARD */}
                <div className="bg-[#0d1f17] border border-white/10 rounded-3xl p-10 space-y-10 shadow-2xl">

                    {/* PROFILE SECTION */}
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-[#00ff94]/20 flex items-center justify-center text-[#00ff94] text-3xl font-bold">
                            {data.trainerName.charAt(0)}
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold text-white">
                                {data.trainerName}
                            </h3>

                            <div className="mt-2 px-4 py-1 bg-black/40 rounded-full text-sm text-white inline-flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                {data.experienceYear} Years Experience
                            </div>
                        </div>
                    </div>

                    {/* GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                        {/* LEFT */}
                        <div className="space-y-6">
                            <h4 className="text-white font-bold text-lg">
                                Personal Information
                            </h4>

                            <div>
                                <p className="text-gray-500 text-sm">Email</p>
                                <p className="text-white">{data.email}</p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm">Submitted Date</p>
                                <p className="text-white">
                                    {new Date(data.createdAt).toLocaleDateString()}
                                  
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm">Bio</p>
                                <p className="text-white">{data.bio}</p>
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="space-y-6">
                            <h4 className="text-white font-bold text-lg">
                                Professional Credentials
                            </h4>

                            <div>
                                <p className="text-gray-500 text-sm">Specializations</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {data.specializations.map((sp) => (
                                        <span
                                            key={sp.id}
                                            className="px-4 py-1 bg-[#00ff94]/10 text-[#00ff94] text-xs rounded-full"
                                        >
                                            {sp.name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm">
                                    Submitted Documents
                                </p>

                                <div className="space-y-3 mt-3">
                                    {data.certifications.map((cert, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center bg-black/30 border border-white/10 rounded-xl p-4"
                                        >
                                            <span className="text-white text-sm">
                                                Certificate {index + 1}
                                            </span>

                                            <button
                                                onClick={() => setPreviewUrl(cert)}
                                                className="text-[#00ff94] text-sm hover:underline"
                                            >
                                                View
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {data.approvalStatus === "rejected" &&
                                data.rejectionReason && (
                                    <div>
                                        <p className="text-red-400 text-sm font-semibold">
                                            Rejection Reason
                                        </p>
                                        <p className="text-white text-sm mt-1">
                                            {data.rejectionReason}
                                        </p>
                                    </div>
                                )}
                        </div>
                    </div>

                    {/* ACTIONS */}
                    {data.approvalStatus === "pending" && (
                        <div className="flex justify-end gap-4 pt-8 border-t border-white/10">
                            <button
                                onClick={() => setShowRejectModal(true)}
                                className="px-6 py-3 rounded-xl text-red-400 hover:bg-red-500/10"
                            >
                                Reject
                            </button>

                            <button
                                onClick={() =>
                                    updateMutation.mutate(
                                        { id: data.id, status: "approved" },
                                        {
                                            onSuccess: () =>
                                                navigate("/admin/trainer/verifications"),
                                        }
                                    )
                                }
                                className="px-8 py-3 rounded-xl bg-[#00ff94] text-black font-bold hover:opacity-90"
                            >
                                Approve Trainer
                            </button>
                        </div>
                    )}
                </div>

                {/* REJECT MODAL */}
                <ConfirmModal
                    isOpen={showRejectModal}
                    onClose={() => setShowRejectModal(false)}
                    onConfirm={() =>
                        updateMutation.mutate(
                            {
                                id: data.id,
                                status: "rejected",
                                reason: rejectReason,
                            },
                            {
                                onSuccess: () => {
                                    setShowRejectModal(false);
                                    navigate("/admin/trainer/verifications");
                                },
                            }
                        )
                    }
                    title="Reject Trainer"
                    confirmText="Submit Rejection"
                >
                    <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Enter rejection reason..."
                        className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white"
                    />
                </ConfirmModal>

                {/* CERTIFICATE PREVIEW MODAL */}
                <ConfirmModal
                    isOpen={!!previewUrl}
                    onClose={() => setPreviewUrl(null)}
                    onConfirm={() => setPreviewUrl(null)}
                    title="Document Preview"
                    confirmText="Close"
                >
                    <div className="w-full h-[400px] bg-black rounded-xl overflow-hidden">
                        {previewUrl?.endsWith(".pdf") ? (
                            <iframe src={previewUrl} className="w-full h-full" />
                        ) : (
                            previewUrl && (
                                <img
                                    src={previewUrl}
                                    alt="preview"
                                    className="w-full h-full object-contain"
                                />
                            )
                        )}
                    </div>
                </ConfirmModal>

            </div>
        </AdminLayout>
    );
}