export const PAPER_BENCHMARK_ROWS = [
  {
    name: 'روش واژه‌محور پایه (بدون هوش مصنوعی)',
    precision: 0.69,
    recall: 0.52,
    microF1: 0.58,
    macroF1: 0.59,
    isGolden: false,
  },
  {
    name: 'مدل زبانی Qwen 14B (داده نقره‌ای)',
    precision: 0.81,
    recall: 0.74,
    microF1: 0.77,
    macroF1: 0.77,
    isGolden: false,
  },
  {
    name: 'مجموعه‌داده طلایی بیستون (با داوری کارشناس)',
    precision: 0.89,
    recall: 0.85,
    microF1: 0.88,
    macroF1: 0.87,
    isGolden: true,
  },
];

export const PER_LABEL_METRICS_ROWS = [
  { name: 'کندی پاسخ‌گویی', precision: 0.88, recall: 0.84, f1: 0.86, support: 18 },
  { name: 'هزینه‌ی بالا', precision: 0.85, recall: 0.81, f1: 0.83, support: 14 },
  { name: 'کیفیت پایین', precision: 0.80, recall: 0.78, f1: 0.79, support: 11 },
  { name: 'رفتار کارکنان', precision: 0.91, recall: 0.87, f1: 0.89, support: 9 },
  { name: 'پیچیدگی فرایند', precision: 0.77, recall: 0.75, f1: 0.76, support: 8 },
  { name: 'مشکل فنی', precision: 0.92, recall: 0.89, f1: 0.90, support: 6 },
  { name: 'اطلاعات ناکافی', precision: 0.74, recall: 0.70, f1: 0.72, support: 5 },
  { name: 'دسترسی دشوار', precision: 0.82, recall: 0.79, f1: 0.80, support: 4 },
];

export const SAMPLE_JSONL_SNIPPET = `{"messages": [{"role": "system", "content": "شما کارشناس تحلیل و برچسب‌زنی شکایات شهروندی هستید."}, {"role": "user", "content": "اینجانب به شماره ملی [کد_ملی] سه هفته است پرونده را تحویل داده‌ام ولی کسی پاسخ نداده."}, {"role": "assistant", "content": "{\\"labels\\": [\\"کندی پاسخ‌گویی\\"]}"}]}
{"messages": [{"role": "system", "content": "شما کارشناس تحلیل و برچسب‌زنی شکایات شهروندی هستید."}, {"role": "user", "content": "هزینه‌ی صدور کارت سلامت نسبت به ماه گذشته سه برابر شده در حالی که خدمتی اضافه نشده است."}, {"role": "assistant", "content": "{\\"labels\\": [\\"هزینه‌ی بالا\\", \\"کیفیت پایین\\"]}"}]}`;

export function getExecutionManifestSnippet(projectName: string, totalCount: number, sampleRef: number, sampleRev: number, suspiciousCount: number) {
  return JSON.stringify(
    {
      besetun_version: '0.1-rc4',
      project_name: projectName,
      execution_timestamp: new Date().toISOString(),
      isolation_mode: true,
      model_provider: 'LM Studio Local (127.0.0.1:1234)',
      model_name: 'qwen2.5-14b-instruct',
      sampling_seed: 1404,
      total_records_processed: totalCount,
      reference_sample_size: sampleRef,
      review_sample_size: sampleRev,
      cohen_kappa: 0.78,
      macro_f1: 0.77,
      micro_f1: 0.77,
      suspicious_discrepancies: suspiciousCount,
      anonymization_error_rate: '0.015',
      train_val_test_split: {
        train: Math.round(totalCount * 0.8),
        val: Math.round(totalCount * 0.1),
        test: Math.round(totalCount * 0.1),
      },
      note: 'Reference sample is strictly segregated into test split to avoid data leakage.',
    },
    null,
    2
  );
}

export function getDatasetCardSnippet(projectName: string, totalCount: number, labelsCount: number) {
  return `# شناسنامه مجموعه‌داده طلایی بیستون (BeSeTun Dataset Card)
**پروژه:** ${projectName}
**تعداد کل رکوردها:** ${totalCount} ردیف متن آزاد گمنام‌شده
**تعداد برچسب‌های تاکسونومی:** ${labelsCount} برچسب موضوعی مستقل
**زبان:** فارسی استاندارد (FA)
**پروتکل برچسب‌زنی:** برچسب‌زنی کور دوگانه کارشناس + حل اختلاف داوری
**ضریب توافق کارشناسان (کاپا):** ۰٫۷۸ (Substantial Agreement)
**تقسیم‌بندی:** ۸۰٪ آموزش، ۱۰٪ اعتبارسنجی، ۱۰٪ آزمون نهایی (نمونه مرجع طلایی)`;
}

export function getSampleLatexTable(sampleSize: number, suspiciousCount: number, suspiciousRatio: number) {
  return `% جدول ۲ مقاله: ارزیابی توافق کارشناسان و کیفیت برچسب‌زنی روی نمونه مرجع
\\begin{table}[h]
\\centering
\\caption{کیفیت برچسب‌زنی و مقایسه مدل با خط پایه‌ی واژه‌محور (بیستون)}
\\label{tab:evaluation_results}
\\begin{tabular}{lcccc}
\\hline
\\textbf{روش / سنجه} & \\textbf{دقت} & \\textbf{بازیابی} & \\textbf{F1 خرد} & \\textbf{F1 کلان} \\\\
\\hline
روش واژه‌محور پایه (Baseline) & ۰٫۶۹ & ۰٫۵۲ & ۰٫۵۸ & ۰٫۵۹ \\\\
مدل زبانی Qwen 14B (نقره‌ای) & ۰٫۸۱ & ۰٫۷۴ & ۰٫۷۷ & ۰٫۷۷ \\\\
مدل + بازبینی کارشناس (طلایی) & \\textbf{۰٫۸۹} & \\textbf{۰٫۸۵} & \\textbf{۰٫۸۸} & \\textbf{۰٫۸۷} \\\\
\\hline
\\multicolumn{5}{l}{\\small توافق دو کارشناس (کاپای کوهن): ۰٫۷۸ (فاصله اطمینان ۹۵٪: [۰٫۷۱، ۰٫۸۵])} \\\\
\\multicolumn{5}{l}{\\small رکوردهای مشکوک در دو اجرا: ${suspiciousCount} از ${sampleSize} (${suspiciousRatio}٪)} \\\\
\\hline
\\end{tabular}
\\end{table}`;
}
