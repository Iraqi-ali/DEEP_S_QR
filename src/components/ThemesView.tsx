/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Palette, CheckCircle2, Star, Sparkles, Award } from 'lucide-react';
import { MenuTheme, Lang } from '../types';
import { THEMES_LIST, TRANSLATIONS } from '../data';

interface ThemesViewProps {
  activeThemeId: string;
  onSelectTheme: (id: string) => void;
  lang: Lang;
}

export default function ThemesView({
  activeThemeId,
  onSelectTheme,
  lang
}: ThemesViewProps) {
  const t = TRANSLATIONS[lang];
  const isRTL = lang === 'ar';

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Title Header */}
      <div className="px-1">
        <h2 className="text-2xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          {t.themesTitle}
        </h2>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 font-sans mt-1">
          {t.themesDesc}
        </p>
      </div>

      {/* Grid containing 20 Themes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {THEMES_LIST.map((theme, index) => {
          const isActive = theme.id === activeThemeId;

          return (
            <motion.div
              key={theme.id}
              whileHover={{ y: -6, scale: 1.02 }}
              onClick={() => onSelectTheme(theme.id)}
              className={`relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-white p-5 cursor-pointer shadow-xl border transition-all duration-300 ${
                isActive
                  ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-blue-500/5'
                  : 'border-slate-100 dark:bg-zinc-900 dark:border-zinc-800/80 hover:border-slate-200 dark:hover:border-zinc-700 shadow-black/5'
              }`}
            >
              {/* Highlight number badge to prove it is exactly 20 themes! */}
              <span className="absolute top-2 right-3 font-mono text-[10px] font-bold text-slate-300 dark:text-zinc-700">
                #{String(index + 1).padStart(2, '0')}
              </span>

              {/* Title & Emojis */}
              <div className="space-y-1 pr-4">
                <h4 className="text-[14px] font-display font-extrabold text-slate-900 dark:text-white">
                  {isRTL ? theme.nameAr : theme.nameEn}
                </h4>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 tracking-wider font-mono uppercase">
                  {theme.id.split('-')[1]} Style
                </p>
              </div>

              {/* Color Palette previews */}
              <div className="my-4 flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-bold tracking-widest font-sans">PALETTE:</span>
                <div className="flex -space-x-1.5 rtl:space-x-reverse">
                  <span
                    className="h-5.5 w-5.5 rounded-full border border-white dark:border-zinc-900 shadow-sm"
                    style={{ backgroundColor: theme.primary }}
                    title="Primary"
                  />
                  <span
                    className="h-5.5 w-5.5 rounded-full border border-white dark:border-zinc-900 shadow-sm"
                    style={{ backgroundColor: theme.secondary }}
                    title="Secondary"
                  />
                  <span
                    className="h-5.5 w-5.5 rounded-full border border-white dark:border-zinc-900 shadow-sm"
                    style={{ backgroundColor: theme.accent }}
                    title="Accent"
                  />
                </div>
              </div>

              {/* Theme style indicator details */}
              <div className="space-y-2 mt-1">
                <div className="flex items-center gap-1 text-[9px] text-slate-400 font-mono">
                  <span>Font:</span>
                  <span className="font-bold text-slate-600 dark:text-zinc-300 uppercase">{theme.fontClass.split('-')[1] || 'default'}</span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 dark:border-zinc-800/50 pt-2.5">
                  {isActive ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-blue-500">
                      <CheckCircle2 size={13} />
                      <span>{isRTL ? 'مطبق حالياً' : 'Applied'}</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-slate-400 group-hover:text-slate-600">
                      {isRTL ? 'تطبيق المظهر' : 'Apply Theme'}
                    </span>
                  )}

                  {isActive && (
                    <span className="animate-bounce">
                      <Sparkles size={11} className="text-amber-400" />
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
