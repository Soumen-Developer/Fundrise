import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import Input from '@/components/input/Input';
import Button from '@/components/button/Button';
import { useAuth } from '@/components/auth/AuthProvider';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast('Please enter your full name');
      return;
    }
    if (!email.trim()) {
      toast('Please enter your email address');
      return;
    }
    if (password.length < 6) {
      toast('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      toast('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      toast('Account created and logged in!');
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Registration failed';
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

        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="Full Name"
          />

          <Input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email Address"
          />

          <Input
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
          />

          <Input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            label="Confirm Password"
          />

          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
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