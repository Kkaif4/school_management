import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import HomeContent from '@/components/school/HomeContent';
import { School } from '@/types/school';
import { schoolAPI } from '@/lib/api';
import Students from '@/components/student/Students';
import Teachers from '@/components/teachers/Teachers';

const Dashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchoolData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await schoolAPI.getSchoolById(id);
      setSchool(response.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch school data');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSchoolData();
  }, [fetchSchoolData]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={logout}
      />

      <div className="flex-1 flex flex-col">
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600 hover:text-gray-900">
            ☰
          </button>
          <h1 className="text-lg font-semibold">
            Welcome, {user?.name || 'Admin'}
          </h1>
        </header>

        <main className="p-6 flex-1">
          {activeTab === 'home' && (
            <>
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-lg">Loading school data...</div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  <p className="font-medium">Error loading data:</p>
                  <p>{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                    Retry
                  </button>
                </div>
              ) : school ? (
                <HomeContent school={school} />
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
                  <p>No school found in database.</p>
                  <p className="text-sm mt-1">
                    Please contact your administrator to add school data.
                  </p>
                </div>
              )}
            </>
          )}

          {activeTab === 'students' && <Students schoolId={id!} />}
          {activeTab === 'teachers' && <Teachers schoolId={id!} />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
