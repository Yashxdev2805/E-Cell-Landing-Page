import { useState, useEffect, type FormEvent } from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Plus,
  Trash2,
  Copy,
  Check,
} from 'lucide-react';
import { submitJoinApplication, type JoinApplicationPayload } from '../services/api';
import { syncBus } from '../utils/crossAppEvents';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BRANCHES = ['AIML', 'CSE', 'ME', 'CE', 'ECO', 'ECE', 'BIOTECHNOLOGY'];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const DOMAINS = [
  'Web AND Tech',
  'Graphic Designer',
  'General Management',
  'Photography',
  'Content Writing',
  'Promotion And Outreach',
];

const SOCIAL_PLATFORMS = [
  'LinkedIn',
  'GitHub',
  'Portfolio Website',
  'Behance',
  'Dribbble',
  'Instagram',
  'Twitter / X',
  'Google Drive / Resume',
  'YouTube',
  'Other',
];

export function JoinModal({ isOpen, onClose }: JoinModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState<JoinApplicationPayload>({
    fullName: '',
    rollNo: '',
    email: '',
    phone: '',
    branch: 'AIML',
    year: '1st Year',
    domain: 'Web AND Tech',
    sop: '',
    experience: '',
    links: [{ platform: 'LinkedIn', url: '' }],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedRefId, setSubmittedRefId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setError(null);
      setSubmittedRefId(null);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRollNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 9);
    setFormData((prev) => ({ ...prev, rollNo: digitsOnly }));
  };

  const handleAddLink = () => {
    setFormData((prev) => ({
      ...prev,
      links: [...prev.links, { platform: 'GitHub', url: '' }],
    }));
  };

  const handleRemoveLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
  };

  const handleLinkChange = (index: number, field: 'platform' | 'url', value: string) => {
    setFormData((prev) => {
      const updated = [...prev.links];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, links: updated };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const cleanLinks = formData.links.filter((l) => l.url.trim().length > 0);
      const res = await submitJoinApplication({ ...formData, links: cleanLinks });

      setSubmittedRefId(res.refId);
      setStep(4);

      // Broadcast sync event to all open tabs and Project 1
      syncBus.broadcast('JOIN_APPLICATION_COMMITTED', {
        refId: res.refId,
        trackOrDomain: formData.domain,
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to submit application. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  const copyRefId = () => {
    if (submittedRefId) {
      navigator.clipboard.writeText(submittedRefId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in-up">
      <div className="ecell-card w-full max-w-2xl p-6 sm:p-8 relative bg-[#0a0e1a] border border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Wizard Steps Stepper */}
        {step < 4 && (
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
              <span className={step >= 1 ? 'text-blue-400' : ''}>1. Student Info</span>
              <span className={step >= 2 ? 'text-blue-400' : ''}>2. Domain Selection</span>
              <span className={step >= 3 ? 'text-blue-400' : ''}>3. SOP & Handles</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* STEP 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white font-heading">Step 1: Student Information</h3>
            <p className="text-xs text-slate-400">Enter your official institutional credentials.</p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Yash Vardhan"
                  className="ecell-input w-full text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Roll Number * (Up to 9 numbers)
                </label>
                <input
                  type="text"
                  value={formData.rollNo}
                  onChange={handleRollNoChange}
                  placeholder="e.g. 24119099"
                  maxLength={9}
                  className="ecell-input w-full text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. student@uietkuk.ac.in"
                  className="ecell-input w-full text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  placeholder="e.g. 9876543210"
                  maxLength={10}
                  className="ecell-input w-full text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Branch *</label>
                <select
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="ecell-input w-full text-xs"
                >
                  {BRANCHES.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Year of Study *</label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="ecell-input w-full text-xs"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                disabled={!formData.fullName || !formData.rollNo || !formData.email || formData.phone.length < 10}
                onClick={() => setStep(2)}
                className="btn-primary text-xs py-2.5 px-6 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Continue to Domain</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Domain Preference */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white font-heading">Step 2: Choose Your Domain</h3>
            <p className="text-xs text-slate-400">Select the team department where you want to contribute.</p>

            <div className="grid sm:grid-cols-2 gap-3">
              {DOMAINS.map((dom) => (
                <div
                  key={dom}
                  onClick={() => setFormData({ ...formData, domain: dom })}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    formData.domain === dom
                      ? 'bg-blue-600/15 border-blue-500 text-white shadow-md'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <p className="font-bold text-xs">{dom}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold hover:bg-white/10"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn-primary text-xs py-2.5 px-6"
              >
                <span>Continue to SOP & Handles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SOP & Social Links */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-bold text-white font-heading">Step 3: Statement & Experience</h3>

            {error && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Statement of Purpose (Why join E-Cell?) *
              </label>
              <textarea
                value={formData.sop}
                onChange={(e) => setFormData({ ...formData, sop: e.target.value })}
                rows={3}
                placeholder="Briefly describe your motivation and what skills you bring..."
                className="ecell-input w-full text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Prior Projects / Experience (Optional)
              </label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="e.g. Built hackathon projects, organized college events..."
                className="ecell-input w-full text-xs"
              />
            </div>

            {/* Social Links Builder */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300">
                  Social & Experience Handles (LinkedIn, GitHub, Portfolio...)
                </label>
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Another Link
                </button>
              </div>

              <div className="space-y-2.5">
                {formData.links.map((link, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row gap-2 items-center">
                    <select
                      value={link.platform}
                      onChange={(e) => handleLinkChange(idx, 'platform', e.target.value)}
                      className="ecell-input w-full sm:w-44 text-xs shrink-0"
                    >
                      {SOCIAL_PLATFORMS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>

                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => handleLinkChange(idx, 'url', e.target.value)}
                      placeholder={`Paste your ${link.platform} URL (https://...)`}
                      className="ecell-input w-full text-xs font-mono"
                    />

                    {formData.links.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(idx)}
                        className="p-2 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold hover:bg-white/10"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <button
                type="submit"
                disabled={loading || formData.sop.trim().length < 20}
                className="btn-primary text-xs py-2.5 px-6 disabled:opacity-40"
              >
                {loading ? 'Submitting Application...' : 'Submit Application'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: Success & Reference Code */}
        {step === 4 && submittedRefId && (
          <div className="text-center py-6 animate-fade-in-up">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-extrabold text-white font-heading mb-2">
              Application Submitted!
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
              Your recruitment application for <strong>{formData.domain}</strong> has been received by the
              E-Cell Council. Use your reference code below to track your application review status.
            </p>

            <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 max-w-sm mx-auto mb-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Your Reference Code</p>
                <p className="text-xl font-bold text-amber-300 font-mono">{submittedRefId}</p>
              </div>
              <button
                type="button"
                onClick={copyRefId}
                className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer"
                aria-label="Copy Reference ID"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="btn-primary text-xs py-2.5 px-8 mx-auto"
            >
              Done & Return to Hub
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
