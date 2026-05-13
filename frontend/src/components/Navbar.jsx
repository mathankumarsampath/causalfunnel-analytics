import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Flame, Activity } from 'lucide-react';
import { getHealth } from '../api/analytics';

const Navbar = () => {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const data = await getHealth();
        setIsOnline(data.status === 'ok');
      } catch (err) {
        setIsOnline(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col p-6 sticky top-0">
      <div className="flex items-center space-x-3 mb-10 px-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white italic">CF</div>
        <h1 className="text-xl font-bold tracking-tight text-white">Analytics</h1>
      </div>

      <div className="flex-1 space-y-2">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive ? 'bg-blue-600/10 text-blue-500 font-medium' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink 
          to="/heatmap" 
          className={({ isActive }) => 
            `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive ? 'bg-blue-600/10 text-blue-500 font-medium' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`
          }
        >
          <Flame className="w-5 h-5" />
          <span>Heatmaps</span>
        </NavLink>
      </div>

      <div className="pt-6 border-t border-slate-800">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 rounded-xl">
          <div className="flex items-center space-x-3 text-sm text-slate-400">
            <Activity className="w-4 h-4" />
            <span>API Status</span>
          </div>
          <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
