import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import {
  Shield,
  Users,
  Layers,
  TrendingUp,
  CheckCircle,
  XCircle,
  Check,
  RefreshCw,
  AlertCircle,
  Tag,
  Trash2,
  ExternalLink,
  Search,
  Sparkles,
} from 'lucide-react';
import { Skeleton } from '@/components/skeleton/Skeleton';
import api from '@/lib/api';

const AdminDashboard: React.FC = () => {
  const { toast } = useToast();

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCampaigns, setTotalCampaigns] = useState(0);
  const [totalFundsRaised, setTotalFundsRaised] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState(0);

  const [campaignsByCategory, setCampaignsByCategory] = useState<any[]>([]);
  const [pendingCampaigns, setPendingCampaigns] = useState<any[]>([]);
  const [allCampaigns, setAllCampaigns] = useState<any[]>([]);
  const [campaignSearch, setCampaignSearch] = useState('');
  const [campaignStatusFilter, setCampaignStatusFilter] = useState<string>('all');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadAdminData = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const [statsRes, pendingRes, usersRes, allCampsRes] = await Promise.allSettled([
        api.get('/admin/stats'),
        api.get('/admin/pending-campaigns'),
        api.get('/admin/users'),
        api.get('/campaigns?status=all&limit=50'),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.data?.success) {
        const s = statsRes.value.data.stats;
        setTotalUsers(s.totalUsers || 0);
        setTotalCampaigns(s.totalCampaigns || 0);
        setTotalFundsRaised(s.totalFundsRaised || 0);
        setPendingApprovals(s.pendingCount || 0);
        if (s.campaignsByCategory) setCampaignsByCategory(s.campaignsByCategory);
      } else if (statsRes.status === 'rejected') {
        const err = statsRes.reason;
        setErrorMessage(err.response?.data?.message || 'Failed to load administrator statistics');
      }

      if (pendingRes.status === 'fulfilled' && pendingRes.value.data?.success) {
        setPendingCampaigns(pendingRes.value.data.campaigns || []);
      }

      if (usersRes.status === 'fulfilled' && usersRes.value.data?.success) {
        setUsers(usersRes.value.data.users || []);
      }

      if (allCampsRes.status === 'fulfilled' && allCampsRes.value.data?.campaigns) {
        setAllCampaigns(allCampsRes.value.data.campaigns || []);
      }
    } catch (err: any) {
      console.warn('Failed to load admin stats from server:', err);
      setErrorMessage('Network error while retrieving administrative data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const approveCampaign = async (campaignId: number) => {
    try {
      await api.put(`/admin/campaigns/${campaignId}/approve`);
      toast('Campaign approved and marked Active!');
      setPendingCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
      setPendingApprovals((p) => Math.max(0, p - 1));
      setAllCampaigns((prev) =>
        prev.map((c) => (c.id === campaignId ? { ...c, status: 'Active', isVerified: true } : c))
      );
    } catch (err: any) {
      toast(err.response?.data?.message || 'Error approving campaign');
    }
  };

  const rejectCampaign = async (campaignId: number) => {
    const reason = window.prompt('Enter rejection reason:') || 'Does not meet platform guidelines';
    try {
      await api.put(`/admin/campaigns/${campaignId}/reject`, { reason });
      toast('Campaign rejected');
      setPendingCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
      setPendingApprovals((p) => Math.max(0, p - 1));
      setAllCampaigns((prev) =>
        prev.map((c) => (c.id === campaignId ? { ...c, status: 'Rejected' } : c))
      );
    } catch (err: any) {
      toast(err.response?.data?.message || 'Error rejecting campaign');
    }
  };

  const deleteCampaign = async (campaignId: number, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      return;
    }
    try {
      await api.delete(`/campaigns/${campaignId}`);
      toast('Campaign deleted successfully');
      setAllCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
      setPendingCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
      setTotalCampaigns((t) => Math.max(0, t - 1));
    } catch (err: any) {
      toast(err.response?.data?.message || 'Error deleting campaign');
    }
  };

  const toggleUserBlock = async (userId: number) => {
    try {
      const res = await api.put(`/admin/users/${userId}/block`);
      const isBlocked = res.data?.user?.isBlocked;
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isBlocked: isBlocked ?? !u.isBlocked } : u))
      );
      toast(isBlocked ? 'User blocked' : 'User unblocked');
    } catch (err: any) {
      toast(err.response?.data?.message || 'Error toggling user block state');
    }
  };

  const filteredCampaigns = allCampaigns.filter((c) => {
    const matchesStatus =
      campaignStatusFilter === 'all' ||
      c.status?.toLowerCase() === campaignStatusFilter.toLowerCase();
    const query = campaignSearch.toLowerCase().trim();
    const matchesSearch =
      !query ||
      c.title?.toLowerCase().includes(query) ||
      c.creator?.name?.toLowerCase().includes(query) ||
      c.category?.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <Shield className="w-4 h-4" /> Administration Center
            </div>
            <h1 className="font-display text-3xl font-bold mt-1">Platform Overview & Moderation</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/demo-payment"
              className="text-sm bg-surface border border-primary/30 text-primary px-3.5 py-2 rounded-lg font-semibold hover:bg-primary/5 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" /> Test Demo Payment
            </Link>
            <button
              onClick={loadAdminData}
              disabled={loading}
              className="text-sm bg-surface border border-border/50 px-4 py-2 rounded-lg font-medium hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Data
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 flex items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{errorMessage}</p>
            </div>
            <button
              onClick={loadAdminData}
              className="text-xs font-semibold underline hover:no-underline cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-surface rounded-2xl p-6 border border-border/50 shadow-sm">
            <div className="flex items-center justify-between text-text-secondary text-sm mb-2">
              <span>Total Users</span>
              <Users className="w-4 h-4 text-primary" />
            </div>
            {loading ? (
              <Skeleton className="h-9 w-16" />
            ) : (
              <p className="font-display text-3xl font-bold text-text">{totalUsers}</p>
            )}
          </div>

          <div className="bg-surface rounded-2xl p-6 border border-border/50 shadow-sm">
            <div className="flex items-center justify-between text-text-secondary text-sm mb-2">
              <span>Total Campaigns</span>
              <Layers className="w-4 h-4 text-info" />
            </div>
            {loading ? (
              <Skeleton className="h-9 w-16" />
            ) : (
              <p className="font-display text-3xl font-bold text-text">{totalCampaigns}</p>
            )}
          </div>

          <div className="bg-surface rounded-2xl p-6 border border-border/50 shadow-sm">
            <div className="flex items-center justify-between text-text-secondary text-sm mb-2">
              <span>Total Funds Raised</span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            {loading ? (
              <Skeleton className="h-9 w-28" />
            ) : (
              <p className="font-display text-3xl font-bold text-emerald-600">
                ₹{Number(totalFundsRaised || 0).toLocaleString()}
              </p>
            )}
          </div>

          <div className="bg-surface rounded-2xl p-6 border border-border/50 shadow-sm">
            <div className="flex items-center justify-between text-text-secondary text-sm mb-2">
              <span>Pending Reviews</span>
              <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
            </div>
            {loading ? (
              <Skeleton className="h-9 w-12" />
            ) : (
              <p className="font-display text-3xl font-bold text-secondary">{pendingApprovals}</p>
            )}
          </div>
        </div>

        {/* Categories Distribution */}
        {campaignsByCategory.length > 0 && (
          <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border/50 shadow-sm mb-8">
            <h2 className="font-display font-semibold text-xl mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-primary" /> Campaigns by Category
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {campaignsByCategory.map((cat: any) => (
                <div
                  key={cat.category}
                  className="p-3.5 rounded-xl border border-border/50 bg-background/50 hover:border-primary/50 transition-colors"
                >
                  <span className="capitalize text-xs font-semibold text-primary block truncate">
                    {cat.category}
                  </span>
                  <div className="text-lg font-bold mt-1 text-text">{cat.count} campaigns</div>
                  <div className="text-xs text-text-secondary mt-0.5 truncate">
                    ₹{Number(cat.totalRaised || 0).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Approvals Section */}
        {pendingCampaigns.length > 0 && (
          <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-amber-500/30 shadow-sm mb-8">
            <h2 className="font-display font-semibold text-xl mb-4 flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              Campaigns Awaiting Review ({pendingCampaigns.length})
            </h2>

            <div className="divide-y divide-border/40">
              {pendingCampaigns.map((camp) => (
                <div key={camp.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-base">{camp.title}</h3>
                    <p className="text-sm text-text-secondary mt-0.5">{camp.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-text-secondary">
                      <span className="capitalize font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                        {camp.category}
                      </span>
                      <span>Goal: ₹{Number(camp.goalAmount).toLocaleString()}</span>
                      <span>By: {camp.creator?.name || 'Creator'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => approveCampaign(camp.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 active:scale-95 transition-all cursor-pointer shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => rejectCampaign(camp.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-500/10 text-red-600 border border-red-500/20 text-xs font-semibold hover:bg-red-500/20 active:scale-95 transition-all cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Platform Campaigns Table */}
        <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border/50 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-display font-semibold text-xl">Platform Campaigns ({allCampaigns.length})</h2>
              <p className="text-xs text-text-secondary mt-0.5">Live view and management of all active campaigns</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-text-secondary absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={campaignSearch}
                  onChange={(e) => setCampaignSearch(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border/60 bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary w-48 sm:w-60"
                />
              </div>

              <div className="flex items-center rounded-lg border border-border/50 p-0.5 bg-background text-xs">
                {['all', 'Active', 'Pending', 'Successful'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setCampaignStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-md font-medium capitalize transition-colors cursor-pointer ${
                      campaignStatusFilter === st
                        ? 'bg-primary text-white shadow-xs'
                        : 'text-text-secondary hover:text-text'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3 py-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="text-center py-10 text-text-secondary text-sm border border-dashed border-border/50 rounded-xl">
              <Layers className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              No campaigns found matching criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border/40 text-text-secondary text-xs uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">Campaign</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Raised / Goal</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredCampaigns.map((camp) => (
                    <tr key={camp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 px-4 font-medium max-w-xs">
                        <Link
                          to={`/campaign/${camp.id}`}
                          className="hover:text-primary transition-colors block truncate font-semibold"
                        >
                          {camp.title}
                        </Link>
                        <div className="text-xs text-text-secondary truncate mt-0.5">
                          By: {camp.creator?.name || 'Creator'} ({camp.creator?.email || 'N/A'})
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="capitalize px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                          {camp.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-emerald-600">
                          ₹{Number(camp.raisedAmount || 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-text-secondary">
                          of ₹{Number(camp.goalAmount).toLocaleString()} ({camp.backersCount || 0} backers)
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            camp.status === 'Active'
                              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                              : camp.status === 'Pending'
                              ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                              : camp.status === 'Successful'
                              ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20'
                              : 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20'
                          }`}
                        >
                          {camp.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/campaign/${camp.id}`}
                            className="inline-flex items-center gap-1 text-xs border border-border/50 px-2.5 py-1 rounded-lg text-text hover:text-primary hover:border-primary transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" /> View
                          </Link>
                          <Link
                            to={`/demo-payment?campaignId=${camp.id}&amount=500`}
                            className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-lg font-medium hover:bg-primary/20 transition-colors"
                          >
                            <Sparkles className="w-3 h-3" /> Donate
                          </Link>
                          {camp.status === 'Pending' && (
                            <button
                              onClick={() => approveCampaign(camp.id)}
                              className="inline-flex items-center gap-1 text-xs bg-emerald-600 text-white px-2.5 py-1 rounded-lg font-semibold hover:bg-emerald-700 transition-colors cursor-pointer"
                            >
                              <Check className="w-3 h-3" /> Approve
                            </button>
                          )}
                          <button
                            onClick={() => deleteCampaign(camp.id, camp.title)}
                            className="inline-flex items-center gap-1 text-xs text-red-600 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-lg font-medium hover:bg-red-500/20 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* User Management */}
        <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border/50 shadow-sm">
          <h2 className="font-display font-semibold text-xl mb-4">Registered Users ({users.length})</h2>
          {loading ? (
            <div className="space-y-3 py-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border/40 text-text-secondary text-xs uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-b border-border/30">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 px-4 font-medium">
                        <div className="text-text font-semibold">{u.name}</div>
                        <div className="text-xs text-text-secondary">{u.email}</div>
                      </td>
                      <td className="py-3.5 px-4 capitalize">
                        {u.role === 'admin' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                            User
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {u.isBlocked ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20">
                            Blocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => toggleUserBlock(u.id)}
                            className={`text-xs px-3 py-1 rounded-lg font-semibold active:scale-95 transition-all cursor-pointer border ${
                              u.isBlocked
                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                                : 'bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20'
                            }`}
                          >
                            {u.isBlocked ? 'Unblock' : 'Block'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;