import { useState } from 'react';
import { SearchFilters as FilterType } from '../types/api';

interface Props {
  onFilterChange: (filters: FilterType) => void;
  loading?: boolean;
}

const AWARD_TYPES = [
  { value: 'A', label: 'Contracts' },
  { value: 'B', label: 'Purchase Orders' },
  { value: 'C', label: 'Delivery Orders' },
  { value: 'D', label: 'Definitive Contracts' },
];

const SORT_OPTIONS = [
  { value: 'total_obligation', label: 'Award Amount' },
  { value: 'period_of_performance_start_date', label: 'Start Date' },
  { value: 'recipient_name', label: 'Recipient Name' },
];

export default function SearchFilters({ onFilterChange, loading }: Props) {
  const [filters, setFilters] = useState<FilterType>({
    start_date: '',
    end_date: '',
    keyword: '',
    agency: '',
    award_type: '',
    page: 1,
    limit: 10,
    sort: 'total_obligation',
    order: 'desc'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = { 
      ...filters, 
      [name]: name.includes('amount') ? Number(value) || undefined : value,
      page: 1 // Reset to first page on filter change
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            name="start_date"
            value={filters.start_date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={loading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            name="end_date"
            value={filters.end_date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Keyword</label>
          <input
            type="text"
            name="keyword"
            value={filters.keyword}
            onChange={handleChange}
            placeholder="Search by keyword..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Award Type</label>
          <select
            name="award_type"
            value={filters.award_type}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={loading}
          >
            <option value="">All Types</option>
            {AWARD_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Agency</label>
          <input
            type="text"
            name="agency"
            value={filters.agency}
            onChange={handleChange}
            placeholder="Filter by agency..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Min Amount</label>
          <input
            type="number"
            name="min_amount"
            value={filters.min_amount || ''}
            onChange={handleChange}
            placeholder="Minimum amount"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Max Amount</label>
          <input
            type="number"
            name="max_amount"
            value={filters.max_amount || ''}
            onChange={handleChange}
            placeholder="Maximum amount"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Sort By</label>
          <select
            name="sort"
            value={filters.sort}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={loading}
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Sort Order</label>
          <select
            name="order"
            value={filters.order}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={loading}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>
    </div>
  );
}
