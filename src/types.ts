export type VisitType = 'Consultation' | 'Follow-up' | 'Diagnostic Test' | 'Vaccination' | 'Emergency';

export type PriorityLevel = 'Regular' | 'Priority (Senior/Disabled)' | 'Priority (Child/Infant)' | 'Emergency';

export interface Patient {
  id: string;
  tokenNumber: number;
  name: string;
  phone: string;
  visitType: VisitType;
  priority: PriorityLevel;
  timestamp: string; // ISO string when token was issued
  status: 'Waiting' | 'Serving' | 'Completed' | 'No-Show';
  calledAt?: string; // ISO string when called to serve
  roomNumber?: string;
}

export interface QueueStats {
  waitingCount: number;
  servingCount: number;
  completedTodayCount: number;
  noShowTodayCount: number;
  avgWaitTimeMinutes: number;
}

export interface SmsMessage {
  id: string;
  timestamp: string;
  text: string;
  phone: string;
  type: 'success' | 'call' | 'cancel' | 'info';
}
