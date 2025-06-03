const LicenseBadge = ({ type }) => {
    const getBadgeStyle = () => {
      switch(type) {
        case 'premium':
          return 'bg-purple-100 text-purple-800';
        case 'educational':
          return 'bg-green-100 text-green-800';
        default:
          return 'bg-blue-100 text-blue-800';
      }
    };
  
    const getLabel = () => {
      switch(type) {
        case 'premium':
          return 'متميز';
        case 'educational':
          return 'تعليمي';
        default:
          return 'قياسي';
      }
    };
  
    return (
      <span className={`px-2 py-1 rounded-full text-sm ${getBadgeStyle()}`}>
        {getLabel()}
      </span>
    );
  };
  
  export default LicenseBadge;