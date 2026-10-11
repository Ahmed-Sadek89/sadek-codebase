import type { useFormatter, useTranslations } from "next-intl";
import type { CategorySkill } from "@repo/types/category-skills";
import {
  createDynamicTableColumnHelper,
  type DynamicTableColumns,
} from "../../ui/dynamic-table";

const helper = createDynamicTableColumnHelper<CategorySkill>();

// Each language column keeps its own direction, whatever the page locale.
const arabicCell = { cellProps: { lang: "ar", dir: "rtl" } } as const;
const englishCell = { cellProps: { lang: "en", dir: "ltr" } } as const;

/** Category-skills table columns. Pure: the caller passes the i18n helpers. */
export function createCategorySkillsColumns(
  t: ReturnType<typeof useTranslations>,
  format: ReturnType<typeof useFormatter>,
): DynamicTableColumns<CategorySkill> {
  return helper.columns([
    helper.accessor("id", { header: t("tableColId") }),
    helper.accessor("nameAr", {
      header: t("tableColNameAr"),
      meta: arabicCell,
    }),
    helper.accessor("nameEn", {
      header: t("tableColNameEn"),
      meta: englishCell,
    }),
    helper.accessor("descriptionAr", {
      header: t("tableColDescriptionAr"),
      cell: (info) => info.getValue() || t("tableEmptyValue"),
      meta: arabicCell,
    }),
    helper.accessor("descriptionEn", {
      header: t("tableColDescriptionEn"),
      cell: (info) => info.getValue() || t("tableEmptyValue"),
      meta: englishCell,
    }),
    helper.accessor("isActive", {
      header: t("tableColStatus"),
      cell: (info) =>
        info.getValue() ? t("statusActive") : t("statusInactive"),
    }),
    helper.accessor("createdAt", {
      header: t("tableColCreatedAt"),
      cell: (info) =>
        format.dateTime(new Date(info.getValue()), { dateStyle: "medium" }),
      meta: { cellProps: { className: "whitespace-nowrap" } },
    }),
  ]);
}
