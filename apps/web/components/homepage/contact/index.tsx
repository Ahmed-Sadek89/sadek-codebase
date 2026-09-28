import Link from "next/link";
import { ArrowRight, Mail, MapPin, Send, Smartphone } from "@repo/ui/icons";
import { Button } from "@repo/ui/button";
import { SectionTitle } from "../components/section-title";

export function Contact() {
  return (
    <>
      <section className="mx-auto w-full max-w-[1440px] px-4 py-[76px] max-[700px]:py-[54px] text-center bg-background bg-radial-[circle_at_center] from-primary-muted from-0% to-transparent to-35%">
        <span className="text-[10px] tracking-[0.12em] text-primary font-extrabold">
          LET&apos;S WORK TOGETHER
        </span>
        <h2 className="m-[7px] text-[26px]">
          Ready to bring your next idea to life?
        </h2>
        <p className="mx-auto mb-[18px] max-w-[480px] text-[11px] leading-[1.6] text-muted-foreground">
          There&apos;s room for one or two new projects this quarter. If
          you&apos;re building something you care about, I&apos;d love to hear
          about it.
        </p>
        <Button asChild>
          <Link className="text-[11px]" href="#form">
            Start a Project <ArrowRight className="w-[13px]" />
          </Link>
        </Button>
        <small className="m-2.5 block text-[9px] text-muted-foreground">
          ✦ Typical reply within 24 hours
        </small>
      </section>
      <section
        id="contact"
        className="mx-auto w-full max-w-[1440px] px-4 py-[76px] max-[700px]:py-[54px] bg-muted"
      >
        <SectionTitle
          title="Get In Touch"
          copy="Tell me about your project and let's make it a reality"
        />
        <div className="mb-5 flex justify-center gap-5 text-[10px] text-muted-foreground max-[700px]:flex-col max-[700px]:items-center max-[700px]:gap-2">
          <span className="flex items-center gap-[5px]">
            <Mail className="w-3 text-primary" /> hello@danielmercer.com
          </span>
          <span className="flex items-center gap-[5px]">
            <Smartphone className="w-3 text-primary" /> +1 (555) 123-4567
          </span>
          <span className="flex items-center gap-[5px]">
            <MapPin className="w-3 text-primary" /> Austin, TX
          </span>
        </div>
        <form
          className="mx-auto grid max-w-[560px] grid-cols-2 gap-2 rounded-[7px] bg-card p-4"
          id="form"
        >
          <input
            className="rounded-[3px] border border-input bg-background p-2.5 font-[inherit] text-[10px] text-foreground"
            placeholder="Your Name"
          />
          <input
            className="rounded-[3px] border border-input bg-background p-2.5 font-[inherit] text-[10px] text-foreground"
            placeholder="Your Email"
          />
          <input
            className="col-span-2 rounded-[3px] border border-input bg-background p-2.5 font-[inherit] text-[10px] text-foreground"
            placeholder="Subject"
          />
          <textarea
            className="col-span-2 resize-y rounded-[3px] border border-input bg-background p-2.5 font-[inherit] text-[10px] text-foreground"
            placeholder="Your Message"
            rows={5}
          />
          <Button
            className="col-span-2 justify-self-center text-[10px]"
            type="submit"
          >
            Send Message <Send />
          </Button>
        </form>
      </section>
    </>
  );
}
