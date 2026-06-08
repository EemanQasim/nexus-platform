import React, { useState, useRef } from 'react';
import {
  Video, VideoOff, Mic, MicOff, Phone, Monitor, MonitorOff,
  MessageCircle, Users, Settings, Maximize2, MoreVertical, Clock
} from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { useAuth } from '../../context/AuthContext';

interface Participant {
  id: string;
  name: string;
  avatarUrl: string;
  isMuted: boolean;
  isVideoOff: boolean;
  isSpeaking: boolean;
}

const mockParticipants: Participant[] = [
  { id: 'p1', name: 'Michael Chen', avatarUrl: 'https://ui-avatars.com/api/?name=Michael+Chen&background=7C3AED&color=fff', isMuted: false, isVideoOff: false, isSpeaking: true },
  { id: 'p2', name: 'Alex Rivera', avatarUrl: 'https://ui-avatars.com/api/?name=Alex+Rivera&background=F97316&color=fff', isMuted: true, isVideoOff: false, isSpeaking: false },
];

interface ChatMsg { sender: string; text: string; time: string; }

export const VideoCallPage: React.FC = () => {
  const { user } = useAuth();
  const [callActive, setCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [chatMsg, setChatMsg] = useState('');
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([
    { sender: 'Michael Chen', text: 'Ready to start?', time: '10:02 AM' },
    { sender: 'Alex Rivera', text: 'Yes, all set!', time: '10:03 AM' },
  ]);
  const timerRef = useRef<any>(null);

  const startCall = () => {
    setCallActive(true);
    timerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000);
  };

  const endCall = () => {
    setCallActive(false);
    clearInterval(timerRef.current);
    setCallDuration(0);
    setIsScreenSharing(false);
  };

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };

  const sendMessage = () => {
    if (!chatMsg.trim()) return;
    setChatMsgs(prev => [...prev, {
      sender: user?.name || 'You',
      text: chatMsg,
      time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})
    }]);
    setChatMsg('');
  };

  if (!callActive) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Video Calls</h1>
          <p className="text-dark-500">Start or join a video meeting with investors and entrepreneurs</p>
        </div>

        {/* Lobby */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardBody>
                <div className="bg-gradient-to-br from-dark-800 to-dark-900 rounded-2xl aspect-video flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 to-secondary-900/20"></div>
                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-2xl">
                      <Video size={40} className="text-white" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-white text-xl font-bold">Ready to Connect?</h3>
                      <p className="text-dark-300 text-sm mt-1">Start a video call with your connections</p>
                    </div>
                    <Button onClick={startCall} size="lg"
                      className="bg-gradient-to-r from-accent-500 to-accent-400 hover:from-accent-600 hover:to-accent-500 text-white shadow-lg px-8">
                      <Video size={18} className="mr-2" /> Start Call
                    </Button>
                  </div>
                  {/* Decorative circles */}
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-primary-600/10"></div>
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-secondary-600/10"></div>
                </div>

                {/* Device preview */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    { icon: <Mic size={16}/>, label: 'Microphone', status: 'Ready', ok: true },
                    { icon: <Video size={16}/>, label: 'Camera', status: 'Ready', ok: true },
                    { icon: <Monitor size={16}/>, label: 'Screen Share', status: 'Available', ok: true },
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border ${item.ok ? 'border-accent-200 bg-accent-50' : 'border-error-200 bg-error-50'}`}>
                      <span className={item.ok ? 'text-accent-600' : 'text-error-500'}>{item.icon}</span>
                      <div>
                        <p className="text-xs font-semibold text-dark-700">{item.label}</p>
                        <p className={`text-xs ${item.ok ? 'text-accent-600' : 'text-error-500'}`}>{item.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Upcoming calls */}
          <div className="space-y-4">
            <Card>
              <CardBody>
                <h3 className="font-bold text-dark-900 mb-3">Upcoming Calls</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Michael Chen', time: 'Today, 10:00 AM', topic: 'Seed Funding', color: 'from-primary-500 to-primary-600' },
                    { name: 'Alex Rivera', time: 'Tomorrow, 2:00 PM', topic: 'Pitch Review', color: 'from-secondary-500 to-secondary-600' },
                    { name: 'Sarah Johnson', time: 'Jun 5, 9:00 AM', topic: 'Portfolio Review', color: 'from-accent-500 to-accent-600' },
                  ].map((call, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 hover:bg-dark-50 rounded-xl transition-colors">
                      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${call.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                        {call.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-dark-800 truncate">{call.name}</p>
                        <p className="text-xs text-dark-400">{call.time}</p>
                        <p className="text-xs text-primary-600 font-medium">{call.topic}</p>
                      </div>
                      <button className="text-xs text-primary-600 font-semibold hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-2.5 py-1 rounded-lg transition-colors">
                        Join
                      </button>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <h3 className="font-bold text-dark-900 mb-3">Join a Meeting</h3>
                <input placeholder="Enter meeting ID or link"
                  className="w-full px-3 py-2.5 border border-dark-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 mb-3" />
                <Button fullWidth onClick={startCall}>Join Meeting</Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-3 animate-fade-in">
      {/* Call header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-error-50 border border-error-200 text-error-600 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-error-500 animate-pulse"></span>
            <span className="text-sm font-bold">LIVE</span>
          </div>
          <span className="text-sm font-mono text-dark-600 font-semibold">{formatDuration(callDuration)}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowParticipants(!showParticipants)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-dark-600 hover:bg-dark-100 rounded-xl transition-colors">
            <Users size={15}/> {mockParticipants.length + 1}
          </button>
          <button onClick={() => setShowChat(!showChat)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-dark-600 hover:bg-dark-100 rounded-xl transition-colors">
            <MessageCircle size={15}/> Chat
          </button>
        </div>
      </div>

      {/* Video area */}
      <div className="flex-1 flex gap-3 min-h-0">
        <div className="flex-1 flex flex-col gap-3">
          {/* Main video */}
          <div className="flex-1 bg-gradient-to-br from-dark-800 to-dark-950 rounded-2xl relative overflow-hidden min-h-0">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center mx-auto mb-3 shadow-glow">
                  <span className="text-3xl font-bold text-white">{mockParticipants[0].name[0]}</span>
                </div>
                <p className="text-white font-semibold text-lg">{mockParticipants[0].name}</p>
                <p className="text-dark-300 text-sm">Camera off</p>
              </div>
            </div>
            {/* Speaking indicator */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-dark-900/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <div className="flex gap-0.5">
                {[1,2,3,4].map(b => (
                  <div key={b} className="w-0.5 bg-accent-400 rounded-full animate-pulse" style={{ height: `${8 + b * 3}px`, animationDelay: `${b * 0.1}s` }}></div>
                ))}
              </div>
              <span className="text-white text-xs font-medium">{mockParticipants[0].name}</span>
            </div>
            {isScreenSharing && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-primary-600/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Monitor size={14} className="text-white" />
                <span className="text-white text-xs font-medium">You're sharing your screen</span>
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          <div className="flex gap-3 h-28">
            {/* Self view */}
            <div className="w-40 bg-gradient-to-br from-dark-700 to-dark-800 rounded-xl relative overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 flex items-center justify-center">
                {isVideoOff ? (
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center mx-auto">
                      <span className="text-white font-bold">{user?.name?.[0]}</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
                    <span className="text-white font-bold">{user?.name?.[0]}</span>
                  </div>
                )}
              </div>
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                <span className="text-white text-xs font-medium bg-dark-900/60 px-2 py-0.5 rounded-full">You</span>
                {isMuted && <MicOff size={12} className="text-error-400" />}
              </div>
            </div>

            {mockParticipants.slice(1).map(p => (
              <div key={p.id} className="w-40 bg-gradient-to-br from-dark-700 to-dark-800 rounded-xl relative overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center">
                    <span className="text-white font-bold">{p.name[0]}</span>
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                  <span className="text-white text-xs font-medium bg-dark-900/60 px-2 py-0.5 rounded-full truncate">{p.name.split(' ')[0]}</span>
                  {p.isMuted && <MicOff size={12} className="text-error-400" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat panel */}
        {showChat && (
          <div className="w-64 flex flex-col bg-white rounded-2xl border border-dark-100 shadow-sm">
            <div className="px-4 py-3 border-b border-dark-100">
              <h3 className="font-bold text-dark-900 text-sm">In-call Chat</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
              {chatMsgs.map((msg, i) => (
                <div key={i} className={`${msg.sender === user?.name ? 'text-right' : ''}`}>
                  <p className="text-xs text-dark-400 mb-0.5">{msg.sender} · {msg.time}</p>
                  <span className={`inline-block px-3 py-1.5 rounded-xl text-sm ${
                    msg.sender === user?.name
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-100 text-dark-800'
                  }`}>{msg.text}</span>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-dark-100 flex gap-2">
              <input value={chatMsg} onChange={e => setChatMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Message..." className="flex-1 px-3 py-2 text-sm bg-dark-50 rounded-xl border border-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <button onClick={sendMessage} className="px-3 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
                <MessageCircle size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 py-2">
        <button onClick={() => setIsMuted(!isMuted)}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isMuted ? 'bg-error-500 text-white' : 'bg-dark-100 text-dark-700 hover:bg-dark-200'}`}>
          {isMuted ? <MicOff size={20}/> : <Mic size={20}/>}
        </button>
        <button onClick={() => setIsVideoOff(!isVideoOff)}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isVideoOff ? 'bg-error-500 text-white' : 'bg-dark-100 text-dark-700 hover:bg-dark-200'}`}>
          {isVideoOff ? <VideoOff size={20}/> : <Video size={20}/>}
        </button>
        <button onClick={() => setIsScreenSharing(!isScreenSharing)}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isScreenSharing ? 'bg-primary-600 text-white' : 'bg-dark-100 text-dark-700 hover:bg-dark-200'}`}>
          {isScreenSharing ? <MonitorOff size={20}/> : <Monitor size={20}/>}
        </button>
        <button onClick={endCall}
          className="w-14 h-12 bg-error-500 hover:bg-error-600 text-white rounded-2xl flex items-center justify-center transition-all shadow-lg">
          <Phone size={20} className="rotate-[135deg]"/>
        </button>
        <button className="w-12 h-12 bg-dark-100 text-dark-700 hover:bg-dark-200 rounded-2xl flex items-center justify-center transition-all">
          <MoreVertical size={20}/>
        </button>
      </div>
    </div>
  );
};
