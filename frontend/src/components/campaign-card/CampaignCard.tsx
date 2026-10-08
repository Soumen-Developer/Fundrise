import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Clock, CheckCircle } from 'lucide-react';
import ProgressBar from '@/components/progress-bar/ProgressBar';

interface CampaignCardProps {
  id?: number | string;
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  backersCount: number;
  daysLeft: number | string;
  category: string;
  image: string;
  isVerified?: boolean;
  onDonate?: () => void;
}

const categoryFallbacks: Record<string, string> = {
  education: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
  medical: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
  startup: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80',
  environment: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
  creative: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80',
  social: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb9?w=800&auto=format&fit=crop&q=80',
};

const defaultFallback = 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb9?w=800&auto=format&fit=crop&q=80';

const CampaignCard: React.FC<CampaignCardProps> = ({
  id,
  title,
  description,
  goalAmount,
  raisedAmount,
  backersCount,
  daysLeft,
  category,
  image,
  isVerified = false,
  onDonate,
}) => {
  const percentage = goalAmount > 0 ? (raisedAmount / goalAmount) * 100 : 0;
  const targetLink = id ? `/campaign/${id}` : '#';
  const fallback = categoryFallbacks[category?.toLowerCase()] || defaultFallback;

  return (
    <div className="group rounded-2xl overflow-hidden border border-border/50 bg-surface shadow-sm hover:shadow-md transition-all flex flex-col h-full">
      {/* Image Banner */}
      <Link to={targetLink} className="relative h-48 overflow-hidden block bg-slate-100 dark:bg-slate-800">
        <img
          src={image || fallback}
          alt={title}
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            if (target.src !== fallback) {
              target.src = fallback;
            }
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="capitalize px-2.5 py-1 text-xs font-semibold rounded-full bg-white/90 text-text shadow-sm dark:bg-slate-900/90">
            {category}
          </span>
          {isVerified && (
            <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500 text-white shadow-sm">
              <CheckCircle className="w-3 h-3" /> Verified
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link to={targetLink}>
            <h3 className="font-display font-bold text-lg text-text group-hover:text-primary transition-colors line-clamp-1">
              {title}
            </h3>
          </Link>
          <p className="text-text-secondary text-sm line-clamp-2 mt-2 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="mt-5 space-y-3">
          <ProgressBar percentage={percentage} />

          <div className="flex items-center justify-between text-xs text-text-secondary">
            <div>
              <span className="font-bold text-text text-sm">₹{Number(raisedAmount).toLocaleString()}</span>
              <span> of ₹{Number(goalAmount).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 font-medium">
              <Users className="w-3.5 h-3.5" />
              <span>{backersCount} backers</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
            <span className="text-text-secondary flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {daysLeft} days left
            </span>
            <Link
              to={targetLink}
              className="font-semibold text-primary hover:text-primary-dark transition-colors"
            >
              View Campaign →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;