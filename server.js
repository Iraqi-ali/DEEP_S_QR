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
  settings: { lang: 'ar', theme: 'light', active_restaurant_id: 'rest-1', active_theme_id: 'theme-sunset' },
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
    { id: 'rest-1', name: 'شاورما وجريل الشام', logo: '🥙', phone: '+966 50 123 4567', address: 'الرياض - حي الياسمين', currency: 'SAR', taxRate: 0.15, serviceCharge: 5 },
    { id: 'rest-2', name: 'برجر هافن | Burger Haven', logo: '🍔', phone: '+966 55 987 6543', address: 'جدة - طريق الكورنيش', currency: 'SAR', taxRate: 0.15, serviceCharge: 10 },
    { id: 'rest-3', name: 'مطبخ البيت اليمني والريفي', logo: '🥘', phone: '+966 56 444 3322', address: 'الدمام - شارع عمر بن الخطاب', currency: 'SAR', taxRate: 0.15, serviceCharge: 0 },
    { id: 'rest-4', name: 'أرومـا كافيه | Aroma Lounge', logo: '☕', phone: '+966 53 111 2222', address: 'الرياض - بوليفارد سيتي', currency: 'SAR', taxRate: 0.15, serviceCharge: 15 }
  ];
  store.tables = [
    { id: 'tb-1', number: 'طاولة 1', capacity: 2, status: 'empty', qrCodeSeed: 'table-1-seed-992', restaurantId: 'rest-1' },
    { id: 'tb-2', number: 'طاولة 2', capacity: 4, status: 'ordering', qrCodeSeed: 'table-2-seed-811', restaurantId: 'rest-1' },
    { id: 'tb-3', number: 'طاولة 3 (VIP)', capacity: 6, status: 'waiting', qrCodeSeed: 'table-3-seed-104', restaurantId: 'rest-1' },
    { id: 'tb-4', number: 'طاولة 4 (عائلية)', capacity: 8, status: 'eating', qrCodeSeed: 'table-4-seed-443', restaurantId: 'rest-1' },
    { id: 'tb-5', number: 'طاولة 5 (خارجية)', capacity: 2, status: 'dirty', qrCodeSeed: 'table-5-seed-729', restaurantId: 'rest-1' },
    { id: 'tb-6', number: 'طاولة 6', capacity: 4, status: 'empty', qrCodeSeed: 'table-6-seed-331', restaurantId: 'rest-1' }
  ];
  store.menu_items = [
    { id: 'item-101', nameAr: 'شاورما دجاج سوبر جامبو', nameEn: 'Super Jumbo Chicken Shawarma', price: 18, category: 'Saj & Wraps', image: '🥙', descriptionAr: 'شاورما دجاج متبلة بالخلطة الشامية', descriptionEn: 'Shami marinated chicken shawarma', available: true, isPopular: true, restaurantId: 'rest-1' },
    { id: 'item-102', nameAr: 'صحن شاورما لحم عربي', nameEn: 'Arabic Beef Shawarma Platter', price: 32, category: 'Platters', image: '🍱', descriptionAr: 'قطع شاورما لحم بلدي', descriptionEn: 'Local beef shawarma pieces', available: true, isPopular: true, restaurantId: 'rest-1' },
    { id: 'item-103', nameAr: 'كباب لحم دبل مشوي', nameEn: 'Double Grilled Meat Kabab', price: 45, category: 'Grills', image: '🍢', descriptionAr: 'سيخان من اللحم المفروم المتبل', descriptionEn: 'Two skewers of minced beef', available: true, isPopular: false, restaurantId: 'rest-1' },
    { id: 'item-104', nameAr: 'سلطة فتوش بدبس الرمان', nameEn: 'Fattoush Salad', price: 15, category: 'Appetizers', image: '🥗', descriptionAr: 'مزيج من الخضار الطازجة', descriptionEn: 'Fresh mixed greens', available: true, isPopular: false, restaurantId: 'rest-1' },
    { id: 'item-105', nameAr: 'كوكا كولا بارد', nameEn: 'Coca Cola Cold', price: 5, category: 'Drinks', image: '🥤', descriptionAr: 'مشروب غازي مثلج', descriptionEn: 'Refreshing cold beverage', available: true, isPopular: false, restaurantId: 'rest-1' },
    { id: 'item-201', nameAr: 'برجر ترافل كلاسيك دبل', nameEn: 'Double Classic Truffle Burger', price: 38, category: 'Burgers', image: '🍔', descriptionAr: 'شريحتان من لحم الأنجوس', descriptionEn: 'Two premium Angus beef patties', available: true, isPopular: true, restaurantId: 'rest-2' },
    { id: 'item-202', nameAr: 'برجر الدجاج المقرمش الحار', nameEn: 'Spicy Crispy Chicken Burger', price: 29, category: 'Burgers', image: '🍗', descriptionAr: 'صدر دجاج مقرمش', descriptionEn: 'Crispy fried chicken breast', available: true, isPopular: true, restaurantId: 'rest-2' },
    { id: 'item-203', nameAr: 'بطاطس هافن بالجبنة واللحم', nameEn: 'Haven Loaded Cheese Fries', price: 22, category: 'Appetizers', image: '🍟', descriptionAr: 'بطاطس مقرمشة بالجبنة', descriptionEn: 'Crispy fries with cheese', available: true, isPopular: false, restaurantId: 'rest-2' },
    { id: 'item-204', nameAr: 'مولتن تشوكلت كيك', nameEn: 'Molten Chocolate Cake', price: 24, category: 'Desserts', image: '🍰', descriptionAr: 'كيك الشوكولاتة الغني', descriptionEn: 'Rich chocolate lava cake', available: true, isPopular: true, restaurantId: 'rest-2' }
  ];
  const now = Date.now();
  store.orders = [
    { id: 'order-1', tableId: 'tb-2', restaurantId: 'rest-1', subtotal: 46, tax: 6.9, service: 5, total: 57.9, status: 'preparing', createdAt: new Date(now - 30*60000).toISOString(), paymentMethod: null },
    { id: 'order-2', tableId: 'tb-3', restaurantId: 'rest-1', subtotal: 52, tax: 7.8, service: 5, total: 64.8, status: 'pending', createdAt: new Date(now - 5*60000).toISOString(), paymentMethod: null },
    { id: 'order-3', tableId: 'tb-4', restaurantId: 'rest-2', subtotal: 122, tax: 18.3, service: 10, total: 150.3, status: 'served', createdAt: new Date(now - 75*60000).toISOString(), paymentMethod: 'cash' }
  ];
  store.order_items = [
    { id: 'oi-1', orderId: 'order-1', menuItemId: 'item-101', quantity: 2, priceAtOrder: 18, notes: 'بدون بصل' },
    { id: 'oi-2', orderId: 'order-1', menuItemId: 'item-105', quantity: 2, priceAtOrder: 5, notes: '' },
    { id: 'oi-3', orderId: 'order-2', menuItemId: 'item-102', quantity: 1, priceAtOrder: 32, notes: 'مخلل إضافي' },
    { id: 'oi-4', orderId: 'order-2', menuItemId: 'item-104', quantity: 1, priceAtOrder: 15, notes: '' },
    { id: 'oi-5', orderId: 'order-2', menuItemId: 'item-105', quantity: 1, priceAtOrder: 5, notes: '' },
    { id: 'oi-6', orderId: 'order-3', menuItemId: 'item-201', quantity: 2, priceAtOrder: 38, notes: 'مستوية جداً' },
    { id: 'oi-7', orderId: 'order-3', menuItemId: 'item-203', quantity: 1, priceAtOrder: 22, notes: '' },
    { id: 'oi-8', orderId: 'order-3', menuItemId: 'item-204', quantity: 1, priceAtOrder: 24, notes: '' }
  ];
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
