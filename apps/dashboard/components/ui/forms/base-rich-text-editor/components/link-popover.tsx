"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import type { Editor } from "@tiptap/react";
import { isSafeRichTextHref } from "@repo/rich-text";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Link2 } from "@repo/ui/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";
import { ToolbarButton } from "./toolbar-button";

/** Adds, edits or removes the link on the selection; only http(s) and mailto URLs are accepted. */
export function LinkPopover({
  editor,
  active,
  disabled,
}: {
  editor: Editor;
  active: boolean;
  disabled?: boolean;
}) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onOpenChange = (next: boolean) => {
    if (next) {
      setUrl((editor.getAttributes("link").href as string | undefined) ?? "");
      setError(null);
    }
    setOpen(next);
  };

  const apply = (event: FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const value = url.trim();
    const href = /^[a-z][a-z\d+.-]*:/i.test(value) ? value : `https://${value}`;
    if (!value || !isSafeRichTextHref(href)) {
      setError(t("richTextLinkInvalid"));
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    setOpen(false);
  };

  const remove = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <ToolbarButton label={t("richTextLink")} active={active} disabled={disabled}>
          <Link2 />
        </ToolbarButton>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80">
        {/* A div, not a form: this sits inside the page's form. */}
        <div
          className="space-y-3"
          onKeyDown={(event) => {
            if (event.key === "Enter") apply(event);
          }}
        >
          <Input
            type="url"
            dir="ltr"
            inputMode="url"
            autoFocus
            placeholder="https://example.com"
            aria-label={t("richTextLinkUrl")}
            aria-invalid={error ? true : undefined}
            value={url}
            onChange={(event) => {
              setUrl(event.target.value);
              setError(null);
            }}
          />
          {error && (
            <p role="alert" className="text-xs text-danger">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2">
            {active && (
              <Button type="button" size="sm" variant="outline-danger" onClick={remove}>
                {t("richTextLinkRemove")}
              </Button>
            )}
            <Button type="button" size="sm" onClick={apply}>
              {t("richTextLinkApply")}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
