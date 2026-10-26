import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@repo/ui/button";
import { CircleCheck, RotateCcw } from "@repo/ui/icons";

/**
 * Shown in place of the form after a message is sent: a check, the thanks,
 * the address the reply goes to, and "Send another message". Takes focus so
 * screen readers announce it.
 */
export function ContactSuccess({
  email,
  onSendAnother,
}: {
  email: string;
  onSendAnother: () => void;
}) {
  const t = useTranslations();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div
      aria-live="polite"
      className="flex flex-col items-center gap-4 py-8 text-center animate-in fade-in zoom-in-95 motion-reduce:animate-none sm:py-12"
    >
      <span className="relative grid size-16 place-items-center rounded-full bg-success/15 text-success">
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-ping rounded-full bg-success/20 [animation-iteration-count:2] motion-reduce:animate-none"
        />
        <CircleCheck aria-hidden="true" className="relative size-8" />
      </span>
      <div className="space-y-1.5">
        <h3
          className="text-xl font-bold text-foreground outline-none sm:text-2xl"
          ref={headingRef}
          tabIndex={-1}
        >
          {t("contactSent")}
        </h3>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
          {t.rich("contactSentTo", {
            email: () => (
              <span className="font-semibold break-all text-foreground" dir="ltr">
                {email}
              </span>
            ),
          })}
        </p>
      </div>
      <Button
        className="h-11 rounded-full px-6"
        onClick={onSendAnother}
        type="button"
        variant="outline"
      >
        <RotateCcw aria-hidden="true" className="size-4" />
        {t("contactSendAnother")}
      </Button>
    </div>
  );
}
