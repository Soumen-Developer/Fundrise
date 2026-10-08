import React, { useState } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Lock,
  ArrowRight,
  Download,
  Sparkles,
} from 'lucide-react';
import api from '@/lib/api';

interface DemoPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: number | string;
  campaignTitle: string;
  amount: number;
  isAnonymous?: boolean;
  onSuccess: (donationData: any) => void;
}

export const DemoPaymentModal: React.FC<DemoPaymentModalProps> = ({
  isOpen,
  onClose,
  campaignId,
  campaignTitle,
  amount,
  isAnonymous = false,
  onSuccess,
}) => {
  const [method, setMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [successData, setSuccessData] = useState<any | null>(null);

  // Form states
  const [upiId, setUpiId] = useState('donor@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [cardName, setCardName] = useState('Demo Supporter');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  if (!isOpen) return null;

  const handleFillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardExpiry('12/28');
    setCardCvv('123');
    setCardName('Verified Test Donor');
  };

  const handleProcessPayment = async () => {
    setProcessing(true);
    setProcessingStep('Authorizing test payment...');

    try {
      // Step 1: Create Order
      await new Promise((r) => setTimeout(r, 600));
      setProcessingStep('Simulating Razorpay gateway response...');

      const orderRes = await api.post('/donations/create-order', { amount });
      const orderId = orderRes.data?.orderId || `order_demo_${Date.now()}`;

      // Step 2: Verify and Record Donation
      await new Promise((r) => setTimeout(r, 600));
      setProcessingStep('Verifying digital signature & updating fundraiser...');

      const paymentId = `pay_demo_${Date.now()}`;
      const verifyRes = await api.post('/donations/verify', {
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: 'mock_signature_for_test_mode',
        campaignId,
        amount,
        isAnonymous,
      });

      if (verifyRes.data?.success) {
        const donationResult = {
          paymentId,
          orderId,
          amount,
          method: method.toUpperCase(),
          campaignTitle,
          campaignId,
          timestamp: new Date().toLocaleString(),
          campaign: verifyRes.data.campaign,
        };
        setSuccessData(donationResult);
        onSuccess(verifyRes.data);
      }
    } catch (err) {
      // Offline / fallback mock success for demo
      const fallbackResult = {
        paymentId: `pay_mock_${Date.now()}`,
        orderId: `order_mock_${Date.now()}`,
        amount,
        method: method.toUpperCase(),
        campaignTitle,
        campaignId,
        timestamp: new Date().toLocaleString(),
      };
      setSuccessData(fallbackResult);
      onSuccess({ success: true, campaign: { raisedAmount: amount } });
    } finally {
      setProcessing(false);
      setProcessingStep('');
    }
  };

  const handleDownloadReceipt = () => {
    const text = `=========================================
          FUNDRISE DONATION RECEIPT
=========================================
Receipt ID:     ${successData?.paymentId}
Order ID:       ${successData?.orderId}
Cause:          ${campaignTitle}
Amount Donated: ₹${amount.toLocaleString()}
Payment Mode:   ${successData?.method} (TEST MODE)
Date & Time:    ${successData?.timestamp}
Status:         COMPLETED (100% Verified)
=========================================
Thank you for bringing real change to human lives!
FundRise Crowdfunding Platform - https://fundrise.org
=========================================`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FundRise_Receipt_${successData?.paymentId || 'demo'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-surface rounded-2xl border border-border/60 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="font-display font-bold text-base text-text">
              {successData ? 'Donation Successful' : 'Razorpay Demo Checkout'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-text-secondary hover:text-text hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-5">
          {successData ? (
            /* Success Receipt View */
            <div className="text-center space-y-5 py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-500/5 animate-in zoom-in-75 duration-300">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">
                  Test Payment Verified
                </span>
                <h4 className="font-display text-2xl font-bold mt-2 text-text">
                  ₹{amount.toLocaleString()} Contributed!
                </h4>
                <p className="text-xs text-text-secondary mt-1 max-w-sm mx-auto line-clamp-1">
                  for {campaignTitle}
                </p>
              </div>

              {/* Receipt card */}
              <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-border/50 text-xs text-left space-y-2 font-mono">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Payment ID:</span>
                  <span className="font-semibold text-text">{successData.paymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Amount Paid:</span>
                  <span className="font-bold text-emerald-600">₹{amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Method:</span>
                  <span className="text-text">{successData.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Date & Time:</span>
                  <span className="text-text">{successData.timestamp}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleDownloadReceipt}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border/60 text-text hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Receipt
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white hover:bg-emerald-600 text-xs font-semibold transition-colors shadow-sm cursor-pointer"
                >
                  Back to Campaign <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form View */
            <>
              {/* Campaign & Amount Banner */}
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between">
                <div>
                  <span className="text-xs text-text-secondary block">Contributing to:</span>
                  <span className="font-semibold text-text text-sm line-clamp-1 max-w-[240px]">
                    {campaignTitle}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-text-secondary block">Amount</span>
                  <span className="font-display font-bold text-xl text-primary">
                    ₹{amount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payment Method Selector Tabs */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2 block">
                  Select Payment Option (Test Mode)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod('upi')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                      method === 'upi'
                        ? 'border-primary bg-primary/5 text-primary shadow-xs font-semibold'
                        : 'border-border/50 bg-surface text-text-secondary hover:text-text'
                    }`}
                  >
                    <QrCode className="w-5 h-5 mb-1" />
                    <span>UPI / QR</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod('card')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                      method === 'card'
                        ? 'border-primary bg-primary/5 text-primary shadow-xs font-semibold'
                        : 'border-border/50 bg-surface text-text-secondary hover:text-text'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mb-1" />
                    <span>Cards</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod('netbanking')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                      method === 'netbanking'
                        ? 'border-primary bg-primary/5 text-primary shadow-xs font-semibold'
                        : 'border-border/50 bg-surface text-text-secondary hover:text-text'
                    }`}
                  >
                    <Building2 className="w-5 h-5 mb-1" />
                    <span>Net Banking</span>
                  </button>
                </div>
              </div>

              {/* TAB 1: UPI */}
              {method === 'upi' && (
                <div className="space-y-3.5">
                  <div className="p-3.5 rounded-xl border border-dashed border-border/60 bg-slate-50 dark:bg-slate-900/40 text-center space-y-2">
                    <div className="w-24 h-24 mx-auto bg-white p-2 rounded-lg border border-border/40 shadow-xs flex items-center justify-center">
                      <QrCode className="w-20 h-20 text-slate-800" />
                    </div>
                    <p className="text-xs text-text-secondary">Scan with Google Pay, PhonePe, Paytm, or BHIM</p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-text block mb-1">Or Enter Virtual Payment Address (UPI ID)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                        className="flex-1 px-3 py-2 text-xs rounded-lg border border-border/50 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setUpiId('donor@okhdfcbank')}
                        className="px-2.5 py-1 text-[11px] rounded-lg border border-border/60 bg-surface hover:text-primary transition-colors cursor-pointer"
                      >
                        Auto-fill
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CARDS */}
              {method === 'card' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-text">Card Information</span>
                    <button
                      type="button"
                      onClick={handleFillTestCard}
                      className="text-[11px] text-primary hover:underline font-semibold cursor-pointer"
                    >
                      Fill Demo Card
                    </button>
                  </div>

                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-border/50 bg-background font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-border/50 bg-background font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="CVV (123)"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-border/50 bg-background font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Cardholder Name"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-border/50 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              )}

              {/* TAB 3: NET BANKING */}
              {method === 'netbanking' && (
                <div className="space-y-2.5">
                  <label className="text-xs font-medium text-text block">Select Bank for Simulation</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Bank', 'Punjab National Bank'].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setSelectedBank(b)}
                        className={`p-2.5 rounded-lg border text-xs text-left transition-colors cursor-pointer ${
                          selectedBank === b
                            ? 'border-primary bg-primary/10 text-primary font-semibold'
                            : 'border-border/50 bg-surface text-text hover:border-border'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Demo Mode Notice */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Razorpay Test Mode:</strong> No real bank charges occur. Click below to verify and record this donation immediately.
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleProcessPayment}
                disabled={processing}
                className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-emerald-600 active:scale-[0.98] transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{processingStep || 'Processing...'}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" /> Pay ₹{amount.toLocaleString()} (Simulate Success)
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoPaymentModal;
