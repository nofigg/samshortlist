import { SearchFilters, Opportunity, SpendingRecord } from '../types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

export const fetchOpportunities = async (filters: SearchFilters): Promise<Opportunity[]> => {
  const queryParams = new URLSearchParams({
    posted_from: filters.startDate || '',
    posted_to: filters.endDate || '',
    limit: filters.limit.toString(),
    offset: ((filters.page - 1) * filters.limit).toString(),
  });

  const response = await fetch(`${API_BASE_URL}/opportunities?${queryParams}`);
  if (!response.ok) {
    throw new Error('Failed to fetch opportunities');
  }

  const data = await response.json();
  return data.sam_opportunities;
};

export const fetchSpendingData = async (filters: SearchFilters): Promise<SpendingRecord[]> => {
  const queryParams = new URLSearchParams({
    start_date: filters.startDate || '',
    end_date: filters.endDate || '',
    page: filters.page.toString(),
    limit: filters.limit.toString(),
  });

  const response = await fetch(`${API_BASE_URL}/spending?${queryParams}`);
  if (!response.ok) {
    throw new Error('Failed to fetch spending data');
  }

  const data = await response.json();
  return data.results;
};
