import React from 'react';
import { CheckCircle2, Heart, Globe, Users, Mail, Phone } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <header className="max-w-3xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
            Our Purpose
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold mt-3 mb-4">
            About FundRise
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed">
            FundRise bridges the divide between passionate change-makers and benevolent donors.
            We provide a transparent, 0%-commission technology infrastructure so that funds reach
            those who truly need them without bureaucratic friction.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-surface p-8 rounded-2xl border border-border/50 shadow-sm">
            <h3 className="font-display font-semibold text-xl mb-3">Our Mission</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              To democratize fundraising by eliminating barriers, verifying medical and educational bills,
              and facilitating seamless micro-donations across India and beyond.
            </p>
          </div>

          <div className="bg-surface p-8 rounded-2xl border border-border/50 shadow-sm">
            <h3 className="font-display font-semibold text-xl mb-3">Our Core Values</h3>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>100% Invoice & KYC Verification</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Empathy and Compassion First</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-info flex-shrink-0" />
                <span>Global Standards of Transparency</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-secondary flex-shrink-0" />
                <span>Community-Driven Support</span>
              </li>
            </ul>
          </div>

          <div className="bg-surface p-8 rounded-2xl border border-border/50 shadow-sm">
            <h3 className="font-display font-semibold text-xl mb-3">Reach Our Team</h3>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:support@fundrise.com" className="hover:underline text-text">support@fundrise.com</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:+917666232291" className="hover:underline text-text">+91 76662 32291</a>
              </li>
              <li className="text-xs text-text-secondary pt-2">
                Operational Support: Monday to Friday, 9am - 7pm IST
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;