'use client';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function EmptyState({ 
  icon, 
  title, 
  description, 
  iconColor = '#999999',
  titleColor = '#0D1012',
  descriptionColor = '#999999' 
}) {
  return (
    <div className="flex flex-col items-center text-center p-8 space-y-4">
      <div className="flex items-center justify-center">
        {icon || <ExclamationCircleIcon className="w-16 h-16" style={{ color: iconColor }} />}
      </div>
      <h3 className="text-xl font-medium" style={{ color: titleColor }}>
        {title}
      </h3>
      <p className="text-sm max-w-xs mx-auto" style={{ color: descriptionColor }}>
        {description}
      </p>
    </div>
  );
}
