"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMyUserCompanies } from "@repo/hooks/user-company";
import type { UserCompanyDetails } from "@repo/types/user-company";
import { Building2, Pencil } from "@repo/ui/icons";
import { DynamicTable } from "../ui/dynamic-table";
import { ConfirmAction } from "../ui/confirm-action";
import useColumns from "./hooks/use-columns";
import { useStaticFilter } from "./hooks/use-static-filter";
import { useDeleteUserCompanyAction } from "./hooks/use-delete-user-company";
import { UserCompanyForm } from "./components/user-company-form";
import { readListQueryParams } from "../../utils/list-query";
import { getUserCompaniesQuery } from "./utils/constants";

/** Companies page content. Data is prefetched in the route's page.tsx. */
export default function UserCompaniesPage() {
  const t = useTranslations();
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  // The row being edited; null while creating.
  const [selectedCompany, setSelectedCompany] =
    useState<UserCompanyDetails | null>(null);
  const handleOpenDialog = useCallback((open: boolean) => {
    setIsOpenDialog(open);
  }, []);
  const handleCreate = useCallback(() => {
    setSelectedCompany(null);
    setIsOpenDialog(true);
  }, []);
  const handleEdit = useCallback((company: UserCompanyDetails) => {
    setSelectedCompany(company);
    setIsOpenDialog(true);
  }, []);
  const isEditing = selectedCompany !== null;
  // Same query as the server prefetch, so the hydrated cache is reused.
  const searchParams = useSearchParams();
  const query = useMemo(
    () =>
      getUserCompaniesQuery(
        readListQueryParams((name) => searchParams.get(name)),
      ),
    [searchParams],
  );
  const { data, isPending, isFetching, isError, refetch } =
    useMyUserCompanies(query);
  const staticFilter = useStaticFilter();
  const deleteAction = useDeleteUserCompanyAction();
  const columns = useColumns({
    busy: deleteAction.isDeleting,
    canUpdate: true,
    canDelete: true,
    onEdit: handleEdit,
    onDelete: deleteAction.requestDelete,
  });

  return (
    <main className="space-y-6">
      <DynamicTable
        title={t("userCompaniesTitle")}
        description={t("userCompaniesDescription")}
        columns={columns}
        data={data?.data}
        getRowId={(company) => String(company.id)}
        isLoading={isPending}
        isError={isError}
        onRetry={() => void refetch()}
        onReload={() => void refetch()}
        isRefreshing={isFetching}
        pagination={data}
        showCreate={true}
        makeCreateAction={handleCreate}
        staticFilter={staticFilter}
      />
      <UserCompanyForm
        isOpenDialog={isOpenDialog}
        handleOpenDialog={handleOpenDialog}
        title={
          isEditing ? t("userCompanyFormEditTitle") : t("userCompanyFormTitle")
        }
        description={
          isEditing
            ? t("userCompanyFormEditDescription")
            : t("userCompanyFormDescription")
        }
        Icon={isEditing ? Pencil : Building2}
        role={isEditing ? "edit" : "create"}
        defaultValues={selectedCompany}
      />
      <ConfirmAction
        open={deleteAction.isOpen}
        onOpenChange={deleteAction.onOpenChange}
        question={deleteAction.question}
        onConfirm={deleteAction.confirmDelete}
      />
    </main>
  );
}
