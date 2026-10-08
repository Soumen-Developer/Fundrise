import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, Loader2 } from 'lucide-react';
import Input from '@/components/input/Input';
import Button from '@/components/button/Button';
import { useAuth } from '@/components/auth/AuthProvider';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      const msg = 'Please enter your full name';
      setErrorMessage(msg);
      toast(msg);
      return;
    }
    if (!email.trim()) {
      const msg = 'Please enter your email address';
      setErrorMessage(msg);
      toast(msg);
      return;
    }
    if (password.length < 6) {
      const msg = 'Password must be at least 6 characters';
      setErrorMessage(msg);
      toast(msg);
      return;
    }
    if (password !== confirmPassword) {
      const msg = 'Passwords do not match';
      setErrorMessage(msg);
      toast(msg);
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      toast('Account created and logged in!');
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Registration failed';
      setErrorMessage(msg);
      toast(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-surface rounded-2xl p-8 border border-border/50 shadow-sm">
        <h2 className="font-display text-3xl font-bold text-center mb-2">
          Join FundRise
        </h2>
        <p className="text-text-secondary text-center mb-6 text-sm">
          Create an account to launch campaigns and support causes
        </p>

        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            placeholder="John Doe"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            label="Full Name"
          />

          <Input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            label="Email Address"
          />

          <Input
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            label="Password"
          />

          <Input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            label="Confirm Password"
          />

          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-emerald-600 active:scale-[0.98] transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-border/40 text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;