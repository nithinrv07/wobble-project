import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, User, Phone, Play, FileX, Star, AlertTriangle, Baby, Accessibility } from 'lucide-react';
import { Patient } from '../types';
import { ReceptionistTranslation } from '../utils/receptionistTranslations';

interface ActiveQueueProps {
  queue: Patient[];
  onCallPatientById: (id: string, roomNumber: string) => void;
  onRemovePatientById: (id: string) => void;
  t: ReceptionistTranslation;
  avgWaitTimePerPatient: number;
}

export default function ActiveQueue({ queue, onCallPatientById, onRemovePatientById, t, avgWaitTimePerPatient }: ActiveQueueProps) {
  const [now, setNow] = useState(new Date());

  // Periodically refresh the waited time clocks to keep them ticking up dynamically
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 15000); // refresh every 15s
    return () => clearInterval(timer);
  }, []);

  const getWaitedMinutes = (timestampStr: string) => {
    const arrival = new Date(timestampStr);
    const diffMs = now.getTime() - arrival.getTime();
    return Math.max(0, Math.floor(diffMs / 60000));
  };

  const getWaitedTimeText = (timestampStr: string) => {
    const diffMins = getWaitedMinutes(timestampStr);
    
    if (diffMins < 1) {
      return t.justArrived;
    }
    if (diffMins === 1) {
      return t.oneMinAgo;
    }
    return `${diffMins} ${t.minsAgo}`;
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Emergency':
        return <AlertTriangle size={11} className="text-rose-500 animate-pulse" />;
      case 'Priority (Child/Infant)':
        return <Baby size={11} className="text-sky-500" />;
      case 'Priority (Senior/Disabled)':
        return <Accessibility size={11} className="text-amber-500" />;
      default:
        return <Star size={10} className="text-slate-400" />;
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'Emergency':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-405 border-rose-500/20 text-[8px] font-bold uppercase tracking-wider';
      case 'Priority (Child/Infant)':
        return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20 text-[8px] font-bold uppercase tracking-wider';
      case 'Priority (Senior/Disabled)':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[8px] font-bold uppercase tracking-wider';
      default:
        return 'bg-slate-100 dark:bg-white/5 text-slate-450 dark:text-slate-500 border-slate-200 dark:border-white/5 text-[8px] font-bold uppercase tracking-wider';
    }
  };

  const getTranslatedVisitType = (type: string) => {
    switch (type) {
      case 'Consultation': return t.unitConsultation;
      case 'Follow-up': return t.unitCheckup;
      case 'Diagnostic Test': return t.unitDiagnostics;
      case 'Vaccination': return t.unitVaccination;
      case 'Emergency': return t.priorityEmergency;
      default: return type;
    }
  };

  const getTranslatedPriority = (priority: string) => {
    switch (priority) {
      case 'Regular': return t.priorityRegular;
      case 'Priority (Child/Infant)': return t.priorityChild;
      case 'Priority (Senior/Disabled)': return t.prioritySenior;
      case 'Emergency': return t.priorityEmergency;
      default: return priority;
    }
  };

  const getVisitTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'Emergency':
        return 'bg-red-500 text-white';
      case 'Consultation':
        return 'bg-teal-555 bg-teal-500 text-[#0F0A1A]';
      case 'Follow-up':
        return 'bg-purple-500 text-white';
      case 'Diagnostic Test':
        return 'bg-indigo-500 text-white';
      case 'Vaccination':
        return 'bg-emerald-500 text-[#0F0A1A]';
      default:
        return 'bg-slate-500 text-white';
    }
  };

  const getEstimatedWaitTimeLeft = (index: number) => {
    const mins = (index * avgWaitTimePerPatient);
    if (mins === 0) return 'Next';
    return `~${mins}${t.mins}`;
  };

  return (
    <div className="bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-white/10 p-5 shadow-sm flex flex-col h-[524px]">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-150 dark:border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <Clock size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">{t.queueTitle}</h2>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.queueSubtitle}</p>
          </div>
        </div>

        {/* Counter badge */}
        <span className="px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 text-[10px] font-bold uppercase tracking-wider">
          {queue.length} {t.statInQueue}
        </span>
      </div>

      {/* Queue items container */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 custom-scrollbar">
        <AnimatePresence initial={false}>
          {queue.length > 0 ? (
            queue.map((patient, index) => (
              <motion.div
                key={patient.id}
                layoutId={`queue-item-${patient.id}`}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, transition: { duration: 0.15 } }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`p-3 rounded-xl border flex items-center justify-between gap-4 group transition-all relative ${
                  patient.priority === 'Emergency'
                    ? 'border-red-500/30 dark:border-red-500/30 bg-red-500/5'
                    : getWaitedMinutes(patient.timestamp) > 20
                      ? 'border-rose-500/40 dark:border-rose-500/30 bg-rose-500/[0.02] hover:bg-rose-500/[0.05]'
                      : 'border-slate-200/60 dark:border-white/5 bg-white/50 dark:bg-[#1A1426]/35 hover:border-teal-500/30 dark:hover:border-teal-500/30 hover:bg-white dark:hover:bg-[#1A1426]/60'
                }`}
              >
                {/* Visual Rank Tag */}
                <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-100/50 dark:bg-white/5 px-1.5 py-0.5 rounded-md">
                    POS {index + 1}
                  </span>
                </div>

                <div className="flex items-start gap-3.5 pr-20">
                  {/* Token Number Card - highlighted red if wait time > 20 mins */}
                  <div className={`h-11 w-11 rounded-lg flex flex-col items-center justify-center font-sans shrink-0 border shadow-xs transition-all ${
                    getWaitedMinutes(patient.timestamp) > 20
                      ? 'bg-rose-550 border-rose-600 text-white bg-rose-500 dark:bg-rose-600 dark:border-rose-500 animate-pulse'
                      : 'border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#1A1426] text-[#0F0A1A] dark:text-white'
                  }`}>
                    <span className={`text-[7px] uppercase font-bold tracking-widest leading-none ${
                      getWaitedMinutes(patient.timestamp) > 20 ? 'text-white/80' : 'opacity-60'
                    }`}>{t.token}</span>
                    <span className="text-base font-extrabold leading-tight">#{patient.tokenNumber}</span>
                  </div>

                  <div className="space-y-1">
                    {/* Badges alignment */}
                    <div className="flex flex-wrap items-center gap-1">
                      <span className={`text-[8px] px-1.5 py-0.5 font-bold uppercase rounded-md tracking-wider ${getVisitTypeBadgeStyle(patient.visitType)}`}>
                        {getTranslatedVisitType(patient.visitType)}
                      </span>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded-md border flex items-center gap-0.5 font-bold uppercase tracking-wider ${getPriorityStyle(patient.priority)}`}>
                        {getPriorityIcon(patient.priority)}
                        {getTranslatedPriority(patient.priority)}
                      </span>
                      {getWaitedMinutes(patient.timestamp) > 20 && (
                        <span className="bg-rose-500 text-white dark:bg-rose-600 px-1.5 py-0.5 text-[8px] font-black uppercase rounded-md tracking-wider animate-bounce flex items-center gap-1">
                          <AlertTriangle size={8} /> Wait &gt; 20m
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-teal-650 dark:text-white transition-colors flex items-center gap-1.5">
                      <User size={12} className="text-slate-400" />
                      {patient.name}
                    </h4>

                    {/* Secondary detail footer logs */}
                    <div className="flex flex-wrap items-center gap-x-2 text-[10px] text-slate-400 dark:text-slate-500 font-medium font-mono">
                      <span className="flex items-center gap-0.5">
                        <Phone size={10} />
                        {patient.phone}
                      </span>
                      <span>•</span>
                      <span className={`flex items-center gap-0.5 ${
                        getWaitedMinutes(patient.timestamp) > 20
                          ? 'text-rose-600 dark:text-rose-400 font-bold animate-pulse'
                          : 'text-teal-600 dark:text-teal-400'
                      }`}>
                        <Clock size={10} />
                        {getWaitedTimeText(patient.timestamp)}
                        {getWaitedMinutes(patient.timestamp) > 20 && ` (${t.delayed})`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Patient actions inside Active Queue List */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Wait estimated time badge */}
                  <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#1A1426] border border-slate-100 dark:border-white/5 px-2 py-1 rounded-md">
                    {getEstimatedWaitTimeLeft(index)}
                  </span>

                  {/* Play / Call Instant */}
                  <button
                    onClick={() => onCallPatientById(patient.id, 'OPD Cabin 1 (General)')}
                    title={t.btnCall}
                    className="p-1.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 hover:bg-teal-500 hover:text-[#0F0A1A] rounded-md transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <Play size={11} className="fill-current" />
                  </button>

                  {/* Remove No-Show directly */}
                  <button
                    onClick={() => onRemovePatientById(patient.id)}
                    title={t.btnCancel}
                    className="p-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-455 hover:bg-rose-505 hover:text-white border border-rose-500/20 rounded-md transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <FileX size={11} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-205 dark:border-white/10 rounded-xl"
            >
              <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-slate-500 flex items-center justify-center mb-2">
                <Clock size={16} />
              </div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200">{t.sessionIdle}</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 max-w-xs font-medium">
                {t.sessionIdleDesc}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
