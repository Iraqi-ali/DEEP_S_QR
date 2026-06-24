/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Info, AlertTriangle, RefreshCw, Wifi, Moon, Sun } from 'lucide-react';
import { NotificationPayload } from '../types';

interface DynamicIslandProps {
  notification: NotificationPayload | null;
  onClear: () => void;
  lang: 'ar' | 'en';
}

export default function DynamicIsland({ notification, onClear, lang }: DynamicIslandProps) {
  const [isActive, setIsActive] = useState(false);
  const isRTL = lang === 'ar';

  useEffect(() => {
    if (notification) {
      setIsActive(true);
      const timer = setTimeout(() => {
        setIsActive(false);
        setTimeout(onClear, 400); // Wait for transition out before clearing
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [notification, onClear]);

  const renderIcon = () => {
    if (!notification) return null;
    switch (notification.icon) {
      case 'success':
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-inner">
            <Check size={14} strokeWidth={3} />
          </div>
        );
      case 'warning':
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white">
            <AlertTriangle size={14} strokeWidth={3} />
          </div>
        );
      case 'reset':
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white animate-spin">
            <RefreshCw size={12} strokeWidth={3} />
          </div>
        );
      case 'wifi':
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white">
            <Wifi size={14} strokeWidth={2.5} />
          </div>
        );
      case 'theme_dark':
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500 text-white">
            <Moon size={14} strokeWidth={2.5} />
          </div>
        );
      case 'theme_light':
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-slate-900">
            <Sun size={14} strokeWidth={2.5} />
          </div>
        );
      default:
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white">
            <Info size={14} strokeWidth={2.5} />
          </div>
        );
    }
  };

  return (
    <div className="pointer-events-none absolute top-2 left-0 right-0 z-50 flex justify-center">
      <AnimatePresence mode="wait">
        {!isActive ? (
          /* Idle Pill shape resembling standard Dynamic Island */
          <motion.div
            key="idle"
            layoutId="dynamic-island"
            className="pointer-events-auto flex h-7 items-center justify-between rounded-full bg-black px-4 text-[11px] font-medium text-white shadow-lg transition-colors duration-300 hover:bg-zinc-900"
            style={{ width: '110px' }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono tracking-wider">iOS 17</span>
            <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
          </motion.div>
        ) : (
          /* Active Expanded Notification Banner */
          <motion.div
            key="active"
            layoutId="dynamic-island"
            className="pointer-events-auto flex min-h-[56px] w-[340px] items-center gap-3 rounded-[24px] bg-black p-3 text-white shadow-2xl md:w-[380px]"
            initial={{ width: '110px', height: '28px', borderRadius: '14px', opacity: 0 }}
            animate={{ width: '350px', height: 'auto', borderRadius: '24px', opacity: 1 }}
            exit={{ width: '110px', height: '28px', borderRadius: '14px', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: 'spring' }}
              className="flex-shrink-0"
            >
              {renderIcon()}
            </motion.div>

            <div className="flex flex-1 flex-col justify-center overflow-hidden">
              <motion.h4
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="truncate text-[13px] font-bold tracking-tight text-white"
              >
                {notification?.title}
              </motion.h4>
              {notification?.subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="truncate text-[11px] text-zinc-400"
                >
                  {notification.subtitle}
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
