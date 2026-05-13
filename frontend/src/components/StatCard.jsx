import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = "blue" }) => {
  const colors = {
    blue: "text-blue-500 bg-blue-500/10",
    emerald: "text-emerald-500 bg-emerald-500/10",
    purple: "text-purple-500 bg-purple-500/10",
    amber: "text-amber-500 bg-amber-500/10",
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center space-x-5 hover:border-slate-700 transition-colors">
      <div className={`p-4 rounded-xl ${colors[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
