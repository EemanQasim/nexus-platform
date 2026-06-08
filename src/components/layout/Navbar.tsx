import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, X, Bell, MessageCircle, User, LogOut, Building2, CircleDollarSign, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const dashboardRoute = user?.role === 'entrepreneur'
    ? '/dashboard/entrepreneur'
    : '/dashboard/investor';
  
  const profileRoute = user
    ? `/profile/${user.role}/${user.id}`
    : '/login';

  return (
    <nav className="bg-white border-b border-dark-100 shadow-sm z-50">
      <div className="max-w-full px-4 sm:px-6">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-lg flex items-center justify-center shadow-glow">
                <Zap size={18} className="text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-base font-bold bg-gradient-to-r from-primary-700 to-secondary-600 bg-clip-text text-transparent">
                  Business Nexus
                </span>
                <span className="text-[9px] text-dark-400 font-medium tracking-widest uppercase">Investor Platform</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop nav */}
          <div className="hidden md:flex md:items-center md:gap-2">
            {user ? (
              <>
                <Link to="/notifications" className="relative p-2 text-dark-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                  <Bell size={20} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary-500 rounded-full"></span>
                </Link>
                <Link to="/messages" className="relative p-2 text-dark-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                  <MessageCircle size={20} />
                </Link>
                
                <div className="h-6 w-px bg-dark-200 mx-1"></div>
                
                <Link to={profileRoute} className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-primary-50 rounded-xl transition-colors">
                  <Avatar src={user.avatarUrl} alt={user.name} size="sm" status={user.isOnline ? 'online' : 'offline'} />
                  <div className="flex flex-col leading-none">
                    <span className="text-sm font-semibold text-dark-800">{user.name}</span>
                    <span className="text-xs text-primary-600 capitalize font-medium">{user.role}</span>
                  </div>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-dark-500 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="outline" size="sm">Log in</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="p-2 rounded-lg text-dark-700 hover:bg-primary-50 transition-colors">
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-dark-100 animate-fade-in">
          <div className="px-3 py-3 space-y-1">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-3 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl mb-2">
                  <Avatar src={user.avatarUrl} alt={user.name} size="sm" status="online" />
                  <div>
                    <p className="text-sm font-semibold text-dark-800">{user.name}</p>
                    <p className="text-xs text-primary-600 capitalize font-medium">{user.role}</p>
                  </div>
                </div>
                {[
                  { to: dashboardRoute, icon: <Building2 size={16}/>, text: 'Dashboard' },
                  { to: '/messages', icon: <MessageCircle size={16}/>, text: 'Messages' },
                  { to: '/notifications', icon: <Bell size={16}/>, text: 'Notifications' },
                  { to: profileRoute, icon: <User size={16}/>, text: 'Profile' },
                ].map((link, i) => (
                  <Link key={i} to={link.to} onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-dark-700 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors">
                    {link.icon}{link.text}
                  </Link>
                ))}
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  className="flex w-full items-center gap-3 px-3 py-2 text-sm text-error-600 hover:bg-error-50 rounded-lg transition-colors">
                  <LogOut size={16}/>Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 px-3 py-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" fullWidth>Log in</Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button fullWidth>Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
