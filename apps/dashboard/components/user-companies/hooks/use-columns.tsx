"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import type { UserCompanyDetails } from "@repo/types/user-company";
import { CircleCheck, CircleOff, Eye, Pencil, Trash2 } from "@repo/ui/icons";
import {
  AvatarCell,
  DateCell,
  StatusBadgeCell,
  TableActionsGroup,
  TextCell,
} from "../../ui/cells";
import type { DynamicColumnDef } from "../../ui/dynamic-table/types/types";
import { CompanySiteCell } from "../components/company-site-cell";
import { WorkPeriodCell } from "../components/work-period-cell";
import { employmentColumns } from "../utils/employment-columns";

type UseColumnsOptions = {
  busy?: boolean;
  onView?: (company: UserCompanyDetails) => void;
  onEdit?: (company: UserCompanyDetails) => void;
  onDelete?: (company: UserCompanyDetails) => void;
  onToggleActive?: (company: UserCompanyDetails) => void;
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

  return useMemo<DynamicColumnDef<UserCompanyDetails>[]>(() => {
    const columns: DynamicColumnDef<UserCompanyDetails>[] = [
      {
        accessorKey: "id",
        sortable: true,
        header: t("tableColId"),
        cell: ({ row }) => <TextCell value={row.original.id} tone="muted" />,
      },
      {
        id: "logo",
        sortable: false,
        header: t("tableColLogo"),
        cell: ({ row }) => (
          <AvatarCell
            src={row.original.logo}
            name={row.original.company_name}
          />
        ),
      },
      {
        accessorKey: "company_name",
        sortable: true,
        header: t("tableColCompany"),
        cell: ({ row }) => (
          <TextCell value={row.original.company_name} weight="semibold" />
        ),
      },
      {
        accessorKey: "startWorkFrom",
        sortable: true,
        header: t("tableColWorkPeriod"),
        cell: ({ row }) => (
          <WorkPeriodCell
            from={row.original.startWorkFrom}
            to={row.original.startWorkTo}
          />
        ),
      },
      ...employmentColumns(t),
      {
        id: "site",
        sortable: false,
        header: t("tableColWebsite"),
        cell: ({ row }) => (
          <CompanySiteCell url={row.original.company_site} />
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
