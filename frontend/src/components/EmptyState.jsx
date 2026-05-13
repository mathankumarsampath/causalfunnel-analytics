import React from 'react';
import { Database } from 'lucide-react';

const EmptyState = ({ message = "No data found", subtext = "Try adjusting your filters or tracking some new events." }) => (
  <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/50 text-center">
    <div className="bg-slate-800 p-4 rounded-full mb-4">
      <Database className="w-8 h-8 text-slate-400" />
    </div>
    <h3 className="text-xl font-semibold text-slate-200 mb-2">{message}</h3>
    <p className="text-slate-400 max-w-sm">{subtext}</p>
  </div>
);

export default EmptyState;
