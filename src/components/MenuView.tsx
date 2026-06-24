/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, Heart, ToggleLeft, ToggleRight, Search, Salad, Sparkles, AlertCircle } from 'lucide-react';
import { MenuItem, Lang } from '../types';
import { TRANSLATIONS } from '../data';

interface MenuViewProps {
  menuItems: MenuItem[];
  onAddMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  onDeleteMenuItem: (id: string) => void;
  onToggleAvailability: (id: string) => void;
  onTogglePopular: (id: string) => void;
  lang: Lang;
}

const CATEGORY_GROUPS = [
  'Saj & Wraps',
  'Platters',
  'Grills',
  'Burgers',
  'Appetizers',
  'Drinks',
  'Desserts'
];

export default function MenuView({
  menuItems,
  onAddMenuItem,
  onDeleteMenuItem,
  onToggleAvailability,
  onTogglePopular,
  lang
}: MenuViewProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [error, setError] = useState('');

  // Form states
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(CATEGORY_GROUPS[0]);
  const [image, setImage] = useState('🍔');
  const [imageUrl, setImageUrl] = useState('');
  const [descAr, setDescAr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [isPopular, setIsPopular] = useState(false);

  const FOOD_ICONS = [
    '🍔','🍕','🍟','🌭','🍿','🥪','🥙','🌮','🌯','🥗',
    '🍖','🍗','🥩','🥓','🍢','🍡','🍣','🍤','🦪','🍱',
    '🧆','🥘','🍲','🥣','🫕','🍝','🍜','🍛','🍚','🥟',
    '🥐','🍞','🥖','🧀','🥚','🥞','🧇','🍩','🍪','🎂',
    '🍰','🧁','🥧','🍫','🍬','🍭','🍯','🥜','🍵','☕',
  ];

  const t = TRANSLATIONS[lang];
  const isRTL = lang === 'ar';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim() || !nameEn.trim()) {
      setError(isRTL ? 'الرجاء إدخال اسم الوجبة بالعربية والإنجليزية' : 'Please enter item name in both languages');
      return;
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError(isRTL ? 'الرجاء إدخال سعر صحيح أكبر من الصفر' : 'Please enter a valid price greater than zero');
      return;
    }

    onAddMenuItem({
      nameAr: nameAr.trim(),
      nameEn: nameEn.trim(),
      price: parsedPrice,
      category,
      image: image || '🍔',
      imageUrl: imageUrl.trim() || undefined,
      descriptionAr: descAr.trim(),
      descriptionEn: descEn.trim(),
      available: true,
      isPopular: isPopular
    });

    // Reset fields
    setNameAr('');
    setNameEn('');
    setPrice('');
    setDescAr('');
    setDescEn('');
    setImage('🍔');
    setIsPopular(false);
    setError('');
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.nameAr.toLowerCase().includes(search.toLowerCase()) ||
      item.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Title Header */}
      <div className="px-1">
        <h2 className="text-2xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          {t.menuTitle}
        </h2>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 font-sans mt-1">
          {t.menuDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Form: Add New Food Item */}
        <div className="rounded-[2rem] bg-white/70 backdrop-blur-xl p-6 shadow-xl shadow-black/5 border border-white/50 dark:bg-zinc-900/70 dark:border-zinc-800/50 lg:col-span-4 h-fit space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-zinc-800">
            <Salad className="text-blue-500 dark:text-blue-400 animate-pulse" size={18} />
            <h3 className="text-[14px] font-display font-extrabold text-slate-800 dark:text-zinc-200">
              {t.addMenuItem}
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="flex items-center gap-1.5 rounded-xl bg-rose-50 p-2.5 text-xs font-semibold text-rose-600 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {t.foodNameAr}
                </label>
                <input
                  type="text"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  placeholder="مثال: فتوش فاخر"
                  className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 py-2 px-3 text-xs font-semibold outline-none transition focus:border-blue-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {t.foodNameEn}
                </label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g. Royal Fattoush"
                  className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 py-2 px-3 text-xs font-semibold outline-none transition focus:border-blue-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {t.foodPrice}
                </label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="22.00"
                  className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 py-2 px-3 text-xs font-semibold outline-none transition focus:border-blue-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  أيقونة الطبق
                </label>
                <select
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 py-2 px-3 text-xs font-semibold outline-none transition focus:border-blue-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                >
                  {FOOD_ICONS.map(icon => (
                    <option key={icon} value={icon}>{icon} {icon}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                صورة الطبق
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="رابط الصورة أو حمل ملف"
                  className="flex-1 rounded-xl border border-slate-200/80 bg-slate-50/50 py-2 px-3 text-xs font-semibold outline-none transition focus:border-blue-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                />
                <label className="flex items-center justify-center rounded-xl bg-slate-100 dark:bg-zinc-800 px-3 text-xs font-bold cursor-pointer hover:bg-slate-200 dark:hover:bg-zinc-700 transition">
                  📁 رفع
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => setImageUrl(reader.result as string);
                    reader.readAsDataURL(file);
                  }} />
                </label>
              </div>
              {imageUrl && (
                <img src={imageUrl} className="h-16 w-16 rounded-xl object-cover border mt-1" />
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {t.foodCategory}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 py-2 px-3 text-xs font-semibold outline-none transition focus:border-blue-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
              >
                {CATEGORY_GROUPS.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {t.foodDescAr}
              </label>
              <textarea
                rows={2}
                value={descAr}
                onChange={(e) => setDescAr(e.target.value)}
                placeholder="تفاصيل المكونات والطهي..."
                className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 py-2 px-3 text-xs font-semibold outline-none transition focus:border-blue-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {t.foodDescEn}
              </label>
              <textarea
                rows={2}
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                placeholder="Ingredients, allergy notes..."
                className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 py-2 px-3 text-xs font-semibold outline-none transition focus:border-blue-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                id="isPopular"
                checked={isPopular}
                onChange={(e) => setIsPopular(e.target.checked)}
                className="rounded border-slate-300 text-blue-500 focus:ring-blue-500 h-4 w-4"
              />
              <label htmlFor="isPopular" className="text-[11px] font-bold text-slate-600 dark:text-zinc-300 cursor-pointer">
                🌟 {t.isPopular}
              </label>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-500 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition"
            >
              <Plus size={15} />
              <span>{t.addMenuItem}</span>
            </motion.button>
          </form>
        </div>

        {/* Right Search & Filter Lists Grid */}
        <div className="lg:col-span-8 space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full rounded-full border border-slate-200/60 bg-white py-2 px-4 text-xs font-semibold outline-none transition focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
              />
            </div>

            {/* Category Quick Filter badges */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 max-w-full scrollbar-none">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition shrink-0 ${selectedCategory === 'All' ? 'bg-blue-500 text-white shadow-md' : 'bg-white text-slate-500 hover:text-slate-700 dark:bg-zinc-900 dark:text-zinc-400 border border-slate-100 dark:border-zinc-800'}`}
              >
                {t.filterAll}
              </button>
              {CATEGORY_GROUPS.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition shrink-0 ${selectedCategory === cat ? 'bg-blue-500 text-white shadow-md' : 'bg-white text-slate-500 hover:text-slate-700 dark:bg-zinc-900 dark:text-zinc-400 border border-slate-100 dark:border-zinc-800'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Table List Layout */}
          <div className="overflow-hidden rounded-[2rem] bg-white/70 backdrop-blur-xl shadow-xl shadow-black/5 border border-white/50 dark:bg-zinc-900/70 dark:border-zinc-800/60">
            <div className="overflow-x-auto">
              <table className="w-full text-left" dir={isRTL ? 'rtl' : 'ltr'}>
                <thead className="bg-slate-50/50 text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100/50 dark:bg-zinc-950/50 dark:border-zinc-800/50 dark:text-zinc-500">
                  <tr>
                    <th className="px-5 py-3">{isRTL ? 'الوجبة' : 'Dish'}</th>
                    <th className="px-5 py-3">{t.category}</th>
                    <th className="px-5 py-3">{t.foodPrice}</th>
                    <th className="px-5 py-3 text-center">التميز / الرواج</th>
                    <th className="px-5 py-3 text-center">{t.isAvailable}</th>
                    <th className="px-5 py-3 text-center">{t.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/60 dark:divide-zinc-800/40 text-xs font-semibold text-slate-700 dark:text-zinc-300">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/30 dark:hover:bg-zinc-900/10 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl p-1 bg-slate-50 rounded-xl dark:bg-zinc-950/50">{item.imageUrl ? <img src={item.imageUrl} className="w-8 h-8 rounded-lg object-cover" /> : item.image}</span>
                          <div>
                            <p className="font-display font-extrabold text-slate-900 dark:text-white">
                              {isRTL ? item.nameAr : item.nameEn}
                            </p>
                            <p className="text-[10px] text-slate-400 dark:text-zinc-500 max-w-[200px] truncate">
                              {isRTL ? item.descriptionAr : item.descriptionEn}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="rounded-lg bg-slate-100 dark:bg-zinc-800 px-2.5 py-1 text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-mono font-black text-slate-900 dark:text-white">
                        {item.price.toFixed(2)} {t.currency}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <button
                          onClick={() => onTogglePopular(item.id)}
                          className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full transition ${item.isPopular ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/30' : 'text-slate-300 hover:text-amber-400'}`}
                        >
                          ★
                        </button>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <button
                          onClick={() => onToggleAvailability(item.id)}
                          className="mx-auto flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
                        >
                          {item.available ? (
                            <ToggleRight className="text-emerald-500 h-6 w-6" />
                          ) : (
                            <ToggleLeft className="text-slate-300 h-6 w-6" />
                          )}
                        </button>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <button
                          onClick={() => onDeleteMenuItem(item.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition mx-auto"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-slate-400 dark:text-zinc-500 font-sans">
                        {isRTL ? 'لا توجد وجبات طعام تطابق هذا البحث حالياً.' : 'No food items match the search criteria.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
