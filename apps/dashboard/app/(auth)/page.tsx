import type { Metadata } from "next";
import LoginPage from "../../components/login";

export const metadata: Metadata = {
  title: "Sign in | Sadek Dashboard",
  description: "Sign in to your portfolio dashboard.",
};

export default function Page() {
  return <LoginPage />;
}
