import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Eye, EyeOff, AlertCircle, Building2, TrendingUp, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('entrepreneur');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password, role);
      navigate(role === 'entrepreneur' ? '/dashboard/entrepreneur' : '/dashboard/investor');
    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
    }
  };

  const fillDemo = (r: UserRole) => {
    setEmail(r === 'entrepreneur' ? 'sarah@techwave.io' : 'michael@vcinnovate.com');
    setPassword('password123');
    setRole(r);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-900 via-primary-700 to-secondary-600 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white/5 blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-secondary-500/10 blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Zap size={22} className="text-white" />
            </div>
            <span className="text-white text-xl font-bold">Business Nexus</span>
          </div>
        </div>
        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight">
              Where Investors Meet<br />
              <span className="text-secondary-300">Entrepreneurs</span>
            </h1>
            <p className="text-primary-200 mt-4 text-lg">
              The premier platform to connect, collaborate, and close deals that shape the future.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { icon: <Building2 size={18}/>, text: '500+ verified startups seeking funding' },
              { icon: <TrendingUp size={18}/>, text: '$2.4B+ in deals facilitated' },
              { icon: <Zap size={18}/>, text: 'Video calls, documents & payments — all in one place' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-primary-100">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <p className="text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-primary-300 text-sm">© 2026 Business Nexus. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-dark-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold text-dark-900">Business Nexus</span>
          </div>

          <h2 className="text-2xl font-bold text-dark-900 mb-1">Welcome back</h2>
          <p className="text-dark-500 mb-6">Sign in to your account to continue</p>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {(['entrepreneur', 'investor'] as const).map(r => (
              <button key={r} onClick={() => setRole(r)}
                className={`flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 transition-all ${
                  role === r
                    ? 'border-primary-500 bg-primary-50 shadow-glow'
                    : 'border-dark-200 bg-white hover:border-primary-300'
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
              <label className="block text-sm font-semibold text-dark-700 mb-1.5">Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 border border-dark-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-semibold text-dark-700">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary-600 hover:text-primary-700 font-medium">Forgot password?</Link>
              </div>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 border border-dark-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white pr-10" />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400">
                  {showPwd ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>
            <Button type="submit" fullWidth isLoading={isLoading} size="lg" rightIcon={<ArrowRight size={16}/>}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-sm text-dark-500 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700">Create one →</Link>
          </p>

          {/* Demo */}
          <div className="mt-6 pt-5 border-t border-dark-200">
            <p className="text-center text-xs text-dark-400 mb-3 font-medium">Try a demo account</p>
            <div className="grid grid-cols-2 gap-3">
              {(['entrepreneur', 'investor'] as const).map(r => (
                <button key={r} onClick={() => fillDemo(r)} type="button"
                  className="px-3 py-2.5 text-xs font-semibold border border-dark-200 hover:border-primary-300 hover:bg-primary-50 text-dark-600 hover:text-primary-700 rounded-xl transition-all capitalize">
                  Demo {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
