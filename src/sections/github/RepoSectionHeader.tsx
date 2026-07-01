import ScribbleText from '@/components/ScribbleText';
import DrawText from '@/components/DrawText';
import { Arrow } from '@/components/Doodles';

interface RepoSectionHeaderProps {
  subtitle?: string;
  withArrow?: boolean;
  className?: string;
}

export function RepoSectionHeader({ subtitle, withArrow = false, className = 'mb-16' }: RepoSectionHeaderProps) {
  return (
    <div className={`flex flex-col items-center relative ${className}`}>
      <h2 className="text-5xl md:text-6xl font-marker text-center relative">
        <ScribbleText color="text-highlighter-yellow">
          <DrawText text="repos" fontUrl="/fonts/PermanentMarker.woff" />
        </ScribbleText>
      </h2>
      {withArrow && (
        <Arrow className="absolute -left-12 -bottom-2 w-16 h-8 text-pencil/30 -rotate-12 scale-x-[-1]" />
      )}
      {subtitle && <p className="font-hand text-xl text-pencil mt-4">{subtitle}</p>}
    </div>
  );
}
