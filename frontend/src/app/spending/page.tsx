'use client';

import { useState } from 'react';
import { SearchFilters as FilterType, SpendingRecord } from '@/types/api';
import SearchFilters from '@/components/SearchFilters';
import SpendingTable from '@/components/SpendingTable';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function SpendingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [records, setRecords] = useState<SpendingRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleFilterChange = async (filters: FilterType) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/spending?${new URLSearchParams({
        ...filters,
        page: String(filters.page),
        limit: String(filters.limit),
      })}`);

      if (!response.ok) {
        throw new Error(`Error fetching spending data: ${response.statusText}`);
      }

      const data = await response.json();
      setRecords(data.records);
      setTotalPages(Math.ceil(data.total / filters.limit));
      setCurrentPage(filters.page);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unexpected error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    handleFilterChange({
      start_date: '',
      end_date: '',
      keyword: '',
      award_type: '',
      agency: '',
      sort: 'total_obligation',
      order: 'desc',
      page,
      limit: 10,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Federal Spending Records</h1>
      
      <ErrorBoundary>
        <div className="space-y-6">
          <SearchFilters
            onFilterChange={handleFilterChange}
            loading={loading}
          />

          <SpendingTable
            records={records}
            loading={loading}
            error={error || undefined}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </ErrorBoundary>
    </div>
  );
}
