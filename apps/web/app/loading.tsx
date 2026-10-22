import { HomePageSkeleton } from "../components/loading";
import { Footer } from "../components/layout/footer/index";
import { Header } from "../components/layout/header/index";

// Streamed right away while page.tsx fetches the public data.
export default function Loading() {
  return (
    <>
      <Header />
      <main>
        <HomePageSkeleton />
      </main>
      <Footer />
    </>
  );
}
