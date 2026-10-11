"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Project } from "@repo/types/projects";
import { Code, Eye, Globe, Pencil, Trash2 } from "@repo/ui/icons";
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
import { PROJECT_DESCRIPTION_PREVIEW_MAX } from "../utils/constants";

type UseColumnsOptions = {
  busy?: boolean;
  onView?: (project: Project) => void;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  /** Each flag shows its action; the Action column shows if any is set. */
  canView?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
};

const LINK_CLASS_NAME =
  "inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary";

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
          <div className="flex max-w-sm min-w-55 flex-col items-start gap-y-1.5">
            <TextCell value={row.original.nameAr} weight="semibold" />
            <TextCell
              value={row.original.descriptionAr}
              tone="muted"
              size="sm"
              maxLength={PROJECT_DESCRIPTION_PREVIEW_MAX}
            />
          </div>
        ),
      },
      {
        accessorKey: "nameEn",
        sortable: true,
        header: t("tableColProjectEn"),
        meta: { cellProps: { lang: "en", dir: "ltr" } },
        cell: ({ row }) => (
          <div className="flex max-w-sm min-w-55 flex-col items-start gap-y-1.5">
            <TextCell value={row.original.nameEn} weight="semibold" />
            <TextCell
              value={row.original.descriptionEn}
              tone="muted"
              size="sm"
              maxLength={PROJECT_DESCRIPTION_PREVIEW_MAX}
            />
          </div>
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
        id: "links",
        sortable: false,
        header: t("tableColLinks"),
        cell: ({ row }) => {
          const { liveUrl, repoUrl } = row.original;
          if (!liveUrl && !repoUrl) {
            return <span className="text-muted-foreground">—</span>;
          }
          return (
            <div className="flex items-center gap-1.5">
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={t("projectLiveLink")}
                  title={t("projectLiveLink")}
                  className={LINK_CLASS_NAME}
                >
                  <Globe className="size-4" aria-hidden />
                </a>
              )}
              {repoUrl && (
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={t("projectRepoLink")}
                  title={t("projectRepoLink")}
                  className={LINK_CLASS_NAME}
                >
                  <Code className="size-4" aria-hidden />
                </a>
              )}
            </div>
          );
        },
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
  }, [busy, canDelete, canUpdate, canView, locale, onDelete, onEdit, onView, t]);
};

export default useColumns;
