import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, Wifi, Battery, MessageSquare, Send, BellRing, CheckCheck } from 'lucide-react';
import { SmsMessage } from '../types';
import { soundSynth } from '../utils/audio';
import { ReceptionistTranslation } from '../utils/receptionistTranslations';

interface PhoneMockupProps {
  smsMessages: SmsMessage[];
  t: ReceptionistTranslation;
}

export default function PhoneMockup({ smsMessages, t }: PhoneMockupProps) {
  const [phoneTime, setPhoneTime] = useState('10:06');
  const [vibrate, setVibrate] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessagesCountRef = useRef(0);

  // Sync phone time with system time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12; // convert to 12h format
      setPhoneTime(`${hours}:${minutes} ${ampm}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, []);

  // Handle incoming SMS notifications: play chime + trigger CSS phone-rumble vibration
  useEffect(() => {
    if (smsMessages.length > prevMessagesCountRef.current) {
      setVibrate(true);
      setUnreadCount((prev) => prev + 1);
      soundSynth.playSmsNotificationSound();

      const timer = setTimeout(() => {
        setVibrate(false);
      }, 500);

      prevMessagesCountRef.current = smsMessages.length;
      
      // Auto scroll messaging UI
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [smsMessages]);

  const clearUnread = () => {
    setUnreadCount(0);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Smartphone frame container */}
      <motion.div
        animate={vibrate ? {
          x: [0, -8, 8, -6, 6, -3, 3, 0],
          y: [0, 4, -4, 3, -3, 1, -1, 0],
        } : {}}
        transition={{ duration: 0.4 }}
        className="relative w-[280px] h-[524px] rounded-[38px] border-[8px] border-slate-900 dark:border-white/10 bg-slate-950 shadow-2xl overflow-hidden shrink-0"
      >
        {/* Dynamic Island / Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-900 dark:bg-slate-800 rounded-full z-30 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-slate-950 mr-1.5 border border-slate-800"></div>
          <div className="w-10 h-1 bg-slate-950 rounded-full opacity-60"></div>
        </div>

        {/* Screen Content Wrapper */}
        <div className="absolute inset-0 bg-slate-50 dark:bg-[#0F0A1A] flex flex-col pt-8 text-[11px] select-none font-sans">
          {/* Internal Smartphone Status Bar */}
          <div className="px-5 py-1.5 flex justify-between items-center text-slate-850 dark:text-slate-200 font-mono text-[9px] z-10 select-none">
            <span>{phoneTime.split(' ')[0]}</span>
            <div className="flex items-center gap-1.5">
              <Wifi size={11} className="stroke-[2.5]" />
              <div className="flex items-center gap-0.5">
                <span className="text-[9px]">5G</span>
              </div>
              <Battery size={13} className="stroke-[2]" />
            </div>
          </div>

          {/* SMS Application Header */}
          <div className="px-4 py-2 bg-white dark:bg-[#1A1426] border-b border-slate-200/60 dark:border-white/5 flex items-center gap-2 shadow-xs">
            <div className="w-7 h-7 rounded-lg bg-teal-500 text-[#0F0A1A] flex items-center justify-center font-black text-xs">
              LH
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-bold text-slate-805 dark:text-white">{t.phoneTitle}</span>
                <span className="w-3.5 h-3.5 bg-teal-500 rounded-full flex items-center justify-center text-[8px] text-[#0F0A1A] font-extrabold">✓</span>
              </div>
              <p className="text-[9px] text-teal-600 dark:text-teal-400 font-bold flex items-center gap-1 leading-none">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse inline-block"></span>
                {t.phoneSubtitle}
              </p>
            </div>
            
            {/* SMS bell notification banner alert */}
            {unreadCount > 0 && (
              <button
                onClick={clearUnread}
                className="bg-teal-500/10 dark:bg-teal-500/10 px-2 py-0.5 rounded-full text-teal-600 dark:text-teal-400 font-bold text-[9px] animate-bounce"
              >
                {unreadCount} {t.delayed ? 'new' : 'new'}
              </button>
            )}
          </div>

          {/* SMS Bubbles Conversation Screen Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50 dark:bg-[#0F0A1A] custom-scrollbar relative flex flex-col justify-end">
            <div className="text-center text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold my-2 py-1 leading-none">
              Today • SMS Service
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 flex flex-col pr-0.5">
              <AnimatePresence initial={false}>
                {smsMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, scale: 0.85, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    className="flex flex-col max-w-[85%] self-start"
                  >
                    {/* Timestamp */}
                    <span className="text-[8px] text-slate-400 dark:text-slate-500 ml-2 mb-0.5">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    {/* Chat Bubble card */}
                    <div className="bg-white dark:bg-[#1A1426] text-slate-800 dark:text-slate-100 rounded-xl rounded-tl-sm p-2.5 border border-slate-150 dark:border-white/5 shadow-xs flex flex-col leading-relaxed font-sans">
                      <p className="whitespace-pre-line break-words text-[10px] text-slate-700 dark:text-slate-200">
                        {msg.text}
                      </p>
                      
                      <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-100/50 dark:border-white/5 text-[8px] text-slate-400 dark:text-slate-500 font-medium font-mono">
                        <span>To: {msg.phone}</span>
                        <span className="flex items-center gap-0.5 text-teal-500">
                          Delivered
                          <CheckCheck size={10} className="stroke-[3.5]" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {smsMessages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400 dark:text-slate-600">
                  <MessageSquare size={24} className="stroke-[1.5] mb-2 opacity-50 text-teal-500" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{t.phoneNoMsg}</p>
                  <p className="text-[9px] mt-1 text-slate-500 dark:text-slate-400 leading-normal">
                    {t.phoneNoMsgDesc}
                  </p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Locked mock input text bar */}
          <div className="p-2 border-t border-slate-200/60 dark:border-white/5 bg-white dark:bg-[#1A1426] flex items-center gap-1.5">
            <div className="flex-1 bg-slate-50 dark:bg-[#0F0A1A] border border-slate-200/50 dark:border-white/5 px-3 py-1.5 rounded-full text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold tracking-wider text-center">
              {t.phoneReadonly}
            </div>
            <button className="p-1.5 bg-slate-100 dark:bg-white/5 rounded-full text-slate-400 dark:text-slate-650 cursor-not-allowed">
              <Send size={11} />
            </button>
          </div>
        </div>
      </motion.div>
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-2 text-center">
        <BellRing size={11} className="text-teal-500 shrink-0" />
        <span>{t.phoneSync}</span>
      </div>
    </div>
  );
}
