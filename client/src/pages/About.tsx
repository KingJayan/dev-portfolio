import { motion } from "framer-motion";
import { skills } from "@/lib/constants";

export default function About() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gradient bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            About Me
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-600 mx-auto"></div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-lg text-slate-300 dark:text-slate-300 leading-relaxed">
              I'm a passionate Full Stack Developer with over 5 years of
              experience creating digital experiences that combine beautiful
              design with robust functionality. I specialize in modern web
              technologies and love turning complex problems into simple,
              elegant solutions.
            </p>

            <p className="text-lg text-slate-300 dark:text-slate-300 leading-relaxed">
              When I'm not coding, you'll find me building robots, writing
              debate contentions, or playing soccer! I believe in writing clean,
              maintainable code and creating applications that users love to
              interact with.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              {[
                "Problem Solving",
                "Team Leadership",
                "UI/UX Design",
                "Agile Development",
              ].map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 bg-slate-800 dark:bg-slate-800 text-blue-400 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-slate-800/50 dark:bg-slate-800/50 p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">50+</div>
                <div className="text-slate-300 dark:text-slate-300">
                  Projects
                </div>
              </div>
              <div className="bg-slate-800/50 dark:bg-slate-800/50 p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  5+
                </div>
                <div className="text-slate-300 dark:text-slate-300">
                  Years Experience
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-display font-semibold mb-4 text-white dark:text-white">
                Technical Skills
              </h3>

              <div className="space-y-3">
                {skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-300 dark:text-slate-300">
                        {skill.name}
                      </span>
                      <span className="text-sm text-slate-400 dark:text-slate-400">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 dark:bg-slate-800 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`bg-gradient-to-r ${skill.color} h-2 rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
