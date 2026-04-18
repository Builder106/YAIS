export type SmsCommandType = 'PATIENT' | 'MEDS' | 'NOTE' | 'APPT' | 'EMRG';

export interface ParsedSmsCommand {
  type: SmsCommandType;
  patientId: string;
  pin: string;
  payload?: string;
}

const CMD_RE = /^(PATIENT|MEDS|NOTE|APPT|EMRG)\s+(\S+)\s+PIN:(\d{4,6})\s*(.*)$/i;

export function parseSmsCommand(body: string): ParsedSmsCommand | { error: string } {
  const trimmed = body.trim();
  const match = trimmed.match(CMD_RE);
  if (!match) {
    return { error: 'Unrecognised command. Use: PATIENT|MEDS|NOTE|APPT|EMRG <ID> PIN:<pin> [text]' };
  }
  const [, rawCmd, patientId, pin, payload] = match;
  return {
    type: rawCmd.toUpperCase() as SmsCommandType,
    patientId: patientId.trim(),
    pin: pin.trim(),
    payload: payload.trim() || undefined,
  };
}

export function safeName(firstName: string, lastName: string) {
  return `${firstName} ${lastName.charAt(0)}.`;
}

const MAX_SMS = 160;

export function clampSms(s: string) {
  if (s.length <= MAX_SMS) return s;
  return s.slice(0, MAX_SMS - 1) + '…';
}
