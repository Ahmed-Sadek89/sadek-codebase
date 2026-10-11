"use client";

import { useMemo } from "react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import type { CategorySkill } from "@repo/types/category-skills";
import { Eye, Pencil, Trash2 } from "@repo/ui/icons";
import { StatusBadgeCell, TableActionsGroup, TextCell } from "../../ui/cells";
import type { DynamicColumnDef } from "../../ui/dynamic-table/types/types";
import { localized } from "../../../utils/format";

type UseColumnsOptions = {
  busy?: boolean;
  onView?: (category: CategorySkill) => void;
  onEdit?: (category: CategorySkill) => void;
  onDelete?: (category: CategorySkill) => void;
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
  const format = useFormatter();
  const locale = useLocale();

  return useMemo<DynamicColumnDef<CategorySkill>[]>(() => {

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

    if (!canView && !canUpdate && !canDelete) return columns;

    return [
      ...columns,
      {
        id: "actions",
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
    format,
    locale,
    onDelete,
    onEdit,
    onView,
    t,
  ]);
};

export default useColumns;
