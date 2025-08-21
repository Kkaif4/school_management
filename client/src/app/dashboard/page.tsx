'use client';

import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Welcome to your Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Your Profile</h2>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Email:</span> {user?.email}
          </p>
          <p>
            <span className="font-medium">Role:</span> {user?.role}
          </p>
          {user?.schoolId && (
            <p>
              <span className="font-medium">School ID:</span> {user.schoolId}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
