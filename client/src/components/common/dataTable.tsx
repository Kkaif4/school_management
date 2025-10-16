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
    role?: string;
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
      {/* Loading and Empty States (Unchanged) */}
      {loading && (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      )}
      {!loading && data.length === 0 && (
        <div className="text-center py-10">
          {emptyState || 'No data available'}
        </div>
      )}

      {/* Data List */}
      {!loading && data.length > 0 && (
        <div className="space-y-3">
          {/* Column Headers */}
          <div className="p-4 bg-gray-50 rounded-xl mb-2 last:mb-0 flex justify-between items-center">
            <div className="col-span-4 text-sm font-medium text-gray-600">
              Name
            </div>
            {actions && (
              <div className="col-span-3 text-sm font-medium text-gray-600 text-right">
                Actions
              </div>
            )}
          </div>

          {/* Data Rows */}
          <ul className="space-y-3">
            {data.map((item) => (
              <li
                key={item._id}
                className="p-4 hover:bg-gray-50 transition-colors rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-12 gap-y-4 md:gap-4 items-center">
                {/* --- Column 1: Name + Badges --- */}
                <div className="md:col-span-4">
                  <div className="font-medium text-gray-900">
                    {capitalize(item.firstName || item.name)}{' '}
                    {capitalize(item.lastName)}
                  </div>
                  {/* Badges container */}
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
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
                    {item.rollNumber !== undefined && (
                      <span className="text-xs text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">
                        Roll: {item.rollNumber}
                      </span>
                    )}
                    {item.grade !== undefined && (
                      <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                        Grade {item.grade}
                      </span>
                    )}
                    {item.division && (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        Division {item.division}
                      </span>
                    )}
                  </div>
                </div>

                {/* --- Column 2: Email --- */}
                <div className="md:col-span-3">
                  {item.email ? (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="inline-block h-3.5 w-3.5 text-gray-400 mr-1.5 flex-shrink-0" />
                      <span className="truncate">{item.email}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </div>

                {/* --- Column 3: Role --- */}
                <div className="md:col-span-2">
                  {item.role ? (
                    <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full">
                      {capitalize(item.role)}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </div>

                {/* --- Column 4: Actions --- */}
                {actions && (
                  <div className="md:col-span-3 flex flex-wrap gap-2 items-center justify-start md:justify-end">
                    {actions.map((action, idx) => (
                      <Button
                        key={idx}
                        size="sm"
                        variant={action.variant || 'default'}
                        onClick={() => action.onClick(item)}
                        disabled={action.disabled?.(item)}
                        // Responsive button width
                        className="w-full sm:w-auto">
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
        </div>
      )}
    </div>
  );
}

function capitalize(str?: string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
