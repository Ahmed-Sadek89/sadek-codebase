import Link from "next/link";
import { navItems } from "../header/utils";

const linkClass =
  "text-muted-foreground no-underline hover:text-primary";

export function Footer() {
  return (
    <footer className="bg-surface pt-14">
      <div className="app-container grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-[2.2fr_1fr_1.5fr_1.2fr]">
        <div className="flex flex-col gap-2">
          <Link
            className="flex items-center gap-2 text-[17px] font-extrabold text-foreground no-underline"
            href="#home"
          >
            <span className="grid size-6 place-items-center rounded-md bg-primary font-black text-primary-foreground">
              W
            </span>
            Workfolio
          </Link>
          <p className="my-2 max-w-[250px] leading-5 text-muted-foreground">
            Product designer and front-end developer crafting meaningful digital
            experiences that people love.
          </p>
          <div className="text-sm text-muted-foreground">◉　in　◎</div>
        </div>
        <div className="flex flex-col gap-2">
          <b className="mb-1 text-xl text-foreground">Navigate</b>
          {navItems.map((item) => (
            <Link className={linkClass} key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <b className="mb-1 text-xl text-foreground">What I Do</b>
          <Link className={linkClass} href="#skills">
            UI / UX Design
          </Link>
          <Link className={linkClass} href="#skills">
            Front-End Development
          </Link>
          <Link className={linkClass} href="#services">
            Design Systems
          </Link>
          <Link className={linkClass} href="#services">
            Brand & Visual Identity
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <b className="mb-1 text-xl text-foreground">Say Hello</b>
          <Link className={linkClass} href="mailto:hello@danielmercer.com">
            hello@danielmercer.com
          </Link>
          <Link className={linkClass} href="tel:+15551234567">
            +1 (555) 123-4567
          </Link>
          <p className="text-xl text-muted-foreground">Austin, TX 78701</p>
        </div>
      </div>
      <div className="mt-11 border-t border-border py-4 text-center text-[10px] text-muted-foreground">
        © Copyright Workfolio. All Rights Reserved.
      </div>
    </footer>
  );
}
