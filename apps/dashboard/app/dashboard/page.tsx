import type { Metadata } from "next";
import Dashboard from "../../components/dashboard";

export const metadata: Metadata = {
  title: "Dashboard | Sadek",
  description: "Manage your portfolio.",
};

export default function DashboardPage() {
  return <Dashboard />;
}
