import Preloader from "@/components/ui/Preloader";
import ScrollProgress from "@/components/ui/ScrollProgress";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Certificates from "@/components/sections/Certificates";
import Timeline from "@/components/sections/Timeline";
import Footer from "@/components/sections/Footer";
import RobotCompanion from "@/components/three/RobotCompanion";
import RobotFooterMobile from "@/components/three/RobotFooterMobile";

export default function Home() {
  return (
    <main className="relative">
      <Preloader />
      <ScrollProgress />
      <Navbar />
      <RobotCompanion />
      <Hero />
      {/* content scrolls over the fixed 3D scene */}
      <div className="relative z-10 bg-linear-to-b from-transparent via-[#050810] via-[45vh] to-[#050810]">
        <About />
        <Projects />
        <Certificates />
        <Timeline />
        {/* phone-only robot, planted between the timeline and footer so it
            scrolls with the page instead of hovering over the viewport */}
        <RobotFooterMobile />
        <Footer />
      </div>
    </main>
  );
}
