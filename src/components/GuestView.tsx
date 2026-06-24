/**
 * GuestView - Standalone Customer QR Page 🇮🇶
 * What customers see when scanning a table QR code
 */
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ArrowRight, ArrowLeft, CheckCircle, Bell, Clock, ChefHat, Check } from 'lucide-react';
import type { MenuItem, Table, Restaurant, MenuTheme, OrderItem, Order, Lang } from '../types';
import { THEMES_LIST, TRANSLATIONS } from '../data';

interface GuestViewProps {
  restaurant: Restaurant;
  table: Table;
  menuItems: MenuItem[];
  activeTheme: MenuTheme;
  lang: Lang;
  onSetLang: (lang: Lang) => void;
  apiBase: string;
}

export default function GuestView({ restaurant, table, menuItems, activeTheme, lang, onSetLang, apiBase }: GuestViewProps) {
  const t = TRANSLATIONS[lang];
  const isRTL = lang === 'ar';

  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState<Record<string, { item: MenuItem; qty: number; notes: string }>>({});
  const [showCart, setShowCart] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<string>('');
  const [waiterCalled, setWaiterCalled] = useState(false);
  const [showMenu, setShowMenu] = useState(true);

  const categories = ['All', ...Array.from(new Set(menuItems.map(i => i.category)))];

  // Poll order status
  useEffect(() => {
    if (!currentOrderId) return;
    const poll = setInterval(async () => {
      try {
        const res = await fetch(`${apiBase}/orders`);
        const orders: Order[] = await res.json();
        const order = orders.find(o => o.id === currentOrderId);
        if (order) setOrderStatus(order.status);
      } catch {}
    }, 5000);
    return () => clearInterval(poll);
  }, [currentOrderId, apiBase]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const ex = prev[item.id];
      return { ...prev, [item.id]: { item, qty: (ex?.qty || 0) + 1, notes: ex?.notes || '' } };
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const next = { ...prev };
      if (!next[id]) return prev;
      if (next[id].qty <= 1) delete next[id];
      else next[id].qty -= 1;
      return next;
    });
  };

  const updateNotes = (id: string, notes: string) => {
    setCart(prev => prev[id] ? { ...prev, [id]: { ...prev[id], notes } } : prev);
  };

  const cartArr = Object.values(cart);
  const cartCount = cartArr.reduce((s, c) => s + c.qty, 0);
  const subtotal = cartArr.reduce((s, c) => s + c.item.price * c.qty, 0);
  const tax = subtotal * restaurant.taxRate;
  const service = subtotal > 0 ? restaurant.serviceCharge : 0;

  const placeOrder = async () => {
    if (cartCount === 0) return;
    const items = cartArr.map(c => ({ menuItemId: c.item.id, quantity: c.qty, priceAtOrder: c.item.price, notes: c.notes || '' }));
    const order = {
      id: `order-${Date.now()}`,
      tableId: table.id,
      restaurantId: restaurant.id,
      items: items.map((it, idx) => ({ id: `oi-${idx}-${Date.now()}`, ...it })),
      subtotal, tax, service, total: subtotal + tax + service,
      status: 'pending', createdAt: new Date().toISOString()
    };
    try {
      await fetch(`${apiBase}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) });
      setCurrentOrderId(order.id);
      setOrderStatus('pending');
      setOrderPlaced(true);
      setCart({});
      setShowCart(false);
      setShowMenu(false);
    } catch {}
  };

  const callWaiter = async () => {
    setWaiterCalled(true);
    try {
      await fetch(`${apiBase}/tables/${table.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'waiting' })
      });
    } catch {}
    setTimeout(() => setWaiterCalled(false), 8000);
  };

  const theme = activeTheme || THEMES_LIST[0];

  const statusSteps = [
    { key: 'pending', icon: Clock, label: isRTL ? 'قيد الانتظار' : 'Pending' },
    { key: 'preparing', icon: ChefHat, label: isRTL ? 'قيد التحضير' : 'Preparing' },
    { key: 'ready', icon: Check, label: isRTL ? 'جاهز' : 'Ready' },
    { key: 'served', icon: CheckCircle, label: isRTL ? 'تم التقديم' : 'Served' },
  ];

  const currentStep = statusSteps.findIndex(s => s.key === orderStatus);

  return (
    <div className={`min-h-screen ${theme.bgClass} ${theme.fontClass}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-lg mx-auto min-h-screen flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-black/5 dark:border-white/5 bg-white/30 dark:bg-zinc-950/20 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{restaurant.logo}</span>
            <div>
              <h5 className="text-[15px] font-extrabold">{restaurant.name}</h5>
              <p className="text-[10px] opacity-60">{table.number} • {restaurant.city}</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <button onClick={callWaiter} className={`p-2 rounded-full text-xs font-bold transition ${waiterCalled ? 'bg-amber-500 text-white' : 'bg-black/5 dark:bg-white/10 hover:bg-black/10'}`} title={isRTL ? 'استدعاء نادل' : 'Call Waiter'}>
              <Bell size={15} />
            </button>
            <button onClick={() => onSetLang(lang === 'ar' ? 'en' : 'ar')} className="text-[10px] font-bold bg-black/5 dark:bg-white/10 px-2.5 py-1 rounded-full">
              {lang === 'ar' ? 'EN' : 'AR'}
            </button>
          </div>
        </div>

        {/* Waiter notification */}
        <AnimatePresence>
          {waiterCalled && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mx-4 mt-2 p-3 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-center text-[11px] font-bold text-amber-700 shadow-sm">
              {isRTL ? '✅ تم استدعاء النادل - سيأتي إليك قريباً' : '✅ Waiter called - coming soon!'}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 pb-28">
            <AnimatePresence mode="wait">
              {orderPlaced ? (
                <motion.div key="tracking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 py-4">
                  <div className="text-center">
                    <div className="mx-auto h-14 w-14 rounded-full flex items-center justify-center text-white shadow-lg mb-3" style={{ backgroundColor: theme.primary }}>
                      <CheckCircle size={30} />
                    </div>
                    <h4 className="text-[15px] font-extrabold">{isRTL ? 'تم تسجيل طلبك! 🎉' : 'Order Placed! 🎉'}</h4>
                    <p className="text-[11px] opacity-60 mt-1">{isRTL ? 'سيتم تحضير طلبك قريباً' : 'Your order is being prepared'}</p>
                  </div>

                  {/* Status tracker */}
                  <div className="space-y-3">
                    {statusSteps.map((step, i) => {
                      const done = i <= currentStep;
                      const active = i === currentStep;
                      return (
                        <div key={step.key} className={`flex items-center gap-3 p-3 rounded-xl transition ${active ? 'bg-white/80 dark:bg-zinc-900/60 shadow-sm' : 'opacity-50'}`}>
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${done ? 'text-white' : 'bg-black/5 dark:bg-white/5'}`} style={done ? { backgroundColor: theme.primary } : {}}>
                            <step.icon size={14} />
                          </div>
                          <span className="text-[12px] font-bold">{step.label}</span>
                          {done && <CheckCircle size={12} className="ml-auto text-green-500" />}
                        </div>
                      );
                    })}
                  </div>

                  <button onClick={() => { setOrderPlaced(false); setShowMenu(true); }} className="w-full rounded-full py-2.5 text-xs font-bold text-white mb-2" style={{ backgroundColor: theme.primary }}>
                    {isRTL ? 'طلب المزيد 🍽️' : 'Order More 🍽️'}
                  </button>
                  <button onClick={callWaiter} className="w-full rounded-full py-2.5 text-xs font-bold border-2 border-amber-400 text-amber-600 dark:text-amber-400">
                    {isRTL ? '🧾 طلب الفاتورة / استدعاء النادل' : '🧾 Request Bill / Call Waiter'}
                  </button>
                </motion.div>
              ) : showCart ? (
                <motion.div key="cart" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 h-full flex flex-col">
                  <div className="flex items-center gap-2 border-b border-black/5 pb-2">
                    <button onClick={() => setShowCart(false)} className="opacity-50">{isRTL ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}</button>
                    <h4 className="text-[13px] font-black">{isRTL ? 'سلة المشتريات' : 'Your Cart'}</h4>
                  </div>
                  {cartArr.length === 0 ? (
                    <p className="text-center text-[11px] opacity-40 py-12">{isRTL ? 'السلة فارغة' : 'Cart is empty'}</p>
                  ) : (
                    <div className="space-y-2 flex-1 overflow-y-auto">
                      {cartArr.map(({ item, qty, notes }) => (
                        <div key={item.id} className="p-3 bg-white/60 dark:bg-zinc-900/40 rounded-2xl space-y-2">
                          <div className="flex justify-between text-xs font-bold">
                            <span>{isRTL ? item.nameAr : item.nameEn}</span>
                            <span>{(item.price * qty).toLocaleString()} {restaurant.currency}</span>
                          </div>
                          <input value={notes} onChange={e => updateNotes(item.id, e.target.value)} placeholder={isRTL ? 'ملاحظات...' : 'Notes...'} className="w-full text-[10px] bg-black/5 rounded-lg px-2 py-1.5 outline-none" />
                          <div className="flex justify-end gap-1">
                            <button onClick={() => removeFromCart(item.id)} className="h-6 w-6 rounded-full bg-black/5 flex items-center justify-center text-xs font-bold">-</button>
                            <span className="text-xs font-bold self-center px-1">{qty}</span>
                            <button onClick={() => addToCart(item)} className="h-6 w-6 rounded-full text-white flex items-center justify-center text-xs font-bold" style={{ backgroundColor: theme.primary }}>+</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {cartArr.length > 0 && (
                    <div className="border-t border-dashed border-black/10 pt-2 space-y-1 text-[11px]">
                      <div className="flex justify-between"><span>{isRTL ? 'المجموع' : 'Subtotal'}</span><span>{subtotal.toLocaleString()} {restaurant.currency}</span></div>
                      <div className="flex justify-between opacity-60"><span>{isRTL ? 'ضريبة' : 'Tax'}</span><span>{tax.toLocaleString()}</span></div>
                      <div className="flex justify-between opacity-60"><span>{isRTL ? 'خدمة' : 'Service'}</span><span>{service.toLocaleString()}</span></div>
                      <div className="flex justify-between font-extrabold text-[13px] pt-1 border-t border-black/10"><span>{isRTL ? 'الإجمالي' : 'Total'}</span><span>{(subtotal + tax + service).toLocaleString()} {restaurant.currency}</span></div>
                      <button onClick={placeOrder} className="w-full rounded-full py-2.5 mt-2 text-xs font-bold text-white" style={{ backgroundColor: theme.primary }}>
                        {isRTL ? 'إرسال الطلب 🚀' : 'Place Order 🚀'}
                      </button>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  {/* Categories */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1">
                    {categories.map(cat => (
                      <button key={cat} onClick={() => setCategory(cat)} className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold transition ${category === cat ? 'text-white' : 'bg-black/5 dark:bg-white/5'}`} style={category === cat ? { backgroundColor: theme.primary } : {}}>
                        {cat === 'All' ? (isRTL ? 'الكل' : 'All') : cat}
                      </button>
                    ))}
                  </div>
                  {/* Menu items */}
                  <div className="space-y-3">
                    {menuItems.filter(i => category === 'All' || i.category === category).map(item => {
                      const inCart = cart[item.id];
                      const qty = inCart?.qty || 0;
                      return (
                        <div key={item.id} className="p-3 bg-white/50 dark:bg-zinc-900/30 rounded-2xl flex items-center gap-3">
                          <span className="text-3xl shrink-0">{item.image}</span>
                          <div className="flex-1 min-w-0">
                            <h6 className="text-[13px] font-extrabold truncate">{isRTL ? item.nameAr : item.nameEn}</h6>
                            <p className="text-[10px] opacity-50 truncate">{isRTL ? item.descriptionAr : item.descriptionEn}</p>
                            <p className="text-[11px] font-bold mt-1">{item.price.toLocaleString()} {restaurant.currency}</p>
                          </div>
                          <div className="shrink-0 flex items-center gap-1">
                            {qty > 0 && (
                              <>
                                <button onClick={() => removeFromCart(item.id)} className="h-7 w-7 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center text-sm font-bold hover:bg-black/20">-</button>
                                <span className="text-xs font-bold w-5 text-center">{qty}</span>
                              </>
                            )}
                            <button onClick={() => addToCart(item)} className="h-7 w-7 rounded-full text-white flex items-center justify-center text-sm font-bold" style={{ backgroundColor: theme.primary }}>+</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        {/* Bottom cart bar */}
        {!orderPlaced && (
          <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto z-30 px-4 pb-4 pt-2 bg-gradient-to-t from-white/90 dark:from-zinc-950/90 to-transparent">
            <button onClick={() => setShowCart(!showCart)} className="w-full flex items-center justify-between rounded-full py-3.5 px-5 text-white text-sm font-bold shadow-lg" style={{ backgroundColor: theme.primary }}>
              <div className="flex items-center gap-2">
                <ShoppingBag size={16} />
                <span>{cartCount} {isRTL ? 'منتج' : 'items'}</span>
              </div>
              <span>{(subtotal + tax + service).toLocaleString()} {restaurant.currency}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
