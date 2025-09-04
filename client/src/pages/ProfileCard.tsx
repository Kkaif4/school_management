import React from 'react';
import { User } from 'lucide-react';

interface User {
  name: string;
  email: string;
  role: string;
}

interface ProfileCardProps {
  user: User;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  const getRoleStyles = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800';
      case 'admin':
        return 'bg-gradient-to-r from-red-100 to-orange-100 text-red-800';
      case 'sub_admin':
        return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800';
      default:
        return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-elegant border border-purple-primary/20 h-full">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <User className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              Your Profile
            </h3>
            <p className="text-sm text-slate-500">
              Account information and settings
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        <div className="py-3 px-4">
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Full Name
          </label>
          <p className="text-slate-800 font-medium">{user.name}</p>
        </div>

        <div className="py-3 px-4">
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Email Address
          </label>
          <p className="text-slate-800 font-medium">{user.email}</p>
        </div>

        <div className="py-3 px-4">
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Role
          </label>
          <span
            className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleStyles(
              user.role
            )}`}>
            {user.role.split('_').join(' ').toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};
