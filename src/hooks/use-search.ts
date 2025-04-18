import { useState, useEffect } from "react";
import { useDebounce } from "./use-debounce";
import { SEARCH_DEBOUNCE_DELAY, SEARCH_MIN_LENGTH } from "@/constants";

interface UseSearchOptions<T> {
  initialData: T[];
  searchFields: (keyof T)[];
  minLength?: number;
  debounceDelay?: number;
}

export function useSearch<T>({
  initialData,
  searchFields,
  minLength = SEARCH_MIN_LENGTH,
  debounceDelay = SEARCH_DEBOUNCE_DELAY,
}: UseSearchOptions<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<T[]>(initialData);
  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);

  useEffect(() => {
    if (!debouncedSearchTerm || debouncedSearchTerm.length < minLength) {
      setFilteredData(initialData);
      return;
    }

    const searchResults = initialData.filter((item) =>
      searchFields.some((field) => {
        const value = item[field];
        if (typeof value === "string") {
          return value.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
        }
        return false;
      })
    );

    setFilteredData(searchResults);
  }, [debouncedSearchTerm, initialData, searchFields, minLength]);

  return {
    searchTerm,
    setSearchTerm,
    filteredData,
  };
} 