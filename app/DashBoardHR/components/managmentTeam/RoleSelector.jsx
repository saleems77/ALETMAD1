// RoleSelector.tsx
export default function RoleSelector({ value, onChange }) {
  const roleOptions = [
    { value: '', label: 'اختر دورًا' },
    { value: 'assistant', label: 'مساعد', roleId: 4 },
    { value: 'Employee', label: 'موظف', roleId: 5 },
    { value: 'Marketer', label: 'مسوق', roleId: 6 }
  ];

  return (
    <select 
      value={value}
      onChange={(e) => {
        const selectedValue = e.target.value;
        onChange(selectedValue);
      }}
      className="w-full pl-4 pr-12 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300"
    >
      {roleOptions.map((role) => (
        <option 
          key={role.value} 
          value={role.value}
          disabled={role.value === ''}
        >
          {role.label}
        </option>
      ))}
    </select>
  );
}