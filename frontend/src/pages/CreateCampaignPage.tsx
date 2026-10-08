import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  PlusCircle,
  CreditCard,
} from 'lucide-react';
import Input from '@/components/input/Input';
import Button from '@/components/button/Button';
import api from '@/lib/api';

const categories = [
  { value: 'education', label: 'Education' },
  { value: 'medical', label: 'Medical Emergency' },
  { value: 'startup', label: 'Startup & Innovation' },
  { value: 'creative', label: 'Creative Project' },
  { value: 'social', label: 'Social Cause' },
  { value: 'environment', label: 'Environment' },
  { value: 'other', label: 'Other' },
];

const CreateCampaignPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdCampaign, setCreatedCampaign] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'education',
    story: '',
    image: '',
    videoUrl: '',
    goalAmount: '50000',
    deadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
  });

  // Restore draft if available
  useEffect(() => {
    const saved = localStorage.getItem('fundrise_campaign_draft');
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // Save draft on edit
  const updateForm = (fields: Partial<typeof formData>) => {
    setErrorMessage(null);
    const next = { ...formData, ...fields };
    setFormData(next);
    localStorage.setItem('fundrise_campaign_draft', JSON.stringify(next));
  };

  const handleNext = () => {
    setErrorMessage(null);
    if (step === 1) {
      if (!formData.title.trim()) {
        const msg = 'Please enter a campaign title';
        setErrorMessage(msg);
        toast(msg);
        return;
      }
      if (!formData.description.trim()) {
        const msg = 'Please enter a short description';
        setErrorMessage(msg);
        toast(msg);
        return;
      }
    }
    if (step === 2) {
      if (!formData.story.trim()) {
        const msg = 'Please tell your campaign story';
        setErrorMessage(msg);
        toast(msg);
        return;
      }
    }
    setStep((s) => Math.min(s + 1, 3));
  };

  const handleSubmit = async () => {
    setErrorMessage(null);
    const goal = parseFloat(formData.goalAmount);
    if (!goal || goal <= 0) {
      const msg = 'Please enter a valid goal amount';
      setErrorMessage(msg);
      toast(msg);
      return;
    }
    if (!formData.deadline) {
      const msg = 'Please select a deadline date';
      setErrorMessage(msg);
      toast(msg);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        story: formData.story.trim(),
        image: formData.image.trim() || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&auto=format&fit=crop&q=80',
        videoUrl: formData.videoUrl.trim() || '',
        goalAmount: goal,
        deadline: new Date(formData.deadline).toISOString(),
      };

      const res = await api.post('/campaigns', payload);
      if (res.data?.success) {
        toast('Campaign created successfully! Published and live.');
        localStorage.removeItem('fundrise_campaign_draft');
        setCreatedCampaign(res.data.campaign);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        toast('Campaign submitted for review!');
        navigate('/explore');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Error creating campaign';
      setErrorMessage(errorMsg);
      toast(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    if (!createdCampaign) return;
    const url = `${window.location.origin}/campaign/${createdCampaign.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast('Campaign URL copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetForm = () => {
    setCreatedCampaign(null);
    setStep(1);
    setFormData({
      title: '',
      description: '',
      category: 'education',
      story: '',
      image: '',
      videoUrl: '',
      goalAmount: '50000',
      deadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    });
  };

  if (createdCampaign) {
    return (
      <div className="py-12">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-surface rounded-3xl p-8 sm:p-10 border border-border/60 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-300">
            {/* Celebration Badge */}
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-3.5 py-1 rounded-full">
                Campaign Published Successfully
              </span>
              <h1 className="font-display text-3xl font-extrabold text-text mt-3">
                Your Fundraiser is Live! 🎉
              </h1>
              <p className="text-sm text-text-secondary mt-2">
                Your campaign has been published and is immediately discoverable. Donors can start making contributions right away.
              </p>
            </div>

            {/* Campaign Summary Card */}
            <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-border/50 text-left space-y-3">
              <div className="flex items-center gap-3">
                {createdCampaign.image && (
                  <img
                    src={createdCampaign.image}
                    alt={createdCampaign.title}
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                  />
                )}
                <div>
                  <h3 className="font-bold text-base text-text line-clamp-1">{createdCampaign.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="capitalize text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                      {createdCampaign.category}
                    </span>
                    <span className="text-xs text-text-secondary">
                      Goal: <strong className="text-text font-bold">₹{Number(createdCampaign.goalAmount).toLocaleString()}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Shareable Link Box */}
              <div className="pt-2 border-t border-border/40">
                <label className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider block mb-1">
                  Shareable Campaign URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/campaign/${createdCampaign.id}`}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-border/60 bg-background font-mono text-text select-all"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface border border-border/60 text-xs font-semibold hover:border-primary text-text hover:text-primary transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to={`/campaign/${createdCampaign.id}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-white hover:bg-emerald-600 text-xs font-semibold transition-all shadow-md active:scale-95"
                >
                  View Live Campaign <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to={`/demo-payment?campaignId=${createdCampaign.id}&amount=500`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 text-xs font-semibold transition-all active:scale-95"
                >
                  <CreditCard className="w-3.5 h-3.5" /> Test Demo Payment
                </Link>
              </div>

              <div className="flex justify-between items-center pt-2 text-xs">
                <Link
                  to="/dashboard"
                  className="text-text-secondary hover:text-primary font-medium transition-colors"
                >
                  ← Go to Creator Dashboard
                </Link>
                <button
                  onClick={handleResetForm}
                  className="text-primary font-semibold hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Create Another Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
            Launch Your Fundraiser
          </span>
          <h1 className="font-display text-3xl font-bold mt-3">Start a Fundraising Campaign</h1>
          <p className="text-text-secondary mt-1 text-sm">
            Reach thousands of potential donors with verified transparency
          </p>
        </div>

        {/* Stepper Progress */}
        <div className="flex items-center justify-between max-w-xl mx-auto mb-10">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                step >= 1 ? 'bg-primary text-white' : 'bg-slate-200 text-text-secondary'
              }`}
            >
              1
            </div>
            <span className="text-xs mt-1 font-medium">Basic Info</span>
          </div>
          <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-primary' : 'bg-slate-200'}`} />
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                step >= 2 ? 'bg-primary text-white' : 'bg-slate-200 text-text-secondary'
              }`}
            >
              2
            </div>
            <span className="text-xs mt-1 font-medium">Story & Media</span>
          </div>
          <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-primary' : 'bg-slate-200'}`} />
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                step >= 3 ? 'bg-primary text-white' : 'bg-slate-200 text-text-secondary'
              }`}
            >
              3
            </div>
            <span className="text-xs mt-1 font-medium">Goal & Timeline</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-surface rounded-2xl p-6 sm:p-10 border border-border/50 shadow-sm">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-start gap-3 animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="leading-snug">{errorMessage}</span>
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="font-display text-xl font-bold mb-4">Step 1: Campaign Basics</h2>

              <Input
                label="Campaign Title"
                placeholder="Give your campaign a clear, compelling title"
                value={formData.title}
                onChange={(e) => updateForm({ title: e.target.value })}
              />

              <div className="mb-4">
                <label className="block text-sm font-medium text-text mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => updateForm({ category: e.target.value })}
                  className="w-full rounded-lg border border-border/50 px-4 py-3 leading-tight focus:outline-none focus:ring-2 focus:ring-primary bg-background text-sm"
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Short Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide a 1-2 sentence elevator pitch of your cause..."
                  value={formData.description}
                  onChange={(e) => updateForm({ description: e.target.value })}
                  className="w-full rounded-lg border border-border/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button variant="primary" onClick={handleNext} className="inline-flex items-center gap-2">
                  Continue to Story <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="font-display text-xl font-bold mb-4">Step 2: Story & Media</h2>

              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Detailed Story & Mission
                </label>
                <textarea
                  rows={8}
                  placeholder="Explain why this cause matters, how the funds will be used, and who benefits..."
                  value={formData.story}
                  onChange={(e) => updateForm({ story: e.target.value })}
                  className="w-full rounded-lg border border-border/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                />
              </div>

              <div>
                <Input
                  label="Cover Image URL (Direct Link)"
                  placeholder="https://images.unsplash.com/... or image URL"
                  value={formData.image}
                  onChange={(e) => updateForm({ image: e.target.value })}
                />
                {formData.image && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-border/50 max-h-44 bg-surface">
                    <img
                      src={formData.image}
                      alt="Campaign Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-44 object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>
                )}
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span className="text-text-secondary py-1">Quick Suggestions:</span>
                  <button
                    type="button"
                    onClick={() => updateForm({ image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80' })}
                    className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:text-primary transition-colors cursor-pointer"
                  >
                    📚 Education
                  </button>
                  <button
                    type="button"
                    onClick={() => updateForm({ image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1200&auto=format&fit=crop&q=80' })}
                    className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:text-primary transition-colors cursor-pointer"
                  >
                    🏥 Healthcare
                  </button>
                  <button
                    type="button"
                    onClick={() => updateForm({ image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&auto=format&fit=crop&q=80' })}
                    className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:text-primary transition-colors cursor-pointer"
                  >
                    🌱 Green Earth
                  </button>
                </div>
              </div>

              <Input
                label="Optional Video Link (YouTube or direct MP4)"
                placeholder="https://www.youtube.com/..."
                value={formData.videoUrl}
                onChange={(e) => updateForm({ videoUrl: e.target.value })}
              />

              <div className="flex justify-between pt-4">
                <Button variant="secondary" onClick={() => setStep(1)} className="inline-flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button variant="primary" onClick={handleNext} className="inline-flex items-center gap-2">
                  Continue to Goal <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="font-display text-xl font-bold mb-4">Step 3: Funding Goal & Deadline</h2>

              <Input
                type="number"
                label="Fundraising Goal (₹ INR)"
                placeholder="50000"
                value={formData.goalAmount}
                onChange={(e) => updateForm({ goalAmount: e.target.value })}
              />

              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Target Deadline Date
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => updateForm({ deadline: e.target.value })}
                  className="w-full rounded-lg border border-border/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                />
              </div>

              {/* Review summary */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-sm space-y-2.5 shadow-sm">
                <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-700">
                  <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Campaign Summary Preview</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-slate-700 dark:text-slate-200">
                  <div>
                    <span className="text-xs text-text-secondary block">Campaign Title</span>
                    <span className="font-medium text-slate-900 dark:text-white">{formData.title || 'Untitled'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-text-secondary block">Category</span>
                    <span className="font-medium capitalize text-slate-900 dark:text-white">{formData.category}</span>
                  </div>
                  <div>
                    <span className="text-xs text-text-secondary block">Target Goal</span>
                    <span className="font-bold text-primary">₹{Number(formData.goalAmount || 0).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-xs text-text-secondary block">Deadline</span>
                    <span className="font-medium text-slate-900 dark:text-white">{formData.deadline}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="secondary" onClick={() => setStep(2)} className="inline-flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark"
                >
                  {submitting ? 'Submitting Campaign...' : 'Submit Campaign for Approval'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateCampaignPage;