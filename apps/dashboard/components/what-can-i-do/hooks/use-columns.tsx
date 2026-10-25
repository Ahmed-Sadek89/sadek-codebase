"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import type { WhatCanDoDetails } from "@repo/types/what-can-do";
import { CircleCheck, CircleOff, Eye, Pencil, Trash2 } from "@repo/ui/icons";
import {
  DateCell,
  StatusBadgeCell,
  TableActionsGroup,
  TextCell,
} from "../../ui/cells";
import type { DynamicColumnDef } from "../../ui/dynamic-table/types/types";
import {
  WHAT_CAN_DO_SHORT_DESCRIPTION_PREVIEW_MAX,
} from "../utils/constants";

type UseColumnsOptions = {
  busy?: boolean;
  onView?: (item: WhatCanDoDetails) => void;
  onEdit?: (item: WhatCanDoDetails) => void;
  onDelete?: (item: WhatCanDoDetails) => void;
  onToggleActive?: (item: WhatCanDoDetails) => void;
  /** Each flag shows its action; the Action column shows if any is set. */
  canView?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  canToggleActive?: boolean;
};

const useColumns = ({
  busy = false,
  onView,
  onEdit,
  onDelete,
  onToggleActive,
  canView = false,
  canUpdate = false,
  canDelete = false,
  canToggleActive = false,
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
              maxLength={WHAT_CAN_DO_SHORT_DESCRIPTION_PREVIEW_MAX}
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
              maxLength={WHAT_CAN_DO_SHORT_DESCRIPTION_PREVIEW_MAX}
            />
            
          </div>
        ),
      },
      {
        accessorKey: "isActive",
        sortable: true,
        header: t("tableColStatus"),
        cell: ({ row }) => (
          <StatusBadgeCell
            value={
              row.original.isActive ? t("statusActive") : t("statusInactive")
            }
            tone={row.original.isActive ? "primary" : "danger"}
          />
        ),
      },
      {
        accessorKey: "createdAt",
        sortable: true,
        header: t("tableColCreatedAt"),
        cell: ({ row }) => <DateCell value={row.original.createdAt} />,
      },
    ];

    if (!canView && !canUpdate && !canDelete && !canToggleActive) return columns;

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
                  key: "toggle-active",
                  label: c.isActive
                    ? t("tableActionDeactivate")
                    : t("tableActionActivate"),
                  icon: c.isActive ? CircleOff : CircleCheck,
                  tone: c.isActive ? "danger" : "success",
                  onClick: () => onToggleActive?.(c),
                  hidden: !canToggleActive,
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
    canToggleActive,
    canDelete,
    canUpdate,
    canView,
    onToggleActive,
    onDelete,
    onEdit,
    onView,
    t,
  ]);
};

export default useColumns;
