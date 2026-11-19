'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, ShieldCheck, ArrowRight, RefreshCw, Smartphone, KeyRound } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const OtpModal: React.FC = () => {
  const { isOtpModalOpen, closeOtpModal, sendOtp, verifyOtp } = useAuth();
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devOtp, setDevOtp] = useState<string | null>(null);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOtpModalOpen) {
      setStep('PHONE');
      setPhone('');
      setOtp(['', '', '', '', '', '']);
      setError(null);
      setDevOtp(null);
    }
  }, [isOtpModalOpen]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  if (!isOtpModalOpen) return null;

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    try {
      setLoading(true);
      const res = await sendOtp(cleanPhone);
      setDevOtp(res.devOtp || null);
      setStep('OTP');
      setCooldown(60);
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    const char = val.slice(-1);
    if (val && !/^\d+$/.test(char)) return;

    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);

    // Auto-advance
    if (char && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (char && index === 5 && newOtp.every((d) => d !== '')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const digits = pasted.split('');
      setOtp(digits);
      handleVerify(pasted);
    }
  };

  const handleVerify = async (codeToVerify?: string) => {
    const fullCode = codeToVerify || otp.join('');
    if (fullCode.length !== 6) {
      setError('Please enter the full 6-digit verification code');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await verifyOtp(phone, fullCode);
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-md bg-[#FAF6F0] rounded-2xl border border-[#E6D9C9] shadow-2xl p-6 sm:p-8 overflow-hidden text-[#0B0B0B]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeOtpModal}
          className="absolute top-4 right-4 p-2 text-[#8B8178] hover:text-[#5B0F18] transition-colors rounded-full hover:bg-black/5"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#5B0F18] text-[#C6A15B] mb-3 shadow-md">
            {step === 'PHONE' ? (
              <Smartphone className="w-6 h-6 stroke-[1.5]" />
            ) : (
              <KeyRound className="w-6 h-6 stroke-[1.5]" />
            )}
          </div>
          <span className="block text-[10px] uppercase font-sans tracking-[0.25em] text-[#C6A15B] font-semibold">
            UNSULID® FINE FRAGRANCES
          </span>
          <h2 className="font-serif text-2xl text-[#0B0B0B] font-normal mt-1">
            {step === 'PHONE' ? 'Sign In / Register' : 'Enter Verification Code'}
          </h2>
          <p className="font-sans text-xs text-[#8B8178] mt-1.5 max-w-xs mx-auto">
            {step === 'PHONE'
              ? 'Enter your mobile number to access your cart, addresses, and order history.'
              : `We sent a 6-digit code to +91 ${phone.replace(/(\d{5})(\d{5})/, '$1 $2')}`}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-sans text-center">
            {error}
          </div>
        )}

        {/* Dev Mode OTP Indicator for Instant Seamless Testing */}
        {devOtp && (
          <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-sans flex items-center justify-between">
            <span className="font-medium">Testing Mode OTP:</span>
            <button
              type="button"
              onClick={() => {
                const digits = devOtp.split('');
                setOtp(digits);
                handleVerify(devOtp);
              }}
              className="px-2.5 py-1 bg-[#5B0F18] text-white rounded font-mono font-bold text-xs hover:bg-[#741522] transition-colors"
            >
              Fill {devOtp} →
            </button>
          </div>
        )}

        {step === 'PHONE' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-sans font-medium text-[#0B0B0B] mb-1.5">
                Mobile Number
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 font-sans font-semibold text-xs text-[#5B0F18] border-r border-[#E6D9C9] pr-2.5">
                  +91
                </span>
                <input
                  type="tel"
                  autoFocus
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="98765 43210"
                  className="w-full bg-white border border-[#E6D9C9] rounded-xl py-3 pl-16 pr-4 font-sans text-sm text-[#0B0B0B] placeholder:text-[#8B8178]/60 focus:outline-none focus:border-[#5B0F18] focus:ring-1 focus:ring-[#5B0F18]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || phone.replace(/\D/g, '').length !== 10}
              className="w-full py-3.5 px-4 rounded-xl bg-[#5B0F18] text-[#F8F1E7] font-sans font-semibold text-sm hover:bg-[#741522] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] font-sans text-[#8B8178] pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#5B0F18]" />
              <span>Instant 6-digit OTP verification via SMS</span>
            </div>
          </form>
        ) : (
          <div className="space-y-5">
            {/* 6 OTP Inputs */}
            <div className="flex justify-between gap-2" onPaste={handlePaste}>
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    otpInputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-12 h-13 text-center font-serif text-xl font-bold bg-white border border-[#E6D9C9] rounded-xl text-[#0B0B0B] focus:outline-none focus:border-[#5B0F18] focus:ring-2 focus:ring-[#5B0F18]/20 transition-all shadow-sm"
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleVerify()}
              disabled={loading || otp.some((d) => d === '')}
              className="w-full py-3.5 px-4 rounded-xl bg-[#5B0F18] text-[#F8F1E7] font-sans font-semibold text-sm hover:bg-[#741522] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Verify & Proceed</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Resend & Edit Mobile Controls */}
            <div className="flex items-center justify-between text-xs font-sans text-[#8B8178] pt-1">
              <button
                type="button"
                onClick={() => setStep('PHONE')}
                className="hover:text-[#5B0F18] underline transition-colors"
              >
                Change mobile number
              </button>

              {cooldown > 0 ? (
                <span>Resend in {cooldown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSendOtp()}
                  disabled={loading}
                  className="text-[#5B0F18] font-semibold hover:underline transition-colors"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtpModal;

