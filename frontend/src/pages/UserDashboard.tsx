import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Layers, PlusCircle, ExternalLink, Calendar, CreditCard, Sparkles, Download, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { UserDashboardSkeleton } from '@/components/skeleton/Skeleton';
import { handleImageError, categoryFallbacks, defaultImage } from '@/lib/imageFallback';
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

  const handleDownloadReceipt = (don: any) => {
    const campaignTitle = don.campaign?.title || don.Campaign?.title || `Campaign #${don.campaignId}`;
    const text = `================================================
          FUNDRISE DONATION RECEIPT
================================================
Receipt ID:     ${don.paymentId || 'pay_demo_' + don.id}
Order ID:       ${don.orderId || 'order_demo_' + don.id}
Beneficiary:    ${campaignTitle}
Amount Donated: ₹${Number(don.amount).toLocaleString()}
Payment Status: 100% SUCCEEDED (VERIFIED)
Date & Time:    ${new Date(don.createdAt).toLocaleString()}
================================================
Thank you for supporting community fundraisers!
FundRise Crowdfunding Platform - https://fundrise.org
================================================`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FundRise_Receipt_${don.paymentId || don.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Welcome header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">Welcome back, {user?.name || 'Member'}!</h1>
            <p className="text-text-secondary text-sm mt-1">{user?.email} • Member account</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/demo-payment"
              className="inline-flex items-center gap-1.5 bg-surface border border-primary/30 text-primary px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/5 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-primary" /> Test Demo Payment
            </Link>
            <Link
              to="/create-campaign"
              className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-600 active:scale-[0.98] transition-all shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> Start New Campaign
            </Link>
          </div>
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

        {loading ? (
          <UserDashboardSkeleton />
        ) : (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              <div className="bg-surface rounded-2xl p-6 border border-border/50 shadow-sm">
                <div className="flex items-center justify-between text-text-secondary text-sm mb-2">
                  <span>Total Raised by You</span>
                  <span className="font-bold text-lg text-primary select-none">₹</span>
                </div>
                <p className="font-display text-2xl font-bold text-primary">₹{totalRaised.toLocaleString()}</p>
              </div>

              <div className="bg-surface rounded-2xl p-6 border border-border/50 shadow-sm">
                <div className="flex items-center justify-between text-text-secondary text-sm mb-2">
                  <span>Total Contributed</span>
                  <Heart className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="font-display text-2xl font-bold text-emerald-600">₹{totalDonated.toLocaleString()}</p>
              </div>

              <div className="bg-surface rounded-2xl p-6 border border-border/50 shadow-sm">
                <div className="flex items-center justify-between text-text-secondary text-sm mb-2">
                  <span>Your Campaigns</span>
                  <Layers className="w-5 h-5 text-info" />
                </div>
                <p className="font-display text-2xl font-bold text-text">{myCampaigns.length}</p>
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

              {myCampaigns.length === 0 ? (
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
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 relative">
                          <img
                            src={camp.image || categoryFallbacks[camp.category?.toLowerCase()] || defaultImage}
                            alt={camp.title}
                            referrerPolicy="no-referrer"
                            onError={(e) => handleImageError(e, camp.category, camp.title)}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Link to={`/campaign/${camp.id}`} className="font-semibold text-base sm:text-lg hover:text-primary transition-colors">
                              {camp.title}
                            </Link>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              camp.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                              camp.status === 'Pending' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' : 'bg-slate-500/10 text-slate-600 border border-slate-500/20'
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
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center">
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
          </>
        )}

        {/* My Donations List */}
        <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border/50 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-semibold text-xl">Donation History</h2>
              <p className="text-xs text-text-secondary mt-0.5">Records of all verified contributions you have made</p>
            </div>
            <Link
              to="/demo-payment"
              className="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-1"
            >
              + Make New Donation
            </Link>
          </div>

          {myDonations.length === 0 ? (
            <div className="text-center py-10 text-text-secondary border border-dashed border-border/50 rounded-xl">
              <CreditCard className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-text">No donations recorded yet</p>
              <p className="text-xs text-text-secondary mt-1">Support an active campaign or try the test payment portal.</p>
              <Link
                to="/demo-payment"
                className="mt-3 inline-block bg-primary text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Try Demo Payment
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {myDonations.map((don) => {
                const camp = don.campaign || don.Campaign;
                const campaignTitle = camp?.title || `Campaign #${don.campaignId}`;
                const campImage = camp?.image || categoryFallbacks[camp?.category?.toLowerCase()] || defaultImage;

                return (
                  <div key={don.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                        <img
                          src={campImage}
                          alt={campaignTitle}
                          referrerPolicy="no-referrer"
                          onError={(e) => handleImageError(e, camp?.category, campaignTitle)}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/campaign/${don.campaignId}`}
                            className="font-semibold text-sm hover:text-primary transition-colors line-clamp-1"
                          >
                            {campaignTitle}
                          </Link>
                          {camp?.category && (
                            <span className="capitalize text-[11px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full hidden sm:inline-block">
                              {camp.category}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-text-secondary mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> {new Date(don.createdAt).toLocaleDateString()}
                          </span>
                          <span className="font-mono text-[11px] text-text-secondary truncate max-w-[150px]">
                            {don.paymentId || 'pay_demo_' + don.id}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 self-stretch sm:self-auto pt-2 sm:pt-0 border-t sm:border-0 border-border/30">
                      <div className="text-left sm:text-right">
                        <p className="font-bold text-emerald-600 text-base">₹{Number(don.amount).toLocaleString()}</p>
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Succeeded
                        </span>
                      </div>
                      <button
                        onClick={() => handleDownloadReceipt(don)}
                        title="Download Receipt"
                        className="inline-flex items-center gap-1 text-xs border border-border/60 hover:border-primary px-3 py-1.5 rounded-lg text-text hover:text-primary transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Receipt</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;