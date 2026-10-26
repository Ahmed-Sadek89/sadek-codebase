"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import type { InstructorExperience } from "@repo/types/instructor-experience";
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
import { TeachingPeriod } from "../components/teaching-period";

type Row = InstructorExperience;

type UseColumnsOptions = {
  busy?: boolean;
  onView?: (row: Row) => void;
  onEdit?: (row: Row) => void;
  onDelete?: (row: Row) => void;
  onToggleActive?: (row: Row) => void;
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

  return useMemo<DynamicColumnDef<Row>[]>(() => {
    const columns: DynamicColumnDef<Row>[] = [
      {
        accessorKey: "id",
        sortable: true,
        header: t("tableColId"),
        cell: ({ row }) => <TextCell value={row.original.id} tone="muted" />,
      },
      {
        id: "cover",
        sortable: false,
        header: t("tableColImage"),
        cell: ({ row }) => (
          <AvatarCell src={row.original.coverPhotoUrl} name={row.original.name} />
        ),
      },
      {
        accessorKey: "name",
        sortable: true,
        header: t("tableColCourse"),
        cell: ({ row }) => (
          <div className="min-w-48 max-w-xs">
            <TextCell value={row.original.name} weight="semibold" />
            <TextCell
              value={row.original.coursePlatformName}
              tone="muted"
              size="sm"
            />
          </div>
        ),
      },
      {
        id: "skills",
        sortable: false,
        header: t("tableColSkills"),
        cell: ({ row }) => (
          <ChipsCell max={2} values={row.original.skills.map((skill) => skill.name)} />
        ),
      },
      {
        accessorKey: "startAt",
        sortable: true,
        header: t("tableColTeachingPeriod"),
        cell: ({ row }) => (
          <TeachingPeriod startAt={row.original.startAt} endAt={row.original.endAt} />
        ),
      },
      {
        accessorKey: "rank",
        sortable: true,
        header: t("tableColRank"),
        cell: ({ row }) => <TextCell value={row.original.rank} weight="medium" />,
      },
      {
        accessorKey: "isActive",
        sortable: true,
        header: t("tableColStatus"),
        cell: ({ row }) => (
          <StatusBadgeCell
            value={row.original.isActive ? t("statusActive") : t("statusInactive")}
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
        header: () => <span className="block text-end">{t("tableColActions")}</span>,
        sticky: "end",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <TableActionsGroup
              disabled={busy}
              actions={[
                {
                  key: "view",
                  label: t("tableActionView"),
                  icon: Eye,
                  onClick: () => onView?.(item),
                  hidden: !canView,
                },
                {
                  key: "toggle-active",
                  label: item.isActive
                    ? t("tableActionDeactivate")
                    : t("tableActionActivate"),
                  icon: item.isActive ? CircleOff : CircleCheck,
                  tone: item.isActive ? "danger" : "success",
                  onClick: () => onToggleActive?.(item),
                  hidden: !canToggleActive,
                },
                {
                  key: "edit",
                  label: t("tableActionEdit"),
                  icon: Pencil,
                  onClick: () => onEdit?.(item),
                  hidden: !canUpdate,
                },
                {
                  key: "delete",
                  label: t("tableActionDelete"),
                  icon: Trash2,
                  tone: "danger",
                  onClick: () => onDelete?.(item),
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
    onDelete,
    onEdit,
    onToggleActive,
    onView,
    t,
  ]);
};

export default useColumns;
