import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import FleetSection from "@/components/FleetSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import DealsSection from "@/components/DealsSection";
import WhyZeusSection from "@/components/WhyZeusSection";
import RequirementsSection from "@/components/RequirementsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
    <Navbar />
    <HeroSection />
    <AboutSection />
    <FleetSection />
    <HowItWorksSection />
    <DealsSection />
    <WhyZeusSection />
    <RequirementsSection />
    <TestimonialsSection />
    <Footer />
  </div>
);

export default Index;
