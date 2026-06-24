/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Restaurant, Table, MenuItem, MenuTheme, Order } from './types';

export const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'شاورما وجريل الشام',
    logo: '🥙',
    phone: '+966 50 123 4567',
    address: 'الرياض - حي الياسمين - طريق الملك عبدالعزيز',
    currency: 'SAR',
    taxRate: 0.15,
    serviceCharge: 5.00
  },
  {
    id: 'rest-2',
    name: 'برجر هافن | Burger Haven',
    logo: '🍔',
    phone: '+966 55 987 6543',
    address: 'جدة - طريق الكورنيش - مقابل الحمراء',
    currency: 'SAR',
    taxRate: 0.15,
    serviceCharge: 10.00
  },
  {
    id: 'rest-3',
    name: 'مطبخ البيت اليمني والريفي',
    logo: '🥘',
    phone: '+966 56 444 3322',
    address: 'الدمام - شارع عمر بن الخطاب',
    currency: 'SAR',
    taxRate: 0.15,
    serviceCharge: 0.00
  },
  {
    id: 'rest-4',
    name: 'أرومـا كافيه | Aroma Lounge',
    logo: '☕',
    phone: '+966 53 111 2222',
    address: 'الرياض - بوليفارد سيتي',
    currency: 'SAR',
    taxRate: 0.15,
    serviceCharge: 15.00
  }
];

export const INITIAL_TABLES: Table[] = [
  { id: 'tb-1', number: 'طاولة 1', capacity: 2, status: 'empty', qrCodeSeed: 'table-1-seed-992' },
  { id: 'tb-2', number: 'طاولة 2', capacity: 4, status: 'ordering', qrCodeSeed: 'table-2-seed-811' },
  { id: 'tb-3', number: 'طاولة 3 (VIP)', capacity: 6, status: 'waiting', qrCodeSeed: 'table-3-seed-104' },
  { id: 'tb-4', number: 'طاولة 4 (عائلية)', capacity: 8, status: 'eating', qrCodeSeed: 'table-4-seed-443' },
  { id: 'tb-5', number: 'طاولة 5 (خارجية)', capacity: 2, status: 'dirty', qrCodeSeed: 'table-5-seed-729' },
  { id: 'tb-6', number: 'طاولة 6', capacity: 4, status: 'empty', qrCodeSeed: 'table-6-seed-331' }
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // Restaurant 1: Shawarma & Grill
  {
    id: 'item-101',
    nameAr: 'شاورما دجاج سوبر جامبو',
    nameEn: 'Super Jumbo Chicken Shawarma',
    price: 18.00,
    category: 'Saj & Wraps',
    image: '🥙',
    descriptionAr: 'شاورما دجاج متبلة بالخلطة الشامية الخاصة داخل خبز الصاج الطازج مع الثومية والبطاطس والمخلل.',
    descriptionEn: 'Shami marinated chicken shawarma in fresh saj bread with garlic paste, fries, and pickles.',
    available: true,
    isPopular: true
  },
  {
    id: 'item-102',
    nameAr: 'صحن شاورما لحم عربي',
    nameEn: 'Arabic Beef Shawarma Platter',
    price: 32.00,
    category: 'Platters',
    image: '🍱',
    descriptionAr: 'قطع شاورما لحم بلدي بخبز صاج مقطع، تقدم مع بطاطس مقلية، طراطور ومخلل مشكل.',
    descriptionEn: 'Local beef shawarma pieces in saj bread, served with fries, tarator sauce, and pickles.',
    available: true,
    isPopular: true
  },
  {
    id: 'item-103',
    nameAr: 'كباب لحم دبل مشوي',
    nameEn: 'Double Grilled Meat Kabab',
    price: 45.00,
    category: 'Grills',
    image: '🍢',
    descriptionAr: 'سيخان من اللحم المفروم المتبل بالبقدونس والبصل مشوي على الفحم مع حمص ومقبلات.',
    descriptionEn: 'Two skewers of minced beef seasoned with parsley, grilled on charcoal, served with hummus.',
    available: true,
    isPopular: false
  },
  {
    id: 'item-104',
    nameAr: 'سلطة فتوش بدبس الرمان',
    nameEn: 'Fattoush Salad with Pomegranate',
    price: 15.00,
    category: 'Appetizers',
    image: '🥗',
    descriptionAr: 'مزيج من الخضار الطازجة مع الخبز المحمص ودبس الرمان التركي الفاخر وزيت الزيتون.',
    descriptionEn: 'Fresh mixed greens with toasted bread, pomegranate molasses, and virgin olive oil.',
    available: true,
    isPopular: false
  },
  {
    id: 'item-105',
    nameAr: 'كوكا كولا بارد',
    nameEn: 'Coca Cola Cold',
    price: 5.00,
    category: 'Drinks',
    image: '🥤',
    descriptionAr: 'مشروب غازي مثلج ومنعش.',
    descriptionEn: 'Refreshing chilled carbonated beverage.',
    available: true,
    isPopular: false
  },

  // Restaurant 2: Burger Haven
  {
    id: 'item-201',
    nameAr: 'برجر ترافل كلاسيك دبل',
    nameEn: 'Double Classic Truffle Burger',
    price: 38.00,
    category: 'Burgers',
    image: '🍔',
    descriptionAr: 'شريحتان من لحم الأنجوس الفاخر مع جبنة تشيدر سائلة وصوص الترافل البري المميز.',
    descriptionEn: 'Two premium Angus beef patties with melted cheddar cheese and wild truffle signature sauce.',
    available: true,
    isPopular: true
  },
  {
    id: 'item-202',
    nameAr: 'برجر الدجاج المقرمش الحار',
    nameEn: 'Spicy Crispy Chicken Burger',
    price: 29.00,
    category: 'Burgers',
    image: '🍗',
    descriptionAr: 'صدر دجاج مقرمش ومتبل بخلطة حارة، خس أمريكي، هالبينو وصوص المايونيز الحار.',
    descriptionEn: 'Crispy fried chicken breast in hot seasoning, lettuce, jalapenos, and spicy mayo.',
    available: true,
    isPopular: true
  },
  {
    id: 'item-203',
    nameAr: 'بطاطس هافن بالجبنة واللحم',
    nameEn: 'Haven Loaded Cheese Fries',
    price: 22.00,
    category: 'Appetizers',
    image: '🍟',
    descriptionAr: 'بطاطس مقرمشة مغطاة بجبنة شيدر الذائبة، قطع لحم مقدد وصوص هافن السري.',
    descriptionEn: 'Crispy fries loaded with melted cheddar cheese, bacon bits, and signature secret sauce.',
    available: true,
    isPopular: false
  },
  {
    id: 'item-204',
    nameAr: 'مولتن تشوكلت كيك',
    nameEn: 'Molten Chocolate Cake',
    price: 24.00,
    category: 'Desserts',
    image: '🍰',
    descriptionAr: 'كيك الشوكولاتة الغني بقلب دافئ ذائب يقدم مع مغرفة من آيس كريم الفانيلا الفاخر.',
    descriptionEn: 'Warm chocolate cake with lava core, served with a scoop of premium vanilla ice cream.',
    available: true,
    isPopular: true
  }
];

export const THEMES_LIST: MenuTheme[] = [
  {
    id: 'theme-sunset',
    nameAr: 'غروب البيسترو 🌅',
    nameEn: 'Sunset Bistro',
    primary: '#f97316',
    secondary: '#ffedd5',
    accent: '#ea580c',
    gradientFrom: 'from-orange-500/20',
    gradientTo: 'to-amber-500/10',
    bgClass: 'bg-gradient-to-br from-orange-50/40 to-amber-50/30 dark:from-zinc-950 dark:to-zinc-900',
    cardClass: 'border-orange-100 dark:border-orange-950/40',
    fontClass: 'font-display',
    badgeClass: 'bg-orange-500 text-white shadow-orange-500/20'
  },
  {
    id: 'theme-royal',
    nameAr: 'العنبر الملكي 👑',
    nameEn: 'Royal Amber',
    primary: '#d97706',
    secondary: '#fef3c7',
    accent: '#b45309',
    gradientFrom: 'from-amber-500/20',
    gradientTo: 'to-yellow-500/10',
    bgClass: 'bg-gradient-to-br from-amber-50/40 to-yellow-50/20 dark:from-zinc-950 dark:to-zinc-900',
    cardClass: 'border-amber-100 dark:border-amber-950/40',
    fontClass: 'font-sans',
    badgeClass: 'bg-amber-500 text-white shadow-amber-500/20'
  },
  {
    id: 'theme-mint',
    nameAr: 'النعناع المنعش 🌿',
    nameEn: 'Minty Fresh',
    primary: '#10b981',
    secondary: '#d1fae5',
    accent: '#047857',
    gradientFrom: 'from-emerald-500/20',
    gradientTo: 'to-teal-500/10',
    bgClass: 'bg-gradient-to-br from-emerald-50/40 to-teal-50/20 dark:from-zinc-950 dark:to-zinc-900',
    cardClass: 'border-emerald-100 dark:border-emerald-950/40',
    fontClass: 'font-sans',
    badgeClass: 'bg-emerald-500 text-white shadow-emerald-500/20'
  },
  {
    id: 'theme-cyber',
    nameAr: 'مطعم السايبر 👾',
    nameEn: 'Cyber Diner',
    primary: '#a855f7',
    secondary: '#f3e8ff',
    accent: '#7e22ce',
    gradientFrom: 'from-purple-500/20',
    gradientTo: 'to-fuchsia-500/10',
    bgClass: 'bg-gradient-to-br from-purple-50/40 to-fuchsia-50/20 dark:from-zinc-950 dark:to-zinc-900',
    cardClass: 'border-purple-100 dark:border-purple-950/40',
    fontClass: 'font-mono',
    badgeClass: 'bg-purple-500 text-white shadow-purple-500/20'
  },
  {
    id: 'theme-espresso',
    nameAr: 'القهوة الذهبية ☕',
    nameEn: 'Espresso Gold',
    primary: '#854d0e',
    secondary: '#fef9c3',
    accent: '#713f12',
    gradientFrom: 'from-yellow-700/20',
    gradientTo: 'to-amber-900/10',
    bgClass: 'bg-gradient-to-br from-yellow-50/40 to-amber-100/10 dark:from-zinc-950 dark:to-zinc-900',
    cardClass: 'border-yellow-200 dark:border-yellow-950/40',
    fontClass: 'font-display',
    badgeClass: 'bg-yellow-800 text-white shadow-yellow-800/20'
  },
  {
    id: 'theme-lavender',
    nameAr: 'صالون اللافندر 🪻',
    nameEn: 'Lavender Lounge',
    primary: '#8b5cf6',
    secondary: '#ede9fe',
    accent: '#6d28d9',
    gradientFrom: 'from-violet-500/20',
    gradientTo: 'to-purple-500/10',
    bgClass: 'bg-gradient-to-br from-violet-50/40 to-indigo-50/20 dark:from-zinc-950 dark:to-zinc-900',
    cardClass: 'border-violet-100 dark:border-violet-950/40',
    fontClass: 'font-sans',
    badgeClass: 'bg-violet-500 text-white shadow-violet-500/20'
  },
  {
    id: 'theme-crimson',
    nameAr: 'ستيك هاوس القرمزي 🥩',
    nameEn: 'Crimson Steakhouse',
    primary: '#dc2626',
    secondary: '#fee2e2',
    accent: '#991b1b',
    gradientFrom: 'from-red-500/20',
    gradientTo: 'to-rose-500/10',
    bgClass: 'bg-gradient-to-br from-red-50/40 to-rose-50/20 dark:from-zinc-950 dark:to-zinc-900',
    cardClass: 'border-red-100 dark:border-red-950/40',
    fontClass: 'font-display',
    badgeClass: 'bg-red-600 text-white shadow-red-600/20'
  },
  {
    id: 'theme-ocean',
    nameAr: 'نسيم المحيط 🌊',
    nameEn: 'Ocean Breeze',
    primary: '#0ea5e9',
    secondary: '#e0f2fe',
    accent: '#0369a1',
    gradientFrom: 'from-sky-500/20',
    gradientTo: 'to-blue-500/10',
    bgClass: 'bg-gradient-to-br from-sky-50/40 to-blue-50/20 dark:from-zinc-950 dark:to-zinc-900',
    cardClass: 'border-sky-100 dark:border-sky-950/40',
    fontClass: 'font-sans',
    badgeClass: 'bg-sky-500 text-white shadow-sky-500/20'
  },
  {
    id: 'theme-forest',
    nameAr: 'الغابة الريفية 🌲',
    nameEn: 'Forest Rustic',
    primary: '#15803d',
    secondary: '#dcfce7',
    accent: '#166534',
    gradientFrom: 'from-green-600/20',
    gradientTo: 'to-stone-600/10',
    bgClass: 'bg-gradient-to-br from-green-50/40 to-stone-100/20 dark:from-zinc-950 dark:to-zinc-900',
    cardClass: 'border-green-100 dark:border-green-950/40',
    fontClass: 'font-sans',
    badgeClass: 'bg-green-700 text-white shadow-green-700/20'
  },
  {
    id: 'theme-sakura',
    nameAr: 'زهر الساكورا 🌸',
    nameEn: 'Sakura Bloom',
    primary: '#ec4899',
    secondary: '#fce7f3',
    accent: '#be185d',
    gradientFrom: 'from-pink-500/20',
    gradientTo: 'to-rose-500/10',
    bgClass: 'bg-gradient-to-br from-pink-50/40 to-rose-50/20 dark:from-zinc-950 dark:to-zinc-900',
    cardClass: 'border-pink-100 dark:border-pink-950/40',
    fontClass: 'font-sans',
    badgeClass: 'bg-pink-500 text-white shadow-pink-500/20'
  },
  {
    id: 'theme-citrus',
    nameAr: 'عصير الحمضيات 🍋',
    nameEn: 'Citrus Punch',
    primary: '#eab308',
    secondary: '#fef9c3',
    accent: '#ca8a04',
    gradientFrom: 'from-yellow-500/20',
    gradientTo: 'to-orange-500/10',
    bgClass: 'bg-gradient-to-br from-yellow-50/40 to-orange-50/20 dark:from-zinc-950 dark:to-zinc-900',
    cardClass: 'border-yellow-100 dark:border-yellow-950/40',
    fontClass: 'font-display',
    badgeClass: 'bg-yellow-500 text-white shadow-yellow-500/20'
  },
  {
    id: 'theme-slate',
    nameAr: 'الحد الأدنى الرمادي 🔳',
    nameEn: 'Slate Minimal',
    primary: '#4b5563',
    secondary: '#f3f4f6',
    accent: '#1f2937',
    gradientFrom: 'from-slate-500/20',
    gradientTo: 'to-zinc-500/10',
    bgClass: 'bg-gradient-to-br from-slate-50/40 to-zinc-100/20 dark:from-zinc-950 dark:to-zinc-900',
    cardClass: 'border-slate-200 dark:border-slate-800/40',
    fontClass: 'font-mono',
    badgeClass: 'bg-slate-600 text-white shadow-slate-600/20'
  },
  {
    id: 'theme-goldleaf',
    nameAr: 'الورقة الذهبية 🍃',
    nameEn: 'Gold Leaf',
    primary: '#065f46',
    secondary: '#ecfdf5',
    accent: '#0f766e',
    gradientFrom: 'from-teal-800/20',
    gradientTo: 'to-amber-500/10',
    bgClass: 'bg-gradient-to-br from-teal-50/40 to-amber-50/10 dark:from-zinc-950 dark:to-zinc-900',
    cardClass: 'border-teal-100 dark:border-teal-950/40',
    fontClass: 'font-display',
    badgeClass: 'bg-teal-800 text-white shadow-teal-800/20'
  },
  {
    id: 'theme-velvet',
    nameAr: 'الورد المخملي 🌹',
    nameEn: 'Velvet Rose',
    primary: '#d01c60',
    secondary: '#fdf2f8',
    accent: '#9d174d',
    gradientFrom: 'from-pink-600/20',
    gradientTo: 'to-fuchsia-700/10',
    bgClass: 'bg-gradient-to-br from-pink-50/40 to-fuchsia-50/20 dark:from-zinc-950 dark:to-zinc-900',
    cardClass: 'border-pink-200 dark:border-pink-950/40',
    fontClass: 'font-sans',
    badgeClass: 'bg-pink-700 text-white shadow-pink-700/20'
  },
  {
    id: 'theme-midnight',
    nameAr: 'كافيه منتصف الليل 🌙',
    nameEn: 'Midnight Cafe',
    primary: '#111827',
    secondary: '#374151',
    accent: '#f59e0b',
    gradientFrom: 'from-zinc-900/40',
    gradientTo: 'to-slate-800/20',
    bgClass: 'bg-gradient-to-br from-zinc-900 to-slate-950 text-white',
    cardClass: 'border-zinc-800/80',
    fontClass: 'font-mono',
    badgeClass: 'bg-amber-500 text-zinc-950 shadow-amber-500/20'
  },
  {
    id: 'theme-vintage',
    nameAr: 'الشاي العتيق 🫖',
    nameEn: 'Vintage Tea',
    primary: '#854d0e',
    secondary: '#fef3c7',
    accent: '#78350f',
    gradientFrom: 'from-stone-200/40',
    gradientTo: 'to-amber-100/30',
    bgClass: 'bg-gradient-to-br from-stone-100 to-amber-50/40 dark:from-zinc-950 dark:to-zinc-900',
    cardClass: 'border-amber-200 dark:border-amber-950/40',
    fontClass: 'font-sans',
    badgeClass: 'bg-amber-700 text-white shadow-amber-700/20'
  },
  {
    id: 'theme-plum',
    nameAr: 'قصر البرقوق 🍇',
    nameEn: 'Plum Palace',
    primary: '#581c87',
    secondary: '#fae8ff',
    accent: '#4a044e',
    gradientFrom: 'from-purple-800/20',
    gradientTo: 'to-fuchsia-950/10',
    bgClass: 'bg-gradient-to-br from-purple-50/40 to-fuchsia-50/20 dark:from-zinc-950 dark:to-zinc-900',
    cardClass: 'border-purple-200 dark:border-purple-950/40',
    fontClass: 'font-display',
    badgeClass: 'bg-purple-800 text-white shadow-purple-800/20'
  },
  {
    id: 'theme-desert',
    nameAr: 'رمال الصحراء 🏜️',
    nameEn: 'Desert Sand',
    primary: '#c2410c',
    secondary: '#fffff0',
    accent: '#9a3412',
    gradientFrom: 'from-orange-700/20',
    gradientTo: 'to-stone-300/20',
    bgClass: 'bg-gradient-to-br from-amber-50 to-orange-50/30 dark:from-zinc-950 dark:to-zinc-900',
    cardClass: 'border-orange-200 dark:border-orange-950/40',
    fontClass: 'font-sans',
    badgeClass: 'bg-orange-700 text-white shadow-orange-700/20'
  },
  {
    id: 'theme-electric',
    nameAr: 'الأزرق الكهربائي ⚡',
    nameEn: 'Electric Blue',
    primary: '#2563eb',
    secondary: '#dbeafe',
    accent: '#1d4ed8',
    gradientFrom: 'from-blue-600/20',
    gradientTo: 'to-indigo-500/10',
    bgClass: 'bg-gradient-to-br from-blue-50/40 to-indigo-50/20 dark:from-zinc-950 dark:to-zinc-900',
    cardClass: 'border-blue-100 dark:border-blue-950/40',
    fontClass: 'font-sans',
    badgeClass: 'bg-blue-600 text-white shadow-blue-600/20'
  },
  {
    id: 'theme-charcoal',
    nameAr: 'شواية الفحم 🔥',
    nameEn: 'Charcoal Grill',
    primary: '#1e293b',
    secondary: '#f1f5f9',
    accent: '#ea580c',
    gradientFrom: 'from-slate-700/20',
    gradientTo: 'to-orange-500/10',
    bgClass: 'bg-gradient-to-br from-slate-100 to-orange-50/10 dark:from-zinc-950 dark:to-zinc-900',
    cardClass: 'border-slate-300 dark:border-slate-800/40',
    fontClass: 'font-display',
    badgeClass: 'bg-slate-800 text-white shadow-slate-800/20'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'order-1',
    tableId: 'tb-2',
    restaurantId: 'rest-1',
    items: [
      { id: 'oi-1', menuItemId: 'item-101', quantity: 2, priceAtOrder: 18.00, notes: 'بدون بصل وبدون ثوم زيادة' },
      { id: 'oi-2', menuItemId: 'item-105', quantity: 2, priceAtOrder: 5.00 }
    ],
    subtotal: 46.00,
    tax: 6.90,
    service: 5.00,
    total: 57.90,
    status: 'preparing',
    createdAt: new Date(Date.now() - 30 * 60000).toISOString() // 30 mins ago
  },
  {
    id: 'order-2',
    tableId: 'tb-3',
    restaurantId: 'rest-1',
    items: [
      { id: 'oi-3', menuItemId: 'item-102', quantity: 1, priceAtOrder: 32.00, notes: 'مخلل إضافي' },
      { id: 'oi-4', menuItemId: 'item-104', quantity: 1, priceAtOrder: 15.00 },
      { id: 'oi-5', menuItemId: 'item-105', quantity: 1, priceAtOrder: 5.00 }
    ],
    subtotal: 52.00,
    tax: 7.80,
    service: 5.00,
    total: 64.80,
    status: 'pending',
    createdAt: new Date(Date.now() - 5 * 60000).toISOString() // 5 mins ago
  },
  {
    id: 'order-3',
    tableId: 'tb-4',
    restaurantId: 'rest-2',
    items: [
      { id: 'oi-6', menuItemId: 'item-201', quantity: 2, priceAtOrder: 38.00, notes: 'الجبنة واللحمة مستوية جداً' },
      { id: 'oi-7', menuItemId: 'item-203', quantity: 1, priceAtOrder: 22.00 },
      { id: 'oi-8', menuItemId: 'item-204', quantity: 1, priceAtOrder: 24.00 }
    ],
    subtotal: 122.00,
    tax: 18.30,
    service: 10.00,
    total: 150.30,
    status: 'served',
    createdAt: new Date(Date.now() - 75 * 60000).toISOString() // 1h 15m ago
  }
];

export const TRANSLATIONS = {
  ar: {
    appName: 'كييو آر منيو | QR Menu',
    tagline: 'إدارة متكاملة وشاملة للمطاعم والبارات مع تتبع لحظي للطلبات، وطباعة الفواتير، والـ 20 ثيم المذهلة للزبائن.',
    statusConnected: 'النظام نشط',
    searchPlaceholder: 'البحث عن طلبات، أطعمة، طاولات...',
    battery: 'البطارية',
    back: 'رجوع',
    save: 'حفظ التعديلات',
    add: 'إضافة جديدة',
    delete: 'حذف',
    edit: 'تعديل',
    cancel: 'إلغاء',
    actions: 'الإجراءات',
    filterAll: 'جميع الأقسام',
    category: 'القسم الرئيسي',
    amount: 'المبلغ الإجمالي',
    date: 'التاريخ والوقت',
    status: 'حالة الطلب',
    none: 'لا يوجد',
    currency: 'ريال',
    addSuccess: 'تم الإضافة بنجاح',
    deleteSuccess: 'تم الحذف بنجاح',
    updateSuccess: 'تم التحديث بنجاح',
    printReceipt: 'طباعة الفاتورة 📄',
    language: 'لغة الواجهة (Language)',
    theme: 'مظهر لوحة التحكم (Theme)',

    // Tabs
    tabDashboard: 'نظرة عامة',
    tabTables: 'إدارة الطاولات 🪑',
    tabMenu: 'إدارة الأطعمة 🍔',
    tabOrders: 'شاشة المطبخ 🧑‍🍳',
    tabThemes: 'لوحة الثيمات (20) 🎨',
    tabReports: 'تقارير المبيعات 📈',
    tabSettings: 'إعدادات المطعم ⚙️',
    tabSimulator: 'محاكي الزبون 📱',

    // Dashboard
    totalSales: 'إجمالي المبيعات',
    activeTablesCount: 'الطاولات النشطة',
    pendingOrdersCount: 'الطلبات المعلقة',
    completedOrdersCount: 'الطلبات المكتملة',
    bestseller: 'الأطباق الأكثر مبيعاً',
    liveFeed: 'مراقبة المطبخ والطلبات النشطة',
    successRate: 'معدل الإنجاز',
    avgOrderValue: 'متوسط قيمة الطلب',

    // Tables
    tablesTitle: 'هيكل الطاولات والرموز التفاعلية (QR Codes)',
    tablesDesc: 'أضف طاولات المطعم وحدد طاقتها الاستيعابية، وولد رموز QR مخصصة لكل طاولة لتمكين الزبائن من الطلب المباشر.',
    addTable: 'إضافة طاولة جديدة',
    tableName: 'اسم/رقم الطاولة',
    tableCapacity: 'القدرة الاستيعابية (أفراد)',
    scanToSimulate: 'معاينة ومحاكاة مسح QR',
    statusEmpty: 'فارغة',
    statusOrdering: 'تتصفح المنيو',
    statusWaiting: 'بانتظار الطعام',
    statusEating: 'تناول الطعام',
    statusDirty: 'بحاجة لتنظيف',

    // Menu Management
    menuTitle: 'إدارة قائمة الطعام والوجبات',
    menuDesc: 'صمم قائمتك الفاخرة، أضف الأطباق والأسعار والصور، وحدد الوجبات الشائعة لجذب انتباه زبائنك.',
    addMenuItem: 'إضافة طبق جديد للوجبات',
    foodNameAr: 'الاسم باللغة العربية',
    foodNameEn: 'الاسم باللغة الإنجليزية',
    foodPrice: 'سعر الطبق',
    foodDescAr: 'الوصف بالعربية',
    foodDescEn: 'الوصف بالإنجليزية',
    foodCategory: 'تصنيف الوجبة',
    isPopular: 'طبق مميز / الأكثر طلباً',
    isAvailable: 'متوفر للطلب حالياً',

    // Kitchen & Orders
    ordersTitle: 'شاشة تحضير وتتبع الطلبات اللحظية',
    ordersDesc: 'تتبع طلبات الطاولات من خلال شاشة مطبخ متكاملة، حدث حالة التحضير بضغطة زر واحدة لتصل لزبونك مباشرة.',
    orderNo: 'طلب رقم',
    table: 'طاولة',
    orderStatusPending: 'قيد الانتظار',
    orderStatusPreparing: 'يتم التحضير حالياً',
    orderStatusReady: 'جاهز للتسليم',
    orderStatusServed: 'تم التقديم للزبون',
    orderStatusPaid: 'تم الدفع والإنهاء',
    totalAmount: 'الإجمالي مع الضريبة',
    subtotal: 'المجموع الفرعي',
    tax: 'ضريبة القيمة المضافة (15%)',
    service: 'رسوم الخدمة والمقاعد',

    // Themes
    themesTitle: 'معرض الثيمات الفاخرة للزبائن (20 ثيم)',
    themesDesc: 'اختر المظهر البصري الذي يناسب هوية مطعمك. سيتم تطبيق الألوان والتصميم فوراً على شاشة طلب الزبون والرمز التفاعلي.',
    activeTheme: 'الثيم المطبق حالياً',
    previewTheme: 'معاينة الثيم',

    // Simulator
    simTitle: 'محاكي جوال الزبون (مسح QR والطلب)',
    simDesc: 'هذه الشاشة تمثل واجهة الجوال الحقيقية التي تظهر للزبون عند مسحه رمز QR الخاص بطاولته. جرب الطلب اللحظي وتتبع تدفق المطبخ!',
    addToCart: 'إضافة للسلة',
    viewCart: 'عرض سلة المأكولات',
    cartEmpty: 'السلة فارغة حالياً. تصفح المنيو وأضف بعض الأطباق اللذيذة!',
    checkout: 'إرسال الطلب للمطبخ 🚀',
    orderSent: 'تم إرسال طلبك بنجاح! طاقم الضيافة يعمل حالياً على تحضيره.',
    welcomeTo: 'مرحباً بك في',
    orderNotes: 'أي ملاحظات خاصة؟ (مثل: بدون فلفل، بدون بصل)',

    // Reports & Analytics
    reportsTitle: 'التقارير التحليلية والذكاء المالي للمبيعات',
    reportsDesc: 'احصائيات ومخططات بيانية لنسب المبيعات وتوزيع الوجبات ومتابعة أداء المطعم المالي.',
    salesByCategory: 'المبيعات حسب تصنيف الطعام',
    revenueTrend: 'رسم بياني لنمو الإيرادات اليومية',
    bestsellersList: 'جدول الأطباق الأكثر ربحية ومبيعاً',

    // Settings
    settingsTitle: 'إعدادات المطعم العامة والتراخيص',
    settingsDesc: 'تحكم في الاسم التجاري، شعار المطعم، معلومات الاتصال، وقيم الضرائب والخدمة المضافة على الفواتير.',
    restaurantName: 'اسم المنشأة/المطعم',
    restaurantPhone: 'هاتف التواصل',
    restaurantAddress: 'العنوان الجغرافي للمطعم',
    taxRateInput: 'نسبة ضريبة القيمة المضافة (%)',
    serviceChargeInput: 'رسوم الخدمة الثابتة (ريال)',
    currencyInput: 'العملة الافتراضية',
    resetDefaultData: 'إعادة تهيئة المطعم بالكامل للمصنع',
    resetSuccess: 'تم إعادة التهيئة للبيانات الافتراضية بنجاح'
  },
  en: {
    appName: 'QR Menu System',
    tagline: 'Comprehensive restaurant & lounge dashboard with live order tracking, receipt printing, and 20 dynamic themes.',
    statusConnected: 'System Active',
    searchPlaceholder: 'Search orders, items, tables...',
    battery: 'Battery',
    back: 'Back',
    save: 'Save Changes',
    add: 'Add New',
    delete: 'Delete',
    edit: 'Edit',
    cancel: 'Cancel',
    actions: 'Actions',
    filterAll: 'All Categories',
    category: 'Category',
    amount: 'Total Amount',
    date: 'Date & Time',
    status: 'Order Status',
    none: 'None',
    currency: 'SAR',
    addSuccess: 'Added successfully',
    deleteSuccess: 'Deleted successfully',
    updateSuccess: 'Updated successfully',
    printReceipt: 'Print Invoice 📄',
    language: 'Language',
    theme: 'Dashboard Theme',

    // Tabs
    tabDashboard: 'Overview',
    tabTables: 'Tables 🪑',
    tabMenu: 'Menu Items 🍔',
    tabOrders: 'Kitchen Board 🧑‍🍳',
    tabThemes: '20 Themes Panel 🎨',
    tabReports: 'Sales Reports 📈',
    tabSettings: 'Settings ⚙️',
    tabSimulator: 'Simulator 📱',

    // Dashboard
    totalSales: 'Total Revenue',
    activeTablesCount: 'Active Tables',
    pendingOrdersCount: 'Pending Orders',
    completedOrdersCount: 'Completed Orders',
    bestseller: 'Bestselling Dish',
    liveFeed: 'Live Kitchen Monitor & Feed',
    successRate: 'Completion Rate',
    avgOrderValue: 'Avg Order Value',

    // Tables
    tablesTitle: 'Table Setup & Live QR Code Generator',
    tablesDesc: 'Set up restaurant tables, layout capacity, and generate dynamic QR codes to let guests order directly from their mobile phones.',
    addTable: 'Add New Table',
    tableName: 'Table Name/No.',
    tableCapacity: 'Capacity (Pax)',
    scanToSimulate: 'Simulate Customer Scan',
    statusEmpty: 'Empty',
    statusOrdering: 'Browsing Menu',
    statusWaiting: 'Waiting for Food',
    statusEating: 'Eating',
    statusDirty: 'Needs Cleaning',

    // Menu Management
    menuTitle: 'Menu & Category Management',
    menuDesc: 'Design your fine dining menu. Add items, set prices, upload visual cues, and mark popular signature meals.',
    addMenuItem: 'Add New Food Item',
    foodNameAr: 'Arabic Food Name',
    foodNameEn: 'English Food Name',
    foodPrice: 'Price',
    foodDescAr: 'Arabic Description',
    foodDescEn: 'English Description',
    foodCategory: 'Category Group',
    isPopular: 'Popular / Signature Dish',
    isAvailable: 'Currently Available to Order',

    // Kitchen & Orders
    ordersTitle: 'Kitchen Screen & Real-time Tracking',
    ordersDesc: 'Monitor guest orders through a collaborative kitchen panel. Update meal prep statuses in one single click.',
    orderNo: 'Order #',
    table: 'Table',
    orderStatusPending: 'Pending',
    orderStatusPreparing: 'Preparing',
    orderStatusReady: 'Ready to Serve',
    orderStatusServed: 'Served',
    orderStatusPaid: 'Paid & Completed',
    totalAmount: 'Total with Tax',
    subtotal: 'Subtotal',
    tax: 'VAT (15%)',
    service: 'Service Charge',

    // Themes
    themesTitle: 'Premium Theme Customizer (20 Choices)',
    themesDesc: 'Select the visual palette that matches your brand guidelines. Colors and font choices immediately apply to client screens.',
    activeTheme: 'Active Theme',
    previewTheme: 'Preview Theme',

    // Simulator
    simTitle: 'Mobile Screen Scan Simulator',
    simDesc: 'This viewport represents what guests see on their mobile browser when scanning the QR code on Table.',
    addToCart: 'Add to Cart',
    viewCart: 'View Cart Basket',
    cartEmpty: 'Your basket is empty. Browse the menu and add delicious food!',
    checkout: 'Send Order to Kitchen 🚀',
    orderSent: 'Your order was sent! Our chef is preparing your fresh meal.',
    welcomeTo: 'Welcome to',
    orderNotes: 'Any special instructions? (e.g., no onion, extra cheese)',

    // Reports & Analytics
    reportsTitle: 'Analytical Sales Business Intelligence',
    reportsDesc: 'Review deep restaurant metrics, category breakdowns, daily trends, and overall profitability matrices.',
    salesByCategory: 'Sales Revenue by Food Category',
    revenueTrend: 'Daily Revenue Trends',
    bestsellersList: 'Bestselling & Most Profitable Dishes',

    // Settings
    settingsTitle: 'Restaurant Profile & Setup',
    settingsDesc: 'Configure trade name, customer support, currency preferences, tax structure, and service charge additions.',
    restaurantName: 'Restaurant Brand Name',
    restaurantPhone: 'Contact Number',
    restaurantAddress: 'Physical Location Address',
    taxRateInput: 'VAT Rate (%)',
    serviceChargeInput: 'Flat Service Fee (SAR)',
    currencyInput: 'Default Currency',
    resetDefaultData: 'Wipe All & Reset Factory Defaults',
    resetSuccess: 'Database restored to initial seeds successfully.'
  }
};
