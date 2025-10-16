import { LucideIcon } from 'lucide-react';
import { useRef } from 'react';

// EntityHeader.tsx
export interface EntityHeaderAction {
  label: string;
  icon?: LucideIcon;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  isFileUpload?: boolean;
  accept?: string;
  onFileSelect?: (file: File) => void;
}

interface EntityHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: EntityHeaderAction[];
}

export default function EntityHeader({
  title,
  description,
  icon: Icon,
  actions = [],
}: EntityHeaderProps) {
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          {Icon && <Icon className="h-6 w-6 text-indigo-600" />}
          {title}
        </h2>
        {description && <p className="text-gray-500 mt-1">{description}</p>}
      </div>

      <div className="flex gap-3">
        {actions.map((action, idx) => {
          if (action.isFileUpload) {
            return (
              <div key={idx}>
                <input
                  type="file"
                  accept={action.accept}
                  ref={(el) => (fileInputRefs.current[idx] = el)}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && action.onFileSelect) action.onFileSelect(file);
                    if (e.target) e.target.value = '';
                  }}
                />
                <button
                  onClick={() => fileInputRefs.current[idx]?.click()}
                  className={`bg-gray-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors flex items-center gap-2 shadow-sm hover:shadow-md ${
                    action.variant === 'secondary'
                      ? 'bg-gray-600 hover:bg-gray-700'
                      : ''
                  }`}>
                  {action.icon && <action.icon className="h-4 w-4" />}
                  {action.label}
                </button>
              </div>
            );
          }

          return (
            <button
              key={idx}
              onClick={action.onClick}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm hover:shadow-md ${
                action.variant === 'primary'
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : action.variant === 'secondary'
                  ? 'bg-gray-600 text-white hover:bg-gray-700'
                  : action.variant === 'destructive'
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : ''
              }`}>
              {action.icon && <action.icon className="h-4 w-4" />}
              {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
