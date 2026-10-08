import React, { useEffect, useState } from 'react';
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
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadAdminData = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const [statsRes, pendingRes, usersRes] = await Promise.allSettled([
        api.get('/admin/stats'),
        api.get('/admin/pending-campaigns'),
        api.get('/admin/users'),
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
    } catch (err: any) {
      toast(err.response?.data?.message || 'Error approving campaign');
    }
  };

  const rejectCampaign = async (campaignId: number) => {
    const reason = window.prompt('Enter rejection reason:') || 'Does not meet guidelines';
    try {
      await api.put(`/admin/campaigns/${campaignId}/reject`, { reason });
      toast('Campaign rejected');
      setPendingCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
      setPendingApprovals((p) => Math.max(0, p - 1));
    } catch (err: any) {
      toast(err.response?.data?.message || 'Error rejecting campaign');
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

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <Shield className="w-4 h-4" /> Administration Center
            </div>
            <h1 className="font-display text-3xl font-bold mt-1">Platform Overview & Moderation</h1>
          </div>
          <button
            onClick={loadAdminData}
            disabled={loading}
            className="text-sm bg-surface border border-border/50 px-4 py-2 rounded-lg font-medium hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Data
          </button>
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

        {/* Pending Approvals */}
        <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border/50 shadow-sm mb-8">
          <h2 className="font-display font-semibold text-xl mb-4">
            Campaigns Awaiting Review ({pendingCampaigns.length})
          </h2>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="py-4 border-b border-border/40 space-y-2">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              ))}
            </div>
          ) : pendingCampaigns.length === 0 ? (
            <div className="text-center py-10 text-text-secondary text-sm">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              All campaigns reviewed! No pending approvals.
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {pendingCampaigns.map((camp) => (
                <div key={camp.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-base">{camp.title}</h3>
                    <p className="text-sm text-text-secondary mt-0.5">{camp.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-text-secondary">
                      <span className="capitalize font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
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
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 text-xs font-semibold hover:bg-red-200 active:scale-95 transition-all cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                </div>
              ))}
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
                <thead className="border-b border-border/40 text-text-secondary text-xs uppercase">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 px-4 font-medium">
                        <div>{u.name}</div>
                        <div className="text-xs text-text-secondary">{u.email}</div>
                      </td>
                      <td className="py-3.5 px-4 capitalize">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          u.role === 'admin' ? 'bg-secondary/15 text-secondary' : 'bg-slate-100 dark:bg-slate-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {u.isBlocked ? (
                          <span className="text-red-600 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded text-xs font-medium">
                            Blocked
                          </span>
                        ) : (
                          <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded text-xs font-medium">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => toggleUserBlock(u.id)}
                            className={`text-xs px-3 py-1 rounded font-medium active:scale-95 transition-all cursor-pointer ${
                              u.isBlocked
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-red-50 text-red-600 hover:bg-red-100'
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