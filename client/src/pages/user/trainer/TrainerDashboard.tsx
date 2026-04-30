import { Users, TrendingUp, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTrainerDashboard } from '../../../hooks/trainer/use-trainerDashboard';
import SessionCard from '../../../components/trainer/SessionCard';
import StatCard from '../../../components/trainer/StatCard';
import { GlobalLoader } from '../../../shared/GlobalLoader';

import { useAuthStore } from '../../../store/use-auth-store';

const TrainerDashboard = () => {
  const { user } = useAuthStore();
  const { data, isLoading } = useTrainerDashboard();
  if (isLoading) return <GlobalLoader />;

  return (
    <div className="p-4 md:p-8 space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-white">
            Good Morning, {user?.firstName || 'Trainer'}
          </h1>
          <p className="text-gray-400 text-sm">Here's your daily overview and upcoming schedule.</p>
        </div>
        <div className="text-gray-500 text-xs md:text-sm font-medium">
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </header>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Clients" value={data?.totalClients || 0} icon={<Users className="text-emerald-500" />} percentage="+8.5%" />
        <StatCard title="Monthly Earning" value={`₹${data?.monthlyEarnings?.toLocaleString('en-IN') || 0}`} icon={<TrendingUp className="text-emerald-500" />} percentage="+12%" />
        <StatCard title="Total Balance" value={`₹${data?.walletBalance?.toLocaleString('en-IN') || 0}`} icon={<Clock className="text-emerald-500" />} percentage="+2%" />
      </div>

      {/* Upcoming Sessions Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-white">Upcoming Sessions</h2>
          <Link to="/trainer/session" className="text-emerald-500 text-sm hover:underline">View All</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data?.upcomingSessions.map((session) => (
            <SessionCard key={session.slotId} session={session} />
          ))}
        </div>
      </section>
    </div>
  );
};
export default TrainerDashboard;