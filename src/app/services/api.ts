const base = '/api';

export async function apiFetch<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const err = new Error(data?.error || `API ${res.status}`) as Error & { status?: number; payload?: unknown };
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  return data as T;
}

export interface InteractionResult {
  level: 'critical' | 'warning' | 'info' | 'none';
  drugA: string;
  drugB: string;
  message: string;
  source: 'openfda' | 'rxnorm' | 'fallback' | 'none';
}

export async function checkInteraction(drug1: string, drug2: string) {
  return apiFetch<InteractionResult>(`/interactions?drug1=${encodeURIComponent(drug1)}&drug2=${encodeURIComponent(drug2)}`);
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  drugName: string;
  dosage: string;
  frequency: string;
  duration?: string | null;
  status: 'active' | 'completed' | 'discontinued';
  createdAt: number;
}

export async function listPrescriptions(patientId: string) {
  return apiFetch<{ prescriptions: Prescription[] }>(`/patients/${patientId}/prescriptions`);
}

export async function createPrescription(body: {
  patientId: string;
  doctorId: string;
  drugName: string;
  dosage: string;
  frequency: string;
  duration?: string;
  notes?: string;
  acknowledgedInteractions?: { drugB: string; level: 'critical' | 'warning' | 'info' }[];
  pin?: string;
}) {
  return apiFetch<{ id: string; interactions: InteractionResult[] }>(`/prescriptions`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export interface InteractionEvent {
  id: string;
  patientId: string;
  doctorId: string;
  drugA: string;
  drugB: string;
  level: 'critical' | 'warning' | 'info';
  message: string;
  source: string;
  overridden: number;
  overrideReason?: string | null;
  createdAt: number;
}

export async function listInteractionEvents(patientId: string) {
  return apiFetch<{ events: InteractionEvent[] }>(`/patients/${patientId}/interactions`);
}

export interface SmsMessage {
  id: string;
  direction: 'inbound' | 'outbound';
  fromNumber: string;
  toNumber: string;
  body: string;
  command?: string | null;
  patientId?: string | null;
  doctorId?: string | null;
  responseSnippet?: string | null;
  status: 'received' | 'replied' | 'failed' | 'pin_invalid' | 'locked';
  createdAt: number;
}

export async function listSmsMessages(params: { doctorId?: string; patientId?: string; type?: string } = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v) qs.set(k, v); });
  return apiFetch<{ messages: SmsMessage[]; mockOutbox: { to: string; body: string; at: number }[] }>(`/sms/messages${qs.size ? `?${qs}` : ''}`);
}

export async function simulateInboundSms(from: string, text: string) {
  return apiFetch<{ ok: boolean; reply?: string; error?: string }>('/sms/inbound', {
    method: 'POST',
    body: JSON.stringify({ from, text }),
  });
}

export interface AdherenceResponse {
  ratePct: number;
  streakDays: number;
  total: number;
  events: { doseDate: string; status: 'taken' | 'skipped' | 'missed' | 'unknown' }[];
}

export async function getAdherence(patientId: string) {
  return apiFetch<AdherenceResponse>(`/patients/${patientId}/adherence`);
}

export async function getReminders(patientId: string) {
  return apiFetch<{ reminders: { id: string; scheduledTime: number; status: string; channel: string; prescriptionId: string }[] }>(`/patients/${patientId}/reminders`);
}

export async function dispatchNow(patientId: string) {
  return apiFetch<{ ok: boolean; sent: number }>('/reminders/dispatch-now', {
    method: 'POST',
    body: JSON.stringify({ patientId }),
  });
}

export async function respondToReminder(id: string, response: 'TAKEN' | 'SKIP') {
  return apiFetch<{ ok: boolean }>(`/reminders/${id}/respond`, {
    method: 'POST',
    body: JSON.stringify({ response }),
  });
}

export async function createReminderSchedule(body: {
  prescriptionId: string;
  patientId: string;
  times: string[];
  startDate: string;
  endDate: string;
  channel: 'sms' | 'push';
}) {
  return apiFetch<{ created: number }>('/reminders', { method: 'POST', body: JSON.stringify(body) });
}

export async function getVapidKey() {
  return apiFetch<{ publicKey: string | null }>('/push/vapid');
}

export async function subscribePush(body: { userId: string; endpoint: string; keys: { p256dh: string; auth: string } }) {
  return apiFetch<{ ok: boolean }>('/push/subscribe', { method: 'POST', body: JSON.stringify(body) });
}

export async function transcribe(audio: Blob, params: { patientId: string; doctorId?: string; source?: 'doctor_consult' | 'patient_message'; durationSec?: number }) {
  const fd = new FormData();
  fd.append('audio', audio, 'consult.webm');
  fd.append('patientId', params.patientId);
  if (params.doctorId) fd.append('doctorId', params.doctorId);
  fd.append('source', params.source ?? 'doctor_consult');
  if (params.durationSec != null) fd.append('durationSec', String(params.durationSec));
  const res = await fetch(`${base}/transcribe`, { method: 'POST', body: fd });
  if (!res.ok) throw new Error(`transcribe ${res.status}`);
  return (await res.json()) as { id: string; transcript: string; provider: 'openai' | 'mock'; audioExpiresAt: number };
}

export async function listVoiceRecordings(patientId: string) {
  return apiFetch<{ recordings: { id: string; transcript: string; createdAt: number; audioPath: string | null; source: string; durationSec?: number | null }[] }>(`/patients/${patientId}/voice`);
}

export async function saveConsultationNote(body: {
  patientId: string;
  doctorId: string;
  recordingId?: string;
  transcript?: string;
  chiefComplaint?: string;
  history?: string;
  assessment?: string;
  plan?: string;
  followUp?: string;
}) {
  return apiFetch<{ id: string }>('/consultation-notes', { method: 'POST', body: JSON.stringify(body) });
}

export async function createVideoSession(body: { patientId: string; doctorId: string; reason?: string }) {
  return apiFetch<{ id: string; room: { url: string; name: string; provider: 'daily' | 'mock' } }>('/video/sessions', { method: 'POST', body: JSON.stringify(body) });
}

export async function startVideoSession(id: string) {
  return apiFetch<{ ok: boolean }>(`/video/sessions/${id}/start`, { method: 'POST' });
}

export async function endVideoSession(id: string, notes?: string) {
  return apiFetch<{ ok: boolean; durationSec: number }>(`/video/sessions/${id}/end`, { method: 'POST', body: JSON.stringify({ notes }) });
}
