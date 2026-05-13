import React, { useState, useEffect } from 'react';
import { Users, MousePointerClick, FileType, Search } from 'lucide-react';
import StatCard from '../components/StatCard';
import SessionTable from '../components/SessionTable';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { getSessions } from '../api/analytics';

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError('Unable to reach the analytics backend. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredSessions = sessions.filter(s => 
    s.session_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEvents = sessions.reduce((acc, curr) => acc + curr.total_events, 0);
  const totalPages = new Set(sessions.flatMap(s => s.pages_visited)).size;

  if (error) return (
    <div className="py-12">
      <EmptyState 
        variant="error"
        message="Backend Connection Failed"
        subtext={error}
        onRetry={fetchData}
      />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Overview</h2>
          <p className="text-slate-400 mt-1">Global performance metrics and recent activity.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search Session ID..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <>
            <Skeleton variant="card" className="h-40" />
            <Skeleton variant="card" className="h-40" />
            <Skeleton variant="card" className="h-40" />
          </>
        ) : (
          <>
            <StatCard title="Total Sessions" value={sessions.length} icon={Users} color="blue" />
            <StatCard title="Total Events" value={totalEvents} icon={MousePointerClick} color="emerald" />
            <StatCard title="Active Pages" value={totalPages} icon={FileType} color="purple" />
          </>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-lg font-semibold text-slate-200">Recent Sessions</h3>
          <span className="text-xs text-slate-500 font-mono">Showing {filteredSessions.length} results</span>
        </div>
        
        {loading ? (
          <div className="space-y-4">
            <Skeleton variant="tableRow" className="h-12" />
            <Skeleton variant="tableRow" />
            <Skeleton variant="tableRow" />
            <Skeleton variant="tableRow" />
            <Skeleton variant="tableRow" />
          </div>
        ) : filteredSessions.length > 0 ? (
          <SessionTable sessions={filteredSessions} />
        ) : (
          <EmptyState 
            message={searchTerm ? "No matching sessions" : "No sessions recorded yet"} 
            subtext={searchTerm ? `Try a different search term instead of "${searchTerm}"` : "Integration check: ensure your tracker.js is sending events to the backend."}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
