"use client";

import { useFormatter, useTranslations } from "next-intl";
import { TextCell } from "../../ui/cells";
import { WORK_DATE_FORMAT } from "../utils/constants";

/** "Mar 2021 – Jun 2024" in the active locale; a current job ends in "Present". */
export function WorkPeriodCell({
  from,
  to,
}: {
  from: string;
  to: string | null;
}) {
  const t = useTranslations();
  const format = useFormatter();
  const start = format.dateTime(new Date(from), WORK_DATE_FORMAT);
  const end = to
    ? format.dateTime(new Date(to), WORK_DATE_FORMAT)
    : t("userCompanyPresent");
  return <TextCell value={`${start} – ${end}`} className="whitespace-nowrap" />;
}
