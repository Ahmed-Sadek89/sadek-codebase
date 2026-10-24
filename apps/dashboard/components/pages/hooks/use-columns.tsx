"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import type { Page } from "@repo/types/pages";
import { Pencil, Trash2 } from "@repo/ui/icons";
import { DateCell, TableActionsGroup, TextCell } from "../../ui/cells";
import type { DynamicColumnDef } from "../../ui/dynamic-table/types/types";

type UseColumnsOptions = {
  busy?: boolean;
  onEdit?: (page: Page) => void;
  onDelete?: (page: Page) => void;
  /** Each flag shows its action; the Action column shows if any is set. */
  canUpdate?: boolean;
  canDelete?: boolean;
};

const useColumns = ({
  busy = false,
  onEdit,
  onDelete,
  canUpdate = false,
  canDelete = false,
}: UseColumnsOptions = {}) => {
  const t = useTranslations();

  return useMemo<DynamicColumnDef<Page>[]>(() => {
    const columns: DynamicColumnDef<Page>[] = [
      {
        accessorKey: "id",
        sortable: true,
        header: t("tableColId"),
        cell: ({ row }) => <TextCell value={row.original.id} tone="muted" />,
      },
      {
        accessorKey: "name_en",
        sortable: true,
        header: t("tableColPageEn"),
        meta: { cellProps: { lang: "en", dir: "ltr" } },
        cell: ({ row }) => <TextCell value={row.original.name_en} weight="semibold" />,
      },
      {
        accessorKey: "name_ar",
        sortable: true,
        header: t("tableColPageAr"),
        meta: { cellProps: { lang: "ar", dir: "rtl" } },
        cell: ({ row }) => <TextCell value={row.original.name_ar} weight="semibold" />,
      },
      {
        accessorKey: "createdAt",
        sortable: true,
        header: t("tableColCreatedAt"),
        cell: ({ row }) => <DateCell value={row.original.createdAt} />,
      },
    ];

    if (!canUpdate && !canDelete) return columns;

    return [
      ...columns,
      {
        id: "actions",
        sortable: false,
        header: () => <span className="block text-end">{t("tableColActions")}</span>,
        sticky: "end",
        cell: ({ row }) => {
          const page = row.original;
          return (
            <TableActionsGroup
              disabled={busy}
              actions={[
                {
                  key: "edit",
                  label: t("tableActionEdit"),
                  icon: Pencil,
                  onClick: () => onEdit?.(page),
                  hidden: !canUpdate,
                },
                {
                  key: "delete",
                  label: t("tableActionDelete"),
                  icon: Trash2,
                  tone: "danger",
                  onClick: () => onDelete?.(page),
                  hidden: !canDelete,
                },
              ]}
            />
          );
        },
      },
    ];
  }, [busy, canDelete, canUpdate, onDelete, onEdit, t]);
};

export default useColumns;
