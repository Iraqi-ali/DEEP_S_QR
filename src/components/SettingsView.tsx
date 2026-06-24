/**
 * Settings View - Iraqi Edition 🇮🇶
 */
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Globe, Sun, Moon, Database, Store, Settings, Phone, MapPin, Plus, Trash2, Shield, Lock, Unlock, Building } from 'lucide-react';
import { Restaurant, ThemeMode, Lang, NotificationPayload } from '../types';
import { TRANSLATIONS } from '../data';

interface SettingsViewProps {
  restaurants: Restaurant[];
  activeRestaurantId: string;
  onSelectRestaurant: (id: string) => void;
  onUpdateRestaurant: (updated: Restaurant) => void;
  onAddRestaurant: (r: Restaurant) => void;
  onDeleteRestaurant: (id: string) => void;
  lang: Lang;
  onSetLang: (lang: Lang) => void;
  theme: ThemeMode;
  onSetTheme: (theme: ThemeMode) => void;
  onResetData: () => void;
  triggerNotification: (notif: NotificationPayload) => void;
  isSuperUser: boolean;
  onSetSuperUser: (v: boolean) => void;
}

const IRAQI_CITIES = ['بغداد', 'البصرة', 'أربيل', 'النجف', 'كربلاء', 'الموصل', 'السليمانية', 'دهوك', 'كركوك', 'الديوانية', 'العمارة', 'الناصرية', 'الرمادي', 'بعقوبة', 'الحلة', 'كربلاء', 'الفلوجة', 'سامراء'];

export default function SettingsView({
  restaurants, activeRestaurantId, onSelectRestaurant, onUpdateRestaurant,
  onAddRestaurant, onDeleteRestaurant, lang, onSetLang, theme, onSetTheme,
  onResetData, triggerNotification, isSuperUser, onSetSuperUser
}: SettingsViewProps) {
  const isRTL = lang === 'ar';
  const t = TRANSLATIONS[lang];
  const current = restaurants.find(r => r.id === activeRestaurantId) || restaurants[0];

  // Edit states for current restaurant
  const [name, setName] = useState(current.name);
  const [logo, setLogo] = useState(current.logo);
  const [phone, setPhone] = useState(current.phone);
  const [address, setAddress] = useState(current.address);
  const [city, setCity] = useState(current.city || 'بغداد');
  const [tax, setTax] = useState(String(current.taxRate * 100));
  const [service, setService] = useState(String(current.serviceCharge));
  const [currency, setCurrency] = useState(current.currency);
  const [paymentMode, setPaymentMode] = useState(current.paymentMode || 'after');

  // Add new restaurant states
  const [newName, setNewName] = useState('');
  const [newLogo, setNewLogo] = useState('🍽️');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newCity, setNewCity] = useState('بغداد');
  const [showAddForm, setShowAddForm] = useState(false);

  // Super user
  const [passwordInput, setPasswordInput] = useState('');

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateRestaurant({ ...current, name, logo, phone, address, city, taxRate: parseFloat(tax) / 100 || 0.10, serviceCharge: parseFloat(service) || 0, currency, paymentMode });
    triggerNotification({ title: t.updateSuccess, type: 'success' });
  };

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;
    const id = `rest-${Date.now()}`;
    onAddRestaurant({ id, name: newName, logo: newLogo, phone: newPhone, address: newAddress, city: newCity, currency: 'د.ع', taxRate: 0.10, serviceCharge: 3000 });
    triggerNotification({ title: 'تم إضافة المطعم بنجاح! 🎉', type: 'success' });
    setNewName(''); setNewLogo('🍽️'); setNewPhone(''); setNewAddress(''); setShowAddForm(false);
  };

  const handleLogin = () => {
    if (passwordInput === 'admin123') { onSetSuperUser(true); triggerNotification({ title: 'مرحباً مدير النظام 🔓', type: 'success' }); }
    else triggerNotification({ title: 'كلمة المرور غير صحيحة ❌', type: 'error' });
    setPasswordInput('');
  };

  const selectRestaurant = (rest: Restaurant) => {
    onSelectRestaurant(rest.id);
    setName(rest.name); setLogo(rest.logo); setPhone(rest.phone);
    setAddress(rest.address); setCity(rest.city || 'بغداد');
    setTax(String(rest.taxRate * 100)); setService(String(rest.serviceCharge)); setCurrency(rest.currency);
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="px-1">
        <h2 className="text-2xl font-display font-extrabold text-slate-900 dark:text-white sm:text-3xl">⚙️ {t.settingsTitle}</h2>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">{t.settingsDesc}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Restaurants list + Add + Super User */}
        <div className="rounded-[2.2rem] bg-white/70 backdrop-blur-xl p-6 shadow-xl border border-white/50 dark:bg-zinc-900/70 dark:border-zinc-800/50 lg:col-span-4 h-fit space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-zinc-850 pb-3">
            <Store className="text-blue-500" size={18} />
            <h3 className="text-[14px] font-display font-extrabold text-slate-800 dark:text-zinc-200">{isRTL ? 'المطاعم' : 'Restaurants'}</h3>
          </div>

          {restaurants.map(rest => (
            <div key={rest.id} className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition ${rest.id === activeRestaurantId ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20' : 'border-slate-100 dark:border-zinc-800/80'}`} onClick={() => selectRestaurant(rest)}>
              <span className="text-2xl">{rest.logo}</span>
              <div className="flex-1 truncate">
                <p className="text-[13px] font-extrabold truncate">{rest.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{rest.city} - {rest.phone}</p>
              </div>
              {isSuperUser && restaurants.length > 1 && (
                <button onClick={(e) => { e.stopPropagation(); onDeleteRestaurant(rest.id); }} className="text-rose-400 hover:text-rose-600 p-1">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}

          {/* Add Restaurant Button */}
          <button onClick={() => setShowAddForm(!showAddForm)} className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-300 dark:border-blue-800 py-3 text-xs font-bold text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition">
            <Plus size={16} /> {isRTL ? 'إضافة مطعم جديد' : 'Add Restaurant'}
          </button>

          {/* Add Form */}
          {showAddForm && (
            <form onSubmit={handleAddNew} className="space-y-2 p-3 bg-slate-50 dark:bg-zinc-950 rounded-xl">
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="اسم المطعم" className="w-full rounded-lg border p-2 text-xs dark:bg-zinc-900 dark:border-zinc-700" required />
              <div className="flex gap-2">
                <input value={newLogo} onChange={e => setNewLogo(e.target.value)} placeholder="🍽️" className="w-16 rounded-lg border p-2 text-center text-xs dark:bg-zinc-900 dark:border-zinc-700" />
                <input value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="رقم الهاتف" className="flex-1 rounded-lg border p-2 text-xs dark:bg-zinc-900 dark:border-zinc-700" required />
              </div>
              <input value={newAddress} onChange={e => setNewAddress(e.target.value)} placeholder="العنوان" className="w-full rounded-lg border p-2 text-xs dark:bg-zinc-900 dark:border-zinc-700" />
              <select value={newCity} onChange={e => setNewCity(e.target.value)} className="w-full rounded-lg border p-2 text-xs dark:bg-zinc-900 dark:border-zinc-700">
                {IRAQI_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button type="submit" className="w-full rounded-full bg-green-500 py-2 text-xs font-bold text-white hover:bg-green-600">✅ {isRTL ? 'إضافة' : 'Add'}</button>
            </form>
          )}

          {/* Super User Section */}
          <div className="border-t border-slate-100 dark:border-zinc-800 pt-4 space-y-2">
            <div className="flex items-center gap-2">
              <Shield size={16} className={isSuperUser ? 'text-green-500' : 'text-slate-400'} />
              <span className="text-[11px] font-bold">{t.superUser}</span>
              <span className={`text-[9px] px-2 py-0.5 rounded-full ${isSuperUser ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400' : 'bg-slate-100 text-slate-500 dark:bg-zinc-800'}`}>
                {isSuperUser ? (isRTL ? 'مفتوح' : 'Unlocked') : (isRTL ? 'مقفل' : 'Locked')}
              </span>
            </div>
            {isSuperUser ? (
              <button onClick={() => onSetSuperUser(false)} className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-100 dark:bg-amber-950/30 py-2 text-xs font-bold text-amber-700">
                <Lock size={14} /> {t.superUserLock}
              </button>
            ) : (
              <div className="flex gap-1">
                <input type="password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} placeholder="كلمة المدير" className="flex-1 rounded-lg border p-2 text-xs dark:bg-zinc-900 dark:border-zinc-700" onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                <button onClick={handleLogin} className="rounded-lg bg-blue-500 px-3 text-xs font-bold text-white"><Unlock size={14} /></button>
              </div>
            )}
            {isSuperUser && <p className="text-[9px] text-slate-400 text-center">{t.loginRequired}</p>}
          </div>
        </div>

        {/* Right: Edit Restaurant + Preferences */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleUpdate} className="rounded-[2.2rem] bg-white/70 backdrop-blur-xl p-6 shadow-xl border border-white/50 dark:bg-zinc-900/70 dark:border-zinc-800/50 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-zinc-850 pb-3">
              <Settings className="text-blue-500" size={18} />
              <h3 className="text-[14px] font-display font-extrabold">{isRTL ? 'تعديل بيانات المطعم' : 'Edit Restaurant'}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400">{t.restaurantName}</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-lg">{logo}</span>
                  <input value={name} onChange={e => setName(e.target.value)} className={`w-full rounded-xl border p-2.5 text-xs font-semibold dark:bg-zinc-900 dark:border-zinc-800 ${isRTL ? 'pr-10' : 'pl-10'}`} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400">{t.restaurantPhone}</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full rounded-xl border p-2.5 text-xs font-semibold dark:bg-zinc-900 dark:border-zinc-800" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400">{t.restaurantAddress}</label>
                <input value={address} onChange={e => setAddress(e.target.value)} className="w-full rounded-xl border p-2.5 text-xs font-semibold dark:bg-zinc-900 dark:border-zinc-800" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400">المدينة</label>
                <select value={city} onChange={e => setCity(e.target.value)} className="w-full rounded-xl border p-2.5 text-xs font-semibold dark:bg-zinc-900 dark:border-zinc-800">
                  {IRAQI_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400">{t.taxRateInput}</label>
                <input value={tax} onChange={e => setTax(e.target.value)} className="w-full rounded-xl border p-2 text-xs font-semibold dark:bg-zinc-900 dark:border-zinc-800" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400">{t.serviceChargeInput}</label>
                <input value={service} onChange={e => setService(e.target.value)} className="w-full rounded-xl border p-2 text-xs font-semibold dark:bg-zinc-900 dark:border-zinc-800" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400">{t.currencyInput}</label>
                <input value={currency} onChange={e => setCurrency(e.target.value)} className="w-full rounded-xl border p-2 text-xs font-semibold dark:bg-zinc-900 dark:border-zinc-800" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400">{isRTL ? 'وضع الدفع' : 'Payment Mode'}</label>
              <div className="flex bg-slate-100 p-0.5 rounded-xl dark:bg-zinc-800">
                <button type="button" onClick={() => setPaymentMode('after')} className={'flex-1 px-3 py-2 rounded-lg text-xs font-bold ' + (paymentMode === 'after' ? 'bg-white shadow dark:bg-zinc-700' : 'text-slate-400')}>{isRTL ? '🍽️ بعد الأكل' : '🍽️ After Eating'}</button>
                <button type="button" onClick={() => setPaymentMode('before')} className={'flex-1 px-3 py-2 rounded-lg text-xs font-bold ' + (paymentMode === 'before' ? 'bg-white shadow dark:bg-zinc-700' : 'text-slate-400')}>{isRTL ? '💳 قبل الأكل' : '💳 Before Eating'}</button>
              </div>
            </div>
            <motion.button whileTap={{ scale: 0.98 }} type="submit" className="w-full rounded-full bg-blue-500 py-2.5 text-sm font-bold text-white hover:bg-blue-600">💾 {t.save}</motion.button>
          </form>

          {/* Preferences */}
          <div className="rounded-[2.2rem] bg-white/70 backdrop-blur-xl p-5 shadow-xl border border-white/50 dark:bg-zinc-900/70 dark:border-zinc-800/50 divide-y divide-slate-100 dark:divide-zinc-800/40">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white"><Globe size={16} /></div>
                <div><p className="text-[13px] font-bold">{t.language}</p></div>
              </div>
              <select value={lang} onChange={e => onSetLang(e.target.value as Lang)} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold dark:bg-zinc-800">
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-white">{theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}</div>
                <div><p className="text-[13px] font-bold">{t.theme}</p></div>
              </div>
              <div className="flex bg-slate-100 p-0.5 rounded-xl dark:bg-zinc-800">
                <button onClick={() => onSetTheme('light')} className={`px-3 py-1 rounded-lg text-xs font-bold ${theme === 'light' ? 'bg-white shadow dark:bg-zinc-700' : 'text-slate-400'}`}>{isRTL ? 'مضيء' : 'Light'}</button>
                <button onClick={() => onSetTheme('dark')} className={`px-3 py-1 rounded-lg text-xs font-bold ${theme === 'dark' ? 'bg-white shadow dark:bg-zinc-700' : 'text-slate-400'}`}>{isRTL ? 'داكن' : 'Dark'}</button>
              </div>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500 text-white"><Database size={16} /></div>
                <div><p className="text-[13px] font-bold text-rose-600">{isRTL ? 'إعادة ضبط' : 'Reset'}</p></div>
              </div>
              <button onClick={onResetData} className="rounded-xl bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600 hover:bg-rose-100 dark:bg-rose-950/20">{isRTL ? 'تهيئة' : 'Reset'}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
