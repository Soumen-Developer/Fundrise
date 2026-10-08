import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
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
      } catch (e) {}
    }
  }, []);

  // Save draft on edit
  const updateForm = (fields: Partial<typeof formData>) => {
    const next = { ...formData, ...fields };
    setFormData(next);
    localStorage.setItem('fundrise_campaign_draft', JSON.stringify(next));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.title.trim()) {
        toast('Please enter a campaign title');
        return;
      }
      if (!formData.description.trim()) {
        toast('Please enter a short description');
        return;
      }
    }
    if (step === 2) {
      if (!formData.story.trim()) {
        toast('Please tell your campaign story');
        return;
      }
    }
    setStep((s) => Math.min(s + 1, 3));
  };

  const handleSubmit = async () => {
    const goal = parseFloat(formData.goalAmount);
    if (!goal || goal <= 0) {
      toast('Please enter a valid goal amount');
      return;
    }
    if (!formData.deadline) {
      toast('Please select a deadline date');
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
        toast('Campaign created successfully! Submitted for review.');
        localStorage.removeItem('fundrise_campaign_draft');
        const newId = res.data.campaign?.id;
        navigate(newId ? `/campaign/${newId}` : '/dashboard');
      } else {
        toast('Campaign submitted for review!');
        navigate('/explore');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Error creating campaign';
      toast(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

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

              <Input
                label="Cover Image URL (Direct Link)"
                placeholder="https://images.unsplash.com/... or image URL"
                value={formData.image}
                onChange={(e) => updateForm({ image: e.target.value })}
              />

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
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border/40 text-sm space-y-2">
                <p className="font-semibold text-text flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" /> Campaign Summary Preview
                </p>
                <p>
                  <strong>Title:</strong> {formData.title || 'Untitled'}
                </p>
                <p>
                  <strong>Category:</strong> <span className="capitalize">{formData.category}</span>
                </p>
                <p>
                  <strong>Target:</strong> ₹{Number(formData.goalAmount || 0).toLocaleString()} by{' '}
                  {formData.deadline}
                </p>
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