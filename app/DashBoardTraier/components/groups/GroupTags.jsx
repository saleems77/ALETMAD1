export default function GroupTags({ tags }) {
    const getTagColor = (tag) => {
      const colors = {
        'React': 'bg-blue-100 text-blue-800',
        'Node.js': 'bg-green-100 text-green-800',
        'TypeScript': 'bg-purple-100 text-purple-800',
        'default': 'bg-gray-100 text-gray-800'
      };
      return colors[tag] || colors.default;
    };
  
    return (
      <div className="flex flex-wrap gap-2 mt-4">
        {tags.map((tag, index) => (
          <span
            key={index}
            className={`px-3 py-1 rounded-full text-sm ${getTagColor(tag)}`}
          >
            #{tag}
          </span>
        ))}
      </div>
    );
  }