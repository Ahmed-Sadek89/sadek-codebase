"use client";

import { useMemo } from "react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import type { UserCompanyDetails } from "@repo/types/user-company";
import { Eye, Globe, Pencil, Trash2 } from "@repo/ui/icons";
import {
  AvatarCell,
  DateCell,
  TableActionsGroup,
  TextCell,
} from "../../ui/cells";
import type { DynamicColumnDef } from "../../ui/dynamic-table/types/types";
import { localized } from "../../../utils/format";
import { LINK_CLASS_NAME, WORK_DATE_FORMAT } from "../utils/constants";

type UseColumnsOptions = {
  busy?: boolean;
  onView?: (company: UserCompanyDetails) => void;
  onEdit?: (company: UserCompanyDetails) => void;
  onDelete?: (company: UserCompanyDetails) => void;
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
  const locale = useLocale();
  const format = useFormatter();

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
            name={localized(locale, row.original.name_en, row.original.name_ar)}
          />
        ),
      },
      {
        accessorKey: "name_ar",
        sortable: true,
        header: t("tableColCompanyAr"),
        meta: { cellProps: { lang: "ar", dir: "rtl" } },
        cell: ({ row }) => (
          <div className="max-w-sm min-w-55 flex items-start flex-col gap-y-1.5">
            <TextCell value={row.original.name_ar} weight="semibold" />
            <TextCell
              value={row.original.description_ar}
              tone="muted"
              size="sm"
            />
          </div>
        ),
      },
      {
        accessorKey: "name_en",
        sortable: true,
        header: t("tableColCompanyEn"),
        meta: { cellProps: { lang: "en", dir: "ltr" } },
        cell: ({ row }) => (
          <div className="max-w-sm min-w-55 flex items-start flex-col gap-y-1.5">
            <TextCell value={row.original.name_en} weight="semibold" />
            <TextCell
              value={row.original.description_en}
              tone="muted"
              size="sm"
            />
          </div>
        ),
      },
      {
        accessorKey: "startWorkFrom",
        sortable: true,
        header: t("tableColWorkPeriod"),
        cell: ({ row }) => {
          const { startWorkFrom, startWorkTo } = row.original;
          const from = format.dateTime(new Date(startWorkFrom), WORK_DATE_FORMAT);
          const to = startWorkTo
            ? format.dateTime(new Date(startWorkTo), WORK_DATE_FORMAT)
            : t("userCompanyPresent");
          return <TextCell value={`${from} – ${to}`} className="whitespace-nowrap" />;
        },
      },
      {
        id: "site",
        sortable: false,
        header: t("tableColWebsite"),
        cell: ({ row }) => {
          const { company_site } = row.original;
          if (!company_site) {
            return <span className="text-muted-foreground">—</span>;
          }
          return (
            <a
              href={company_site}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={t("userCompanySiteLink")}
              title={company_site}
              className={LINK_CLASS_NAME}
            >
              <Globe className="size-4" aria-hidden />
            </a>
          );
        },
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
