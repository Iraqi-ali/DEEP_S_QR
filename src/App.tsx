/**
 * QR Menu & Table System - Main Application
 * Clean architecture with API-backed data persistence
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, Table as TableIcon, Salad, ChefHat,
  Palette, TrendingUp, Settings, ChevronLeft
} from 'lucide-react';

import type { ActiveTab, ThemeMode, Lang, Restaurant, Table, MenuItem, Order, NotificationPayload } from './types';
import { INITIAL_RESTAURANTS, INITIAL_TABLES, INITIAL_MENU_ITEMS, THEMES_LIST, INITIAL_ORDERS, TRANSLATIONS } from './data';
import { api } from './api';

// Import sub-views
import DashboardView from './components/DashboardView';
import TablesView from './components/TablesView';
import MenuView from './components/MenuView';
import OrdersView from './components/OrdersView';
import ThemesView from './components/ThemesView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import GuestView from './components/GuestView';

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
  const [notification, setNotification] = useState<NotificationPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSuperUser, setIsSuperUser] = useState(false);
  const guestRef = useRef<{ tableId: string } | null>(null);
  const prevTableStatuses = useRef<Record<string, string>>({});
  const contentRef = useRef<HTMLDivElement>(null);
  const [lastKnownOrderIds, setLastKnownOrderIds] = useState<Set<string>>(new Set());

  // Scroll to top on tab change
  useEffect(() => { contentRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [activeTab]);

  // Detect guest mode synchronously from URL (before any async ops)
  if (!guestRef.current) {
    const p = new URLSearchParams(window.location.search);
    const tid = p.get('tableId');
    if (tid) guestRef.current = { tableId: tid };
  }
  const isGuestMode = !!guestRef.current;

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

  // ── QR deep-link handler - ensure table exists ────────────
  useEffect(() => {
    if (!guestRef.current) return;
    const tableId = guestRef.current.tableId;
    setTables(prev => {
      if (prev.some(tb => tb.id === tableId)) return prev;
      const num = tableId.replace('tb-', '').replace('table-', '').split('-')[0];
      return [...prev, { id: tableId, number: num || 'X', capacity: 4, status: 'ordering', qrCodeSeed: tableId }];
    });
  }, []);

  // ── Poll for new orders & waiter calls (dashboard only) ──

  useEffect(() => {
    if (isGuestMode || loading) return;
    const poll = setInterval(async () => {
      try {
        const [fresh, freshTables] = await Promise.all([api.getOrders(), api.getTables()]);

        // Check new orders
        const newIds = new Set(fresh.map(o => o.id));
        const diff = [...newIds].filter(id => !lastKnownOrderIds.has(id));
        if (diff.length > 0 && lastKnownOrderIds.size > 0) {
          const newOrder = fresh.find(o => diff.includes(o.id));
          if (newOrder) {
            const isBeforeMode = currentRestaurant.paymentMode === 'before';
            if (isBeforeMode) {
              setNotification({ title: isRTL ? '💳 طلب بانتظار الدفع!' : '💳 Payment Required!', subtitle: isRTL ? `طاولة ${tables.find(t => t.id === newOrder.tableId)?.number || '?'} - اذهب للمطبخ لتأكيد الدفع` : `Table ${tables.find(t => t.id === newOrder.tableId)?.number || '?'} - Go to Kitchen to confirm`, type: 'warning' });
            } else {
              setNotification({ title: isRTL ? '🔔 طلب جديد!' : '🔔 New Order!', subtitle: isRTL ? `طاولة ${tables.find(t => t.id === newOrder.tableId)?.number || '?'}` : `Table ${tables.find(t => t.id === newOrder.tableId)?.number || '?'}`, type: 'success' });
            }
            setOrders(fresh);
            setTables(prev => prev.map(tb => tb.id === newOrder.tableId ? { ...tb, status: 'occupied' } : tb));
            api.updateTable(newOrder.tableId, { status: 'occupied' }).catch(() => {});
          }
        }
        setLastKnownOrderIds(newIds);

        // Check waiter calls (table status changed to 'waiting')
        freshTables.forEach(t => {
          const prev = prevTableStatuses.current[t.id];
          if (prev && prev !== 'waiting' && t.status === 'waiting') {
            setNotification({ title: isRTL ? '🔔 استدعاء نادل!' : '🔔 Waiter Called!', subtitle: isRTL ? `طاولة ${t.number} تطلب النادل` : `Table ${t.number} needs a waiter`, type: 'warning' });
          }
          prevTableStatuses.current[t.id] = t.status;
        });
        setTables(freshTables);
      } catch {}
    }, 4000);
    return () => clearInterval(poll);
  }, [isGuestMode, loading]);

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
    // Open guest view by setting tableId query param
    window.open(`/?tableId=${tableId}`, '_blank');
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
      const statusMap: Record<string, Table['status']> = { 
        pending: 'occupied', preparing: 'waiting', ready: 'waiting', served: 'eating', paid: 'dirty' 
      };
      const tbStatus = statusMap[status];
      if (tbStatus) {
        setTables(prev => prev.map(tb => tb.id === order.tableId ? { ...tb, status: tbStatus } : tb));
        api.updateTable(order.tableId, { status: tbStatus }).catch(() => {});
      }
    }
    notify(isRTL ? 'تحديث حالة التحضير' : 'Order Updated', isRTL ? `الحالة: ${status}` : `Status: ${status}`);
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
    const filteredMenu = filterMenuByRestaurant(menuItems);

    switch (activeTab) {
      case 'dashboard':
        return <DashboardView orders={orders} menuItems={menuItems} tables={tables} restaurants={restaurants} activeRestaurantId={activeRestaurantId} lang={lang} onNavigate={setActiveTab} onSimulateScan={handleSimulateScan} onUpdateTableStatus={handleUpdateTableStatus} onUpdateOrderStatus={(id, status) => handleUpdateOrderStatus(id, status)} />;
      case 'tables':
        return <TablesView tables={tables} onAddTable={handleAddTable} onDeleteTable={handleDeleteTable} onSimulateScan={handleSimulateScan} onUpdateTableStatus={handleUpdateTableStatus} lang={lang} restaurantName={currentRestaurant.name} restaurantLogo={currentRestaurant.logo} />;
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
      default:
        return null;
    }
  };

  // ── Notification counts ──────────────────────────────────
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const activeOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'preparing').length;
  const dirtyTablesCount = tables.filter(t => t.status === 'dirty').length;

  // ── Navigation config ─────────────────────────────────────
  const navItems = [
    { tab: 'dashboard' as ActiveTab, icon: LayoutDashboard, label: t.tabDashboard, badge: 0 },
    { tab: 'tables' as ActiveTab, icon: TableIcon, label: isRTL ? 'الطاولات' : 'Tables', badge: dirtyTablesCount },
    { tab: 'menu' as ActiveTab, icon: Salad, label: isRTL ? 'الأطعمة' : 'Food Menu', badge: 0 },
    { tab: 'orders' as ActiveTab, icon: ChefHat, label: isRTL ? 'المطبخ' : 'Kitchen', badge: activeOrdersCount },
    { tab: 'themes' as ActiveTab, icon: Palette, label: isRTL ? 'الثيمات' : 'Themes', badge: 0 },
    { tab: 'reports' as ActiveTab, icon: TrendingUp, label: isRTL ? 'التقارير' : 'Reports', badge: 0 },
    { tab: 'settings' as ActiveTab, icon: Settings, label: t.tabSettings },
  ];

  if (loading && !isGuestMode) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f2f2f7] dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <span className="text-sm text-slate-500">{isRTL ? 'جاري التحميل...' : 'Loading...'}</span>
        </div>
      </div>
    );
  }

  // ── Guest Mode: Standalone customer QR view ───────────────
  if (isGuestMode && guestRef.current) {
    const gid = guestRef.current.tableId;
    const guestTable = tables.find(tb => tb.id === gid) || { id: gid, number: '?', capacity: 4, status: 'ordering', qrCodeSeed: gid };
    const filteredMenu = filterMenuByRestaurant(menuItems);
    return (
      <GuestView
        restaurant={currentRestaurant}
        table={guestTable}
        menuItems={filteredMenu.length > 0 ? filteredMenu : menuItems}
        activeTheme={currentTheme}
        lang={lang}
        onSetLang={(l) => { setLang(l); api.saveSettings({ lang: l }).catch(() => {}); }}
        apiBase="/api"
      />
    );
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f2f2f7] text-slate-800 transition-colors duration-500 dark:bg-zinc-950 dark:text-zinc-100 font-sans" dir={isRTL ? 'rtl' : 'ltr'}>

        {/* Back button */}
        {activeTab !== 'dashboard' && (
          <div className="px-4 pt-3 max-w-5xl mx-auto">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setActiveTab('dashboard')} className="flex h-8 items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-bold shadow-sm backdrop-blur-md hover:bg-white dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 border border-slate-100 dark:border-zinc-700/40">
              <ChevronLeft size={14} className={isRTL ? 'rotate-180' : ''} />
              <span>{t.back}</span>
            </motion.button>
          </div>
        )}

        {/* Content */}
        <div className="px-4 pt-4 pb-28 md:px-8 max-w-5xl mx-auto" ref={contentRef}>
          <AnimatePresence mode="sync">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3, ease: 'easeOut' }}>
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom navigation */}
        <div className="fixed bottom-0 inset-x-0 z-30 flex justify-center px-4 pb-4 pt-2 bg-gradient-to-t from-[#f2f2f7] dark:from-zinc-950 to-transparent">
          <div className="flex items-center justify-around rounded-2xl bg-white/90 p-1.5 shadow-lg border border-slate-200/50 backdrop-blur-xl dark:bg-zinc-900/90 dark:border-zinc-800/60 w-full max-w-2xl">
            {navItems.map(({ tab, icon: Icon, label, badge }) => {
              const isActive = activeTab === tab;
              return (
                <button key={tab} onClick={() => setActiveTab(tab)} className={'relative flex flex-col items-center gap-1 rounded-2xl py-2 px-3 transition-all ' + (isActive ? 'bg-blue-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200')}>
                  <Icon size={16} />
                  {badge > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center shadow-md animate-pulse">
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                  <span className="text-[9px] font-bold tracking-tight">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
  );
}
