import { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  User,
  Briefcase,
  FileText,
  Loader2,
  Plus,
  Trash2,
  Link as LinkIcon,
  Globe,
} from 'lucide-react';
import { useLocalStorageDraft } from '../hooks/useLocalStorageDraft';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface SocialLinkItem {
  id: string;
  label: string;
  url: string;
}

interface JoinFormData {
  name: string;
  email: string;
  rollNo: string;
  year: string;
  branch: string;
  domain: string;
  skills: string;
  sop: string;
  socialLinks: SocialLinkItem[];
}

const INITIAL_DATA: JoinFormData = {
  name: '',
  email: '',
  rollNo: '',
  year: '',
  branch: '',
  domain: '',
  skills: '',
  sop: '',
  socialLinks: [
    { id: '1', label: 'LinkedIn', url: '' },
    { id: '2', label: 'GitHub', url: '' },
  ],
};

const STEPS = [
  { label: 'Personal Info', icon: User },
  { label: 'Domain & Skills', icon: Briefcase },
  { label: 'SOP & Handles', icon: FileText },
];

const DOMAINS = [
  'Web AND Tech',
  'Graphic Designer',
  'General Management',
  'Photography',
  'Content Writing',
  'Promotion And Outreach',
];

const BRANCHES = [
  'AIML',
  'CSE',
  'ME',
  'CE',
  'ECO',
  'ECE',
  'BIOTECHNOLOGY',
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const PLATFORM_PRESETS = [
  'LinkedIn',
  'GitHub',
  'Portfolio Website',
  'Behance',
  'Dribbble',
  'Instagram',
  'Twitter / X',
  'Google Drive / Resume',
  'YouTube',
  'Medium / Blog',
  'Other',
];

function validateStep(step: number, data: JoinFormData): string | null {
  if (step === 0) {
    if (!data.name.trim()) return 'Name is required';
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return 'Valid email address is required';
    if (!data.rollNo.trim()) return 'Roll number is required';
    if (!/^\d{1,9}$/.test(data.rollNo.trim())) return 'Roll number must be numbers only (maximum 9 digits)';
    if (!data.year) return 'Please select your current year';
    if (!data.branch) return 'Please select your branch';
  }
  if (step === 1) {
    if (!data.domain) return 'Please select your preferred domain';
    if (!data.skills.trim()) return 'Please describe your relevant skills and experience';
  }
  if (step === 2) {
    if (!data.sop.trim() || data.sop.trim().length < 50) return 'Statement of Purpose must be at least 50 characters';
    for (const link of data.socialLinks || []) {
      if (link.url && link.url.trim()) {
        try {
          new URL(link.url.startsWith('http') ? link.url : `https://${link.url}`);
        } catch {
          return `Please enter a valid URL for ${link.label || 'social link'}`;
        }
      }
    }
  }
  return null;
}

export function JoinModal({ isOpen, onClose }: JoinModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, saveDraft, clearDraft] = useLocalStorageDraft<JoinFormData>(
    'ecell_join_draft_v3',
    'v3.0',
    INITIAL_DATA
  );

  // Open/close dialog
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };

    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [onClose]);

  const updateField = useCallback(
    (field: keyof JoinFormData, value: any) => {
      const updated = { ...formData, [field]: value };
      saveDraft(updated);
      setError(null);
    },
    [formData, saveDraft]
  );

  // Handle Roll Number with max 9 digits strictly numeric
  const handleRollNoChange = (raw: string) => {
    const numericOnly = raw.replace(/\D/g, '').slice(0, 9);
    updateField('rollNo', numericOnly);
  };

  // Social link helpers
  const handleAddSocialLink = () => {
    const nextId = String(Date.now());
    const currentLinks = Array.isArray(formData.socialLinks) ? formData.socialLinks : [];
    const updated = [...currentLinks, { id: nextId, label: 'Portfolio Website', url: '' }];
    updateField('socialLinks', updated);
  };

  const handleUpdateSocialLink = (id: string, key: 'label' | 'url', val: string) => {
    const currentLinks = Array.isArray(formData.socialLinks) ? formData.socialLinks : [];
    const updated = currentLinks.map((item) =>
      item.id === id ? { ...item, [key]: val } : item
    );
    updateField('socialLinks', updated);
  };

  const handleRemoveSocialLink = (id: string) => {
    const currentLinks = Array.isArray(formData.socialLinks) ? formData.socialLinks : [];
    const updated = currentLinks.filter((item) => item.id !== id);
    updateField('socialLinks', updated);
  };

  const nextStep = () => {
    const err = validateStep(step, formData);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setStep((s) => Math.min(s + 1, 2));
  };

  const prevStep = () => {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    const err = validateStep(step, formData);
    if (err) {
      setError(err);
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1400));
    setSubmitting(false);
    setSubmitted(true);
    clearDraft();
  };

  const handleClose = () => {
    if (submitted) {
      setStep(0);
      setSubmitted(false);
      setError(null);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-0 w-full h-full"
      aria-label="Join E-Cell Application"
    >
      <div className="min-h-screen w-full flex items-center justify-center p-4">
        <div className="ecell-card w-full max-w-xl p-6 sm:p-8 relative bg-[#0b101c] border border-slate-700/80 shadow-2xl max-h-[92vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer z-10"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {submitted ? (
            /* Success State */
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                <Check className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white font-heading mb-2">Application Submitted!</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
                Thank you for applying to join the <strong>E-Cell Council</strong>. Our executive board
                will review your submission and notify you for interview rounds within 3–5 business days.
              </p>
              <button onClick={handleClose} className="btn-primary text-sm py-2.5 px-6 mx-auto">
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white font-heading">Join E-Cell Council</h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Step {step + 1} of 3 — <span className="text-blue-400 font-semibold">{STEPS[step].label}</span>
                </p>
              </div>

              {/* Step Indicator */}
              <div className="flex items-center gap-2 mb-8">
                {STEPS.map((s, i) => (
                  <div key={s.label} className="flex items-center gap-2 flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        i <= step
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40 shadow-sm'
                          : 'bg-slate-800 text-slate-600 border border-slate-700'
                      }`}
                    >
                      {i < step ? <Check className="w-4 h-4" /> : i + 1}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 rounded ${i < step ? 'bg-blue-500/40' : 'bg-slate-800'}`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-5 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs sm:text-sm text-red-400 animate-fade-in-up">
                  {error}
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  STEP 1: PERSONAL INFO
                 ───────────────────────────────────────────────────────────── */}
              {step === 0 && (
                <div className="space-y-4 animate-fade-in-up">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="e.g. John Doe"
                      className="ecell-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="student@uietkuk.ac.in"
                      className="ecell-input"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-400">
                        Roll Number <span className="text-red-400">*</span>
                      </label>
                      <span className="text-[11px] font-mono text-slate-500">
                        {formData.rollNo.length}/9 digits (numbers only)
                      </span>
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={9}
                      value={formData.rollNo}
                      onChange={(e) => handleRollNoChange(e.target.value)}
                      placeholder="e.g. 2204123"
                      className="ecell-input font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                        Year <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={formData.year}
                        onChange={(e) => updateField('year', e.target.value)}
                        className="ecell-input cursor-pointer"
                      >
                        <option value="">Select Year</option>
                        {YEARS.map((y) => (
                          <option key={y} value={y} className="bg-[#121724] text-white">
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                        Branch <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={formData.branch}
                        onChange={(e) => updateField('branch', e.target.value)}
                        className="ecell-input cursor-pointer"
                      >
                        <option value="">Select Branch</option>
                        {BRANCHES.map((b) => (
                          <option key={b} value={b} className="bg-[#121724] text-white">
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  STEP 2: DOMAIN & SKILLS
                 ───────────────────────────────────────────────────────────── */}
              {step === 1 && (
                <div className="space-y-4 animate-fade-in-up">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Preferred Domain <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.domain}
                      onChange={(e) => updateField('domain', e.target.value)}
                      className="ecell-input cursor-pointer"
                    >
                      <option value="">Select a Domain</option>
                      {DOMAINS.map((d) => (
                        <option key={d} value={d} className="bg-[#121724] text-white">
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Skills, Tools & Prior Experience <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={formData.skills}
                      onChange={(e) => updateField('skills', e.target.value)}
                      placeholder="Describe your technical skills, creative tools (Figma, Premiere, React, etc.), event coordination, or writing experience..."
                      rows={5}
                      className="ecell-input resize-none text-sm"
                    />
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  STEP 3: STATEMENT OF PURPOSE & MULTI-SOCIAL LINKS
                 ───────────────────────────────────────────────────────────── */}
              {step === 2 && (
                <div className="space-y-5 animate-fade-in-up">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-400">
                        Statement of Purpose <span className="text-red-400">*</span>
                      </label>
                      <span className="text-[11px] font-mono text-slate-500">
                        {formData.sop.length}/50 min chars
                      </span>
                    </div>
                    <textarea
                      value={formData.sop}
                      onChange={(e) => updateField('sop', e.target.value)}
                      placeholder="Why do you want to join E-Cell UIET KUK? What will you contribute to the community?"
                      rows={4}
                      className="ecell-input resize-none text-sm"
                    />
                  </div>

                  {/* Dynamic Multi-Link & Social Handles Manager */}
                  <div className="pt-3 border-t border-slate-800">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-blue-400" />
                        Portfolio, Work Experience & Social Links
                      </label>
                      <span className="text-[10px] text-slate-500 font-mono">(Optional)</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">
                      Add URLs to showcase your work (LinkedIn, GitHub, Behance, Drive, Portfolio, etc.)
                    </p>

                    {/* Clean Multi-Link Cards */}
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                      {(formData.socialLinks || []).map((item, idx) => (
                        <div
                          key={item.id}
                          className="p-3 rounded-xl bg-[#0f1526] border border-slate-700/80 space-y-2 transition-all hover:border-slate-600"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                              <LinkIcon className="w-3 h-3 text-blue-400" />
                              Link #{idx + 1}
                            </span>

                            {(formData.socialLinks.length > 1 || item.url) && (
                              <button
                                type="button"
                                onClick={() => handleRemoveSocialLink(item.id)}
                                className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Remove</span>
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {/* Platform Select */}
                            <select
                              value={item.label}
                              onChange={(e) => handleUpdateSocialLink(item.id, 'label', e.target.value)}
                              className="ecell-input !py-2 !px-3 text-xs bg-[#161f38] border-slate-700/90 cursor-pointer sm:col-span-1"
                            >
                              {PLATFORM_PRESETS.map((p) => (
                                <option key={p} value={p} className="bg-[#121724] text-white">
                                  {p}
                                </option>
                              ))}
                            </select>

                            {/* URL Input Box */}
                            <div className="sm:col-span-2">
                              <input
                                type="url"
                                value={item.url}
                                onChange={(e) => handleUpdateSocialLink(item.id, 'url', e.target.value)}
                                placeholder={`Paste your ${item.label || 'profile'} URL (https://...)`}
                                className="ecell-input !py-2 !px-3 text-xs font-mono bg-[#161f38] border-slate-700/90 text-white placeholder:text-slate-500 w-full"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add More URL Button */}
                    <button
                      type="button"
                      onClick={handleAddSocialLink}
                      className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-xs font-semibold text-blue-300 border border-blue-500/25 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Another Link (Portfolio, GitHub, Behance...)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation Bar */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
                {step > 0 ? (
                  <button onClick={prevStep} className="btn-secondary text-sm py-2.5 px-5">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}

                {step < 2 ? (
                  <button onClick={nextStep} className="btn-primary text-sm py-2.5 px-5">
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="btn-primary text-sm py-2.5 px-5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Submit Application</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Draft indicator */}
              <p className="mt-4 text-[10px] text-slate-500 text-center font-mono">
                Your draft is auto-saved locally and expires in 24 hours.
              </p>
            </>
          )}
        </div>
      </div>
    </dialog>
  );
}
