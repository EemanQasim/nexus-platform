import React, { useState } from 'react';
import {
  Shield, Lock, Smartphone, Eye, EyeOff, CheckCircle, X,
  AlertTriangle, Key, Activity, Clock, Globe
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

const getStrength = (pwd: string): { score: number; label: string; color: string } => {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 1) return { score, label: 'Very Weak', color: 'bg-error-500' };
  if (score === 2) return { score, label: 'Weak', color: 'bg-warning-500' };
  if (score === 3) return { score, label: 'Fair', color: 'bg-secondary-500' };
  if (score === 4) return { score, label: 'Strong', color: 'bg-accent-500' };
  return { score, label: 'Very Strong', color: 'bg-accent-600' };
};

const recentActivity = [
  { action: 'Login from Chrome', location: 'Lahore, PK', time: '2 minutes ago', device: 'Desktop', suspicious: false },
  { action: 'Password changed', location: 'Lahore, PK', time: '3 days ago', device: 'Desktop', suspicious: false },
  { action: 'Login attempt failed', location: 'Unknown', time: '5 days ago', device: 'Unknown', suspicious: true },
  { action: 'Login from Safari', location: 'Karachi, PK', time: '1 week ago', device: 'Mobile', suspicious: false },
];

export const SecurityPage: React.FC = () => {
  const { user } = useAuth();
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [currentPwd, setCurrentPwd] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [otpInput, setOtpInput] = useState(['', '', '', '', '', '']);
  const [pwdSaved, setPwdSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'password' | '2fa' | 'activity' | 'sessions'>('password');

  const strength = getStrength(newPwd);
  const pwdMatch = confirmPwd.length > 0 && newPwd === confirmPwd;
  const pwdMismatch = confirmPwd.length > 0 && newPwd !== confirmPwd;

  const pwdChecks = [
    { label: 'At least 8 characters', ok: newPwd.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(newPwd) },
    { label: 'Number', ok: /[0-9]/.test(newPwd) },
    { label: 'Special character', ok: /[^A-Za-z0-9]/.test(newPwd) },
  ];

  const handleSavePwd = () => {
    if (!newPwd || !pwdMatch || strength.score < 3) return;
    setPwdSaved(true);
    setNewPwd(''); setConfirmPwd(''); setCurrentPwd('');
    setTimeout(() => setPwdSaved(false), 3000);
  };

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otpInput];
    next[i] = val;
    setOtpInput(next);
    if (val && i < 5) {
      const el = document.getElementById(`otp-${i + 1}`);
      el?.focus();
    }
  };

  const handleVerifyOTP = () => {
    if (otpInput.join('').length === 6) {
      setTwoFAEnabled(true);
      setShow2FASetup(false);
      setOtpInput(['', '', '', '', '', '']);
    }
  };

  const activeSessions = [
    { device: 'Chrome on Windows', location: 'Lahore, PK', lastActive: 'Now (current)', icon: <Globe size={16}/> },
    { device: 'Safari on iPhone', location: 'Karachi, PK', lastActive: '2 hours ago', icon: <Smartphone size={16}/> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-dark-900">Security Center</h1>
        <p className="text-dark-500">Manage your account security and access controls</p>
      </div>

      {/* Security score */}
      <Card className="bg-gradient-to-r from-primary-600 to-primary-700 border-0 text-white">
        <CardBody>
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                <Shield size={32} className="text-white" />
              </div>
              <div>
                <p className="text-primary-100 text-sm font-medium">Security Score</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">{twoFAEnabled ? 92 : 68}</span>
                  <span className="text-primary-200">/100</span>
                </div>
                <p className="text-primary-100 text-sm">{twoFAEnabled ? 'Excellent protection' : 'Enable 2FA to boost score'}</p>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {[
                { label: 'Strong Password', done: true },
                { label: 'Two-Factor Auth', done: twoFAEnabled },
                { label: 'Email Verified', done: true },
                { label: 'Recent Activity Reviewed', done: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  {item.done ? <CheckCircle size={15} className="text-accent-300 flex-shrink-0"/> : <X size={15} className="text-primary-300 flex-shrink-0"/>}
                  <span className={`text-sm ${item.done ? 'text-white' : 'text-primary-200 line-through'}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 bg-dark-100 p-1 rounded-xl w-fit flex-wrap">
        {(['password', '2fa', 'activity', 'sessions'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
              activeTab === tab ? 'bg-white text-primary-700 shadow-sm' : 'text-dark-500 hover:text-dark-700'
            }`}>
            {tab === '2fa' ? '2FA' : tab === 'activity' ? 'Activity Log' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'password' && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock size={18} className="text-primary-600" />
              <h2 className="font-bold text-dark-900">Change Password</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-5 max-w-md">
            {pwdSaved && (
              <div className="flex items-center gap-2 bg-accent-50 border border-accent-200 text-accent-700 px-4 py-3 rounded-xl text-sm font-semibold">
                <CheckCircle size={16}/> Password updated successfully!
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-dark-700 mb-1.5">Current Password</label>
              <div className="relative">
                <input type={showCurrent ? 'text' : 'password'} value={currentPwd} onChange={e => setCurrentPwd(e.target.value)}
                  className="w-full px-4 py-2.5 border border-dark-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 pr-10" />
                <button onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400">
                  {showCurrent ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark-700 mb-1.5">New Password</label>
              <div className="relative">
                <input type={showNew ? 'text' : 'password'} value={newPwd} onChange={e => setNewPwd(e.target.value)}
                  className="w-full px-4 py-2.5 border border-dark-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 pr-10" />
                <button onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400">
                  {showNew ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
              {newPwd.length > 0 && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-dark-500">Strength:</span>
                    <span className={`font-bold ${
                      strength.score <= 2 ? 'text-error-600' : strength.score === 3 ? 'text-secondary-600' : 'text-accent-600'
                    }`}>{strength.label}</span>
                  </div>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : 'bg-dark-200'}`} />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 mt-2">
                    {pwdChecks.map((c, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs">
                        {c.ok ? <CheckCircle size={12} className="text-accent-500"/> : <X size={12} className="text-dark-300"/>}
                        <span className={c.ok ? 'text-accent-600' : 'text-dark-400'}>{c.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark-700 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <input type={showConfirm ? 'text' : 'password'} value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 pr-10 ${
                    pwdMismatch ? 'border-error-400 bg-error-50' : pwdMatch ? 'border-accent-400 bg-accent-50' : 'border-dark-200'
                  }`} />
                <button onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400">
                  {showConfirm ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
              {pwdMismatch && <p className="text-xs text-error-500 mt-1">Passwords don't match</p>}
              {pwdMatch && <p className="text-xs text-accent-600 mt-1 flex items-center gap-1"><CheckCircle size={12}/> Passwords match</p>}
            </div>

            <Button onClick={handleSavePwd} disabled={!pwdMatch || strength.score < 3 || !currentPwd} leftIcon={<Key size={15}/>}>
              Update Password
            </Button>
          </CardBody>
        </Card>
      )}

      {activeTab === '2fa' && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Smartphone size={18} className="text-primary-600" />
              <h2 className="font-bold text-dark-900">Two-Factor Authentication</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className={`flex items-center justify-between p-4 rounded-2xl border-2 ${twoFAEnabled ? 'border-accent-300 bg-accent-50' : 'border-dark-200 bg-dark-50'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${twoFAEnabled ? 'bg-accent-500' : 'bg-dark-300'}`}>
                  <Shield size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-dark-900">Authenticator App</p>
                  <p className="text-sm text-dark-500">{twoFAEnabled ? 'Active — your account is protected' : 'Add an extra layer of security'}</p>
                </div>
              </div>
              <button onClick={() => twoFAEnabled ? setTwoFAEnabled(false) : setShow2FASetup(true)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  twoFAEnabled ? 'text-error-600 hover:bg-error-50 border border-error-200' : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}>
                {twoFAEnabled ? 'Disable' : 'Enable'}
              </button>
            </div>

            {show2FASetup && !twoFAEnabled && (
              <div className="bg-dark-50 rounded-2xl p-5 space-y-4 border border-dark-200">
                <h3 className="font-bold text-dark-900">Setup Authenticator App</h3>
                <div className="space-y-2 text-sm text-dark-600">
                  <p className="flex items-start gap-2"><span className="w-5 h-5 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>Download Google Authenticator or Authy on your phone</p>
                  <p className="flex items-start gap-2"><span className="w-5 h-5 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>Scan the QR code or enter the setup key manually</p>
                  <p className="flex items-start gap-2"><span className="w-5 h-5 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</span>Enter the 6-digit code below to verify</p>
                </div>

                {/* Mock QR code */}
                <div className="flex justify-center">
                  <div className="w-36 h-36 border-2 border-dark-300 rounded-xl p-2 bg-white">
                    <div className="w-full h-full grid grid-cols-8 gap-0.5">
                      {Array.from({length: 64}).map((_, i) => (
                        <div key={i} className={`rounded-sm ${Math.random() > 0.5 ? 'bg-dark-900' : 'bg-white'}`}></div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-xs text-dark-400 mb-1">Setup key</p>
                  <code className="text-sm font-mono bg-white border border-dark-200 px-3 py-1.5 rounded-lg text-dark-700">NEXUS-2FA-X4K2-P9WQ</code>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark-700 mb-2">Enter 6-digit code</label>
                  <div className="flex gap-2 justify-center">
                    {otpInput.map((digit, i) => (
                      <input key={i} id={`otp-${i}`} value={digit} onChange={e => handleOtpChange(i, e.target.value)}
                        maxLength={1} type="text" inputMode="numeric"
                        className="w-11 h-12 border-2 border-dark-200 rounded-xl text-center text-lg font-bold text-dark-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all" />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" fullWidth onClick={() => { setShow2FASetup(false); setOtpInput(['','','','','','']); }}>Cancel</Button>
                  <Button fullWidth onClick={handleVerifyOTP} disabled={otpInput.join('').length < 6}>Verify & Enable</Button>
                </div>
              </div>
            )}

            <div className="space-y-2 text-sm text-dark-500 bg-primary-50 rounded-xl p-4 border border-primary-100">
              <p className="font-semibold text-primary-700 flex items-center gap-1.5"><Shield size={14}/> Why use 2FA?</p>
              <p>Two-factor authentication adds an extra layer of security by requiring a code from your phone in addition to your password.</p>
            </div>
          </CardBody>
        </Card>
      )}

      {activeTab === 'activity' && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-primary-600" />
              <h2 className="font-bold text-dark-900">Recent Activity</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border ${item.suspicious ? 'border-warning-300 bg-warning-50' : 'border-dark-100 bg-dark-50'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.suspicious ? 'bg-warning-500' : 'bg-primary-600'}`}>
                    {item.suspicious ? <AlertTriangle size={18} className="text-white"/> : <CheckCircle size={18} className="text-white"/>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-dark-900 text-sm">{item.action}</p>
                    <p className="text-xs text-dark-400 flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1"><Globe size={11}/>{item.location}</span>
                      <span className="flex items-center gap-1"><Clock size={11}/>{item.time}</span>
                    </p>
                  </div>
                  {item.suspicious && (
                    <span className="text-xs font-bold text-warning-700 bg-warning-100 px-2 py-1 rounded-full flex-shrink-0">Review</span>
                  )}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {activeTab === 'sessions' && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe size={18} className="text-primary-600" />
              <h2 className="font-bold text-dark-900">Active Sessions</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {activeSessions.map((s, i) => (
                <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border ${i === 0 ? 'border-accent-300 bg-accent-50' : 'border-dark-100 bg-dark-50'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${i === 0 ? 'bg-accent-500' : 'bg-dark-400'}`}>
                    {s.icon}
                    <span className="text-white sr-only">{s.device}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-dark-900 text-sm">{s.device}</p>
                    <p className="text-xs text-dark-400">{s.location} · {s.lastActive}</p>
                    {i === 0 && <span className="text-xs font-bold text-accent-600">Current session</span>}
                  </div>
                  {i !== 0 && (
                    <Button variant="danger" size="xs">Revoke</Button>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-dark-100">
              <Button variant="danger" size="sm">Revoke All Other Sessions</Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};
