import { describe, expect, it } from 'vitest';
import { buildIcs, escapeIcs, foldLine, googleCalendarUrl, icsFileName, localRange, type CalendarEvent } from './calendar';

const event: CalendarEvent = {
  date: '2026-11-24',
  time: '14:00',
  durationMinutes: 60,
  title: 'PostFinance appointment (sample, not booked): Saving',
  description: 'Sample time from the Beyond the List prototype; book for real in the PostFinance App, e-finance or +41 58 448 14 14.',
  location: 'At a branch near you',
  uid: 'advice-2026-11-24-1400@beyond-the-list',
  stamp: '20261121T150000Z',
};

describe('localRange', () => {
  it('adds the duration in local time', () => {
    expect(localRange('2026-11-24', '14:00', 60)).toEqual({ start: '20261124T140000', end: '20261124T150000' });
  });
  it('crosses midnight and the year end', () => {
    expect(localRange('2026-12-31', '23:30', 60)).toEqual({ start: '20261231T233000', end: '20270101T003000' });
  });
  it('rejects bad input', () => {
    expect(() => localRange('24.11.2026', '14:00', 60)).toThrow();
    expect(() => localRange('2026-11-24', '2pm', 60)).toThrow();
  });
});

describe('buildIcs', () => {
  const ics = buildIcs(event);
  const unfolded = ics.replace(/\r\n /g, '');

  it('is one VCALENDAR with one VEVENT, CRLF line endings', () => {
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(1);
    expect(ics.replace(/\r\n/g, '')).not.toContain('\n');
  });

  it('uses Swiss time with the Europe/Zurich rules', () => {
    expect(unfolded).toContain('DTSTART;TZID=Europe/Zurich:20261124T140000');
    expect(unfolded).toContain('DTEND;TZID=Europe/Zurich:20261124T150000');
    expect(unfolded).toContain('TZID:Europe/Zurich');
    expect(unfolded).toContain('RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU');
  });

  it('marks the event as tentative and says it is not booked', () => {
    expect(unfolded).toContain('STATUS:TENTATIVE');
    expect(unfolded).toContain('SUMMARY:PostFinance appointment (sample\\, not booked): Saving');
  });

  it('escapes commas and semicolons and folds long lines to 75 octets', () => {
    expect(unfolded).toContain('e-finance or +41 58 448 14 14.');
    expect(unfolded).toContain('the PostFinance App\\, e-finance');
    expect(buildIcs({ ...event, location: 'Room 1; Floor 2' }).replace(/\r\n /g, '')).toContain('LOCATION:Room 1\\; Floor 2');
    for (const line of ics.split('\r\n')) expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
  });
});

describe('helpers', () => {
  it('escapeIcs', () => {
    expect(escapeIcs('a,b;c\\d\ne')).toBe('a\\,b\\;c\\\\d\\ne');
  });
  it('foldLine keeps multi-byte characters whole', () => {
    const long = 'SUMMARY:' + 'العربية '.repeat(20);
    const folded = foldLine(long);
    expect(folded.replace(/\r\n /g, '')).toBe(long);
    for (const part of folded.split('\r\n')) expect(new TextEncoder().encode(part).length).toBeLessThanOrEqual(75);
  });
  it('googleCalendarUrl', () => {
    const url = new URL(googleCalendarUrl(event));
    expect(url.origin + url.pathname).toBe('https://calendar.google.com/calendar/render');
    expect(url.searchParams.get('action')).toBe('TEMPLATE');
    expect(url.searchParams.get('dates')).toBe('20261124T140000/20261124T150000');
    expect(url.searchParams.get('ctz')).toBe('Europe/Zurich');
    expect(url.searchParams.get('text')).toBe(event.title);
  });
  it('icsFileName', () => {
    expect(icsFileName('2026-11-24', '14:00')).toBe('postfinance-appointment-2026-11-24-1400.ics');
  });
});
