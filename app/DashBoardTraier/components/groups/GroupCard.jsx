'use client';
import Image from 'next/image';
import GroupTags from './GroupTags';
import GroupActions from './GroupActions';

export default function GroupCard({ group }) {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative h-48">
        <Image
          src={group.avatar}
          alt={group.name}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{group.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{group.description}</p>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            {group.members} عضو
          </span>
          <span className={`text-sm ${group.isPrivate ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'} px-3 py-1 rounded-full`}>
            {group.isPrivate ? 'خاص' : 'عام'}
          </span>
        </div>
        
        <GroupTags tags={group.tags} />
        <GroupActions groupId={group.id} />
      </div>
    </div>
  );
}