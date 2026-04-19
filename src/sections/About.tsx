import { motion } from 'framer-motion';
import { portfolioConfig } from '@/portfolio.config';
import { Star, Spiral } from '@/components/Doodles';
import TechIcon from '@/components/TechIcon';
import HandmadeTooltip from '@/components/ui/HandmadeTooltip';
import { Surface } from '@/components/ui/surface';
import ScribbleText from '@/components/ScribbleText';
import { Lightbulb } from 'lucide-react';

type AboutSkill = typeof portfolioConfig.about.skills[number];
type AboutTool = typeof portfolioConfig.about.tools[number];

const CHIP_COLORS = [
  "bg-amber/10 border-amber/30 hover:bg-amber/20 hover:border-amber/50",
  "bg-rose/10 border-rose/25 hover:bg-rose/20 hover:border-rose/45",
  "bg-sage/10 border-sage/25 hover:bg-sage/20 hover:border-sage/45",
  "bg-slate/10 border-slate/25 hover:bg-slate/20 hover:border-slate/45",
];

export default function About() {
  const { personal, about } = portfolioConfig;
  const { skills, tools } = about;

  return (
    <section id="about" className="relative min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto flex flex-col gap-16 items-start">
      <div className="absolute inset-0 pointer-events-none opacity-[0.15]">
        <Spiral className="absolute top-16 left-8 w-28 h-28 text-pencil/30" />
        <Star className="absolute bottom-24 right-10 w-10 h-10 text-highlighter-yellow/80" />
      </div>

      {/* bio + skills */}
      <div className="flex flex-col lg:flex-row gap-16 items-start w-full">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
          className="flex-1 relative group w-full"
        >
          <Surface variant="elevated" className="p-10 relative w-full">
            <div className="w-56 h-56 mx-auto mb-8 border border-ink/20 rounded-full overflow-hidden relative bg-paper/60 backdrop-blur-sm shadow-paper group-hover:shadow-paper-hover transition-all duration-500">
              <img
                src="/images/profile.png" alt="Profile"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="absolute inset-0 hidden items-center justify-center font-marker text-2xl text-ink/40 text-center p-4">
                Add profile.png
              </div>
            </div>

            <h2 className="text-6xl font-marker text-center mb-8 relative">
              <ScribbleText color="text-highlighter-yellow">about</ScribbleText>
            </h2>

            <div className="font-hand text-lg text-ink leading-relaxed space-y-6">
              <p>Hi! I'm <ScribbleText color="text-highlighter-yellow" className="font-bold rotate-1 px-1">{personal.name}</ScribbleText>.</p>
              {about.bio?.map((paragraph: string, idx: number) => <p key={idx}>{paragraph}</p>)}
            </div>
          </Surface>
        </motion.div>

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, type: "spring", stiffness: 50 }}
          className="flex-1 space-y-12 w-full"
        >
          <Surface variant="elevated" className="p-8 relative h-full">
            <h3 className="text-3xl font-amatic font-bold mb-8 border-b border-pencil/40 pb-2 flex items-center gap-3">
              <Star className="w-8 h-8 text-highlighter-yellow" />
              skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill: AboutSkill, idx: number) => (
                <motion.span
                  key={skill.name}
                  whileHover={{ scale: 1.07, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`px-3 py-1.5 backdrop-blur-sm border rounded-full font-hand text-base text-ink shadow-paper hover:shadow-paper-hover transition-[border-color,background-color,box-shadow] cursor-default ${CHIP_COLORS[idx % CHIP_COLORS.length]}`}
                >
                  {skill.name}
                </motion.span>
              ))}
            </div>
          </Surface>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 260, damping: 25, delay: 0.3 }}
            className="relative overflow-hidden group transition-shadow"
          >
            <Surface variant="muted" className="p-6 relative shadow-sm">
              <h4 className="text-3xl font-marker text-ink/70 mb-3 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-highlighter-yellow" />
                fun bit
              </h4>
              <p className="font-hand text-lg text-ink/80 leading-snug">
                I started learning to code during the COVID-19 pandemic.
              </p>
            </Surface>
          </motion.div>
        </motion.div>
      </div>

      {/* toolkit */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="w-full"
      >
        <Surface variant="elevated" className="p-10 relative">
          <h3 className="text-3xl font-amatic font-bold mb-10 border-b border-pencil/40 pb-4 flex items-center gap-4 text-pencil justify-center">
            <Box className="w-10 h-10 text-highlighter-yellow" />
            toolkit
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-6 px-4 justify-items-center">
            {tools.map((tool: AboutTool) => (
              <HandmadeTooltip key={tool.name} content={tool.name}>
                <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }} className="flex flex-col items-center gap-2 group cursor-default">
                  <Surface variant="default" className="w-12 h-12 border-ink/20 rounded-xl flex items-center justify-center shadow-paper group-hover:shadow-paper-hover group-hover:bg-highlighter-yellow/40 group-hover:border-pencil/45 transition-all duration-200">
                    <TechIcon name={tool.icon} className="w-6 h-6 text-ink group-hover:scale-110 transition-transform" />
                  </Surface>
                </motion.div>
              </HandmadeTooltip>
            ))}
          </div>
          <p className="font-hand text-sm text-pencil/40 mt-10 italic text-center">
            * Tools I use to bring ideas to life.
          </p>
        </Surface>
      </motion.div>
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
