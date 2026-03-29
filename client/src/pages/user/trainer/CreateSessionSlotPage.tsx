import { useState } from "react";
import { CreateSlotModal } from "../../../components/trainer/SlotModal";

const UpcomingSlotsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white uppercase italic">Upcoming Slots</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#00ff94] text-black px-6 py-3 rounded-xl font-black text-xs uppercase italic shadow-lg"
        >
          + Create Session
        </button>
      </header>


      <CreateSlotModal
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};
export default UpcomingSlotsPage;