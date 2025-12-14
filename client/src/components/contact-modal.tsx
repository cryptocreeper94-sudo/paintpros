import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send message');
      }
      return response.json();
    },
    onSuccess: () => {
      setFormData({ name: '', email: '', company: '', message: '' });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        data-testid="modal-contact"
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
          className="relative glass-panel rounded-2xl border border-accent/30 w-full max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto p-6 shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
            data-testid="button-close-contact-modal"
          >
            <X className="w-4 h-4" />
          </button>

          <h2 className="text-xl md:text-2xl font-display font-bold mb-2">Contact Us</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Interested in PaintPros.io for your business? Let's talk.
          </p>

          {contactMutation.isSuccess ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Message Sent!</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We'll get back to you as soon as possible.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-accent text-primary font-bold rounded-lg hover:bg-accent/90 transition-colors"
                data-testid="button-close-success"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-background/50 border border-white/10 rounded-lg focus:border-accent focus:outline-none text-foreground"
                  placeholder="Your name"
                  data-testid="input-contact-name"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-background/50 border border-white/10 rounded-lg focus:border-accent focus:outline-none text-foreground"
                  placeholder="your@email.com"
                  data-testid="input-contact-email"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2 bg-background/50 border border-white/10 rounded-lg focus:border-accent focus:outline-none text-foreground"
                  placeholder="Your company name"
                  data-testid="input-contact-company"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Message *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 bg-background/50 border border-white/10 rounded-lg focus:border-accent focus:outline-none text-foreground resize-none"
                  placeholder="Tell us about your business and what you're looking for..."
                  data-testid="input-contact-message"
                />
              </div>

              {contactMutation.isError && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{contactMutation.error?.message || 'Failed to send message'}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={contactMutation.isPending}
                className="w-full py-3 bg-accent text-primary font-bold rounded-lg hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                data-testid="button-submit-contact"
              >
                {contactMutation.isPending ? (
                  'Sending...'
                ) : (
                  <>
                    Send Message <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
