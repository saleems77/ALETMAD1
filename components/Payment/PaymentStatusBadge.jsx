const PaymentStatusBadge = ({ status }) => {
    const getStatusStyle = () => {
      switch(status.toLowerCase()) {
        case 'completed':
          return 'bg-green-100 text-green-800';
        case 'failed':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-yellow-100 text-yellow-800';
      }
    };
  
    return (
      <span className={`px-2 py-1 rounded-full text-sm ${getStatusStyle()}`}>
        {status}
      </span>
    );
  };
  
  export default PaymentStatusBadge;