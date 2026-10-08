import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Eye, ShieldCheck, Database, KeyRound, Bell, HelpCircle, ArrowRight } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  const lastUpdated = 'October 8, 2026';

  return (
    <div className="py-12">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <header className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3.5 py-1.5 rounded-full mb-4">
            <Lock className="w-3.5 h-3.5" /> Privacy & Security
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-text">
            Privacy Policy
          </h1>
          <p className="text-text-secondary text-base sm:text-lg leading-relaxed">
            Your trust is our paramount asset. Discover how FundRise collects, safeguards, and ethically manages your personal and financial information across all interactions.
          </p>
          <p className="text-xs text-text-secondary mt-3">
            Last updated: <span className="font-semibold text-text">{lastUpdated}</span> • Version 2.4
          </p>
        </header>

        {/* Privacy Commitments */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-surface rounded-2xl p-6 border border-border/50 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-primary flex items-center justify-center flex-shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-text mb-1">Zero Data Selling</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                We never monetize, sell, or rent your personal donor details, phone numbers, or emails to marketing brokers.
              </p>
            </div>
          </div>

          <div className="bg-surface rounded-2xl p-6 border border-border/50 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-info flex items-center justify-center flex-shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-text mb-1">Bank-Grade Encryption</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                All data in transit is protected using TLS 1.3 / 256-bit encryption. Sensitive passwords are salted using bcrypt.
              </p>
            </div>
          </div>

          <div className="bg-surface rounded-2xl p-6 border border-border/50 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-text mb-1">Full User Control</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Request a complete export of your campaign records or initiate account erasure at any time with one click.
              </p>
            </div>
          </div>
        </div>

        {/* Legal Content */}
        <div className="bg-surface rounded-2xl p-8 sm:p-12 border border-border/50 shadow-sm space-y-10 text-sm leading-relaxed text-text-secondary">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-text flex items-center gap-2">
              <span className="text-primary font-mono text-base">01.</span> Information We Collect
            </h2>
            <p>
              When you interact with FundRise, we collect essential categories of data to provide seamless crowdfunding operations:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong className="text-text">Account Information:</strong> Name, verified email address, phone number, and avatar image during signup or login.</li>
              <li><strong className="text-text">Fundraiser Data:</strong> Campaign titles, stories, fundraising targets, hospital invoices, and beneficiary identity records.</li>
              <li><strong className="text-text">Transaction Records:</strong> Contribution amounts, timestamps, order tokens, and receipt references generated via Razorpay. We do NOT store full debit/credit card numbers or CVVs on our databases.</li>
              <li><strong className="text-text">Technical Metadata:</strong> IP addresses, browser agent, operating system, and session tokens utilized for security telemetry.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-text flex items-center gap-2">
              <span className="text-primary font-mono text-base">02.</span> How We Utilize Your Data
            </h2>
            <p>
              We process personal information under strict legal bases, including contractual necessity and legitimate interest:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>To create and authenticate user sessions via secure JWT tokens.</li>
              <li>To facilitate seamless donations and deliver automated email receipts.</li>
              <li>To audit campaign legitimacy and prevent fraudulent solicitations through our moderation panel.</li>
              <li>To notify campaign creators regarding new contributions, updates, and community comments.</li>
              <li>To comply with regulatory anti-money laundering (AML) and financial governance mandates.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-text flex items-center gap-2">
              <span className="text-primary font-mono text-base">03.</span> Sharing & Third-Party Integrations
            </h2>
            <p>
              We only share pertinent details with trusted infrastructural partners necessary to execute crowdfunding operations:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong className="text-text">Payment Gateway Partners:</strong> Razorpay handles payment authorization, tokenization, and checkout flows under PCI-DSS Level 1 compliance.</li>
              <li><strong className="text-text">Verification Authorities:</strong> Third-party healthcare and non-profit registries to corroborate medical estimates.</li>
              <li><strong className="text-text">Legal Compliance:</strong> If mandated by court orders, statutory bodies, or law enforcement warrants to prevent criminal activity.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-text flex items-center gap-2">
              <span className="text-primary font-mono text-base">04.</span> Data Security & Architecture
            </h2>
            <p>
              FundRise employs multi-layered defenses to prevent unauthorized data exposure:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-1 text-slate-700 dark:text-slate-200">
                <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-primary" /> PostgreSQL Isolation
                </p>
                <p className="text-xs">Database transactions are executed via Sequelize ORM with parameterized queries, preventing SQL injection exploits.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-1 text-slate-700 dark:text-slate-200">
                <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-primary" /> Cryptographic Hashing
                </p>
                <p className="text-xs">Passwords are protected using bcrypt algorithms with 12 computational rounds, rendering rainbow table cracking ineffective.</p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-text flex items-center gap-2">
              <span className="text-primary font-mono text-base">05.</span> Your Privacy Rights
            </h2>
            <p>
              Depending on your jurisdiction (including DPDP Act India and GDPR principles), you possess the right to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Access a machine-readable record of all donations made or campaigns initiated.</li>
              <li>Rectify inaccurate personal profile information via your user dashboard.</li>
              <li>Opt out of marketing bulletins and non-transactional platform announcements.</li>
              <li>Request the complete deletion of your account and personal identifiers, subject to statutory financial retention laws.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-text flex items-center gap-2">
              <span className="text-primary font-mono text-base">06.</span> Privacy Officer & Grievance Contact
            </h2>
            <p>
              If you wish to exercise your data rights or report a security concern, reach out to our appointed Data Protection and Grievance Officer:
            </p>
            <div className="bg-slate-50 dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-2 text-slate-700 dark:text-slate-200 shadow-sm">
              <p><span className="font-semibold text-slate-900 dark:text-white">Data Protection Officer:</span> FundRise Privacy Operations</p>
              <p><span className="font-semibold text-slate-900 dark:text-white">Email:</span> <a href="mailto:privacy@fundrise.com" className="text-primary hover:underline font-medium">privacy@fundrise.com</a></p>
              <p><span className="font-semibold text-slate-900 dark:text-white">Grievance Turnaround:</span> All formal requests acknowledged within 24 business hours.</p>
            </div>
          </section>
        </div>

        {/* Footer CTA */}
        <div className="mt-10 p-6 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-primary flex-shrink-0" />
            <div>
              <p className="font-semibold text-text text-sm">Read our complete Terms of Service</p>
              <p className="text-xs text-text-secondary">Learn about creator guidelines, donation policies, and dispute terms.</p>
            </div>
          </div>
          <Link
            to="/terms"
            className="inline-flex items-center gap-1.5 bg-primary text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-emerald-600 transition-colors shadow-sm flex-shrink-0"
          >
            View Terms <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
