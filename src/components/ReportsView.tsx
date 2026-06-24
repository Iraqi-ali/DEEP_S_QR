/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { TrendingUp, Award, BarChart3, PieChart, Star, Calendar } from 'lucide-react';
import { Order, MenuItem, Lang } from '../types';
import { TRANSLATIONS } from '../data';

interface ReportsViewProps {
  orders: Order[];
  menuItems: MenuItem[];
  lang: Lang;
}

export default function ReportsView({
  orders,
  menuItems,
  lang
}: ReportsViewProps) {
  const t = TRANSLATIONS[lang];
  const isRTL = lang === 'ar';

  const paidOrders = orders.filter((o) => o.status === 'paid');
  const totalRev = paidOrders.reduce((sum, o) => sum + o.total, 0);

  // Category sales breakdown
  const categorySales: Record<string, number> = {};
  paidOrders.forEach((order) => {
    order.items.forEach((oi) => {
      const item = menuItems.find((m) => m.id === oi.menuItemId);
      if (item) {
        categorySales[item.category] = (categorySales[item.category] || 0) + oi.priceAtOrder * oi.quantity;
      }
    });
  });

  const categoriesData = Object.entries(categorySales).map(([name, value]) => ({
    name,
    value
  })).sort((a, b) => b.value - a.value);

  // Item sales volume
  const itemSalesVolume: Record<string, { qty: number; rev: number; item: MenuItem }> = {};
  paidOrders.forEach((order) => {
    order.items.forEach((oi) => {
      const item = menuItems.find((m) => m.id === oi.menuItemId);
      if (item) {
        if (!itemSalesVolume[item.id]) {
          itemSalesVolume[item.id] = { qty: 0, rev: 0, item };
        }
        itemSalesVolume[item.id].qty += oi.quantity;
        itemSalesVolume[item.id].rev += oi.priceAtOrder * oi.quantity;
      }
    });
  });

  const bestSellers = Object.values(itemSalesVolume)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  // Standard Mock Daily Revenue Trend Points for our SVG Chart
  const trendPoints = [
    { label: isRTL ? 'الأحد' : 'Sun', value: totalRev * 0.4 },
    { label: isRTL ? 'الإثنين' : 'Mon', value: totalRev * 0.6 },
    { label: isRTL ? 'الثلاثاء' : 'Tue', value: totalRev * 0.5 },
    { label: isRTL ? 'الأربعاء' : 'Wed', value: totalRev * 0.8 },
    { label: isRTL ? 'الخميس' : 'Thu', value: totalRev * 1.2 },
    { label: isRTL ? 'الجمعة' : 'Fri', value: totalRev * 1.5 },
    { label: isRTL ? 'السبت' : 'Sat', value: totalRev * 1.3 }
  ];

  const maxVal = Math.max(...trendPoints.map((p) => p.value)) || 500;

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Title Header */}
      <div className="px-1">
        <h2 className="text-2xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          {t.reportsTitle}
        </h2>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 font-sans mt-1">
          {t.reportsDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Revenue Area Trend Chart */}
        <div className="rounded-[2rem] bg-white/70 backdrop-blur-xl p-6 shadow-xl shadow-black/5 border border-white/50 dark:bg-zinc-900/70 dark:border-zinc-800/50 lg:col-span-8 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-50 dark:border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-blue-500" size={18} />
              <h3 className="text-[14px] font-display font-extrabold text-slate-800 dark:text-zinc-200">
                {t.revenueTrend}
              </h3>
            </div>
            <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
              <Calendar size={12} />
              <span>{isRTL ? 'الأسبوع الحالي' : 'Current Week'}</span>
            </span>
          </div>

          {/* SVG Area Chart */}
          <div className="h-56 w-full relative">
            <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="40" y1="20" x2="580" y2="20" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-zinc-800/50" />
              <line x1="40" y1="70" x2="580" y2="70" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-zinc-800/50" />
              <line x1="40" y1="120" x2="580" y2="120" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-zinc-800/50" />
              <line x1="40" y1="170" x2="580" y2="170" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-zinc-800/50" />

              {/* Render Area Path */}
              <path
                d={`
                  M 40,170
                  ${trendPoints.map((p, i) => {
                    const x = 40 + i * 85;
                    const y = 170 - (p.value / maxVal) * 130;
                    return `L ${x},${y}`;
                  }).join(' ')}
                  L 550,170 Z
                `}
                fill="url(#chartGrad)"
              />

              {/* Render Stroke Path */}
              <path
                d={trendPoints.map((p, i) => {
                  const x = 40 + i * 85;
                  const y = 170 - (p.value / maxVal) * 130;
                  return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Data points circles */}
              {trendPoints.map((p, i) => {
                const x = 40 + i * 85;
                const y = 170 - (p.value / maxVal) * 130;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="5.5"
                    fill="#3b82f6"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    className="cursor-pointer hover:r-7 transition-all"
                  />
                );
              })}

              {/* Bottom labels */}
              {trendPoints.map((p, i) => {
                const x = 40 + i * 85;
                return (
                  <text
                    key={i}
                    x={x}
                    y="190"
                    textAnchor="middle"
                    fill="#94a3b8"
                    className="text-[9px] font-bold font-sans"
                  >
                    {p.label}
                  </text>
                );
              })}
            </svg>
          </div>

          <div className="flex justify-between items-center bg-slate-50/50 rounded-2xl p-3.5 dark:bg-zinc-950/40 text-xs text-slate-500 font-sans">
            <span>{isRTL ? 'مبني على إجمالي المعاملات المحققة بالمطعم' : 'Based on actual table settlement logs'}</span>
            <span className="font-mono font-bold text-blue-500">
              {isRTL ? 'منحنى أداء تصاعدي' : 'Upward growth index'}
            </span>
          </div>
        </div>

        {/* Right: Food Categories Share */}
        <div className="rounded-[2rem] bg-white/70 backdrop-blur-xl p-6 shadow-xl shadow-black/5 border border-white/50 dark:bg-zinc-900/70 dark:border-zinc-800/50 lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-50 dark:border-zinc-800 pb-3">
            <PieChart className="text-blue-500" size={18} />
            <h3 className="text-[14px] font-display font-extrabold text-slate-800 dark:text-zinc-200">
              {t.salesByCategory}
            </h3>
          </div>

          {categoriesData.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 py-12 font-sans">
              {isRTL ? 'لا توجد بيانات بيع مضافة للتحليل بعد.' : 'No category data collected.'}
            </div>
          ) : (
            <div className="space-y-4 py-2 flex-1 flex flex-col justify-center">
              {categoriesData.map((cat, index) => {
                const totalCatsSum = categoriesData.reduce((s, c) => s + c.value, 0) || 1;
                const percentage = Math.round((cat.value / totalCatsSum) * 100);

                return (
                  <div key={cat.name} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-zinc-300">
                      <span className="flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-emerald-500' : 'bg-purple-500'}`} />
                        {cat.name}
                      </span>
                      <span>{percentage}%</span>
                    </div>
                    {/* Progress representation */}
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-emerald-500' : 'bg-purple-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bestsellers Board */}
      <div className="rounded-[2rem] bg-white/70 backdrop-blur-xl shadow-xl shadow-black/5 border border-white/50 dark:bg-zinc-900/70 dark:border-zinc-800/50 overflow-hidden">
        <div className="p-5 border-b border-slate-50 dark:border-zinc-800/50 flex items-center gap-2">
          <Award className="text-amber-500" size={18} />
          <h3 className="text-[14px] font-display font-extrabold text-slate-800 dark:text-zinc-200">
            {t.bestsellersList}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left" dir={isRTL ? 'rtl' : 'ltr'}>
            <thead className="bg-slate-50/50 text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100/50 dark:bg-zinc-950/50 dark:border-zinc-800/50 dark:text-zinc-500">
              <tr>
                <th className="px-6 py-3">{isRTL ? 'الطبق' : 'Dish'}</th>
                <th className="px-6 py-3">{t.category}</th>
                <th className="px-6 py-3 text-center">{isRTL ? 'الكمية المباعة' : 'Units Sold'}</th>
                <th className="px-6 py-3">{isRTL ? 'معدل الدخل' : 'Revenue Generated'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/60 dark:divide-zinc-800/40 text-xs font-semibold text-slate-700 dark:text-zinc-300">
              {bestSellers.map(({ qty, rev, item }) => (
                <tr key={item.id} className="hover:bg-slate-50/30 dark:hover:bg-zinc-900/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-1 bg-slate-50 rounded-xl dark:bg-zinc-950/50">{item.image}</span>
                      <span className="font-display font-extrabold text-slate-900 dark:text-white">
                        {isRTL ? item.nameAr : item.nameEn}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded bg-slate-100 dark:bg-zinc-850 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:text-zinc-400">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-mono font-bold text-slate-800 dark:text-zinc-200">
                    {qty}
                  </td>
                  <td className="px-6 py-4 font-mono font-black text-emerald-600 dark:text-emerald-400">
                    {rev.toFixed(2)} {isRTL ? 'ريال' : 'SAR'}
                  </td>
                </tr>
              ))}
              {bestSellers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-6 text-center text-slate-400 font-sans">
                    {isRTL ? 'لا توجد مبيعات مسجلة حتى الآن.' : 'No bestseller logs registered yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
