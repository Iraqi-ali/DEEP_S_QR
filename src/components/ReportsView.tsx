/**
 * Reports View - Interactive Sales Reports 🇮🇶
 */
import { useState } from 'react';
import { Printer, Download, FileSpreadsheet } from 'lucide-react';
import { Order, MenuItem, Lang } from '../types';

interface ReportsViewProps { orders: Order[]; menuItems: MenuItem[]; lang: Lang; }

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';

export default function ReportsView({ orders, lang }: ReportsViewProps) {
  const isRTL = lang === 'ar';
  const [period, setPeriod] = useState<Period>('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const getDateRange = () => {
    const d = new Date(selectedDate);
    if (period === 'daily') return { start: new Date(d.setHours(0,0,0,0)), end: new Date(d.setHours(23,59,59,999)) };
    if (period === 'weekly') {
      const start = new Date(d); start.setDate(d.getDate() - d.getDay()); start.setHours(0,0,0,0);
      const end = new Date(start); end.setDate(end.getDate() + 6); end.setHours(23,59,59,999);
      return { start, end };
    }
    if (period === 'monthly') return { start: new Date(d.getFullYear(), d.getMonth(), 1), end: new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59) };
    return { start: new Date(d.getFullYear(), 0, 1), end: new Date(d.getFullYear(), 11, 31, 23, 59, 59) };
  };

  const { start, end } = getDateRange();
  const filtered = orders.filter(o => { const dt = new Date(o.createdAt); return dt >= start && dt <= end; });
  const totalRev = filtered.reduce((s, o) => s + o.total, 0);
  const paidCount = filtered.filter(o => o.status === 'paid').length;

  const exportCSV = () => {
    let csv = '\uFEFF' + (isRTL ? 'رقم,طاولة,تاريخ,حالة,إجمالي,دفع\n' : 'ID,Table,Date,Status,Total,Payment\n');
    filtered.forEach(o => csv += `#${o.id.split('-')[1]},${o.tableId},${new Date(o.createdAt).toLocaleDateString()},${o.status},${o.total},${o.paymentMethod||''}\n`);
    const b = new Blob([csv], { type: 'text/csv' }); const a = document.createElement('a');
    a.href = URL.createObjectURL(b); a.download = `report-${period}-${selectedDate}.csv`; a.click();
  };

  const printR = () => window.print();

  const periods: { key: Period; label: string }[] = [
    { key: 'daily', label: isRTL ? 'يومي' : 'Daily' },
    { key: 'weekly', label: isRTL ? 'أسبوعي' : 'Weekly' },
    { key: 'monthly', label: isRTL ? 'شهري' : 'Monthly' },
    { key: 'yearly', label: isRTL ? 'سنوي' : 'Yearly' },
  ];

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="px-1">
        <h2 className="text-2xl font-display font-extrabold text-slate-900 dark:text-white sm:text-3xl">📊 {isRTL ? 'تقارير المبيعات' : 'Sales Reports'}</h2>
        <p className="text-[13px] text-slate-500 dark:text-zinc-400 mt-1">{isRTL ? 'تقارير تفاعلية قابلة للتصدير والطباعة' : 'Interactive exportable reports'}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 bg-white/60 dark:bg-zinc-900/60 rounded-2xl p-3 backdrop-blur">
        <div className="flex bg-slate-100 dark:bg-zinc-800 rounded-xl p-0.5">
          {periods.map(p => (
            <button key={p.key} onClick={() => setPeriod(p.key)} className={'px-4 py-2 rounded-lg text-xs font-bold transition ' + (period === p.key ? 'bg-blue-500 text-white shadow' : 'text-slate-500')}>{p.label}</button>
          ))}
        </div>
        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="rounded-xl border p-2 text-xs dark:bg-zinc-900 dark:border-zinc-700" />
        <div className="flex-1" />
        <button onClick={exportCSV} className="flex items-center gap-1.5 rounded-xl bg-green-500 px-4 py-2 text-xs font-bold text-white hover:bg-green-600"><FileSpreadsheet size={14} /> Excel</button>
        <button onClick={printR} className="flex items-center gap-1.5 rounded-xl bg-zinc-800 dark:bg-zinc-700 px-4 py-2 text-xs font-bold text-white hover:bg-zinc-700"><Printer size={14} /> {isRTL ? 'طباعة' : 'Print'}</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: isRTL ? 'فواتير' : 'Invoices', v: filtered.length, c: 'border-blue-500' },
          { label: isRTL ? 'مدفوعة' : 'Paid', v: paidCount, c: 'border-green-500' },
          { label: isRTL ? 'الإيرادات' : 'Revenue', v: totalRev.toLocaleString() + ' ' + (isRTL ? 'د.ع' : 'IQD'), c: 'border-amber-500' },
          { label: isRTL ? 'متوسط' : 'Avg', v: filtered.length ? Math.round(totalRev/filtered.length).toLocaleString() + ' ' + (isRTL ? 'د.ع' : 'IQD') : '0', c: 'border-purple-500' },
        ].map((card, i) => (
          <div key={i} className={'rounded-2xl p-4 bg-white/60 dark:bg-zinc-900/60 backdrop-blur border-l-4 ' + card.c}>
            <p className="text-[10px] text-slate-400 font-bold uppercase">{card.label}</p>
            <p className="text-lg font-extrabold mt-1">{card.v}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 dark:bg-zinc-800"><tr>
              <th className="px-4 py-3 text-left font-bold">#</th>
              <th className="px-4 py-3 text-left font-bold">{isRTL ? 'طاولة' : 'Table'}</th>
              <th className="px-4 py-3 text-left font-bold">{isRTL ? 'تاريخ' : 'Date'}</th>
              <th className="px-4 py-3 text-left font-bold">{isRTL ? 'حالة' : 'Status'}</th>
              <th className="px-4 py-3 text-right font-bold">{isRTL ? 'إجمالي' : 'Total'}</th>
              <th className="px-4 py-3 text-right font-bold">{isRTL ? 'طباعة' : 'Print'}</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {filtered.length === 0 ? <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">{isRTL ? 'لا توجد فواتير' : 'No invoices'}</td></tr> :
                filtered.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50">
                    <td className="px-4 py-3 font-mono font-bold">#{o.id.split('-')[1]}</td>
                    <td className="px-4 py-3">{o.tableId}</td>
                    <td className="px-4 py-3">{new Date(o.createdAt).toLocaleDateString(isRTL ? 'ar-IQ' : 'en-US')}</td>
                    <td className="px-4 py-3"><span className={'px-2 py-0.5 rounded-full text-[9px] font-bold ' + (o.status === 'paid' ? 'bg-green-100 text-green-700' : o.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700')}>{o.status}</span></td>
                    <td className="px-4 py-3 text-right font-bold">{o.total.toLocaleString()} {isRTL ? 'د.ع' : 'IQD'}</td>
                    <td className="px-4 py-3 text-right"><button onClick={printR} className="text-blue-500 hover:underline text-[10px] font-bold"><Printer size={12} className="inline" /></button></td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
