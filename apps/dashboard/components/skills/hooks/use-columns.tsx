"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Skill } from "@repo/types/skills";
import { CircleCheck, CircleOff, Eye, Pencil, Trash2 } from "@repo/ui/icons";
import {
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
  onView?: (skill: Skill) => void;
  onEdit?: (skill: Skill) => void;
  onDelete?: (skill: Skill) => void;
  onToggleActive?: (skill: Skill) => void;
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

  return useMemo<DynamicColumnDef<Skill>[]>(() => {
    const columns: DynamicColumnDef<Skill>[] = [
      {
        accessorKey: "id",
        sortable: true,
        header: t("tableColId"),
        cell: ({ row }) => <TextCell value={row.original.id} tone="muted" />,
      },
      {
        accessorKey: "name",
        sortable: true,
        header: t("tableColSkill"),
        meta: { cellProps: { dir: "auto" } },
        cell: ({ row }) => (
          <TextCell value={row.original.name} weight="semibold" />
        ),
      },
      {
        id: "categories",
        sortable: false,
        header: t("tableColCategories"),
        cell: ({ row }) => (
          <ChipsCell
            max={1}
            values={row.original.categorySkills.map((category) =>
              localized(locale, category.nameEn, category.nameAr),
            )}
          />
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
          const skill = row.original;
          return (
            <TableActionsGroup
              disabled={busy}
              actions={[
                {
                  key: "view",
                  label: t("tableActionView"),
                  icon: Eye,
                  onClick: () => onView?.(skill),
                  hidden: !canView,
                },
                {
                  key: "toggle-active",
                  label: skill.isActive
                    ? t("tableActionDeactivate")
                    : t("tableActionActivate"),
                  icon: skill.isActive ? CircleOff : CircleCheck,
                  tone: skill.isActive ? "danger" : "success",
                  onClick: () => onToggleActive?.(skill),
                  hidden: !canToggleActive,
                },
                {
                  key: "edit",
                  label: t("tableActionEdit"),
                  icon: Pencil,
                  onClick: () => onEdit?.(skill),
                  hidden: !canUpdate,
                },
                {
                  key: "delete",
                  label: t("tableActionDelete"),
                  icon: Trash2,
                  tone: "danger",
                  onClick: () => onDelete?.(skill),
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
    locale,
    onToggleActive,
    onDelete,
    onEdit,
    onView,
    t,
  ]);
};

export default useColumns;
