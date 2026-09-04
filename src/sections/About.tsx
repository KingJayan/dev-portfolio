import { m } from 'framer-motion';
import { portfolioConfig } from '@/portfolio.config';
import { Star, Spiral, Underline } from '@/components/Doodles';
import TechIcon from '@/components/TechIcon';
import HandmadeTooltip from '@/components/ui/HandmadeTooltip';
import { Surface } from '@/components/ui/surface';
import ScribbleText from '@/components/ScribbleText';
import DrawText from '@/components/DrawText';

type ToolkitGroup = typeof portfolioConfig.about.toolkit[number];
type ToolkitItem = ToolkitGroup["items"][number];

function itemTooltip(item: ToolkitItem) {
  return "since" in item ? `${item.name} · since ${item.since}` : item.name;
}

export default function About() {
  const { personal, about } = portfolioConfig;
  const { toolkit } = about;

  return (
    <section id="about" className="relative min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto flex flex-col gap-16 items-start">
      <div className="doodle-layer opacity-[0.15]">
        <Spiral className="absolute top-16 left-8 w-28 h-28 text-pencil/30" />
        <Star className="absolute bottom-24 right-10 w-10 h-10 text-highlighter-yellow/80" />
      </div>

      <m.div
        initial={{ x: -100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
        className="relative group w-full max-w-3xl mx-auto"
      >
        <Surface variant="elevated" className="p-10 relative w-full">
          <div className="w-56 h-56 mx-auto mb-8 border border-ink/20 dark:border-white/15 ring-1 ring-ink/5 dark:ring-white/10 rounded-full overflow-hidden relative bg-paper/60 dark:bg-white/[0.04] backdrop-blur-sm shadow-paper group-hover:shadow-paper-hover transition-all duration-500">
            <img
              src="/images/profile.png" alt="Profile"
              width={448} height={448}
              className="w-full h-full object-cover object-[center_18%] scale-[1.18] transition-all duration-700"
            />
          </div>

          <h2 className="text-6xl font-marker text-center mb-8 relative">
            <ScribbleText color="text-highlighter-yellow">
              <DrawText text="About" fontUrl="/fonts/PermanentMarker.woff" />
            </ScribbleText>
          </h2>

          <div className="font-hand text-lg text-ink leading-relaxed space-y-6">
            <p>Hi! I’m <ScribbleText color="text-highlighter-yellow" className="font-bold rotate-1 px-1">{personal.name}</ScribbleText>.</p>
            {about.bio?.map((paragraph: string, idx: number) => <p key={idx}>{paragraph}</p>)}
          </div>
        </Surface>
      </m.div>

      <m.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="w-full"
      >
        <Surface variant="elevated" className="p-10 relative">
          <h3 className="relative text-3xl font-amatic font-bold mb-10 pb-5 flex items-center gap-4 text-pencil justify-center">
            <Box className="w-10 h-10 text-highlighter-yellow" />
            Toolkit
            <Underline className="absolute bottom-0 left-0 w-full h-2 text-pencil/40" />
          </h3>
          <div className="flex flex-col gap-8">
            {toolkit.map((group: ToolkitGroup) => (
              <div key={group.group}>
                <p className="font-hand text-ink tracking-[0.15em] uppercase text-ink/60 mb-4 text-center"><b>{group.group}</b></p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-6 px-4 justify-items-center">
                  {group.items.map((item: ToolkitItem) => (
                    <HandmadeTooltip key={item.name} content={itemTooltip(item)}>
                      <m.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }} className="flex flex-col items-center gap-2 group cursor-default">
                        <Surface variant="default" className="w-12 h-12 border-ink/20 rounded-xl flex items-center justify-center shadow-paper group-hover:shadow-paper-hover group-hover:bg-highlighter-yellow/40 group-hover:border-pencil/45 transition-all duration-200">
                          <TechIcon name={item.icon} className="w-6 h-6 text-ink group-hover:scale-110 transition-transform" />
                        </Surface>
                      </m.div>
                    </HandmadeTooltip>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Surface>
      </m.div>
    </section>
  );
}

function Box({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}
