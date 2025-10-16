export const RequiredLabel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <label className="text-sm text-gray-600 mb-1 block">
      {children} <span className="text-red-500">*</span>
    </label>
  );
};
