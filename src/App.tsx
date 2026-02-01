import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import ParallaxHero from "@/components/ParallaxHero";
import Navigation from "@/components/Navigation";
import SectionDivider from "@/components/SectionDivider";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import FreeDrawCanvas from "@/components/FreeDrawCanvas";
import CommandMenu from "@/components/CommandMenu";

import Projects from "@/sections/Projects";
import About from "@/sections/About";
import Achievements from "@/sections/Achievements";
import OutsideWork from "@/sections/OutsideWork";
import Contact from "@/sections/Contact";
import ScrollProgress from "@/components/ui/ScrollProgress";

function App() {
  return (
    <>
      <div className="grain-overlay" />
      <FreeDrawCanvas />
      <Cursor />
      <ScrollProgress />
      <Navigation />
      <CommandMenu />

      <div className="min-h-screen relative flex flex-col bg-paper overflow-x-hidden transition-colors duration-500">

        <section id="home" className="relative z-10">
          <ParallaxHero />
          <div className="max-w-4xl mx-auto p-8 prose font-hand text-xl text-center pb-24">
            <p className="rotate-1">
              <span className="bg-highlighter-yellow/50 px-2">Scroll to explore</span>
            </p>
          </div>
        </section>

        <SectionDivider />

        <section id="projects" className="relative z-20 bg-secondary/30 min-h-screen flex flex-col justify-center">
          <Projects />
        </section>

        <SectionDivider />

        <section id="about" className="relative z-30 bg-paper min-h-screen flex flex-col justify-center">
          <About />
        </section>

        <SectionDivider />

        <section id="achievements" className="relative z-35 bg-secondary/20 min-h-screen flex flex-col justify-center">
          <Achievements />
        </section>

        <SectionDivider />

        <section id="outside" className="relative z-37 bg-paper min-h-screen flex flex-col justify-center">
          <OutsideWork />
        </section>

        <SectionDivider />

        <section id="contact" className="relative z-40 bg-secondary/30 min-h-[80vh] flex flex-col justify-center">
          <Contact />
        </section>

        <Footer />

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 p-3 bg-highlighter-yellow rounded-full shadow-paper border-2 border-ink hover:-translate-y-1 transition-transform group"
          title="Back to Top"
        >
          <i className="fas fa-arrow-up text-ink text-xl group-hover:animate-bounce"></i>
        </button>
      </div>

      <Toaster />
    </>
  );
}

export default App;
