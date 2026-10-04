import { CleaningRule } from '../types';

export const INITIAL_RULES: CleaningRule[] = [
  {
    id: 'empty',
    title: 'حذف متن‌های خالی و بی‌محتوا',
    description: 'ردیف‌هایی که ستون متن در آن‌ها فاقد نویسه بوده یا صرفاً فاصله دارند',
    enabled: true,
    dropEstimate: 2,
  },
  {
    id: 'dedup',
    title: 'حذف موارد تکراری (Exact & Fuzzy)',
    description: 'متن‌هایی که دقیقاً مشابه یا دارای اشتراک نگارشی بالای ۹۵ درصد هستند',
    enabled: true,
    dropEstimate: 3,
  },
  {
    id: 'length',
    title: 'کمینه‌ی بلندی متن (حداقل ۵ کلمه)',
    description: 'متن‌های کمتر از ۵ کلمه عموماً زمینه موضوعی کافی برای برچسب‌زنی دقیق ندارند',
    enabled: true,
    dropEstimate: 2,
  },
  {
    id: 'lang',
    title: 'پالایش زبان (فقط فارسی استاندارد)',
    description: 'شناسایی و کنار گذاشتن متونی که حروف انگلیسی یا نامتعارف بیش از ۳۰٪ دارند',
    enabled: true,
    dropEstimate: 1,
  },
];

export const INITIAL_DROPPED_SAMPLES = [
  {
    id: 9901,
    rule: 'بدون متن خالی و بی‌محتوا',
    ruleId: 'empty',
    reason: 'متن صرفاً حاوی کاراکترهای فاصله و تب بود',
    rawText: '            ',
  },
  {
    id: 9902,
    rule: 'حذف موارد تکراری (Exact & Fuzzy)',
    ruleId: 'dedup',
    reason: 'تکرار ۱۰۰٪ عینی با رکورد شماره ۱۰۱۴ ثبت‌شده در همان روز',
    rawText: 'تعرفه تمدید اشتراک در سامانه یک قیمت و در درگاه پرداخت مبلغ دیگری کسر می‌شود.',
  },
  {
    id: 9903,
    rule: 'کمینه‌ی بلندی متن (حداقل ۵ کلمه)',
    ruleId: 'length',
    reason: 'طول بسیار کوتاه (۲ واژه)، فاقد زمینه برای تحلیل معنایی',
    rawText: 'سلام پیگیری',
  },
  {
    id: 9904,
    rule: 'پالایش زبان (فقط فارسی استاندارد)',
    ruleId: 'lang',
    reason: 'متن شامل کدهای اسکریپت انگلیسی و برچسب‌های وب',
    rawText: 'TypeError: undefined is not an object (evaluating form.submit)',
  },
];
