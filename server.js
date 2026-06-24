/**
 * QR Menu & Table System - Express Server with SQLite
 * Ready for Render deployment
 */
import express from 'express';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────────────────
app.use(express.json());

// ── Database Setup ─────────────────────────────────────────
const db = new Database(path.join(__dirname, 'restaurant.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS restaurants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    logo TEXT NOT NULL DEFAULT '🍽️',
    phone TEXT NOT NULL DEFAULT '',
    address TEXT NOT NULL DEFAULT '',
    currency TEXT NOT NULL DEFAULT 'SAR',
    tax_rate REAL NOT NULL DEFAULT 0.15,
    service_charge REAL NOT NULL DEFAULT 5.0
  );

  CREATE TABLE IF NOT EXISTS tables (
    id TEXT PRIMARY KEY,
    number TEXT NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 4,
    status TEXT NOT NULL DEFAULT 'empty',
    qr_code_seed TEXT NOT NULL DEFAULT '',
    restaurant_id TEXT NOT NULL DEFAULT 'rest-1',
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS menu_items (
    id TEXT PRIMARY KEY,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL DEFAULT 'عام',
    image TEXT NOT NULL DEFAULT '🍽️',
    description_ar TEXT DEFAULT '',
    description_en TEXT DEFAULT '',
    available INTEGER NOT NULL DEFAULT 1,
    is_popular INTEGER NOT NULL DEFAULT 0,
    restaurant_id TEXT NOT NULL DEFAULT 'rest-1',
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    table_id TEXT NOT NULL,
    restaurant_id TEXT NOT NULL,
    subtotal REAL NOT NULL,
    tax REAL NOT NULL,
    service REAL NOT NULL,
    total REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL,
    payment_method TEXT,
    FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    menu_item_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price_at_order REAL NOT NULL,
    notes TEXT DEFAULT '',
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
  );
`);

// ── Seed initial data if empty ──────────────────────────────
const seedDatabase = () => {
  const count = db.prepare('SELECT COUNT(*) as c FROM restaurants').get();
  if (count.c > 0) return;

  const insertRestaurant = db.prepare(`INSERT INTO restaurants VALUES (?,?,?,?,?,?,?,?)`);
  const insertTable = db.prepare(`INSERT INTO tables VALUES (?,?,?,?,?,?)`);
  const insertMenuItem = db.prepare(`INSERT INTO menu_items VALUES (?,?,?,?,?,?,?,?,?,?,?)`);
  const insertOrder = db.prepare(`INSERT INTO orders VALUES (?,?,?,?,?,?,?,?,?,?)`);
  const insertOrderItem = db.prepare(`INSERT INTO order_items VALUES (?,?,?,?,?,?)`);
  const insertSetting = db.prepare(`INSERT OR REPLACE INTO settings VALUES (?,?)`);

  const seed = db.transaction(() => {
    // Restaurants
    insertRestaurant.run('rest-1', 'شاورما وجريل الشام', '🥙', '+966 50 123 4567', 'الرياض - حي الياسمين', 'SAR', 0.15, 5);
    insertRestaurant.run('rest-2', 'برجر هافن | Burger Haven', '🍔', '+966 55 987 6543', 'جدة - طريق الكورنيش', 'SAR', 0.15, 10);
    insertRestaurant.run('rest-3', 'مطبخ البيت اليمني والريفي', '🥘', '+966 56 444 3322', 'الدمام - شارع عمر بن الخطاب', 'SAR', 0.15, 0);
    insertRestaurant.run('rest-4', 'أرومـا كافيه | Aroma Lounge', '☕', '+966 53 111 2222', 'الرياض - بوليفارد سيتي', 'SAR', 0.15, 15);

    // Tables
    const tables = [
      ['tb-1', 'طاولة 1', 2, 'empty', 'table-1-seed-992', 'rest-1'],
      ['tb-2', 'طاولة 2', 4, 'ordering', 'table-2-seed-811', 'rest-1'],
      ['tb-3', 'طاولة 3 (VIP)', 6, 'waiting', 'table-3-seed-104', 'rest-1'],
      ['tb-4', 'طاولة 4 (عائلية)', 8, 'eating', 'table-4-seed-443', 'rest-1'],
      ['tb-5', 'طاولة 5 (خارجية)', 2, 'dirty', 'table-5-seed-729', 'rest-1'],
      ['tb-6', 'طاولة 6', 4, 'empty', 'table-6-seed-331', 'rest-1'],
    ];
    tables.forEach(t => insertTable.run(...t));

    // Menu Items
    const menuItems = [
      ['item-101', 'شاورما دجاج سوبر جامبو', 'Super Jumbo Chicken Shawarma', 18, 'Saj & Wraps', '🥙', 'شاورما دجاج متبلة بالخلطة الشامية', 'Shami marinated chicken shawarma', 1, 1, 'rest-1'],
      ['item-102', 'صحن شاورما لحم عربي', 'Arabic Beef Shawarma Platter', 32, 'Platters', '🍱', 'قطع شاورما لحم بلدي', 'Local beef shawarma pieces', 1, 1, 'rest-1'],
      ['item-103', 'كباب لحم دبل مشوي', 'Double Grilled Meat Kabab', 45, 'Grills', '🍢', 'سيخان من اللحم المفروم المتبل', 'Two skewers of minced beef', 1, 0, 'rest-1'],
      ['item-104', 'سلطة فتوش بدبس الرمان', 'Fattoush Salad', 15, 'Appetizers', '🥗', 'مزيج من الخضار الطازجة', 'Fresh mixed greens', 1, 0, 'rest-1'],
      ['item-105', 'كوكا كولا بارد', 'Coca Cola Cold', 5, 'Drinks', '🥤', 'مشروب غازي مثلج', 'Refreshing cold beverage', 1, 0, 'rest-1'],
      ['item-201', 'برجر ترافل كلاسيك دبل', 'Double Classic Truffle Burger', 38, 'Burgers', '🍔', 'شريحتان من لحم الأنجوس', 'Two premium Angus beef patties', 1, 1, 'rest-2'],
      ['item-202', 'برجر الدجاج المقرمش الحار', 'Spicy Crispy Chicken Burger', 29, 'Burgers', '🍗', 'صدر دجاج مقرمش', 'Crispy fried chicken breast', 1, 1, 'rest-2'],
      ['item-203', 'بطاطس هافن بالجبنة واللحم', 'Haven Loaded Cheese Fries', 22, 'Appetizers', '🍟', 'بطاطس مقرمشة بالجبنة', 'Crispy fries with cheese', 1, 0, 'rest-2'],
      ['item-204', 'مولتن تشوكلت كيك', 'Molten Chocolate Cake', 24, 'Desserts', '🍰', 'كيك الشوكولاتة الغني', 'Rich chocolate lava cake', 1, 1, 'rest-2'],
    ];
    menuItems.forEach(m => insertMenuItem.run(...m));

    // Orders
    const now = Date.now();
    insertOrder.run('order-1', 'tb-2', 'rest-1', 46, 6.9, 5, 57.9, 'preparing', new Date(now - 30*60000).toISOString(), null);
    insertOrder.run('order-2', 'tb-3', 'rest-1', 52, 7.8, 5, 64.8, 'pending', new Date(now - 5*60000).toISOString(), null);
    insertOrder.run('order-3', 'tb-4', 'rest-2', 122, 18.3, 10, 150.3, 'served', new Date(now - 75*60000).toISOString(), 'cash');

    insertOrderItem.run('oi-1', 'order-1', 'item-101', 2, 18, 'بدون بصل');
    insertOrderItem.run('oi-2', 'order-1', 'item-105', 2, 5, '');
    insertOrderItem.run('oi-3', 'order-2', 'item-102', 1, 32, 'مخلل إضافي');
    insertOrderItem.run('oi-4', 'order-2', 'item-104', 1, 15, '');
    insertOrderItem.run('oi-5', 'order-2', 'item-105', 1, 5, '');
    insertOrderItem.run('oi-6', 'order-3', 'item-201', 2, 38, 'مستوية جداً');
    insertOrderItem.run('oi-7', 'order-3', 'item-203', 1, 22, '');
    insertOrderItem.run('oi-8', 'order-3', 'item-204', 1, 24, '');

    // Settings
    insertSetting.run('lang', 'ar');
    insertSetting.run('theme', 'light');
    insertSetting.run('active_restaurant_id', 'rest-1');
    insertSetting.run('active_theme_id', 'theme-sunset');
  });

  seed();
  console.log('✅ Database seeded with initial data');
};

seedDatabase();

// ── API Routes ──────────────────────────────────────────────

// ── Settings ──
app.get('/api/settings', (_req, res) => {
  const rows = db.prepare('SELECT * FROM settings').all();
  const settings = {};
  rows.forEach(r => { settings[r.key] = r.value; });
  res.json(settings);
});

app.put('/api/settings', (req, res) => {
  const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  const tx = db.transaction(() => {
    for (const [key, value] of Object.entries(req.body)) {
      stmt.run(key, String(value));
    }
  });
  tx();
  res.json({ success: true });
});

// ── Restaurants ──
app.get('/api/restaurants', (_req, res) => {
  const rows = db.prepare('SELECT * FROM restaurants').all();
  res.json(rows.map(r => ({ ...r, taxRate: r.tax_rate, serviceCharge: r.service_charge })));
});

app.post('/api/restaurants', (req, res) => {
  const { id, name, logo, phone, address, currency, taxRate, serviceCharge } = req.body;
  db.prepare(`INSERT INTO restaurants VALUES (?,?,?,?,?,?,?,?)`)
    .run(id, name, logo || '🍽️', phone || '', address || '', currency || 'SAR', taxRate || 0.15, serviceCharge || 5);
  res.json({ success: true, id });
});

app.put('/api/restaurants/:id', (req, res) => {
  const { name, logo, phone, address, currency, taxRate, serviceCharge } = req.body;
  db.prepare(`UPDATE restaurants SET name=?, logo=?, phone=?, address=?, currency=?, tax_rate=?, service_charge=? WHERE id=?`)
    .run(name, logo, phone, address, currency, taxRate, serviceCharge, req.params.id);
  res.json({ success: true });
});

app.delete('/api/restaurants/:id', (req, res) => {
  db.prepare('DELETE FROM restaurants WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

// ── Tables ──
app.get('/api/tables', (_req, res) => {
  const rows = db.prepare('SELECT * FROM tables').all();
  res.json(rows.map(r => ({ ...r, qrCodeSeed: r.qr_code_seed, restaurantId: r.restaurant_id, number: r.number, capacity: r.capacity, status: r.status })));
});

app.post('/api/tables', (req, res) => {
  const { id, number, capacity, status, qrCodeSeed, restaurantId } = req.body;
  db.prepare(`INSERT INTO tables VALUES (?,?,?,?,?,?)`)
    .run(id, number, capacity || 4, status || 'empty', qrCodeSeed || '', restaurantId || 'rest-1');
  res.json({ success: true, id });
});

app.put('/api/tables/:id', (req, res) => {
  const { number, capacity, status, qrCodeSeed, restaurantId } = req.body;
  const current = db.prepare('SELECT * FROM tables WHERE id=?').get(req.params.id);
  if (!current) return res.status(404).json({ error: 'Table not found' });
  db.prepare(`UPDATE tables SET number=?, capacity=?, status=?, qr_code_seed=?, restaurant_id=? WHERE id=?`)
    .run(
      number ?? current.number,
      capacity ?? current.capacity,
      status ?? current.status,
      qrCodeSeed ?? current.qr_code_seed,
      restaurantId ?? current.restaurant_id,
      req.params.id
    );
  res.json({ success: true });
});

app.delete('/api/tables/:id', (req, res) => {
  db.prepare('DELETE FROM tables WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

// ── Menu Items ──
app.get('/api/menu-items', (_req, res) => {
  const rows = db.prepare('SELECT * FROM menu_items').all();
  res.json(rows.map(r => ({
    id: r.id, nameAr: r.name_ar, nameEn: r.name_en, price: r.price,
    category: r.category, image: r.image, descriptionAr: r.description_ar,
    descriptionEn: r.description_en, available: !!r.available, isPopular: !!r.is_popular,
    restaurantId: r.restaurant_id
  })));
});

app.post('/api/menu-items', (req, res) => {
  const { id, nameAr, nameEn, price, category, image, descriptionAr, descriptionEn, available, isPopular, restaurantId } = req.body;
  db.prepare(`INSERT INTO menu_items VALUES (?,?,?,?,?,?,?,?,?,?,?)`)
    .run(id, nameAr, nameEn, price, category || 'عام', image || '🍽️', descriptionAr || '', descriptionEn || '', available ? 1 : 0, isPopular ? 1 : 0, restaurantId || 'rest-1');
  res.json({ success: true, id });
});

app.put('/api/menu-items/:id', (req, res) => {
  const current = db.prepare('SELECT * FROM menu_items WHERE id=?').get(req.params.id);
  if (!current) return res.status(404).json({ error: 'Not found' });

  const { nameAr, nameEn, price, category, image, descriptionAr, descriptionEn, available, isPopular, restaurantId } = req.body;
  db.prepare(`UPDATE menu_items SET name_ar=?, name_en=?, price=?, category=?, image=?, description_ar=?, description_en=?, available=?, is_popular=?, restaurant_id=? WHERE id=?`)
    .run(
      nameAr ?? current.name_ar, nameEn ?? current.name_en, price ?? current.price,
      category ?? current.category, image ?? current.image,
      descriptionAr ?? current.description_ar, descriptionEn ?? current.description_en,
      available !== undefined ? (available ? 1 : 0) : current.available,
      isPopular !== undefined ? (isPopular ? 1 : 0) : current.is_popular,
      restaurantId ?? current.restaurant_id, req.params.id
    );
  res.json({ success: true });
});

app.delete('/api/menu-items/:id', (req, res) => {
  db.prepare('DELETE FROM menu_items WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

// ── Orders ──
app.get('/api/orders', (_req, res) => {
  const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
  const result = orders.map(o => {
    const items = db.prepare('SELECT * FROM order_items WHERE order_id=?').all(o.id);
    return {
      id: o.id, tableId: o.table_id, restaurantId: o.restaurant_id,
      subtotal: o.subtotal, tax: o.tax, service: o.service, total: o.total,
      status: o.status, createdAt: o.created_at, paymentMethod: o.payment_method,
      items: items.map(i => ({
        id: i.id, menuItemId: i.menu_item_id, quantity: i.quantity,
        priceAtOrder: i.price_at_order, notes: i.notes
      }))
    };
  });
  res.json(result);
});

app.post('/api/orders', (req, res) => {
  const { id, tableId, restaurantId, items, subtotal, tax, service, total, status, createdAt, paymentMethod } = req.body;

  const tx = db.transaction(() => {
    db.prepare(`INSERT INTO orders VALUES (?,?,?,?,?,?,?,?,?,?)`)
      .run(id, tableId, restaurantId, subtotal, tax, service, total, status || 'pending', createdAt || new Date().toISOString(), paymentMethod || null);

    const stmt = db.prepare(`INSERT INTO order_items VALUES (?,?,?,?,?,?)`);
    items.forEach((item, idx) => {
      stmt.run(item.id || `oi-${idx}-${Date.now()}`, id, item.menuItemId, item.quantity, item.priceAtOrder, item.notes || '');
    });
  });
  tx();
  res.json({ success: true, id });
});

app.put('/api/orders/:id', (req, res) => {
  const current = db.prepare('SELECT * FROM orders WHERE id=?').get(req.params.id);
  if (!current) return res.status(404).json({ error: 'Not found' });

  const { status, paymentMethod } = req.body;
  db.prepare(`UPDATE orders SET status=?, payment_method=? WHERE id=?`)
    .run(status ?? current.status, paymentMethod !== undefined ? paymentMethod : current.payment_method, req.params.id);
  res.json({ success: true });
});

// ── Reset ──
app.post('/api/reset', (_req, res) => {
  db.exec(`
    DELETE FROM order_items; DELETE FROM orders;
    DELETE FROM menu_items; DELETE FROM tables;
    DELETE FROM restaurants; DELETE FROM settings;
  `);
  seedDatabase();
  res.json({ success: true });
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
