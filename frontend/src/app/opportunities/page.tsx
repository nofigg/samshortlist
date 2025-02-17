"use client";

import { useState, useEffect } from 'react';
import SearchFilters from '@/components/SearchFilters';
import OpportunityCard from '@/components/OpportunityCard';
import SpendingTable from '@/components/SpendingTable';
import { fetchOpportunities, fetchSpendingData } from '@/services/api';
import { Opportunity, SpendingRecord, SearchFilters as FilterType } from '@/types/api';

export default function OpportunitiesPage() {
  const [activeTab, setActiveTab] = useState<'opportunities' | 'spending'>('opportunities');
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [spendingRecords, setSpendingRecords] = useState<SpendingRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterType>({
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'opportunities') {
          const data = await fetchOpportunities(filters);
          setOpportunities(data);
        } else {
          const data = await fetchSpendingData(filters);
          setSpendingRecords(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, activeTab]);

  const handleFilterChange = (newFilters: FilterType) => {
    setFilters(newFilters);
  };

  const handleViewDetails = (id: string) => {
    // Implement view details logic
    console.log('View details for:', id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Federal Opportunities & Spending</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'opportunities'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Opportunities
          </button>
          <button
            onClick={() => setActiveTab('spending')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'spending'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Spending Data
          </button>
        </div>
      </div>

      <SearchFilters onFilterChange={handleFilterChange} loading={loading} />

      {activeTab === 'opportunities' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-gray-100 rounded-lg"></div>
              </div>
            ))
          ) : (
            opportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                onViewDetails={handleViewDetails}
              />
            ))
          )}
        </div>
      ) : (
        <SpendingTable records={spendingRecords} loading={loading} />
      )}
      <div>TEST</div>
    </div>
  );
}
