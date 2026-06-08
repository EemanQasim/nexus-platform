import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Building2, TrendingUp, Eye, EyeOff, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { UserRole } from '../../types';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('entrepreneur');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const pwdStrength = (() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][pwdStrength] || '';
  const strengthColor = ['', 'bg-error-500', 'bg-secondary-500', 'bg-accent-400', 'bg-accent-600'][pwdStrength] || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await register(name, email, password, role);
      navigate(role === 'entrepreneur' ? '/dashboard/entrepreneur' : '/dashboard/investor');
    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-900 via-primary-700 to-secondary-600 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white/5 blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-secondary-500/10 blur-3xl"></div>
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Zap size={22} className="text-white" />
          </div>
          <span className="text-white text-xl font-bold">Business Nexus</span>
        </div>
        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-bold text-white leading-tight">
            Join the Premier<br />
            <span className="text-secondary-300">Investment Network</span>
          </h1>
          <p className="text-primary-200 text-lg">Start your journey to connect, collaborate, and grow together.</p>
          <div className="space-y-3">
            {['Free to join — no credit card required', 'Access to 500+ verified profiles', 'Secure video calls, documents & payments'].map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-primary-100">
                <CheckCircle size={16} className="text-accent-300 flex-shrink-0" />
                <p className="text-sm">{t}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-primary-300 text-sm">© 2026 Business Nexus. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-dark-50 overflow-y-auto">
        <div className="w-full max-w-md py-6">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold text-dark-900">Business Nexus</span>
          </div>

          <h2 className="text-2xl font-bold text-dark-900 mb-1">Create your account</h2>
          <p className="text-dark-500 mb-6">Join thousands of investors and entrepreneurs</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {(['entrepreneur', 'investor'] as const).map(r => (
              <button key={r} onClick={() => setRole(r)}
                className={`flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 transition-all ${
                  role === r ? 'border-primary-500 bg-primary-50 shadow-glow' : 'border-dark-200 bg-white hover:border-primary-300'
                }`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role === r ? 'bg-primary-600' : 'bg-dark-100'}`}>
                  {r === 'entrepreneur'
                    ? <Building2 size={20} className={role === r ? 'text-white' : 'text-dark-500'} />
                    : <TrendingUp size={20} className={role === r ? 'text-white' : 'text-dark-500'} />
                  }
                </div>
                <span className={`text-sm font-semibold capitalize ${role === r ? 'text-primary-700' : 'text-dark-600'}`}>{r}</span>
              </button>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-xl text-sm mb-4">
              <AlertCircle size={16}/> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-dark-700 mb-1.5">Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} required placeholder="John Doe"
                className="w-full px-4 py-2.5 border border-dark-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-700 mb-1.5">Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                className="w-full px-4 py-2.5 border border-dark-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••" minLength={8}
                  className="w-full px-4 py-2.5 border border-dark-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white pr-10" />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400">
                  {showPwd ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i <= pwdStrength ? strengthColor : 'bg-dark-200'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-dark-400">Strength: <span className="font-semibold text-dark-600">{strengthLabel}</span></p>
                </div>
              )}
            </div>
            <Button type="submit" fullWidth isLoading={isLoading} size="lg" rightIcon={<ArrowRight size={16}/>}>
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm text-dark-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
