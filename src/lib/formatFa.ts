/**
 * Centralized Persian Number Formatter for BeSeTun
 * Standardized on:
 * - Persian digits: ۰ ۱ ۲ ۳ ۴ ۵ ۶ ۷ ۸ ۹
 * - Persian decimal separator: «٫» (U+066B)
 * - Persian thousands separator: «٬» (U+066C)
 * - Persian percent sign: «٪» (U+066A)
 * - Persian list separator: «،» (U+060C)
 */

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toFaDigits(val: string | number): string {
  if (val === null || val === undefined) return '';
  const str = String(val);
  return str.replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]);
}

/**
 * Formats an integer with Persian digits and thousands separator «٬»
 */
export function formatInt(val: number): string {
  if (isNaN(val) || val === null || val === undefined) return '۰';
  const parts = Math.round(val).toString().split('');
  let result = '';
  let count = 0;
  for (let i = parts.length - 1; i >= 0; i--) {
    result = parts[i] + result;
    count++;
    if (count % 3 === 0 && i > 0) {
      result = '٬' + result;
    }
  }
  return toFaDigits(result);
}

/**
 * Formats a decimal number with fixed precision, Persian digits and «٫» decimal separator
 */
export function formatDec(val: number, digits = 2): string {
  if (isNaN(val) || val === null || val === undefined) return '۰';
  const fixed = val.toFixed(digits);
  const [intPart, decPart] = fixed.split('.');
  const formattedInt = formatInt(Number(intPart));
  if (!decPart || digits === 0) return formattedInt;
  return `${formattedInt}٫${toFaDigits(decPart)}`;
}

/**
 * Formats a percentage value (0-100 or integer) with «٪»
 */
export function formatPct(val: number): string {
  if (isNaN(val) || val === null || val === undefined) return '۰٪';
  return `${formatInt(Math.round(val))}٪`;
}

/**
 * Formats a ratio as «A از B»
 */
export function formatRatio(a: number, b: number): string {
  return `${formatInt(a)} از ${formatInt(b)}`;
}

/**
 * Formats a fraction as «A/B» in Persian digits
 */
export function formatFraction(a: number, b: number): string {
  return `${toFaDigits(a)}/${toFaDigits(b)}`;
}

/**
 * Formats confidence interval e.g. [۰٫۷۱، ۰٫۸۵]
 */
export function formatCI(low: number, high: number, digits = 2): string {
  return `[${formatDec(low, digits)}، ${formatDec(high, digits)}]`;
}
