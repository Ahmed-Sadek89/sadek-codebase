"use client";

import { useEffect, useMemo } from "react";

/** A blob URL previewing an image File, revoked when the file changes or on unmount. */
export function useObjectUrl(file: File | null) {
  const objectUrl = useMemo(
    () =>
      file && file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
    [file],
  );
  useEffect(
    () => () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    },
    [objectUrl],
  );
  return objectUrl;
}
