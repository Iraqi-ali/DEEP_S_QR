/**
 * QR Menu & Table System - Main Application
 * Clean architecture with API-backed data persistence
 */
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, Table as TableIcon, Salad, ChefHat,
  Palette, TrendingUp, Settings, Smartphone, ChevronLeft
} from 'lucide-react';

import type { ActiveTab, ThemeMode, Lang, Restaurant, Table, MenuItem, Order, NotificationPayload, OrderItem } from './types';
import { INITIAL_RESTAURANTS, INITIAL_TABLES, INITIAL_MENU_ITEMS, THEMES_LIST, INITIAL_ORDERS, TRANSLATIONS } from './data';
import { api } from './api';

// Import sub-views
import DynamicIsland from './components/DynamicIsland';
import DashboardView from './components/DashboardView';
import TablesView from './components/TablesView';
import MenuView from './components/MenuView';
import OrdersView from './components/OrdersView';
import ThemesView from './components/ThemesView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import CustomerSimulatorView from './components/CustomerSimulatorView';

export default function App() {
  // ── State ─────────────────────────────────────────────────
  const [lang, setLang] = useState<Lang>('ar');
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [activeRestaurantId, setActiveRestaurantId] = useState('rest-1');
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [activeThemeId, setActiveThemeId] = useState('theme-sunset');
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [selectedSimulatorTableId, setSelectedSimulatorTableId] = useState('tb-1');
  const [notification, setNotification] = useState<NotificationPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSuperUser, setIsSuperUser] = useState(false);

  // ── Derived ───────────────────────────────────────────────
  const t = TRANSLATIONS[lang];
  const isRTL = lang === 'ar';
  const currentRestaurant = restaurants.find(r => r.id === activeRestaurantId) || restaurants[0];
  const currentTheme = THEMES_LIST.find(th => th.id === activeThemeId) || THEMES_LIST[0];

  // ── Load data from API on mount ───────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const [settings, restaurants, tables, menuItems, orders] = await Promise.all([
          api.getSettings(), api.getRestaurants(), api.getTables(),
          api.getMenuItems(), api.getOrders(),
        ]);
        if (settings.lang) setLang(settings.lang as Lang);
        if (settings.theme) setTheme(settings.theme as ThemeMode);
        if (settings.active_restaurant_id) setActiveRestaurantId(settings.active_restaurant_id);
        if (settings.active_theme_id) setActiveThemeId(settings.active_theme_id);
        if (restaurants.length) setRestaurants(restaurants);
        if (tables.length) setTables(tables);
        if (menuItems.length) setMenuItems(menuItems);
        if (orders.length) setOrders(orders);
      } catch {
        console.log('📦 Using fallback data (API not available)');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ── Sync theme to DOM ─────────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    api.saveSettings({ theme }).catch(() => {});
  }, [theme]);

  // ── QR deep-link handler ──────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tableId = params.get('tableId');
    if (tableId) {
      setTables(prev => {
        if (prev.some(tb => tb.id === tableId)) return prev;
        const num = tableId.replace('tb-', '').replace('table-', '').split('-')[0];
        return [...prev, { id: tableId, number: num || 'X', capacity: 4, status: 'ordering', qrCodeSeed: tableId }];
      });
      setSelectedSimulatorTableId(tableId);
      setActiveTab('customer-simulator');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // ── Handlers ──────────────────────────────────────────────
  const notify = useCallback((title: string, subtitle?: string, type: NotificationPayload['type'] = 'success') => {
    setNotification({ title, subtitle, type, icon: 'success' });
  }, []);

  const handleSetLang = (l: Lang) => { setLang(l); api.saveSettings({ lang: l }).catch(() => {}); };
  const handleSetTheme = (tm: ThemeMode) => setTheme(tm);

  const handleSelectTheme = (id: string) => {
    setActiveThemeId(id);
    api.saveSettings({ active_theme_id: id }).catch(() => {});
    const th = THEMES_LIST.find(t => t.id === id);
    notify(isRTL ? 'تم تطبيق الثيم بنجاح' : 'Theme Activated', th?.nameAr);
  };

  const handleSelectRestaurant = (id: string) => {
    setActiveRestaurantId(id);
    api.saveSettings({ active_restaurant_id: id }).catch(() => {});
  };

  const handleAddTable = (number: string, capacity: number) => {
    const t: Table = { id: `tb-${Date.now()}`, number, capacity, status: 'empty', qrCodeSeed: `table-${Date.now()}` };
    setTables(prev => [...prev, t]);
    api.createTable(t).catch(() => {});
    notify(isRTL ? 'تمت إضافة طاولة جديدة' : 'Table Created', isRTL ? `رقم: ${number}` : `Table ${number}`);
  };

  const handleDeleteTable = (id: string) => {
    setTables(prev => prev.filter(tb => tb.id !== id));
    api.deleteTable(id).catch(() => {});
    notify(isRTL ? 'تم حذف الطاولة' : 'Table Removed');
  };

  const handleUpdateTableStatus = (tableId: string, status: Table['status']) => {
    setTables(prev => prev.map(tb => tb.id === tableId ? { ...tb, status } : tb));
    api.updateTable(tableId, { status }).catch(() => {});
  };

  const handleSimulateScan = (tableId: string) => {
    setSelectedSimulatorTableId(tableId);
    setActiveTab('customer-simulator');
    setTables(prev => prev.map(tb => tb.id === tableId && tb.status === 'empty' ? { ...tb, status: 'ordering' } : tb));
  };

  const handleAddMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = { id: `item-${Date.now()}`, ...item };
    setMenuItems(prev => [...prev, newItem]);
    api.createMenuItem(newItem).catch(() => {});
    notify(isRTL ? 'تم تسجيل الوجبة' : 'Item Added', item.nameAr);
  };

  const handleDeleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(mi => mi.id !== id));
    api.deleteMenuItem(id).catch(() => {});
    notify(isRTL ? 'تم حذف الوجبة' : 'Item Deleted');
  };

  const handleToggleAvailability = (id: string) => {
    setMenuItems(prev => prev.map(mi => mi.id === id ? { ...mi, available: !mi.available } : mi));
  };

  const handleTogglePopular = (id: string) => {
    setMenuItems(prev => prev.map(mi => mi.id === id ? { ...mi, isPopular: !mi.isPopular } : mi));
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status'], paymentMethod?: Order['paymentMethod']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, ...(paymentMethod ? { paymentMethod } : {}) } : o));
    api.updateOrder(orderId, { status, paymentMethod }).catch(() => {});

    const order = orders.find(o => o.id === orderId);
    if (order) {
      const statusMap: Record<string, Table['status']> = { preparing: 'waiting', ready: 'waiting', served: 'eating', paid: 'empty' };
      const tbStatus = statusMap[status];
      if (tbStatus) {
        setTables(prev => prev.map(tb => tb.id === order.tableId ? { ...tb, status: tbStatus } : tb));
        api.updateTable(order.tableId, { status: tbStatus }).catch(() => {});
      }
    }
    notify(isRTL ? 'تحديث حالة التحضير' : 'Order Updated', isRTL ? `الحالة: ${status}` : `Status: ${status}`);
  };

  const handleSubmitCustomerOrder = (items: Omit<OrderItem, 'id'>[]) => {
    const subtotal = items.reduce((s, i) => s + i.priceAtOrder * i.quantity, 0);
    const tax = subtotal * currentRestaurant.taxRate;
    const service = subtotal > 0 ? currentRestaurant.serviceCharge : 0;

    const order: Order = {
      id: `order-${Date.now()}`,
      tableId: selectedSimulatorTableId,
      restaurantId: activeRestaurantId,
      items: items.map((it, idx) => ({ id: `oi-${idx}-${Date.now()}`, ...it })),
      subtotal, tax, service, total: subtotal + tax + service,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setOrders(prev => [order, ...prev]);
    api.createOrder(order).catch(() => {});
    handleUpdateTableStatus(selectedSimulatorTableId, 'waiting');
    notify(isRTL ? 'جاءك طلب جديد للمطبخ! 🧑‍🍳' : 'New Order! 🧑‍🍳',
      isRTL ? `طلب من ${tables.find(tb => tb.id === selectedSimulatorTableId)?.number}` : `From ${tables.find(tb => tb.id === selectedSimulatorTableId)?.number}`);
  };

  const handleUpdateRestaurant = (r: Restaurant) => {
    setRestaurants(prev => prev.map(rr => rr.id === r.id ? r : rr));
    api.updateRestaurant(r).catch(() => {});
  };

  const handleAddRestaurant = (r: Restaurant) => {
    setRestaurants(prev => [...prev, r]);
    api.createRestaurant(r).catch(() => {});
  };

  const handleDeleteRestaurant = (id: string) => {
    if (restaurants.length <= 1) return;
    setRestaurants(prev => prev.filter(rr => rr.id !== id));
    api.deleteRestaurant(id).catch(() => {});
    if (activeRestaurantId === id) {
      const remaining = restaurants.filter(rr => rr.id !== id);
      if (remaining.length > 0) {
        setActiveRestaurantId(remaining[0].id);
        api.saveSettings({ active_restaurant_id: remaining[0].id }).catch(() => {});
      }
    }
    notify(isRTL ? 'تم حذف المطعم' : 'Restaurant Deleted');
  };

  const handleResetData = async () => {
    await api.resetAll();
    setRestaurants(INITIAL_RESTAURANTS);
    setTables(INITIAL_TABLES);
    setMenuItems(INITIAL_MENU_ITEMS);
    setOrders(INITIAL_ORDERS);
    setActiveRestaurantId('rest-1');
    setActiveThemeId('theme-sunset');
    notify(isRTL ? 'تم إعادة الضبط' : 'Data Reset');
  };

  // ── View Router ───────────────────────────────────────────
  const filterMenuByRestaurant = (items: MenuItem[]) => {
    const prefix = activeRestaurantId === 'rest-1' ? 'item-1' : activeRestaurantId === 'rest-2' ? 'item-2' : 'item-3';
    return items.filter(i => i.id.startsWith(prefix));
  };

  const renderView = () => {
    const activeTable = tables.find(tb => tb.id === selectedSimulatorTableId) || tables[0];
    const filteredMenu = filterMenuByRestaurant(menuItems);

    switch (activeTab) {
      case 'dashboard':
        return <DashboardView orders={orders} menuItems={menuItems} tables={tables} restaurants={restaurants} activeRestaurantId={activeRestaurantId} lang={lang} onNavigate={setActiveTab} onSimulateScan={handleSimulateScan} onUpdateTableStatus={handleUpdateTableStatus} />;
      case 'tables':
        return <TablesView tables={tables} onAddTable={handleAddTable} onDeleteTable={handleDeleteTable} onSimulateScan={handleSimulateScan} lang={lang} restaurantName={currentRestaurant.name} restaurantLogo={currentRestaurant.logo} />;
      case 'menu':
        return <MenuView menuItems={filteredMenu} onAddMenuItem={handleAddMenuItem} onDeleteMenuItem={handleDeleteMenuItem} onToggleAvailability={handleToggleAvailability} onTogglePopular={handleTogglePopular} lang={lang} />;
      case 'orders':
        return <OrdersView orders={orders} menuItems={menuItems} tables={tables} restaurants={restaurants} activeRestaurantId={activeRestaurantId} onUpdateOrderStatus={handleUpdateOrderStatus} lang={lang} />;
      case 'themes':
        return <ThemesView activeThemeId={activeThemeId} onSelectTheme={handleSelectTheme} lang={lang} />;
      case 'reports':
        return <ReportsView orders={orders} menuItems={menuItems} lang={lang} />;
      case 'settings':
        return <SettingsView restaurants={restaurants} activeRestaurantId={activeRestaurantId} onSelectRestaurant={handleSelectRestaurant} onUpdateRestaurant={handleUpdateRestaurant} onAddRestaurant={handleAddRestaurant} onDeleteRestaurant={handleDeleteRestaurant} lang={lang} onSetLang={handleSetLang} theme={theme} onSetTheme={handleSetTheme} onResetData={handleResetData} triggerNotification={setNotification} isSuperUser={isSuperUser} onSetSuperUser={setIsSuperUser} />;
      case 'customer-simulator':
        return <CustomerSimulatorView restaurant={currentRestaurant} table={activeTable} menuItems={filteredMenu} activeTheme={currentTheme} onSubmitOrder={handleSubmitCustomerOrder} lang={lang} onSetLang={handleSetLang} />;
      default:
        return null;
    }
  };

  // ── Navigation config ─────────────────────────────────────
  const navItems = [
    { tab: 'dashboard' as ActiveTab, icon: LayoutDashboard, label: t.tabDashboard },
    { tab: 'tables' as ActiveTab, icon: TableIcon, label: isRTL ? 'الطاولات' : 'Tables' },
    { tab: 'menu' as ActiveTab, icon: Salad, label: isRTL ? 'الأطعمة' : 'Food Menu' },
    { tab: 'orders' as ActiveTab, icon: ChefHat, label: isRTL ? 'المطبخ' : 'Kitchen' },
    { tab: 'themes' as ActiveTab, icon: Palette, label: isRTL ? 'الثيمات' : 'Themes' },
    { tab: 'reports' as ActiveTab, icon: TrendingUp, label: isRTL ? 'التقارير' : 'Reports' },
    { tab: 'settings' as ActiveTab, icon: Settings, label: t.tabSettings },
    { tab: 'customer-simulator' as ActiveTab, icon: Smartphone, label: isRTL ? 'محاكي' : 'Simulator' },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f2f2f7] dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <span className="text-sm text-slate-500">{isRTL ? 'جاري التحميل...' : 'Loading...'}</span>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f2f2f7] p-2 text-slate-800 transition-colors duration-500 dark:bg-zinc-950 dark:text-zinc-100 sm:p-4 md:p-6 lg:p-8 font-sans relative overflow-hidden">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-400/10 blur-[120px] rounded-full dark:bg-blue-900/5" />
      <div className="pointer-events-none absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-purple-400/10 blur-[120px] rounded-full dark:bg-purple-900/5" />

      {/* Tablet frame */}
      <div className="relative flex h-[840px] w-full max-w-[1080px] flex-col overflow-hidden rounded-[2.2rem] border border-white/60 bg-white/40 shadow-2xl backdrop-blur-2xl dark:border-zinc-800/60 dark:bg-zinc-950/40 transition-all duration-300 shadow-black/5" dir={isRTL ? 'rtl' : 'ltr'}>
        <DynamicIsland notification={notification} onClear={() => setNotification(null)} lang={lang} />

        {/* Back button */}
        {activeTab !== 'dashboard' && (
          <div className="absolute top-[48px] z-20" style={{ left: isRTL ? 'auto' : '24px', right: isRTL ? '24px' : 'auto' }}>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setActiveTab('dashboard')} className="flex h-8 items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-bold shadow-sm backdrop-blur-md hover:bg-white dark:bg-zinc-850 dark:text-zinc-200 dark:hover:bg-zinc-800 border border-slate-100 dark:border-zinc-700/40">
              <ChevronLeft size={14} className={isRTL ? 'rotate-180' : ''} />
              <span>{t.back}</span>
            </motion.button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pt-12 pb-28 md:px-10">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3, ease: 'easeOut' }}>
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom navigation */}
        <div className="absolute bottom-5 inset-x-0 z-30 flex justify-center px-4 pointer-events-none">
          <div className="pointer-events-auto flex items-center justify-around rounded-[26px] bg-white/80 p-1.5 shadow-xl border border-slate-200/50 backdrop-blur-xl dark:bg-zinc-900/80 dark:border-zinc-800/60 w-full max-w-[760px]">
            {navItems.map(({ tab, icon: Icon, label }) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex flex-col items-center gap-1 rounded-2xl py-2 px-3 transition-all ${activeTab === tab ? 'bg-blue-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200'}`}>
                <Icon size={16} />
                <span className="text-[9px] font-bold tracking-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-1.5 inset-x-0 flex justify-center pointer-events-none">
          <div className="h-1 w-28 rounded-full bg-slate-300 dark:bg-zinc-700/60" />
        </div>
      </div>
    </div>
  );
}
