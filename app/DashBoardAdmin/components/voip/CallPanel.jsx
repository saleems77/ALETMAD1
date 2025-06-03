import { FaPhone, FaMicrophone, FaVolumeUp } from 'react-icons/fa';
import useVoIPStore from './useVoIPStore';
import WaveformVisualizer from './WaveformVisualizer'; // أضف هذا الاستيراد

export function CallPanel() {
  const { startCall, endCall, isMuted, toggleMute } = useVoIPStore();
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-center gap-4 mb-4">
        <span className="text-2xl font-bold">+966 50 123 4567</span>
        <span className="badge badge-success">متصلة</span>
      </div>

      <div className="flex justify-center gap-6">
        <button 
          onClick={toggleMute}
          className={`btn btn-circle ${isMuted ? 'btn-error' : 'btn-primary'}`}
        >
          <FaMicrophone size={24} />
        </button>

        <button 
          onClick={endCall}
          className="btn btn-circle btn-error"
        >
          <FaPhone size={24} />
        </button>

        <button className="btn btn-circle btn-primary">
          <FaVolumeUp size={24} />
        </button>
      </div>

      <WaveformVisualizer />
    </div>
  );
}
export default CallPanel;