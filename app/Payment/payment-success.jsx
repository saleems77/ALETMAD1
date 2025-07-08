import { useSearchParams } from 'next/navigation';

export default SuccessPage = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id'); // Example: /success?session_id=abc123

  return (
    <div>
      <h1>Payment Successful!</h1>
      {sessionId && <p>Session ID: {sessionId}</p>}
    </div>
  );
};