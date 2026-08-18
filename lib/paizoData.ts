export interface PaizoGame {
  id: string;
  slug: string;
  name: string;
  titleArabic: string;
  image: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  players: string;
  duration: string;
  materials: string;
  ageGroup?: string;
  rules: string[];
  steps: { number: string; title: string; desc: string }[];
  notes?: string;
}

export interface PaizoBibleStudy {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  description: string;
  firstStation: string;
  status: 'available' | 'coming_soon';
  pdfUrl?: string;
}

export interface PaizoWorkshop {
  id: string;
  title: string;
  icon: string;
  description: string;
  duration: string;
  targetAudience: string;
  requirements: string[];
  status: string;
}

export interface PaizoInfographic {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
}

export interface PaizoDesignRequest {
  id?: number;
  name: string;
  phone: string;
  requestType: string;
  eventName: string;
  description: string;
  targetDate: string;
  notes?: string;
  status?: string;
  createdAt?: string;
}

export const PAIZO_GAMES: PaizoGame[] = [
  {
    id: '1',
    slug: 'bible-mime',
    name: 'BIBLE MIME',
    titleArabic: 'لعبة بايبل مايم',
    image: '/paizo/games/bible-mime.png',
    category: 'ألعاب تمثيل وسرعة (Group & Mime)',
    shortDescription: 'كروت لشخصيات الكتاب المقدس مع صور ومعلومات عنها، تعتمد على التمثيل الجماعي والسرعة.',
    fullDescription:
      'لعبة BIBLE MIME هي لعبة من براند PAIZO. كل كارت موجود فيه شخصية من الكتاب المقدس وصورتة ومعلومات عنه كمان، اللعبة دي لازم فريقين علي الأقل يلعبوها علشان كده هي مميزه فيها لعب جماعي وفي نفس الوقت بتخلينا نتعرف علي شخصيات كتابية من كتابنا العظيم.',
    players: 'فريقين على الأقل (2 Teams Min)',
    duration: '20 - 30 دقيقة',
    materials: 'كروت لعبة BIBLE MIME الرسمية',
    ageGroup: 'كافة المراحل (إعدادي - ثانوي - شباب)',
    rules: [
      'يتكون السباق من فريقين متنافسين على الأقل.',
      'يقوم لاعب بسحب كارت وتمثيل الشخصية بدون النطق بأي كلمة.',
      'يحاول بقية الفريق تخمين اسم الشخصية بناءً على تلميحات التمثيل.',
      'يحصل الفريق على نقطة عن كل تخمين صحيح قبل انتهاء الوقت المحدد.',
    ],
    steps: [
      { number: '01', title: 'تجهيز اللعبة والفرق', desc: 'تقسيم المشاركين إلى فريقين متساويين وتجهيز كروت BIBLE MIME.' },
      { number: '02', title: 'سحب الكارت وبدء المؤقت', desc: 'يسحب اللاعب الأول كارت الشخصية المجهزة ويرى معلوماتها سرياً.' },
      { number: '03', title: 'تمثيل الشخصية صامتاً', desc: 'أداء حركات وإيماءات تعبر عن صفات أو أحداث الشخصية بدون كلام.' },
      { number: '04', title: 'احتساب النقاط وإعلان الفائز', desc: 'تجميع النقاط عند الإجابة الصحيحة والانتقال للفريق الآخر.' },
    ],
    notes: 'تمنح المخدومين حصيلة روحية ومعرفية غنية بشخصيات الكتاب المقدس بأسلوب ممتع غير تقليدي.',
  },
  {
    id: '2',
    slug: 'st-mime',
    name: 'S.T MIME',
    titleArabic: 'لعبة إس تي مايم',
    image: '/paizo/games/st-mime.png',
    category: 'ألعاب سير القديسين (Synaxarium Mime)',
    shortDescription: 'كروت لقديسي السنكسار الكنسي مع الصور والمعلومات الروحية، تعتمد على التحدي الجماعي.',
    fullDescription:
      'لعبة S.T MIME هي لعبة من براند PAIZO. كل كارت موجود فيه قديس من السنكسار وصورتة ومعلومات عنه كمان، اللعبة دي لازم فريقين علي الأقل يلعبوها علشان كده هي مميزه فيها لعب جماعي وفي نفس الوقت بتخلينا نتعرف علي قديسين في السنكسار أكتر.',
    players: 'فريقين على الأقل (2 Teams Min)',
    duration: '20 - 30 دقيقة',
    materials: 'كروت لعبة S.T MIME الرسمية',
    ageGroup: 'شباب وخدام واجتماعات كنسية',
    rules: [
      'يتنافس فريقان أو أكثر في جولات معرفية تفاعلية.',
      'يمثل المخدوم قديس السنكسار المكتوب بالكارت في صمت.',
      'يتعاون أعضاء الفريق لاكتشاف اسم القديس وتفاصيل سيرته العطرة.',
      'تُحسب الأهداف وفق السرعة والتخمين الدقيق.',
    ],
    steps: [
      { number: '01', title: 'تجهيز الكروت والفرق', desc: 'تشكيل مجموعات الخدمة وتوزيع الأدوار بين أعضاء الفريق.' },
      { number: '02', title: 'اختيار ممثل الجولة', desc: 'يقف الممثل أمام فريقه ويسحب كارت السنكسار.' },
      { number: '03', title: 'التمثيل التفاعلي صامتاً', desc: 'استخدام إشارات تمثل آلام أو معجزات أو رموز القديس.' },
      { number: '04', title: 'ربط السيرة واحتساب النقطة', desc: 'يذكر الفريق اسم القديس ومعلومة عنه لتأكيد الفوز.' },
    ],
    notes: 'تُعمّق رابطة الشباب بقديسي الكنيسة والسنكسار في إطار تنافسي مليء بالحماس.',
  },
  {
    id: '3',
    slug: 'tako',
    name: 'TAKO',
    titleArabic: 'لعبة تاكو',
    image: '/paizo/games/tako.png',
    category: 'ألعاب كروت وربط أحداث (Liturgical Matching)',
    shortDescription: 'كل 4 كروت مرتبطة ببعضها من الإنجيل أو الكتب الليتورجية لربط الأحداث والشخصيات.',
    fullDescription:
      'لعبة TAKO هي لعبة من براند PAIZO. اللعبة دي فيها كل أربع كروت مرتبطين ببعض، مأخوذة من الإنجيل او كتب الليتروجية، بتخلينا نعرف الأحداث والشخصيات ونربطها ببعض. عدد اللاعبين فيها من 4 إلي 10 لاعبين. لعبة مليانة مشاركة وتعليم وفرفشة.',
    players: '4 إلى 10 لاعبين (4 - 10 Players)',
    duration: '15 - 25 دقيقة',
    materials: 'مجموعة كروت تاكو (الرباعيات المتطابقة)',
    ageGroup: 'جمهور الشباب والمجموعات الصغيرة',
    rules: [
      'تلعب بمشاركة من 4 إلى 10 أفراد في نفس الوقت.',
      'تعتمد اللعبة على تجميع الرباعيات المتكاملة (4 كروت مترابطة).',
      'يربط اللاعبون بين آيات الإنجيل والنصوص الطقسية والشخصيات.',
      'الفائز هو أول من يستطيع تجميع المجموعات الرباعية الكاملة وصياغتها.',
    ],
    steps: [
      { number: '01', title: 'توزيع الكروت على المشاركين', desc: 'خلط مجموعة تاكو وتوزيع 4 كروت لكل لاعب.' },
      { number: '02', title: 'اكتشاف الروابط الكنسية', desc: 'تحليل العلاقة بين النصوص الطقسية والشخصيات والأحداث.' },
      { number: '03', title: 'تبادل الكروت التكتيكي', desc: 'تمرير الكروت لبناء المجموعة الرباعية المستهدفة.' },
      { number: '04', title: 'إكتمال المجموعة والفوز', desc: 'إعلان تجميع الرباعية وقراءتها بصوت مرتفع.' },
    ],
    notes: 'تجمع بين التعليم اللاهوتي الشيق والمرح التنافسي وتنشط الذاكرة الكنسية.',
  },
];

export const PAIZO_STUDIES: PaizoBibleStudy[] = [
  {
    id: '1',
    slug: 'exodus',
    title: 'سلسلة سفر الخروج "أكسودوس"',
    subtitle: 'دراسة سفر الخروج على محطات تفاعلية',
    image: '/paizo/studies/exodus.png',
    description:
      'أكسودوس سلسلة سفر الخروج معناها خروج والسلسلة دي بتدرس سفر الخروج علي محطات في شكل دراسة لكل محطة. أول محطة هي الضربات العشر ومتنساش تسأل علي هدايا الكميات وباقي المسابقات عند الطلب.',
    firstStation: 'الضربات العشر',
    status: 'available',
  },
  {
    id: '2',
    slug: 'leviticus',
    title: 'سلسلة سفر اللاويين "ليفيت"',
    subtitle: 'دراسة سفر اللاويين والطقوس الكنسية',
    image: '/paizo/studies/leviticus.png',
    description:
      'ليفيت السلسلة دي بتدرس سفر اللاويين علي محطات في شكل دراسة لكل محطة. أول محطة هي الذبائح الخمس ومتنساش تسأل علي هدايا الكميات وباقي المسابقات عند الطلب.',
    firstStation: 'الذبائح الخمس',
    status: 'available',
  },
  {
    id: '3',
    slug: 'pauls-journeys',
    title: 'سلسلة رحلات بولس الرسول',
    subtitle: 'خرائط وتتبع رحلات القديس بولس الكرازية',
    image: '/paizo/studies/pauls-journeys.png',
    description: 'سلسلة دراسية تفاعلية لتتبع مسار رحلات القديس بولس الرسول والتطبيقات الروحية للرسائل.',
    firstStation: 'المحطة الأولى (تحت الإعداد)',
    status: 'coming_soon',
  },
];

export const PAIZO_WORKSHOPS: PaizoWorkshop[] = [
  {
    id: '1',
    title: 'ورشة تصميم الألعاب الروحية للخدام',
    icon: 'fas fa-dice',
    description: 'كيفية ابتكار وتصميم لعبة تفاعلية تخدم الفكرة الروحية وتوصل المعنى للمخدوم ببساطة.',
    duration: '90 دقيقة',
    targetAudience: 'خدام الشباب وإعداد خدام',
    requirements: ['أوراق وأقلام', 'نماذج كروت PAIZO', 'مجموعات عمل 4-5 أفراد'],
    status: 'متاحة للتنفيذ في الاجتماعات',
  },
  {
    id: '2',
    title: 'ورشة تبسيط السنكسار والطقس بالإنفوجرافيك',
    icon: 'fas fa-paint-brush',
    description: 'تحويل المفاهيم الطقسية المعقدة إلى رسوم بصرية جذابة وسهلة التذكر.',
    duration: '120 دقيقة',
    targetAudience: 'خدام الأنشطة والوسائل الإيضاحية',
    requirements: ['أجهزة كمبيوتر/تابلت أو أدوات رسم', 'قوالب تصاميم جاهزة'],
    status: 'متاحة للطلب',
  },
];

export const PAIZO_INFOGRAPHICS: PaizoInfographic[] = [
  {
    id: '1',
    title: 'خريطة الضربات العشر في سفر الخروج',
    category: 'دراسات كتابية',
    imageUrl: '/paizo/studies/exodus.png',
    description: 'عرض بصري منظم للضربات العشر بالترتيب والدروس الروحية والرموز اللاهوتية لكل ضربة.',
  },
  {
    id: '2',
    title: 'الذبائح الخمس في سفر اللاويين ورسالتها',
    category: 'طقوس ورموز',
    imageUrl: '/paizo/studies/leviticus.png',
    description: 'إنفوجرافيك توضيحي لأنواع الذبائح الخمس ورمزيتها لخلاص السيد المسيح على الصليب.',
  },
  {
    id: '3',
    title: 'دليل شخصيات BIBLE MIME البارزة',
    category: 'ألعاب ومعرفة',
    imageUrl: '/paizo/games/bible-mime.png',
    description: 'ملخص بصري سريع لأبرز الشخصيات الكتابية وكيفية تقديمها تفاعلياً في الأنشطة.',
  },
];
