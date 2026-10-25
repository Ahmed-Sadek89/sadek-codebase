"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Project } from "@repo/types/projects";
import { CircleCheck, CircleOff, Eye, Pencil, Trash2 } from "@repo/ui/icons";
import {
  AvatarCell,
  ChipsCell,
  DateCell,
  StatusBadgeCell,
  TableActionsGroup,
  TextCell,
} from "../../ui/cells";
import type { DynamicColumnDef } from "../../ui/dynamic-table/types/types";
import { localized } from "../../../utils/format";

type UseColumnsOptions = {
  busy?: boolean;
  onView?: (project: Project) => void;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  onToggleActive?: (project: Project) => void;
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
  const locale = useLocale();

  return useMemo<DynamicColumnDef<Project>[]>(() => {
    const columns: DynamicColumnDef<Project>[] = [
      {
        accessorKey: "id",
        sortable: true,
        header: t("tableColId"),
        cell: ({ row }) => <TextCell value={row.original.id} tone="muted" />,
      },
      {
        id: "image",
        sortable: false,
        header: t("tableColImage"),
        cell: ({ row }) => (
          <AvatarCell
            src={row.original.mainImageUrl}
            name={localized(locale, row.original.nameEn, row.original.nameAr)}
          />
        ),
      },
      {
        accessorKey: "nameAr",
        sortable: true,
        header: t("tableColProjectAr"),
        meta: { cellProps: { lang: "ar", dir: "rtl" } },
        cell: ({ row }) => (
          <TextCell value={row.original.nameAr} weight="semibold" />
        ),
      },
      {
        accessorKey: "nameEn",
        sortable: true,
        header: t("tableColProjectEn"),
        meta: { cellProps: { lang: "en", dir: "ltr" } },
        cell: ({ row }) => (
          <TextCell value={row.original.nameEn} weight="semibold" />
        ),
      },
      {
        id: "categories",
        sortable: false,
        header: t("tableColCategories"),
        cell: ({ row }) => (
          <ChipsCell
            max={1}
            values={row.original.categoryProjects.map((category) =>
              localized(locale, category.nameEn, category.nameAr),
            )}
          />
        ),
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
          const project = row.original;
          return (
            <TableActionsGroup
              disabled={busy}
              actions={[
                {
                  key: "view",
                  label: t("tableActionView"),
                  icon: Eye,
                  onClick: () => onView?.(project),
                  hidden: !canView,
                },
                {
                  key: "toggle-active",
                  label: project.isActive
                    ? t("tableActionDeactivate")
                    : t("tableActionActivate"),
                  icon: project.isActive ? CircleOff : CircleCheck,
                  tone: project.isActive ? "danger" : "success",
                  onClick: () => onToggleActive?.(project),
                  hidden: !canToggleActive,
                },
                {
                  key: "edit",
                  label: t("tableActionEdit"),
                  icon: Pencil,
                  onClick: () => onEdit?.(project),
                  hidden: !canUpdate,
                },
                {
                  key: "delete",
                  label: t("tableActionDelete"),
                  icon: Trash2,
                  tone: "danger",
                  onClick: () => onDelete?.(project),
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
    canToggleActive,
    canUpdate,
    canView,
    locale,
    onDelete,
    onEdit,
    onToggleActive,
    onView,
    t,
  ]);
};

export default useColumns;
