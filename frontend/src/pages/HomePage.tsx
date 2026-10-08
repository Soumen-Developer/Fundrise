import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Eye, CheckCircle2 } from 'lucide-react';
import CampaignCard from '@/components/campaign-card/CampaignCard';
import { CampaignCardSkeleton } from '@/components/skeleton/Skeleton';
import api from '@/lib/api';

const defaultFeatured = [
  {
    id: 1,
    title: 'Education for Underprivileged Children',
    description: 'Providing school kits, books, and digital tablets to 100 children in remote villages.',
    goalAmount: 50000,
    raisedAmount: 35200,
    backersCount: 47,
    deadline: '2026-11-15',
    category: 'education',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    isVerified: true,
  },
  {
    id: 2,
    title: 'Critical Surgery Fund for Aarav',
    description: 'Urgent medical assistance needed for a 6-year old child battling chronic liver disease.',
    goalAmount: 200000,
    raisedAmount: 145000,
    backersCount: 112,
    deadline: '2026-10-30',
    category: 'medical',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
    isVerified: true,
  },
  {
    id: 3,
    title: 'Clean Drinking Water for Rural Schools',
    description: 'Installing solar-powered reverse osmosis water filtration plants in drought-hit regions.',
    goalAmount: 75000,
    raisedAmount: 75000,
    backersCount: 88,
    deadline: '2026-12-01',
    category: 'social',
    image: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=800&auto=format&fit=crop&q=80',
    isVerified: true,
  },
];

const categories = [
  { id: 'all', label: 'All Causes' },
  { id: 'education', label: 'Education' },
  { id: 'medical', label: 'Medical' },
  { id: 'social', label: 'Social Cause' },
  { id: 'environment', label: 'Environment' },
  { id: 'startup', label: 'Startups' },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<any[]>(defaultFeatured);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const res = await api.get('/campaigns?limit=6');
        if (res.data?.success && res.data?.campaigns?.length > 0) {
          setCampaigns(res.data.campaigns);
        }
      } catch (e) {
        // Keeps default featured campaigns
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const filtered = selectedCategory === 'all'
    ? campaigns
    : campaigns.filter((c) => c.category === selectedCategory);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/15 text-primary-dark dark:text-primary px-4 py-1.5 rounded-full text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" /> India's Most Transparent Crowdfunding Platform
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Small Contributions.<br />
            <span className="text-primary">Life-Changing Impact.</span>
          </h1>

          <p className="text-text-secondary text-lg sm:text-xl max-w-2xl mx-auto mt-6 leading-relaxed">
            Support genuine campaigns for medical emergencies, rural education, social welfare, and climate action. 100% verified with direct bank transfers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <button
              onClick={() => navigate('/create-campaign')}
              className="w-full sm:w-auto bg-primary text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-primary-dark transition-all shadow-md hover:shadow-lg"
            >
              Start a Campaign Free
            </button>
            <button
              onClick={() => navigate('/explore')}
              className="w-full sm:w-auto bg-surface border border-border/60 text-text font-semibold px-8 py-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Explore All Campaigns
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-16 pt-10 border-t border-border/40 text-left">
            <div>
              <p className="font-display text-2xl font-bold text-primary">₹1.2 Cr+</p>
              <p className="text-xs text-text-secondary mt-0.5">Funds Mobilized</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-emerald-600">100%</p>
              <p className="text-xs text-text-secondary mt-0.5">Verified Medical Bills</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-info">2,400+</p>
              <p className="text-xs text-text-secondary mt-0.5">Active Donors</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-secondary">0%</p>
              <p className="text-xs text-text-secondary mt-0.5">Platform Setup Fee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Campaigns Section */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Trending Fundraisers
            </span>
            <h2 className="font-display text-3xl font-bold mt-1">Featured Causes Needing Your Help</h2>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-primary font-semibold text-sm hover:underline"
          >
            Browse all campaigns <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface border border-border/60 text-text hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Campaign Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [1, 2, 3].map((n) => <CampaignCardSkeleton key={n} />)
          ) : (
            filtered.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                id={campaign.id}
                title={campaign.title}
                description={campaign.description}
                goalAmount={campaign.goalAmount}
                raisedAmount={campaign.raisedAmount}
                backersCount={campaign.backersCount}
                daysLeft={Math.max(
                  0,
                  Math.ceil((new Date(campaign.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) || 14
                )}
                category={campaign.category}
                image={campaign.image}
                isVerified={campaign.isVerified}
              />
            ))
          )}
        </div>
      </section>

      {/* How it Works Banner */}
      <section className="bg-slate-50 dark:bg-slate-900/40 py-16 border-y border-border/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl font-bold">How FundRise Works</h2>
            <p className="text-text-secondary text-sm mt-2">
              Three simple steps to make a measurable difference in someone's life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface p-8 rounded-2xl border border-border/50 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mx-auto mb-4">
                1
              </div>
              <h3 className="font-bold text-lg mb-2">Create Your Fundraiser</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Fill out the 3-minute form with patient details, bills, or project milestones.
              </p>
            </div>

            <div className="bg-surface p-8 rounded-2xl border border-border/50 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mx-auto mb-4">
                2
              </div>
              <h3 className="font-bold text-lg mb-2">Admin Verification</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Our moderation team audits invoices and identity proofs before marking the cause verified.
              </p>
            </div>

            <div className="bg-surface p-8 rounded-2xl border border-border/50 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mx-auto mb-4">
                3
              </div>
              <h3 className="font-bold text-lg mb-2">Receive Contributions</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Supporters donate via secure Razorpay checkout, and funds disburse directly to beneficiaries.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;