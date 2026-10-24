"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Seo } from "@repo/types/seo";
import { CircleOff, Eye, Pencil, Share, Trash2 } from "@repo/ui/icons";
import {
  DateCell,
  StatusBadgeCell,
  TableActionsGroup,
  TextCell,
} from "../../ui/cells";
import type { DynamicColumnDef } from "../../ui/dynamic-table/types/types";
import { localized } from "../../../utils/format";
import { getRobotsBadge, seoPageLabelKey, twitterCardLabelKey } from "../utils/constants";

type UseColumnsOptions = {
  busy?: boolean;
  onView?: (seo: Seo) => void;
  onEdit?: (seo: Seo) => void;
  onDelete?: (seo: Seo) => void;
  onToggleActive?: (seo: Seo) => void;
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

  return useMemo<DynamicColumnDef<Seo>[]>(() => {
    const columns: DynamicColumnDef<Seo>[] = [
      {
        accessorKey: "id",
        sortable: true,
        header: t("tableColId"),
        cell: ({ row }) => <TextCell value={row.original.id} tone="muted" />,
      },
      {
        accessorKey: "pageName",
        sortable: true,
        header: t("tableColPage"),
        cell: ({ row }) => (
          <TextCell value={t(seoPageLabelKey(row.original.pageName))} weight="semibold" />
        ),
      },
      {
        id: "metaTitle",
        accessorFn: (seo) =>
          localized(locale, seo.metaTitle_en, seo.metaTitle_ar),
        sortable: true,
        header: t("tableColMetaTitle"),
        cell: ({ row }) => (
          <div className="max-w-md min-w-60 flex items-start flex-col gap-y-1.5">
            <TextCell
              value={localized(
                locale,
                row.original.metaTitle_en,
                row.original.metaTitle_ar,
              )}
              weight="semibold"
            />
            <TextCell
              value={localized(
                locale,
                row.original.metaDescription_en,
                row.original.metaDescription_ar,
              )}
              tone="muted"
              size="sm"
            />
          </div>
        ),
      },
      {
        accessorKey: "twitterCard",
        sortable: true,
        header: t("tableColTwitterCard"),
        cell: ({ row }) => (
          <TextCell
            value={t(twitterCardLabelKey(row.original.twitterCard))}
            size="sm"
          />
        ),
      },
      {
        id: "robots",
        sortable: false,
        header: t("tableColRobots"),
        cell: ({ row }) => <StatusBadgeCell {...getRobotsBadge(row.original)} />,
      },
      {
        accessorKey: "isActive",
        sortable: true,
        header: t("tableColStatus"),
        cell: ({ row }) => (
          <StatusBadgeCell
            value={
              row.original.isActive
                ? t("seoStatusLive")
                : t("seoStatusDraft")
            }
            tone={row.original.isActive ? "success" : "neutral"}
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
          const seo = row.original;
          return (
            <TableActionsGroup
              disabled={busy}
              actions={[
                {
                  key: "view",
                  label: t("tableActionView"),
                  icon: Eye,
                  onClick: () => onView?.(seo),
                  hidden: !canView,
                },
                {
                  key: "toggle-active",
                  label: seo.isActive
                    ? t("tableActionDeactivate")
                    : t("tableActionActivate"),
                  icon: seo.isActive ? CircleOff : Share,
                  tone: seo.isActive ? "danger" : "success",
                  onClick: () => onToggleActive?.(seo),
                  hidden: !canToggleActive,
                },
                {
                  key: "edit",
                  label: t("tableActionEdit"),
                  icon: Pencil,
                  onClick: () => onEdit?.(seo),
                  hidden: !canUpdate,
                },
                {
                  key: "delete",
                  label: t("tableActionDelete"),
                  icon: Trash2,
                  tone: "danger",
                  onClick: () => onDelete?.(seo),
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
