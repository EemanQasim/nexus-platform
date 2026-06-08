import React, { useState, useMemo } from 'react';
import { User, Lock, Bell, Globe, Palette, CreditCard, ShieldCheck, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { useAuth } from '../../context/AuthContext';

type Section = 'profile' | 'security' | 'notifications';

const getPasswordStrength = (password: string) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score, label: 'Very Weak', color: 'bg-red-500' };
  if (score === 2) return { score, label: 'Weak', color: 'bg-orange-400' };
  if (score === 3) return { score, label: 'Fair', color: 'bg-yellow-400' };
  if (score === 4) return { score, label: 'Strong', color: 'bg-green-400' };
  return { score, label: 'Very Strong', color: 'bg-green-600' };
};

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<Section>('profile');
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [showOtpSetup, setShowOtpSetup] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const passwordStrength = useMemo(() => getPasswordStrength(newPassword), [newPassword]);

  const handleEnable2FA = () => {
    setShowOtpSetup(true);
  };

  const handleVerifyOtp = () => {
    if (otpCode === '123456') {
      setOtpVerified(true);
      setTwoFAEnabled(true);
      setShowOtpSetup(false);
      setOtpCode('');
    }
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    await new Promise(r => setTimeout(r, 800));
    setSavingProfile(false);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  if (!user) return null;

  const navItems: { id: Section; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'security', label: 'Security', icon: <Lock size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-dark-900">Settings</h1>
        <p className="text-dark-600">Manage your account preferences and settings</p>
      </div>

      {/* Role badge at top */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-dark-500">You are logged in as:</span>
        <Badge variant={user.role === 'investor' ? 'secondary' : 'primary'} className="capitalize">
          {user.role}
        </Badge>
        <span className="text-xs text-dark-400">
          {user.role === 'investor' ? '(Investor Dashboard access)' : '(Entrepreneur Dashboard access)'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings navigation */}
        <Card className="lg:col-span-1">
          <CardBody className="p-2">
            <nav className="space-y-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeSection === item.id
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-dark-700 hover:bg-dark-50'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </button>
              ))}
              <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-dark-700 hover:bg-dark-50 rounded-md">
                <Globe size={18} className="mr-3" />
                Language
              </button>
              <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-dark-700 hover:bg-dark-50 rounded-md">
                <Palette size={18} className="mr-3" />
                Appearance
              </button>
              <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-dark-700 hover:bg-dark-50 rounded-md">
                <CreditCard size={18} className="mr-3" />
                Billing
              </button>
            </nav>
          </CardBody>
        </Card>

        {/* Main settings content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Settings */}
          {activeSection === 'profile' && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-dark-900">Profile Settings</h2>
              </CardHeader>
              <CardBody className="space-y-6">
                {profileSaved && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
                    <CheckCircle size={16} /> Profile saved successfully!
                  </div>
                )}
                <div className="flex items-center gap-6">
                  <Avatar src={user.avatarUrl} alt={user.name} size="xl" />
                  <div>
                    <Button variant="outline" size="sm">Change Photo</Button>
                    <p className="mt-2 text-sm text-dark-500">JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Full Name" defaultValue={user.name} />
                  <Input label="Email" type="email" defaultValue={user.email} />
                  <div>
                    <Input label="Role" value={user.role} disabled />
                    <p className="mt-1 text-xs text-dark-400">Role determines dashboard access and features</p>
                  </div>
                  <Input label="Location" defaultValue="San Francisco, CA" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1">Bio</label>
                  <textarea
                    className="w-full rounded-md border-dark-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    rows={4}
                    defaultValue={user.bio}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline">Cancel</Button>
                  <Button isLoading={savingProfile} onClick={handleSaveProfile}>Save Changes</Button>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Security Settings */}
          {activeSection === 'security' && (
            <>
              {/* 2FA Section */}
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-medium text-dark-900">Two-Factor Authentication</h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-dark-600">Add an extra layer of security to your account using OTP</p>
                      {twoFAEnabled
                        ? <Badge variant="success" className="mt-1">Enabled</Badge>
                        : <Badge variant="error" className="mt-1">Not Enabled</Badge>
                      }
                    </div>
                    {!twoFAEnabled && (
                      <Button variant="outline" onClick={handleEnable2FA}>Enable 2FA</Button>
                    )}
                    {twoFAEnabled && (
                      <Button variant="outline" onClick={() => { setTwoFAEnabled(false); setOtpVerified(false); }}>
                        Disable 2FA
                      </Button>
                    )}
                  </div>

                  {showOtpSetup && (
                    <div className="border border-primary-200 bg-primary-50 rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-2 text-primary-700">
                        <ShieldCheck size={18} />
                        <span className="text-sm font-medium">Enter the OTP sent to your device</span>
                      </div>
                      <p className="text-xs text-primary-600">Demo: enter <strong>123456</strong> to verify</p>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter 6-digit code"
                          value={otpCode}
                          onChange={e => setOtpCode(e.target.value)}
                          maxLength={6}
                        />
                        <Button onClick={handleVerifyOtp}>Verify</Button>
                        <Button variant="outline" onClick={() => setShowOtpSetup(false)}>Cancel</Button>
                      </div>
                    </div>
                  )}

                  {otpVerified && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
                      <CheckCircle size={16} /> 2FA successfully enabled!
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Change Password */}
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-medium text-dark-900">Change Password</h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Input label="Current Password" type="password" />

                  <div>
                    <div className="relative">
                      <Input
                        label="New Password"
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        fullWidth
                        endAdornment={
                          <button
                            type="button"
                            className="pointer-events-auto"
                            onClick={() => setShowNewPassword(v => !v)}
                          >
                            {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        }
                      />
                    </div>
                    {newPassword.length > 0 && (
                      <div className="mt-2">
                        <div className="flex gap-1 mb-1">
                          {[1, 2, 3, 4, 5].map(i => (
                            <div
                              key={i}
                              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                                i <= passwordStrength.score ? passwordStrength.color : 'bg-dark-200'
                              }`}
                            />
                          ))}
                        </div>
                        <p className={`text-xs font-medium ${
                          passwordStrength.score <= 2 ? 'text-red-500' :
                          passwordStrength.score === 3 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          Strength: {passwordStrength.label}
                        </p>
                      </div>
                    )}
                  </div>

                  <Input label="Confirm New Password" type="password" />

                  <div className="flex justify-end">
                    <Button>Update Password</Button>
                  </div>
                </CardBody>
              </Card>
            </>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-medium text-dark-900">Notification Preferences</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                {[
                  { label: 'New collaboration requests', desc: 'Get notified when an investor contacts you' },
                  { label: 'Message notifications', desc: 'Receive alerts for new messages' },
                  { label: 'Deal updates', desc: 'Updates on deals you are part of' },
                  { label: 'Payment alerts', desc: 'Notifications for wallet transactions' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-dark-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-dark-800">{item.label}</p>
                      <p className="text-xs text-dark-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={i < 2} />
                      <div className="w-11 h-6 bg-dark-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-dark-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}
                <div className="flex justify-end pt-2">
                  <Button>Save Preferences</Button>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
