import React from 'react';

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
            src={userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
            alt={userName}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80';
            }}
            className="w-8 h-8 rounded-full object-cover bg-slate-100 dark:bg-slate-800"
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