import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Monitor, Smartphone, Tablet, Calendar } from 'lucide-react';

const DeviceIcon = ({ type }) => {
  if (type === 'mobile') return <Smartphone className="w-4 h-4" />;
  if (type === 'tablet') return <Tablet className="w-4 h-4" />;
  return <Monitor className="w-4 h-4" />;
};

const SessionTable = ({ sessions }) => {
  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-900/50 border-b border-slate-800">
              <th className="px-6 py-4 text-sm font-semibold text-slate-400">Session ID</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-400">Events</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-400">Devices</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-400">First Seen</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
        <tbody className="divide-y divide-slate-800">
          {sessions.map((session) => (
            <tr key={session.session_id} className="hover:bg-slate-800/30 transition-colors group">
              <td className="px-6 py-5 font-mono text-xs text-blue-400">
                {session.session_id}
              </td>
              <td className="px-6 py-5">
                <span className="bg-slate-800 text-white px-2 py-1 rounded-md text-xs font-semibold border border-slate-700">
                  {session.total_events}
                </span>
              </td>
              <td className="px-6 py-5">
                <div className="flex gap-2">
                  {session.device_types.map((type, i) => (
                    <div key={i} className="text-slate-500" title={type}>
                      <DeviceIcon type={type} />
                    </div>
                  ))}
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center space-x-2 text-sm text-slate-400">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(session.first_seen)}</span>
                </div>
              </td>
              <td className="px-6 py-5 text-right">
                <Link
                  to={`/sessions/${session.session_id}`}
                  className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                >
                  <Eye className="w-4 h-4" />
                  <span>Details</span>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
};

export default SessionTable;
