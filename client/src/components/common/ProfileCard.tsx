import React from "react";
import { User } from "lucide-react";

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
      case "super_admin":
        return "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800";
      case "admin":
        return "bg-gradient-to-r from-red-100 to-orange-100 text-red-800";
      case "sub_admin":
        return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800";
      default:
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6 hover:shadow-xl transition-all duration-300">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-1">Your Profile</h3>
        <p className="text-slate-500 text-sm">
          Account information and settings
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-50 rounded-xl p-4">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Full Name
          </label>
          <p className="text-slate-800 font-semibold">{user.name}</p>
        </div>

        <div className="bg-slate-50 rounded-xl p-4">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Email Address
          </label>
          <p className="text-slate-800 font-medium">{user.email}</p>
        </div>

        <div className="bg-slate-50 rounded-xl p-4">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Access Level
          </label>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getRoleStyles(
              user.role
            )}`}
          >
            {user.role?.replace("_", " ").toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};
