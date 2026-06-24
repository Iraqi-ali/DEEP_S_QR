/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { QrCode, Plus, Eye, Trash2, Users, Layers, AlertCircle } from 'lucide-react';
import QRCode from 'qrcode';
import { Table, Lang } from '../types';
import { TRANSLATIONS } from '../data';

// Helper to construct the guest menu URL
export function getPublicGuestMenuUrl(tableId: string): string {
  return `${window.location.origin}/?tableId=${tableId}`;
}

// Compact sub-component to render scannable table QR code client-side
function TableQRCode({ tableId }: { tableId: string }) {
  const [qrSrc, setQrSrc] = useState<string>('');

  useEffect(() => {
    const url = getPublicGuestMenuUrl(tableId);
    QRCode.toDataURL(url, { margin: 1, width: 250 })
      .then(setQrSrc)
      .catch(err => console.error('Failed to generate QR code:', err));
  }, [tableId]);

  if (!qrSrc) {
    return (
      <div className="h-full w-full bg-slate-100 dark:bg-zinc-800 animate-pulse rounded-xl" />
    );
  }

  return (
    <img
      src={qrSrc}
      alt="Table QR"
      className="h-full w-full object-contain"
      referrerPolicy="no-referrer"
    />
  );
}

interface TablesViewProps {
  tables: Table[];
  onAddTable: (number: string, capacity: number) => void;
  onDeleteTable: (id: string) => void;
  onSimulateScan: (tableId: string) => void;
  lang: Lang;
  restaurantName?: string;
  restaurantLogo?: string;
}

export default function TablesView({
  tables,
  onAddTable,
  onDeleteTable,
  onSimulateScan,
  lang,
  restaurantName = 'QR Restaurant',
  restaurantLogo = '🍽️'
}: TablesViewProps) {
  const [newNum, setNewNum] = useState('');
  const [newCap, setNewCap] = useState(4);
  const [error, setError] = useState('');
  const [downloadingTableId, setDownloadingTableId] = useState<string | null>(null);

  const t = TRANSLATIONS[lang];
  const isRTL = lang === 'ar';

  const handleDownloadQR = async (table: Table) => {
    setDownloadingTableId(table.id);
    const guestMenuUrl = getPublicGuestMenuUrl(table.id);

    try {
      // 1. Draw a high-res printable flyer card on an offscreen canvas
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // Gradient background matching luxurious branding
      const grad = ctx.createLinearGradient(0, 0, 0, 800);
      grad.addColorStop(0, '#1e293b'); // slate-800
      grad.addColorStop(1, '#0f172a'); // slate-900
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 600, 800);

      // Gold/Ice-blue elegant inner border
      ctx.strokeStyle = '#38bdf8'; // sky-400
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, 540, 740);

      // Subtle ambient overlay circle
      ctx.fillStyle = 'rgba(56, 189, 248, 0.03)';
      ctx.beginPath();
      ctx.arc(300, 400, 250, 0, Math.PI * 2);
      ctx.fill();

      // Brand Logo / Emoji
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '64px serif';
      ctx.fillText(restaurantLogo, 300, 110);

      // Restaurant name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px "Inter", sans-serif';
      ctx.fillText(restaurantName, 300, 180);

      // Table indicator banner
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 36px "Inter", sans-serif';
      ctx.fillText(`${isRTL ? 'طاولة' : 'TABLE'} ${table.number}`, 300, 240);

      // Subtitle instructions
      ctx.fillStyle = '#94a3b8'; // slate-400
      ctx.font = '15px "Inter", sans-serif';
      ctx.fillText(
        isRTL ? 'امسح رمز الاستجابة السريعة لعرض القائمة والطلب مباشرة' : 'Scan to view our digital menu & order instantly',
        300,
        295
      );

      // Generate the QR code data URL client-side with 0 networking dependencies
      const qrDataUrl = await QRCode.toDataURL(guestMenuUrl, { margin: 1, width: 300 });

      const qrImg = new Image();
      qrImg.src = qrDataUrl;

      await new Promise<void>((resolve, reject) => {
        qrImg.onload = () => {
          // Draw card background for the QR Code
          ctx.fillStyle = '#ffffff';
          // Rounded rect path helper
          const x = 150, y = 340, w = 300, h = 300, r = 24;
          ctx.beginPath();
          ctx.moveTo(x + r, y);
          ctx.lineTo(x + w - r, y);
          ctx.quadraticCurveTo(x + w, y, x + w, y + r);
          ctx.lineTo(x + w, y + h - r);
          ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
          ctx.lineTo(x + r, y + h);
          ctx.quadraticCurveTo(x, y + h, x, y + h - r);
          ctx.lineTo(x, y + r);
          ctx.quadraticCurveTo(x, y, x + r, y);
          ctx.closePath();
          ctx.fill();

          // Draw the actual generated QR Code
          ctx.drawImage(qrImg, 175, 365, 250, 250);
          resolve();
        };
        qrImg.onerror = () => {
          reject(new Error('Failed to load QR image'));
        };
      });

      // Footer branding
      ctx.fillStyle = '#64748b'; // slate-500
      ctx.font = '13px monospace';
      ctx.fillText(`ID: ${table.qrCodeSeed}`, 300, 680);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 15px "Inter", sans-serif';
      ctx.fillText(
        isRTL ? 'يسعدنا خدمتكم دائماً' : 'We are delighted to serve you',
        300,
        715
      );

      // Export and trigger download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `table-${table.number}-qr-sticker.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Canvas export failed, falling back directly to data url:', err);
      try {
        const directQrDataUrl = await QRCode.toDataURL(guestMenuUrl, { margin: 1, width: 400 });
        const link = document.createElement('a');
        link.download = `table-${table.number}-qr.png`;
        link.href = directQrDataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (innerErr) {
        console.error('Direct fallback also failed:', innerErr);
      }
    } finally {
      setDownloadingTableId(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNum.trim()) {
      setError(isRTL ? 'الرجاء إدخال اسم أو رقم الطاولة' : 'Please enter table name or number');
      return;
    }
    onAddTable(newNum.trim(), newCap);
    setNewNum('');
    setNewCap(4);
    setError('');
  };

  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'empty':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/40';
      case 'ordering':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/40';
      case 'waiting':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/40';
      case 'eating':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/40';
      case 'dirty':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/40';
    }
  };

  const getStatusLabel = (status: Table['status']) => {
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
      {/* Title Header */}
      <div className="px-1">
        <h2 className="text-2xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          {t.tablesTitle}
        </h2>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 font-sans mt-1">
          {t.tablesDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Form Panel */}
        <div className="rounded-[2rem] bg-white/70 backdrop-blur-xl p-6 shadow-xl shadow-black/5 border border-white/50 dark:bg-zinc-900/70 dark:border-zinc-800/50 lg:col-span-4 h-fit space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-zinc-800">
            <Layers className="text-blue-500 dark:text-blue-400 animate-pulse" size={18} />
            <h3 className="text-[14px] font-display font-extrabold text-slate-800 dark:text-zinc-200">
              {t.addTable}
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-1.5 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-600 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 font-sans">
                {t.tableName}
              </label>
              <input
                type="text"
                value={newNum}
                onChange={(e) => setNewNum(e.target.value)}
                placeholder={isRTL ? 'مثال: طاولة 7 أو طابق ثاني 3' : 'e.g. Table 7 or Terrace 3'}
                className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 py-2.5 px-4 text-sm font-semibold outline-none transition focus:border-blue-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-500 dark:text-zinc-400 font-sans">{t.tableCapacity}</span>
                <span className="font-mono font-bold text-blue-500 dark:text-blue-400">{newCap}</span>
              </div>
              <input
                type="range"
                min="1"
                max="16"
                value={newCap}
                onChange={(e) => setNewCap(parseInt(e.target.value))}
                className="h-1.5 w-full cursor-pointer rounded-lg bg-slate-100 accent-blue-500 dark:bg-zinc-800"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1</span>
                <span>4</span>
                <span>8</span>
                <span>12</span>
                <span>16</span>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-500 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition"
            >
              <Plus size={16} />
              <span>{t.addTable}</span>
            </motion.button>
          </form>
        </div>

        {/* Right Tables Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          {tables.map((table) => {
            const statusClass = getStatusColor(table.status);
            return (
              <motion.div
                key={table.id}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-white/70 backdrop-blur-xl p-5 shadow-xl shadow-black/5 border border-white/50 dark:bg-zinc-900/70 dark:border-zinc-800/50"
              >
                {/* Header info */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-[16px] font-display font-extrabold text-slate-900 dark:text-white">
                      {table.number}
                    </h4>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                      <Users size={12} />
                      <span>{table.capacity} {isRTL ? 'أفراد' : 'Guests max'}</span>
                    </div>
                  </div>

                  <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${statusClass}`}>
                    {getStatusLabel(table.status)}
                  </span>
                </div>

                {/* Real, Scannable QR Code Area */}
                <div className="my-5 flex items-center gap-4 bg-slate-50/50 dark:bg-zinc-950/40 p-3.5 rounded-2xl border border-slate-100 dark:border-zinc-800/50">
                  <div className="relative h-20 w-20 bg-white p-1 rounded-xl border border-slate-100 shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
                    <TableQRCode tableId={table.id} />
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">
                      {isRTL ? 'رمز كيو آر الفعلي' : 'LIVE SCANNABLE QR'}
                    </p>
                    <p className="font-mono text-[10px] text-slate-500 truncate max-w-[150px] dark:text-zinc-400">
                      ?tableId={table.id}
                    </p>
                    <button
                      onClick={() => handleDownloadQR(table)}
                      disabled={downloadingTableId === table.id}
                      className="flex items-center gap-1.5 text-[11px] text-blue-500 font-bold hover:underline cursor-pointer disabled:opacity-50"
                    >
                      <QrCode size={13} className="shrink-0" />
                      <span>
                        {downloadingTableId === table.id
                          ? (isRTL ? 'جاري التنزيل...' : 'Exporting...')
                          : (isRTL ? 'تنزيل ملصق الطاولة' : 'Download Table Decal')
                        }
                      </span>
                    </button>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-zinc-800/50">
                  <button
                    onClick={() => onSimulateScan(table.id)}
                    className="group flex h-8 items-center justify-center rounded-full bg-blue-500 text-white px-4 text-[11px] font-bold shadow-lg shadow-blue-500/15 hover:bg-blue-600 transition"
                  >
                    <Eye size={12} className={isRTL ? 'ml-1' : 'mr-1'} />
                    <span>{t.scanToSimulate}</span>
                  </button>

                  <button
                    onClick={() => onDeleteTable(table.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-55 border border-slate-200/60 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition dark:border-zinc-800 dark:hover:bg-rose-950/20"
                    title={t.delete}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
