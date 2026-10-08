import React from 'react';

interface PresetAmountProps {
  amounts: number[];
  selectedAmount: number;
  onSelect: (amount: number) => void;
  className?: string;
}

const PresetAmounts: React.FC<PresetAmountProps> = ({
  amounts,
  selectedAmount,
  onSelect,
  className,
}) => {
  return (
    <div className={`grid grid-cols-2 gap-2 ${className}`}>
      {amounts.map((amount) => (
        <button
          key={amount}
          onClick={() => onSelect(amount)}
          className={`flex-1 rounded-lg px-4 py-2 text-sm transition-colors ${
            selectedAmount === amount
              ? 'bg-primary text-white'
              : 'border border-border/50 text-text hover:bg-border/25'
          }`}
        >
          ₹{amount}
        </button>
      ))}
    </div>
  );
};

export default PresetAmounts;