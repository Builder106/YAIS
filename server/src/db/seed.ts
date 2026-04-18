import { getDb, schema } from './index.js';
import { hashPin } from '../lib/pin.js';

export async function seedDemoData() {
  const { db } = await getDb();
  const now = Date.now();

  const existing = await db.select().from(schema.users).limit(1);
  if (existing.length > 0) return;

  const demoPin = process.env.DEMO_DOCTOR_PIN ?? '4242';
  const demoPatientPin = process.env.DEMO_PATIENT_PIN ?? '1212';
  const demoAdminPin = process.env.DEMO_ADMIN_PIN ?? '3434';

  await db.insert(schema.users).values([
    {
      id: 'DOC-001',
      name: 'Dr. Wanjiku Njeri',
      role: 'doctor',
      phone: process.env.DEMO_DOCTOR_PHONE ?? '+254700000001',
      pinHash: hashPin(demoPin),
      pinRotatedAt: now,
      failedAttempts: 0,
      createdAt: now,
    },
    {
      id: 'PAT-001',
      name: 'Amina Okafor',
      role: 'patient',
      phone: process.env.DEMO_PATIENT_PHONE ?? '+254700000002',
      pinHash: hashPin(demoPatientPin),
      pinRotatedAt: now,
      failedAttempts: 0,
      createdAt: now,
    },
    {
      id: 'ADM-001',
      name: 'Facility Admin',
      role: 'admin',
      phone: process.env.DEMO_ADMIN_PHONE ?? '+254700000003',
      pinHash: hashPin(demoAdminPin),
      pinRotatedAt: now,
      failedAttempts: 0,
      createdAt: now,
    },
  ]).run();

  await db.insert(schema.patients).values({
    id: 'PAT-001',
    firstName: 'Amina',
    lastName: 'Okafor',
    dob: '1987-03-12',
    phone: process.env.DEMO_PATIENT_PHONE ?? '+254700000002',
    nationalId: 'KE-887412',
    bloodType: 'O+',
    allergies: JSON.stringify(['Penicillin']),
    insuranceScheme: 'NHIF Kenya',
    createdAt: now,
  }).run();

  await db.insert(schema.prescriptions).values([
    {
      id: 'RX-001',
      patientId: 'PAT-001',
      doctorId: 'DOC-001',
      drugName: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      duration: '3 months',
      status: 'active',
      createdAt: now - 1000 * 60 * 60 * 24 * 30,
    },
    {
      id: 'RX-002',
      patientId: 'PAT-001',
      doctorId: 'DOC-001',
      drugName: 'Amlodipine',
      dosage: '5mg',
      frequency: 'Once daily',
      duration: '3 months',
      status: 'active',
      createdAt: now - 1000 * 60 * 60 * 24 * 60,
    },
  ]).run();

  const today = new Date();
  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const d = new Date(today);
    d.setDate(today.getDate() - dayOffset);
    const iso = d.toISOString().slice(0, 10);
    let status: 'taken' | 'skipped' | 'missed' | 'unknown' = 'taken';
    if (dayOffset >= 17 && dayOffset <= 19) status = 'missed';
    if (dayOffset === 5) status = 'unknown';
    await db.insert(schema.adherenceEvents).values({
      id: `ADH-${iso}-RX-001`,
      prescriptionId: 'RX-001',
      patientId: 'PAT-001',
      doseDate: iso,
      status,
      recordedAt: d.getTime(),
    }).onConflictDoNothing().run();
  }
}
