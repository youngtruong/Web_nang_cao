import { useCallback, useEffect, useMemo, useState } from 'react';

export interface UsePaginationResult<T> {
  currentPage: number;
  totalPages: number;
  currentItems: T[];
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
}

export const usePagination = <T>(data: T[], itemsPerPage: number): UsePaginationResult<T> => {
  const pageSize = Number.isFinite(itemsPerPage) && itemsPerPage > 0
    ? Math.floor(itemsPerPage)
    : 1;
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const [page, setPage] = useState(1);
  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
    setPage((previousPage) => Math.min(previousPage, totalPages));
  }, [totalPages]);

  const goToPage = useCallback(
    (page: number) => {
      const safePage = Number.isFinite(page) ? Math.trunc(page) : 1;
      setPage(Math.min(Math.max(safePage, 1), totalPages));
    },
    [totalPages],
  );

  const nextPage = useCallback(() => {
    setPage((previousPage) => Math.min(previousPage + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setPage((previousPage) => Math.max(previousPage - 1, 1));
  }, []);

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [currentPage, data, pageSize]);

  return { currentPage, totalPages, currentItems, nextPage, prevPage, goToPage };
};
