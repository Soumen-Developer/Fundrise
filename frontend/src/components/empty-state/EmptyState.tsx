import React from 'react';
import { Eye } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: IconComponent = Eye,
  title = 'No campaigns found',
  description = 'Start your first campaign to share your story.',
  ctaText = 'Create Campaign',
  ctaUrl = '/create-campaign',
}) => {
  return (
    <div className="flex flex-col items-center py-16 text-text-secondary text-center">
      {IconComponent && <IconComponent className="h-12 w-12 text-text/60 mb-4" />}
      <h3 className="font-display font-semibold text-lg mb-2">{title}</h3>
      <p className="text-base mb-6 max-w-md">{description}</p>
      {ctaText && ctaUrl && (
        <div>
          <a
            href={ctaUrl}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-medium inline-block"
          >
            {ctaText}
          </a>
        </div>
      )}
    </div>
  );
};

export default EmptyState;