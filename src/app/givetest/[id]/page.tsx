'use client';
import React, { useState } from 'react';
import { Shield, MapPin, Clock, FileText } from 'lucide-react';

export default function Page() {
  const [ans1, setAns1] = useState('');
  const [ans2, setAns2] = useState('');
  const [ans3, setAns3] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Simulated submission
    setIsSubmitting(true);
    setTimeout(() => {
      alert("Test submitted successfully!");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-gradient-to-br from-black via-gray-800 to-neutral-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-300 to-gray-300 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-bold text-black">Ownership Verification</h1>
          </div>
          <p className="text-black">Please provide detailed information to verify your claim</p>
        </div>

        {/* Form Content */}
        <div className="p-8 space-y-6">
          {/* Question 1 */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-gray-200 font-semibold text-lg">
              <MapPin className="w-5 h-5 text-blue-400" />
              Where did you lose the item?
            </label>
            <textarea
              value={ans1}
              onChange={(e) => setAns1(e.target.value)}
              placeholder="Please describe the location in detail..."
              className="w-full bg-slate-950 text-gray-100 border border-gray-600 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all resize-none"
              rows={3}
            />
          </div>

          {/* Question 2 */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-gray-200 font-semibold text-lg">
              <Clock className="w-5 h-5 text-purple-400" />
              When did you lose the item?
            </label>
            <textarea
              value={ans2}
              onChange={(e) => setAns2(e.target.value)}
              placeholder="Provide date and approximate time..."
              className="w-full bg-slate-950 text-gray-100 border border-gray-600 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-transparent transition-all resize-none"
              rows={3}
            />
          </div>

          {/* Question 3 */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-gray-200 font-semibold text-lg">
              <FileText className="w-5 h-5 text-green-400" />
              Any unique marks or proof of ownership?
            </label>
            <textarea
              value={ans3}
              onChange={(e) => setAns3(e.target.value)}
              placeholder="Describe unique features, serial numbers, receipts, photos, etc..."
              className="w-full bg-slate-950 text-gray-100 border border-gray-600 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent transition-all resize-none"
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !ans1 || !ans2 || !ans3}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                Submit Verification
              </>
            )}
          </button>

          {/* Info Message */}
          <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 mt-4">
            <p className="text-gray-300 text-sm text-center">
              🔒 Your information will be securely verified by our team
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}