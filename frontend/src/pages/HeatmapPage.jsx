import React, { useState, useEffect } from 'react';
import { Flame, PieChart as PieIcon, Map, BarChart3, ChevronDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { getSessions, getHeatmap } from '../api/analytics';
import HeatmapCanvas from '../components/HeatmapCanvas';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

const HeatmapPage = () => {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState('');
  const [clicks, setClicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchingHeatmap, setFetchingHeatmap] = useState(false);

  const fetchPages = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSessions();
      const uniquePages = [...new Set(data.flatMap(s => s.pages_visited))];
      setPages(uniquePages);
      if (uniquePages.length > 0) setSelectedPage(uniquePages[0]);
    } catch (err) {
      console.error('Error fetching pages:', err);
      setError('Unable to load tracking pages. Backend might be offline.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  useEffect(() => {
    if (!selectedPage) return;

    const fetchHeatmapData = async () => {
      setFetchingHeatmap(true);
      try {
        const data = await getHeatmap(selectedPage);
        setClicks(data);
      } catch (err) {
        console.error('Error fetching heatmap:', err);
      } finally {
        setFetchingHeatmap(false);
      }
    };
    fetchHeatmapData();
  }, [selectedPage]);

  if (error) return (
    <div className="py-20">
      <EmptyState 
        variant="error"
        message="Analytics Offline"
        subtext={error}
        onRetry={fetchPages}
      />
    </div>
  );

  // Aggregation for charts
  const deviceData = Object.entries(
    clicks.reduce((acc, curr) => {
      acc[curr.device_type] = (acc[curr.device_type] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const COLORS = ['#3b82f6', '#10b981', '#a855f7'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Flame className="w-8 h-8 text-blue-500" />
            Heatmap Visualization
          </h2>
          <p className="text-slate-400">Analyze user click density and interactive hotspots.</p>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest ml-1">Target Page</label>
          <div className="relative min-w-[300px]">
             {loading ? <Skeleton className="h-12 w-full" /> : (
               <>
                 <select 
                   value={selectedPage} 
                   onChange={(e) => setSelectedPage(e.target.value)}
                   className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-5 pr-10 text-slate-200 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                 >
                   {pages.map(page => <option key={page} value={page}>{page}</option>)}
                 </select>
                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
               </>
             )}
          </div>
        </div>
      </header>

      {fetchingHeatmap || loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-[500px] w-full rounded-2xl" />
           </div>
           <div className="space-y-8">
              <Skeleton variant="card" className="h-64" />
              <Skeleton variant="card" className="h-48" />
           </div>
        </div>
      ) : clicks.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Visualizer */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center space-x-2">
                <Map className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-slate-200">Behavioral Map</h3>
              </div>
              <span className="text-xs bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-slate-400">
                Overlaying {clicks.length} total clicks
              </span>
            </div>
            <HeatmapCanvas clicks={clicks} />
          </div>

          {/* Sidebar Insights */}
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
               <div className="flex items-center space-x-2">
                 <PieIcon className="w-5 h-5 text-purple-500" />
                 <h3 className="text-lg font-semibold text-slate-200">Device Split</h3>
               </div>
               <div className="h-64 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={deviceData}
                       cx="50%"
                       cy="50%"
                       innerRadius={60}
                       outerRadius={80}
                       paddingAngle={5}
                       dataKey="value"
                     >
                       {deviceData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                     <Tooltip 
                       contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                       itemStyle={{ color: '#f8fafc' }}
                     />
                   </PieChart>
                 </ResponsiveContainer>
               </div>
               <div className="flex justify-center gap-4 flex-wrap">
                  {deviceData.map((d, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-xs text-slate-400 capitalize">{d.name} ({d.value})</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
               <div className="flex items-center space-x-2">
                 <BarChart3 className="w-5 h-5 text-emerald-500" />
                 <h3 className="text-lg font-semibold text-slate-200">Click Frequency</h3>
               </div>
               <div className="h-48 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={deviceData}>
                     <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                     <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                     />
                     <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState 
           message="No click data for this page" 
           subtext="We found sessions but no 'click' events with valid coordinates were recorded for this URL." 
        />
      )}
    </div>
  );
};

export default HeatmapPage;
