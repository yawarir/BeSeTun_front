import { AnnotatorProgress, AdjudicationItem } from '../types';

export const INITIAL_EXPERTS: AnnotatorProgress[] = [
  {
    id: 'expert1',
    name: 'کارشناس شماره ۱ (برچسب‌زن ارشد)',
    username: 'expert1',
    initial: '۱',
    refCompleted: 100,
    refTotal: 100,
    revCompleted: 45,
    revTotal: 100,
    lastActive: 'همین الان (فعال)',
  },
  {
    id: 'expert2',
    name: 'کارشناس شماره ۲ (تحلیل‌گر داده)',
    username: 'expert2',
    initial: '۲',
    refCompleted: 100,
    refTotal: 100,
    revCompleted: 20,
    revTotal: 100,
    lastActive: '۲۵ دقیقه پیش',
  },
];

export const INITIAL_ADJUDICATION_ITEMS: AdjudicationItem[] = [
  {
    id: 1,
    textId: 1004,
    text: 'کارمند باجه با لحن تندی جواب داد و گفت بقیه‌ی مدارک را از سایت بگیرید، ولی در سایت هیچ مدرکی بارگذاری نشده بود.',
    expert1Labels: [3, 6], // رفتار کارکنان + اطلاعات ناکافی
    expert2Labels: [3], // فقط رفتار کارکنان
    finalLabels: [3, 6],
    resolved: true,
    note: 'اطلاعات ناکافی در متن صراحتاً با عبارت «در سایت هیچ مدرکی نبود» قید شده است.',
  },
  {
    id: 2,
    textId: 1002,
    text: 'هزینه‌ی خدمات نسبت به سال گذشته دو برابر شده ولی کیفیت هیچ فرقی نکرده. در شعبه‌ی مرکزی حتی صف هم طولانی‌تر شده.',
    expert1Labels: [1], // هزینه‌ی بالا
    expert2Labels: [1, 2], // هزینه‌ی بالا + کیفیت پایین
    finalLabels: [1, 2],
    resolved: true,
    note: '«کیفیت هیچ فرقی نکرده» نقد مستقیم کیفیت خدمت است و باید به عنوان برچسب درج شود.',
  },
  {
    id: 3,
    textId: 1003,
    text: 'فرم‌ها آن‌قدر پیچیده‌اند که مجبور شدم دو بار از اول پر کنم. سامانه هم وسط کار خطا داد و همه‌چیز پاک شد.',
    expert1Labels: [4, 5], // پیچیدگی + مشکل فنی
    expert2Labels: [5], // فقط مشکل فنی
    finalLabels: [4, 5],
    resolved: false,
    note: '',
  },
  {
    id: 4,
    textId: 1008,
    text: 'درخواست وام در تاریخ ۱۵ اردیبهشت ثبت شده ولی تا این تاریخ هیچ پاسخی در کارتابل درج نشده و دلیلی ذکر نشده است.',
    expert1Labels: [0, 6], // کندی + اطلاعات ناکافی
    expert2Labels: [0], // کندی
    finalLabels: [0],
    resolved: false,
    note: '',
  },
];
