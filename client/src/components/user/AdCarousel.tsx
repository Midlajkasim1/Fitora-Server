import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

interface AdProps {
  ad: {
    brandName: string;
    bannerImages: string[];
    brandLink: string;
    description?: string;
  };
}

export const AdCarousel = ({ ad }: AdProps) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === ad.bannerImages.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [ad.bannerImages.length]);

  return (
    <div className="relative w-full rounded-[2.5rem] bg-[#132a1e] border border-white/5 overflow-hidden min-h-[500px] flex items-center group">
      {ad.bannerImages.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 scale-105" : "opacity-0 scale-100"
          }`}
          style={{ transitionProperty: "opacity, transform" }}
        >
          <img src={img} alt="" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d1f17] via-[#0d1f17]/80 to-transparent" />
        </div>
      ))}

      <div className="relative z-10 p-12 md:p-20 max-w-2xl">
        <span className="bg-[#00ff94]/10 text-[#00ff94] text-[10px] font-black uppercase italic tracking-[0.2em] px-4 py-1.5 rounded-full border border-[#00ff94]/20">
          Featured Partner
        </span>
        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mt-6 leading-[0.9] text-white">
          {ad.brandName.split(' ').map((word, i) => 
            i === ad.brandName.split(' ').length - 1 ? 
            <span key={i} className="block mt-2"><span className="bg-white text-black px-3">{word}</span></span> : word + " "
          )}
        </h1>
        <p className="text-gray-400 mt-8 text-lg font-medium italic max-w-md">
          {ad.description || "Transform your fitness journey with our premium selection."}
        </p>
        
        <a href={ad.brandLink.startsWith('http') ? ad.brandLink : `https://${ad.brandLink}`} target="_blank" rel="noreferrer">
          <button className="mt-10 bg-[#00ff94] text-[#0d1f17] px-10 py-5 rounded-2xl font-black uppercase italic text-sm flex items-center gap-3 hover:shadow-[0_0_40px_rgba(0,255,148,0.4)] hover:-translate-y-1 transition-all">
            Explore Brand <ChevronRight className="w-5 h-5" />
          </button>
        </a>
      </div>

      <div className="absolute bottom-10 left-12 flex gap-3 z-20">
        {ad.bannerImages.map((_, i) => (
          <div 
            key={i} 
            onClick={() => setCurrent(i)}
            className="h-1 w-12 bg-white/10 rounded-full cursor-pointer overflow-hidden"
          >
            <div 
               className={`h-full bg-[#00ff94] transition-all duration-[5000ms] linear ${i === current ? 'w-full' : 'w-0'}`}
               style={{ transitionDuration: i === current ? '5000ms' : '0ms' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};