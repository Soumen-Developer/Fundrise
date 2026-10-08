import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Clock, CheckCircle } from 'lucide-react';
import ProgressBar from '@/components/progress-bar/ProgressBar';
import { handleImageError, categoryFallbacks, defaultImage } from '@/lib/imageFallback';

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
  const [imageLoaded, setImageLoaded] = useState(false);
  const percentage = goalAmount > 0 ? (raisedAmount / goalAmount) * 100 : 0;
  const targetLink = id ? `/campaign/${id}` : '#';
  const fallback = categoryFallbacks[category?.toLowerCase()] || defaultImage;

  return (
    <div className="group rounded-2xl overflow-hidden border border-border/50 bg-surface shadow-sm hover:shadow-md transition-all flex flex-col h-full">
      {/* Image Banner */}
      <Link to={targetLink} className="relative h-48 overflow-hidden block bg-slate-100 dark:bg-slate-800">
        {!imageLoaded && (
          <div className="absolute inset-0 shimmer-card z-0" />
        )}
        <img
          src={image || fallback}
          alt={title}
          referrerPolicy="no-referrer"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            setImageLoaded(true);
            handleImageError(e, category, title);
          }}
          className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-300 relative z-10 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex items-center gap-2 z-20">
          <span className="capitalize px-3 py-1 text-xs font-semibold rounded-full bg-slate-900/85 text-white shadow-md backdrop-blur-md border border-white/20">
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
            <div className="flex items-center gap-2.5">
              <Link
                to={id ? `/demo-payment?campaignId=${id}&amount=500` : '/demo-payment'}
                className="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 transition-colors"
                title="Simulate donation via Demo Payment"
              >
                Donate
              </Link>
              <Link
                to={targetLink}
                className="font-semibold text-primary hover:text-primary-dark transition-colors"
              >
                View →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;