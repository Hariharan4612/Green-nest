/**
 * GreenNest Form Validation Helpers
 * Standardized validators and sanitizers for form inputs across the application.
 */

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
export const PHONE_REGEX = /^(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
export const PIN_CODE_REGEX = /^[1-9][0-9]{5}$/; // Standard 6-digit Indian PIN code (doesn't start with 0)
export const FLEXIBLE_PIN_REGEX = /^[0-9]{5,6}$/; // 5 or 6 digit postal code

/**
 * Validates an email address.
 */
export function validateEmail(email) {
  const trimmed = (email || '').trim();
  if (!trimmed) {
    return 'Email address is required.';
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return 'Please enter a valid email address (e.g. user@example.com).';
  }
  return '';
}

/**
 * Validates a person's full name.
 */
export function validateName(name, fieldLabel = 'Full Name', minLength = 2) {
  const trimmed = (name || '').trim();
  if (!trimmed) {
    return `${fieldLabel} is required.`;
  }
  if (trimmed.length < minLength) {
    return `${fieldLabel} must be at least ${minLength} characters.`;
  }
  if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) {
    return `${fieldLabel} can only contain letters, spaces, hyphens, and dots.`;
  }
  return '';
}

/**
 * Validates a password.
 */
export function validatePassword(password, minLength = 6) {
  if (!password) {
    return 'Password is required.';
  }
  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters long.`;
  }
  return '';
}

/**
 * Calculates a password strength score (0 to 100) and label.
 */
export function getPasswordStrength(password) {
  if (!password) return { score: 0, label: 'Empty', color: 'bg-gray-200' };
  let score = 0;
  if (password.length >= 6) score += 25;
  if (password.length >= 8) score += 25;
  if (/[0-9]/.test(password)) score += 20;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 15;
  if (/[^a-zA-Z0-9]/.test(password)) score += 15;

  if (score <= 25) return { score, label: 'Weak', color: 'bg-red-500', text: 'text-red-500' };
  if (score <= 65) return { score, label: 'Medium', color: 'bg-amber-500', text: 'text-amber-500' };
  return { score, label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-600' };
}

/**
 * Validates phone numbers.
 * Strips non-digit chars: must have 10 to 13 digits.
 */
export function validatePhone(phone, required = true) {
  const trimmed = (phone || '').trim();
  if (!trimmed) {
    return required ? 'Phone number is required.' : '';
  }
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 13) {
    return 'Please enter a valid 10-digit phone number.';
  }
  return '';
}

/**
 * Validates postal / PIN code.
 */
export function validatePinCode(pinCode, fieldLabel = 'PIN Code') {
  const trimmed = (pinCode || '').trim();
  if (!trimmed) {
    return `${fieldLabel} is required.`;
  }
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length !== 6) {
    return `${fieldLabel} must be exactly 6 digits.`;
  }
  return '';
}

/**
 * Validates generic required text fields.
 */
export function validateRequired(value, fieldLabel = 'This field', minLength = 1) {
  const trimmed = (value || '').trim();
  if (!trimmed) {
    return `${fieldLabel} is required.`;
  }
  if (trimmed.length < minLength) {
    return `${fieldLabel} must be at least ${minLength} characters.`;
  }
  return '';
}

