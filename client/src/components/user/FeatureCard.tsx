import { type LucideIcon } from "lucide-react"; 
interface FeatureProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
}

export const FeatureCard = ({ title, description, icon: Icon, gradient }: FeatureProps) => (
  <div className="group relative p-8 rounded-[2rem] bg-[#132a1e] border border-white/5 overflow-hidden transition-all hover:border-[#00ff94]/30 hover:-translate-y-2">
    {/* Background Glow */}
    <div className={`absolute -right-10 -top-10 w-32 h-32 blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity ${gradient}`} />
    
    <div className="relative z-10">
      <div className="w-14 h-14 rounded-2xl bg-[#00ff94]/10 flex items-center justify-center text-[#00ff94] mb-6 group-hover:scale-110 transition-transform">
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-black italic uppercase tracking-tighter text-white mb-3">
        {title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed font-medium">
        {description}
      </p>
    </div>
  </div>
);