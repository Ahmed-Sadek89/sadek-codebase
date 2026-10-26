"use client";

import {
  About,
  Companies,
  Contact,
  Experience,
  Hero,
  HowItWorks,
  Services,
  Skills,
  Teaching,
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
    courses,
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
      <Teaching courses={courses} />
      <HowItWorks userInfo={userInfo} />
      <Contact userInfo={userInfo} />
    </>
  );
}
