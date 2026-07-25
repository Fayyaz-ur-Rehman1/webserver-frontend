'use client';

import React, { useEffect, useState } from 'react';
import { 
  X, 
  QrCode as QrIcon, 
  CheckCircle2, 
  RefreshCw, 
  Power, 
  ShieldCheck, 
  Smartphone, 
  Battery,
  Phone,
  ArrowRight,
  Edit2,
  Key,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';
import { useApp } from '../app/context/AppContext';

export const QrModal: React.FC = () => {
  const { 
    isQrModalOpen, 
    setIsQrModalOpen, 
    status, 
    connectWhatsApp, 
    requestPairingCode, 
    disconnectWhatsApp, 
    reconnectWhatsApp 
  } = useApp();
  
  const [countryCode, setCountryCode] = useState<string>('+91');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [timer, setTimer] = useState<number>(30);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatingMode, setGeneratingMode] = useState<'qr' | 'code'>('qr');
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: any;
    if (isQrModalOpen && (status.qrCodeUrl || status.pairingCode) && !status.connected) {
      setIsGenerating(false);
      setTimer(30);
      interval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 30));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isQrModalOpen, status.qrCodeUrl, status.pairingCode, status.connected]);

  if (!isQrModalOpen) return null;

  const handleGenerate = async (mode: 'qr' | 'code') => {
    setError(null);
    setGeneratingMode(mode);

    const cleanNumber = phoneNumber.replace(/\D/g, '');
    if (cleanNumber.length < 7 || cleanNumber.length > 12) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    const fullFormattedNumber = `${countryCode}${cleanNumber}`;
    setIsGenerating(true);

    if (mode === 'qr') {
      await connectWhatsApp(fullFormattedNumber, 'qr');
    } else {
      await requestPairingCode(fullFormattedNumber);
    }
  };

  const handleSwitchMode = async (targetMode: 'qr' | 'code') => {
    setError(null);
    setGeneratingMode(targetMode);
    setIsGenerating(true);
    const targetNum = status.targetPhoneNumber || `${countryCode}${phoneNumber.replace(/\D/g, '')}`;
    
    if (targetMode === 'qr') {
      await connectWhatsApp(targetNum, 'qr');
    } else {
      await requestPairingCode(targetNum);
    }
  };

  const handleChangeNumber = async () => {
    setIsGenerating(false);
    setPhoneNumber('');
    setError(null);
    await disconnectWhatsApp();
  };

  const copyCodeToClipboard = () => {
    if (status.pairingCode) {
      navigator.clipboard.writeText(status.pairingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Format pairing code nicely e.g. "ABCD1234" -> ["A","B","C","D","1","2","3","4"]
  const formattedCode = status.pairingCode ? status.pairingCode.replace(/[^A-Za-z0-9]/g, '').toUpperCase() : '';
  const part1 = formattedCode.slice(0, 4);
  const part2 = formattedCode.slice(4, 8);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-brand-500/10 text-brand-500 border border-brand-500/20">
              {status.pairingCode || status.authMode === 'code' ? (
                <Key className="w-5 h-5" />
              ) : (
                <QrIcon className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                WhatsApp Device Authentication
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {status.connected
                  ? 'Active Device Session'
                  : status.pairingCode
                  ? 'Link using 8-Digit Pairing Code'
                  : status.qrCodeUrl
                  ? 'Scan QR code with your mobile WhatsApp'
                  : 'Enter mobile number & choose QR or Code'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsQrModalOpen(false)}
            className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {status.connected ? (
            /* 1. Connected State */
            <div className="w-full flex flex-col items-center text-center space-y-4 py-2">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-500 to-emerald-400 p-1 shadow-glow">
                  {status.user?.avatarUrl ? (
                    <img
                      src={status.user.avatarUrl}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white text-2xl font-bold">
                      {status.user?.pushname ? status.user.pushname.charAt(0) : 'WA'}
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 p-1.5 bg-emerald-500 text-white rounded-full border-2 border-white dark:border-[#111827]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  {status.user?.pushname || 'WhatsApp Account'}
                </h4>
                <p className="text-sm font-medium text-brand-500 font-mono mt-0.5">
                  +{status.user?.phone || 'Connected'}
                </p>
              </div>

              {/* Status Metadata Grid */}
              <div className="w-full grid grid-cols-2 gap-3 pt-2 text-left">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">Device Platform</span>
                  <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-slate-700 dark:text-slate-200">
                    <Smartphone className="w-3.5 h-3.5 text-brand-500" />
                    {status.device?.platform || 'WhatsApp Web'}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">Battery Status</span>
                  <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-slate-700 dark:text-slate-200">
                    <Battery className="w-3.5 h-3.5 text-amber-500" />
                    {status.battery?.level !== undefined ? `${status.battery.level}%` : 'Normal'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full pt-4">
                <button
                  onClick={() => reconnectWhatsApp(phoneNumber ? `${countryCode}${phoneNumber}` : undefined)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" /> Reconnect
                </button>
                <button
                  onClick={disconnectWhatsApp}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-medium text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Power className="w-4 h-4" /> Disconnect
                </button>
              </div>
            </div>
          ) : status.pairingCode || status.authMode === 'code' ? (
            /* 2. Pairing Code Display State */
            <div className="w-full flex flex-col items-center space-y-5">
              {/* Active Target Number Badge */}
              <div className="flex items-center justify-between w-full p-3 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-xs">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-brand-500" />
                  <span className="text-slate-600 dark:text-slate-300">Linking Number:</span>
                  <strong className="font-mono text-brand-500 font-bold">
                    {status.targetPhoneNumber || `${countryCode} ${phoneNumber}`}
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={handleChangeNumber}
                  className="text-[11px] font-semibold text-brand-500 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" /> Change
                </button>
              </div>

              {/* Pairing Code Display Cards */}
              <div className="w-full p-5 rounded-3xl bg-slate-900 border border-brand-500/30 shadow-2xl flex flex-col items-center gap-4">
                <span className="text-xs uppercase font-bold tracking-widest text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-400" /> WhatsApp Pairing Code
                </span>

                {status.pairingCode ? (
                  <div className="flex items-center justify-center gap-2">
                    {/* First 4 Chars */}
                    <div className="flex items-center gap-1.5">
                      {part1.split('').map((char, idx) => (
                        <span
                          key={`p1-${idx}`}
                          className="w-11 h-13 flex items-center justify-center rounded-2xl bg-slate-800 border-2 border-brand-500/40 text-brand-400 font-mono font-extrabold text-2xl shadow-md"
                        >
                          {char}
                        </span>
                      ))}
                    </div>

                    <span className="text-slate-500 text-2xl font-bold font-mono px-1">-</span>

                    {/* Last 4 Chars */}
                    <div className="flex items-center gap-1.5">
                      {part2.split('').map((char, idx) => (
                        <span
                          key={`p2-${idx}`}
                          className="w-11 h-13 flex items-center justify-center rounded-2xl bg-slate-800 border-2 border-brand-500/40 text-brand-400 font-mono font-extrabold text-2xl shadow-md"
                        >
                          {char}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-4 flex items-center gap-2 text-brand-400 font-mono text-sm">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Requesting Pairing Code...
                  </div>
                )}

                {status.pairingCode && (
                  <button
                    onClick={copyCodeToClipboard}
                    className="px-4 py-2 rounded-xl bg-brand-500/20 hover:bg-brand-500/30 border border-brand-500/40 text-brand-300 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Instructions */}
              <div className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-left space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-500" /> How to pair on your phone:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                  <li>Open <strong>WhatsApp</strong> on your mobile phone</li>
                  <li>Tap <strong>Settings / Menu (⋮)</strong> & select <strong>Linked Devices</strong></li>
                  <li>Tap <strong>Link a Device</strong></li>
                  <li>Tap <strong>"Link with phone number instead"</strong> at the bottom</li>
                  <li>Enter the 8-digit code shown above</li>
                </ol>
              </div>

              {/* Toggle to QR Mode */}
              <button
                type="button"
                onClick={() => handleSwitchMode('qr')}
                className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <QrIcon className="w-4 h-4" /> Prefer QR code instead? Switch to QR
              </button>
            </div>
          ) : status.qrCodeUrl ? (
            /* 3. QR Code Scanner Display State */
            <div className="w-full flex flex-col items-center space-y-4">
              {/* Active Target Number Badge */}
              <div className="flex items-center justify-between w-full p-3 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-xs">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-brand-500" />
                  <span className="text-slate-600 dark:text-slate-300">Linking Number:</span>
                  <strong className="font-mono text-brand-500 font-bold">
                    {status.targetPhoneNumber || `${countryCode} ${phoneNumber}`}
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={handleChangeNumber}
                  className="text-[11px] font-semibold text-brand-500 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" /> Change
                </button>
              </div>

              {/* Scannable Real High-Contrast QR Code Image Box */}
              <div className="relative p-4 rounded-3xl bg-white border-2 border-brand-500/40 shadow-2xl group flex items-center justify-center">
                <div className="absolute inset-x-4 top-4 h-0.5 bg-gradient-to-r from-transparent via-brand-500 to-transparent animate-pulse" />
                <img
                  src={status.qrCodeUrl}
                  alt="Real WhatsApp QR Code"
                  className="w-64 h-64 rounded-xl object-contain bg-white p-2 shadow-inner"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-500" />
                Live QR Code • Auto-refresh in <span className="font-bold text-brand-500">{timer}s</span>
              </div>

              {/* Instructions */}
              <div className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-left space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-500" /> How to scan:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <li>Open <strong>WhatsApp</strong> on your mobile phone</li>
                  <li>Tap <strong>Settings / Menu (⋮)</strong> & select <strong>Linked Devices</strong></li>
                  <li>Tap <strong>Link a Device</strong> and point your camera at the QR code above</li>
                </ol>
              </div>

              {/* Toggle to Code Mode */}
              <button
                type="button"
                onClick={() => handleSwitchMode('code')}
                className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Key className="w-4 h-4" /> Prefer 8-digit code? Switch to Pairing Code
              </button>
            </div>
          ) : isGenerating ? (
            /* 4. Loading State */
            <div className="py-12 flex flex-col items-center space-y-4 text-center">
              <div className="w-12 h-12 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {generatingMode === 'code'
                    ? 'Requesting WhatsApp 8-Digit Pairing Code...'
                    : 'Generating Real WhatsApp QR Code...'}
                </p>
                <p className="text-xs font-mono text-brand-500 mt-1">
                  Target Number: {countryCode} {phoneNumber}
                </p>
              </div>
            </div>
          ) : (
            /* 5. Phone Number Input & 2 Action Buttons (QR and Code) */
            <div className="space-y-5 py-2">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center mb-2 shadow-glow">
                  <Phone className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Enter Mobile WhatsApp Number
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Provide your mobile phone number, then select whether to authenticate via QR Code or Pairing Code.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs text-center font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  WhatsApp Mobile Number
                </label>

                <div className="flex items-center gap-2">
                  {/* Country Code Selector */}
                  <div className="relative">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="appearance-none px-3 py-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-bold font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 cursor-pointer pr-7"
                    >
                      <option value="+91">🇮🇳 +91 (India)</option>
                      <option value="+1">🇺🇸 +1 (USA/Canada)</option>
                      <option value="+44">🇬🇧 +44 (UK)</option>
                      <option value="+971">🇦🇪 +971 (UAE)</option>
                      <option value="+65">🇸🇬 +65 (Singapore)</option>
                      <option value="+61">🇦🇺 +61 (Australia)</option>
                    </select>
                  </div>

                  {/* 10-Digit Mobile Number Input */}
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      maxLength={10}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="9876543210"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-sm font-mono font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 tracking-wider"
                      autoFocus
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400">
                      {phoneNumber.length}/10
                    </span>
                  </div>
                </div>
              </div>

              {/* 2 Buttons named QR and Code as requested */}
              <div className="space-y-2 pt-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">
                  Select Authentication Method
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {/* Button 1: QR */}
                  <button
                    type="button"
                    onClick={() => handleGenerate('qr')}
                    disabled={phoneNumber.length < 10}
                    className="py-3.5 px-4 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 hover:border-brand-500/50 shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed group cursor-pointer"
                  >
                    <QrIcon className="w-4 h-4 text-brand-400 group-hover:scale-110 transition-transform" />
                    <span>QR</span>
                  </button>

                  {/* Button 2: Code */}
                  <button
                    type="button"
                    onClick={() => handleGenerate('code')}
                    disabled={phoneNumber.length < 10}
                    className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-glow transition-all disabled:opacity-40 disabled:cursor-not-allowed group cursor-pointer"
                  >
                    <Key className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Code</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
