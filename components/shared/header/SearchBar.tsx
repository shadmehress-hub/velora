"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";

function SearchBarForm({
  initialQuery,
  category,
}: {
  initialQuery: string;
  category: string | null;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (trimmed) params.set("q", trimmed);

    const qs = params.toString();
    router.push(qs ? `/search?${qs}` : "/search");
  };

  const handleClear = () => {
    setQuery("");
    router.push(
      category ? `/search?category=${encodeURIComponent(category)}` : "/search",
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      aria-label="جستجوی محصولات"
      className="relative w-full"
    >
      <Search className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="جستجو در محصولات ولورا..."
        aria-label="عبارت جستجو"
        className="h-9 w-full rounded-xl border-border/70 bg-muted/40 pr-9 pl-9 text-sm transition-colors focus-visible:bg-background"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="پاک کردن جستجو"
          className="absolute top-1/2 left-2.5 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      )}
    </form>
  );
}

function SearchBar() {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const category = searchParams.get("category");

  return (
    <SearchBarForm
      key={urlQuery}
      initialQuery={urlQuery}
      category={category}
    />
  );
}

export default SearchBar;
