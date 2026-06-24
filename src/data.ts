/**
 * QR Menu & Table System - Iraqi Edition 🇮🇶
 * بيانات عراقية حقيقية - دينار عراقي - مدن ومطاعم عراقية
 */
import { Restaurant, Table, MenuItem, MenuTheme, Order } from './types';

// ── المطاعم العراقية ────────────────────────────────────────
export const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'مطعم القصر العراقي',
    logo: '🏰',
    phone: '+964 780 123 4567',
    address: 'شارع المتنبي - قرب ساحة التحرير',
    city: 'بغداد',
    currency: 'د.ع',
    taxRate: 0.10,
    serviceCharge: 3000
  },
  {
    id: 'rest-2',
    name: 'مشاوي البصرة',
    logo: '🥩',
    phone: '+964 781 987 6543',
    address: 'شارع الكورنيش - مقابل فندق البصرة',
    city: 'البصرة',
    currency: 'د.ع',
    taxRate: 0.10,
    serviceCharge: 2000
  },
  {
    id: 'rest-3',
    name: 'قهوة أربيل التراثية',
    logo: '☕',
    phone: '+964 750 444 3322',
    address: 'شارع القلعة - سوق القيصري',
    city: 'أربيل',
    currency: 'د.ع',
    taxRate: 0.10,
    serviceCharge: 5000
  }
];

// ── الطاولات ────────────────────────────────────────────────
export const INITIAL_TABLES: Table[] = [
  { id: 'tb-1', number: 'طاولة 1', capacity: 2, status: 'empty', qrCodeSeed: 'table-1-seed-992' },
  { id: 'tb-2', number: 'طاولة 2', capacity: 4, status: 'ordering', qrCodeSeed: 'table-2-seed-811' },
  { id: 'tb-3', number: 'طاولة VIP', capacity: 6, status: 'empty', qrCodeSeed: 'table-3-seed-104' },
  { id: 'tb-4', number: 'طاولة عائلية', capacity: 8, status: 'eating', qrCodeSeed: 'table-4-seed-443' },
  { id: 'tb-5', number: 'طاولة خارجية', capacity: 4, status: 'empty', qrCodeSeed: 'table-5-seed-729' },
  { id: 'tb-6', number: 'طاولة 6', capacity: 4, status: 'empty', qrCodeSeed: 'table-6-seed-331' }
];

// ── قائمة الطعام العراقية ───────────────────────────────────
export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // مطعم القصر العراقي - بغداد
  { id: 'item-101', nameAr: 'كباب عراقي على الفحم', nameEn: 'Iraqi Charcoal Kebab', price: 12000, category: 'مشاوي', image: '🍢', descriptionAr: 'كباب لحم عراقي متبل بخليطة البهارات السرية مشوي على الفحم العربي.', descriptionEn: 'Charcoal-grilled Iraqi kebab with secret spices.', available: true, isPopular: true, restaurantId: 'rest-1' },
  { id: 'item-102', nameAr: 'دولمة بغدادية', nameEn: 'Baghdadi Dolma', price: 10000, category: 'أطباق رئيسية', image: '🍽️', descriptionAr: 'ورق عنب محشي بالأرز واللحم مع دبس الرمان العراقي.', descriptionEn: 'Stuffed grape leaves with rice, meat & pomegranate molasses.', available: true, isPopular: true, restaurantId: 'rest-1' },
  { id: 'item-103', nameAr: 'قوزي عراقي', nameEn: 'Iraqi Quzi Lamb', price: 25000, category: 'أطباق رئيسية', image: '🍖', descriptionAr: 'خروف كامل محشو بالأرز والمكسرات والزبيب مطبوخ ببطء.', descriptionEn: 'Slow-cooked whole lamb stuffed with rice, nuts & raisins.', available: true, isPopular: true, restaurantId: 'rest-1' },
  { id: 'item-104', nameAr: 'تبولة عراقية', nameEn: 'Iraqi Tabbouleh', price: 5000, category: 'مقبلات', image: '🥗', descriptionAr: 'برغل ناعم مع بقدونس طازج وطماطم وبصل ونعناع بزيت الزيتون.', descriptionEn: 'Fine bulgur with fresh parsley, tomatoes, mint & olive oil.', available: true, isPopular: false, restaurantId: 'rest-1' },
  { id: 'item-105', nameAr: 'شاي عراقي', nameEn: 'Iraqi Tea', price: 1500, category: 'مشروبات', image: '🍵', descriptionAr: 'شاي عراقي أصلي يقدم في استكان مع الهيل.', descriptionEn: 'Authentic Iraqi tea served in istikan with cardamom.', available: true, isPopular: false, restaurantId: 'rest-1' },

  // مشاوي البصرة
  { id: 'item-201', nameAr: 'سمك مسكوف البصرة', nameEn: 'Basra Masgouf Fish', price: 20000, category: 'مشاوي', image: '🐟', descriptionAr: 'سمك شبوط طازج من شط العرب مشوي على الطريقة البصرية.', descriptionEn: 'Fresh carp from Shatt al-Arab, Basra-style grilled.', available: true, isPopular: true, restaurantId: 'rest-2' },
  { id: 'item-202', nameAr: 'تشريبة بامية', nameEn: 'Okra Stew', price: 8000, category: 'أطباق رئيسية', image: '🥘', descriptionAr: 'بامية طازجة مطبوخة مع لحم الضأن والطماطم والثوم.', descriptionEn: 'Fresh okra cooked with lamb, tomatoes & garlic.', available: true, isPopular: true, restaurantId: 'rest-2' },
  { id: 'item-203', nameAr: 'باجة عراقية', nameEn: 'Iraqi Pacha', price: 15000, category: 'أطباق رئيسية', image: '🍲', descriptionAr: 'رأس خروف مطبوخ ببطء مع الأرز والبهارات العراقية.', descriptionEn: 'Slow-cooked sheep head with rice & Iraqi spices.', available: true, isPopular: false, restaurantId: 'rest-2' },
  { id: 'item-204', nameAr: 'كليجة البصرة', nameEn: 'Basra Kleicha', price: 4000, category: 'حلويات', image: '🍪', descriptionAr: 'معجنات عراقية محشوة بالتمر والهيل تقدم مع الشاي.', descriptionEn: 'Iraqi pastries filled with dates & cardamom.', available: true, isPopular: true, restaurantId: 'rest-2' },

  // قهوة أربيل التراثية
  { id: 'item-301', nameAr: 'قهوة عربية', nameEn: 'Arabic Coffee', price: 3000, category: 'مشروبات ساخنة', image: '☕', descriptionAr: 'قهوة عربية أصيلة مع الهيل تقدم في فنجان تراثي.', descriptionEn: 'Authentic Arabic coffee with cardamom.', available: true, isPopular: true, restaurantId: 'rest-3' },
  { id: 'item-302', nameAr: 'شيش برك', nameEn: 'Shish Barak', price: 9000, category: 'أطباق رئيسية', image: '🥟', descriptionAr: 'عجينة محشية باللحم ومطبوخة باللبن العراقي.', descriptionEn: 'Meat-filled dumplings cooked in Iraqi yogurt sauce.', available: true, isPopular: true, restaurantId: 'rest-3' },
  { id: 'item-303', nameAr: 'كبة موصلية', nameEn: 'Mosul Kibbeh', price: 7000, category: 'مقبلات', image: '🫓', descriptionAr: 'كبة برغل محشية باللحم والصنوبر مقلية بزيت الزيتون.', descriptionEn: 'Bulgur kibbeh stuffed with meat & pine nuts.', available: true, isPopular: false, restaurantId: 'rest-3' },
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
    id: 'order-1', tableId: 'tb-2', restaurantId: 'rest-1',
    items: [
      { id: 'oi-1', menuItemId: 'item-101', quantity: 2, priceAtOrder: 12000, notes: 'بدون بهارات حارة' },
      { id: 'oi-2', menuItemId: 'item-105', quantity: 3, priceAtOrder: 1500 }
    ],
    subtotal: 28500, tax: 2850, service: 3000, total: 34350,
    status: 'preparing', createdAt: new Date(Date.now() - 30 * 60000).toISOString()
  },
  {
    id: 'order-2', tableId: 'tb-4', restaurantId: 'rest-1',
    items: [
      { id: 'oi-3', menuItemId: 'item-102', quantity: 1, priceAtOrder: 10000, notes: 'إضافة دبس رمان' },
      { id: 'oi-4', menuItemId: 'item-104', quantity: 2, priceAtOrder: 5000 }
    ],
    subtotal: 20000, tax: 2000, service: 3000, total: 25000,
    status: 'pending', createdAt: new Date(Date.now() - 5 * 60000).toISOString()
  }
];

export const TRANSLATIONS = {
  ar: {
    appName: 'كييو آر منيو | QR Menu العراق 🇮🇶',
    tagline: 'إدارة متكاملة للمطاعم العراقية مع تتبع لحظي للطلبات والـ 20 ثيم.',
    statusConnected: 'النظام نشط',
    back: 'رجوع',
    save: 'حفظ',
    add: 'إضافة',
    delete: 'حذف',
    edit: 'تعديل',
    cancel: 'إلغاء',
    currency: 'د.ع',
    // Tabs
    tabDashboard: 'الرئيسية',
    tabTables: 'الطاولات 🪑',
    tabMenu: 'المنيو 🍔',
    tabOrders: 'المطبخ 🧑‍🍳',
    tabThemes: 'الثيمات 🎨',
    tabReports: 'التقارير 📈',
    tabSettings: 'الإعدادات ⚙️',
    tabSimulator: 'محاكي الزبون 📱',
    // Dashboard
    totalSales: 'إجمالي المبيعات',
    activeTablesCount: 'الطاولات النشطة',
    pendingOrdersCount: 'الطلبات المعلقة',
    completedOrdersCount: 'الطلبات المكتملة',
    bestseller: 'الأكثر مبيعاً',
    // Tables
    tablesTitle: 'الطاولات ورموز QR',
    tablesDesc: 'أضف طاولات مطعمك واطبع رموز QR ليتمكن الزبائن من الطلب مباشرة.',
    addTable: 'إضافة طاولة',
    tableName: 'رقم الطاولة',
    tableCapacity: 'السعة (أفراد)',
    scanToSimulate: 'محاكاة مسح QR',
    statusEmpty: 'فارغة',
    statusOrdering: 'تتصفح المنيو',
    statusWaiting: 'بانتظار الطلب',
    statusEating: 'تناول الطعام',
    statusDirty: 'بحاجة لتنظيف',
    // Menu
    menuTitle: 'إدارة المنيو',
    menuDesc: 'أضف الأطباق والأسعار والصور لمطعمك.',
    addMenuItem: 'إضافة طبق',
    foodNameAr: 'الاسم بالعربية',
    foodNameEn: 'الاسم بالإنجليزية',
    foodPrice: 'السعر (د.ع)',
    foodCategory: 'التصنيف',
    isPopular: 'طبق مميز',
    isAvailable: 'متوفر',
    // Orders
    ordersTitle: 'شاشة المطبخ',
    ordersDesc: 'تتبع الطلبات وتحديث حالتها.',
    orderStatusPending: 'قيد الانتظار',
    orderStatusPreparing: 'قيد التحضير',
    orderStatusReady: 'جاهز',
    orderStatusServed: 'تم التقديم',
    orderStatusPaid: 'مدفوع',
    // Settings
    settingsTitle: 'إعدادات المطعم',
    settingsDesc: 'تعديل بيانات المطعم واللغة والثيم.',
    language: 'اللغة',
    theme: 'المظهر',
    restaurantName: 'اسم المطعم',
    restaurantPhone: 'رقم الهاتف',
    restaurantAddress: 'العنوان',
    taxRateInput: 'نسبة الضريبة %',
    serviceChargeInput: 'رسوم الخدمة',
    currencyInput: 'العملة',
    resetData: 'إعادة ضبط',
    addRestaurant: 'إضافة مطعم جديد',
    deleteRestaurant: 'حذف المطعم',
    superUser: 'مدير النظام',
    superUserLock: 'قفل المدير',
    loginRequired: 'يلزم تسجيل الدخول كمدير',
    // Reports
    reportsTitle: 'تقارير المبيعات',
    reportsDesc: 'تحليل المبيعات والإحصائيات.',
    revenueTrend: 'الإيرادات',
    salesByCategory: 'المبيعات حسب التصنيف',
    bestsellersList: 'الأكثر مبيعاً',
    // Orders/Kitchen
    orderNo: 'طلب #',
    subtotal: 'المجموع الفرعي',
    totalAmount: 'الإجمالي',
    orderNotes: 'ملاحظات الطلب',
    // General
    addSuccess: 'تمت الإضافة',
    deleteSuccess: 'تم الحذف',
    updateSuccess: 'تم التحديث',
    resetSuccess: 'تمت إعادة الضبط',
    printReceipt: 'طباعة الفاتورة 📄',
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
