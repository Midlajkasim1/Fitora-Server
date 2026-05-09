import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, AlertTriangle, CheckCircle2, LayoutDashboard, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSessionAccess } from '../../../hooks/user/video/use-sessionAccess';
import { createReview } from '../../../api/review.api';
import { createIncidentReport } from '../../../api/incident.api';


const SessionReviewPage = () => {
    const { id: slotId } = useParams();
    const navigate = useNavigate();

    const { data: accessData, isLoading: isAccessLoading, isFetching } = useSessionAccess(slotId || '');

    useEffect(() => {
        if (!isAccessLoading && !isFetching && accessData && !accessData.showReview) {
            toast.error("You don't have access to this review yet.");
            navigate('/home');
        }
    }, [isAccessLoading, isFetching, accessData, navigate]);


    const [rating, setRating] = useState(0);

    const [hover, setHover] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [reportType, setReportType] = useState('Misconduct');

    const [reportDetails, setReportDetails] = useState('');
    
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [isSubmittingReport, setIsSubmittingReport] = useState(false);

    const handleSubmitReview = async () => {
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }
        if (!accessData?.bookingId) {
            toast.error("Booking data missing");
            return;
        }

        setIsSubmittingReview(true);
        try {
            await createReview({
                bookingId: accessData.bookingId,
                rating,
                comment: feedback
            });
            toast.success("Thank you for your feedback!");
        } catch (error: any) {
            // Error is handled by global interceptor
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const handleSubmitReport = async () => {
        if (!reportDetails.trim()) {
            toast.error("Please describe the issue");
            return;
        }
        if (!accessData?.bookingId) {
            toast.error("Booking data missing");
            return;
        }

        setIsSubmittingReport(true);
        try {
            await createIncidentReport({
                reportedId: (accessData as any).reportedId || slotId || '',
                type: reportType,
                description: reportDetails,
                sessionId: accessData.bookingId
            });
            toast.success("Report submitted. Our team will investigate.");
            setReportDetails('');
        } catch (error: any) {
            // Error is handled by global interceptor
        } finally {
            setIsSubmittingReport(false);
        }

    };


    if (isAccessLoading) {
        return (
            <div className="min-h-screen bg-[#06110e] flex items-center justify-center">
                <Loader2 size={40} className="text-[#00ff94] animate-spin" />
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-[#06110e] text-white flex flex-col items-center justify-center p-6 font-sans">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-5xl w-full text-center space-y-12"
            >
                {/* Header Section */}
                <div className="space-y-4">
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.2 }}
                        className="w-20 h-20 bg-[#00ff94]/10 border-2 border-[#00ff94]/40 rounded-full flex items-center justify-center mx-auto"
                    >
                        <CheckCircle2 size={40} className="text-[#00ff94]" />
                    </motion.div>
                    <h1 className="text-6xl font-black italic uppercase tracking-tighter">SESSION COMPLETE</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-sm">You crushed it! Here's your summary for today.</p>
                </div>

                {/* Cards Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                    {/* Rating Card */}
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-[#0b1b16] border border-white/5 p-10 rounded-[3rem] space-y-8 shadow-2xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                             <Star size={100} fill="#00ff94" />
                        </div>
                        
                        <div>
                            <h2 className="text-2xl font-black italic uppercase">Rate the Session</h2>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-2">How did your AI Trainer perform? Your feedback improves future recommendations.</p>
                        </div>

                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => {
                                const displayValue = hover || rating;
                                const isFull = displayValue >= star;
                                const isHalf = displayValue >= star - 0.5 && displayValue < star;

                                return (
                                    <div 
                                        key={star} 
                                        className="relative cursor-pointer transition-transform active:scale-95"
                                        onMouseLeave={() => setHover(0)}
                                    >
                                        {/* Hitboxes for Half-Star Interaction */}
                                        <div 
                                            className="absolute inset-y-0 left-0 w-1/2 z-20"
                                            onMouseEnter={() => setHover(star - 0.5)}
                                            onClick={() => setRating(star - 0.5)}
                                        />
                                        <div 
                                            className="absolute inset-y-0 right-0 w-1/2 z-20"
                                            onMouseEnter={() => setHover(star)}
                                            onClick={() => setRating(star)}
                                        />

                                        {/* Background Star */}
                                        <Star size={40} className="text-white/10" />

                                        {/* Foreground Star (Filled) */}
                                        <motion.div 
                                            initial={false}
                                            animate={{ width: isFull ? '100%' : isHalf ? '50%' : '0%' }}
                                            className="absolute top-0 left-0 h-full overflow-hidden text-[#00ff94]"
                                        >
                                            <Star size={40} fill="#00ff94" />
                                        </motion.div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-4xl font-black italic text-[#00ff94]">{rating.toFixed(1)}</span>
                            <span className="text-white/20 font-black italic text-xl">/ 5.0</span>
                        </div>


                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-white/30 tracking-widest">Additional Feedback</label>
                            <textarea 
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="about session......"
                                className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-sm focus:outline-none focus:border-[#00ff94]/50 transition-all min-h-[120px] resize-none"
                            />
                        </div>

                        <button 
                            onClick={handleSubmitReview}
                            disabled={isSubmittingReview}
                            className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl font-black uppercase italic text-xs hover:bg-[#00ff94] hover:text-black transition-all duration-300 disabled:opacity-50"
                        >
                            {isSubmittingReview ? 'Processing...' : 'Review'}
                        </button>
                    </motion.div>

                    {/* Report Card */}
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-[#0b1b16] border border-white/5 p-10 rounded-[3rem] space-y-8 shadow-2xl relative overflow-hidden group"
                    >
                         <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                             <AlertTriangle size={100} fill="#ff4d4d" />
                        </div>

                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-black italic uppercase">Report an Issue</h2>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-2">Something wrong with the AI Trainer? Let us know.</p>
                            </div>
                            <AlertTriangle size={24} className="text-white/20" />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-white/30 tracking-widest">Type of Report</label>
                            <select 
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-sm focus:outline-none focus:border-[#00ff94]/50 transition-all appearance-none cursor-pointer"
                            >
                                <option value="Misconduct">Professional Misconduct</option>
                                <option value="Bug">Technical Glitch</option>
                                <option value="Harassment">Inappropriate Content</option>
                                <option value="Payment">Billing Issue</option>
                                <option value="Other">Other</option>
                            </select>

                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-white/30 tracking-widest">Describe the issue ..</label>
                            <textarea 
                                value={reportDetails}
                                onChange={(e) => setReportDetails(e.target.value)}
                                placeholder="Describe the issue .."
                                className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-sm focus:outline-none focus:border-red-500/50 transition-all min-h-[120px] resize-none"
                            />
                        </div>

                        <button 
                            onClick={handleSubmitReport}
                            disabled={isSubmittingReport}
                            className="w-full py-5 bg-red-600/10 border border-red-600/20 text-red-500 rounded-2xl font-black uppercase italic text-xs hover:bg-red-600 hover:text-white transition-all duration-300 disabled:opacity-50"
                        >
                            {isSubmittingReport ? 'Reporting...' : 'Submit Report'}
                        </button>
                    </motion.div>
                </div>

                {/* Dashboard Button */}
                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/home')}
                    className="flex items-center gap-4 px-12 py-6 bg-[#00ff94] text-black rounded-3xl font-black uppercase italic mx-auto shadow-[0_0_50px_rgba(0,255,148,0.3)] hover:shadow-[0_0_70px_rgba(0,255,148,0.5)] transition-all"
                >
                    <LayoutDashboard size={20} />
                    Return to Dashboard
                </motion.button>
            </motion.div>
        </div>
    );
};

export default SessionReviewPage;
