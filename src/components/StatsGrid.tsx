import { Clock, Users, Flame, CheckCircle, FileX } from 'lucide-react';
import { QueueStats } from '../types';
import { ReceptionistTranslation } from '../utils/receptionistTranslations';

interface StatsProps {
  stats: QueueStats;
  t: ReceptionistTranslation;
}

export default function StatsGrid({ stats, t }: StatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
      {/* Cards are crafted beautifully using high contrast backgrounds */}
      
      {/* 1. Waiting Queue Count */}
      <div className="bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-xl border border-slate-200/80 dark:border-white/10 p-4.5 flex items-center gap-4 transition-all hover:border-teal-500/30">
        <div className="p-3 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
          <Users size={18} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t.statInQueue}</p>
          <p className="text-xl font-bold font-mono text-slate-900 dark:text-white leading-tight mt-0.5">{stats.waitingCount}</p>
        </div>
      </div>

      {/* 2. Estimated Average Wait Time */}
      <div className="bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-xl border border-slate-205/80 dark:border-white/10 p-4.5 flex items-center gap-4 transition-all hover:border-teal-500/30">
        <div className="p-3 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <Clock size={18} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t.statAvgWait}</p>
          <p className="text-xl font-bold font-mono text-slate-900 dark:text-white leading-tight mt-0.5">
            {stats.avgWaitTimeMinutes} <span className="text-[10px] font-sans font-normal text-slate-500 dark:text-slate-400 uppercase">{t.mins}</span>
          </p>
        </div>
      </div>

      {/* 3. Completed Today */}
      <div className="bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-xl border border-slate-202/80 dark:border-white/10 p-4.5 flex items-center gap-4 transition-all hover:border-teal-500/30">
        <div className="p-3 rounded-lg bg-teal-55/10 bg-teal-500/10 text-teal-600 dark:text-teal-400">
          <CheckCircle size={18} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t.statServedToday}</p>
          <p className="text-xl font-bold font-mono text-slate-900 dark:text-white leading-tight mt-0.5">{stats.completedTodayCount}</p>
        </div>
      </div>

      {/* 4. No-Shows / Missed */}
      <div className="bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-xl border border-slate-200/80 dark:border-white/10 p-4.5 flex items-center gap-4 transition-all hover:border-teal-500/30">
        <div className="p-3 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
          <FileX size={18} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t.statNoShows}</p>
          <p className="text-xl font-bold font-mono text-slate-900 dark:text-white leading-tight mt-0.5">{stats.noShowTodayCount}</p>
        </div>
      </div>
    </div>
  );
}
