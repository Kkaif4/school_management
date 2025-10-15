'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { User } from '@/types/users';
import { userAPI } from '@/lib/api';
import { DataTable } from '../common/dataTable';
import { Eye, Plus, Trash2, Users } from 'lucide-react';
import WarningModal from '../ui/warning';
import EmptyState from '../common/EmptyState';
import AddUserModal from './AddUserModel';
import EntityHeader from '../common/CommonHeader';
import Filters from '../common/Filters';
import UserDetails from './UserDetails';
import { toast } from '@/components/ui/sonner';

interface UserProps {
  schoolId: string;
}

export default function UsersPage({ schoolId }: UserProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await userAPI.getUsers(schoolId);
      setUsers(response.data.data);
      toast('Users fetched successfully');
    } catch (err) {
      if (err) {
        setError(err.message || 'Failed to fetch users');
        toast.error(err.message || 'Failed to fetch users');
      }
    }
    setLoading(false);
  }, [schoolId]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filtering
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // Delete logic
  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setShowDeleteWarning(true);
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
  };

  const confirmDelete = async () => {
    if (!selectedUser?._id) return;
    try {
      await userAPI.deleteUser(selectedUser._id);
      fetchUsers();
      toast('User deleted successfully');
      setShowDeleteWarning(false);
      setSelectedUser(null);
    } catch (error) {
      if (error) {
        toast(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-red-500 bg-red-50 p-4 rounded-lg border border-red-200 max-w-md text-center">
          <p className="font-medium">Error loading users</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  const getHeaderActions = () => [
    {
      label: 'Add User',
      icon: Plus,
      variant: 'primary' as const,
      onClick: () => setIsFormOpen(true),
    },
  ];

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <EntityHeader
        title="Users"
        description="Manage user information"
        icon={Users}
        actions={getHeaderActions()}
      />

      <div className="mt-4 sm:mt-6">
        <Filters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Users List or Empty State */}
      <DataTable
        data={filteredUsers}
        actions={[
          {
            label: 'Details',
            icon: <Eye />,
            onClick: handleUserClick,
          },
          {
            label: 'Delete',
            icon: <Trash2 />,
            variant: 'destructive',
            onClick: handleDeleteUser,
          },
        ]}
        loading={loading}
        emptyState={
          <EmptyState
            hasData={users.length > 0}
            entityName="user"
            icon={<Users className="h-full w-full" />}
            onAdd={() => setIsFormOpen(true)}
          />
        }
      />

      {selectedUser && (
        <UserDetails
          user={selectedUser}
          isOpen={isDetailsOpen}
          onClose={handleCloseDetails}
        />
      )}

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        schoolId={schoolId}
        onSuccess={() => {
          setIsFormOpen(false);
          fetchUsers();
        }}
        onCancel={() => setIsFormOpen(false)}
      />

      {/* Delete Warning Modal */}
      <WarningModal
        isOpen={showDeleteWarning}
        onClose={() => {
          setShowDeleteWarning(false);
          setSelectedUser(null);
        }}
        onConfirm={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
