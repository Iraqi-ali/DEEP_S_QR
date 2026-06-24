/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Globe, Sun, Moon, Database, Smartphone, Store, Settings, Phone, MapPin, Percent, HelpCircle } from 'lucide-react';
import { Restaurant, ThemeMode, Lang, NotificationPayload } from '../types';
import { TRANSLATIONS } from '../data';

interface SettingsViewProps {
  restaurants: Restaurant[];
  activeRestaurantId: string;
  onSelectRestaurant: (id: string) => void;
  onUpdateRestaurant: (updated: Restaurant) => void;
  lang: Lang;
  onSetLang: (lang: Lang) => void;
  theme: ThemeMode;
  onSetTheme: (theme: ThemeMode) => void;
  onResetData: () => void;
  triggerNotification: (notif: NotificationPayload) => void;
}

export default function SettingsView({
  restaurants,
  activeRestaurantId,
  onSelectRestaurant,
  onUpdateRestaurant,
  lang,
  onSetLang,
  theme,
  onSetTheme,
  onResetData,
  triggerNotification
}: SettingsViewProps) {
  const isRTL = lang === 'ar';
  const t = TRANSLATIONS[lang];

  const currentRestaurant = restaurants.find(r => r.id === activeRestaurantId) || restaurants[0];

  // Edit states
  const [name, setName] = useState(currentRestaurant.name);
  const [logo, setLogo] = useState(currentRestaurant.logo);
  const [phone, setPhone] = useState(currentRestaurant.phone);
  const [address, setAddress] = useState(currentRestaurant.address);
  const [tax, setTax] = useState(String(currentRestaurant.taxRate * 100));
  const [service, setService] = useState(String(currentRestaurant.serviceCharge));
  const [currency, setCurrency] = useState(currentRestaurant.currency);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedTax = parseFloat(tax) / 100;
    const parsedService = parseFloat(service);

    onUpdateRestaurant({
      ...currentRestaurant,
      name,
      logo,
      phone,
      address,
      taxRate: isNaN(parsedTax) ? 0.15 : parsedTax,
      serviceCharge: isNaN(parsedService) ? 0 : parsedService,
      currency
    });

    triggerNotification({
      title: t.updateSuccess,
      subtitle: isRTL ? 'تم تحديث بيانات المطعم بنجاح.' : 'Restaurant details successfully updated.',
      icon: 'success',
      type: 'success'
    });
  };

  const handleReset = () => {
    onResetData();
    triggerNotification({
      title: t.resetSuccess,
      subtitle: isRTL ? 'تمت إعادة تهيئة المطعم للمصنع.' : 'All system databases restored to initial seeds.',
      icon: 'reset',
      type: 'warning'
    });
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Title */}
      <div className="px-1">
        <h2 className="text-2xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          {t.settingsTitle}
        </h2>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 font-sans mt-1">
          {t.settingsDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Multi-Restaurant Switcher Profiles */}
        <div className="rounded-[2.2rem] bg-white/70 backdrop-blur-xl p-6 shadow-xl shadow-black/5 border border-white/50 dark:bg-zinc-900/70 dark:border-zinc-800/50 lg:col-span-4 h-fit space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-zinc-850 pb-3">
            <Store className="text-blue-500" size={18} />
            <h3 className="text-[14px] font-display font-extrabold text-slate-800 dark:text-zinc-200">
              {isRTL ? 'الملفات الشخصية للمطاعم' : 'Active Restaurant Profiles'}
            </h3>
          </div>

          <div className="space-y-3">
            {restaurants.map((rest) => {
              const isActive = rest.id === activeRestaurantId;
              return (
                <button
                  key={rest.id}
                  onClick={() => {
                    onSelectRestaurant(rest.id);
                    // Update state variables to match selected restaurant
                    setName(rest.name);
                    setLogo(rest.logo);
                    setPhone(rest.phone);
                    setAddress(rest.address);
                    setTax(String(rest.taxRate * 100));
                    setService(String(rest.serviceCharge));
                    setCurrency(rest.currency);

                    triggerNotification({
                      title: isRTL ? 'تم تغيير المطعم' : 'Restaurant Switched',
                      subtitle: isRTL ? `المطعم النشط الآن: ${rest.name}` : `Active brand changed to ${rest.name}`,
                      icon: 'success',
                      type: 'info'
                    });
                  }}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all duration-300 ${
                    isActive
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 shadow-sm'
                      : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/30 dark:bg-zinc-950/40 dark:border-zinc-800/80 dark:hover:bg-zinc-950/60'
                  }`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                >
                  <span className="text-3xl p-1.5 bg-white dark:bg-zinc-900 rounded-xl shadow-sm shrink-0">
                    {rest.logo}
                  </span>
                  <div className="truncate flex-1">
                    <h4 className="text-[13px] font-extrabold text-slate-900 dark:text-white truncate">
                      {rest.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 dark:text-zinc-500 truncate font-sans">
                      {rest.phone}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Restaurant Brand Configuration Details Form */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleUpdate} className="rounded-[2.2rem] bg-white/70 backdrop-blur-xl p-6 shadow-xl shadow-black/5 border border-white/50 dark:bg-zinc-900/70 dark:border-zinc-800/50 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-zinc-850 pb-3">
              <Settings className="text-blue-500" size={18} />
              <h3 className="text-[14px] font-display font-extrabold text-slate-800 dark:text-zinc-200">
                {isRTL ? 'تعديل بيانات المنشأة النشطة' : 'Edit Selected Brand Profile'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {t.restaurantName}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-base">{logo}</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full rounded-xl border border-slate-200/80 bg-slate-50/50 py-2.5 px-4 text-xs font-semibold outline-none transition focus:border-blue-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-white ${isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'}`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {t.restaurantPhone}
                </label>
                <div className="relative">
                  <Phone size={13} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full rounded-xl border border-slate-200/80 bg-slate-50/50 py-2.5 px-4 text-xs font-semibold outline-none transition focus:border-blue-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-white ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {t.restaurantAddress}
              </label>
              <div className="relative">
                <MapPin size={13} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`w-full rounded-xl border border-slate-200/80 bg-slate-50/50 py-2.5 px-4 text-xs font-semibold outline-none transition focus:border-blue-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-white ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {t.taxRateInput}
                </label>
                <input
                  type="text"
                  value={tax}
                  onChange={(e) => setTax(e.target.value)}
                  placeholder="15"
                  className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 py-2 px-3 text-xs font-semibold outline-none transition focus:border-blue-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {t.serviceChargeInput}
                </label>
                <input
                  type="text"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  placeholder="5.00"
                  className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 py-2 px-3 text-xs font-semibold outline-none transition focus:border-blue-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {t.currencyInput}
                </label>
                <input
                  type="text"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 py-2 px-3 text-xs font-semibold outline-none transition focus:border-blue-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                />
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-500 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-blue-600 transition"
            >
              <span>{t.save}</span>
            </motion.button>
          </form>

          {/* iOS-styled preferences */}
          <div className="rounded-[2.2rem] bg-white/70 backdrop-blur-xl p-5 shadow-xl shadow-black/5 border border-white/50 dark:bg-zinc-900/70 dark:border-zinc-800/50 divide-y divide-slate-100 dark:divide-zinc-800/40">
            {/* Lang switcher */}
            <div className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white shadow-sm">
                  <Globe size={16} />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-slate-800 dark:text-zinc-200">{t.language}</p>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500">{isRTL ? 'تبديل لغة الواجهة الفورية' : 'Swap between English & Arabic'}</p>
                </div>
              </div>
              <select
                value={lang}
                onChange={(e) => {
                  const selected = e.target.value as Lang;
                  onSetLang(selected);
                  triggerNotification({
                    title: selected === 'ar' ? 'تم تحويل اللغة' : 'Language Updated',
                    subtitle: selected === 'ar' ? 'اللغة العربية مفعلة.' : 'English translation loaded.',
                    icon: 'wifi',
                    type: 'info'
                  });
                }}
                className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 outline-none dark:bg-zinc-800 dark:text-zinc-300 border-0"
              >
                <option value="en">English</option>
                <option value="ar">العربية (Arabic)</option>
              </select>
            </div>

            {/* Dark appearance toggler */}
            <div className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-white shadow-sm">
                  <Sun size={16} />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-slate-800 dark:text-zinc-200">{t.theme}</p>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500">{isRTL ? 'تعديل السطوع اللحظي للنظام' : 'Configure dark/light dashboard colors'}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl dark:bg-zinc-800 border-0">
                <button
                  onClick={() => onSetTheme('light')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${theme === 'light' ? 'bg-white shadow dark:bg-zinc-700 dark:text-white text-slate-900' : 'text-slate-400'}`}
                >
                  {isRTL ? 'مضيء' : 'Light'}
                </button>
                <button
                  onClick={() => onSetTheme('dark')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${theme === 'dark' ? 'bg-white shadow dark:bg-zinc-700 dark:text-white text-slate-900' : 'text-slate-400'}`}
                >
                  {isRTL ? 'داكن' : 'Dark'}
                </button>
              </div>
            </div>

            {/* Factory Reset */}
            <div className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500 text-white shadow-sm animate-pulse">
                  <Database size={16} />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-rose-600 dark:text-rose-400">{t.resetDefaultData}</p>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500">{isRTL ? 'إزالة كافة الطاولات وتصانيف الطعام والفواتير المسجلة' : 'Wipe entire local storage back to seeds'}</p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="rounded-xl bg-rose-50 border border-rose-100 px-3 py-1 text-xs font-bold text-rose-600 hover:bg-rose-100 dark:bg-rose-950/20 dark:border-rose-900/30 transition"
              >
                {isRTL ? 'تهيئة كاملة' : 'Wipe database'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
