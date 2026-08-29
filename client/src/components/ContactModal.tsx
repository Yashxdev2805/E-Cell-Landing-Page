import { useState, type FormEvent } from 'react';
import { X, CheckCircle2, Mail } from 'lucide-react';
import { submitContactMessage } from '../services/api';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'student' | 'sponsor' | 'startup' | 'speaker' | 'other'>('student');
  const [organization, setOrganization] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await submitContactMessage({
        name,
        email,
        subject,
        message,
        type,
        organization,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in-up">
      <div className="ecell-card w-full max-w-lg p-6 sm:p-8 relative bg-[#0a0e1a] border border-slate-700 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white font-heading mb-2">Message Dispatched!</h3>
            <p className="text-xs text-slate-400 mb-6">
              Thank you for reaching out. Our executive team has received your message and will get back to you shortly.
            </p>
            <button onClick={onClose} className="btn-primary text-xs py-2 px-6">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[11px] font-bold mb-2">
                <Mail className="w-3 h-3" /> Get in Touch
              </span>
              <h3 className="text-xl font-bold text-white font-heading">Contact E-Cell UIET KUK</h3>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Diksha Sharma"
                  className="ecell-input w-full text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. user@domain.com"
                  className="ecell-input w-full text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Inquiry Type *</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="ecell-input w-full text-xs"
                >
                  <option value="student">Student / General</option>
                  <option value="sponsor">Sponsor / Partner</option>
                  <option value="startup">Startup Pitch Query</option>
                  <option value="speaker">Speaker / Mentor</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Organization (Optional)</label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Venture Fund / College"
                  className="ecell-input w-full text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Subject *</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. E-Summit 2026 Sponsorship Proposal"
                className="ecell-input w-full text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Message *</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Write your message here..."
                className="ecell-input w-full text-xs"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !name || !email || !subject || !message}
              className="btn-primary w-full text-xs py-2.5 justify-center disabled:opacity-40"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
