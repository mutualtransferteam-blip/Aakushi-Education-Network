import React, { useState } from 'react';
import { CoachingEnquiry } from '../types';
import { storageService } from '../services/storageService';
import { X, Send, CheckCircle, Clock, Shield } from 'lucide-react';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: (enquiry: CoachingEnquiry) => void;
  initialClass?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  onSubmitted,
  initialClass = 'Class 10',
}) => {
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    email: '',
    phone: '',
    classLevel: initialClass,
    targetExamOrGoal: 'CBSE Board Exams',
    currentStruggleTopics: '',
    preferredBatchTiming: 'Weekday Evening (5:30 PM – 7:00 PM)',
    additionalNotes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName.trim() || !formData.phone.trim()) {
      setErrorMsg('Please enter the student name and a valid contact phone number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const created = storageService.saveEnquiry({
        studentName: formData.studentName.trim(),
        parentName: formData.parentName.trim() || 'Parent/Guardian',
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        classLevel: formData.classLevel,
        targetExamOrGoal: formData.targetExamOrGoal,
        currentStruggleTopics: formData.currentStruggleTopics.trim() || 'General Mathematics Curriculum',
        preferredBatchTiming: formData.preferredBatchTiming,
        additionalNotes: formData.additionalNotes.trim(),
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      if (onSubmitted) {
        onSubmitted(created);
      }
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg('Failed to submit enquiry. Please try again.');
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setErrorMsg('');
    onClose();
  };

  return (
    <div
      id="enquiry-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={handleResetAndClose}
    >
      <div
        id="enquiry-modal-dialog"
        className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 my-8 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-indigo-300 font-semibold">
              Aakushi Classes
            </span>
            <h3 className="text-lg font-bold">Online Coaching Enquiry</h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Enquiry Received!</h4>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              Thank you for reaching out. The teacher has received your details in the Central Admin console and will contact you via WhatsApp/Phone within 24 hours to schedule an initial diagnostic assessment.
            </p>
            <div className="pt-2">
              <button
                onClick={handleResetAndClose}
                className="px-6 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Student Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Parent / Guardian Name
                </label>
                <input
                  type="text"
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  placeholder="e.g. Ramesh Sharma"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Contact Phone / WhatsApp <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="parent@example.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Class Level</label>
                <select
                  value={formData.classLevel}
                  onChange={(e) => setFormData({ ...formData, classLevel: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                >
                  <option value="Class 9">Class 9 (CBSE / ICSE Foundation)</option>
                  <option value="Class 10">Class 10 (Board Exam Focus)</option>
                  <option value="Class 11">Class 11 (Senior Secondary / Pre-Calculus)</option>
                  <option value="Class 12">Class 12 (Board & Entrance Preparation)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Target / Curriculum</label>
                <input
                  type="text"
                  value={formData.targetExamOrGoal}
                  onChange={(e) => setFormData({ ...formData, targetExamOrGoal: e.target.value })}
                  placeholder="e.g. CBSE 2027 Board, Scoring 90%+"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Specific Mathematics Struggle Topics or Needs
              </label>
              <input
                type="text"
                value={formData.currentStruggleTopics}
                onChange={(e) => setFormData({ ...formData, currentStruggleTopics: e.target.value })}
                placeholder="e.g., Quadratic Equations word problems, Trigonometry proof identities"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Preferred Batch Timing</label>
              <select
                value={formData.preferredBatchTiming}
                onChange={(e) => setFormData({ ...formData, preferredBatchTiming: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
              >
                <option value="Weekday Evening (5:00 PM – 6:30 PM)">Weekday Evening (5:00 PM – 6:30 PM IST)</option>
                <option value="Weekday Evening (6:45 PM – 8:15 PM)">Weekday Evening (6:45 PM – 8:15 PM IST)</option>
                <option value="Weekend Morning (9:00 AM – 11:00 AM)">Weekend Morning (9:00 AM – 11:00 AM IST)</option>
                <option value="Flexible / Either Works">Flexible / Either Works</option>
              </select>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
              <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Privacy Guarantee: Contact information is strictly used by the teacher for coaching coordination. No spam or third-party sharing.
              </span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending...' : 'Submit Enquiry'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
