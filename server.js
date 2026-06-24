/**
 * QR Menu & Table System - Express Server with JSON File Storage
 * Zero native dependencies - deploys instantly on Render
 */
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────────────────
app.use(express.json());

// ── JSON File Database ──────────────────────────────────────
const dataDir = process.env.RENDER_DISK_PATH || __dirname;
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const DB_FILE = path.join(dataDir, 'data.json');

console.log(`📁 Database: ${DB_FILE}`);

let store = {
  settings: { lang: 'ar', theme: 'light', active_restaurant_id: 'rest-1', active_theme_id: 'theme-sunset', super_password: 'admin123' },
  restaurants: [], tables: [], menu_items: [], orders: [], order_items: []
};

function loadStore() {
  try { if (fs.existsSync(DB_FILE)) store = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8')); }
  catch { console.log('🆕 Starting fresh'); }
}
function saveStore() { fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2)); }
function ok(res, data) { res.json(data); }

loadStore();

// ── Seed if empty ───────────────────────────────────────────
if (store.restaurants.length === 0) {
  store.restaurants = [
    { id: 'rest-1', name: 'مطعم القصر العراقي', logo: '🏰', phone: '+964 780 123 4567', address: 'شارع المتنبي - قرب ساحة التحرير', city: 'بغداد', currency: 'د.ع', taxRate: 0.10, serviceCharge: 3000 },
    { id: 'rest-2', name: 'مشاوي البصرة', logo: '🥩', phone: '+964 781 987 6543', address: 'شارع الكورنيش - مقابل فندق البصرة', city: 'البصرة', currency: 'د.ع', taxRate: 0.10, serviceCharge: 2000 },
    { id: 'rest-3', name: 'قهوة أربيل التراثية', logo: '☕', phone: '+964 750 444 3322', address: 'شارع القلعة - سوق القيصري', city: 'أربيل', currency: 'د.ع', taxRate: 0.10, serviceCharge: 5000 }
  ];
  store.tables = [
    { id: 'tb-1', number: 'طاولة 1', capacity: 2, status: 'empty', qrCodeSeed: 'table-1-seed-992', restaurantId: 'rest-1' },
    { id: 'tb-2', number: 'طاولة 2', capacity: 4, status: 'occupied', qrCodeSeed: 'table-2-seed-811', restaurantId: 'rest-1' },
    { id: 'tb-3', number: 'طاولة VIP', capacity: 6, status: 'empty', qrCodeSeed: 'table-3-seed-104', restaurantId: 'rest-1' },
    { id: 'tb-4', number: 'طاولة عائلية', capacity: 8, status: 'occupied', qrCodeSeed: 'table-4-seed-443', restaurantId: 'rest-1' },
    { id: 'tb-5', number: 'طاولة 5 (خارجية)', capacity: 2, status: 'dirty', qrCodeSeed: 'table-5-seed-729', restaurantId: 'rest-1' },
    { id: 'tb-6', number: 'طاولة 6', capacity: 4, status: 'empty', qrCodeSeed: 'table-6-seed-331', restaurantId: 'rest-1' },
    { id: 'tb-delivery', number: '🚀 طلبات خارجية', capacity: 99, status: 'empty', qrCodeSeed: 'delivery-seed-001', restaurantId: 'rest-1' }
  ];
  store.menu_items = [
    { id: 'item-101', nameAr: 'كباب عراقي على الفحم', nameEn: 'Iraqi Charcoal Kebab', price: 12000, category: 'مشاوي', image: '🍢', descriptionAr: 'كباب لحم عراقي متبل مشوي على الفحم.', descriptionEn: 'Charcoal-grilled Iraqi kebab.', available: true, isPopular: true, restaurantId: 'rest-1' },
    { id: 'item-102', nameAr: 'دولمة بغدادية', nameEn: 'Baghdadi Dolma', price: 10000, category: 'أطباق رئيسية', image: '🍽️', descriptionAr: 'ورق عنب محشي بالأرز واللحم.', descriptionEn: 'Stuffed grape leaves with rice & meat.', available: true, isPopular: true, restaurantId: 'rest-1' },
    { id: 'item-103', nameAr: 'قوزي عراقي', nameEn: 'Iraqi Quzi Lamb', price: 25000, category: 'أطباق رئيسية', image: '🍖', descriptionAr: 'خروف محشو بالأرز والمكسرات.', descriptionEn: 'Slow-cooked stuffed lamb.', available: true, isPopular: true, restaurantId: 'rest-1' },
    { id: 'item-104', nameAr: 'تبولة عراقية', nameEn: 'Iraqi Tabbouleh', price: 5000, category: 'مقبلات', image: '🥗', descriptionAr: 'برغل مع بقدونس طازج.', descriptionEn: 'Fine bulgur with fresh parsley.', available: true, isPopular: false, restaurantId: 'rest-1' },
    { id: 'item-105', nameAr: 'شاي عراقي', nameEn: 'Iraqi Tea', price: 1500, category: 'مشروبات', image: '🍵', descriptionAr: 'شاي عراقي بالهيل.', descriptionEn: 'Iraqi tea with cardamom.', available: true, isPopular: false, restaurantId: 'rest-1' },
    { id: 'item-201', nameAr: 'سمك مسكوف البصرة', nameEn: 'Basra Masgouf Fish', price: 20000, category: 'مشاوي', image: '🐟', descriptionAr: 'سمك شبوط مشوي على الطريقة البصرية.', descriptionEn: 'Basra-style grilled fish.', available: true, isPopular: true, restaurantId: 'rest-2' },
    { id: 'item-202', nameAr: 'تشريبة بامية', nameEn: 'Okra Stew', price: 8000, category: 'أطباق رئيسية', image: '🥘', descriptionAr: 'بامية مع لحم الضأن.', descriptionEn: 'Okra cooked with lamb.', available: true, isPopular: true, restaurantId: 'rest-2' },
    { id: 'item-203', nameAr: 'باجة عراقية', nameEn: 'Iraqi Pacha', price: 15000, category: 'أطباق رئيسية', image: '🍲', descriptionAr: 'رأس خروف مطبوخ ببطء.', descriptionEn: 'Slow-cooked sheep head.', available: true, isPopular: false, restaurantId: 'rest-2' },
    { id: 'item-204', nameAr: 'كليجة البصرة', nameEn: 'Basra Kleicha', price: 4000, category: 'حلويات', image: '🍪', descriptionAr: 'معجنات محشوة بالتمر.', descriptionEn: 'Date-filled pastries.', available: true, isPopular: true, restaurantId: 'rest-2' },
    { id: 'item-301', nameAr: 'قهوة عربية', nameEn: 'Arabic Coffee', price: 3000, category: 'مشروبات ساخنة', image: '☕', descriptionAr: 'قهوة عربية بالهيل.', descriptionEn: 'Arabic coffee with cardamom.', available: true, isPopular: true, restaurantId: 'rest-3' },
    { id: 'item-302', nameAr: 'شيش برك', nameEn: 'Shish Barak', price: 9000, category: 'أطباق رئيسية', image: '🥟', descriptionAr: 'عجينة محشية باللحم واللبن.', descriptionEn: 'Meat dumplings in yogurt sauce.', available: true, isPopular: true, restaurantId: 'rest-3' },
    { id: 'item-303', nameAr: 'كبة موصلية', nameEn: 'Mosul Kibbeh', price: 7000, category: 'مقبلات', image: '🫓', descriptionAr: 'كبة برغل باللحم والصنوبر.', descriptionEn: 'Bulgur kibbeh with meat & pine nuts.', available: true, isPopular: false, restaurantId: 'rest-3' }
  ];
  const now = Date.now();
  store.orders = [
    { id: 'order-1', tableId: 'tb-2', restaurantId: 'rest-1', subtotal: 28500, tax: 2850, service: 3000, total: 34350, status: 'preparing', createdAt: new Date(now - 30*60000).toISOString(), paymentMethod: null },
    { id: 'order-2', tableId: 'tb-4', restaurantId: 'rest-1', subtotal: 20000, tax: 2000, service: 3000, total: 25000, status: 'pending', createdAt: new Date(now - 5*60000).toISOString(), paymentMethod: null }
  ];
  store.order_items = [
    { id: 'oi-1', orderId: 'order-1', menuItemId: 'item-101', quantity: 2, priceAtOrder: 12000, notes: 'بدون بهارات حارة' },
    { id: 'oi-2', orderId: 'order-1', menuItemId: 'item-105', quantity: 3, priceAtOrder: 1500, notes: '' },
    { id: 'oi-3', orderId: 'order-2', menuItemId: 'item-102', quantity: 1, priceAtOrder: 10000, notes: 'إضافة دبس رمان' },
    { id: 'oi-4', orderId: 'order-2', menuItemId: 'item-104', quantity: 2, priceAtOrder: 5000, notes: '' }
  ];
  store.settings.super_password = 'admin123';
  saveStore();
  console.log('✅ Seeded initial data');
}

// ── API Routes ──────────────────────────────────────────────

app.get('/api/settings', (_req, res) => ok(res, store.settings));

app.put('/api/settings', (req, res) => {
  store.settings = { ...store.settings, ...req.body };
  saveStore(); ok(res, { success: true });
});

app.get('/api/restaurants', (_req, res) => ok(res, store.restaurants));

app.post('/api/restaurants', (req, res) => {
  store.restaurants.push(req.body);
  saveStore(); ok(res, { success: true, id: req.body.id });
});

app.put('/api/restaurants/:id', (req, res) => {
  const i = store.restaurants.findIndex(r => r.id === req.params.id);
  if (i === -1) return res.status(404).json({ error: 'Not found' });
  store.restaurants[i] = { ...store.restaurants[i], ...req.body };
  saveStore(); ok(res, { success: true });
});

app.delete('/api/restaurants/:id', (req, res) => {
  store.restaurants = store.restaurants.filter(r => r.id !== req.params.id);
  saveStore(); ok(res, { success: true });
});

app.get('/api/tables', (_req, res) => ok(res, store.tables));

app.post('/api/tables', (req, res) => {
  store.tables.push(req.body);
  saveStore(); ok(res, { success: true, id: req.body.id });
});

app.put('/api/tables/:id', (req, res) => {
  const i = store.tables.findIndex(t => t.id === req.params.id);
  if (i === -1) return res.status(404).json({ error: 'Not found' });
  store.tables[i] = { ...store.tables[i], ...req.body };
  saveStore(); ok(res, { success: true });
});

app.delete('/api/tables/:id', (req, res) => {
  store.tables = store.tables.filter(t => t.id !== req.params.id);
  saveStore(); ok(res, { success: true });
});

app.get('/api/menu-items', (_req, res) => ok(res, store.menu_items));

app.post('/api/menu-items', (req, res) => {
  store.menu_items.push(req.body);
  saveStore(); ok(res, { success: true, id: req.body.id });
});

app.put('/api/menu-items/:id', (req, res) => {
  const i = store.menu_items.findIndex(m => m.id === req.params.id);
  if (i === -1) return res.status(404).json({ error: 'Not found' });
  store.menu_items[i] = { ...store.menu_items[i], ...req.body };
  saveStore(); ok(res, { success: true });
});

app.delete('/api/menu-items/:id', (req, res) => {
  store.menu_items = store.menu_items.filter(m => m.id !== req.params.id);
  saveStore(); ok(res, { success: true });
});

app.get('/api/orders', (_req, res) => {
  const orders = [...store.orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  ok(res, orders.map(o => ({ ...o, items: store.order_items.filter(i => i.orderId === o.id) })));
});

app.post('/api/orders', (req, res) => {
  const { items, ...order } = req.body;
  store.orders.push(order);
  if (items) store.order_items.push(...items);
  saveStore(); ok(res, { success: true, id: order.id });
});

app.put('/api/orders/:id', (req, res) => {
  const i = store.orders.findIndex(o => o.id === req.params.id);
  if (i === -1) return res.status(404).json({ error: 'Not found' });
  store.orders[i] = { ...store.orders[i], ...req.body };
  saveStore(); ok(res, { success: true });
});

app.post('/api/reset', (_req, res) => {
  store.restaurants = []; store.tables = []; store.menu_items = [];
  store.orders = []; store.order_items = [];
  saveStore(); loadStore(); ok(res, { success: true });
});

// ── Serve React in production ───────────────────────────────
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// ── Start ───────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
