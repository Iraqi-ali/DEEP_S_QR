/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Wifi, Signal, Battery, BatteryCharging } from 'lucide-react';
import { Lang } from '../types';

interface StatusHeaderProps {
  lang: 'ar' | 'en';
}

export default function StatusHeader({ lang }: StatusHeaderProps) {
  const [time, setTime] = useState('');
  const isRTL = lang === 'ar';

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? (isRTL ? 'م' : 'PM') : (isRTL ? 'ص' : 'AM');
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      setTime(`${hours}:${minutes} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, [isRTL]);

  return (
    <div
      className="flex h-9 select-none items-center justify-between px-6 text-[12px] font-semibold text-slate-800 dark:text-zinc-200 transition-colors duration-300"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Time & Carrier */}
      <div className="flex items-center gap-1.5 font-mono">
        <span>{time}</span>
        <span className="hidden text-[10px] opacity-60 sm:inline">|</span>
        <span className="hidden text-[10px] font-sans font-normal opacity-75 sm:inline">
          {isRTL ? 'أثير المدى' : 'Atheer Mobile'}
        </span>
      </div>

      {/* Notch / Dynamic Island Placeholder Margin */}
      <div className="h-4 w-20 md:w-28" />

      {/* Network & Battery Status */}
      <div className="flex items-center gap-2">
        <Signal size={13} className="text-slate-800 dark:text-zinc-200" />
        <span className="text-[9px] font-sans opacity-70">5G</span>
        <Wifi size={13} className="text-slate-800 dark:text-zinc-200" />
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono opacity-80">98%</span>
          <div className="relative flex h-3.5 w-7 items-center justify-start rounded-md border border-slate-700/40 p-0.5 dark:border-zinc-500/50">
            <div className="h-full w-[90%] rounded-sm bg-emerald-500" />
            <div className="absolute -right-[3px] top-[4px] h-[4px] w-[2px] rounded-r-sm bg-slate-700/50 dark:bg-zinc-400/50" />
          </div>
        </div>
      </div>
    </div>
  );
}
