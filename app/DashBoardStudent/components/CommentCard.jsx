'use client';
import { FiPlay, FiPause, FiTrash2, FiHeadphones } from 'react-icons/fi';

const CommentCard = ({ comment, isPlaying, onPlay, onDelete, waveformId }) => {
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
        <div className="flex items-center gap-2 text-gray-600">
          {comment.type === 'audio' ? (
            <FiHeadphones className="text-blue-500" />
          ) : (
            <span className="text-purple-500">🎥</span>
          )}
          <span className="text-sm">{formatDuration(comment.duration)}</span>
        </div>
        <button 
          onClick={() => onDelete(comment.id)}
          className="text-red-500 hover:text-red-700"
        >
          <FiTrash2 />
        </button>
      </div>

      <div className="relative h-40">
        {comment.type === 'audio' ? (
          <>
            <div id={waveformId} className="h-full" />
            <button
              onClick={() => onPlay(comment.id, 'audio')}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              {isPlaying ? (
                <FiPause className="w-8 h-8 text-white bg-blue-500 rounded-full p-2 shadow-lg" />
              ) : (
                <FiPlay className="w-8 h-8 text-white bg-blue-500 rounded-full p-2 shadow-lg" />
              )}
            </button>
          </>
        ) : (
          <video 
            src={comment.url}
            className="w-full h-full object-cover"
            controls
          />
        )}
      </div>

      <div className="p-4 text-sm text-gray-500">
        {new Date(comment.timestamp).toLocaleDateString('ar-SA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
    </div>
  );
};

export default CommentCard;