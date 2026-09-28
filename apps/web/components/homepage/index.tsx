import { About } from "./about";
import { Contact } from "./contact";
import { Experience } from "./experience";
import { Hero } from "./hero";
import { HowItWorks } from "./how-it-works";
import { Reviews } from "./reviews";
import { Services } from "./services";
import { Skills } from "./skills";
import { Work } from "./work";

export function HomePage() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <About />
      <Services />
      <Skills />
      <Experience />
      <Work />
      <Reviews />
      <HowItWorks />
      <Contact />
    </div>
  );
}
