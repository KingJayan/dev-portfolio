import { m } from 'framer-motion';
import { RefreshCw, WifiOff } from 'lucide-react';
import PaperCard from '@/components/ui/PaperCard';
import { Surface } from '@/components/ui/surface';

export function RepoErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="relative flex flex-wrap justify-center gap-10">
      {[...Array(6)].map((_, i) => (
        <Surface
          variant="elevated"
          key={i}
          className={`w-full md:w-[calc(50%-20px)] lg:w-[calc(33.333%-28px)] h-48 border-ink/10 opacity-30 ${i % 2 === 0 ? 'rotate-[-1deg]' : 'rotate-[1deg]'}`}
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <m.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
        >
          <PaperCard rotate={-1.5} className="text-center px-8 py-6 shadow-paper-hover">
            <WifiOff className="w-8 h-8 text-pencil/60 mx-auto mb-3" />
            <p className="font-marker text-2xl text-ink mb-1">couldn't reach github</p>
            <p className="font-hand text-base text-pencil/70 mb-4 max-w-[22ch]">{message}</p>
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 font-hand text-base text-ink bg-highlighter-yellow/40 hover:bg-highlighter-yellow/70 border border-ink/20 rounded-lg px-4 py-1.5 transition-colors active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              retry
            </button>
          </PaperCard>
        </m.div>
      </div>
    </div>
  );
}
