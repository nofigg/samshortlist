export default function ProfilePage() {

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Business Profile</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Company Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter company name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">CAGE Code</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter CAGE code"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">DUNS Number</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter DUNS number"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Capabilities</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Primary NAICS Codes</label>
                <select multiple className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option>541330 - Engineering Services</option>
                  <option>541511 - Custom Computer Programming</option>
                  <option>541512 - Computer Systems Design Services</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Certifications</label>
                <div className="mt-2 space-y-2">
                  <label className="inline-flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"/>
                    <span className="ml-2">8(a) Program Participant</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"/>
                    <span className="ml-2">HUBZone Certified</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"/>
                    <span className="ml-2">Service-Disabled Veteran-Owned</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Capability Statement</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Capability Statement (PDF)</label>
            <input
              type="file"
              accept=".pdf"
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
