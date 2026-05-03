import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState, lazy, Suspense } from "react";
import { MotionConfig } from "framer-motion";
import ParallaxHero from "@/components/ParallaxHero";
import Navigation from "@/components/Navigation";
import SectionDivider from "@/components/SectionDivider";
import Footer from "@/components/Footer";
import FreeDrawCanvas from "@/components/FreeDrawCanvas";
import CommandMenu from "@/components/CommandMenu";
import SectionErrorBoundary from "@/components/SectionErrorBoundary";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

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

const Fallback = () => <div className="min-h-screen flex items-center justify-center text-pencil font-amatic text-2xl animate-pulse">loading...</div>;

function Portfolio({ isZenMode, isLoading }: { isZenMode: boolean; isLoading: boolean }) {
  return (
    <div className="min-h-screen relative flex flex-col bg-paper overflow-x-hidden transition-colors duration-500">
      <section id="home" className="relative z-10">
        <ParallaxHero isLoading={isLoading} />
      </section>

      {!isZenMode && <SectionDivider />}

      <section id="projects" className="relative z-20 bg-paper min-h-screen flex flex-col justify-center">
        <SectionErrorBoundary>
          <Suspense fallback={<Fallback />}><Projects /></Suspense>
        </SectionErrorBoundary>
      </section>

      {!isZenMode && <SectionDivider />}

      <section id="github" className="relative z-25 bg-paper min-h-screen flex flex-col justify-center">
        <SectionErrorBoundary>
          <Suspense fallback={<Fallback />}><GithubRepos /></Suspense>
        </SectionErrorBoundary>
      </section>

      {!isZenMode && <SectionDivider />}

      <section id="about" className="relative z-30 bg-paper min-h-screen flex flex-col justify-center">
        <SectionErrorBoundary>
          <Suspense fallback={<Fallback />}><About /></Suspense>
        </SectionErrorBoundary>
      </section>

      {!isZenMode && <SectionDivider />}

      <section id="achievements" className="relative z-35 bg-paper min-h-screen flex flex-col justify-center">
        <SectionErrorBoundary>
          <Suspense fallback={<Fallback />}><Achievements /></Suspense>
        </SectionErrorBoundary>
      </section>

      {!isZenMode && <SectionDivider />}

      <section id="outside" className="relative z-37 bg-paper min-h-screen flex flex-col justify-center">
        <SectionErrorBoundary>
          <Suspense fallback={<Fallback />}><OutsideWork /></Suspense>
        </SectionErrorBoundary>
      </section>

      {!isZenMode && <SectionDivider />}

      <section id="contact" className="relative z-40 bg-paper min-h-[80vh] flex flex-col justify-center">
        <SectionErrorBoundary>
          <Suspense fallback={<Fallback />}><Contact /></Suspense>
        </SectionErrorBoundary>
      </section>

      <Footer />

      {!isZenMode && (
        <Button
          variant="fab"
          size="icon"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 h-12 w-12 transition-transform group"
          title="back up"
        >
          <i className="fas fa-arrow-up text-ink text-xl group-hover:animate-bounce"></i>
        </Button>
      )}
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { isZenMode } = useTheme();

  useEffect(() => {
    let cancelled = false;

    const finishBoot = async () => {
      const fontReady = typeof document !== "undefined" && "fonts" in document
        ? Promise.race([
            document.fonts.ready,
            new Promise<void>((r) => setTimeout(r, 2500)),
          ])
        : Promise.resolve();

      await Promise.all([
        fontReady,
        new Promise<void>((resolve) => setTimeout(resolve, 1000)),
      ]);

      if (!cancelled) setIsLoading(false);
    };

    void finishBoot();

    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      {!isZenMode && <div className="grain-overlay" />}
      {!isZenMode && <FreeDrawCanvas />}
      {!isZenMode && <ScrollProgress />}
      <Navigation />
      {!isZenMode && <CommandMenu />}

      <Switch>
        <Route path="/">{() => isZenMode
          ? <MotionConfig reducedMotion="always"><Portfolio isZenMode={isZenMode} isLoading={isLoading} /></MotionConfig>
          : <Portfolio isZenMode={isZenMode} isLoading={isLoading} />
        }</Route>
        {/*404*/}
        <Route component={NotFound} />
      </Switch>

      <Toaster />
    </>
  );
}

export default App;
