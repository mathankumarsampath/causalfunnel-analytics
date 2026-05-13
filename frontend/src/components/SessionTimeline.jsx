import React from 'react';
import { MousePointer2, FileText, Clock, ExternalLink, MapPin, Maximize2, MousePointerClick } from 'lucide-react';

const SessionTimeline = ({ events }) => {
  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="space-y-6 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-800">
      {events.map((event, idx) => (
        <div key={idx} className="relative pl-14 group">
          {/* Timeline Dot */}
          <div className={`absolute left-[18px] top-4 w-3.5 h-3.5 rounded-full border-4 border-slate-950 z-10 transition-transform group-hover:scale-125 ${
            event.event_type === 'click' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
          }`} />

          {/* Event Card */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all hover:shadow-xl hover:shadow-black/20">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-bold text-slate-500 font-mono tracking-tighter uppercase">Step {event.event_index || idx + 1}</span>
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  event.event_type === 'click' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'
                }`}>
                  {event.event_type === 'click' ? <MousePointerClick className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                  <span>{event.event_type}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatDate(event.timestamp)}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs font-mono text-slate-400 truncate max-w-[200px]">{event.page_url}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Element Details (Clicks only) */}
              {event.event_type === 'click' && (
                <div className="space-y-3">
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">DOM Element</p>
                  <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">Tag</span>
                      <span className="text-xs font-mono text-blue-400">&lt;{event.element_tag}&gt;</span>
                    </div>
                    {event.element_text && (
                      <div className="flex flex-col space-y-1">
                        <span className="text-xs text-slate-500">Inner Text</span>
                        <span className="text-xs text-slate-200 bg-slate-800 px-2 py-1 rounded truncate italic">"{event.element_text}"</span>
                      </div>
                    )}
                    {(event.element_id || event.element_class) && (
                      <div className="pt-1 border-t border-slate-800 flex flex-wrap gap-1">
                        {event.element_id && <span className="text-[10px] bg-slate-800 text-purple-400 px-1.5 py-0.5 rounded">#{event.element_id}</span>}
                        {event.element_class && <span className="text-[10px] bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded">.{event.element_class.split(' ').join(' .')}</span>}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Position Details */}
              <div className="space-y-3">
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Coordinates & Scroll</p>
                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-xs text-slate-200">Position</span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      {event.x ? `X: ${event.x} Y: ${event.y}` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MousePointer2 className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-xs text-slate-200">Scroll</span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      {event.scroll_x || 0}, {event.scroll_y || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Viewport Details */}
              <div className="space-y-3">
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Device & Resolution</p>
                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-xs text-slate-200">Viewport</span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      {event.viewport_width}x{event.viewport_height}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate mt-2 font-mono">
                    {event.user_agent}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SessionTimeline;
