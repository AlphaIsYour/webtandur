import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Providers from "@/components/providers";

export default function JejakLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <Navbar />
      <div className="mt-16">{children}</div>
    </Providers>
  );
}
