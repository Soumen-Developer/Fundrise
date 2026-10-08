import React, { useState } from 'react';
import ProgressBar from '@/components/progress-bar/ProgressBar';
import PresetAmounts from '@/components/preset-amounts/PresetAmounts';

interface DonationCardProps {
  raisedAmount: number;
  goalAmount: number;
  backersCount: number;
  daysLeft: number;
  onDonate?: (amount: number, isAnonymous: boolean) => void;
  isDonating?: boolean;
}

const DonationCard: React.FC<DonationCardProps> = ({
  raisedAmount,
  goalAmount,
  backersCount,
  daysLeft,
  onDonate,
  isDonating = false,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

  const percentage = goalAmount > 0 ? Math.min((raisedAmount / goalAmount) * 100, 100) : 0;

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    const val = Number(e.target.value);
    if (val > 0) {
      setSelectedAmount(val);
    }
  };

  const handleDonateClick = () => {
    const finalAmount = customAmount ? Number(customAmount) : selectedAmount;
    if (onDonate && finalAmount > 0) {
      onDonate(finalAmount, isAnonymous);
    }
  };

  return (
    <div className="bg-surface rounded-2xl p-6 border border-border/50 shadow-sm sticky top-24">
      {/* Progress Section */}
      <div className="mb-4">
        <h3 className="font-display font-semibold text-lg mb-2">Fund this Campaign</h3>
        <ProgressBar
          percentage={percentage}
          label={`₹${Number(raisedAmount).toLocaleString()} raised of ₹${Number(goalAmount).toLocaleString()}`}
        />
      </div>

      {/* Backers & Time */}
      <div className="mb-5 flex items-center justify-between text-sm">
        <span className="font-medium text-text">
          {backersCount} {backersCount === 1 ? 'supporter' : 'supporters'}
        </span>
        <span className="text-text-secondary font-medium">
          {daysLeft} days remaining
        </span>
      </div>

      {/* Preset Amounts */}
      <div className="mb-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2 block">
          Select Amount
        </label>
        <PresetAmounts
          amounts={[100, 500, 1000, 2500]}
          selectedAmount={customAmount ? 0 : selectedAmount}
          onSelect={handleAmountSelect}
        />
      </div>

      {/* Custom Amount */}
      <div className="mb-4">
        <label htmlFor="custom-amount" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
          Or Enter Custom Amount (₹)
        </label>
        <input
          type="number"
          id="custom-amount"
          min="1"
          value={customAmount}
          onChange={handleCustomChange}
          placeholder="e.g. 1500"
          className="w-full rounded-lg border border-border/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
        />
      </div>

      {/* Anonymous donation checkbox */}
      <div className="mb-5 flex items-center gap-2">
        <input
          type="checkbox"
          id="anonymous"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
          className="rounded border-border/50 text-primary focus:ring-primary h-4 w-4"
        />
        <label htmlFor="anonymous" className="text-xs text-text-secondary cursor-pointer">
          Make this donation anonymous
        </label>
      </div>

      {/* Donate Button */}
      <button
        onClick={handleDonateClick}
        disabled={isDonating || (!selectedAmount && !customAmount)}
        className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:cursor-not-allowed disabled:opacity-50 shadow-md"
      >
        {isDonating ? 'Processing Donation...' : `Donate ₹${(customAmount ? Number(customAmount) : selectedAmount) || 0}`}
      </button>

      {/* Trust Text */}
      <p className="mt-4 text-xs text-center text-text-secondary">
        🔒 Verified campaign. Test payments supported via Razorpay.
      </p>
    </div>
  );
};

export default DonationCard;