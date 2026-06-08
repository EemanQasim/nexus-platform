import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, TrendingUp, Users, DollarSign, Bell, FileText,
  Calendar, Video, ArrowRight, Zap, Target, Clock
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { useAuth } from '../../context/AuthContext';
import { investors } from '../../data/users';
import { InvestorCard } from '../../components/investor/InvestorCard';

export const EntrepreneurDashboard: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  const stats = [
    { label: 'Profile Views', value: '284', change: '+12%', icon: <Users size={18}/>, color: 'from-primary-500 to-primary-600', bg: 'bg-primary-50', text: 'text-primary-700' },
    { label: 'Funding Raised', value: '$45K', change: '+8%', icon: <DollarSign size={18}/>, color: 'from-accent-500 to-accent-600', bg: 'bg-accent-50', text: 'text-accent-700' },
    { label: 'Connections', value: '18', change: '+3', icon: <TrendingUp size={18}/>, color: 'from-secondary-500 to-secondary-600', bg: 'bg-secondary-50', text: 'text-secondary-700' },
    { label: 'Meetings', value: '6', change: 'This month', icon: <Calendar size={18}/>, color: 'from-dark-500 to-dark-600', bg: 'bg-dark-50', text: 'text-dark-600' },
  ];

  const quickActions = [
    { label: 'Schedule Meeting', icon: <Calendar size={18}/>, to: '/calendar', color: 'bg-primary-600' },
    { label: 'Start Video Call', icon: <Video size={18}/>, to: '/video-call', color: 'bg-secondary-500' },
    { label: 'Upload Document', icon: <FileText size={18}/>, to: '/documents', color: 'bg-accent-500' },
    { label: 'View Payments', icon: <DollarSign size={18}/>, to: '/payment', color: 'bg-dark-600' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero greeting */}
      <div className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-600 rounded-3xl p-6 text-white overflow-hidden shadow-xl">
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5"></div>
        <div className="absolute right-10 bottom-0 w-28 h-28 rounded-full bg-secondary-400/20"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-primary-200 font-medium text-sm mb-1">Welcome back 👋</p>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-primary-100 text-sm mt-1">Entrepreneur · Your startup is gaining traction!</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to={`/profile/entrepreneur/${user.id}`}>
              <Button className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm" size="sm">
                View Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Card key={i}>
            <CardBody className="py-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-dark-400 uppercase tracking-wide mb-1">{s.label}</p>
                  <p className="text-2xl font-bold text-dark-900">{s.value}</p>
                  <p className={`text-xs font-semibold mt-1 ${s.text}`}>{s.change}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-sm`}>
                  <span className="text-white">{s.icon}</span>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-primary-600" />
            <h2 className="font-bold text-dark-900">Quick Actions</h2>
          </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Investors */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader action={
              <Link to="/investors" className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                View all <ArrowRight size={12}/>
              </Link>
            }>
              <h2 className="font-bold text-dark-900">Featured Investors</h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {investors.slice(0, 2).map(inv => (
                  <InvestorCard key={inv.id} investor={inv} />
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-primary-600"/>
              <h2 className="font-bold text-dark-900">Recent Activity</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-3 px-4">
            {[
              { text: 'Michael Chen viewed your profile', time: '2m ago', color: 'bg-primary-500' },
              { text: 'Meeting confirmed for May 30', time: '1h ago', color: 'bg-accent-500' },
              { text: 'NDA signed by Alex Rivera', time: '3h ago', color: 'bg-secondary-500' },
              { text: 'New connection request', time: '1d ago', color: 'bg-dark-400' },
              { text: '$15,000 transfer received', time: '2d ago', color: 'bg-accent-600' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-1">
                <div className={`w-2 h-2 rounded-full ${item.color} mt-1.5 flex-shrink-0`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-dark-700 font-medium leading-snug">{item.text}</p>
                  <p className="text-xs text-dark-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
