import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role', { enum: ['doctor', 'patient', 'admin'] }).notNull(),
  phone: text('phone'),
  pinHash: text('pin_hash'),
  pinRotatedAt: integer('pin_rotated_at'),
  failedAttempts: integer('failed_attempts').notNull().default(0),
  lockedUntil: integer('locked_until'),
  createdAt: integer('created_at').notNull(),
});

export const patients = sqliteTable('patients', {
  id: text('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  dob: text('dob').notNull(),
  phone: text('phone').notNull(),
  nationalId: text('national_id').notNull(),
  bloodType: text('blood_type'),
  allergies: text('allergies').notNull().default('[]'),
  insuranceScheme: text('insurance_scheme'),
  createdAt: integer('created_at').notNull(),
});

export const prescriptions = sqliteTable('prescriptions', {
  id: text('id').primaryKey(),
  patientId: text('patient_id').notNull(),
  doctorId: text('doctor_id').notNull(),
  drugName: text('drug_name').notNull(),
  dosage: text('dosage').notNull(),
  frequency: text('frequency').notNull(),
  duration: text('duration'),
  status: text('status', { enum: ['active', 'completed', 'discontinued'] }).notNull().default('active'),
  notes: text('notes'),
  createdAt: integer('created_at').notNull(),
});

export const medicationReminders = sqliteTable('medication_reminders', {
  id: text('id').primaryKey(),
  prescriptionId: text('prescription_id').notNull(),
  patientId: text('patient_id').notNull(),
  scheduledTime: integer('scheduled_time').notNull(),
  status: text('status', { enum: ['pending', 'sent', 'confirmed', 'skipped', 'unknown'] }).notNull().default('pending'),
  response: text('response'),
  channel: text('channel', { enum: ['sms', 'push'] }).notNull().default('sms'),
  createdAt: integer('created_at').notNull(),
  respondedAt: integer('responded_at'),
});

export const adherenceEvents = sqliteTable('adherence_events', {
  id: text('id').primaryKey(),
  prescriptionId: text('prescription_id').notNull(),
  patientId: text('patient_id').notNull(),
  doseDate: text('dose_date').notNull(),
  status: text('status', { enum: ['taken', 'skipped', 'missed', 'unknown'] }).notNull(),
  recordedAt: integer('recorded_at').notNull(),
});

export const smsMessages = sqliteTable('sms_messages', {
  id: text('id').primaryKey(),
  direction: text('direction', { enum: ['inbound', 'outbound'] }).notNull(),
  fromNumber: text('from_number').notNull(),
  toNumber: text('to_number').notNull(),
  body: text('body').notNull(),
  command: text('command'),
  patientId: text('patient_id'),
  doctorId: text('doctor_id'),
  responseSnippet: text('response_snippet'),
  status: text('status', { enum: ['received', 'replied', 'failed', 'pin_invalid', 'locked'] }).notNull().default('received'),
  expiresAt: integer('expires_at'),
  createdAt: integer('created_at').notNull(),
});

export const interactionEvents = sqliteTable('interaction_events', {
  id: text('id').primaryKey(),
  patientId: text('patient_id').notNull(),
  doctorId: text('doctor_id').notNull(),
  drugA: text('drug_a').notNull(),
  drugB: text('drug_b').notNull(),
  level: text('level', { enum: ['critical', 'warning', 'info'] }).notNull(),
  message: text('message').notNull(),
  source: text('source', { enum: ['openfda', 'rxnorm', 'fallback'] }).notNull().default('fallback'),
  overridden: integer('overridden').notNull().default(0),
  overrideReason: text('override_reason'),
  createdAt: integer('created_at').notNull(),
});

export const voiceRecordings = sqliteTable('voice_recordings', {
  id: text('id').primaryKey(),
  patientId: text('patient_id').notNull(),
  doctorId: text('doctor_id'),
  source: text('source', { enum: ['doctor_consult', 'patient_message'] }).notNull(),
  audioPath: text('audio_path'),
  audioMime: text('audio_mime'),
  durationSec: real('duration_sec'),
  transcript: text('transcript').notNull().default(''),
  audioExpiresAt: integer('audio_expires_at'),
  createdAt: integer('created_at').notNull(),
});

export const consultationNotes = sqliteTable('consultation_notes', {
  id: text('id').primaryKey(),
  patientId: text('patient_id').notNull(),
  doctorId: text('doctor_id').notNull(),
  recordingId: text('recording_id'),
  chiefComplaint: text('chief_complaint').notNull().default(''),
  history: text('history').notNull().default(''),
  assessment: text('assessment').notNull().default(''),
  plan: text('plan').notNull().default(''),
  followUp: text('follow_up').notNull().default(''),
  createdAt: integer('created_at').notNull(),
});

export const videoConsultations = sqliteTable('video_consultations', {
  id: text('id').primaryKey(),
  patientId: text('patient_id').notNull(),
  doctorId: text('doctor_id').notNull(),
  roomUrl: text('room_url').notNull(),
  roomName: text('room_name').notNull(),
  status: text('status', { enum: ['scheduled', 'in_progress', 'completed', 'cancelled'] }).notNull().default('scheduled'),
  startedAt: integer('started_at'),
  endedAt: integer('ended_at'),
  durationSec: real('duration_sec'),
  notes: text('notes').notNull().default(''),
  createdAt: integer('created_at').notNull(),
});

export const pushSubscriptions = sqliteTable('push_subscriptions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  endpoint: text('endpoint').notNull(),
  p256dh: text('p256dh').notNull(),
  auth: text('auth').notNull(),
  createdAt: integer('created_at').notNull(),
});
