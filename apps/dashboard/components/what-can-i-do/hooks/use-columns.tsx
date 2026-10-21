"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import type { WhatCanDoDetails } from "@repo/types/what-can-do";
import { Eye, Pencil, Trash2 } from "@repo/ui/icons";
import { DateCell, TableActionsGroup, TextCell } from "../../ui/cells";
import type { DynamicColumnDef } from "../../ui/dynamic-table/types/types";

type UseColumnsOptions = {
  busy?: boolean;
  onView?: (item: WhatCanDoDetails) => void;
  onEdit?: (item: WhatCanDoDetails) => void;
  onDelete?: (item: WhatCanDoDetails) => void;
  /** Each flag shows its action; the Action column shows if any is set. */
  canView?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
};

const useColumns = ({
  busy = false,
  onView,
  onEdit,
  onDelete,
  canView = false,
  canUpdate = false,
  canDelete = false,
}: UseColumnsOptions = {}) => {
  const t = useTranslations();

  return useMemo<DynamicColumnDef<WhatCanDoDetails>[]>(() => {
    const columns: DynamicColumnDef<WhatCanDoDetails>[] = [
      {
        accessorKey: "id",
        sortable: true,
        header: t("tableColId"),
        cell: ({ row }) => <TextCell value={row.original.id} tone="muted" />,
      },
      {
        accessorKey: "rank",
        sortable: true,
        header: t("tableColRank"),
        cell: ({ row }) => (
          <TextCell value={row.original.rank} weight="medium" />
        ),
      },
      {
        accessorKey: "title_ar",
        sortable: true,
        header: t("tableColTitleAr"),
        meta: { cellProps: { lang: "ar", dir: "rtl" } },
        cell: ({ row }) => (
          <div className="max-w-sm min-w-55 flex items-start flex-col gap-y-1.5">
            <TextCell value={row.original.title_ar} weight="semibold" />
            <TextCell
              value={row.original.shortDescription_ar}
              tone="muted"
              size="sm"
            />
          </div>
        ),
      },
      {
        accessorKey: "title_en",
        sortable: true,
        header: t("tableColTitleEn"),
        meta: { cellProps: { lang: "en", dir: "ltr" } },
        cell: ({ row }) => (
          <div className="max-w-sm min-w-55 flex items-start flex-col gap-y-1.5">
            <TextCell value={row.original.title_en} weight="semibold" />
            <TextCell
              value={row.original.shortDescription_en}
              tone="muted"
              size="sm"
            />
          </div>
        ),
      },
      {
        accessorKey: "createdAt",
        sortable: true,
        header: t("tableColCreatedAt"),
        cell: ({ row }) => <DateCell value={row.original.createdAt} />,
      },
    ];

    if (!canView && !canUpdate && !canDelete) return columns;

    return [
      ...columns,
      {
        id: "actions",
        sortable: false,
        header: () => (
          <span className="block text-end">{t("tableColActions")}</span>
        ),
        sticky: "end",
        cell: ({ row }) => {
          const c = row.original;
          return (
            <TableActionsGroup
              disabled={busy}
              actions={[
                {
                  key: "view",
                  label: t("tableActionView"),
                  icon: Eye,
                  onClick: () => onView?.(c),
                  hidden: !canView,
                },
                {
                  key: "edit",
                  label: t("tableActionEdit"),
                  icon: Pencil,
                  onClick: () => onEdit?.(c),
                  hidden: !canUpdate,
                },
                {
                  key: "delete",
                  label: t("tableActionDelete"),
                  icon: Trash2,
                  tone: "danger",
                  onClick: () => onDelete?.(c),
                  hidden: !canDelete,
                },
              ]}
            />
          );
        },
      },
    ];
  }, [
    busy,
    canDelete,
    canUpdate,
    canView,
    onDelete,
    onEdit,
    onView,
    t,
  ]);
};

export default useColumns;
