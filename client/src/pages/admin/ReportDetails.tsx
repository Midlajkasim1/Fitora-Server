import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "../../layout/admin/AdminLayout";
import { 
    useReportDetails, 
    useUpdateReportStatus 
} from "../../hooks/admin/use-admin-report-management";
import { 
    Check, 
    X, 
    User,
    ExternalLink,
    AlertCircle,
    Info,
    ChevronLeft
} from "lucide-react";
import { ConfirmModal } from "../../shared/ConfirmModal";
import { useState } from "react";

export default function ReportDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: report, isLoading } = useReportDetails(id || "");
    const updateMutation = useUpdateReportStatus();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState<"Resolved" | "Dismissed" | null>(null);
    const [resolutionNotes, setResolutionNotes] = useState("");

    if (isLoading) return <div className="min-h-screen bg-[#07110c] flex items-center justify-center text-[#00ff94] font-black italic uppercase tracking-widest">Loading Report...</div>;
    if (!report) return <div className="min-h-screen bg-[#07110c] flex items-center justify-center text-red-500 font-black italic uppercase tracking-widest">Report Not Found</div>;

    const handleActionClick = (action: "Resolved" | "Dismissed") => {
        setModalAction(action);
        setResolutionNotes("");
        setIsModalOpen(true);
    };

    const handleConfirm = () => {
        if (modalAction && id) {
            updateMutation.mutate({ id, status: modalAction, resolutionNotes }, {
                onSuccess: () => navigate("/admin/reports")
            });
            setIsModalOpen(false);
        }
    };

    return (
        <AdminLayout>
            <div className="min-h-screen bg-[#07110c] text-white p-10 space-y-8">
                {/* Top Action Bar */}
                <div className="flex justify-between items-center">
                    <button 
                        onClick={() => navigate("/admin/reports")}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-widest italic">Back to Listing</span>
                    </button>

                    {(report.status === "Pending" || report.status === "Under Review") && (
                        <div className="flex gap-4">
                            <button 
                                onClick={() => handleActionClick("Dismissed")}
                                className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-3 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300 font-bold"
                            >
                                <X size={18} strokeWidth={3} />
                                <span className="text-sm">Dismiss Report</span>
                            </button>
                            <button 
                                onClick={() => handleActionClick("Resolved")}
                                className="flex items-center gap-3 bg-[#00ff94] text-black px-6 py-3 rounded-2xl hover:bg-[#00cc76] transition-all duration-300 font-black shadow-[0_0_20px_rgba(0,255,148,0.2)]"
                            >
                                <Check size={18} strokeWidth={4} />
                                <span className="text-sm">Resolve Report</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Header Section */}
                <div className="space-y-4">
                    {report.status === "Pending" || report.status === "Under Review" ? (
                        <div className="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-500 px-4 py-1.5 rounded-lg border border-yellow-500/20">
                            <AlertCircle size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Needs Action</span>
                        </div>
                    ) : report.status === "Resolved" ? (
                        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-lg border border-emerald-500/20">
                            <Check size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Resolved</span>
                        </div>
                    ) : (
                        <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-1.5 rounded-lg border border-red-500/20">
                            <X size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Dismissed</span>
                        </div>
                    )}
                    
                    <h1 className="text-5xl font-black italic uppercase tracking-tighter">Report</h1>
                    
                    <p className="text-gray-500 max-w-2xl text-sm leading-relaxed font-medium transition-opacity">
                        Review the details below submitted by a user regarding a session incident. 
                        Please adhere to the platform's conflict resolution guidelines.
                    </p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                    {/* Report Status Card */}
                    <div className="bg-[#0b1b16] border border-white/5 rounded-[2.5rem] p-8 space-y-10">
                        <div className="flex items-center gap-2 text-[#00ff94] mb-2">
                           <Info size={18} />
                           <h3 className="text-sm font-black uppercase tracking-widest italic">Report Details</h3>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div className="space-y-1">
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Date Submitted</p>
                                <p className="text-sm font-bold text-gray-200">
                                    {new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Current Status</p>
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border w-fit ${
                                    report.status === "Pending" || report.status === "Under Review" 
                                        ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/10" 
                                        : report.status === "Resolved"
                                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/10"
                                            : "bg-red-500/10 text-red-600 border-red-500/10"
                                }`}>
                                    {(report.status === "Pending" || report.status === "Under Review") && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                                    )}
                                    <span className="text-[10px] font-black uppercase italic">{report.status}</span>
                                </div>
                            </div>
                            <div className="col-span-2 space-y-1">
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Type of Report</p>
                                <p className="text-lg font-black text-[#00ff94] italic tracking-tight">{report.type}</p>
                            </div>
                        </div>

                        {/* Parties Involved */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <UserCard 
                                label="Reporter" 
                                name={report.reporter.name} 
                                image={report.reporter.profileImage}
                                role={report.reporter.role}
                            />
                            <UserCard 
                                label="Reported Party" 
                                name={report.reportedName || "System Asset"} 
                                role="Trainer"
                                isReported
                            />
                        </div>

                        {/* Description Box */}
                        <div className="space-y-4 pt-4 border-t border-white/5">
                             <div className="flex items-center gap-2 text-gray-400">
                                <FileText size={18} />
                                <h3 className="text-sm font-black uppercase tracking-widest italic">Description</h3>
                             </div>
                             <div className="bg-black/20 border border-white/5 p-8 rounded-3xl min-h-[160px]">
                                <p className="text-gray-300 leading-relaxed text-sm italic font-medium">
                                    "{report.description}"
                                </p>
                             </div>
                        </div>

                        {/* Resolution Details (If any) */}
                        {(report.status === "Resolved" || report.status === "Dismissed") && (
                             <div className="space-y-4 pt-4 border-t border-white/5 bg-[#00ff94]/5 -mx-8 -mb-8 p-8 rounded-b-[2.5rem]">
                                 <div className="flex items-center gap-2 text-[#00ff94]">
                                     <CheckCircle size={18} />
                                     <h3 className="text-sm font-black uppercase tracking-widest italic">Admin Resolution</h3>
                                 </div>
                                 <div className="grid grid-cols-1 gap-4">
                                     <div className="space-y-1">
                                         <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Resolution Date</p>
                                         <p className="text-sm font-bold text-gray-200">
                                             {new Date(report.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                         </p>
                                     </div>
                                     <div className="space-y-2">
                                         <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Notes / Outcome</p>
                                         <p className="text-gray-300 text-sm italic leading-relaxed">
                                             {report.resolutionNotes || "No additional notes provided."}
                                         </p>
                                     </div>
                                 </div>
                             </div>
                         )}
                    </div>
                </div>

                <ConfirmModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleConfirm}
                    title={`Confirm ${modalAction}`}
                    message={`Are you sure you want to mark this report as ${modalAction}?`}
                    confirmText={`Yes, ${modalAction}`}
                    variant={modalAction === "Resolved" ? "success" : "danger"}
                >
                    <div className="w-full mt-4 space-y-2 text-left">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">
                            {modalAction === "Resolved" ? "Resolution Notes" : "Dismissal Reason"}
                        </label>
                        <textarea 
                            value={resolutionNotes}
                            onChange={(e) => setResolutionNotes(e.target.value)}
                            placeholder={`Enter any notes regarding this ${modalAction?.toLowerCase()}...`}
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-sm text-gray-300 focus:outline-none focus:border-[#00ff94]/50 min-h-[100px] resize-none"
                        />
                    </div>
                </ConfirmModal>
            </div>
        </AdminLayout>
    );
}

const UserCard = ({ label, name, image, isReported }: any) => (
    <div className="bg-black/20 border border-white/5 p-4 rounded-2xl flex items-center justify-between group hover:border-[#00ff94]/30 transition-all cursor-pointer">
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center ${isReported ? 'bg-[#00ff94]/10 text-[#00ff94]' : 'bg-[#00ff94]/5 text-gray-500'}`}>
                {image ? (
                    <img src={image} alt="" className="w-full h-full object-cover" />
                ) : (
                    isReported ? <CheckCircle size={24} /> : <User size={24} />
                )}
            </div>
            <div>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{label}</p>
                <p className="text-sm font-black text-gray-100 italic tracking-tight">{name}</p>
            </div>
        </div>
        <ExternalLink size={18} className="text-gray-600 group-hover:text-[#00ff94] transition-colors" />
    </div>
);

const FileText = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
);
const CheckCircle = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);
