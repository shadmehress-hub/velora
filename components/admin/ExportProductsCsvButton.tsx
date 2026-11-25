"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Product } from "@/types/index";

function escapeCsvCell(value: string | number) {
  const str = String(value).replace(/"/g, '""');
  return `"${str}"`;
}

function ExportProductsCsvButton({ products }: { products: Product[] }) {
  const handleExport = () => {
    const headers = [
      "ID",
      "نام محصول",
      "اسلاگ",
      "دسته‌بندی",
      "برند",
      "قیمت (تومان)",
      "موجودی",
    ];
    const rows = products.map((p) =>
      [
        escapeCsvCell(p.id),
        escapeCsvCell(p.name),
        escapeCsvCell(p.slug),
        escapeCsvCell(p.category),
        escapeCsvCell(p.brand),
        escapeCsvCell(p.price),
        escapeCsvCell(p.stock),
      ].join(","),
    );

    // UTF-8 BOM ensures Excel opens Persian text properly without garbled characters
    const csvContent = `\uFEFF${[headers.join(","), ...rows].join("\n")}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `velora-products-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={products.length === 0}
      onClick={handleExport}
      className="min-h-9 gap-1.5"
    >
      <Download className="size-4" aria-hidden="true" />
      <span>خروجی CSV</span>
    </Button>
  );
}

export default ExportProductsCsvButton;
