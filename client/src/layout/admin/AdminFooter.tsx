export const AdminFooter = () => {
  return (
    <footer className="bg-[#0a1810] border-t border-white/5 pt-16 pb-8 px-12 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
             <div className="w-6 h-6 bg-[#00ff94] rounded-sm flex items-center justify-center text-black font-black text-xs">B</div>
             <span className="font-bold text-white italic">Byway</span>
          </div>
          <p className="text-gray-600 text-[11px] leading-relaxed italic">
            Empowering learners through accessible and engaging online education. Byway is a leading online learning platform providing high-quality courses.
          </p>
        </div>
        
        {/* Footer Columns */}
        {[
          { title: "Get Help", links: ["Contact Us", "Latest Articles", "FAQ"] },
          { title: "Programs", links: ["Art & Design", "Business", "IT & Software", "Programming"] },
          { title: "Contact Us", links: ["123 AI Fitness Ave, Silicon Valley, CA", "(123) 456-7890", "support@byway.com"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="text-white text-[11px] font-bold uppercase mb-6 italic tracking-widest">{col.title}</h4>
            <ul className="space-y-4">
              {col.links.map((link) => (
                <li key={link} className="text-gray-500 text-[11px] hover:text-[#00ff94] cursor-pointer transition-colors italic">{link}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/5 pt-8 text-center">
        <p className="text-[9px] text-gray-700 font-bold uppercase italic">© 2024 Byway. All rights reserved.</p>
      </div>
    </footer>
  );
};