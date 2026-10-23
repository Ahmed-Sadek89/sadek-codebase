"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import type { Contact } from "@repo/types/contacts";
import { Eye, Pencil, Trash2 } from "@repo/ui/icons";
import { DateCell, TableActionsGroup, TextCell } from "../../ui/cells";
import type { DynamicColumnDef } from "../../ui/dynamic-table/types/types";

type UseColumnsOptions = {
  busy?: boolean;
  onView?: (contact: Contact) => void;
  onEdit?: (contact: Contact) => void;
  onDelete?: (contact: Contact) => void;
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

  return useMemo<DynamicColumnDef<Contact>[]>(() => {
    const columns: DynamicColumnDef<Contact>[] = [
      {
        accessorKey: "id",
        sortable: true,
        header: t("tableColId"),
        cell: ({ row }) => <TextCell value={row.original.id} tone="muted" />,
      },
      {
        accessorKey: "name",
        sortable: true,
        header: t("tableColSender"),
        cell: ({ row }) => (
          <div className="flex min-w-48 flex-col items-start gap-y-1">
            <TextCell value={row.original.name} weight="semibold" />
            <a
              className="text-sm text-muted-foreground hover:text-primary hover:underline"
              dir="ltr"
              href={`mailto:${row.original.email}`}
            >
              {row.original.email}
            </a>
          </div>
        ),
      },
      {
        accessorKey: "subject",
        sortable: true,
        header: t("tableColMessage"),
        cell: ({ row }) => (
          <div className="flex max-w-md min-w-64 flex-col items-start gap-y-1.5">
            {/* Short previews; View opens the full message. */}
            <TextCell
              value={row.original.subject}
              weight="semibold"
              maxLength={50}
            />
            <TextCell
              value={row.original.message}
              tone="muted"
              size="sm"
              maxLength={60}
            />
          </div>
        ),
      },
      {
        accessorKey: "createdAt",
        sortable: true,
        header: t("tableColReceivedAt"),
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
  }, [busy, canDelete, canUpdate, canView, onDelete, onEdit, onView, t]);
};

export default useColumns;
