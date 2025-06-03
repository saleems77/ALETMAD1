export default function TranscriptViewer({ transcript }) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">السجل الأكاديمي</h1>
          <span className="text-gray-500">{transcript.date}</span>
        </div>
        
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: transcript.content }} />
        
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600">
            رقم السجل: {transcript.id}<br/>
            حالة السجل: {transcript.status || 'مفعل'}
          </p>
        </div>
      </div>
    );
  }