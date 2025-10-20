export interface ProductFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalProducts: number;
  filteredProducts: number;
}

export interface FilterState {
  category: string;
  sortBy: string;
  searchQuery: string;
}
