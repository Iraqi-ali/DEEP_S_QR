/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ChevronLeft, ArrowRight, ArrowLeft, Heart, Sparkles, Check, CheckCircle, Smartphone } from 'lucide-react';
import { MenuItem, Table, Restaurant, MenuTheme, OrderItem, Lang } from '../types';
import { THEMES_LIST, TRANSLATIONS } from '../data';

interface CustomerSimulatorViewProps {
  restaurant: Restaurant;
  table: Table;
  menuItems: MenuItem[];
  activeTheme: MenuTheme;
  onSubmitOrder: (items: Omit<OrderItem, 'id'>[]) => void;
  lang: Lang;
  onSetLang: (lang: Lang) => void;
}

export default function CustomerSimulatorView({
  restaurant,
  table,
  menuItems,
  activeTheme,
  onSubmitOrder,
  lang,
  onSetLang
}: CustomerSimulatorViewProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<Record<string, { item: MenuItem; qty: number; notes: string }>>({});
  const [showCart, setShowCart] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const t = TRANSLATIONS[lang];
  const isRTL = lang === 'ar';

  const categories = ['All', ...Array.from(new Set(menuItems.map(item => item.category)))];

  const handleAddToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev[item.id];
      return {
        ...prev,
        [item.id]: {
          item,
          qty: (existing?.qty || 0) + 1,
          notes: existing?.notes || ''
        }
      };
    });
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(prev => {
      const next = { ...prev };
      if (!next[itemId]) return prev;
      if (next[itemId].qty <= 1) {
        delete next[itemId];
      } else {
        next[itemId].qty -= 1;
      }
      return next;
    });
  };

  const handleUpdateItemNotes = (itemId: string, notes: string) => {
    setCart(prev => {
      if (!prev[itemId]) return prev;
      return {
        ...prev,
        [itemId]: {
          ...prev[itemId],
          notes
        }
      };
    });
  };

  const cartArray = Object.values(cart) as { item: MenuItem; qty: number; notes: string }[];
  const cartItemCount = cartArray.reduce((sum, c) => sum + c.qty, 0);

  // Math calculations
  const subtotal = cartArray.reduce((sum, c) => sum + c.item.price * c.qty, 0);
  const tax = subtotal * restaurant.taxRate;
  const service = subtotal > 0 ? restaurant.serviceCharge : 0;
  const total = subtotal + tax + service;

  const handlePlaceOrder = () => {
    if (cartItemCount === 0) return;
    const items = cartArray.map(c => ({
      menuItemId: c.item.id,
      quantity: c.qty,
      priceAtOrder: c.item.price,
      notes: c.notes || undefined
    }));
    onSubmitOrder(items);
    setCart({});
    setOrderSubmitted(true);
    setShowCart(false);
  };

  const currentThemeStyle = activeTheme || THEMES_LIST[0];

  return (
    <div className="space-y-6 flex flex-col items-center justify-center" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Simulation Notice Banner */}
      <div className="text-center w-full max-w-sm">
        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest font-sans flex items-center justify-center gap-1">
          <Smartphone size={12} className="animate-bounce" />
          {t.simTitle}
        </span>
        <p className="text-[11px] text-slate-500 mt-1 dark:text-zinc-400 font-sans">
          {t.simDesc}
        </p>
      </div>

      {/* iOS Mobile Device Simulator Shell Wrapper */}
      <div className="relative h-[660px] w-[320px] rounded-[2.5rem] bg-zinc-900 p-3 shadow-2xl border-4 border-zinc-800 flex flex-col overflow-hidden text-slate-900 select-none">
        {/* Dynamic Notch / Island decoration */}
        <div className="absolute top-1 inset-x-0 flex justify-center z-50 pointer-events-none">
          <div className="h-4.5 w-24 bg-black rounded-full" />
        </div>

        {/* Dynamic client container depending on active theme */}
        <div
          className={`flex-1 rounded-[2rem] overflow-hidden flex flex-col relative text-zinc-900 dark:text-zinc-100 ${currentThemeStyle.bgClass} ${currentThemeStyle.fontClass}`}
        >
          {/* Internal Mobile App Header */}
          <div className="pt-6 px-4 pb-3 flex items-center justify-between border-b border-black/5 dark:border-white/5 bg-white/40 dark:bg-zinc-950/25 backdrop-blur-md z-10 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xl">{restaurant.logo}</span>
              <div>
                <h5 className="text-[12px] font-extrabold tracking-tight">
                  {restaurant.name.split('|')[0]}
                </h5>
                <span className="text-[9px] text-slate-500 dark:text-zinc-400 font-bold">
                  {table.number} ({t.simTitle.split(' ')[0]})
                </span>
              </div>
            </div>

            {/* Language switch on mobile */}
            <button
              onClick={() => onSetLang(lang === 'ar' ? 'en' : 'ar')}
              className="text-[9px] font-bold bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded-full"
            >
              {lang === 'ar' ? 'EN' : 'العربية'}
            </button>
          </div>

          {/* Mobile Body viewports */}
          <div className="flex-1 overflow-y-auto px-4 py-3 pb-24 space-y-4">
            <AnimatePresence mode="wait">
              {orderSubmitted ? (
                /* Success ordering screen */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-center py-10 space-y-4 h-full"
                >
                  <div
                    className="h-16 w-16 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/10 animate-bounce"
                    style={{ backgroundColor: currentThemeStyle.primary }}
                  >
                    <CheckCircle size={36} />
                  </div>
                  <div>
                    <h4 className="text-[16px] font-extrabold tracking-tight">
                      {isRTL ? 'تم استلام طلبك!' : 'Order Placed!'}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 max-w-[200px] mx-auto font-sans">
                      {t.orderSent}
                    </p>
                  </div>
                  <button
                    onClick={() => setOrderSubmitted(false)}
                    className="text-[10px] font-bold px-4 py-1.5 rounded-full text-white"
                    style={{ backgroundColor: currentThemeStyle.primary }}
                  >
                    {isRTL ? 'طلب وجبات إضافية' : 'Order More Food'}
                  </button>
                </motion.div>
              ) : showCart ? (
                /* Mobile Cart view */
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4 h-full flex flex-col justify-between"
                >
                  <div className="flex items-center gap-1 border-b border-black/5 pb-2">
                    <button onClick={() => setShowCart(false)} className="text-slate-500">
                      {isRTL ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
                    </button>
                    <h4 className="text-[13px] font-black">{t.viewCart}</h4>
                  </div>

                  {cartArray.length === 0 ? (
                    <p className="text-center text-[11px] text-slate-400 py-12 font-sans">
                      {t.cartEmpty}
                    </p>
                  ) : (
                    <div className="space-y-3 flex-1 overflow-y-auto">
                      {cartArray.map(({ item, qty, notes }) => (
                        <div key={item.id} className="p-3 bg-white/80 dark:bg-zinc-900/60 rounded-2xl border border-black/5 dark:border-white/5 space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span>{isRTL ? item.nameAr : item.nameEn}</span>
                            <span className="font-mono">{(item.price * qty).toFixed(2)}</span>
                          </div>

                          {/* Notes input */}
                          <input
                            type="text"
                            placeholder={t.orderNotes}
                            value={notes}
                            onChange={(e) => handleUpdateItemNotes(item.id, e.target.value)}
                            className="w-full text-[10px] bg-black/5 rounded-lg px-2.5 py-1.5 outline-none font-sans"
                          />

                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => handleRemoveFromCart(item.id)}
                              className="h-6 w-6 rounded-full bg-black/5 flex items-center justify-center font-bold text-xs"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold font-mono self-center px-1">{qty}</span>
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="h-6 w-6 rounded-full text-white flex items-center justify-center font-bold text-xs"
                              style={{ backgroundColor: currentThemeStyle.primary }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pricing footer inside cart */}
                  {cartArray.length > 0 && (
                    <div className="border-t border-dashed border-black/10 pt-3 space-y-1.5 text-[11px] font-sans">
                      <div className="flex justify-between text-slate-500">
                        <span>{t.subtotal}</span>
                        <span>{subtotal.toFixed(2)} {restaurant.currency}</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>{t.tax}</span>
                        <span>{tax.toFixed(2)} {restaurant.currency}</span>
                      </div>
                      {service > 0 && (
                        <div className="flex justify-between text-slate-500">
                          <span>{t.service}</span>
                          <span>{service.toFixed(2)} {restaurant.currency}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-black text-xs border-t border-dashed border-black/10 pt-2">
                        <span>{isRTL ? 'إجمالي الدفع' : 'Total'}</span>
                        <span style={{ color: currentThemeStyle.primary }}>
                          {total.toFixed(2)} {restaurant.currency}
                        </span>
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePlaceOrder}
                        className="w-full py-2.5 rounded-full text-xs font-black text-white shadow-lg text-center"
                        style={{ backgroundColor: currentThemeStyle.primary }}
                      >
                        {t.checkout}
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              ) : (
                /* Mobile Menu list view */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Category Pill Sliders */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none shrink-0">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`rounded-full px-3 py-1 text-[10px] font-bold transition shrink-0 ${
                          selectedCategory === cat
                            ? 'text-white'
                            : 'bg-white/50 dark:bg-zinc-800/50 text-slate-500'
                        }`}
                        style={{
                          backgroundColor: selectedCategory === cat ? currentThemeStyle.primary : undefined
                        }}
                      >
                        {cat === 'All' ? t.filterAll : cat}
                      </button>
                    ))}
                  </div>

                  {/* Menu List */}
                  <div className="space-y-3 pb-6">
                    {menuItems
                      .filter(mi => selectedCategory === 'All' || mi.category === selectedCategory)
                      .map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start justify-between p-3 rounded-2xl bg-white/70 dark:bg-zinc-900/50 border border-white dark:border-zinc-800/40 relative shadow-sm"
                        >
                          {/* Item contents */}
                          <div className="flex-1 space-y-1 pr-2">
                            <div className="flex items-center gap-1">
                              {item.isPopular && (
                                <span className="text-[9px] bg-amber-100 text-amber-700 px-1 py-0.5 rounded font-bold font-sans">
                                  POPULAR
                                </span>
                              )}
                              <h5 className="text-[12px] font-extrabold text-slate-900 dark:text-white">
                                {isRTL ? item.nameAr : item.nameEn}
                              </h5>
                            </div>

                            <p className="text-[9px] text-slate-400 dark:text-zinc-400 line-clamp-2 font-sans">
                              {isRTL ? item.descriptionAr : item.descriptionEn}
                            </p>

                            <p className="text-xs font-bold text-slate-800 dark:text-zinc-100 font-mono">
                              {item.price.toFixed(2)} {restaurant.currency}
                            </p>
                          </div>

                          {/* Image & Plus Action */}
                          <div className="relative shrink-0 flex flex-col items-center space-y-1.5">
                            <span className="text-3xl p-2 bg-slate-50 rounded-xl dark:bg-zinc-900/80">{item.image}</span>

                            <button
                              onClick={() => handleAddToCart(item)}
                              className="h-6 w-12 rounded-full text-[10px] font-bold text-white flex items-center justify-center gap-1 shadow-sm transition"
                              style={{ backgroundColor: currentThemeStyle.primary }}
                            >
                              <span>+</span>
                              <span>{cart[item.id]?.qty || ''}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Floating Mobile Cart summary at bottom */}
          {!showCart && !orderSubmitted && cartItemCount > 0 && (
            <div className="absolute bottom-4 inset-x-3 z-20">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCart(true)}
                className="w-full py-2.5 rounded-full text-white font-bold text-xs flex items-center justify-between px-4 shadow-xl shadow-black/10"
                style={{ backgroundColor: currentThemeStyle.primary }}
              >
                <div className="flex items-center gap-1.5">
                  <ShoppingBag size={14} />
                  <span>({cartItemCount}) {isRTL ? 'وجبة في السلة' : 'Items'}</span>
                </div>
                <span>{subtotal.toFixed(2)} {restaurant.currency}</span>
              </motion.button>
            </div>
          )}

          {/* iOS bottom safe margin line */}
          <div className="absolute bottom-1.5 inset-x-0 flex justify-center pointer-events-none">
            <div className="h-1 w-20 rounded-full bg-slate-300 dark:bg-zinc-700/60" />
          </div>
        </div>
      </div>
    </div>
  );
}
