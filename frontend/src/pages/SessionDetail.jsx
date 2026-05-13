import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Zap, Info } from 'lucide-react';
import { getSessionDetail } from '../api/analytics';
import SessionTimeline from '../components/SessionTimeline';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const SessionDetail = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSessionDetail(sessionId);
        setEvents(data);
      } catch (err) {
        console.error('Error fetching session details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sessionId]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
      <header className="space-y-6">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-medium">Back to dashboard</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              Session Detail
              <span className="text-xs bg-blue-500/10 text-blue-400 font-mono px-2 py-1 rounded border border-blue-500/20">{sessionId}</span>
            </h2>
            <div className="flex items-center space-x-6 text-slate-400 text-sm">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>{events.length} total events recorded</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-emerald-500" />
                <span>Active for {events.length > 1 ? 'Captured Duration' : 'Single interaction'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
             <div className="px-4 py-2 bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg shadow-inner">
               Session Replay View
             </div>
          </div>
        </div>
      </header>

      {events.length > 0 ? (
        <div className="max-w-4xl mx-auto">
          <SessionTimeline events={events} />
        </div>
      ) : (
        <EmptyState 
           message="No events found" 
           subtext="We couldn't retrieve any events for this particular session ID." 
        />
      )}

      {/* Helpful Hint */}
      <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-xl flex items-start space-x-3 max-w-4xl mx-auto mt-12">
        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-sm text-slate-400 leading-relaxed">
          The events above are sorted by <span className="text-blue-400 font-mono">event_index</span> as primary key. This ensures that even high-frequency interactions captured within the same millisecond are presented in the exact sequence they triggered on the client.
        </p>
      </div>
    </div>
  );
};

export default SessionDetail;
