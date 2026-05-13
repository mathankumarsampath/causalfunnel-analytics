import React from 'react';

const Loader = () => (
  <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
    <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
    <p className="text-slate-400 animate-pulse font-medium">Fetching analytics data...</p>
  </div>
);

export default Loader;
