"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { SortBy } from "@/lib/sort";
import type { ProductQueryState as ProductQueryStateType } from "@/types/hooks/ProductQueryState.types";

export type ProductQueryState = ProductQueryStateType;

export function useProductQueryState(
  defaults?: Partial<
    Pick<ProductQueryState, "searchQuery" | "selectedCategory" | "sortBy">
  >
): ProductQueryState {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getInitial = <T extends string>(key: string, fallback: T): T => {
    const v = searchParams?.get(key);
    return (v as T) ?? fallback;
  };

  const [searchQuery, setSearchQuery] = useState<string>(
    () => defaults?.searchQuery ?? getInitial("q", "")
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    () => defaults?.selectedCategory ?? getInitial("category", "")
  );

  const allowedSort: SortBy[] = [
    "newest",
    "title",
    "price-asc",
    "price-desc",
    "rating",
  ];
  const initialSort = ((): SortBy => {
    const v = defaults?.sortBy ?? (searchParams?.get("sort") as SortBy | null);
    return v && allowedSort.includes(v) ? v : "newest";
  })();
  const [sortBy, setSortBy] = useState<SortBy>(initialSort);

  useEffect(() => {
    const current = searchParams?.toString() ?? "";
    const params = new URLSearchParams(current);
    if (searchQuery) params.set("q", searchQuery);
    else params.delete("q");
    if (selectedCategory) params.set("category", selectedCategory);
    else params.delete("category");
    if (sortBy) params.set("sort", sortBy);
    else params.delete("sort");
    const next = params.toString();
    if (next !== current) {
      router.replace(`?${next}`, { scroll: false });
    }
  }, [router, searchParams, searchQuery, selectedCategory, sortBy]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
  };
}
