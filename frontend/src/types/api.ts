export interface Opportunity {
  id: string;
  title: string;
  solicitationNumber?: string;
  department: string;
  agency: string;
  postedDate: string;
  responseDeadline?: string;
  description: string;
  status: string;
  type: string;
  value?: number;
}

export interface SpendingRecord {
  award_id: string | null;
  recipient_name: string | null;
  total_obligation: number | null;
  description: string | null;
  award_type: string | null;
  awarding_agency_name: string | null;
  funding_agency_name: string | null;
  period_of_performance_start_date: string | null;
  period_of_performance_current_end_date: string | null;
  period_of_performance_end_date: string | null;
  place_of_performance_city: string | null;
  place_of_performance_state: string | null;
  place_of_performance_zip5: string | null;
}

export interface SearchFilters {
  start_date: string;
  end_date: string;
  keyword: string;
  award_type: string;
  agency: string;
  min_amount?: number;
  max_amount?: number;
  sort: string;
  order: 'asc' | 'desc';
  page: number;
  limit: number;
}
