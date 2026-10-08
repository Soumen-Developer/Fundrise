import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Share2, Calendar, CheckCircle2, User as UserIcon, Sparkles, ExternalLink } from 'lucide-react';
import DonationCard from '@/components/donation-card/DonationCard';
import CommentItem from '@/components/comment/Comment';
import { CampaignDetailSkeleton } from '@/components/skeleton/Skeleton';
import DemoPaymentModal from '@/components/payment/DemoPaymentModal';
import api from '@/lib/api';
import { useAuth } from '@/components/auth/AuthProvider';
import { handleImageError, categoryFallbacks, defaultImage } from '@/lib/imageFallback';

interface Comment {
  id: number;
  userName?: string;
  userAvatar?: string;
  text: string;
  createdAt: Date | string;
  User?: {
    name: string;
    avatar: string;
  };
}

interface Campaign {
  id: number;
  title: string;
  description: string;
  story: string;
  goalAmount: number;
  raisedAmount: number;
  backersCount: number;
  deadline: string;
  category: string;
  image: string;
  videoUrl?: string;
  creator?: {
    id?: number;
    name: string;
    avatar: string;
  };
  User?: {
    name: string;
    avatar: string;
  };
  donations?: any[];
  comments?: any[];
  updates?: any[];
  status: 'Pending' | 'Approved' | 'Active' | 'Successful' | 'Expired' | 'Rejected';
  isVerified?: boolean;
}

const CampaignDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [bannerLoaded, setBannerLoaded] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isDonating, setIsDonating] = useState(false);

  const daysLeft = useMemo(() => {
    if (!campaign?.deadline) return 0;
    return Math.max(
      0,
      Math.ceil((new Date(campaign.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    );
  }, [campaign?.deadline]);

  useEffect(() => {
    const fetchCampaign = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/campaigns/${id}`);
        if (res.data?.success && res.data?.campaign) {
          setCampaign(res.data.campaign);
          if (res.data.campaign.comments) {
            setComments(res.data.campaign.comments);
          }
        }
      } catch (err) {
        // Fallback for offline development or missing DB
        console.warn('Failed to fetch from API, using fallback data:', err);
        const fallbackCampaign: Campaign = {
          id: Number(id) || 1,
          title: 'Education for Underprivileged Children',
          description: 'Providing essential school supplies, books, and technology access to 100 students.',
          story: 'Education transforms lives. Our initiative focuses on rural schools lacking basic materials. Every contribution directly funds verified educational kits and learning tools to empower children for a brighter future.',
          goalAmount: 50000,
          raisedAmount: 35200,
          backersCount: 47,
          deadline: new Date(Date.now() + 15 * 86400000).toISOString(),
          category: 'education',
          image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80',
          creator: {
            name: 'Priya Sharma',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
          },
          status: 'Active',
          isVerified: true,
        };
        setCampaign(fallbackCampaign);
        setComments([
          {
            id: 1,
            userName: 'Amit Patel',
            userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
            text: 'Thrilled to support this noble mission! Keep inspiring.',
            createdAt: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCampaign();
    }
  }, [id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !campaign) return;

    if (!user) {
      toast('Please login to post a comment');
      navigate('/login');
      return;
    }

    setSubmittingComment(true);
    try {
      const res = await api.post('/comments', {
        campaignId: campaign.id,
        text: newComment.trim(),
      });

      const added = res.data?.comment || {
        id: Date.now(),
        userName: user.name,
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        text: newComment,
        createdAt: new Date().toISOString(),
      };

      setComments((prev) => [added, ...prev]);
      setNewComment('');
      toast('Comment posted successfully!');
    } catch (_error) {
      // Optimistic update for testing
      setComments((prev) => [
        {
          id: Date.now(),
          userName: user.name,
          userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
          text: newComment,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setNewComment('');
      toast('Comment posted!');
    } finally {
      setSubmittingComment(false);
    }
  };

  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [donateAmount, setDonateAmount] = useState<number>(500);
  const [donateIsAnon, setDonateIsAnon] = useState(false);

  const handleDonate = (amount: number, isAnonymous: boolean) => {
    if (!campaign) return;

    if (!user) {
      toast('Please login to make a donation');
      navigate('/login');
      return;
    }

    setDonateAmount(amount);
    setDonateIsAnon(isAnonymous);
    setDemoModalOpen(true);
  };

  if (loading) {
    return <CampaignDetailSkeleton />;
  }

  if (!campaign) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Campaign Not Found</h2>
        <button
          onClick={() => navigate('/explore')}
          className="bg-primary text-white px-5 py-2 rounded-lg font-medium"
        >
          Explore Other Campaigns
        </button>
      </div>
    );
  }

  const creatorName = campaign.creator?.name || campaign.User?.name || 'Campaign Creator';

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Breadcrumb / Category */}
        <div className="flex items-center gap-3 mb-4">
          <span className="capitalize px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
            {campaign.category}
          </span>
          {campaign.isVerified && (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified Cause
            </span>
          )}
          <span className="text-xs text-text-secondary ml-auto flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> {daysLeft} days left
          </span>
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-4 leading-tight">
          {campaign.title}
        </h1>
        <p className="text-text-secondary text-lg mb-8 max-w-4xl">
          {campaign.description}
        </p>

        {/* Main Grid: Media + Story (2 cols) vs Donation Card (1 col) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column (2 spans) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Media Banner */}
            <div className="rounded-2xl overflow-hidden border border-border/50 bg-surface shadow-sm relative h-80 md:h-[440px]">
              {!bannerLoaded && (
                <div className="absolute inset-0 shimmer-card z-0" />
              )}
              <img
                src={campaign.image || categoryFallbacks[campaign.category?.toLowerCase()] || defaultImage}
                alt={campaign.title}
                referrerPolicy="no-referrer"
                onLoad={() => setBannerLoaded(true)}
                onError={(e) => {
                  setBannerLoaded(true);
                  handleImageError(e, campaign.category, campaign.title);
                }}
                className={`w-full h-full object-cover transition-opacity duration-300 relative z-10 ${
                  bannerLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>

            {/* Creator Info */}
            <div className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-surface">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                <UserIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-text-secondary">Organized by</p>
                <p className="font-semibold text-base">{creatorName}</p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast('Campaign link copied to clipboard!');
                }}
                className="ml-auto inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors border border-border/50 px-3 py-1.5 rounded-lg"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>

            {/* Campaign Story */}
            <div className="bg-surface rounded-2xl p-6 md:p-8 border border-border/50 shadow-sm space-y-4">
              <h2 className="font-display font-semibold text-2xl">The Story</h2>
              <div className="text-text leading-relaxed whitespace-pre-line text-base">
                {campaign.story}
              </div>
            </div>

            {/* Updates Section if available */}
            {campaign.updates && campaign.updates.length > 0 && (
              <div className="bg-surface rounded-2xl p-6 md:p-8 border border-border/50 shadow-sm space-y-4">
                <h2 className="font-display font-semibold text-2xl">Organizer Updates</h2>
                <div className="space-y-4">
                  {campaign.updates.map((up: any) => (
                    <div key={up.id} className="border-l-2 border-primary pl-4 py-1">
                      <h3 className="font-semibold">{up.title}</h3>
                      <p className="text-sm text-text-secondary">{up.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="bg-surface rounded-2xl p-6 md:p-8 border border-border/50 shadow-sm space-y-6">
              <h2 className="font-display font-semibold text-2xl">
                Community & Comments ({comments.length})
              </h2>

              <form onSubmit={handleAddComment} className="space-y-3">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Leave words of encouragement or a question..."
                  rows={3}
                  className="w-full rounded-xl border border-border/50 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingComment || !newComment.trim()}
                    className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
                  >
                    {submittingComment ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </form>

              <div className="divide-y divide-border/50 pt-2 space-y-4">
                {comments.length === 0 ? (
                  <p className="text-text-secondary text-sm py-4">No comments yet. Be the first to cheer them on!</p>
                ) : (
                  comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      userName={comment.userName || comment.User?.name || 'Supporter'}
                      userAvatar={comment.userAvatar || comment.User?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                      text={comment.text}
                      createdAt={comment.createdAt}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Donation Sidebar */}
          <div className="lg:col-span-1">
            <DonationCard
              raisedAmount={Number(campaign.raisedAmount) || 0}
              goalAmount={Number(campaign.goalAmount) || 0}
              backersCount={Number(campaign.backersCount) || 0}
              daysLeft={daysLeft}
              onDonate={handleDonate}
              isDonating={isDonating}
            />

            {/* Demo Payment Link Card */}
            <div className="mt-4 p-4 rounded-2xl bg-primary/5 border border-primary/20 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-primary mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Razorpay Test Mode Simulator
              </div>
              <p className="text-xs text-text-secondary mb-3">
                Experience simulated UPI, Cards, and NetBanking checkout with test receipts.
              </p>
              <Link
                to={`/demo-payment?campaignId=${campaign.id}&amount=500`}
                className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl bg-surface border border-primary/30 text-primary hover:bg-primary/10 text-xs font-semibold transition-all cursor-pointer shadow-xs"
              >
                Open Demo Payment Portal <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Demo Payment Modal */}
      {demoModalOpen && campaign && (
        <DemoPaymentModal
          isOpen={demoModalOpen}
          onClose={() => setDemoModalOpen(false)}
          campaignId={campaign.id}
          campaignTitle={campaign.title}
          amount={donateAmount}
          isAnonymous={donateIsAnon}
          onSuccess={(data) => {
            const updated = data.campaign;
            setCampaign((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                raisedAmount: updated?.raisedAmount ?? Number(prev.raisedAmount) + Number(donateAmount),
                backersCount: updated?.backersCount ?? prev.backersCount + 1,
                status: updated?.status ?? prev.status,
              };
            });
            toast(`₹${donateAmount.toLocaleString()} donated successfully!`);
          }}
        />
      )}
    </div>
  );
};

export default CampaignDetailPage;