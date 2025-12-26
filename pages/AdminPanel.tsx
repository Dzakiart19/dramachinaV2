import React, { useState, useEffect } from 'react';
import { Activity, Users, Globe, ArrowLeft, BarChart3, Clock } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const rawStats = localStorage.getItem('dzeck_stats');
    if (rawStats) {
      setStats(JSON.parse(rawStats));
    }
  }, []);

  if (!stats) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <p className="animate-pulse font-bold tracking-widest">INITIALIZING SECURE PANEL...</p>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const visitsToday = stats.daily[today] || 0;
  const totalVisits = stats.total || 0;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12 border-b border-zinc-900 pb-8">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Admin <span className="text-red-600">Dashboard</span></h1>
            <p className="text-zinc-500 font-medium">Monitoring Dzeck Stream Analytics</p>
          </div>
          <a href="#/" className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 px-4 py-2 rounded-md transition-all text-sm font-bold border border-zinc-800">
            <ArrowLeft size={16} /> Exit Panel
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1 */}
          <div className="bg-zinc-900/40 p-8 rounded-xl border border-zinc-800 hover:border-red-600/30 transition-all group">
            <div className="flex items-center justify-between mb-6">
              <Activity className="text-red-600 group-hover:scale-110 transition-transform" size={32} />
              <span className="text-[10px] font-black bg-red-600/10 text-red-600 px-2 py-1 rounded uppercase tracking-widest">Real-time</span>
            </div>
            <h3 className="text-zinc-500 text-xs font-black uppercase tracking-[0.2em] mb-1">Unique Visits Today</h3>
            <p className="text-5xl font-black tabular-nums">{visitsToday.toLocaleString()}</p>
          </div>

          {/* Card 2 */}
          <div className="bg-zinc-900/40 p-8 rounded-xl border border-zinc-800 hover:border-red-600/30 transition-all group">
            <div className="flex items-center justify-between mb-6">
              <BarChart3 className="text-white group-hover:scale-110 transition-transform" size={32} />
              <span className="text-[10px] font-black bg-white/10 text-white px-2 py-1 rounded uppercase tracking-widest">Lifetime</span>
            </div>
            <h3 className="text-zinc-500 text-xs font-black uppercase tracking-[0.2em] mb-1">Total Unique Visits</h3>
            <p className="text-5xl font-black tabular-nums">{totalVisits.toLocaleString()}</p>
          </div>

          {/* Card 3 */}
          <div className="bg-zinc-900/40 p-8 rounded-xl border border-zinc-800 hover:border-red-600/30 transition-all group">
            <div className="flex items-center justify-between mb-6">
              <Globe className="text-zinc-500 group-hover:scale-110 transition-transform" size={32} />
              <span className="text-[10px] font-black bg-zinc-800 text-zinc-500 px-2 py-1 rounded uppercase tracking-widest">Analytics</span>
            </div>
            <h3 className="text-zinc-500 text-xs font-black uppercase tracking-[0.2em] mb-1">Device Breakdown</h3>
            <div className="flex gap-4">
              <div>
                <p className="text-2xl font-black text-white">{(stats.devices?.mobile || 0).toLocaleString()}</p>
                <p className="text-[10px] font-black text-zinc-600 uppercase">Mobile</p>
              </div>
              <div className="w-px h-10 bg-zinc-800 self-center"></div>
              <div>
                <p className="text-2xl font-black text-white">{(stats.devices?.desktop || 0).toLocaleString()}</p>
                <p className="text-[10px] font-black text-zinc-600 uppercase">Desktop</p>
              </div>
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-zinc-900/20 rounded-xl border border-zinc-800 overflow-hidden">
          <div className="p-6 border-b border-zinc-800 bg-zinc-900/40">
            <h3 className="text-lg font-bold uppercase tracking-tight">Recent Activity History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-zinc-600 text-[10px] uppercase font-black tracking-widest border-b border-zinc-900">
                  <th className="px-8 py-4">Date</th>
                  <th className="px-8 py-4 text-right">Visits Count</th>
                  <th className="px-8 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {Object.entries(stats.daily).sort((a,b) => b[0].localeCompare(a[0])).slice(0, 7).map(([date, count]: [string, any]) => (
                  <tr key={date} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-5 font-bold text-zinc-300">{date === today ? 'Today (Current)' : date}</td>
                    <td className="px-8 py-5 text-right font-black text-xl">{count.toLocaleString()}</td>
                    <td className="px-8 py-5 text-right">
                       <span className="inline-block w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;