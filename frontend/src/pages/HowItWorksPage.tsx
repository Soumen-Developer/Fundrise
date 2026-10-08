import React from 'react';
import { PlusCircle, Share2, Heart, ShieldCheck, Zap, Receipt } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorksPage: React.FC = () => {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <header className="max-w-3xl mb-12 text-center mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
            Simple & Transparent
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold mt-3 mb-4">
            How FundRise Works
          </h1>
          <p className="text-text-secondary text-lg">
            Launching and funding a campaign takes just a few steps. Here is how your campaign moves from idea to impact.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-surface rounded-2xl p-8 border border-border/50 text-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
              <PlusCircle className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-xl mb-3">1. Create Your Fundraiser</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Define your story, set your funding goal, and upload images or bills verifying the cause in under 3 minutes.
            </p>
          </div>

          <div className="bg-surface rounded-2xl p-8 border border-border/50 text-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
              <Share2 className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-xl mb-3">2. Share & Engage</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Share your dedicated campaign link via WhatsApp, LinkedIn, and social media to rally initial supporters.
            </p>
          </div>

          <div className="bg-surface rounded-2xl p-8 border border-border/50 text-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-xl mb-3">3. Receive Contributions</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Supporters contribute seamlessly using UPI, cards, and net banking via Razorpay. Withdrawals are instant.
            </p>
          </div>
        </div>

        {/* Security Pillars */}
        <div className="mt-12 pt-10 border-t border-border/40">
          <h2 className="font-display text-2xl font-bold mb-8 text-center">Built on Trust and Integrity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-base mb-1">Strict Moderation</h4>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Every campaign is audited before receiving the verified badge to prevent fraudulent solicitations.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-base mb-1">Direct Transfers</h4>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Funds disburse to designated hospitals or verified accounts with full audit logs.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center flex-shrink-0">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-base mb-1">Donation Receipts</h4>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Every donor receives a transparent digital confirmation for record-keeping and peace of mind.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/create-campaign"
              className="inline-block bg-primary text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-primary-dark transition-colors shadow-md"
            >
              Start Your Campaign Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;