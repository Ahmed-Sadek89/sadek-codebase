import { HomePage } from "../components/homepage";
import { Footer } from "../components/layout/footer/index";
import { Header } from "../components/layout/header/index";

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <HomePage />
      </main>
      <Footer />
    </>
  );
}
