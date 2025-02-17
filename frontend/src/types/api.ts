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
  awardId: string;
  recipientName: string;
  awardAmount: number;
  description: string;
  awardType: string;
  fundingAgency: string;
  startDate?: string;
  endDate?: string;
}

export interface SearchFilters {
  startDate?: string;
  endDate?: string;
  keyword?: string;
  agency?: string;
  type?: string;
  page: number;
  limit: number;
}
