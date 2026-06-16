import { useState } from 'react';
import { Play, Check, HeartCrack, User, Smartphone, DoorOpen, Sparkles, Building2 } from 'lucide-react';
import { Patient } from '../types';
import { ReceptionistTranslation } from '../utils/receptionistTranslations';

interface ServingRoomProps {
  currentPatient: Patient | null;
  onCallNext: (roomNumber: string) => void;
  onCompleteVisit: () => void;
  onMarkNoShow: () => void;
  isQueueEmpty: boolean;
  t: ReceptionistTranslation;
}

export default function ServingRoom({
  currentPatient,
  onCallNext,
  onCompleteVisit,
  onMarkNoShow,
  isQueueEmpty,
  t,
}: ServingRoomProps) {
  const [selectedRoom, setSelectedRoom] = useState('OPD Cabin 1 (General)');
  const rooms = [
    'OPD Cabin 1 (General)',
    'OPD Cabin 2 (Specialist)',
    'AYUSH Wellness Centre',
    'Bal Seva Pediatric OPD',
    'Emergency Casualty Ward'
  ];

  const handleCallNextClick = () => {
    onCallNext(selectedRoom);
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

  return (
    <div className="bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-white/10 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-150 dark:border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <Building2 size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">{t.triageTitle}</h2>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.triageSubtitle}</p>
          </div>
        </div>

        {/* Room dispatch picker */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <DoorOpen size={13} className="text-teal-500" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.assignTo}</span>
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="text-[11px] font-bold uppercase tracking-wide px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#1A1426] text-teal-600 dark:text-teal-400 focus:outline-hidden cursor-pointer"
          >
            {rooms.map((room) => (
              <option key={room} value={room}>
                {room}
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentPatient ? (
        /* Currently Serving Card */
        <div className="bg-white/85 dark:bg-[#1A1426]/60 border border-teal-500/30 dark:border-teal-500/30 active-serving-glow rounded-xl p-4.5 relative overflow-hidden transition-all duration-350">
          <div className="absolute top-0 right-0 px-2.5 py-1 bg-teal-500 text-[#0F0A1A] text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 rounded-bl-lg">
            <Sparkles size={10} className="animate-pulse" />
            <span>{t.activeSession}</span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* Token badge large */}
              <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-500 flex flex-col items-center justify-center text-[#0F0A1A] font-sans shadow-md shadow-teal-500/10">
                <span className="text-[8px] uppercase font-bold tracking-widest opacity-80 leading-none">{t.token}</span>
                <span className="text-xl font-extrabold leading-tight">#{currentPatient.tokenNumber}</span>
              </div>

              <div>
                <div className="flex flex-wrap gap-1 mb-1.5">
                  <span className="inline-block text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-md font-bold text-teal-600 dark:text-teal-300 bg-teal-500/10 border border-teal-500/20">
                    {getTranslatedVisitType(currentPatient.visitType)}
                  </span>
                  
                  {/* Priority class label */}
                  {currentPatient.priority !== 'Regular' && (
                    <span className="inline-block text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-md font-bold text-rose-700 dark:text-rose-300 bg-rose-500/10 border border-rose-500/20">
                      {getTranslatedPriority(currentPatient.priority)}
                    </span>
                  )}
                </div>
                
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 leading-snug">
                  <User size={14} className="text-slate-400" />
                  {currentPatient.name}
                </h3>
                
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <Smartphone size={10} />
                    {currentPatient.phone}
                  </span>
                  <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-mono text-[11px] uppercase">
                    <DoorOpen size={10} />
                    {currentPatient.roomNumber || selectedRoom}
                  </span>
                </div>
              </div>
            </div>

            {/* Serving State Controls */}
            <div className="flex items-center gap-2.5 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-white/5">
              {/* Finish Appointment */}
              <button
                id="btn-complete-visit"
                onClick={onCompleteVisit}
                className="flex-1 md:flex-none py-2 px-3 bg-teal-500 hover:bg-teal-400 text-[#0F0A1A] font-bold rounded-lg text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Check size={12} />
                <span>{t.btnComplete}</span>
              </button>

              {/* No-Show / Cancel */}
              <button
                id="btn-no-show"
                onClick={onMarkNoShow}
                className="flex-1 md:flex-none py-2 px-3 bg-rose-505/15 bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-bold rounded-lg text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <HeartCrack size={12} />
                <span>{t.btnNoShow}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Serving Monitor */
        <div className="bg-white/50 dark:bg-[#1A1426]/30 border border-dashed border-slate-200 dark:border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 flex items-center justify-center mb-2.5">
            <User size={16} className="stroke-[1.5]" />
          </div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200">{t.sessionIdle}</h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 mb-4 max-w-sm font-medium">
            {t.sessionIdleDesc}
          </p>

          {/* Call Next Button */}
          <button
            id="btn-call-next"
            onClick={handleCallNextClick}
            disabled={isQueueEmpty}
            className={`py-2 px-4 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              isQueueEmpty
                ? 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                : 'bg-teal-500 hover:bg-teal-400 text-[#0F0A1A] cursor-pointer'
            }`}
          >
            <Play size={10} className="fill-current" />
            <span>{t.btnSummonNext}</span>
          </button>
        </div>
      )}
    </div>
  );
}
