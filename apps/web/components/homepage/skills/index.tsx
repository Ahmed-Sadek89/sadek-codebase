import { skills } from "../utils";
import { SectionTitle } from "../components/section-title";

export function Skills() {
  const levels = [
    ["Interface Design", "95%"],
    ["Front-End Development", "90%"],
    ["Design Systems", "88%"],
    ["Prototyping & Motion", "82%"],
    ["Brand & Visual Identity", "75%"],
  ];
  return (
    <section
      id="skills"
      className="mx-auto w-full max-w-[1440px] px-4 py-[76px] max-[700px]:py-[54px] bg-muted"
    >
      <SectionTitle
        title="Skills & Tools"
        copy="The craft and software I reach for every day"
      />
      <div className="grid grid-cols-2 items-center gap-[65px] max-[700px]:grid-cols-1 max-[700px]:gap-5">
        <div>
          <h3 className="mb-2 text-[17px]">
            A blend of design taste and
            <br /> engineering rigor.
          </h3>
          <p className="text-[11px] leading-[1.7] text-muted-foreground">
            I move comfortably between the canvas and the codebase, which means
            I can speak to product, design and engineering teams fluently.
          </p>
          <div className="flex flex-wrap gap-[7px]">
            {skills.map((skill) => (
              <span
                className="rounded-[20px] bg-secondary px-[9px] py-[5px] text-[9px] text-secondary-foreground"
                key={skill}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div>
          {levels.map(([name, level], index) => (
            <div className="mb-[15px]" key={name}>
              <div className="flex justify-between text-[10px]">
                <span>{name}</span>
                <b className="text-primary">{level}</b>
              </div>
              <i className="mt-[5px] block h-[3px] bg-border">
                <i
                  className="block h-full bg-primary"
                  style={{ width: `${95 - index * 5}%` }}
                />
              </i>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
