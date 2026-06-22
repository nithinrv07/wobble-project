import { useState } from 'react';
import { Search, CheckCircle, HelpCircle, AlertCircle, Trash2, Calendar, Download } from 'lucide-react';
import { Patient } from '../types';
import { ReceptionistTranslation } from '../utils/receptionistTranslations';

interface HistoryLogProps {
  history: Patient[];
  onClearHistory: () => void;
  t: ReceptionistTranslation;
}

export default function HistoryLog({ history, onClearHistory, t }: HistoryLogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'No-Show'>('All');
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const exportToCSV = () => {
    if (history.length === 0) return;

    // Define CSV headers representing patient log metrics
    const headers = [
      'Token Number',
      'Patient Name',
      'Phone Number',
      'Visit Type',
      'Priority Level',
      'Checked-In Clock',
      'Settle Clock',
      'Assigned OPD Cabin',
      'Audit Status'
    ];

    // Format data rows
    const rows = history.map((patient) => {
      const checkedInTime = patient.timestamp ? new Date(patient.timestamp).toLocaleString() : '';
      const settleTime = (patient.calledAt || patient.timestamp) ? new Date(patient.calledAt || patient.timestamp).toLocaleString() : '';
      const escapeCsvValue = (value: string) => `"${value.replace(/"/g, '""')}"`;

      return [
        patient.tokenNumber,
        escapeCsvValue(patient.name),
        escapeCsvValue(patient.phone),
        escapeCsvValue(patient.visitType),
        escapeCsvValue(patient.priority),
        escapeCsvValue(checkedInTime),
        escapeCsvValue(settleTime),
        escapeCsvValue(patient.roomNumber || 'Waiting Area'),
        escapeCsvValue(patient.status)
      ];
    });

    // Create the full UTF-8 compatible CSV text document with BOM
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    // Create safe download URL
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `clinicq_opd_reporting_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredHistory = history.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.tokenNumber.toString().includes(searchQuery) ||
      patient.phone.includes(searchQuery);

    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Completed' && patient.status === 'Completed') ||
      (statusFilter === 'No-Show' && patient.status === 'No-Show');

    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeStyle = (status: string) => {
    if (status === 'Completed') {
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    }
    return 'bg-rose-500/10 text-rose-600 dark:text-rose-450 dark:text-rose-400 border-rose-500/20';
  };

  const getCleanTime = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-white/10 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-150 dark:border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <Calendar size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">{t.historyTitle}</h2>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.historySubtitle}</p>
          </div>
        </div>

        {/* Clear logbook and export button */}
        {history.length > 0 && (
          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
            {/* Export CSV button */}
            <button
              onClick={exportToCSV}
              id="export-csv-btn"
              title="Download clinical logbook as a CSV sheet"
              className="text-[10px] font-bold uppercase tracking-wider px-3 py-2 bg-teal-500/10 text-teal-600 hover:bg-teal-500 hover:text-[#0F0A1A] dark:text-teal-400 border border-teal-500/20 hover:border-transparent transition-all rounded-md flex items-center gap-1.5 cursor-pointer align-middle active:scale-98"
            >
              <Download size={11} />
              <span>{t.btnExport}</span>
            </button>

            {showConfirmClear ? (
              <div className="flex items-center gap-2 bg-rose-500/5 dark:bg-rose-500/10 p-1.5 px-2.5 rounded-lg border border-rose-500/20">
                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider animate-pulse">
                  Confirm?
                </span>
                <button
                  onClick={() => {
                    onClearHistory();
                    setShowConfirmClear(false);
                  }}
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-rose-500 hover:bg-rose-600 text-white transition-all rounded-md cursor-pointer active:scale-95"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-all rounded-md cursor-pointer active:scale-95"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmClear(true)}
                className="text-[10px] font-bold uppercase tracking-wider px-3 py-2 bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white dark:text-rose-400 border border-rose-500/20 transition-all rounded-md flex items-center gap-1.5 cursor-pointer align-middle active:scale-98"
              >
                <Trash2 size={11} />
                <span>{t.btnClearLogbook}</span>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-center gap-3 mb-4">
        {/* Search input bar */}
        <div className="relative flex-1 w-full">
          <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-205 dark:border-white/5 bg-white/50 dark:bg-[#1A1426]/30 text-slate-850 dark:text-slate-100 rounded-lg focus:outline-hidden focus:border-teal-555 focus:border-teal-500 transition-all"
          />
        </div>

        {/* Filters bar */}
        <div className="flex items-center gap-1.5 w-full md:w-auto">
          {(['All', 'Completed', 'No-Show'] as const).map((filter) => {
            let filterLabel = filter;
            if (filter === 'All') filterLabel = 'All' as any;
            else if (filter === 'Completed') filterLabel = t.statusServed as any;
            else if (filter === 'No-Show') filterLabel = t.statusMissed as any;

            return (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`flex-1 md:flex-none px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                  statusFilter === filter
                    ? 'bg-teal-500 text-[#0F0A1A] shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-800'
                }`}
              >
                {filterLabel as any}
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/5 text-slate-500 uppercase tracking-widest text-[9px] font-bold">
              <th className="py-2 font-bold">{t.labelToken}</th>
              <th className="py-2 font-bold">{t.labelPatient}</th>
              <th className="py-2 font-bold">{t.labelCheckedIn}</th>
              <th className="py-2 font-bold">{t.labelSettleTime}</th>
              <th className="py-2 font-bold">{t.labelAssignedHub}</th>
              <th className="py-2 font-bold text-right">{t.labelStatus}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-705 dark:text-slate-300">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors border-b border-slate-100 dark:border-white/5">
                  <td className="py-2.5 font-bold font-mono text-slate-800 dark:text-white">#{patient.tokenNumber}</td>
                  <td className="py-2.5">
                    <div className="font-bold text-slate-800 dark:text-slate-200">{patient.name}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                      {patient.phone} • {patient.visitType === 'Consultation' ? t.unitConsultation : patient.visitType === 'Follow-up' ? t.unitCheckup : patient.visitType === 'Diagnostic Test' ? t.unitDiagnostics : patient.visitType === 'Vaccination' ? t.unitVaccination : t.priorityEmergency}
                    </div>
                  </td>
                  <td className="py-2.5 text-slate-500 dark:text-slate-400 font-mono">{getCleanTime(patient.timestamp)}</td>
                  <td className="py-2.5 text-slate-500 dark:text-slate-400 font-mono">{getCleanTime(patient.calledAt || patient.timestamp)}</td>
                  <td className="py-2.5 text-teal-650 dark:text-teal-400 font-bold uppercase tracking-wider text-[10px]">{patient.roomNumber ? patient.roomNumber : 'Waiting Area'}</td>
                  <td className="py-2.5 text-right font-bold text-[10px] uppercase tracking-wider">
                    <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-md border text-[9px] uppercase tracking-wider ${getStatusBadgeStyle(patient.status)}`}>
                      {patient.status === 'Completed' ? (
                        <>
                          <CheckCircle size={10} />
                          <span>{t.statusServed}</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle size={10} />
                          <span>{t.statusMissed}</span>
                        </>
                      )}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-500 dark:text-slate-500">
                  <HelpCircle size={18} className="mx-auto mb-2 opacity-50 stroke-[1.5]" />
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">{t.sessionIdle}</p>
                  <p className="text-[10px] mt-0.5">{t.sessionIdleDesc}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
