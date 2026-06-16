import React, { useState } from 'react';
import { User, Phone, Stethoscope, AlertCircle, PlusCircle } from 'lucide-react';
import { VisitType, PriorityLevel } from '../types';
import { ReceptionistTranslation } from '../utils/receptionistTranslations';

interface FormSectionProps {
  onIssueToken: (name: string, phone: string, visitType: VisitType, priority: PriorityLevel) => void;
  t: ReceptionistTranslation;
}

export default function FormSection({ onIssueToken, t }: FormSectionProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [visitType, setVisitType] = useState<VisitType>('Consultation');
  const [priority, setPriority] = useState<PriorityLevel>('Regular');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const formatPhoneNumber = (value: string) => {
    // Strip non-numeric characters
    const numbers = value.replace(/\D/g, '');
    
    // Format as 10-digit standard 5-5 split (e.g. 98765-43210) or with +91 if user wants.
    // If it starts with 91, handle it gracefully
    if (numbers.length > 10 && numbers.startsWith('91')) {
      const actualNum = numbers.slice(2);
      if (actualNum.length <= 5) {
        return `+91 ${actualNum}`;
      }
      return `+91 ${actualNum.slice(0, 5)}-${actualNum.slice(5, 10)}`;
    }

    if (numbers.length <= 5) {
      return numbers;
    } else {
      return `${numbers.slice(0, 5)}-${numbers.slice(5, 10)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const formatted = formatPhoneNumber(rawVal);
    // Allow up to +91 98765-43210 length (15 chars)
    if (formatted.length <= 16) {
      setPhone(formatted);
      if (errors.phone) {
        setErrors(prev => ({ ...prev, phone: undefined }));
      }
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { name?: string; phone?: string } = {};
    if (!name.trim()) {
      newErrors.name = t.errNameRequired;
    } else if (name.trim().length < 2) {
      newErrors.name = t.errNameInvalid;
    }

    const digitsOnly = phone.replace(/\D/g, '');
    if (!phone) {
      newErrors.phone = t.errPhoneRequired;
    } else if (digitsOnly.length < 10) {
      newErrors.phone = t.errPhoneInvalid;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onIssueToken(name.trim(), phone, visitType, priority);
    
    // Reset form fields
    setName('');
    setPhone('');
    setVisitType('Consultation');
    setPriority('Regular');
    setErrors({});
  };

  return (
    <div className="bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-white/10 p-5 shadow-sm">
      <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-150 dark:border-white/5">
        <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400">
          <PlusCircle size={18} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">{t.formTitle}</h2>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.formSubtitle}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Patient Name */}
        <div>
          <label htmlFor="patient-name" className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
            <User size={12} className="text-slate-400" />
            {t.labelName} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="patient-name"
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Amit Sharma"
              className={`w-full px-3 py-2 rounded-lg border bg-white/50 dark:bg-[#1A1426] text-sm focus:outline-hidden transition-all text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 ${
                errors.name
                  ? 'border-red-400 focus:border-red-505 focus:ring-1 focus:ring-red-500/20'
                  : 'border-slate-200 dark:border-white/10 focus:border-teal-500 dark:focus:border-teal-500/60'
              }`}
            />
            {errors.name && (
              <div className="mt-1 flex items-center gap-1 text-[11px] text-red-500 font-medium font-sans">
                <AlertCircle size={12} />
                <span>{errors.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="patient-phone" className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
            <Phone size={12} className="text-slate-400" />
            {t.labelPhone} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="patient-phone"
              type="text"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="98765-43210"
              className={`w-full px-3 py-2 rounded-lg border bg-white/50 dark:bg-[#1A1426] text-sm focus:outline-hidden transition-all text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 ${
                errors.phone
                  ? 'border-red-400 focus:border-red-505 focus:ring-1 focus:ring-red-500/20'
                  : 'border-slate-200 dark:border-white/10 focus:border-teal-500 dark:focus:border-teal-500/60'
              }`}
            />
            {errors.phone && (
              <div className="mt-1 flex items-center gap-1 text-[11px] text-red-500 font-medium font-sans">
                <AlertCircle size={12} />
                <span>{errors.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Visit Type */}
        <div>
          <label htmlFor="visit-type" className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
            <Stethoscope size={12} className="text-slate-400" />
            {t.labelOpdUnit}
          </label>
          <select
            id="visit-type"
            value={visitType}
            onChange={(e) => setVisitType(e.target.value as VisitType)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-[#1A1426] text-slate-800 dark:text-white text-sm focus:outline-hidden focus:border-teal-500 dark:focus:border-teal-500/60 transition-all [&_option]:bg-white [&_option]:text-slate-800 dark:[&_option]:bg-[#1a1426] dark:[&_option]:text-white"
          >
            <option value="Consultation">{t.unitConsultation}</option>
            <option value="Follow-up">{t.unitCheckup}</option>
            <option value="Diagnostic Test">{t.unitDiagnostics}</option>
            <option value="Vaccination">{t.unitVaccination}</option>
            <option value="Emergency">{t.priorityEmergency}</option>
          </select>
        </div>

        {/* Priority Level */}
        <div>
          <label htmlFor="priority-level" className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
            <AlertCircle size={12} className="text-slate-400" />
            {t.labelPriority}
          </label>
          <select
            id="priority-level"
            value={priority}
            onChange={(e) => setPriority(e.target.value as PriorityLevel)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-[#1A1426] text-slate-800 dark:text-white text-sm focus:outline-hidden focus:border-teal-500 dark:focus:border-teal-500/60 transition-all [&_option]:bg-white [&_option]:text-slate-800 dark:[&_option]:bg-[#1a1426] dark:[&_option]:text-white"
          >
            <option value="Regular">{t.priorityRegular}</option>
            <option value="Priority (Child/Infant)">{t.priorityChild}</option>
            <option value="Priority (Senior/Disabled)">{t.prioritySenior}</option>
            <option value="Emergency">{t.priorityEmergency}</option>
          </select>
        </div>

        {/* Issue Token Button */}
        <button
          id="btn-issue-token"
          type="submit"
          className="w-full mt-2 py-3 bg-teal-500 hover:bg-teal-400 active:scale-98 text-[#0F0A1A] font-bold rounded-lg text-xs uppercase tracking-wider transition-all shadow-md shadow-teal-500/10 hover:shadow-teal-500/25 flex items-center justify-center gap-2 cursor-pointer"
        >
          <PlusCircle size={15} />
          <span>{t.btnProcess}</span>
        </button>
      </form>
    </div>
  );
}
