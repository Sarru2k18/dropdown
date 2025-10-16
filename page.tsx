'use client'
import { useState,useEffect, use } from "react";

interface Application {
  name: string;
  url: string;
}
type Environment = 'QA' | 'UAT' | 'DEV' | 'PROD';
export default function Home() {
  const [environment, setEnvironment] = useState<Environment | ''>('');
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const handleEnvironmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEnvironment(e.target.value as Environment);
  };

  const TransformUrl = (originalUrl: string, environment: Environment): string => {
    if (environment === 'PROD') {
      return originalUrl;
    }

    const urlParts = originalUrl.split('www.');
    if (urlParts.length >= 2) {
      switch (environment) {
        case 'QA':
          return `${urlParts[0]}www.tst-${urlParts.slice(1).join('.')}`;
        case 'UAT':
          return `${urlParts[0]}www.stg-${urlParts.slice(1).join('.')}`;
        case 'DEV':
          return `${urlParts[0]}www.dev-${urlParts.slice(1).join('.')}`;
        default:
          return originalUrl;
      }
    }
    return originalUrl;
  }

  useEffect(() => {
    fetch('/applications-url.json')
      .then(response => response.json())
      .then(data => {
        setApplications(data.applications);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching applications:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="font-sans p-6">
      <div className="border-double border-2 text-black py-4 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center">Application Environment URLs</h1>
          <p className="text-l text-center mt-2 text-gray-600">Select an environment to view application URLs</p>
        </div>
      </div>
      <div className=" pt-2 pb-2">
        <label className="block text-l font-medium text-gray-700 ">
          Select Environment:
          <select 
          value={environment} 
          onChange={handleEnvironmentChange}
          className="ml-4 p-2 border border-gray-300 rounded">
            <option value="">--Choose an option--</option>
            <option value="QA">QA</option>
            <option value="UAT">UAT</option>
            <option value="DEV">DEV</option>
            <option value="PROD">PROD</option>
          </select>
        </label>
      </div>
      {environment && !loading && (
      <div className="">
        <table className="min-w-full bg-white border border-gray-300 table-fixed">
          <colgroup>
            <col className="w-2/6" />
            <col className="w-4/6" />
          </colgroup>
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-r border-gray-300 text-left">Application Name</th>
              <th className="py-2 px-4 border-b border-gray-300 text-left">URL</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b border-r border-gray-300">{app.name}</td>
                <td className="py-2 px-4 border-b border-gray-300">
                  <a  href={TransformUrl(app.url, environment)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {`${TransformUrl(app.url, environment)}`}
                  </a>
                </td>
              </tr>
            ))} 
          </tbody>
        </table>
      </div>
      )}
        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      {!environment && !loading && (
          <div className="text-center py-12 bg-white rounded-lg">
            <div className="text-gray-500">
              </div>
          </div>
        )}
    </div>
  );
}
