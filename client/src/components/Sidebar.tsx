import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';

export const Sidebar = () => {
  const { hasRole, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold">School Management</h2>
      </div>

      <nav className="space-y-2">
        <Link
          href="/dashboard"
          className="block px-4 py-2 hover:bg-gray-700 rounded">
          Dashboard
        </Link>

        {/* Admin only links */}
        {hasRole(['ADMIN']) && (
          <>
            <Link
              href="/schools"
              className="block px-4 py-2 hover:bg-gray-700 rounded">
              Manage Schools
            </Link>
            <Link
              href="/sub-admins"
              className="block px-4 py-2 hover:bg-gray-700 rounded">
              Manage Sub Admins
            </Link>
          </>
        )}

        {/* Admin and Sub Admin links */}
        {hasRole(['ADMIN', 'SUB_ADMIN']) && (
          <>
            <Link
              href="/teachers"
              className="block px-4 py-2 hover:bg-gray-700 rounded">
              Manage Teachers
            </Link>
          </>
        )}

        {/* All roles have access */}
        <Link
          href="/students"
          className="block px-4 py-2 hover:bg-gray-700 rounded">
          Manage Students
        </Link>

        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded">
          Logout
        </button>
      </nav>
    </div>
  );
};
