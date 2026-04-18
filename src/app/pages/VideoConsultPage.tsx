import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Video, Phone, PhoneOff, Activity } from 'lucide-react';
import { createVideoSession, startVideoSession, endVideoSession, saveConsultationNote } from '../services/api';
import { useApp } from '../context/AppContext';
import { ClinicalText } from '../components/clinical/ClinicalText';

type Bandwidth = 'good' | 'fair' | 'poor';
type Phase = 'pre' | 'in' | 'post';

export function VideoConsultPage() {
  const { t } = useTranslation();
  const { currentPatientId, currentUserId } = useApp();
  const [phase, setPhase] = useState<Phase>('pre');
  const [bandwidth, setBandwidth] = useState<Bandwidth>('good');
  const [reason, setReason] = useState('Routine follow-up');
  const [session, setSession] = useState<{ id: string; url: string; provider: string } | null>(null);
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState(0);
  const [cameraReady, setCameraReady] = useState(false);
  const [micReady, setMicReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);

  async function testDevices() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraReady(stream.getVideoTracks().length > 0);
      setMicReady(stream.getAudioTracks().length > 0);
    } catch {
      setCameraReady(false);
      setMicReady(false);
    }
  }

  useEffect(() => {
    testDevices();
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  async function start() {
    const res = await createVideoSession({ patientId: currentPatientId, doctorId: currentUserId, reason });
    setSession({ id: res.id, url: res.room.url, provider: res.room.provider });
    await startVideoSession(res.id);
    setPhase('in');
    setDuration(0);
    timerRef.current = window.setInterval(() => setDuration(d => d + 1), 1000);
  }

  async function end() {
    if (!session) return;
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    await endVideoSession(session.id, notes);
    setPhase('post');
  }

  async function saveNote() {
    if (!session) return;
    await saveConsultationNote({
      patientId: currentPatientId,
      doctorId: currentUserId,
      plan: notes,
      assessment: `Video consult — ${reason}`,
    });
    setPhase('pre');
    setSession(null);
    setNotes('');
    setDuration(0);
  }

  const fmt = (n: number) => `${Math.floor(n / 60).toString().padStart(2, '0')}:${(n % 60).toString().padStart(2, '0')}`;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl text-[#1F1B18] flex items-center gap-2"><Video className="w-6 h-6 text-[#214838]" />{t('nav.videoConsult')}</h1>
      </div>

      {phase === 'pre' && (
        <section className="af-elevate rounded-2xl border border-[#D9C8AE] bg-white p-5 space-y-4">
          <h2 className="text-sm uppercase tracking-widest text-[#5B5149]">{t('video.preCall')}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-xs text-[#5B5149] flex flex-col gap-1">
                {t('video.namePatient')}
                <input readOnly className="af-focus rounded-lg border border-[#D9C8AE] px-3 py-2 text-sm bg-[#FDFAF2]" value={currentPatientId} />
              </label>
              <label className="text-xs text-[#5B5149] flex flex-col gap-1">
                {t('video.nameDoctor')}
                <input readOnly className="af-focus rounded-lg border border-[#D9C8AE] px-3 py-2 text-sm bg-[#FDFAF2]" value={currentUserId} />
              </label>
              <label className="text-xs text-[#5B5149] flex flex-col gap-1">
                {t('video.reason')}
                <input className="af-focus rounded-lg border border-[#D9C8AE] px-3 py-2 text-sm" value={reason} onChange={e => setReason(e.target.value)} />
              </label>
              <label className="text-xs text-[#5B5149] flex flex-col gap-1">
                {t('video.bandwidth')}
                <select
                  className="af-focus rounded-lg border border-[#D9C8AE] px-3 py-2 text-sm"
                  value={bandwidth}
                  onChange={e => setBandwidth(e.target.value as Bandwidth)}
                >
                  <option value="good">{t('video.good')}</option>
                  <option value="fair">{t('video.fair')}</option>
                  <option value="poor">{t('video.poor')}</option>
                </select>
              </label>
            </div>
            <div className="space-y-3">
              <div className="rounded-xl overflow-hidden bg-black aspect-video relative">
                <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                {!cameraReady && (
                  <div className="absolute inset-0 flex items-center justify-center text-white text-xs">
                    Camera preview unavailable. Allow access or connect on a phone.
                  </div>
                )}
              </div>
              <div className="text-xs text-[#5B5149] flex flex-wrap gap-2">
                <span className={`px-2 py-1 rounded-full border ${cameraReady ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>Camera {cameraReady ? 'ok' : 'off'}</span>
                <span className={`px-2 py-1 rounded-full border ${micReady ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>Mic {micReady ? 'ok' : 'off'}</span>
                <button type="button" onClick={testDevices} className="af-press af-focus px-2 py-1 rounded-full border border-[#D9C8AE] bg-[#F7F1E6]">{t('video.deviceTest')}</button>
              </div>
            </div>
          </div>
          <button onClick={start} className="af-press af-focus bg-[#214838] text-[#F7F1E6] px-4 py-2 rounded-xl text-sm flex items-center gap-2">
            <Phone className="w-4 h-4" />{t('video.startCall')}
          </button>
          <p className="text-[11px] text-[#5B5149]">{t('video.disclaimer')}</p>
        </section>
      )}

      {phase === 'in' && session && (
        <section className="af-elevate rounded-2xl border border-[#D9C8AE] bg-white overflow-hidden">
          {bandwidth === 'poor' && (
            <div className="bg-amber-50 border-b border-amber-200 text-amber-700 px-4 py-2 text-xs">
              {t('video.audioOnlyBanner')}
            </div>
          )}
          <div className="p-3 flex items-center justify-between text-xs text-[#5B5149] border-b border-[#E7D9BB]">
            <span className="flex items-center gap-2"><Activity className="w-4 h-4 text-[#2F6B4F]" />Live · <ClinicalText>{session.provider}</ClinicalText> · {fmt(duration)}</span>
            <button onClick={end} className="af-press af-focus bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-2">
              <PhoneOff className="w-3.5 h-3.5" />{t('video.endCall')}
            </button>
          </div>
          <div className="relative aspect-video bg-black">
            <iframe
              title="video-room"
              src={session.url}
              allow="camera; microphone; autoplay; fullscreen; display-capture"
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <div className="p-4 grid md:grid-cols-2 gap-3">
            <label className="text-xs text-[#5B5149] flex flex-col gap-1">
              {t('video.notes')}
              <textarea rows={4} value={notes} onChange={e => setNotes(e.target.value)} className="af-focus rounded-lg border border-[#D9C8AE] px-3 py-2 text-sm" />
            </label>
            <div className="text-xs text-[#5B5149]">
              <p>Room URL (demo):</p>
              <ClinicalText className="block font-mono break-all">{session.url}</ClinicalText>
            </div>
          </div>
          <p className="px-4 pb-4 text-[11px] text-[#5B5149]">{t('video.disclaimer')}</p>
        </section>
      )}

      {phase === 'post' && session && (
        <section className="af-elevate rounded-2xl border border-[#D9C8AE] bg-white p-5 space-y-3">
          <h2 className="text-sm uppercase tracking-widest text-[#5B5149]">{t('video.postCall')}</h2>
          <p className="text-sm text-[#1F1B18]">Duration: {fmt(duration)}</p>
          <label className="text-xs text-[#5B5149] flex flex-col gap-1">
            {t('video.notes')}
            <textarea rows={5} value={notes} onChange={e => setNotes(e.target.value)} className="af-focus rounded-lg border border-[#D9C8AE] px-3 py-2 text-sm" />
          </label>
          <button onClick={saveNote} className="af-press af-focus bg-[#214838] text-[#F7F1E6] px-4 py-2 rounded-xl text-sm">{t('common.save')}</button>
        </section>
      )}
    </div>
  );
}
