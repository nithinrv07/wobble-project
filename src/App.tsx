import { useState, useEffect } from 'react';
import {
  Activity,
  Moon,
  Sun,
  Shield,
  HelpCircle,
  Clock,
  Sparkles,
  PhoneCall,
  History,
  Volume2,
  Globe
} from 'lucide-react';
import { Patient, VisitType, PriorityLevel, QueueStats, SmsMessage } from './types';
import FormSection from './components/FormSection';
import StatsGrid from './components/StatsGrid';
import ServingRoom from './components/ServingRoom';
import ActiveQueue from './components/ActiveQueue';
import PhoneMockup from './components/PhoneMockup';
import HistoryLog from './components/HistoryLog';
import RoleGuardLanding from './components/RoleGuardLanding';
import { soundSynth, announcePatientCall } from './utils/audio';
import { getReceptionistTranslation } from './utils/receptionistTranslations';

export default function App() {
  // Role Guard State
  const [roleUnlocked, setRoleUnlocked] = useState<boolean>(() => {
    const cached = localStorage.getItem('clinic_role_unlocked');
    return cached === 'true';
  });

  // Receptionist display language state
  const [receptionistLang, setReceptionistLang] = useState<'en' | 'hi' | 'bn' | 'te'>(() => {
    const cached = localStorage.getItem('clinic_receptionist_lang');
    if (cached === 'hi' || cached === 'bn' || cached === 'te') return cached as any;
    return 'en';
  });

  const t = getReceptionistTranslation(receptionistLang);

  // State Initialization from LocalStorage
  const [queue, setQueue] = useState<Patient[]>(() => {
    const cached = localStorage.getItem('clinic_queue');
    if (cached) return JSON.parse(cached);
    return [
      {
        id: 'default-1',
        tokenNumber: 44,
        name: 'Amit Sharma',
        phone: '98450-12345',
        visitType: 'Emergency',
        priority: 'Emergency',
        timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
        status: 'Waiting'
      },
      {
        id: 'default-2',
        tokenNumber: 45,
        name: 'Priya Patel',
        phone: '91234-56789',
        visitType: 'Vaccination',
        priority: 'Priority (Child/Infant)',
        timestamp: new Date(Date.now() - 20 * 60000).toISOString(),
        status: 'Waiting'
      },
      {
        id: 'default-3',
        tokenNumber: 46,
        name: 'Vinay G. Swamy',
        phone: '87654-32109',
        visitType: 'Consultation',
        priority: 'Priority (Senior/Disabled)',
        timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
        status: 'Waiting'
      }
    ];
  });

  const [serving, setServing] = useState<Patient | null>(() => {
    const cached = localStorage.getItem('clinic_serving');
    return cached ? JSON.parse(cached) : null;
  });

  const [history, setHistory] = useState<Patient[]>(() => {
    const cached = localStorage.getItem('clinic_history');
    if (cached) return JSON.parse(cached);
    return [
      {
        id: 'default-h1',
        tokenNumber: 43,
        name: 'Rajesh Kumar Mehta',
        phone: '99887-76655',
        visitType: 'Consultation',
        priority: 'Regular',
        timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
        status: 'Completed',
        calledAt: new Date(Date.now() - 45 * 60000).toISOString(),
        roomNumber: 'OPD Cabin 1 (General)'
      }
    ];
  });

  const [tokenCounter, setTokenCounter] = useState<number>(() => {
    const cached = localStorage.getItem('clinic_token_counter');
    return cached ? parseInt(cached, 10) : 47; // starts at #47 as per Spec
  });

  const [smsMessages, setSmsMessages] = useState<SmsMessage[]>(() => {
    const cached = localStorage.getItem('clinic_sms_messages');
    if (cached) return JSON.parse(cached);
    return [
      {
        id: 'default-sms-1',
        timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
        text: `QueueCure: Token #44 issued for Amit Sharma. Priority Tier: Emergency Triage (Atyant Care)\nReason: Urgent Casualty Triage.\nYou are currently position 1 in the queue.\nEst. wait time: ~8 mins. We will alert you here when your turn approaches.`,
        phone: '98450-12345',
        type: 'success'
      }
    ];
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const cached = localStorage.getItem('clinic_theme');
    if (cached === 'dark' || cached === 'light') return cached;
    return 'light';
  });

  // System time clock state
  const [systemTime, setSystemTime] = useState<Date>(new Date());

  // Save states to LocalStorage on updates
  useEffect(() => {
    localStorage.setItem('clinic_queue', JSON.stringify(queue));
  }, [queue]);

  useEffect(() => {
    localStorage.setItem('clinic_serving', JSON.stringify(serving));
  }, [serving]);

  useEffect(() => {
    localStorage.setItem('clinic_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('clinic_token_counter', tokenCounter.toString());
  }, [tokenCounter]);

  useEffect(() => {
    localStorage.setItem('clinic_sms_messages', JSON.stringify(smsMessages));
  }, [smsMessages]);

  useEffect(() => {
    localStorage.setItem('clinic_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('clinic_role_unlocked', roleUnlocked.toString());
  }, [roleUnlocked]);

  useEffect(() => {
    localStorage.setItem('clinic_receptionist_lang', receptionistLang);
  }, [receptionistLang]);

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => {
      setSystemTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Live storage synchronizer across tabs/views (Real-time Sync Support)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key) return;
      try {
        if (e.key === 'clinic_queue' && e.newValue) {
          setQueue(JSON.parse(e.newValue));
        } else if (e.key === 'clinic_serving') {
          setServing(e.newValue ? JSON.parse(e.newValue) : null);
        } else if (e.key === 'clinic_history' && e.newValue) {
          setHistory(JSON.parse(e.newValue));
        } else if (e.key === 'clinic_token_counter' && e.newValue) {
          setTokenCounter(parseInt(e.newValue, 10));
        } else if (e.key === 'clinic_sms_messages' && e.newValue) {
          setSmsMessages(JSON.parse(e.newValue));
        } else if (e.key === 'clinic_role_unlocked' && e.newValue) {
          setRoleUnlocked(e.newValue === 'true');
        } else if (e.key === 'clinic_theme' && e.newValue) {
          setTheme(e.newValue as 'light' | 'dark');
        } else if (e.key === 'clinic_receptionist_lang' && e.newValue) {
          setReceptionistLang(e.newValue as any);
        }
      } catch (err) {
        console.error("Failed to parse storage event update", err);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Dynamic wait time calculation (Criteria 2)
  const completedVisits = history.filter(p => p.status === 'Completed' && p.calledAt && p.timestamp);
  let avgWaitTimePerPatient = 8; // fallback default
  if (completedVisits.length > 0) {
    const totalWait = completedVisits.reduce((acc, p) => {
      const wait = new Date(p.calledAt!).getTime() - new Date(p.timestamp).getTime();
      return acc + wait;
    }, 0);
    avgWaitTimePerPatient = Math.max(1, Math.round(totalWait / completedVisits.length / 60000));
  }

  // Utility to dispatch a simulated SMS
  const sendSimulatedSms = (text: string, phone: string, type: 'success' | 'call' | 'cancel' | 'info') => {
    const newMsg: SmsMessage = {
      id: `sms-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      text,
      phone,
      type
    };
    setSmsMessages((prev) => [...prev, newMsg]);
  };

  // 1. Issue Token handler
  const handleIssueToken = (name: string, phone: string, visitType: VisitType, priority: PriorityLevel) => {
    const nextToken = tokenCounter;
    setTokenCounter((prev) => prev + 1);

    const newPatient: Patient = {
      id: `pat-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      tokenNumber: nextToken,
      name,
      phone,
      visitType,
      priority,
      timestamp: new Date().toISOString(),
      status: 'Waiting'
    };

    let positionInLine = 1;

    // Use functional updater to address concurrency (Criteria 4)
    setQueue((prevQueue) => {
      let updatedQueue = [...prevQueue];
      
      // Sort logic helper: Emergency goes after any older emergencies, but before everyone else
      if (priority === 'Emergency') {
        let lastEmergencyIdx = -1;
        for (let i = updatedQueue.length - 1; i >= 0; i--) {
          if (updatedQueue[i].priority === 'Emergency') {
            lastEmergencyIdx = i;
            break;
          }
        }
        if (lastEmergencyIdx !== -1) {
          updatedQueue.splice(lastEmergencyIdx + 1, 0, newPatient);
        } else {
          updatedQueue.unshift(newPatient); // move to absolute top of line
        }
      } else {
        updatedQueue.push(newPatient);
      }

      positionInLine = updatedQueue.indexOf(newPatient) + 1;
      return updatedQueue;
    });

    // Play welcome token chime
    soundSynth.playNewTokenChime();

    // Trigger SMS simulation alert
    const waitTimeEst = positionInLine * avgWaitTimePerPatient;
    const priorityAlertMsg = priority !== 'Regular' ? ` Priority Tier: ${priority}` : '';
    
    const smsText = `QueueCure: Token #${nextToken} issued for ${name}.${priorityAlertMsg}\nReason: ${visitType}.\nYou are currently position ${positionInLine} in the queue.\nEst. wait time: ~${waitTimeEst} mins. We will alert you here when your turn approaches.`;
    
    sendSimulatedSms(smsText, phone, 'success');
  };

  // 2. Call Patient helper (specific search slot or next-in-line)
  const handleCallPatient = (patientId: string, roomNumber: string) => {
    const targetPatient = queue.find((p) => p.id === patientId);
    if (!targetPatient) return;

    // If a patient is already serving, automatically complete / transition them
    if (serving) {
      handleCompleteVisit();
    }

    // Update patient properties
    const updatedPatient: Patient = {
      ...targetPatient,
      status: 'Serving',
      calledAt: new Date().toISOString(),
      roomNumber
    };

    // Remove from queue & set as currently serving
    setQueue((prev) => prev.filter((p) => p.id !== patientId));
    setServing(updatedPatient);

    // Audio effects: Announcement & Chime
    soundSynth.playCallNextChime();
    announcePatientCall(updatedPatient.tokenNumber, updatedPatient.name, roomNumber);

    // Dispatch calling SMS alert
    const smsText = `QueueCure: Token #${updatedPatient.tokenNumber} is now being called! Please proceed immediately to ${roomNumber}.\nOPD Clinic specialist is ready for checkup.`;
    sendSimulatedSms(smsText, updatedPatient.phone, 'call');
  };

  // 3. Call next patient (by chronological or sorted order)
  const handleCallNext = (roomNumber: string) => {
    if (queue.length === 0) return;
    // call the first item
    handleCallPatient(queue[0].id, roomNumber);
  };

  // 4. Complete visit
  const handleCompleteVisit = () => {
    if (!serving) return;
    const completedPatient: Patient = {
      ...serving,
      status: 'Completed',
    };
    setHistory((prev) => [completedPatient, ...prev]);
    setServing(null);

    // send sms follow up
    const smsText = `QueueCure: Thank you for your visit today. Your consultation file has been successfully logged. OPD follow-up notes, prescriptions, and diagnostic suggestions are ready under your Digital Health ID.`;
    sendSimulatedSms(smsText, completedPatient.phone, 'info');
  };

  // 5. Mark as No-Show / Skip serving patient
  const handleMarkNoShow = () => {
    if (!serving) return;
    const missedPatient: Patient = {
      ...serving,
      status: 'No-Show'
    };
    setHistory((prev) => [missedPatient, ...prev]);
    setServing(null);

    // send cancelled sms
    const smsText = `QueueCure: Token #${missedPatient.tokenNumber} has been marked as a No-Show. If you missed your slot, please re-register at the OPD Counter main desk for a new token ID.`;
    sendSimulatedSms(smsText, missedPatient.phone, 'cancel');
  };

  // 6. Direct waitlist cancellation / direct no-show
  const handleRemovePatientById = (id: string) => {
    const target = queue.find((p) => p.id === id);
    if (!target) return;

    const missedPatient: Patient = {
      ...target,
      status: 'No-Show',
      calledAt: new Date().toISOString()
    };

    setQueue((prev) => prev.filter((p) => p.id !== id));
    setHistory((prev) => [missedPatient, ...prev]);

    // send cancellation SMS
    const smsText = `QueueCure: Your waitlist reservation for Token #${target.tokenNumber} has been successfully cancelled.`;
    sendSimulatedSms(smsText, target.phone, 'cancel');
  };

  // Clear operations logs
  const handleClearHistory = () => {
    setHistory([]);
    setSmsMessages([]);
  };

  // Stats calculators
  const stats: QueueStats = {
    waitingCount: queue.length,
    servingCount: serving ? 1 : 0,
    completedTodayCount: history.filter(p => p.status === 'Completed').length,
    noShowTodayCount: history.filter(p => p.status === 'No-Show').length,
    avgWaitTimeMinutes: queue.length * avgWaitTimePerPatient
  };

  const getSystemDateText = () => {
    return systemTime.toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const getSystemTimeText = () => {
    return systemTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (!roleUnlocked) {
    return (
      <div className="min-h-screen bg-[#fcfbfe] dark:bg-[#0F0A1A] text-slate-850 dark:text-slate-200 transition-colors duration-300 font-sans relative">
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all cursor-pointer align-middle active:scale-95"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>

        <RoleGuardLanding
          queue={queue}
          serving={serving}
          tokenCounter={tokenCounter}
          onEnterReceptionist={() => setRoleUnlocked(true)}
          onRegisterPatientToken={(name, phone, visitType, priority) => {
            handleIssueToken(name, phone, visitType, priority);
          }}
          avgWaitTimePerPatient={avgWaitTimePerPatient}
          smsMessages={smsMessages}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfbfe] dark:bg-[#0F0A1A] text-slate-850 dark:text-slate-200 transition-colors duration-300 font-sans">
      {/* 1. Universal Top Header bar */}
      <header className="sticky top-0 z-45 w-full bg-white/85 dark:bg-[#0F0A1A]/85 backdrop-blur-md border-b border-slate-200/60 dark:border-white/10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white font-sans uppercase">
                  QUEUECURE <span className="text-teal-600 dark:text-teal-400 font-normal">QUEUE HUB</span>
                </h1>
                <span className="inline-flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">{t.liveStatus}</span>
                </span>
              </div>
              <p className="text-[9px] uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 font-bold leading-tight mt-0.5">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Time logs / interactive timezone banner and system toggle */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end text-right font-medium">
              <div className="text-base font-mono text-slate-800 dark:text-white leading-none">
                {getSystemTimeText()}
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider font-semibold">
                {getSystemDateText()}
              </span>
            </div>

            {/* Language Selector Dropdown */}
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-2 py-1.5">
              <Globe size={13} className="text-teal-500 shrink-0" />
              <select
                id="receptionist-lang-select"
                value={receptionistLang}
                onChange={(e) => {
                  const newLang = e.target.value as any;
                  setReceptionistLang(newLang);
                  localStorage.setItem('clinic_receptionist_lang', newLang);
                }}
                className="text-[10px] font-bold uppercase tracking-wider bg-transparent text-slate-700 dark:text-slate-300 focus:outline-hidden border-none cursor-pointer pr-1"
              >
                <option value="en" className="bg-white dark:bg-[#1A1426] text-slate-850 dark:text-slate-200">EN (English)</option>
                <option value="hi" className="bg-white dark:bg-[#1A1426] text-slate-850 dark:text-slate-200">HI (हिन्दी)</option>
                <option value="bn" className="bg-white dark:bg-[#1A1426] text-slate-850 dark:text-slate-200">BN (বাংলা)</option>
                <option value="te" className="bg-white dark:bg-[#1A1426] text-slate-850 dark:text-slate-200">TE (తెలుగు)</option>
                <option value="mr" className="bg-white dark:bg-[#1A1426] text-slate-850 dark:text-slate-200">MR (मराठी)</option>
                <option value="ta" className="bg-white dark:bg-[#1A1426] text-slate-850 dark:text-slate-200">TA (தமிழ்)</option>
                <option value="gu" className="bg-white dark:bg-[#1A1426] text-slate-850 dark:text-slate-200">GU (ગુજરાતી)</option>
                <option value="kn" className="bg-white dark:bg-[#1A1426] text-slate-850 dark:text-slate-200">KN (ಕನ್ನಡ)</option>
                <option value="ml" className="bg-white dark:bg-[#1A1426] text-slate-850 dark:text-slate-200">ML (മലയാളം)</option>
                <option value="pa" className="bg-white dark:bg-[#1A1426] text-slate-850 dark:text-slate-200">PA (ਪੰਜਾਬੀ)</option>
                <option value="ur" className="bg-white dark:bg-[#1A1426] text-slate-850 dark:text-slate-200">UR (اردو)</option>
                <option value="or" className="bg-white dark:bg-[#1A1426] text-slate-850 dark:text-slate-200">OR (ଓଡ଼ିଆ)</option>
                <option value="as" className="bg-white dark:bg-[#1A1426] text-slate-850 dark:text-slate-200">AS (অসমীয়া)</option>
              </select>
            </div>

            {/* Lock / Exit Operator Desktop Button */}
            <button
              onClick={() => {
                setRoleUnlocked(false);
                localStorage.setItem('clinic_role_unlocked', 'false');
              }}
              title="Lock Console / Change Role"
              className="px-3 py-1.5 flex items-center gap-1 border border-rose-200 dark:border-rose-500/20 bg-rose-500/5 hover:bg-rose-500 hover:text-white text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer active:scale-95"
            >
              <Shield size={12} className="shrink-0" />
              <span>{t.lockDesk}</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all cursor-pointer align-middle active:scale-95"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* 2. Primary layout body stage */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Dynamic metrics card section */}
        <StatsGrid stats={stats} t={t} />

        {/* Triple Panel Layout Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Column A: Patient registration & shortcuts (col span 4) */}
          <div className="lg:col-span-4 space-y-6">
            <FormSection onIssueToken={handleIssueToken} t={t} />

            {/* Shortcut System Panel */}
            <div className="bg-white/70 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 shadow-xs">
              <h3 className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-400 tracking-widest flex items-center gap-1.5 mb-3.5">
                <Shield size={13} className="text-teal-500" />
                <span>{t.shortcutsTitle}</span>
              </h3>
              
              <ul className="space-y-3.5 text-xs">
                <li className="flex items-start gap-2.5 text-slate-600 dark:text-slate-300">
                  <Volume2 size={14} className="text-teal-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-white">{t.shortcutTtsTitle}</span> {t.shortcutTtsDesc}
                  </div>
                </li>
                <li className="flex items-start gap-2.5 text-slate-600 dark:text-slate-300">
                  <PhoneCall size={14} className="text-teal-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-white">{t.shortcutSmsTitle}</span> {t.shortcutSmsDesc}
                  </div>
                </li>
                <li className="flex items-start gap-2.5 text-slate-600 dark:text-slate-300">
                  <Sparkles size={14} className="text-teal-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-white">{t.shortcutEmergencyTitle}</span> {t.shortcutEmergencyDesc}
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Column B: Command control center & Queue list (col span 5) */}
          <div className="lg:col-span-12 xl:col-span-5 lg:col-span-5 xl:col-span-5 space-y-6">
            <ServingRoom
              currentPatient={serving}
              onCallNext={handleCallNext}
              onCompleteVisit={handleCompleteVisit}
              onMarkNoShow={handleMarkNoShow}
              isQueueEmpty={queue.length === 0}
              t={t}
            />

            <ActiveQueue
              queue={queue}
              onCallPatientById={(id, roomNum) => handleCallPatient(id, roomNum)}
              onRemovePatientById={handleRemovePatientById}
              t={t}
              avgWaitTimePerPatient={avgWaitTimePerPatient}
            />
          </div>

          {/* Column C: Smartphone & SMS alerts simulator (col span 3) */}
          <div className="lg:col-span-12 xl:col-span-3 lg:col-span-3 xl:col-span-3">
            <PhoneMockup smsMessages={smsMessages} t={t} />
          </div>

        </div>

        {/* Section 4: Audit reports table */}
        <HistoryLog history={history} onClearHistory={handleClearHistory} t={t} />

      </main>

      {/* Footer bar */}
      <footer className="mt-8 border-t border-slate-200 dark:border-white/5 py-4 text-[10px] text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-4">
            <span>{t.footerOfficer}: queuecure_op_102</span>
            <span>{t.footerDuty}: Dr. A. K. Verma</span>
            <span>{t.footerLocation}: OPD Desk, AIIMS New Delhi</span>
            <span className="text-teal-500 font-semibold">{t.footerLiveTag}</span>
          </div>
          <div className="flex gap-3">
            <span className="underline cursor-pointer hover:text-slate-700 dark:hover:text-slate-300">Privacy Policy</span>
            <span className="underline cursor-pointer hover:text-slate-700 dark:hover:text-slate-300">Support Ticket</span>
            <span className="font-mono text-xs">v2.4.0-PRIME</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
