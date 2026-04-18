import { eq } from 'drizzle-orm';
import { getDb, schema } from './index.js';
import { hashPin } from '../lib/pin.js';
import { env } from '../lib/env.js';

type DemoDb = Awaited<ReturnType<typeof getDb>>['db'];

function shouldSyncDemoIdentityUsers() {
  if (process.env.NODE_ENV === 'test') return true;
  if (process.env.NODE_ENV !== 'production') return true;
  return process.env.MEDCORE_SYNC_DEMO_USERS === '1';
}

export async function syncDemoIdentityUsers(db: DemoDb, now: number) {
  if (!shouldSyncDemoIdentityUsers()) return;

  const defs = [
    {
      id: 'DOC-001',
      name: 'Dr. Wanjiku Njeri',
      role: 'doctor' as const,
      phone: env.DEMO_DOCTOR_PHONE ?? '+254700000001',
      pin: env.DEMO_DOCTOR_PIN,
    },
    {
      id: 'PAT-001',
      name: 'Amina Okafor',
      role: 'patient' as const,
      phone: env.DEMO_PATIENT_PHONE ?? '+254700000002',
      pin: env.DEMO_PATIENT_PIN,
    },
    {
      id: 'ADM-001',
      name: 'Facility Admin',
      role: 'admin' as const,
      phone: env.DEMO_ADMIN_PHONE ?? '+254700000003',
      pin: env.DEMO_ADMIN_PIN,
    },
  ];

  for (const u of defs) {
    const h = hashPin(u.pin);
    const [row] = await db.select().from(schema.users).where(eq(schema.users.id, u.id));
    if (row) {
      await db
        .update(schema.users)
        .set({
          name: u.name,
          role: u.role,
          phone: u.phone,
          pinHash: h,
          pinRotatedAt: now,
          failedAttempts: 0,
          lockedUntil: null,
        })
        .where(eq(schema.users.id, u.id))
        .run();
    } else {
      await db
        .insert(schema.users)
        .values({
          id: u.id,
          name: u.name,
          role: u.role,
          phone: u.phone,
          pinHash: h,
          pinRotatedAt: now,
          failedAttempts: 0,
          lockedUntil: null,
          createdAt: now,
        })
        .run();
    }
  }
}

export async function seedDemoData() {
  const { db } = await getDb();
  const now = Date.now();
  await syncDemoIdentityUsers(db, now);

  const [patientRow] = await db.select().from(schema.patients).where(eq(schema.patients.id, 'PAT-001'));
  if (patientRow) return;

  await db.insert(schema.patients).values({
    id: 'PAT-001',
    firstName: 'Amina',
    lastName: 'Okafor',
    dob: '1987-03-12',
    phone: env.DEMO_PATIENT_PHONE ?? '+254700000002',
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
