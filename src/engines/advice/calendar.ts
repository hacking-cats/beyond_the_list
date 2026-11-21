/**
 * Calendar entries for a (sample) advice appointment: an .ics file (Apple Calendar, Outlook,
 * most Android calendars) and a Google Calendar link. Pure: all values are inputs.
 * Times are local Swiss time (Europe/Zurich).
 */
export interface CalendarEvent {
  /** ISO date "YYYY-MM-DD". */
  date: string;
  /** "HH:MM", 24-hour clock, Swiss time. */
  time: string;
  durationMinutes: number;
  title: string;
  description: string;
  location: string;
  /** Unique id, e.g. "advice-2026-11-24-1400@beyond-the-list". */
  uid: string;
  /** Creation time in UTC, "YYYYMMDDTHHMMSSZ" (passed in: no clock in engines). */
  stamp: string;
}

export const TIME_ZONE = 'Europe/Zurich';

const pad = (n: number) => String(n).padStart(2, '0');

/** "2026-11-24" + "14:00" + 60 → { start: "20261124T140000", end: "20261124T150000" } (local time). */
export function localRange(date: string, time: string, durationMinutes: number): { start: string; end: string } {
  const [y, mo, d] = date.split('-').map(Number);
  const [h, mi] = time.split(':').map(Number);
  if (!y || !mo || !d || h === undefined || mi === undefined || Number.isNaN(h) || Number.isNaN(mi)) {
    throw new Error(`Expected YYYY-MM-DD and HH:MM, got ${date} ${time}`);
  }
  // Calendar arithmetic only (no time zone): UTC fields used as plain local fields.
  const start = new Date(Date.UTC(y, mo - 1, d, h, mi));
  const end = new Date(start.getTime() + durationMinutes * 60_000);
  const fmt = (x: Date) =>
    `${x.getUTCFullYear()}${pad(x.getUTCMonth() + 1)}${pad(x.getUTCDate())}T${pad(x.getUTCHours())}${pad(x.getUTCMinutes())}00`;
  return { start: fmt(start), end: fmt(end) };
}

/** Escape text for an iCalendar value (RFC 5545 §3.3.11). */
export function escapeIcs(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}

/** Fold lines longer than 75 octets (RFC 5545 §3.1); continuation lines start with a space. */
export function foldLine(line: string): string {
  const bytes = new TextEncoder();
  const out: string[] = [];
  let current = '';
  for (const ch of line) {
    const limit = out.length === 0 ? 75 : 74;
    if (bytes.encode(current + ch).length > limit) {
      out.push(current);
      current = ch;
    } else {
      current += ch;
    }
  }
  out.push(current);
  return out.join('\r\n ');
}

/** A complete .ics file with one event in Swiss time (includes the Europe/Zurich time zone rules). */
export function buildIcs(event: CalendarEvent): string {
  const { start, end } = localRange(event.date, event.time, event.durationMinutes);
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//hacking-cats//Beyond the List//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VTIMEZONE',
    `TZID:${TIME_ZONE}`,
    'BEGIN:DAYLIGHT',
    'TZOFFSETFROM:+0100',
    'TZOFFSETTO:+0200',
    'TZNAME:CEST',
    'DTSTART:19700329T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
    'END:DAYLIGHT',
    'BEGIN:STANDARD',
    'TZOFFSETFROM:+0200',
    'TZOFFSETTO:+0100',
    'TZNAME:CET',
    'DTSTART:19701025T030000',
    'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
    'END:STANDARD',
    'END:VTIMEZONE',
    'BEGIN:VEVENT',
    `UID:${event.uid}`,
    `DTSTAMP:${event.stamp}`,
    `DTSTART;TZID=${TIME_ZONE}:${start}`,
    `DTEND;TZID=${TIME_ZONE}:${end}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    `DESCRIPTION:${escapeIcs(event.description)}`,
    `LOCATION:${escapeIcs(event.location)}`,
    'STATUS:TENTATIVE',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.map(foldLine).join('\r\n') + '\r\n';
}

/** Google Calendar "add event" link (opens Google Calendar with the event filled in). */
export function googleCalendarUrl(event: CalendarEvent): string {
  const { start, end } = localRange(event.date, event.time, event.durationMinutes);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${start}/${end}`,
    ctz: TIME_ZONE,
    details: event.description,
    location: event.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** File name for the download, e.g. "postfinance-appointment-2026-11-24-1400.ics". */
export function icsFileName(date: string, time: string): string {
  return `postfinance-appointment-${date}-${time.replace(':', '')}.ics`;
}
