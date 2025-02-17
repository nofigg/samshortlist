import { auth } from "@clerk/nextjs";

export default async function OpportunitiesPage() {
  const { userId } = auth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Subcontracting Opportunities</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Opportunity cards will be populated here */}
        <div className="border rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold">Sample Opportunity</h3>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Active</span>
          </div>
          
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Agency:</span> Department of Defense</p>
            <p><span className="font-medium">NAICS:</span> 541330</p>
            <p><span className="font-medium">Value:</span> $500,000</p>
            <p><span className="font-medium">Deadline:</span> March 1, 2025</p>
          </div>
          
          <div className="mt-4 flex justify-end space-x-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              View Details
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">NAICS Code</label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option>All NAICS</option>
              <option>541330 - Engineering Services</option>
              <option>541511 - Custom Computer Programming</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Agency</label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option>All Agencies</option>
              <option>Department of Defense</option>
              <option>Department of Energy</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option>All Status</option>
              <option>Active</option>
              <option>Upcoming</option>
              <option>Closed</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
