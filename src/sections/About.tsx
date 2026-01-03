import { motion } from 'framer-motion';
import { portfolioConfig } from '@/portfolio.config';
import { Star, Underline, Arrow } from '@/components/Doodles';

export default function About() {
  const { personal, about } = portfolioConfig;
  const { skills } = about;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-5xl mx-auto flex flex-col md:flex-row gap-12">

      {/* left: photo/bio */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex-1 paper-card p-8 rotate-1 bg-[#fffbf0]"
      >
        <div className="w-48 h-48 mx-auto mb-6 border-4 border-dashed border-ink rounded-full overflow-hidden relative bg-paper shadow-sm">
          <img
            src="/images/profile.png"
            alt="Profile"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="absolute inset-0 hidden flex items-center justify-center font-marker text-xl text-ink/40 text-center p-2 leading-tight">
            Add profile.png
          </div>
        </div>

        <h2 className="text-5xl font-marker text-center mb-6">Who am I?</h2>
        <div className="font-hand text-xl text-ink leading-loose space-y-4">
          <p>
            Hi! I'm <span className="bg-highlighter-pink/40 px-1">{personal.name}</span>.
          </p>
          <p>
            I’m a passionate solo dev who loves making creative and interactive web experiences.
          </p>
          <p>
            To me, code isn’t just logic, it’s a form of expression, a way to bring ideas to life.
          </p>
          <p>
            Currently based in {personal.location}, I’m always excited to collaborate, learn, and push the boundaries of what the web can do.
          </p>
        </div>
      </motion.div>

      {/* right: skills */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 space-y-8"
      >
        <div className="paper-card p-6 -rotate-1 bg-white">
          <h3 className="text-4xl font-amatic font-bold mb-4 border-b-2 border-pencil pb-2">Skill Set</h3>
          <div className="space-y-4">
            {skills.map((skill) => (
              <div key={skill.name} className="relative">
                <div className="flex justify-between font-hand text-lg mb-1">
                  <span>{skill.name}</span>
                  <span>{skill.level}%</span>
                </div>
                {/*progress bar */}
                <div className="h-3 w-full border-2 border-ink rounded-full p-0.5">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-ink rounded-full"
                    style={{
                      background: `repeating-linear-gradient(45deg, #2a2a2a, #2a2a2a 2px, transparent 2px, transparent 6px)`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/*funfact */}
        <div className="p-6 border-4 border-dotted border-highlighter-blue/50 rotate-2">
          <h4 className="text-2xl font-marker text-pencil mb-2">Fun Fact:</h4>
          <p className="font-hand text-lg">
            I started learning to code during the COVID-19 pandemic.
          </p>
        </div>
      </motion.div>

    </div>
  );
}
