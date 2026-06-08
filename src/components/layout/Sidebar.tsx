import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, Building2, CircleDollarSign, Users, MessageCircle, 
  Bell, FileText, Settings, HelpCircle, Wallet, Calendar,
  Video, Shield, TrendingUp, Zap
} from 'lucide-react';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  badge?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, text, badge }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center py-2.5 px-4 rounded-lg transition-all duration-200 group ${
          isActive
            ? 'bg-gradient-to-r from-primary-600/10 to-secondary-500/5 text-primary-700 border-l-2 border-primary-600 font-semibold'
            : 'text-dark-500 hover:bg-primary-50/50 hover:text-primary-700 border-l-2 border-transparent'
        }`
      }
    >
      <span className="mr-3 transition-transform group-hover:scale-110">{icon}</span>
      <span className="text-sm font-medium flex-1">{text}</span>
      {badge && (
        <span className="ml-auto text-xs bg-secondary-500 text-white rounded-full px-1.5 py-0.5 font-semibold">
          {badge}
        </span>
      )}
    </NavLink>
  );
};

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  const entrepreneurItems = [
    { to: '/dashboard/entrepreneur', icon: <Home size={18} />, text: 'Dashboard' },
    { to: '/profile/entrepreneur/' + user.id, icon: <Building2 size={18} />, text: 'My Startup' },
    { to: '/investors', icon: <CircleDollarSign size={18} />, text: 'Find Investors' },
    { to: '/calendar', icon: <Calendar size={18} />, text: 'Meetings', badge: 'New' },
    { to: '/video-call', icon: <Video size={18} />, text: 'Video Calls', badge: 'New' },
    { to: '/messages', icon: <MessageCircle size={18} />, text: 'Messages' },
    { to: '/notifications', icon: <Bell size={18} />, text: 'Notifications' },
    { to: '/documents', icon: <FileText size={18} />, text: 'Document Chamber', badge: 'New' },
    { to: '/payment', icon: <Wallet size={18} />, text: 'Wallet & Payments' },
    { to: '/security', icon: <Shield size={18} />, text: 'Security', badge: 'New' },
  ];
  
  const investorItems = [
    { to: '/dashboard/investor', icon: <Home size={18} />, text: 'Dashboard' },
    { to: '/profile/investor/' + user.id, icon: <TrendingUp size={18} />, text: 'My Portfolio' },
    { to: '/entrepreneurs', icon: <Users size={18} />, text: 'Find Startups' },
    { to: '/calendar', icon: <Calendar size={18} />, text: 'Meetings', badge: 'New' },
    { to: '/video-call', icon: <Video size={18} />, text: 'Video Calls', badge: 'New' },
    { to: '/messages', icon: <MessageCircle size={18} />, text: 'Messages' },
    { to: '/notifications', icon: <Bell size={18} />, text: 'Notifications' },
    { to: '/deals', icon: <FileText size={18} />, text: 'Deals' },
    { to: '/documents', icon: <Zap size={18} />, text: 'Document Chamber', badge: 'New' },
    { to: '/payment', icon: <Wallet size={18} />, text: 'Wallet & Payments' },
    { to: '/security', icon: <Shield size={18} />, text: 'Security', badge: 'New' },
  ];
  
  const sidebarItems = user.role === 'entrepreneur' ? entrepreneurItems : investorItems;
  
  const commonItems = [
    { to: '/settings', icon: <Settings size={18} />, text: 'Settings' },
    { to: '/help', icon: <HelpCircle size={18} />, text: 'Help & Support' },
  ];
  
  return (
    <div className="w-64 bg-white h-full border-r border-dark-100 hidden md:block shadow-sm">
      <div className="h-full flex flex-col">
        <div className="flex-1 py-4 overflow-y-auto">
          <div className="px-3 space-y-0.5">
            {sidebarItems.map((item, index) => (
              <SidebarItem
                key={index}
                to={item.to}
                icon={item.icon}
                text={item.text}
                badge={item.badge}
              />
            ))}
          </div>
          
          <div className="mt-6 px-3">
            <h3 className="px-4 text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">
              Account
            </h3>
            <div className="space-y-0.5">
              {commonItems.map((item, index) => (
                <SidebarItem
                  key={index}
                  to={item.to}
                  icon={item.icon}
                  text={item.text}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-dark-100">
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-3 border border-primary-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-accent-500 animate-pulse"></div>
              <p className="text-xs font-semibold text-primary-700">Pro Plan Active</p>
            </div>
            <p className="text-xs text-dark-500">Need help? We're here 24/7</p>
            <a
              href="mailto:support@businessnexus.com"
              className="mt-2 inline-flex items-center text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              Contact Support →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
