import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "../../layout/admin/AdminLayout";
import { useState } from "react";
import { ConfirmModal } from "../../shared/ConfirmModal";
import { useTrainerVerificationById } from "../../hooks/admin/use-trainer-verification-byId";
import { useUpdateTrainerApproval } from "../../hooks/admin/use-updateTrainerVerificationStatus";
import { Loader2, CheckCircle, XCircle, FileText, Calendar, Mail, User } from "lucide-react";

export default function TrainerVerificationDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // 1. DATA FETCHING
    const { data, isLoading } = useTrainerVerificationById(id!);
    const updateMutation = useUpdateTrainerApproval();

    // 2. LOCAL STATE
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    if (isLoading) {
        return (
            <div className="h-screen bg-[#050a05] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-[#00ff94] animate-spin" />
            </div>
        );
    }

    if (!data) return null;

    // 3. ACTION HANDLERS (With Loading Logic)
    const handleApprove = () => {
        updateMutation.mutate(
            { id: data.id, status: "approved" },
            {
                onSuccess: () => navigate("/admin/trainer/verifications"),
            }
        );
    };

    const handleReject = () => {
        if (!rejectReason.trim()) return;
        
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
        );
    };

    const statusStyles =
        data.approvalStatus === "approved"
            ? "bg-green-500/10 text-green-400 border-green-500/20"
            : data.approvalStatus === "rejected"
                ? "bg-red-500/10 text-red-400 border-red-500/20"
                : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";

    return (
        <AdminLayout>
            <div className="p-10 space-y-8">
                {/* HEADER */}
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">
                            Verification Requests › Details
                        </p>
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">
                            Trainer Verification
                        </h2>
                    </div>
                    <div className={`px-4 py-2 rounded-xl border ${statusStyles} flex items-center gap-2`}>
                        <div className={`w-2 h-2 rounded-full animate-pulse ${data.approvalStatus === 'approved' ? 'bg-green-400' : data.approvalStatus === 'rejected' ? 'bg-red-400' : 'bg-yellow-400'}`} />
                        <span className="text-[10px] font-black uppercase italic tracking-widest">
                            {data.approvalStatus}
                        </span>
                    </div>
                </div>

                {/* MAIN CONTENT CARD */}
                <div className="bg-[#0d1f17] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00ff94]/20 to-transparent" />

                    {/* PROFILE HEADER */}
                    <div className="flex items-center gap-8 mb-12">
                        <div className="w-24 h-24 rounded-3xl bg-black border border-white/10 flex items-center justify-center text-[#00ff94] text-4xl font-black italic shadow-inner">
                            {data.trainerName.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-white italic uppercase tracking-tight">
                                {data.trainerName}
                            </h3>
                            <div className="mt-3 flex gap-3">
                                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-gray-400 uppercase italic">
                                    {data.experienceYear} Years Experience
                                </span>
                             
                            </div>
                        </div>
                    </div>

                    {/* DATA GRID */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* LEFT: INFO */}
                        <div className="space-y-8">
                            <SectionHeader icon={<User size={16}/>} title="Personal Profile" />
                            <InfoBlock label="Email Address" value={data.email} />
                            <InfoBlock label="Submission Date" value={new Date(data.createdAt).toLocaleDateString()} />
                            <InfoBlock label="Biography" value={data.bio} />
                        </div>

                        {/* RIGHT: CREDENTIALS */}
                        <div className="space-y-8">
                            <SectionHeader icon={<CheckCircle size={16}/>} title="Professional Credentials" />
                            
                            <div className="space-y-3">
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic">Specializations</p>
                                <div className="flex flex-wrap gap-2">
                                    {data.specializations.map((sp) => (
                                        <span key={sp.id} className="px-3 py-1 bg-[#00ff94]/5 border border-[#00ff94]/10 text-[#00ff94] text-[10px] font-bold uppercase italic rounded-md">
                                            {sp.name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic">Submitted Certificates</p>
                                <div className="grid grid-cols-1 gap-2">
                                    {data.certifications.map((cert, index) => (
                                        <div key={index} className="flex justify-between items-center bg-black/40 border border-white/5 rounded-xl p-4 group hover:border-[#00ff94]/30 transition-all">
                                            <div className="flex items-center gap-3">
                                                <FileText size={18} className="text-gray-500 group-hover:text-[#00ff94]" />
                                                <span className="text-xs font-bold text-gray-300">Certificate_0{index + 1}.pdf</span>
                                            </div>
                                            <button onClick={() => setPreviewUrl(cert)} className="text-[10px] font-black uppercase text-[#00ff94] italic tracking-widest hover:underline">
                                                View Document
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ACTION BUTTONS (With Loading UI) */}
                    {data.approvalStatus === "pending" && (
                        <div className="flex justify-end gap-6 pt-10 mt-10 border-t border-white/5">
                            <button
                                onClick={() => setShowRejectModal(true)}
                                disabled={updateMutation.isPending}
                                className="px-8 py-4 rounded-2xl text-red-500 font-black uppercase italic text-xs tracking-widest hover:bg-red-500/5 transition-all disabled:opacity-30"
                            >
                                Reject Application
                            </button>

                            <button
                                onClick={handleApprove}
                                disabled={updateMutation.isPending}
                                className="px-10 py-4 rounded-2xl bg-[#00ff94] text-black font-black uppercase italic text-xs tracking-widest flex items-center gap-3 shadow-[0_0_30px_rgba(0,255,148,0.2)] hover:shadow-[0_0_40px_rgba(0,255,148,0.4)] transition-all disabled:opacity-50"
                            >
                                {updateMutation.isPending ? (
                                    <><Loader2 size={16} className="animate-spin" /> Processing...</>
                                ) : (
                                    <><CheckCircle size={16} /> Approve Trainer</>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* MODALS */}
                <ConfirmModal
                    isOpen={showRejectModal}
                    onClose={() => setShowRejectModal(false)}
                    onConfirm={handleReject}
                    title="Reject Application"
                    confirmText={updateMutation.isPending ? "Rejecting..." : "Confirm Rejection"}
                    isPending={updateMutation.isPending} // Pass loading state to modal button
                >
                    <div className="space-y-4">
                        <p className="text-gray-400 text-sm italic font-medium">Please state the reason for rejection. This will be sent to the trainer via email.</p>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Reason for rejection (e.g., Invalid certification format)..."
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-white text-sm outline-none focus:border-red-500/50 h-40 resize-none transition-all"
                        />
                    </div>
                </ConfirmModal>

                <ConfirmModal
                    isOpen={!!previewUrl}
                    onClose={() => setPreviewUrl(null)}
                    onConfirm={() => setPreviewUrl(null)}
                    title="Document Preview"
                    confirmText="Done"
                >
                    <div className="w-full h-[60vh] bg-black rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                        {previewUrl?.includes(".pdf") ? (
                            <iframe src={`${previewUrl}#toolbar=0`} className="w-full h-full" />
                        ) : (
                            <img src={previewUrl || ""} className="w-full h-full object-contain" alt="preview" />
                        )}
                    </div>
                </ConfirmModal>
            </div>
        </AdminLayout>
    );
}

// 4. HELPER COMPONENTS
const SectionHeader = ({ icon, title }: { icon: any, title: string }) => (
    <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#00ff94]/10 rounded-lg text-[#00ff94]">{icon}</div>
        <h4 className="text-white font-black italic uppercase tracking-tight">{title}</h4>
    </div>
);

const InfoBlock = ({ label, value }: { label: string, value: string }) => (
    <div className="space-y-1">
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic">{label}</p>
        <p className="text-white font-medium text-sm leading-relaxed">{value}</p>
    </div>
);