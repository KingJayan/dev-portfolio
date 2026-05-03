import { motion } from 'framer-motion';
import { portfolioConfig } from '@/portfolio.config';
import { Star, Spiral, Underline } from '@/components/Doodles';
import TechIcon from '@/components/TechIcon';
import HandmadeTooltip from '@/components/ui/HandmadeTooltip';
import { Surface } from '@/components/ui/surface';
import ScribbleText from '@/components/ScribbleText';

type AboutSkill = typeof portfolioConfig.about.skills[number];
type AboutTool = typeof portfolioConfig.about.tools[number];

const SKILL_COLORS = [
  { bar: "bg-amber/40", glow: "shadow-[0_0_8px_theme(colors.amber.DEFAULT/0.4)]", label: "text-amber" },
  { bar: "bg-rose/40", glow: "shadow-[0_0_8px_theme(colors.rose.DEFAULT/0.4)]", label: "text-rose" },
  { bar: "bg-sage/40", glow: "shadow-[0_0_8px_theme(colors.sage.DEFAULT/0.4)]", label: "text-sage" },
  { bar: "bg-slate/40", glow: "shadow-[0_0_8px_theme(colors.slate.DEFAULT/0.4)]", label: "text-slate" },
];

function SkillBar({ skill, idx }: { skill: { name: string; level: number }; idx: number }) {
  const color = SKILL_COLORS[idx % SKILL_COLORS.length];
  return (
    <div className="group">
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="font-hand text-base text-ink">{skill.name}</span>
        <span className={`font-hand text-sm ${color.label} opacity-60 group-hover:opacity-100 transition-opacity`}>{skill.level}%</span>
      </div>
      <div className="h-3 w-full bg-ink/8 rounded-full overflow-hidden border border-ink/10">
        <motion.div
          className={`h-full rounded-full ${color.bar} ${color.glow}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: idx * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>
    </div>
  );
}

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
      <div className="flex flex-col lg:flex-row gap-16 items-stretch w-full">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
          className="flex-1 relative group w-full"
        >
          <Surface variant="elevated" className="p-10 relative w-full h-full">
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
                add profile.png
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
          className="flex-1 w-full"
        >
          <Surface variant="elevated" className="p-8 relative h-full flex flex-col">
            <h3 className="relative text-3xl font-amatic font-bold mb-8 pb-3 flex items-center gap-3">
              <Star className="w-8 h-8 text-highlighter-yellow" />
              skills
              <Underline className="absolute bottom-0 left-0 w-full h-2 text-pencil/40" />
            </h3>
            <div className="flex flex-col gap-5 flex-1 justify-around">
              {skills.map((skill: AboutSkill, idx: number) => (
                <SkillBar key={skill.name} skill={skill} idx={idx} />
              ))}
            </div>
          </Surface>
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
          <h3 className="relative text-3xl font-amatic font-bold mb-10 pb-5 flex items-center gap-4 text-pencil justify-center">
            <Box className="w-10 h-10 text-highlighter-yellow" />
            toolkit
            <Underline className="absolute bottom-0 left-0 w-full h-2 text-pencil/40" />
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
          {/*
          <p className="font-hand text-sm text-pencil/40 mt-10 italic text-center">
            *tools i regularly utilize
          </p>
          */}
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
