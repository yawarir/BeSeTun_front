import { ProjectConfig } from '../types';

export const STANDARD_PROJECT_DIRECTORIES = [
  { path: 'raw/', desc: 'داده‌های ورودی خام سازمانی و فایل‌های اکسل/CSV بارگذاری‌شده' },
  { path: 'cleaned/', desc: 'داده‌های پالایش‌شده پس از عبور از قیف قواعد تمیزسازی' },
  { path: 'anonymized/', desc: 'متون گمنام‌سازی‌شده هویتی (حذف شماره کارت، کد ملی، شماره تماس و اسامی)' },
  { path: 'taxonomy/', desc: 'تاکسونومی مصوب برچسب‌ها، تعاریف رسمی و نمونه‌های راهنما (Few-Shot)' },
  { path: 'model_runs/', desc: 'خروجی استنتاج‌های دوگانه A و B و فهرست رکوردهای مشکوک' },
  { path: 'annotations/', desc: 'برچسب‌های ثبت‌شده کارشناسان ۱ و ۲ در داوری دوگانه کور و پرونده‌های حل اختلاف' },
  { path: 'gold_dataset/', desc: 'مجموعه‌داده نهایی استاندارد طلایی بیستون در قالب JSONL و تفکیک سه‌گانه آموزش/اعتبارسنجی/آزمون' },
  { path: 'reports/', desc: 'گزارش‌های توافق کاپای کوهن، جدول شماره ۱ مقالات و شناسنامه داده (Dataset Card)' },
];

export const DEFAULT_PROJECT: ProjectConfig = {
  id: 'proj_complaints_1403',
  persianName: 'شکایت‌های شهروندی ۱۴۰۳',
  latinSlug: 'complaints_1403',
  user: 'user1',
  baseDir: 'user1/projects/complaints_1403',
  description: 'پروژه استخراج دلایل نارضایتی و ساخت دیتاست طلایی طبقه‌بندی شکایات مراجعین سازمانی',
  createdAt: '۱۴۰۳/۰۷/۰۱',
  isInitialized: true,
  directories: STANDARD_PROJECT_DIRECTORIES.map((d) => d.path),
};
