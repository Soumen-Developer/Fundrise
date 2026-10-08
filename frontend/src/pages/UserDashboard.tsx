import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Heart, Layers, PlusCircle, ExternalLink, Calendar } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Skeleton } from '@/components/skeleton/Skeleton';
import api from '@/lib/api';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();

  const [myCampaigns, setMyCampaigns] = useState<any[]>([]);
  const [myDonations, setMyDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const [campsRes, donRes] = await Promise.allSettled([
        api.get('/campaigns?status=all'),
        api.get(`/donations/user/${user.id}`),
      ]);

      if (campsRes.status === 'fulfilled' && campsRes.value.data?.campaigns) {
        // Filter campaigns created by current user
        const userCampaigns = campsRes.value.data.campaigns.filter(
          (c: any) => c.creatorId === user.id || c.creator?.id === user.id
        );
        setMyCampaigns(userCampaigns);
      }

      if (donRes.status === 'fulfilled' && donRes.value.data?.donations) {
        setMyDonations(donRes.value.data.donations);
      }
    } catch (err) {
      console.warn('Failed to load user dashboard data:', err);
      setError('Unable to load some dashboard data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const totalRaised = myCampaigns.reduce((sum, c) => sum + Number(c.raisedAmount || 0), 0);
  const totalDonated = myDonations.reduce((sum, d) => sum + Number(d.amount || 0), 0);

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Welcome header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">Welcome back, {user?.name || 'Member'}!</h1>
            <p className="text-text-secondary text-sm mt-1">{user?.email} • Member account</p>
          </div>
          <Link
            to="/create-campaign"
            className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-600 active:scale-[0.98] transition-all shadow-sm self-start sm:self-auto cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Start New Campaign
          </Link>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 flex items-center justify-between gap-4">
            <p className="text-sm">{error}</p>
            <button
              onClick={fetchUserData}
              className="text-xs font-semibold underline hover:no-underline cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-surface rounded-2xl p-6 border border-border/50 shadow-sm">
            <div className="flex items-center justify-between text-text-secondary text-sm mb-2">
              <span>Total Raised by You</span>
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            {loading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <p className="font-display text-2xl font-bold text-primary">₹{totalRaised.toLocaleString()}</p>
            )}
          </div>

          <div className="bg-surface rounded-2xl p-6 border border-border/50 shadow-sm">
            <div className="flex items-center justify-between text-text-secondary text-sm mb-2">
              <span>Total Contributed</span>
              <Heart className="w-5 h-5 text-emerald-500" />
            </div>
            {loading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <p className="font-display text-2xl font-bold text-emerald-600">₹{totalDonated.toLocaleString()}</p>
            )}
          </div>

          <div className="bg-surface rounded-2xl p-6 border border-border/50 shadow-sm">
            <div className="flex items-center justify-between text-text-secondary text-sm mb-2">
              <span>Your Campaigns</span>
              <Layers className="w-5 h-5 text-info" />
            </div>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="font-display text-2xl font-bold text-text">{myCampaigns.length}</p>
            )}
          </div>
        </div>

        {/* My Campaigns List */}
        <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border/50 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-xl">My Campaigns</h2>
            <Link to="/create-campaign" className="text-sm text-primary font-medium hover:underline">
              + New Campaign
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="p-4 border border-border/40 rounded-xl space-y-2">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              ))}
            </div>
          ) : myCampaigns.length === 0 ? (
            <div className="text-center py-12 text-text-secondary border border-dashed border-border/50 rounded-xl">
              <Layers className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="font-medium text-base text-text">No campaigns created yet</p>
              <p className="text-sm text-text-secondary mt-1">Start a fundraiser to get financial support for your cause.</p>
              <Link
                to="/create-campaign"
                className="mt-4 inline-block bg-primary text-white text-xs font-semibold px-4 py-2 rounded-lg"
              >
                Create My First Campaign
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {myCampaigns.map((camp) => (
                <div key={camp.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Link to={`/campaign/${camp.id}`} className="font-semibold text-lg hover:text-primary transition-colors">
                        {camp.title}
                      </Link>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                        camp.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                        camp.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100'
                      }`}>
                        {camp.status}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary mt-1 line-clamp-1">{camp.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-text-secondary">
                      <span>Goal: ₹{Number(camp.goalAmount).toLocaleString()}</span>
                      <span>Raised: ₹{Number(camp.raisedAmount || 0).toLocaleString()}</span>
                      <span>Backers: {camp.backersCount || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/campaign/${camp.id}`}
                      className="inline-flex items-center gap-1 text-xs border border-border/50 px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                    >
                      View <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Donations List */}
        <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border/50 shadow-sm">
          <h2 className="font-display font-semibold text-xl mb-6">Donation History</h2>
          {myDonations.length === 0 ? (
            <p className="text-text-secondary text-sm">You haven't made any donations yet.</p>
          ) : (
            <div className="divide-y divide-border/40">
              {myDonations.map((don) => (
                <div key={don.id} className="py-3.5 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">
                      Donation to {don.campaign?.title || `Campaign #${don.campaignId}`}
                    </p>
                    <p className="text-xs text-text-secondary flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5" /> {new Date(don.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary text-base">₹{Number(don.amount).toLocaleString()}</p>
                    <span className="text-xs text-emerald-600 font-medium">Successful</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;