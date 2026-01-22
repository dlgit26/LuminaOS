/**
 * Lumina uses a 4 AM day boundary.
 * Tasks completed at 1 AM count as "yesterday" (the night you're still in).
 */
export function getLogicalDate(date: Date = new Date()): Date {
  const adjusted = new Date(date);
  adjusted.setHours(adjusted.getHours() - 4);
  return new Date(adjusted.toDateString());
}

export function getLogicalDateString(date: Date = new Date()): string {
  return getLogicalDate(date).toISOString().split('T')[0];
}

export function isToday(date: Date): boolean {
  return getLogicalDateString(date) === getLogicalDateString(new Date());
}
