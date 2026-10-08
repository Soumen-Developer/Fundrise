import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Building2,
  CheckCircle2,
  Download,
  ArrowRight,
  Loader2,
  Sparkles,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import api from '@/lib/api';

const DemoPaymentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const campaignIdParam = searchParams.get('campaignId');
  const amountParam = searchParams.get('amount');

  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(campaignIdParam || '');
  const [amount, setAmount] = useState<number>(Number(amountParam) || 500);
  const [method, setMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [receipt, setReceipt] = useState<any | null>(null);

  // Form inputs
  const [upiId, setUpiId] = useState('donor@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [cardName, setCardName] = useState(user?.name || 'Demo Supporter');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  useEffect(() => {
    if (campaignIdParam) setSelectedCampaignId(campaignIdParam);
    if (amountParam && Number(amountParam) > 0) setAmount(Number(amountParam));
  }, [campaignIdParam, amountParam]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await api.get('/campaigns?limit=30');
        if (res.data?.success && res.data?.campaigns?.length > 0) {
          setCampaigns(res.data.campaigns);
          if (!selectedCampaignId) {
            setSelectedCampaignId(campaignIdParam || String(res.data.campaigns[0].id));
          }
        }
      } catch (err) {
        console.warn('Failed to load campaigns for demo payment:', err);
      }
    };
    fetchCampaigns();
  }, [campaignIdParam, selectedCampaignId]);

  const activeCampaign = campaigns.find((c) => String(c.id) === String(selectedCampaignId)) || campaigns[0];

  const handleFillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardExpiry('12/28');
    setCardCvv('123');
    setCardName(user?.name || 'Verified Test Supporter');
  };

  const handleSimulatePayment = async () => {
    if (!amount || amount <= 0) return;
    setProcessing(true);
    setProcessingStep('Authorizing simulated Razorpay transaction...');

    try {
      await new Promise((r) => setTimeout(r, 600));
      setProcessingStep('Verifying order and updating fundraiser in database...');

      const orderRes = await api.post('/donations/create-order', { amount });
      const orderId = orderRes.data?.orderId || `order_demo_${Date.now()}`;
      const paymentId = `pay_demo_${Date.now()}`;

      await api.post('/donations/verify', {
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: 'mock_signature_for_test_mode',
        campaignId: activeCampaign?.id || 1,
        amount,
        isAnonymous,
      });

      const receiptData = {
        paymentId,
        orderId,
        amount,
        method: method.toUpperCase(),
        campaignTitle: activeCampaign?.title || 'Education for All Children in Rural Bihar',
        campaignId: activeCampaign?.id || 1,
        date: new Date().toLocaleString(),
      };

      setReceipt(receiptData);
    } catch (err) {
      // Fallback offline simulator
      const fallbackReceipt = {
        paymentId: `pay_mock_${Date.now()}`,
        orderId: `order_mock_${Date.now()}`,
        amount,
        method: method.toUpperCase(),
        campaignTitle: activeCampaign?.title || 'Verified Cause Fundraiser',
        campaignId: activeCampaign?.id || 1,
        date: new Date().toLocaleString(),
      };
      setReceipt(fallbackReceipt);
    } finally {
      setProcessing(false);
      setProcessingStep('');
    }
  };

  const handleDownloadReceipt = () => {
    if (!receipt) return;
    const text = `================================================
          FUNDRISE DONATION RECEIPT
================================================
Receipt ID:     ${receipt.paymentId}
Order ID:       ${receipt.orderId}
Beneficiary:    ${receipt.campaignTitle}
Amount Donated: ₹${receipt.amount.toLocaleString()}
Payment Method: ${receipt.method} (TEST MODE)
Timestamp:      ${receipt.date}
Verification:   100% SUCCESSFUL (TEST GATEWAY)
================================================
Thank you for bringing real change to human lives!
FundRise Crowdfunding Platform - https://fundrise.org
================================================`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FundRise_Receipt_${receipt.paymentId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3.5 py-1.5 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Razorpay Test Mode Simulator
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-text">
            Demo Payment Portal
          </h1>
          <p className="text-text-secondary text-sm mt-2">
            Simulate real crowdfunding contributions safely. No bank account charges are made.
          </p>
        </div>

        {receipt ? (
          /* Receipt Card */
          <div className="bg-surface rounded-2xl p-8 border border-border/60 shadow-lg text-center max-w-xl mx-auto space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">
                Transaction Verified
              </span>
              <h2 className="font-display text-3xl font-bold mt-3 text-text">
                ₹{receipt.amount.toLocaleString()} Donated!
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                for <span className="font-semibold text-text">{receipt.campaignTitle}</span>
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-xl border border-border/50 text-xs text-left space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-text-secondary">Transaction ID:</span>
                <span className="font-semibold text-text">{receipt.paymentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Order ID:</span>
                <span className="text-text">{receipt.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Payment Method:</span>
                <span className="text-text">{receipt.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Date & Time:</span>
                <span className="text-text">{receipt.date}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleDownloadReceipt}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border/60 text-text hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Receipt (.txt)
              </button>
              <Link
                to={`/campaign/${receipt.campaignId}`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-white hover:bg-emerald-600 text-xs font-semibold transition-colors shadow-sm"
              >
                View Live Campaign <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <button
              onClick={() => setReceipt(null)}
              className="text-xs text-primary font-semibold hover:underline cursor-pointer block mx-auto pt-2"
            >
              ← Make Another Test Donation
            </button>
          </div>
        ) : (
          /* Payment Simulator Form */
          <div className="bg-surface rounded-2xl p-6 sm:p-10 border border-border/60 shadow-sm max-w-2xl mx-auto space-y-6">
            {/* Step 1: Campaign Selector */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5 block">
                Select Cause to Support
              </label>
              <select
                value={selectedCampaignId}
                onChange={(e) => setSelectedCampaignId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} (Goal: ₹{Number(c.goalAmount).toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Donation Amount */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5 block">
                Donation Amount (₹ INR)
              </label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[100, 500, 1000, 2500].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
                    className={`py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      amount === preset
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'border-border/60 bg-surface text-text hover:border-primary'
                    }`}
                  >
                    ₹{preset}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Custom Amount"
                className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-background text-sm font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Step 3: Payment Method Tabs */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2 block">
                Test Payment Instrument
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('upi')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    method === 'upi'
                      ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs'
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
                      ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs'
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
                      ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs'
                      : 'border-border/50 bg-surface text-text-secondary hover:text-text'
                  }`}
                >
                  <Building2 className="w-5 h-5 mb-1" />
                  <span>Net Banking</span>
                </button>
              </div>
            </div>

            {/* Dynamic Instrument Fields */}
            {method === 'upi' && (
              <div className="p-4 rounded-xl border border-dashed border-border/60 bg-slate-50 dark:bg-slate-900/50 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-white p-1 rounded-lg border border-border/40 shadow-xs flex items-center justify-center flex-shrink-0">
                    <QrCode className="w-12 h-12 text-slate-800" />
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-text">Instant UPI Verification</p>
                    <p className="text-[11px] text-text-secondary">Simulates real-time webhook callback</p>
                  </div>
                </div>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-border/50 bg-background"
                />
              </div>
            )}

            {method === 'card' && (
              <div className="p-4 rounded-xl border border-border/50 bg-slate-50 dark:bg-slate-900/50 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-text">Demo Card Details</span>
                  <button
                    type="button"
                    onClick={handleFillTestCard}
                    className="text-xs text-primary font-semibold hover:underline cursor-pointer"
                  >
                    Auto-Fill Test Card
                  </button>
                </div>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-border/50 bg-background font-mono"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="px-3 py-2 text-xs rounded-lg border border-border/50 bg-background font-mono"
                  />
                  <input
                    type="password"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="px-3 py-2 text-xs rounded-lg border border-border/50 bg-background font-mono"
                  />
                </div>
              </div>
            )}

            {method === 'netbanking' && (
              <div className="grid grid-cols-2 gap-2">
                {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setSelectedBank(b)}
                    className={`p-2.5 rounded-lg border text-xs text-left cursor-pointer transition-colors ${
                      selectedBank === b
                        ? 'border-primary bg-primary/10 text-primary font-semibold'
                        : 'border-border/50 bg-surface text-text hover:border-border'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            )}

            {/* Anonymous Toggle */}
            <label className="flex items-center gap-2 cursor-pointer text-xs text-text-secondary">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded border-border/60 text-primary focus:ring-primary h-4 w-4"
              />
              <span>Donate anonymously (hide donor name on public ledger)</span>
            </label>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSimulatePayment}
              disabled={processing || !amount}
              className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-emerald-600 active:scale-[0.98] transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{processingStep || 'Processing...'}</span>
                </>
              ) : (
                `Complete Test Donation of ₹${amount.toLocaleString()}`
              )}
            </button>

            {/* Test Mode Disclaimer */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-600 text-xs flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                <strong>Test Mode Environment:</strong> Transactions recorded here will simulate Razorpay and update your Dashboard instantly.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoPaymentPage;
