/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { TrendingUp, Users, ChefHat, Award, ArrowLeft, ArrowRight, Table as TableIcon, CheckCircle, Flame, Clock, Smartphone } from 'lucide-react';
import { Order, MenuItem, Table, Restaurant, Lang } from '../types';
import { TRANSLATIONS } from '../data';

interface DashboardViewProps {
  orders: Order[];
  menuItems: MenuItem[];
  tables: Table[];
  restaurants: Restaurant[];
  activeRestaurantId: string;
  lang: Lang;
  onNavigate: (tab: any) => void;
  onSimulateScan: (tableId: string) => void;
  onUpdateTableStatus?: (tableId: string, status: Table['status']) => void;
}

export default function DashboardView({
  orders,
  menuItems,
  tables,
  restaurants,
  activeRestaurantId,
  lang,
  onNavigate,
  onSimulateScan,
  onUpdateTableStatus
}: DashboardViewProps) {
  const isRTL = lang === 'ar';
  const t = TRANSLATIONS[lang];

  const currentRestaurant = restaurants.find(r => r.id === activeRestaurantId) || restaurants[0];

  const paidOrders = orders.filter(o => o.status === 'paid');
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const activeOrders = orders.filter(o => o.status !== 'paid');

  // Math KPI Calculations
  const totalSalesVal = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const activeTablesCount = tables.filter(tb => tb.status !== 'empty').length;
  const occupancyRate = tables.length > 0 ? Math.round((activeTablesCount / tables.length) * 100) : 0;

  // Efficiency/Success Rate: Percentage of orders completed relative to total received
  const completionRate = orders.length > 0 ? Math.round((paidOrders.length / orders.length) * 100) : 100;

  const averageOrderValue = paidOrders.length > 0 ? totalSalesVal / paidOrders.length : 0;

  // Retrieve Bestselling Dish (dish with maximum quantity across all orders)
  const dishQuantities: Record<string, number> = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      dishQuantities[item.menuItemId] = (dishQuantities[item.menuItemId] || 0) + item.quantity;
    });
  });

  const bestSellerId = Object.entries(dishQuantities)
    .sort((a, b) => b[1] - a[1])[0]?.[0];

  const bestSellerItem = menuItems.find(mi => mi.id === bestSellerId);
  const bestSellerCount = bestSellerId ? dishQuantities[bestSellerId] : 0;

  const getTableColor = (status: Table['status']) => {
    switch (status) {
      case 'empty': return 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30';
      case 'ordering': return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30';
      case 'waiting': return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30';
      case 'eating': return 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30';
      case 'dirty': return 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30';
    }
  };

  const getTableLabel = (status: Table['status']) => {
    switch (status) {
      case 'empty': return t.statusEmpty;
      case 'ordering': return t.statusOrdering;
      case 'waiting': return t.statusWaiting;
      case 'eating': return t.statusEating;
      case 'dirty': return t.statusDirty;
    }
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Title & Restaurant Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div>
          <span className="text-[10px] bg-blue-500 text-white px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest font-sans">
            {t.statusConnected}
          </span>
          <h2 className="text-2xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl mt-1.5">
            {currentRestaurant.logo} {currentRestaurant.name}
          </h2>
          <p className="text-[12px] text-slate-500 dark:text-zinc-400 font-sans mt-0.5">
            {t.tagline}
          </p>
        </div>

        {/* Quick Simulator Link Button */}
        <button
          onClick={() => onNavigate('customer-simulator')}
          className="flex h-10 px-5 items-center justify-center gap-1.5 rounded-full bg-blue-500 text-white text-xs font-black shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition"
        >
          <span>{isRTL ? 'جرب واجهة الزبون 📱' : 'Launch Guest View 📱'}</span>
        </button>
      </div>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Sales Revenue */}
        <motion.div
          whileHover={{ y: -3 }}
          className="rounded-[2rem] bg-white p-5 shadow-xl shadow-black/5 border border-slate-100 dark:bg-zinc-900 dark:border-zinc-800/80 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {t.totalSales}
            </span>
            <div className="rounded-full bg-blue-50 p-2 dark:bg-blue-950/40">
              <TrendingUp size={14} className="text-blue-500" />
            </div>
          </div>
          <div className="my-3">
            <h3 className="text-2xl font-mono font-black text-slate-900 dark:text-white">
              {totalSalesVal.toFixed(2)} <span className="text-xs">{currentRestaurant.currency}</span>
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-sans mt-1">
              {isRTL ? 'من مبيعات الطاولات المسددة' : 'From settled mobile orders'}
            </p>
          </div>
          <div className="border-t border-slate-50 dark:border-zinc-800/60 pt-2.5 flex items-center justify-between text-[11px] font-sans">
            <span className="text-slate-400">{isRTL ? 'متوسط الفاتورة:' : 'Avg Order:'}</span>
            <span className="font-mono font-bold text-blue-500">{averageOrderValue.toFixed(1)} {currentRestaurant.currency}</span>
          </div>
        </motion.div>

        {/* Card 2: Table Occupancy rate */}
        <motion.div
          whileHover={{ y: -3 }}
          className="rounded-[2rem] bg-white p-5 shadow-xl shadow-black/5 border border-slate-100 dark:bg-zinc-900 dark:border-zinc-800/80 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {t.activeTablesCount}
            </span>
            <div className="rounded-full bg-indigo-50 p-2 dark:bg-indigo-950/40">
              <Users size={14} className="text-indigo-500" />
            </div>
          </div>
          <div className="my-3 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-mono font-black text-slate-900 dark:text-white">
                {occupancyRate}%
              </h3>
              <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-sans mt-1">
                {activeTablesCount} {isRTL ? 'طاولات مشغولة' : 'Occupied tables'}
              </p>
            </div>
            {/* Occupancy circular widget */}
            <div className="relative h-11 w-11">
              <svg className="h-full w-full -rotate-90">
                <circle cx="22" cy="22" r="18" stroke="currentColor" className="text-indigo-50 dark:text-indigo-950/20" strokeWidth="3" fill="none" />
                <circle
                  cx="22" cy="22" r="18" stroke="currentColor" className="text-indigo-500" strokeWidth="3" fill="none"
                  strokeDasharray={2 * Math.PI * 18}
                  strokeDashoffset={2 * Math.PI * 18 * (1 - occupancyRate / 100)}
                />
              </svg>
            </div>
          </div>
          <div className="border-t border-slate-50 dark:border-zinc-800/60 pt-2.5 flex items-center justify-between text-[11px] font-sans">
            <span className="text-slate-400">{isRTL ? 'إجمالي الطاولات:' : 'Total Tables:'}</span>
            <span className="font-bold text-indigo-500">{tables.length}</span>
          </div>
        </motion.div>

        {/* Card 3: Pending Kitchen Orders */}
        <motion.div
          whileHover={{ y: -3 }}
          className="rounded-[2rem] bg-white p-5 shadow-xl shadow-black/5 border border-slate-100 dark:bg-zinc-900 dark:border-zinc-800/80 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {t.pendingOrdersCount}
            </span>
            <div className="rounded-full bg-amber-50 p-2 dark:bg-amber-950/40">
              <ChefHat size={14} className="text-amber-500" />
            </div>
          </div>
          <div className="my-3">
            <h3 className="text-2xl font-mono font-black text-slate-900 dark:text-white">
              {pendingOrders.length} <span className="text-xs">{isRTL ? 'طلبات' : 'Tickets'}</span>
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-sans mt-1">
              {isRTL ? 'بانتظار التحضير بالمطبخ' : 'Pending chef confirmation'}
            </p>
          </div>
          <div className="border-t border-slate-50 dark:border-zinc-800/60 pt-2.5 flex items-center justify-between text-[11px] font-sans">
            <span className="text-slate-400">{isRTL ? 'الطلبات الجارية:' : 'In-Progress:'}</span>
            <span className="font-bold text-amber-500">{activeOrders.length}</span>
          </div>
        </motion.div>

        {/* Card 4: Completion Rate */}
        <motion.div
          whileHover={{ y: -3 }}
          className="rounded-[2rem] bg-white p-5 shadow-xl shadow-black/5 border border-slate-100 dark:bg-zinc-900 dark:border-zinc-800/80 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {t.successRate}
            </span>
            <div className="rounded-full bg-emerald-50 p-2 dark:bg-emerald-950/40">
              <CheckCircle size={14} className="text-emerald-500" />
            </div>
          </div>
          <div className="my-3">
            <h3 className="text-2xl font-mono font-black text-slate-900 dark:text-white">
              {completionRate}%
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-sans mt-1">
              {paidOrders.length} / {orders.length} {isRTL ? 'طلبات منجزة مسددة' : 'Finished checks'}
            </p>
          </div>
          <div className="border-t border-slate-50 dark:border-zinc-800/60 pt-2.5 flex items-center justify-between text-[11px] font-sans">
            <span className="text-slate-400">{isRTL ? 'نسبة الهدر:' : 'Waste Index:'}</span>
            <span className="font-bold text-emerald-500">0%</span>
          </div>
        </motion.div>
      </div>

      {/* Main Grid: Rooms table map & bestseller dishes split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 cols: Visual Table Room Map */}
        <div className="rounded-[2.2rem] bg-white/70 backdrop-blur-xl p-6 shadow-xl shadow-black/5 border border-white/50 dark:bg-zinc-900/70 dark:border-zinc-800/50 lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-50 dark:border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <TableIcon className="text-blue-500" size={18} />
              <h3 className="text-[14px] font-display font-extrabold text-slate-800 dark:text-zinc-200">
                {isRTL ? 'الخريطة البصرية لإشغالات الطاولات' : 'Live Interactive Dining Floor'}
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-sans">
              {isRTL ? 'اضغط لتغيير الحالة • اضغط 📱 للمحاكاة' : 'Click to change status • Click 📱 to simulate'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {tables.map((table) => {
              const statusClass = getTableColor(table.status);
              return (
                <motion.div
                  key={table.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (onUpdateTableStatus) {
                      const statuses: Table['status'][] = ['empty', 'ordering', 'waiting', 'eating', 'dirty'];
                      const currentIndex = statuses.indexOf(table.status);
                      const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                      onUpdateTableStatus(table.id, nextStatus);
                    }
                  }}
                  className={`relative group p-4 rounded-3xl border text-center cursor-pointer transition-all ${statusClass}`}
                >
                  {/* Explicit Simulation Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent cycling status
                      onSimulateScan(table.id);
                    }}
                    className="absolute top-2 right-2 flex h-6 items-center gap-1 rounded-full bg-white/95 dark:bg-zinc-800/95 px-2 text-[9px] font-extrabold text-blue-600 shadow-sm border border-slate-100 dark:border-zinc-700/60 transition hover:bg-blue-500 hover:text-white"
                    title={isRTL ? 'محاكاة طلب زبون الطاولة' : 'Simulate Guest Ordering'}
                  >
                    <Smartphone size={10} className="shrink-0" />
                    <span>{isRTL ? 'زبون' : 'Guest'}</span>
                  </button>

                  <span className="text-2xl block mt-2">🪑</span>
                  <h4 className="text-xs font-display font-extrabold mt-1.5">{table.number}</h4>
                  <p className="text-[10px] opacity-80 mt-0.5">{getTableLabel(table.status)}</p>
                  <span className="inline-block text-[9px] font-bold bg-white/50 px-2 py-0.5 rounded-full mt-2 dark:bg-black/10">
                    {table.capacity} {isRTL ? 'أشخاص' : 'Pax'}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right 4 cols: Bestseller and active feeds */}
        <div className="lg:col-span-4 space-y-6">
          {/* Bestselling dish widget */}
          <div className="rounded-[2.2rem] bg-white/70 backdrop-blur-xl p-6 shadow-xl shadow-black/5 border border-white/50 dark:bg-zinc-900/70 dark:border-zinc-800/50 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-50 dark:border-zinc-800 pb-2">
              <Award className="text-amber-500 animate-pulse" size={16} />
              <h3 className="text-[12px] font-display font-extrabold text-slate-800 dark:text-zinc-200">
                {t.bestseller}
              </h3>
            </div>

            {bestSellerItem ? (
              <div className="flex items-center gap-3">
                <span className="text-4xl p-2 bg-slate-50 rounded-2xl dark:bg-zinc-950/40">
                  {bestSellerItem.image}
                </span>
                <div className="truncate">
                  <h4 className="text-xs font-display font-extrabold truncate text-slate-900 dark:text-white">
                    {isRTL ? bestSellerItem.nameAr : bestSellerItem.nameEn}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {bestSellerCount} {isRTL ? 'مرات مبيعة' : 'orders placed'}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 py-3 font-sans">
                {isRTL ? 'لم يتم تقديم أي طلب بعد لاستخراج الأكثر مبيعاً.' : 'Waiting for guest orders.'}
              </p>
            )}
          </div>

          {/* Quick live activity feed timeline */}
          <div className="rounded-[2.2rem] bg-zinc-900 text-white p-6 shadow-xl border border-zinc-800 dark:bg-zinc-950/90 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-2">
                <Flame className="text-orange-500 animate-bounce" size={15} />
                <h3 className="text-[12px] font-display font-extrabold">
                  {t.liveFeed}
                </h3>
              </div>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </div>

            {activeOrders.length === 0 ? (
              <p className="text-[10px] text-zinc-500 py-3 font-sans">
                {isRTL ? 'جميع الطاولات والمطابخ قيد الاستقرار التام.' : 'All kitchen lines stable.'}
              </p>
            ) : (
              <div className="space-y-3">
                {activeOrders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex items-start gap-2.5 text-[11px]">
                    <Clock size={11} className="text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold text-zinc-200">
                        {isRTL ? 'طلب جديد من' : 'New Order for'} {tables.find(t => t.id === order.tableId)?.number}
                      </p>
                      <p className="text-[9px] text-zinc-500 font-mono">
                        #{order.id.split('-')[1]} - {order.items.length} {isRTL ? 'أصناف' : 'dishes'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
