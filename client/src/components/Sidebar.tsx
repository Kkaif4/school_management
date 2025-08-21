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

        {hasRole(['super_admin']) && (
          <Link
            href="/users"
            className="block px-4 py-2 hover:bg-gray-700 rounded">
            Users
          </Link>
        )}

        {hasRole(['admin', 'super_admin']) && (
          <Link
            href="/schools"
            className="block px-4 py-2 hover:bg-gray-700 rounded">
            Schools
          </Link>
        )}

        <Link
          href="/teachers"
          className="block px-4 py-2 hover:bg-gray-700 rounded">
          Teachers
        </Link>

        <Link
          href="/students"
          className="block px-4 py-2 hover:bg-gray-700 rounded">
          Students
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
