import { useState } from "react";
import { 
    HelpCircle, 
    MessageCircle, 
    Mail, 
    Phone, 
    ChevronDown, 
    ChevronUp,
    Search,
    BookOpen,
    Headphones,
    MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
    {
        question: "How do I book a session with a trainer?",
        answer: "To book a session, go to the 'Trainers' tab, select your preferred coach, view their available slots, and click 'Book Now'. You'll need session credits from your active subscription."
    },
    {
        question: "What is the policy for session cancellations?",
        answer: "Sessions can be cancelled up to 12 hours before the start time. Cancelled sessions will refund the credit to your account. Late cancellations or no-shows are not eligible for refunds."
    },
    {
        question: "How does the AI workout generator work?",
        answer: "Our AI analyzes your health metrics (BMI, activity level) and fitness goals to create a personalized weekly plan. You can access this from your Premium Dashboard."
    },
    {
        question: "How do I upgrade my subscription?",
        answer: "Go to your Profile settings and select 'Subscription'. You can choose a new plan and complete the payment to upgrade instantly. Your new credits will be added immediately."
    },
    {
        question: "Can I chat with my trainer outside of sessions?",
        answer: "Yes! If you have an active booking with a trainer, you can use the Chat feature to message them directly for guidance and feedback."
    }
];

export default function SupportPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const filteredFaqs = FAQS.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="pb-20">
            {/* Hero Section */}
            <section className="relative pt-10 pb-20 px-6 overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00ff94]/10 blur-[120px] rounded-full -z-10" />
                
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00ff94]/10 border border-[#00ff94]/20 text-[#00ff94] text-[10px] font-black uppercase tracking-widest italic"
                    >
                        <HelpCircle size={14} /> Support Center
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-6xl font-black italic uppercase tracking-tighter"
                    >
                        How can we <span className="text-[#00ff94]">help you?</span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto italic font-medium"
                    >
                        Find answers to frequently asked questions or reach out to our dedicated support team for assistance with your fitness journey.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="relative max-w-xl mx-auto mt-10"
                    >
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input 
                            type="text"
                            placeholder="Search for questions, topics, or keywords..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:border-[#00ff94]/50 focus:bg-white/10 transition-all placeholder:text-gray-600 font-medium italic"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Quick Contact Cards */}
            <section className="px-6 pb-20">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ContactCard 
                        icon={<Mail className="text-[#00ff94]" size={24} />}
                        title="Email Us"
                        detail="support@fitora.ai"
                        description="Typical response time: 2-4 hours"
                        delay={0.4}
                    />
                    <ContactCard 
                        icon={<Phone className="text-[#00ff94]" size={24} />}
                        title="Call Us"
                        detail="+91 800 123 4567"
                        description="Mon-Fri, 9am - 6pm IST"
                        delay={0.5}
                    />
                    <ContactCard 
                        icon={<MessageSquare className="text-[#00ff94]" size={24} />}
                        title="Live Chat"
                        detail="Available in Premium"
                        description="Instant help from our staff"
                        delay={0.6}
                    />
                </div>
            </section>

            {/* FAQs Section */}
            <section className="px-6 py-20 bg-white/[0.02] border-y border-white/5">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter">Frequently Asked <span className="text-[#00ff94]">Questions</span></h2>
                        <p className="text-gray-500 text-xs italic font-bold uppercase tracking-widest">Everything you need to know</p>
                    </div>

                    <div className="space-y-4">
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((faq, index) => (
                                <FaqItem 
                                    key={index}
                                    faq={faq}
                                    isOpen={openFaq === index}
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                />
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                                <Search size={40} className="mx-auto text-gray-700 mb-4" />
                                <p className="text-gray-500 italic font-medium">No results found for "{searchQuery}"</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="px-4 md:px-6 py-32">
                <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#0a1810] to-black border border-white/5 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-12 relative overflow-hidden">
                    {/* Decorative Background */}
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#00ff94]/10 blur-[100px] rounded-full" />
                    
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h3 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter leading-none">Still have <br /><span className="text-[#00ff94]">questions?</span></h3>
                            <p className="text-gray-400 font-medium italic">Can't find the answer you're looking for? Please chat to our friendly team.</p>
                            <div className="flex gap-4">
                                <button className="px-8 py-4 bg-[#00ff94] text-black font-black uppercase italic text-xs rounded-2xl hover:scale-105 transition-all shadow-xl shadow-[#00ff94]/20 active:scale-95">
                                    Get In Touch
                                </button>
                                <button className="px-8 py-4 bg-white/5 text-white font-black uppercase italic text-xs rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                                    Visit Help Center
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 flex flex-col items-center text-center gap-3">
                                <div className="w-10 h-10 bg-[#00ff94]/10 rounded-xl flex items-center justify-center text-[#00ff94]"><Headphones size={20} /></div>
                                <span className="text-[10px] font-black uppercase italic text-white leading-none">Technical <br />Support</span>
                            </div>
                            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 flex flex-col items-center text-center gap-3 mt-8">
                                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400"><BookOpen size={20} /></div>
                                <span className="text-[10px] font-black uppercase italic text-white leading-none">Resource <br />Center</span>
                            </div>
                            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 flex flex-col items-center text-center gap-3">
                                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400"><MessageCircle size={20} /></div>
                                <span className="text-[10px] font-black uppercase italic text-white leading-none">Community <br />Forum</span>
                            </div>
                            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 flex flex-col items-center text-center gap-3 mt-8">
                                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400"><TrendingUp size={20} /></div>
                                <span className="text-[10px] font-black uppercase italic text-white leading-none">Success <br />Stories</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

interface ContactCardProps {
    icon: React.ReactNode;
    title: string;
    detail: string;
    description: string;
    delay: number;
}

function ContactCard({ icon, title, detail, description, delay }: ContactCardProps) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            whileHover={{ y: -5 }}
            className="bg-white/[0.03] border border-white/5 p-8 rounded-[2.5rem] text-center space-y-4 hover:border-[#00ff94]/20 transition-all group"
        >
            <div className="w-14 h-14 bg-white/5 rounded-2xl mx-auto flex items-center justify-center group-hover:bg-[#00ff94]/10 transition-colors">
                {icon}
            </div>
            <div>
                <h3 className="text-xs font-black uppercase italic text-gray-500 tracking-widest mb-1">{title}</h3>
                <p className="text-xl font-black italic text-white">{detail}</p>
            </div>
            <p className="text-[10px] text-gray-600 font-bold uppercase italic leading-tight">{description}</p>
        </motion.div>
    );
}

interface FaqItemProps {
    faq: { question: string; answer: string };
    isOpen: boolean;
    onClick: () => void;
}

function FaqItem({ faq, isOpen, onClick }: FaqItemProps) {
    return (
        <div 
            className={`border rounded-3xl transition-all duration-300 cursor-pointer overflow-hidden ${
                isOpen 
                ? 'bg-white/10 border-[#00ff94]/30 shadow-lg shadow-[#00ff94]/5' 
                : 'bg-white/5 border-white/5 hover:border-white/20'
            }`}
            onClick={onClick}
        >
            <div className="px-8 py-6 flex items-center justify-between gap-4">
                <h4 className={`text-sm md:text-base font-bold italic transition-colors ${isOpen ? 'text-[#00ff94]' : 'text-white'}`}>
                    {faq.question}
                </h4>
                <div className={`p-2 rounded-xl transition-colors ${isOpen ? 'bg-[#00ff94] text-black' : 'bg-white/5 text-gray-500'}`}>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="px-8 pb-6 pt-2 text-sm text-gray-400 font-medium italic leading-relaxed border-t border-white/5 mt-2">
                            {faq.answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const TrendingUp = ({ size, className }: { size: number, className?: string }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
    </svg>
);
