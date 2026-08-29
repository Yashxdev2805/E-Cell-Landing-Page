import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Check, Send, Loader2 } from 'lucide-react';
import { useLocalStorageDraft } from '../hooks/useLocalStorageDraft';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ContactFormData {
  name: string;
  email: string;
  organization: string;
  subject: string;
  message: string;
}

const INITIAL_DATA: ContactFormData = {
  name: '',
  email: '',
  organization: '',
  subject: '',
  message: '',
};

function validate(data: ContactFormData): string | null {
  if (!data.name.trim()) return 'Name is required';
  if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return 'Valid email is required';
  if (!data.subject.trim()) return 'Subject is required';
  if (!data.message.trim() || data.message.trim().length < 10) return 'Message must be at least 10 characters';
  return null;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, saveDraft, clearDraft] = useLocalStorageDraft<ContactFormData>(
    'ecell_contact_draft',
    'v1.0',
    INITIAL_DATA
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

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
    (field: keyof ContactFormData, value: string) => {
      saveDraft({ ...formData, [field]: value });
      setError(null);
    },
    [formData, saveDraft]
  );

  const handleSubmit = async () => {
    const err = validate(formData);
    if (err) {
      setError(err);
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
    clearDraft();
  };

  const handleClose = () => {
    if (submitted) {
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
      aria-label="Contact E-Cell"
    >
      <div className="min-h-screen w-full flex items-center justify-center p-4">
        <div className="ecell-card w-full max-w-lg p-6 sm:p-8 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white font-heading mb-2">Message Sent!</h3>
              <p className="text-sm text-slate-400 mb-6">
                Thank you for reaching out. Our team will respond within 2-3 business days.
              </p>
              <button onClick={handleClose} className="btn-primary text-sm py-2.5 px-6">
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white font-heading">Contact Us</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Sponsorship inquiries, mentorship requests, or general questions.
                </p>
              </div>

              {error && (
                <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="Your name"
                      className="ecell-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="you@email.com"
                      className="ecell-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Organization <span className="text-slate-600">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => updateField('organization', e.target.value)}
                    placeholder="Company or institution"
                    className="ecell-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => updateField('subject', e.target.value)}
                    placeholder="What's this about?"
                    className="ecell-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => updateField('message', e.target.value)}
                    placeholder="Your message..."
                    rows={4}
                    className="ecell-input resize-none"
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="btn-primary text-sm py-2.5 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>

              <p className="mt-4 text-[10px] text-slate-600 text-center font-mono">
                Your draft is auto-saved locally and expires in 24 hours.
              </p>
            </>
          )}
        </div>
      </div>
    </dialog>
  );
}
