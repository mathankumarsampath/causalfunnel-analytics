import { LayoutDashboard, Flame, Activity, X } from 'lucide-react';
import { getHealth } from '../api/analytics';

const Navbar = ({ isOpen, onClose }) => {
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

  const navClasses = `
    fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col p-6 
    transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <nav className={navClasses}>
        <div className="flex items-center justify-between mb-10 px-2 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-white italic shadow-lg shadow-blue-500/20">
              CF
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">CausalFunnel</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Analytics</p>
            </div>
          </div>
          
          <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 space-y-2">
          <NavLink 
            to="/" 
            onClick={() => { if(window.innerWidth < 1024) onClose(); }}
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
            onClick={() => { if(window.innerWidth < 1024) onClose(); }}
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
          <div className="flex items-center justify-between px-4 py-3 bg-slate-800/30 rounded-xl border border-slate-800/50">
            <div className="flex items-center space-x-3 text-sm text-slate-400">
              <Activity className={`${isOnline ? 'text-emerald-500 animate-pulse' : 'text-red-500'} w-4 h-4`} />
              <span className="font-medium">API System</span>
            </div>
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`} />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
