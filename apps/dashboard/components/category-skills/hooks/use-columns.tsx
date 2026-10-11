"use client";

import { useMemo } from "react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import type { CategorySkill } from "@repo/types/category-skills";
import { Pencil, Trash2 } from "@repo/ui/icons";
import { StatusBadgeCell, TableActionsGroup, TextCell } from "../../ui/cells";
import type { DynamicColumnDef } from "../../ui/dynamic-table/types/types";
import { localized } from "../../../utils/format";

type UseColumnsOptions = {
  busy?: boolean;
  onEdit?: (category: CategorySkill) => void;
  onDelete?: (category: CategorySkill) => void;
  canUpdate?: boolean;
  canDelete?: boolean;
};

const useColumns = ({
  busy = false,
  onEdit,
  onDelete,
  canUpdate = false,
  canDelete: canRemove = false,
}: UseColumnsOptions = {}) => {
  const t = useTranslations();
  const format = useFormatter();
  const locale = useLocale();

  return useMemo<DynamicColumnDef<CategorySkill>[]>(() => {
    const showEdit = canUpdate && Boolean(onEdit);
    const showDelete = canRemove && Boolean(onDelete);

    const columns: DynamicColumnDef<CategorySkill>[] = [
      {
        accessorKey: "id",
        header: t("tableColId"),
        cell: ({ row }) => <TextCell value={row.original.id} tone="muted" />,
      },
      {
        id: "category",
        accessorFn: (row) => localized(locale, row.nameEn, row.nameAr),
        header: t("tableColCategory"),
        cell: ({ row }) => {
          const c = row.original;
          return (
            <div className="max-w-sm min-w-55">
              <TextCell
                value={localized(locale, c.nameEn, c.nameAr)}
                weight="semibold"
              />
              <TextCell
                value={localized(locale, c.descriptionEn, c.descriptionAr)}
                tone="muted"
                size="sm"
              />
            </div>
          );
        },
      },
      {
        accessorKey: "isActive",
        header: t("tableColStatus"),
        cell: ({ row }) => (
          <StatusBadgeCell
            value={
              row.original.isActive ? t("statusActive") : t("statusInactive")
            }
            tone={row.original.isActive ? "success" : "neutral"}
          />
        ),
      },
      {
        accessorKey: "createdAt",
        header: t("tableColCreatedAt"),
        cell: ({ row }) => (
          <TextCell
            value={format.dateTime(new Date(row.original.createdAt), {
              dateStyle: "medium",
            })}
            className="whitespace-nowrap"
          />
        ),
      },
    ];

    if (!showEdit && !showDelete) return columns;

    return [
      ...columns,
      {
        id: "actions",
        header: () => <span className="sr-only">{t("tableColActions")}</span>,
        sticky: "end",
        cell: ({ row }) => {
          const c = row.original;
          return (
            <TableActionsGroup
              disabled={busy}
              actions={[
                {
                  key: "edit",
                  label: t("tableActionEdit"),
                  icon: Pencil,
                  onClick: () => onEdit?.(c),
                  hidden: !showEdit,
                },
                {
                  key: "delete",
                  label: t("tableActionDelete"),
                  icon: Trash2,
                  tone: "danger",
                  onClick: () => onDelete?.(c),
                  hidden: !showDelete,
                },
              ]}
            />
          );
        },
      },
    ];
  }, [busy, canRemove, canUpdate, format, locale, onDelete, onEdit, t]);
};

export default useColumns;
