import React, { useEffect, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import CampaignCard from '@/components/campaign-card/CampaignCard';
import { CampaignCardSkeleton } from '@/components/skeleton/Skeleton';
import api from '@/lib/api';

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'education', label: 'Education' },
  { value: 'medical', label: 'Medical' },
  { value: 'social', label: 'Social' },
  { value: 'environment', label: 'Environment' },
  { value: 'startup', label: 'Startup' },
  { value: 'creative', label: 'Creative' },
];

const ExplorePage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const params: any = { sort };
      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      if (search.trim()) {
        params.search = search.trim();
      }

      const res = await api.get('/campaigns', { params });
      if (res.data?.success) {
        setCampaigns(res.data.campaigns || []);
      }
    } catch (err) {
      console.warn('Failed to load campaigns, using default view:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [selectedCategory, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCampaigns();
  };

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="font-display text-4xl font-extrabold mb-3">Explore Campaigns</h1>
          <p className="text-text-secondary text-base">
            Discover verified fundraising causes, support passionate founders, and lend a helping hand.
          </p>
        </div>

        {/* Filter / Search Bar */}
        <div className="bg-surface rounded-2xl p-4 border border-border/50 shadow-sm mb-10 flex flex-col md:flex-row items-center gap-4">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Search by title, beneficiary, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-border/50 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </form>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-2.5 px-3 rounded-xl border border-border/50 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="py-2.5 px-3 rounded-xl border border-border/50 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="newest">Newest First</option>
              <option value="most_funded">Most Funded</option>
              <option value="ending_soon">Ending Soon</option>
            </select>
          </div>
        </div>

        {/* Campaign List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <CampaignCardSkeleton key={n} />
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-2xl border border-border/50 p-8">
            <SlidersHorizontal className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-1">No campaigns found</h3>
            <p className="text-sm text-text-secondary">Try adjusting your search criteria or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((camp) => (
              <CampaignCard
                key={camp.id}
                id={camp.id}
                title={camp.title}
                description={camp.description}
                goalAmount={camp.goalAmount}
                raisedAmount={camp.raisedAmount}
                backersCount={camp.backersCount}
                daysLeft={Math.max(
                  0,
                  Math.ceil((new Date(camp.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) || 14
                )}
                category={camp.category}
                image={camp.image}
                isVerified={camp.isVerified}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;