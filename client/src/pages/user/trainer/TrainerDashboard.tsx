import { Users, TrendingUp, Clock } from 'lucide-react';
import { useTrainerDashboard } from '../../../hooks/trainer/use-trainerDashboard';
import SessionCard from '../../../components/trainer/SessionCard';
import StatCard from '../../../components/trainer/StatCard';

const TrainerDashboard = () => {
  const { data, isLoading } = useTrainerDashboard();
  if (isLoading) return <div className="p-10 text-white">Loading Dashboard...</div>;

  return (
    <div className="p-8 space-y-10"> {/* Removed min-h-screen and bg color */}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-semibold text-white">Good Morning, Alex</h1>
          <p className="text-gray-400">Here's your daily overview and upcoming schedule.</p>
        </div>
        {/* You can add a date display here like in the image */}
        <div className="text-gray-500 text-sm font-medium">
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </header>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Clients" value={data?.totalClients || 0} icon={<Users className="text-emerald-500" />} percentage="+8.5%" />
        <StatCard title="Monthly Earning" value="$8,450" icon={<TrendingUp className="text-emerald-500" />} percentage="+12%" />
        <StatCard title="Sessions This Week" value="24" icon={<Clock className="text-emerald-500" />} percentage="+2%" />
      </div>

      {/* Upcoming Sessions Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">Upcoming Sessions</h2>
          <button className="text-emerald-500 text-sm hover:underline">View All</button>
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