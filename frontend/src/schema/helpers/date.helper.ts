export function isValidIsoDate(dateStr: string): boolean {
  if (!dateStr || typeof dateStr !== 'string') return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}

export const isValidIso8601 = isValidIsoDate;

export function toIsoDateString(dateInput: string | Date | undefined): string {
  if (!dateInput) return new Date().toISOString();
  if (dateInput instanceof Date) return dateInput.toISOString();
  const d = new Date(dateInput);
  return !isNaN(d.getTime()) ? d.toISOString() : new Date().toISOString();
}
