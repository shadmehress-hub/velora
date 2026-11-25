import Footer from "@/components/Footer";
import Header from "@/components/shared/header";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
