"use client";

import {
  About,
  Companies,
  Contact,
  Experience,
  Hero,
  HowItWorks,
  Reviews,
  Services,
  Skills,
  Work,
} from "./components";
import { useHomePageData } from "./hooks";

/** The homepage queries live in useHomePageData; sections get them as props. */
export function HomePage() {
  const {
    userInfo,
    companies,
    experience,
    services,
    skillCategories,
    projects,
    projectCategories,
    projectsFilter,
  } = useHomePageData();

  return (
    <>
      <Hero userInfo={userInfo} />
      <Companies companies={companies} />
      <About userInfo={userInfo} />
      <Services services={services} />
      <Skills categories={skillCategories} />
      <Experience companies={experience} userInfo={userInfo} />
      <Work
        projects={projects}
        categories={projectCategories}
        categoryId={projectsFilter.categoryId}
        onCategoryChange={projectsFilter.setCategoryId}
      />
      <Reviews />
      <HowItWorks />
      <Contact userInfo={userInfo} />
    </>
  );
}
