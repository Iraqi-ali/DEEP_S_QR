/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChefHat, CheckCircle2, ChevronRight, ChevronLeft, Clock, Printer, X, CreditCard, DollarSign } from 'lucide-react';
import { Order, MenuItem, Table, Restaurant, Lang } from '../types';
import { TRANSLATIONS } from '../data';

interface OrdersViewProps {
  orders: Order[];
  menuItems: MenuItem[];
  tables: Table[];
  restaurants: Restaurant[];
  activeRestaurantId: string;
  onUpdateOrderStatus: (id: string, status: Order['status'], paymentMethod?: Order['paymentMethod']) => void;
  lang: Lang;
}

export default function OrdersView({
  orders,
  menuItems,
  tables,
  restaurants,
  activeRestaurantId,
  onUpdateOrderStatus,
  lang
}: OrdersViewProps) {
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');

  const t = TRANSLATIONS[lang];
  const isRTL = lang === 'ar';

  const currentRestaurant = restaurants.find(r => r.id === activeRestaurantId) || restaurants[0];

  const getTableNumber = (tableId: string) => {
    return tables.find(tb => tb.id === tableId)?.number || tableId;
  };

  const getMenuItemName = (menuItemId: string) => {
    const item = menuItems.find(mi => mi.id === menuItemId);
    if (!item) return menuItemId;
    return isRTL ? item.nameAr : item.nameEn;
  };

  const getStatusBadgeClass = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-850 dark:bg-amber-950/40 dark:text-amber-400';
      case 'preparing':
        return 'bg-blue-100 text-blue-850 dark:bg-blue-950/40 dark:text-blue-400';
      case 'ready':
        return 'bg-purple-100 text-purple-850 dark:bg-purple-950/40 dark:text-purple-400';
      case 'served':
        return 'bg-emerald-100 text-emerald-850 dark:bg-emerald-950/40 dark:text-emerald-400';
      case 'paid':
        return 'bg-slate-100 text-slate-800 dark:bg-zinc-800 dark:text-zinc-300';
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'pending': return t.orderStatusPending;
      case 'preparing': return t.orderStatusPreparing;
      case 'ready': return t.orderStatusReady;
      case 'served': return t.orderStatusServed;
      case 'paid': return t.orderStatusPaid;
    }
  };

  const getNextStatus = (current: Order['status']): Order['status'] | null => {
    switch (current) {
      case 'pending': return 'preparing';
      case 'preparing': return 'ready';
      case 'ready': return 'served';
      case 'served': return 'paid';
      default: return null;
    }
  };

  const isPayBefore = currentRestaurant.paymentMode === 'before';
  const activeOrders = orders.filter(o => {
    if (o.status === 'paid') return false;
    if (isPayBefore && o.status === 'pending') return false; // awaiting payment
    return true;
  });
  const pendingPaymentOrders = isPayBefore ? orders.filter(o => o.status === 'pending') : [];
  const paidOrders = orders.filter(o => o.status === 'paid');

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Title Header */}
      <div className="px-1">
        <h2 className="text-2xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          {t.ordersTitle}
        </h2>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 font-sans mt-1">
          {t.ordersDesc}
        </p>
      </div>

      {/* Main Grid: Live Kitchen Feed */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800 pb-3">
          <ChefHat className="text-blue-500 dark:text-blue-400" size={18} />
          <h3 className="text-[14px] font-display font-extrabold text-slate-800 dark:text-zinc-200">
            {isRTL ? `الطلبات النشطة بالمطبخ (${activeOrders.length})` : `Active Kitchen Tickets (${activeOrders.length})`}
          </h3>
        </div>

        {activeOrders.length === 0 ? (
          <div className="rounded-[2rem] bg-white/50 border border-dashed border-slate-200 p-12 text-center text-slate-400 dark:bg-zinc-900/40 dark:border-zinc-800 font-sans">
            {isRTL ? 'لا توجد طلبات نشطة حالياً.' : 'No active kitchen tickets.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {activeOrders.map((order) => {
                const next = getNextStatus(order.status);
                const tableNum = getTableNumber(order.tableId);
                const orderTime = new Date(order.createdAt).toLocaleTimeString(isRTL ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' });

                return (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col justify-between overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-black/5 border border-slate-100 dark:bg-zinc-900 dark:border-zinc-800/80 p-5 space-y-4"
                  >
                    {/* Ticket Header */}
                    <div className="flex items-center justify-between border-b border-slate-50 dark:border-zinc-800 pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">
                          {t.orderNo}
                        </span>
                        <h4 className="font-mono text-sm font-black text-slate-900 dark:text-white">
                          #{order.id.split('-')[1] || order.id}
                        </h4>
                      </div>

                      <div className="text-right">
                        <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">
                          {tableNum}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 justify-end font-sans">
                          <Clock size={10} />
                          <span>{orderTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Food Items list */}
                    <div className="flex-1 space-y-2.5 my-1">
                      {order.items.map((item) => (
                        <div key={item.id} className="text-xs">
                          <div className="flex items-start justify-between">
                            <span className="text-slate-800 dark:text-zinc-200 font-extrabold">
                              {item.quantity} x {getMenuItemName(item.menuItemId)}
                            </span>
                            <span className="font-mono text-slate-400">
                              {(item.priceAtOrder * item.quantity).toFixed(2)}
                            </span>
                          </div>
                          {item.notes && (
                            <p className="text-[10px] text-amber-600 bg-amber-50/50 rounded px-2 py-0.5 mt-0.5 dark:text-amber-400 dark:bg-amber-950/20 font-sans">
                              ⚠️ {item.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Ticket Price info */}
                    <div className="border-t border-slate-50 dark:border-zinc-800 pt-3">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-sans">
                        <span>{t.subtotal}</span>
                        <span>{order.subtotal.toFixed(2)} {currentRestaurant.currency}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-sans mt-0.5">
                        <span>{t.tax}</span>
                        <span>{order.tax.toFixed(2)} {currentRestaurant.currency}</span>
                      </div>
                      {order.service > 0 && (
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-sans mt-0.5">
                          <span>{t.service}</span>
                          <span>{order.service.toFixed(2)} {currentRestaurant.currency}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-white mt-1 border-t border-dashed border-slate-100 pt-1.5">
                        <span>{isRTL ? 'المجموع النهائي' : 'Grand Total'}</span>
                        <span className="font-mono text-blue-500 font-black">
                          {order.total.toFixed(2)} {currentRestaurant.currency}
                        </span>
                      </div>
                    </div>

                    {/* Actions and status flow */}
                    <div className="flex items-center justify-between gap-2 border-t border-slate-50 dark:border-zinc-800 pt-3">
                      {/* Ticket Status */}
                      <span className={`rounded-lg px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${getStatusBadgeClass(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>

                      {/* Next State Button or Print Button */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedReceiptOrder(order)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-slate-500 hover:text-blue-500 hover:bg-blue-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-blue-950/20 transition"
                          title={t.printReceipt}
                        >
                          <Printer size={13} />
                        </button>

                        {next && (
                          <button
                            onClick={() => {
                              if (next === 'paid') {
                                // Trigger paid
                                onUpdateOrderStatus(order.id, 'paid', paymentMethod);
                              } else {
                                onUpdateOrderStatus(order.id, next);
                              }
                            }}
                            className="group flex h-8 items-center gap-1 rounded-full bg-blue-500 hover:bg-blue-600 text-white px-3.5 text-[10px] font-bold shadow-lg shadow-blue-500/15 transition-all"
                          >
                            <span>{getStatusLabel(next)}</span>
                            {isRTL ? (
                              <ChevronLeft size={11} className="group-hover:-translate-x-0.5 transition-transform" />
                            ) : (
                              <ChevronRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Historical Finished Orders Table */}
      <div className="rounded-[2rem] bg-white/70 backdrop-blur-xl shadow-xl shadow-black/5 border border-white/50 dark:bg-zinc-900/70 dark:border-zinc-800/50 overflow-hidden mt-8">
        <div className="p-5 border-b border-slate-50 dark:border-zinc-800/50">
          <h3 className="text-[14px] font-display font-extrabold text-slate-800 dark:text-zinc-200">
            {isRTL ? 'أرشيف الفواتير والطلبات المسددة' : 'Finished Invoices & Archive'}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left" dir={isRTL ? 'rtl' : 'ltr'}>
            <thead className="bg-slate-50/50 text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100/50 dark:bg-zinc-950/50 dark:border-zinc-800/50 dark:text-zinc-500">
              <tr>
                <th className="px-6 py-3">{isRTL ? 'رقم الفاتورة' : 'Invoice ID'}</th>
                <th className="px-6 py-3">{t.table}</th>
                <th className="px-6 py-3">{t.date}</th>
                <th className="px-6 py-3">{isRTL ? 'طريقة الدفع' : 'Payment'}</th>
                <th className="px-6 py-3">{t.amount}</th>
                <th className="px-6 py-3 text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/60 dark:divide-zinc-800/40 text-xs font-semibold text-slate-700 dark:text-zinc-300">
              {paidOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/30 dark:hover:bg-zinc-900/10 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">
                    #{order.id.split('-')[1]}
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded bg-slate-100 dark:bg-zinc-850 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-zinc-300">
                      {getTableNumber(order.tableId)}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-400">
                    {new Date(order.createdAt).toLocaleString(isRTL ? 'ar-SA' : 'en-US', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1">
                      {order.paymentMethod === 'card' ? (
                        <>
                          <CreditCard size={12} className="text-blue-500" />
                          <span>{isRTL ? 'بطاقة بنكية' : 'Card'}</span>
                        </>
                      ) : (
                        <>
                          <DollarSign size={12} className="text-emerald-500" />
                          <span>{isRTL ? 'نقدي' : 'Cash'}</span>
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-black text-blue-500">
                    {order.total.toFixed(2)} {currentRestaurant.currency}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setSelectedReceiptOrder(order)}
                      className="inline-flex h-7 px-2.5 items-center justify-center gap-1 rounded-full bg-slate-50 border border-slate-100 hover:text-blue-500 hover:bg-blue-50 dark:bg-zinc-850 dark:border-zinc-800 transition"
                    >
                      <Printer size={11} />
                      <span className="text-[10px] font-bold">{isRTL ? 'عرض الفاتورة' : 'View'}</span>
                    </button>
                  </td>
                </tr>
              ))}
              {paidOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-6 text-center text-slate-400 font-sans">
                    {isRTL ? 'لم يتم سداد أو إنهاء أي طلبات بعد.' : 'No settled invoices archived yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* BREATHTAKING THERMAL RECEIPT PRINTER POPUP MODAL */}
      <AnimatePresence>
        {selectedReceiptOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative flex flex-col w-full max-w-[360px] bg-white rounded-3xl p-6 shadow-2xl text-zinc-950 border border-slate-200"
              style={{ fontFamily: 'Courier New, Courier, monospace' }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
              >
                <X size={15} />
              </button>

              {/* Thermal Receipt Paper roll layout */}
              <div className="flex-1 overflow-y-auto space-y-4 pt-4 pr-1 text-xs">
                {/* Header Restaurant details */}
                <div className="text-center space-y-1.5 border-b border-dashed border-zinc-300 pb-4">
                  <span className="text-3xl">{currentRestaurant.logo}</span>
                  <h4 className="text-[15px] font-black tracking-tight uppercase">
                    {currentRestaurant.name}
                  </h4>
                  <p className="text-[10px] text-zinc-500 font-sans">
                    {currentRestaurant.address}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-sans">
                    {currentRestaurant.phone}
                  </p>
                </div>

                {/* Receipt Metadata */}
                <div className="space-y-1 border-b border-dashed border-zinc-300 pb-3 font-sans">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-bold">INVOICE ID:</span>
                    <span>#{selectedReceiptOrder.id.split('-')[1]}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="font-bold">TABLE:</span>
                    <span className="font-mono">{getTableNumber(selectedReceiptOrder.tableId)}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="font-bold">DATE:</span>
                    <span>
                      {new Date(selectedReceiptOrder.createdAt).toLocaleString(isRTL ? 'ar-SA' : 'en-US', { hour12: false })}
                    </span>
                  </div>
                  {selectedReceiptOrder.paymentMethod && (
                    <div className="flex justify-between text-[11px]">
                      <span className="font-bold">PAYMENT:</span>
                      <span className="uppercase">{selectedReceiptOrder.paymentMethod}</span>
                    </div>
                  )}
                </div>

                {/* Receipt Line Items */}
                <div className="space-y-2 border-b border-dashed border-zinc-300 pb-3">
                  <div className="flex justify-between text-[10px] font-bold text-zinc-500 border-b border-dashed border-zinc-200 pb-1 font-sans">
                    <span>ITEM DESCRIPTION</span>
                    <span>TOTAL</span>
                  </div>

                  {selectedReceiptOrder.items.map((item) => (
                    <div key={item.id} className="space-y-0.5">
                      <div className="flex justify-between font-bold">
                        <span>
                          {item.quantity} x {getMenuItemName(item.menuItemId)}
                        </span>
                        <span className="font-mono">
                          {(item.priceAtOrder * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      {item.notes && (
                        <p className="text-[10px] text-zinc-500 italic pl-2 font-sans">
                          * Note: {item.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Totals & Taxes */}
                <div className="space-y-1.5 border-b border-dashed border-zinc-300 pb-4 font-sans text-[11px]">
                  <div className="flex justify-between">
                    <span>{isRTL ? 'المجموع الفرعي' : 'SUBTOTAL'}:</span>
                    <span className="font-mono">{selectedReceiptOrder.subtotal.toLocaleString()} {currentRestaurant.currency}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>{isRTL ? 'ضريبة' : 'TAX'}:</span>
                    <span className="font-mono">+{selectedReceiptOrder.tax.toLocaleString()} {currentRestaurant.currency}</span>
                  </div>
                  {selectedReceiptOrder.service > 0 && (
                    <div className="flex justify-between text-zinc-500">
                      <span>{isRTL ? 'رسوم خدمة' : 'SERVICE'}:</span>
                      <span className="font-mono">+{selectedReceiptOrder.service.toLocaleString()} {currentRestaurant.currency}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-black border-t border-dashed border-zinc-300 pt-2 text-zinc-950 font-mono">
                    <span>{isRTL ? 'الإجمالي' : 'TOTAL'}:</span>
                    <span>{selectedReceiptOrder.total.toLocaleString()} {currentRestaurant.currency}</span>
                  </div>
                </div>

                {/* Receipt Barcode & Greeting */}
                <div className="text-center space-y-3 pt-2 font-sans">
                  {/* Decorative Barcode */}
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <div className="h-8 w-44 bg-[repeating-linear-gradient(90deg,black,black_2px,transparent_2px,transparent_5px)] opacity-85" />
                    <span className="text-[9px] font-mono tracking-widest text-zinc-400">
                      *T-{selectedReceiptOrder.id.split('-')[1]}*
                    </span>
                  </div>

                  <p className="text-[10px] font-bold text-zinc-500 tracking-tight uppercase">
                    {isRTL ? 'شكراً لزيارتكم - نسخة الزبون 🧾' : 'Thank you - Customer Copy 🧾'}
                  </p>
                </div>
              </div>

              {/* Action trigger button inside modal */}
              <div className="mt-5 border-t border-slate-100 pt-4 flex gap-2 font-sans">
                {selectedReceiptOrder.status === 'served' && (
                  <div className="flex-1 flex gap-1">
                    <button
                      onClick={() => onUpdateOrderStatus(selectedReceiptOrder.id, 'paid', 'cash')}
                      className="flex-1 flex h-10 items-center justify-center gap-1 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition"
                    >
                      💵 {isRTL ? 'نقدي' : 'Cash'}
                    </button>
                    <button
                      onClick={() => onUpdateOrderStatus(selectedReceiptOrder.id, 'paid', 'card')}
                      className="flex-1 flex h-10 items-center justify-center gap-1 rounded-xl bg-blue-500 text-white text-xs font-bold hover:bg-blue-600 transition"
                    >
                      💳 {isRTL ? 'شبكة' : 'Card'}
                    </button>
                  </div>
                )}
                <button
                  onClick={() => {
                    // Trigger native print flow with a prompt
                    window.print();
                  }}
                  className="flex h-10 px-4 items-center justify-center gap-1 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 transition"
                >
                  <Printer size={13} />
                  <span>{isRTL ? 'طباعة' : 'Print'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
