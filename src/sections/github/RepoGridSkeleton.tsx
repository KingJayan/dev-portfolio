import { Surface } from '@/components/ui/surface';

export function RepoGridSkeleton() {
  return (
    <div className="flex flex-wrap justify-center gap-10">
      {[...Array(6)].map((_, i) => (
        <div key={i} className={`w-full md:w-[calc(50%-20px)] lg:w-[calc(33.333%-28px)] ${i % 2 === 0 ? 'rotate-[-0.4deg]' : 'rotate-[0.4deg]'}`}>
          <Surface variant="elevated" className="h-full border border-pencil/25 rounded-xl p-5 flex flex-col gap-3">
            <div className="h-5 w-2/3 rounded bg-ink/10 animate-pulse" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-4 w-full rounded bg-ink/8 animate-pulse" style={{ animationDelay: '80ms' }} />
              <div className="h-4 w-5/6 rounded bg-ink/8 animate-pulse" style={{ animationDelay: '120ms' }} />
              <div className="h-4 w-3/4 rounded bg-ink/8 animate-pulse" style={{ animationDelay: '160ms' }} />
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-pencil/15">
              <div className="w-3 h-3 rounded-full bg-ink/15 animate-pulse" style={{ animationDelay: '200ms' }} />
              <div className="h-3.5 w-16 rounded bg-ink/10 animate-pulse" style={{ animationDelay: '200ms' }} />
              <div className="h-3.5 w-10 rounded bg-ink/10 animate-pulse ml-2" style={{ animationDelay: '240ms' }} />
              <div className="h-3 w-14 rounded bg-ink/8 animate-pulse ml-auto" style={{ animationDelay: '280ms' }} />
            </div>
          </Surface>
        </div>
      ))}
    </div>
  );
}
