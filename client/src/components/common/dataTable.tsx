'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

export interface TableAction<T> {
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline';
  onClick: (item: T) => void;
  disabled?: (item: T) => boolean;
}

export interface DataTableProps<T = Record<string, unknown>> {
  data: T[];
  actions?: TableAction<T>[];
  loading?: boolean;
  emptyState?: React.ReactNode;
}

export function DataTable<
  T extends {
    _id: string;
    name?: string;
    email?: string;
    isActive?: boolean;
    firstName?: string;
    lastName?: string;
    grade?: number | string;
    division?: string;
    rollNumber?: number | string;
  }
>({ data, actions, loading, emptyState }: DataTableProps<T>) {
  return (
    <div className="w-full">
      {/* Loading State */}
      {loading && (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      )}

      {/* Empty State */}
      {!loading && data.length === 0 && (
        <div className="text-center py-10">
          {emptyState || 'No data available'}
        </div>
      )}

      {/* Data List */}
      {!loading && data.length > 0 && (
        <ul className="divide-y divide-gray-200">
          {/* Column Headers */}
          <li className="p-4 bg-gray-50 rounded-xl border border-gray-200 mb-2 last:mb-0 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Name</span>
            {actions && (
              <span className="text-sm font-medium text-gray-600">Actions</span>
            )}
          </li>

          {/* Data Rows */}
          {data.map((item) => (
            <li
              key={item._id}
              className="p-4 hover:bg-gray-50 transition-colors rounded-xl border border-gray-200 mb-2 last:mb-0 flex justify-between items-center">
              {/* Name + Badges */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="font-medium text-gray-900">
                  {capitalize(item.firstName || item.name)}{' '}
                  {capitalize(item.lastName)}
                </span>

                {/* Email */}
                {item.email && (
                  <div>
                    <Mail className="inline-block h-3 w-3 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">
                      {item['email']}
                    </span>
                  </div>
                )}

                {/* IsActive Badge */}
                {'isActive' in item && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      item['isActive']
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                    {item['isActive'] ? 'Active' : 'Inactive'}
                  </span>
                )}

                {/* Roll Number Badge */}
                {item.rollNumber !== undefined && (
                  <span className="text-xs text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">
                    Roll: {item.rollNumber}
                  </span>
                )}

                {/* Grade Badge */}
                {item.grade !== undefined && (
                  <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                    Grade {item.grade}
                  </span>
                )}

                {/* Division Badge */}
                {item.division && (
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    Division {item.division}
                  </span>
                )}
              </div>

              {/* Actions */}
              {actions && (
                <div className="flex gap-2 mt-2 sm:mt-0 flex-shrink-0">
                  {actions.map((action, idx) => (
                    <Button
                      key={idx}
                      size="sm"
                      variant={action.variant || 'default'}
                      onClick={() => action.onClick(item)}
                      disabled={action.disabled?.(item)}>
                      {action.icon && (
                        <span className="mr-1">{action.icon}</span>
                      )}
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function capitalize(str?: string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
