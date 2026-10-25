"use client";

import {
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  type ReactNode,
  type Ref,
} from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { plainTextToHtml } from "@repo/rich-text";
import { Label } from "@repo/ui/label";
import { richTextClassName } from "@repo/ui/rich-text";
import { cn } from "@repo/ui/utils";
import { RichTextToolbar } from "./components/toolbar";
import { createRichTextExtensions } from "./utils/extensions";

const EDITABLE_CLASS_NAME = cn(
  richTextClassName,
  "min-h-32 px-3 py-2 outline-none",
  // Placeholder on the empty first paragraph (Tiptap sets data-placeholder).
  "[&_p.is-editor-empty:first-child]:before:pointer-events-none [&_p.is-editor-empty:first-child]:before:float-start [&_p.is-editor-empty:first-child]:before:h-0 [&_p.is-editor-empty:first-child]:before:text-muted-foreground [&_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)]",
);

export type BaseRichTextEditorProps = {
  id?: string;
  label: string;
  /** HTML; legacy plain text is shown as paragraphs. */
  value: string;
  /** The editor's HTML, or `""` when it has no text. */
  onChange: (html: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  /** Short help shown under the field and linked with aria-describedby. */
  description?: ReactNode;
  error?: string;
  dir?: "ltr" | "rtl";
  required?: boolean;
  disabled?: boolean;
  containerClassName?: string;
  /** Focuses the editor, so React Hook Form can focus the first invalid field. */
  ref?: Ref<{ focus: () => void }>;
};

/**
 * A Tiptap rich-text field with the same label / hint / error layout as
 * BaseTextarea. It produces only the HTML the shared sanitizer allows
 * (`@repo/rich-text`); the backend sanitizes again on save and the website
 * before rendering, so this is a convenience, not the security boundary.
 * Use it with a React Hook Form `Controller`.
 */
export function BaseRichTextEditor({
  id,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  description,
  error,
  dir,
  required,
  disabled = false,
  containerClassName,
  ref,
}: BaseRichTextEditorProps) {
  const generatedId = useId();
  const editorId = id ?? generatedId;
  const labelId = `${editorId}-label`;
  const errorId = `${editorId}-error`;
  const hintId = `${editorId}-hint`;
  const describedBy = [description ? hintId : undefined, error ? errorId : undefined]
    .filter(Boolean)
    .join(" ");

  const extensions = useMemo(() => createRichTextExtensions(placeholder), [placeholder]);
  // Latest callbacks, so the editor isn't rebuilt when they change.
  const callbacks = useRef({ onChange, onBlur });
  useEffect(() => {
    callbacks.current = { onChange, onBlur };
  });

  const attributes = useMemo(
    () => ({
      id: editorId,
      role: "textbox",
      "aria-multiline": "true",
      "aria-labelledby": labelId,
      ...(describedBy && { "aria-describedby": describedBy }),
      ...(error && { "aria-invalid": "true" }),
      ...(required && { "aria-required": "true" }),
      ...(dir && { dir }),
      class: EDITABLE_CLASS_NAME,
    }),
    [editorId, labelId, describedBy, error, required, dir],
  );

  const editor = useEditor(
    {
      extensions,
      content: plainTextToHtml(value),
      editable: !disabled,
      // Rendered on the client only, so the server HTML can't mismatch.
      immediatelyRender: false,
      editorProps: { attributes },
      onUpdate: ({ editor: e }) => callbacks.current.onChange(e.isEmpty ? "" : e.getHTML()),
      onBlur: () => callbacks.current.onBlur?.(),
    },
    [extensions],
  );

  // Error / hint changes update the attributes in place, keeping the cursor and undo history.
  useEffect(() => {
    if (editor && !editor.isDestroyed) editor.setOptions({ editorProps: { attributes } });
  }, [editor, attributes]);

  // Follow outside changes (form.reset when the dialog opens for another row).
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    const current = editor.isEmpty ? "" : editor.getHTML();
    const next = plainTextToHtml(value);
    if (next !== current) editor.commands.setContent(next, { emitUpdate: false });
  }, [editor, value]);

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [editor, disabled]);

  useImperativeHandle(ref, () => ({ focus: () => editor?.commands.focus() }), [editor]);

  return (
    <div className={cn("flex flex-col gap-y-2", containerClassName)}>
      <Label id={labelId} onClick={() => editor?.commands.focus()}>
        {label}
      </Label>
      <div
        className={cn(
          "w-full overflow-hidden rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 dark:bg-input/30",
          error && "border-danger ring-danger/20 dark:ring-danger/40",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        {editor ? (
          <>
            <RichTextToolbar editor={editor} disabled={disabled} labelledBy={labelId} />
            <EditorContent editor={editor} />
          </>
        ) : (
          // Same height while Tiptap mounts on the client.
          <div aria-hidden className="h-[10.5rem]" />
        )}
      </div>
      {description && (
        <div id={hintId} className="text-xs text-muted-foreground">
          {description}
        </div>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
