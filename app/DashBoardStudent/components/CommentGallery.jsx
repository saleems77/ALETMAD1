'use client';
import CommentCard from './CommentCard';
import VideoPreview from './VideoPreview';

const CommentGallery = ({ comments, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {comments.map(comment => (
        comment.type === 'audio' ? (
          <CommentCard 
            key={comment.id} 
            comment={comment} 
            onDelete={onDelete}
          />
        ) : (
          <VideoPreview
            key={comment.id}
            videoUrl={comment.url}
            onDelete={() => onDelete(comment.id)}
          />
        )
      ))}
    </div>
  );
};

export default CommentGallery;