'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getSchools } from '@/api/school';
import SchoolList from '@/components/common/School';
import { User } from 'lucide-react';

export default function Dashboard() {
  const { data, loading } = useAuth();
  const [schools, setSchools] = useState<any[]>([]);
  const [loadingSchools, setLoadingSchools] = useState(true);

  useEffect(() => {
    async function loadSchools() {
      try {
        const result = await getSchools();
        setSchools(result.schools);
        setLoadingSchools(false);
      } catch (error) {
        console.log('API getSchools error:', error);
        setLoadingSchools(false);
      }
    }
    loadSchools();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>

        {/* Profile menu */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700 font-medium">
            {data?.user.name}
          </span>
          <button className="p-2 rounded-full hover:bg-gray-100 transition">
            <User className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      <main className="p-6 space-y-8">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Your Profile
          </h2>
          <div className="space-y-3">
            <p className="text-gray-700">
              <span className="font-medium text-gray-900">Name:</span>{' '}
              <span className="text-indigo-600">{data?.user.name}</span>
            </p>
            <p className="text-gray-700">
              <span className="font-medium text-gray-900">Email:</span>{' '}
              <span className="text-indigo-600">{data?.user.email}</span>
            </p>
            <p className="text-gray-700">
              <span className="font-medium text-gray-900">Role:</span>{' '}
              <span
                className={`px-2 py-1 rounded-lg text-sm font-semibold
                ${
                  data?.user.role === 'super_admin'
                    ? 'bg-purple-100 text-purple-700'
                    : data?.user.role === 'admin'
                    ? 'bg-red-100 text-red-700'
                    : data?.user.role === 'sub_admin'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                {data?.user.role}
              </span>
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Your Schools
          </h2>
          {loadingSchools ? (
            <p className="text-gray-500">Loading schools...</p>
          ) : (
            <SchoolList schools={schools} />
          )}
        </div>
      </main>
    </div>
  );
}
