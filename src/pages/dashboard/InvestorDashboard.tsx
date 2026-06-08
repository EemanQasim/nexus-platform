import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, PieChart, Filter, Search, PlusCircle, Wallet,
  TrendingUp, Calendar, Video, FileText, DollarSign, ArrowRight, Clock
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { EntrepreneurCard } from '../../components/entrepreneur/EntrepreneurCard';
import { useAuth } from '../../context/AuthContext';
import { entrepreneurs } from '../../data/users';
import { getRequestsFromInvestor } from '../../data/collaborationRequests';

export const InvestorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

  if (!user) return null;

  const sentRequests = getRequestsFromInvestor(user.id);
  const filteredEntrepreneurs = entrepreneurs.filter(e => {
    const matchSearch = searchQuery === '' ||
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchIndustry = selectedIndustries.length === 0 || selectedIndustries.includes(e.industry);
    return matchSearch && matchIndustry;
  });

  const industries = Array.from(new Set(entrepreneurs.map(e => e.industry)));
  const toggleIndustry = (ind: string) =>
    setSelectedIndustries(prev => prev.includes(ind) ? prev.filter(i => i !== ind) : [...prev, ind]);

  const stats = [
    { label: 'Active Startups', value: entrepreneurs.length, icon: <Users size={18}/>, color: 'from-primary-500 to-primary-600', to: '/entrepreneurs' },
    { label: 'Industries', value: industries.length, icon: <PieChart size={18}/>, color: 'from-secondary-500 to-secondary-600', to: '/entrepreneurs' },
    { label: 'Connections', value: sentRequests.filter(r => r.status === 'accepted').length, icon: <TrendingUp size={18}/>, color: 'from-accent-500 to-accent-600', to: '/messages' },
    { label: 'Wallet', value: '$45K', icon: <Wallet size={18}/>, color: 'from-dark-500 to-dark-700', to: '/payment' },
  ];

  const quickActions = [
    { label: 'Schedule Meeting', icon: <Calendar size={18}/>, to: '/calendar', color: 'bg-primary-600' },
    { label: 'Start Video Call', icon: <Video size={18}/>, to: '/video-call', color: 'bg-secondary-500' },
    { label: 'View Documents', icon: <FileText size={18}/>, to: '/documents', color: 'bg-accent-500' },
    { label: 'Wallet', icon: <DollarSign size={18}/>, to: '/payment', color: 'bg-dark-600' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-dark-800 via-primary-800 to-primary-700 rounded-3xl p-6 text-white overflow-hidden shadow-xl">
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5"></div>
        <div className="absolute right-10 bottom-0 w-28 h-28 rounded-full bg-secondary-400/20"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-primary-200 font-medium text-sm mb-1">Welcome back 👋</p>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-primary-100 text-sm mt-1">Investor · Discover your next great investment</p>
          </div>
          <Link to="/entrepreneurs">
            <Button className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm" size="sm" rightIcon={<ArrowRight size={14}/>}>
              Browse Startups
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Link key={i} to={s.to}>
            <Card hover>
              <CardBody className="py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-dark-400 uppercase tracking-wide mb-1">{s.label}</p>
                    <p className="text-2xl font-bold text-dark-900">{s.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-sm`}>
                    <span className="text-white">{s.icon}</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <h2 className="font-bold text-dark-900">Quick Actions</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map((action, i) => (
              <Link key={i} to={action.to}
                className="flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-dark-50 hover:bg-primary-50 border border-dark-100 hover:border-primary-200 transition-all group text-center">
                <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <span className="text-xs font-semibold text-dark-700 group-hover:text-primary-700">{action.label}</span>
              </Link>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Search & filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <Input placeholder="Search startups, industries..." value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)} fullWidth startAdornment={<Search size={15}/>} />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={15} className="text-dark-400"/>
          {industries.map(ind => (
            <Badge key={ind} variant={selectedIndustries.includes(ind) ? 'primary' : 'gray'}
              className="cursor-pointer" onClick={() => toggleIndustry(ind)}>
              {ind}
            </Badge>
          ))}
        </div>
      </div>

      {/* Startups grid */}
      <Card>
        <CardHeader action={
          <Link to="/entrepreneurs" className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
            View all <ArrowRight size={12}/>
          </Link>
        }>
          <h2 className="font-bold text-dark-900">Featured Startups</h2>
        </CardHeader>
        <CardBody>
          {filteredEntrepreneurs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEntrepreneurs.slice(0, 6).map(e => (
                <EntrepreneurCard key={e.id} entrepreneur={e} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-dark-400">
              <p className="font-medium">No startups match your filters</p>
              <Button variant="outline" size="sm" className="mt-3"
                onClick={() => { setSearchQuery(''); setSelectedIndustries([]); }}>
                Clear filters
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
