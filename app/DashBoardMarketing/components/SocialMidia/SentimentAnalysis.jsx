// src/components/SentimentAnalysis.jsx
const SentimentAnalysis = ({ content }) => {
    const [result, setResult] = useState(null);
  
    useEffect(() => {
      // محاكاة طلب API لتحليل المشاعر
      setTimeout(() => {
        setResult(Math.random() > 0.5 ? 'positive' : 'negative');
      }, 1000);
    }, [content]);
  
    return (
      <div className={`sentiment-result ${result}`}>
        {result === 'positive' ? '👍 إيجابي' : '👎 سلبي'}
      </div>
    );
  };
  
  export default SentimentAnalysis;