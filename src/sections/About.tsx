import { motion } from 'framer-motion';
import { portfolioConfig } from '@/portfolio.config';
import { Star, Underline, Arrow, Spiral } from '@/components/Doodles';
import TechIcon from '@/components/TechIcon';

export default function About() {
  const { personal, about } = portfolioConfig;
  const { skills, tools } = about as any;

  return (
    <section id="about" className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-6xl mx-auto flex flex-col gap-16 items-start">

      {/*toprow: Bio and skills */}
      <div className="flex flex-col lg:flex-row gap-16 items-start w-full">
        {/* left: photo/bio */}
        <motion.div
          initial={{ x: -100, opacity: 0, rotate: -2 }}
          whileInView={{ x: 0, opacity: 1, rotate: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
          className="flex-1 paper-card p-10 bg-[#fffbf0] relative group w-full"
        >
          <Spiral className="absolute -top-6 -left-6 w-16 h-16 text-pencil/20 rotate-12 opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="w-56 h-56 mx-auto mb-8 border-4 border-dashed border-ink rounded-full overflow-hidden relative bg-paper shadow-paper group-hover:shadow-paper-hover transition-all duration-500">
            <img
              src="/images/profile.png"
              alt="Profile"
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="absolute inset-0 hidden flex items-center justify-center font-marker text-2xl text-ink/40 text-center p-4">
              Add profile.png
            </div>
          </div>

          <h2 className="text-6xl font-marker text-center mb-8 relative">
            Who am I?
            <Underline className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-4 text-highlighter-pink" />
          </h2>

          <div className="font-hand text-2xl text-ink leading-relaxed space-y-6">
            <p className="relative">
              Hi! I'm <span className="bg-highlighter-pink/40 px-2 font-bold rotate-1 inline-block">{personal.name}</span>.
              <Star className="absolute -top-4 -right-6 w-8 h-8 text-highlighter-yellow animate-pulse" />
            </p>

            {about.bio && about.bio.map((paragraph: string, idx: number) => (
              <p key={idx} className="hover:translate-x-2 transition-transform">
                {paragraph}
              </p>
            ))}
          </div>
        </motion.div>

        {/* right: skills */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, type: "spring", stiffness: 50 }}
          className="flex-1 space-y-12 w-full"
        >
          <div className="paper-card p-8 -rotate-1 bg-white relative h-full">
            <Arrow className="absolute -top-10 -right-4 w-20 h-20 text-ink/10 rotate-[140deg]" />

            <h3 className="text-4xl font-amatic font-bold mb-8 border-b-2 border-pencil pb-2 flex items-center gap-3">
              <Star className="w-8 h-8 text-highlighter-yellow" />
              Skill Set
            </h3>

            <div className="space-y-6">
              {skills.map((skill: any, idx: number) => (
                <div key={skill.name} className="relative group">
                  <div className="flex justify-between font-hand text-xl mb-2 items-center">
                    <span className="group-hover:text-highlighter-pink transition-colors">{skill.name}</span>
                    <span className="text-pencil/50 text-sm font-marker">{skill.level}%</span>
                  </div>
                  <div className="h-4 w-full border-2 border-pencil rounded-full p-0.5 overflow-hidden bg-paper/50">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
                      className="h-full bg-ink rounded-full relative"
                      style={{
                        background: `repeating-linear-gradient(45deg, #2a2a2a, #2a2a2a 2px, transparent 2px, transparent 6px)`
                      }}
                    >
                      <motion.div
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 bg-white/10"
                      />
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* funfact */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 border-4 border-dotted border-highlighter-blue/50 rotate-2 bg-paper/20 backdrop-blur-sm relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-highlighter-blue/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
            <h4 className="text-3xl font-marker text-ink/70 mb-3 flex items-center gap-2">
              <span className="text-orange-400">💡</span>
              Fun Fact
            </h4>
            <p className="font-hand text-2xl text-ink/80 leading-snug">
              I started learning to code during the COVID-19 pandemic.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/*vottom row: full-wdith toolkit*/}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="w-full"
      >
        <div className="paper-card p-10 bg-white relative">
          <h3 className="text-5xl font-amatic font-bold mb-10 border-b-2 border-pencil pb-4 flex items-center gap-4 text-pencil justify-center">
            <Box className="w-10 h-10 text-highlighter-blue" />
            Toolkit & Ecosystem
          </h3>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-6 px-4 justify-items-center">
            {tools && tools.map((tool: any, idx: number) => (
              <motion.div
                key={tool.name}
                whileHover={{ scale: 1.15, rotate: (idx % 2 === 0 ? 5 : -5) }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-2 group cursor-default"
              >
                <div className="w-12 h-12 bg-paper border-2 border-pencil rounded-xl flex items-center justify-center shadow-paper group-hover:shadow-paper-hover group-hover:bg-highlighter-yellow/30 transition-all duration-300">
                  <TechIcon name={tool.icon} className="w-6 h-6 text-ink group-hover:scale-110 transition-transform" />
                </div>
                <span className="font-hand text-sm text-pencil/70 font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {tool.name}
                </span>
              </motion.div>
            ))}
          </div>

          <p className="font-hand text-sm text-pencil/40 mt-10 italic text-center">
            * Tools I use to bring ideas to life.
          </p>
        </div>
      </motion.div>

    </section>
  );
}

// Simple Box icon helper
function Box({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}
