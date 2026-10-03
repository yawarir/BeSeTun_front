import {
  LabelItem,
  RawTextRecord,
  CleaningRule,
  ModelProvider,
  AnnotatorProgress,
  AdjudicationItem,
  CandidateLabel,
  StepDefinition,
} from './types';

export const MAIN_STEPS: StepDefinition[] = [
  {
    key: 'data',
    stepNumber: 1,
    title: 'آماده‌سازی داده',
    shortDesc: 'ورود فایل‌ها، پالایش قیف، نمونه‌گیری تصادفی و گمنام‌سازی هویت‌ها',
    detailedDesc: 'متن‌های خام سازمانی را وارد کنید، موارد تکراری و معیوب را حذف نمایید، نمونه‌های مرجع و بازبینی را تفکیک و داده‌های حساس را پنهان کنید.',
    defaultTab: 'clean',
  },
  {
    key: 'labels',
    stepNumber: 2,
    title: 'آماده‌سازی برچسب‌ها',
    shortDesc: 'استخراج هوشمند برچسب با مدل، تدوین تاکسونومی و نمونه‌های راهنما',
    detailedDesc: 'مدل دسته‌ای متن‌ها را تحلیل کرده و برچسب‌های پرتکرار را پیشنهاد می‌دهد؛ شما نام، تعریف و کلیدهای میانبر کارشناسی را تعریف می‌کنید.',
    defaultTab: 'extract',
  },
  {
    key: 'model',
    stepNumber: 3,
    title: 'برچسب‌زنی مدل',
    shortDesc: 'اجرای دوگانه (A و B) برای تشخیص موارد مشکوک و ناهمخوان',
    detailedDesc: 'هر متن دو بار توسط مدل (یا با دو پرامپت متفاوت) برچسب می‌خورد تا تناقض‌ها مشخص و نمونه‌های چالش‌برانگیز استخراج شوند.',
    defaultTab: 'runs',
  },
  {
    key: 'expert',
    stepNumber: 4,
    title: 'برچسب‌زنی کارشناس',
    shortDesc: 'برچسب‌زنی کور دوگانه، بازبینی سریع اوپراتور و حل مکانیزه اختلاف‌ها',
    detailedDesc: 'دو کارشناس به‌صورت جداگانه نمونه مرجع را برچسب می‌زنند؛ سامانه اختلاف‌ها را استخراج کرده و برای مدیر جهت داوری نهایی آماده می‌کند.',
    defaultTab: 'work',
  },
  {
    key: 'keyword',
    stepNumber: 5,
    title: 'برچسب‌زنی واژه‌محور',
    shortDesc: 'پیاده‌سازی روش پایه‌ی بدون هوش مصنوعی جهت اعتبارسنجی مقالاتی',
    detailedDesc: 'یک نگاشت کلیدواژه‌ای شفاف پیاده می‌شود تا در جدول مقایسه‌ای مقاله اثبات شود مدل زبانی چقدر برتری آماری ایجاد می‌کند.',
    defaultTab: 'dict',
  },
  {
    key: 'results',
    stepNumber: 6,
    title: 'نتایج و خروجی طلایی',
    shortDesc: 'محاسبه ضریب کاپا، سنجه‌های F1، جدول مقاله و تولید بسته فاین‌تیون',
    detailedDesc: 'توافق کارشناسان محاسبه شده، جدول ۱ استاندارد مقالات تولید می‌شود و مجموعه‌داده طلایی نهایی در فرمت‌های JSONL و HuggingFace استخراج می‌گردد.',
    defaultTab: 'paper',
  },
];

export const INITIAL_LABELS: LabelItem[] = [
  {
    id: 0,
    name: 'کندی پاسخ‌گویی',
    definition: 'انتظار طولانی و بیش از حد استاندارد برای دریافت پاسخ یا رسیدگی به درخواست',
    example: 'سه هفته است پرونده در دبیرخانه مانده و هیچ‌کس پاسخگو نیست.',
    keyShortcut: '۱',
    color: '#24418F',
  },
  {
    id: 1,
    name: 'هزینه‌ی بالا',
    definition: 'قیمت یا تعرفه خدمت نامتعارف، گران یا فراتر از توان شهروند است',
    example: 'تعرفه صدور مجوز نسبت به سال گذشته دو برابر شده است.',
    keyShortcut: '۲',
    color: '#8A5512',
  },
  {
    id: 2,
    name: 'کیفیت پایین',
    definition: 'نتیجه خدمت ناقص، غیردقیق، دارای خطای اجرایی یا نامنطبق بر تعهد است',
    example: 'کار به پایان رسید اما مدارک ارسال‌شده پر از ایرادات نگارشی و فنی است.',
    keyShortcut: '۳',
    color: '#A12E28',
  },
  {
    id: 3,
    name: 'رفتار کارکنان',
    definition: 'برخورد نامناسب، لحن تند، بی‌احترامی یا عدم توجه کارمند در مواجهه با ارباب‌رجوع',
    example: 'مسئول باجه بدون توجه به توضیحات من با تندی گفت مدارک ناقص است.',
    keyShortcut: '۴',
    color: '#701A75',
  },
  {
    id: 4,
    name: 'پیچیدگی فرایند',
    definition: 'مراحل اداری اضافه، فرم‌های گیج‌کننده، نیاز به استعلامات زائد یا چرخه بوروکراتیک',
    example: 'برای ثبت یک درخواست ساده ۷ امضا و تأییدیه از ۵ اداره مختلف خواستند.',
    keyShortcut: '۵',
    color: '#0F766E',
  },
  {
    id: 5,
    name: 'مشکل فنی',
    definition: 'خطا، قطعی سرور، از کار افتادن درگاه پرداخت یا عدم بارگذاری صفحات سامانه',
    example: 'وسط ارسال فرم و پرداخت کارمزد، سامانه ارور ۵۰۰ داد و اطلاعات پرید.',
    keyShortcut: '۶',
    color: '#1E293B',
  },
  {
    id: 6,
    name: 'اطلاعات ناکافی',
    definition: 'راهنمایی ناقص، نبود شرایط شفاف در سایت یا اطلاع‌رسانی گمراه‌کننده به متقاضی',
    example: 'هیچ‌کجا ننوشته بودند برای این مرحله اصل کارت ملی هوشمند الزامی است.',
    keyShortcut: '۷',
    color: '#C2410C',
  },
  {
    id: 7,
    name: 'دسترسی دشوار',
    definition: 'مکان فیزیکی نامناسب، عدم دسترسی ویلچر/معلولین، یا ساعت کاری محدود شعب',
    example: 'تنها شعبه تخصصی استان در نقطه دورافتاده خارج از شهر واقع شده است.',
    keyShortcut: '۸',
    color: '#256638',
  },
];

export const INITIAL_CANDIDATE_LABELS: CandidateLabel[] = [
  { id: 0, name: 'کندی پاسخ‌گویی', frequency: 64, selected: true },
  { id: 1, name: 'هزینه‌ی بالا', frequency: 51, selected: true },
  { id: 2, name: 'کیفیت پایین خدمت', frequency: 38, selected: true },
  { id: 3, name: 'رفتار نامناسب پرسنل', frequency: 33, selected: true },
  { id: 4, name: 'پیچیدگی و سردرگمی مراحل', frequency: 29, selected: true },
  { id: 5, name: 'خطا و قطعی سامانه برخط', frequency: 22, selected: true },
  { id: 6, name: 'عدم شفافیت ضوابط', frequency: 19, selected: true },
  { id: 7, name: 'محدودیت دسترسی مکانی/زمانی', frequency: 14, selected: true },
  { id: 8, name: 'نقض حریم خصوصی کاربران', frequency: 8, selected: false },
  { id: 9, name: 'مشکل پیگیری کد رهگیری', frequency: 6, selected: false },
];

export const INITIAL_RULES: CleaningRule[] = [
  {
    id: 'empty',
    title: 'حذف متن‌های خالی و بی‌محتوا',
    description: 'ردیف‌هایی که ستون متن در آن‌ها فاقد نویسه بوده یا صرفاً فاصله دارند',
    enabled: true,
    dropEstimate: 122,
  },
  {
    id: 'dedup',
    title: 'حذف موارد تکراری (Exact & Fuzzy)',
    description: 'متن‌هایی که دقیقاً مشابه یا دارای اشتراک نگارشی بالای ۹۵ درصد هستند',
    enabled: true,
    dropEstimate: 406,
  },
  {
    id: 'length',
    title: 'کمینه‌ی بلندی متن (حداقل ۵ کلمه)',
    description: 'متن‌های کمتر از ۵ کلمه عموماً زمینه موضوعی کافی برای برچسب‌زنی دقیق ندارند',
    enabled: true,
    dropEstimate: 218,
  },
  {
    id: 'lang',
    title: 'پالایش زبان (فقط فارسی استاندارد)',
    description: 'شناسایی و کنار گذاشتن متونی که حروف انگلیسی یا نامتعارف بیش از ۳۰٪ دارند',
    enabled: true,
    dropEstimate: 118,
  },
];

export const SAMPLE_TEXTS: RawTextRecord[] = [
  {
    id: 1001,
    text: 'از روزی که پرونده را تحویل دادم سه هفته گذشته و هنوز کسی پاسخ نداده. هر بار تماس می‌گیرم می‌گویند کارشناس مسئول، [نام]، در جلسه است و امکان پاسخگویی ندارد.',
    sourceFile: 'complaints_1402.xlsx',
    status: 'sampled_ref',
    modelSuggestions: [0], // کندی پاسخ‌گویی
    modelRunB: [0],
    isSuspicious: false,
  },
  {
    id: 1002,
    text: 'هزینه‌ی خدمات نسبت به سال گذشته دو برابر شده ولی کیفیت هیچ فرقی نکرده. در شعبه‌ی [شهر] حتی صف هم طولانی‌تر شده و کارها بسیار کند پیش می‌رود.',
    sourceFile: 'complaints_1402.xlsx',
    status: 'sampled_ref',
    modelSuggestions: [1, 2], // هزینه‌ی بالا، کیفیت پایین
    modelRunB: [1], // Run B forgot کیفیت
    isSuspicious: true,
  },
  {
    id: 1003,
    text: 'فرم‌های ثبت‌نام آن‌قدر پیچیده و گیج‌کننده‌اند که مجبور شدم دو بار از اول پر کنم. سامانه هم وسط کار خطای ناگهانی داد و همه‌چیز پاک شد.',
    sourceFile: 'complaints_1403.csv',
    status: 'sampled_ref',
    modelSuggestions: [4, 5], // پیچیدگی فرایند، مشکل فنی
    modelRunB: [4, 5],
    isSuspicious: false,
  },
  {
    id: 1004,
    text: 'کارمند باجه با لحن بسیار تندی جواب داد و گفت بقیه‌ی مدارک را از سایت بگیرید، ولی در سایت هیچ راهنمایی و توضیحی برای این مدرک نبود.',
    sourceFile: 'complaints_1403.csv',
    status: 'sampled_ref',
    modelSuggestions: [3, 6, 0], // رفتار کارکنان، اطلاعات ناکافی، کندی
    modelRunB: [3, 6], // difference in کندی
    isSuspicious: true,
  },
  {
    id: 1005,
    text: 'فقط یک شعبه در کل استان برای ارائه خدمت فعال است و ساعت کاری‌اش دقیقاً با ساعت اداری من تلاقی دارد. خانم [نام] هم گفت راه دیگری برای پیگیری نیست.',
    sourceFile: 'complaints_1402.xlsx',
    status: 'sampled_ref',
    modelSuggestions: [7], // دسترسی دشوار
    modelRunB: [7],
    isSuspicious: false,
  },
  {
    id: 1006,
    text: 'سه بار مبلغ کارمزد از حسابم کسر شد اما تیکت ثبت نشد. وقتی هم تلفنی پیگیری کردم کارمند پشتیبانی تلفن را قطع کرد.',
    sourceFile: 'complaints_1403.csv',
    status: 'sampled_rev',
    modelSuggestions: [5, 3], // مشکل فنی، رفتار کارکنان
    modelRunB: [5, 3],
    isSuspicious: false,
  },
  {
    id: 1007,
    text: 'چرا اعلام نکردید برای متقاضیان غیربومی فرم شماره ۴ نیاز است؟ من ۵۰۰ کیلومتر راه آمدم و حالا می‌گویند باید دوباره برگردم شهر خودم.',
    sourceFile: 'complaints_1402.xlsx',
    status: 'sampled_rev',
    modelSuggestions: [6, 4], // اطلاعات ناکافی، پیچیدگی فرایند
    modelRunB: [6],
    isSuspicious: true,
  },
  {
    id: 1008,
    text: 'درخواست وام اشتغال در تاریخ ۱۵ اردیبهشت ثبت شده ولی تا این تاریخ هیچ پاسخی در کارتابل درج نشده است. هیچ دلیلی هم برای رد یا تایید ارائه نداده‌اند.',
    sourceFile: 'complaints_1403.csv',
    status: 'sampled_ref',
    modelSuggestions: [0], // کندی پاسخ‌گویی
    modelRunB: [0, 6],
    isSuspicious: true,
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
    text: 'هزینه‌ی خدمات نسبت به سال گذشته دو برابر شده ولی کیفیت هیچ فرقی نکرده. در شعبه‌ی [شهر] حتی صف هم طولانی‌تر شده.',
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

export const INITIAL_PROVIDERS: ModelProvider[] = [
  {
    id: 'lm',
    name: 'LM Studio Local Server',
    type: 'local',
    url: 'http://127.0.0.1:1234/v1',
    status: 'connected',
    models: ['qwen2.5-14b-instruct', 'llama-3.1-8b-instruct'],
    active: true,
    isExternal: false,
  },
  {
    id: 'ol',
    name: 'Ollama Internal Gateway',
    type: 'lan',
    url: 'http://192.168.1.45:11434',
    status: 'connected',
    models: ['gemma2:9b-persian', 'mistral-nemo:12b'],
    active: true,
    isExternal: false,
  },
  {
    id: 'or',
    name: 'OpenRouter Cloud Gateway',
    type: 'cloud',
    url: 'https://openrouter.ai/api/v1',
    status: 'connected',
    models: ['gpt-4o-mini', 'claude-3-5-haiku'],
    active: false,
    isExternal: true,
  },
];

export const INITIAL_EXPERTS: AnnotatorProgress[] = [
  {
    id: 'expert1',
    name: 'مهندس حسینی (کارشناس ارشد)',
    username: 'expert1',
    initial: 'ح',
    refCompleted: 78,
    refTotal: 100,
    revCompleted: 45,
    revTotal: 100,
    lastActive: 'همین الان (فعال)',
  },
  {
    id: 'expert2',
    name: 'دکتر مرادی (متخصص زبان‌شناسی داده)',
    username: 'expert2',
    initial: 'م',
    refCompleted: 92,
    refTotal: 100,
    revCompleted: 0,
    revTotal: 100,
    lastActive: '۲۵ دقیقه پیش',
  },
];

export const OPERATOR_WALKTHROUGH_STEPS = [
  {
    step: 1,
    title: 'تأیید ورود فایل و داده خام',
    desc: 'فایل اکسل یا CSV را بررسی کنید، ستون متن اصلی شکایت را تطبیق داده و داده‌های اولیه را تحویل بگیرید.',
    target: 'data:import',
  },
  {
    step: 2,
    title: 'بررسی قیف پالایش داده',
    desc: 'قواعد پالایش (تکراری، متون خالی، طول کمتر از ۵ کلمه) را چک کرده و از ریزش‌های غیرمعمول جلوگیری کنید.',
    target: 'data:clean',
  },
  {
    step: 3,
    title: 'نمونه‌گیری متقارن (مرجع و بازبینی)',
    desc: 'نمونه ۱۰۰ تایی برای برچسب‌زنی دوگانه کور و ۱۰۰ تایی برای بازبینی خروجی مدل استخراج می‌شود.',
    target: 'data:sample',
  },
  {
    step: 4,
    title: 'استخراج هوشمند برچسب با مدل زبانی',
    desc: 'مدل از میان ۳۰۰ متن نمونه، دلایل و شکایت‌ها را استخراج و برچسب‌های کاندیدا را پیشنهاد می‌دهد.',
    target: 'labels:extract',
  },
  {
    step: 5,
    title: 'تکمیل تاکسونومی و نمونه‌های راهنما',
    desc: 'تعاریف رسمی و کلیدهای میانبر ۱ تا ۸ را بررسی کرده و چند نمونه طلایی برای پرامپت آماده کنید.',
    target: 'labels:list',
  },
  {
    step: 6,
    title: 'اجرای دوگانه مدل (Run A & B)',
    desc: 'مدل تمام نمونه‌ها را در دو وضعیت مختلف برچسب می‌زند و مغایرت‌ها به عنوان رکوردهای مشکوک ثبت می‌شوند.',
    target: 'model:runs',
  },
  {
    step: 7,
    title: 'میز کار برچسب‌زنی کارشناس',
    desc: 'به‌عنوان اوپراتور یا کارشناس، متون را با استفاده از کلیدهای کیبورد ۱ تا ۸ و دکمه N با بالاترین سرعت برچسب بزنید.',
    target: 'expert:work',
  },
  {
    step: 8,
    title: 'حل مغایرت‌ها (Adjudication)',
    desc: 'مواردی که کارشناس ۱ و ۲ به برچسب یکسان نرسیده‌اند در این پنل به رای نهایی سرپرست گذاشته می‌شود.',
    target: 'expert:adj',
  },
  {
    step: 9,
    title: 'اعتبارسنجی واژه‌محور پایه',
    desc: 'روش پایه با تطبیق واژگانی اجرا می‌شود تا عملکرد پیشرفته مدل زبانی نسبت به روش ساده سنجیده شود.',
    target: 'keyword:dict',
  },
  {
    step: 10,
    title: 'ارزیابی آماری و جدول ۱ مقاله',
    desc: 'محاسبه شاخص توافق کاپا، سنجه F1 و استخراج جدول شکیل مقاله علمی با یک کلیک.',
    target: 'results:paper',
  },
  {
    step: 11,
    title: 'استخراج دیتاست طلایی برای فاین‌تیون',
    desc: 'مجموعه‌داده استاندارد پاک و برچسب‌خورده در فرمت JSONL/HuggingFace برای فاین‌تیون نهایی دانلود می‌شود.',
    target: 'results:export',
  },
];
