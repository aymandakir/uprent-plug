/**
 * Email validation
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Phone number validation (Dutch format)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+31|0)[1-9]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Required field validation
 */
export function isRequired(value: any): boolean {
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return !isNaN(value);
  return value !== null && value !== undefined;
}

/**
 * Price range validation
 */
export function isValidPriceRange(min: number | null, max: number | null): boolean {
  if (min === null || max === null) return true;
  return min <= max && min >= 0 && max >= 0;
}

/**
 * Date validation (future date)
 */
export function isValidFutureDate(date: string): boolean {
  const dateObj = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dateObj >= today;
}

