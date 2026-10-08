import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import Input from '@/components/input/Input';

const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast('Please fill in all fields');
      return;
    }

    // In production: send email or form submission
    toast('Message sent successfully!');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-background text-text p-6">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="font-display text-4xl font-bold text-primary mb-4">
            Contact Us
          </h1>
          <p className="text-text-secondary">
            Have questions? We'd love to hear from you. Get in touch within 72 hours.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="bg-surface rounded-2xl p-8 border border-border/50 max-w-xl shadow-sm">
          <div>
            <Input
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Name"
              required
            />
          </div>

          <div>
            <Input
              type="email"
              placeholder="your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
            />
          </div>

          <div>
            <Input
              placeholder="your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              label="Message"
              textarea
              rows={4}
            />
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Send Message
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-border/10">
          <h3 className="font-display font-semibold text-xl mb-4">Quick Links</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-display font-medium mb-3">Platform</h4>
              <ul className="space-y-2 text-text-small">
                <li>
                  <a href="/explore" className="text-text-hover hover:text-primary transition-colors">Explore Campaigns</a>
                </li>
                <li>
                  <a href="/how-it-works" className="text-text-hover hover:text-primary transition-colors">How It Works</a>
                </li>
                <li>
                  <a href="/about" className="text-text-hover hover:text-primary transition-colors">About Us</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-medium mb-3">Company</h4>
              <ul className="space-y-2 text-text-small">
                <li>
                  <a href="/contact" className="text-text-hover hover:text-primary transition-colors">Contact</a>
                </li>
                <li>
                  <a href="/terms" className="text-text-hover hover:text-primary transition-colors">Terms</a>
                </li>
                <li>
                  <a href="/privacy" className="text-text-hover hover:text-primary transition-colors">Privacy</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;