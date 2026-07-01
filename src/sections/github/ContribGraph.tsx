import { m } from 'framer-motion';
import type { ContribDay } from '../../../api/github-stats';
import { CONTRIB_COLORS } from './constants';
import { useReveal } from './useReveal';

function ContribCell({ day, delay }: { day: ContribDay; delay: number }) {
  const reveal = useReveal({ scale: 0, opacity: 0 }, { scale: 1, opacity: 1 });
  return (
    <m.div
      title={day.date ? `${day.count} contributions on ${day.date}` : ''}
      className={`w-[10px] h-[10px] rounded-[2px] ${day.date ? CONTRIB_COLORS[day.level] : 'bg-transparent'}`}
      {...reveal}
      transition={{ delay, duration: 0.2 }}
    />
  );
}

export function ContribGraph({ days }: { days: ContribDay[] }) {
  const last365 = days.slice(-365);
  const weeks: ContribDay[][] = [];
  let week: ContribDay[] = [];

  const firstDay = last365[0] ? new Date(last365[0].date).getDay() : 0;
  for (let i = 0; i < firstDay; i++) week.push({ date: '', count: 0, level: 0 });

  for (const day of last365) {
    week.push(day);
    if (week.length === 7) { weeks.push(week); week = []; }
  }
  if (week.length > 0) weeks.push(week);

  const months: { label: string; col: number }[] = [];
  weeks.forEach((w, wi) => {
    const first = w.find(d => d.date);
    if (!first) return;
    const d = new Date(first.date);
    if (wi === 0 || d.getDate() <= 7) {
      const label = d.toLocaleString('default', { month: 'short' });
      if (!months.length || months[months.length - 1].label !== label)
        months.push({ label, col: wi });
    }
  });

  return (
    <div className="w-full overflow-x-auto pb-1">
      <div className="min-w-[520px]">
        <div className="flex gap-0.5 mb-1 ml-8 relative h-4">
          {months.map((month) => (
            <span
              key={month.label + month.col}
              className="absolute font-hand text-[10px] text-pencil/50"
              style={{ left: `${(month.col / weeks.length) * 100}%` }}
            >
              {month.label}
            </span>
          ))}
        </div>
        <div className="flex gap-0.5">
          <div className="flex flex-col gap-0.5 mr-1 justify-around">
            {['Mon', 'Wed', 'Fri'].map(d => (
              <span key={d} className="font-hand text-[9px] text-pencil/40 leading-none h-[9px]">{d}</span>
            ))}
          </div>
          {weeks.map((w, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              {w.map((day, di) => (
                <ContribCell key={di} day={day} delay={wi * 0.003 + di * 0.001} />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 mt-2 justify-end">
          <span className="font-hand text-[10px] text-pencil/40">less</span>
          {CONTRIB_COLORS.map((c, i) => (
            <div key={i} className={`w-[10px] h-[10px] rounded-[2px] ${c}`} />
          ))}
          <span className="font-hand text-[10px] text-pencil/40">more</span>
        </div>
      </div>
    </div>
  );
}
