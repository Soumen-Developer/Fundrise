import React from 'react';
import { User, MessageCircle, Clock } from 'lucide-react';

interface CommentProps {
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: Date | string;
}

const Comment: React.FC<CommentProps> = ({
  userName,
  userAvatar,
  text,
  createdAt,
}) => {
  const date = new Date(createdAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="border-b border-border/50 last:border-0 pb-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <img
            src={userAvatar}
            alt={userName}
            className="w-8 h-8 rounded-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-text">{userName}</p>
          <p className="text-text-small mt-0.5">{formattedDate}</p>
          <p className="mt-1 text-sm">{text}</p>
        </div>
      </div>
    </div>
  );
};

export default Comment;