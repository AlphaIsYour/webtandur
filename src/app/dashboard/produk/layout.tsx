// src/app/dashboard/produk/layout.tsx

import React from "react";

// Layout sederhana untuk memberikan padding yang konsisten
export default function ProdukLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-6 md:px-6 md:py-8">
      {children}
    </div>
  );
}
