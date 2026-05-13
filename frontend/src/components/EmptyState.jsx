import { Database, AlertCircle, RefreshCcw } from 'lucide-react';

const EmptyState = ({ 
  message = "No data found", 
  subtext = "Try adjusting your filters or tracking some new events.",
  variant = 'empty',
  onRetry = null
}) => {
  const isError = variant === 'error';

  return (
    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/50 text-center animate-in fade-in duration-500">
      <div className={`p-4 rounded-full mb-4 ${isError ? 'bg-red-500/10' : 'bg-slate-800'}`}>
        {isError ? (
          <AlertCircle className="w-8 h-8 text-red-500" />
        ) : (
          <Database className="w-8 h-8 text-slate-400" />
        )}
      </div>
      <h3 className="text-xl font-semibold text-slate-200 mb-2">{message}</h3>
      <p className="text-slate-400 max-w-sm mb-6">{subtext}</p>
      
      {onRetry && (
        <button 
          onClick={onRetry}
          className="flex items-center space-x-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all border border-slate-700"
        >
          <RefreshCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
