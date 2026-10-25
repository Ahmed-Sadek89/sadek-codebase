"use client";

import { useTranslations } from "next-intl";
import { useEditorState, type Editor } from "@tiptap/react";
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  SquareCode,
  Strikethrough,
  Underline,
  Undo2,
} from "@repo/ui/icons";
import { LinkPopover } from "./link-popover";
import { ToolbarButton } from "./toolbar-button";

function Divider() {
  return <span aria-hidden className="mx-0.5 h-5 w-px shrink-0 bg-border" />;
}

/** Formatting controls; each button reflects whether its format is active at the cursor. */
export function RichTextToolbar({
  editor,
  disabled,
  labelledBy,
}: {
  editor: Editor;
  disabled?: boolean;
  labelledBy: string;
}) {
  const t = useTranslations();
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      strike: e.isActive("strike"),
      code: e.isActive("code"),
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      bulletList: e.isActive("bulletList"),
      orderedList: e.isActive("orderedList"),
      blockquote: e.isActive("blockquote"),
      codeBlock: e.isActive("codeBlock"),
      link: e.isActive("link"),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });

  const chain = () => editor.chain().focus();

  return (
    <div
      role="toolbar"
      aria-labelledby={labelledBy}
      className="flex flex-wrap items-center gap-0.5 border-b border-input p-1"
    >
      <ToolbarButton label={t("richTextBold")} active={state.bold} disabled={disabled} onClick={() => chain().toggleBold().run()}>
        <Bold />
      </ToolbarButton>
      <ToolbarButton label={t("richTextItalic")} active={state.italic} disabled={disabled} onClick={() => chain().toggleItalic().run()}>
        <Italic />
      </ToolbarButton>
      <ToolbarButton label={t("richTextUnderline")} active={state.underline} disabled={disabled} onClick={() => chain().toggleUnderline().run()}>
        <Underline />
      </ToolbarButton>
      <ToolbarButton label={t("richTextStrike")} active={state.strike} disabled={disabled} onClick={() => chain().toggleStrike().run()}>
        <Strikethrough />
      </ToolbarButton>
      <ToolbarButton label={t("richTextCode")} active={state.code} disabled={disabled} onClick={() => chain().toggleCode().run()}>
        <Code />
      </ToolbarButton>
      <Divider />
      <ToolbarButton label={t("richTextHeading2")} active={state.h2} disabled={disabled} onClick={() => chain().toggleHeading({ level: 2 }).run()}>
        <Heading2 />
      </ToolbarButton>
      <ToolbarButton label={t("richTextHeading3")} active={state.h3} disabled={disabled} onClick={() => chain().toggleHeading({ level: 3 }).run()}>
        <Heading3 />
      </ToolbarButton>
      <Divider />
      <ToolbarButton label={t("richTextBulletList")} active={state.bulletList} disabled={disabled} onClick={() => chain().toggleBulletList().run()}>
        <List />
      </ToolbarButton>
      <ToolbarButton label={t("richTextOrderedList")} active={state.orderedList} disabled={disabled} onClick={() => chain().toggleOrderedList().run()}>
        <ListOrdered />
      </ToolbarButton>
      <ToolbarButton label={t("richTextBlockquote")} active={state.blockquote} disabled={disabled} onClick={() => chain().toggleBlockquote().run()}>
        <Quote />
      </ToolbarButton>
      <ToolbarButton label={t("richTextCodeBlock")} active={state.codeBlock} disabled={disabled} onClick={() => chain().toggleCodeBlock().run()}>
        <SquareCode />
      </ToolbarButton>
      <ToolbarButton label={t("richTextHorizontalRule")} disabled={disabled} onClick={() => chain().setHorizontalRule().run()}>
        <Minus />
      </ToolbarButton>
      <LinkPopover editor={editor} active={state.link} disabled={disabled} />
      <Divider />
      <ToolbarButton label={t("richTextUndo")} disabled={disabled || !state.canUndo} onClick={() => chain().undo().run()}>
        <Undo2 className="rtl:-scale-x-100" />
      </ToolbarButton>
      <ToolbarButton label={t("richTextRedo")} disabled={disabled || !state.canRedo} onClick={() => chain().redo().run()}>
        <Redo2 className="rtl:-scale-x-100" />
      </ToolbarButton>
    </div>
  );
}
