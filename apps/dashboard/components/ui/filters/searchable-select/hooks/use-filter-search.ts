"use client";

import { useEffect, useState } from "react";
import { SEARCH_DEBOUNCE_MS } from "../../../../../utils/constants";

export function useFilterSearch() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(
      () => setDebouncedSearch(search.trim()),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(timeout);
  }, [search]);

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setSearch("");
  };

  return { open, setOpen, onOpenChange, search, setSearch, debouncedSearch };
}
