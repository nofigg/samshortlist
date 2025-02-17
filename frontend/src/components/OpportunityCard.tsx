import { Opportunity } from '../types/api';

interface Props {
  opportunity: Opportunity;
  onViewDetails: (id: string) => void;
}

export default function OpportunityCard({ opportunity, onViewDetails }: Props) {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold line-clamp-2">{opportunity.title}</h3>
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
          opportunity.status === 'active' 
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {opportunity.status}
        </span>
      </div>
      
      <div className="space-y-2 text-sm">
        <p><span className="font-medium">Department:</span> {opportunity.department}</p>
        <p><span className="font-medium">Agency:</span> {opportunity.agency}</p>
        {opportunity.solicitationNumber && (
          <p><span className="font-medium">Solicitation #:</span> {opportunity.solicitationNumber}</p>
        )}
        {opportunity.value && (
          <p><span className="font-medium">Value:</span> ${opportunity.value.toLocaleString()}</p>
        )}
        <p><span className="font-medium">Posted:</span> {new Date(opportunity.postedDate).toLocaleDateString()}</p>
        {opportunity.responseDeadline && (
          <p><span className="font-medium">Deadline:</span> {new Date(opportunity.responseDeadline).toLocaleDateString()}</p>
        )}
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-gray-600 line-clamp-3">{opportunity.description}</p>
      </div>
      
      <div className="mt-4 flex justify-end space-x-2">
        <button 
          onClick={() => onViewDetails(opportunity.id)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
