import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState, lazy, Suspense } from "react";
import ParallaxHero from "@/components/ParallaxHero";
import Navigation from "@/components/Navigation";
import SectionDivider from "@/components/SectionDivider";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import FreeDrawCanvas from "@/components/FreeDrawCanvas";
import CommandMenu from "@/components/CommandMenu";

const Projects = lazy(() => import("@/sections/Projects"));
const GithubRepos = lazy(() => import("@/sections/GithubRepos"));
const About = lazy(() => import("@/sections/About"));
const Achievements = lazy(() => import("@/sections/Achievements"));
const OutsideWork = lazy(() => import("@/sections/OutsideWork"));
const Contact = lazy(() => import("@/sections/Contact"));
import ScrollProgress from "@/components/ui/ScrollProgress";
import LoadingScreen from "@/components/LoadingScreen";

import { Route, Switch } from "wouter";
import NotFound from "@/pages/NotFound";

const Fallback = () => <div className="min-h-screen flex items-center justify-center text-pencil font-amatic text-2xl animate-pulse">Loading amazing things...</div>;

function Portfolio() {
  return (
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
        <Suspense fallback={<Fallback />}><Projects /></Suspense>
      </section>

      <SectionDivider />

      <section id="github" className="relative z-25 bg-paper min-h-screen flex flex-col justify-center">
        <Suspense fallback={<Fallback />}><GithubRepos /></Suspense>
      </section>

      <SectionDivider />

      <section id="about" className="relative z-30 bg-paper min-h-screen flex flex-col justify-center">
        <Suspense fallback={<Fallback />}><About /></Suspense>
      </section>

      <SectionDivider />

      <section id="achievements" className="relative z-35 bg-secondary/20 min-h-screen flex flex-col justify-center">
        <Suspense fallback={<Fallback />}><Achievements /></Suspense>
      </section>

      <SectionDivider />

      <section id="outside" className="relative z-37 bg-paper min-h-screen flex flex-col justify-center">
        <Suspense fallback={<Fallback />}><OutsideWork /></Suspense>
      </section>

      <SectionDivider />

      <section id="contact" className="relative z-40 bg-secondary/30 min-h-[80vh] flex flex-col justify-center">
        <Suspense fallback={<Fallback />}><Contact /></Suspense>
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
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <div className="grain-overlay" />
      <FreeDrawCanvas />
      <Cursor />
      <ScrollProgress />
      <Navigation />
      <CommandMenu />

      <Switch>
        <Route path="/" component={Portfolio} />
        {/*404*/}
        <Route component={NotFound} />
      </Switch>

      <Toaster />
    </>
  );
}

export default App;
