import type { Dispatch, SetStateAction } from "react";
import type { SortBy } from "@/lib/sort";

export interface ProductQueryState {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  selectedCategory: string;
  setSelectedCategory: Dispatch<SetStateAction<string>>;
  sortBy: SortBy;
  setSortBy: Dispatch<SetStateAction<SortBy>>;
}


