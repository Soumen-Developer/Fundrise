import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, CheckCircle2, AlertTriangle, Scale, HelpCircle, ArrowRight } from 'lucide-react';

const TermsPage: React.FC = () => {
  const lastUpdated = 'October 8, 2026';

  return (
    <div className="py-12">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <header className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3.5 py-1.5 rounded-full mb-4">
            <FileText className="w-3.5 h-3.5" /> Legal Agreement
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-text">
            Terms of Service
          </h1>
          <p className="text-text-secondary text-base sm:text-lg leading-relaxed">
            Welcome to FundRise. Please review these Terms of Service carefully before utilizing our crowdfunding platform, donating to causes, or launching a fundraising campaign.
          </p>
          <p className="text-xs text-text-secondary mt-3">
            Last updated: <span className="font-semibold text-text">{lastUpdated}</span> • Effective across all platforms
          </p>
        </header>

        {/* Highlights Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-surface rounded-2xl p-6 border border-border/50 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-primary flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-text mb-1">0% Platform Fee</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                FundRise charges zero platform fees to creators, maximizing contributions directly to the beneficiaries.
              </p>
            </div>
          </div>

          <div className="bg-surface rounded-2xl p-6 border border-border/50 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-info flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-text mb-1">Verified Campaigns</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Hospital estimates, government IDs, and non-profit registrations undergo review prior to verification badge awards.
              </p>
            </div>
          </div>

          <div className="bg-surface rounded-2xl p-6 border border-border/50 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-secondary flex items-center justify-center flex-shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-text mb-1">Transparent Payouts</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Donations disburse directly via regulated payment gateways with full digital receipts and ledger tracking.
              </p>
            </div>
          </div>
        </div>

        {/* Legal Content */}
        <div className="bg-surface rounded-2xl p-8 sm:p-12 border border-border/50 shadow-sm space-y-10 text-sm leading-relaxed text-text-secondary">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-text flex items-center gap-2">
              <span className="text-primary font-mono text-base">01.</span> Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, registering an account, donating, or publishing a fundraiser on FundRise (the "Platform", "we", "our", or "us"), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, you must discontinue your use of the Platform immediately.
            </p>
            <p>
              We reserve the right to amend these terms at any time. Material updates will be communicated through platform notifications or via your registered email address. Your continued use after modifications constitutes acceptance of the revised terms.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-text flex items-center gap-2">
              <span className="text-primary font-mono text-base">02.</span> Eligibility & Account Registration
            </h2>
            <p>
              To create an account or publish a campaign, you must be at least 18 years old and capable of entering into legally binding agreements. By creating an account, you represent and warrant that:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>All information provided during registration is accurate, current, and verifiable.</li>
              <li>You will safeguard your account credentials and immediately notify us of any unauthorized access.</li>
              <li>You are solely responsible for all activities and postings conducted through your authenticated session.</li>
              <li>You will not impersonate any person or entity or misrepresent your affiliation with any group or institution.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-text flex items-center gap-2">
              <span className="text-primary font-mono text-base">03.</span> Campaign Creation & Creator Obligations
            </h2>
            <p>
              FundRise allows authorized creators to launch campaigns across authorized categories (Education, Medical Emergencies, Startups, Creative Projects, Social Causes, and Environmental Initiatives). As a campaign creator, you agree to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Provide truthful, unambiguous descriptions, genuine estimates, and authentic supporting documentation.</li>
              <li>Utilize all mobilized funds exclusively for the explicit cause described in your campaign manifesto.</li>
              <li>Publish regular campaign updates detailing milestones, treatment progress, or supply distributions.</li>
              <li>Cooperate fully with our trust and safety audits, providing bank statements or receipts upon request.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-text flex items-center gap-2">
              <span className="text-primary font-mono text-base">04.</span> Donations, Processing & Refunds
            </h2>
            <p>
              All donations made on FundRise are voluntary financial gifts to assist designated beneficiaries. Donors acknowledge that:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Payments are processed securely via third-party licensed payment processors (including Razorpay).</li>
              <li>Platform test mode transactions simulate transactions without real money charges.</li>
              <li>Because funds are often deployed immediately for urgent surgeries or disaster relief, donations are generally non-refundable once disbursed, except in confirmed instances of fraud.</li>
              <li>Tax exemption certificates (such as 80G in India) depend on the beneficiary organization's registered non-profit status.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-text flex items-center gap-2">
              <span className="text-primary font-mono text-base">05.</span> Prohibited Activities
            </h2>
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-sm">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" /> Zero Tolerance Violations
              </div>
              <p className="text-xs leading-relaxed">
                The Platform strictly prohibits campaigns involving hate speech, fraudulent medical claims, illegal drugs or weapons, unauthorized lotteries, harassment, or funds diversion. Any such campaign will be terminated immediately, funds frozen, and reported to law enforcement authorities.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-text flex items-center gap-2">
              <span className="text-primary font-mono text-base">06.</span> Disclaimers & Limitation of Liability
            </h2>
            <p>
              FundRise is an administrative technology platform facilitating crowdfunding connectivity. While we deploy rigorous verification protocols, FundRise does not guarantee that every campaign will achieve its funding goal or that every beneficiary will complete project milestones.
            </p>
            <p>
              To the fullest extent permitted by applicable law, FundRise and its affiliates shall not be liable for any indirect, incidental, or consequential damages resulting from platform downtime, unauthorized server breaches, or third-party payment gateway disruptions.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-text flex items-center gap-2">
              <span className="text-primary font-mono text-base">07.</span> Contact & Grievance Officer
            </h2>
            <p>
              For legal inquiries, dispute submissions, or questions regarding these Terms, please contact our Compliance and Grievance Department:
            </p>
            <div className="bg-slate-50 dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-2 text-slate-700 dark:text-slate-200 shadow-sm">
              <p><span className="font-semibold text-slate-900 dark:text-white">Compliance Office:</span> FundRise Legal & Grievance Redressal</p>
              <p><span className="font-semibold text-slate-900 dark:text-white">Email:</span> <a href="mailto:legal@fundrise.com" className="text-primary hover:underline font-medium">legal@fundrise.com</a></p>
              <p><span className="font-semibold text-slate-900 dark:text-white">Support Helpline:</span> +91 76662 32291 (Mon-Fri, 9am - 6pm IST)</p>
            </div>
          </section>
        </div>

        {/* Footer CTA */}
        <div className="mt-10 p-6 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-primary flex-shrink-0" />
            <div>
              <p className="font-semibold text-text text-sm">Have questions about our terms or privacy policy?</p>
              <p className="text-xs text-text-secondary">Our dedicated support team is available 24/7 to assist you.</p>
            </div>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-1.5 bg-primary text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-emerald-600 transition-colors shadow-sm flex-shrink-0"
          >
            Contact Support <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
