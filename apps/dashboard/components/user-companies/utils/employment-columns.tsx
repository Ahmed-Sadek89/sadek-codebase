import type { UserCompanyDetails } from "@repo/types/user-company";
import type { MessageKey } from "../../../i18n/types";
import { StatusBadgeCell, TextCell } from "../../ui/cells";
import type { DynamicColumnDef } from "../../ui/dynamic-table/types/types";
import { employmentTypeLabelKey, locationTypeLabelKey } from "./constants";

/** The Location (place and location type) and Employment (job title and type) columns. */
export function employmentColumns(
  t: (key: MessageKey) => string,
): DynamicColumnDef<UserCompanyDetails>[] {
  return [
    {
      accessorKey: "location",
      sortable: true,
      header: t("tableColLocation"),
      cell: ({ row }) => (
        <div className="min-w-35 flex items-start flex-col gap-y-1.5">
          <TextCell value={row.original.location} />
          <TextCell
            value={t(locationTypeLabelKey(row.original.location_type))}
            tone="muted"
            size="sm"
          />
        </div>
      ),
    },
    {
      accessorKey: "job_title",
      sortable: true,
      header: t("tableColEmploymentType"),
      cell: ({ row }) => (
        <div className="min-w-40 flex items-start flex-col gap-y-1.5">
          <TextCell value={row.original.job_title} weight="semibold" />
          <StatusBadgeCell
            value={t(employmentTypeLabelKey(row.original.employment_type))}
          />
        </div>
      ),
    },
  ];
}
