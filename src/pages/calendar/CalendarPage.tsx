import React, { useState } from 'react';
import { Calendar, Clock, Plus, X, Check, ChevronLeft, ChevronRight, Video, MapPin, Users } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  type: 'video' | 'in-person';
  participant: string;
  status: 'confirmed' | 'pending' | 'declined';
  description?: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

const initialMeetings: Meeting[] = [
  { id: 'm1', title: 'Seed Funding Discussion', date: '2026-05-30', time: '10:00', duration: 60, type: 'video', participant: 'Michael Chen', status: 'confirmed', description: 'Initial funding round discussion for TechWave AI' },
  { id: 'm2', title: 'Pitch Review Session', date: '2026-06-02', time: '14:00', duration: 45, type: 'video', participant: 'Alex Rivera', status: 'pending', description: 'Review updated pitch deck materials' },
  { id: 'm3', title: 'Portfolio Strategy Call', date: '2026-06-05', time: '09:00', duration: 30, type: 'video', participant: 'Sarah Johnson', status: 'confirmed' },
  { id: 'm4', title: 'Market Analysis Review', date: '2026-06-10', time: '11:00', duration: 90, type: 'in-person', participant: 'James Wilson', status: 'pending' },
];

const availabilitySlots: TimeSlot[] = [
  { time: '09:00', available: true },
  { time: '10:00', available: false },
  { time: '11:00', available: true },
  { time: '12:00', available: false },
  { time: '13:00', available: true },
  { time: '14:00', available: false },
  { time: '15:00', available: true },
  { time: '16:00', available: true },
  { time: '17:00', available: false },
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

export const CalendarPage: React.FC = () => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1));
  const [selectedDate, setSelectedDate] = useState<string>('2026-05-30');
  const [showNewMeeting, setShowNewMeeting] = useState(false);
  const [activeTab, setActiveTab] = useState<'calendar' | 'availability' | 'requests'>('calendar');
  const [slots, setSlots] = useState<TimeSlot[]>(availabilitySlots);

  const [newMeeting, setNewMeeting] = useState({
    title: '', date: '', time: '', duration: 60, participant: '', type: 'video' as const, description: ''
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getMeetingsForDate = (dateStr: string) => meetings.filter(m => m.date === dateStr);

  const formatDateKey = (y: number, mo: number, d: number) =>
    `${y}-${String(mo + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const handleAddMeeting = () => {
    if (!newMeeting.title || !newMeeting.date || !newMeeting.time) return;
    const m: Meeting = {
      id: `m${Date.now()}`,
      ...newMeeting,
      status: 'pending',
    };
    setMeetings(prev => [...prev, m]);
    setNewMeeting({ title: '', date: '', time: '', duration: 60, participant: '', type: 'video', description: '' });
    setShowNewMeeting(false);
  };

  const handleStatusChange = (id: string, status: 'confirmed' | 'declined') => {
    setMeetings(prev => prev.map(m => m.id === id ? { ...m, status } : m));
  };

  const toggleSlot = (time: string) => {
    setSlots(prev => prev.map(s => s.time === time ? { ...s, available: !s.available } : s));
  };

  const selectedMeetings = getMeetingsForDate(selectedDate);
  const pendingRequests = meetings.filter(m => m.status === 'pending');

  const statusColor = (s: string) => {
    if (s === 'confirmed') return 'success';
    if (s === 'pending') return 'accent';
    return 'error';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Meeting Scheduler</h1>
          <p className="text-dark-500">Manage your availability and schedule meetings</p>
        </div>
        <Button leftIcon={<Plus size={16}/>} onClick={() => setShowNewMeeting(true)}>
          Schedule Meeting
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-dark-100 p-1 rounded-xl w-fit">
        {(['calendar', 'availability', 'requests'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
              activeTab === tab ? 'bg-white text-primary-700 shadow-sm' : 'text-dark-500 hover:text-dark-700'
            }`}>
            {tab === 'requests' ? `Requests${pendingRequests.length > 0 ? ` (${pendingRequests.length})` : ''}` : tab}
          </button>
        ))}
      </div>

      {activeTab === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <button onClick={prevMonth} className="p-1.5 hover:bg-dark-100 rounded-lg transition-colors">
                  <ChevronLeft size={18} />
                </button>
                <h2 className="text-base font-bold text-dark-900">{MONTHS[month]} {year}</h2>
                <button onClick={nextMonth} className="p-1.5 hover:bg-dark-100 rounded-lg transition-colors">
                  <ChevronRight size={18} />
                </button>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-7 mb-2">
                {DAYS.map(d => (
                  <div key={d} className="text-center text-xs font-semibold text-dark-400 py-2">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = formatDateKey(year, month, day);
                  const dayMeetings = getMeetingsForDate(dateStr);
                  const isSelected = selectedDate === dateStr;
                  const isToday = dateStr === '2026-05-29';
                  return (
                    <button key={day} onClick={() => setSelectedDate(dateStr)}
                      className={`relative flex flex-col items-center p-2 rounded-xl text-sm transition-all ${
                        isSelected ? 'bg-primary-600 text-white shadow-glow' :
                        isToday ? 'bg-primary-50 text-primary-700 font-bold' :
                        'hover:bg-dark-50 text-dark-700'
                      }`}>
                      <span className="font-medium">{day}</span>
                      {dayMeetings.length > 0 && (
                        <div className="flex gap-0.5 mt-0.5">
                          {dayMeetings.slice(0, 3).map((m, mi) => (
                            <span key={mi} className={`w-1.5 h-1.5 rounded-full ${
                              m.status === 'confirmed' ? 'bg-accent-400' :
                              m.status === 'pending' ? 'bg-secondary-400' : 'bg-error-400'
                            } ${isSelected ? 'bg-white/60' : ''}`} />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs text-dark-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent-400"></span>Confirmed</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-secondary-400"></span>Pending</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-error-400"></span>Declined</span>
              </div>
            </CardBody>
          </Card>

          {/* Day View */}
          <Card>
            <CardHeader>
              <div>
                <h2 className="text-sm font-bold text-dark-900">
                  {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </h2>
                <p className="text-xs text-dark-400">{selectedMeetings.length} meeting{selectedMeetings.length !== 1 ? 's' : ''}</p>
              </div>
            </CardHeader>
            <CardBody className="space-y-3">
              {selectedMeetings.length === 0 ? (
                <div className="text-center py-8 text-dark-400">
                  <Calendar size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No meetings scheduled</p>
                  <button onClick={() => { setNewMeeting(p => ({...p, date: selectedDate})); setShowNewMeeting(true); }}
                    className="mt-2 text-xs text-primary-600 hover:text-primary-700 font-semibold">
                    + Add meeting
                  </button>
                </div>
              ) : (
                selectedMeetings.map(meeting => (
                  <div key={meeting.id} className={`p-3 rounded-xl border-l-3 ${
                    meeting.status === 'confirmed' ? 'bg-accent-50 border-l-4 border-accent-400' :
                    meeting.status === 'pending' ? 'bg-secondary-50 border-l-4 border-secondary-400' :
                    'bg-error-50 border-l-4 border-error-400'
                  }`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-dark-900 truncate">{meeting.title}</p>
                        <p className="text-xs text-dark-500 flex items-center gap-1 mt-0.5">
                          <Clock size={11}/> {meeting.time} · {meeting.duration}min
                        </p>
                        <p className="text-xs text-dark-500 flex items-center gap-1">
                          <Users size={11}/> {meeting.participant}
                        </p>
                        {meeting.type === 'video' && (
                          <p className="text-xs text-primary-600 flex items-center gap-1 mt-0.5">
                            <Video size={11}/> Video Call
                          </p>
                        )}
                      </div>
                      <Badge variant={statusColor(meeting.status) as any} size="sm">
                        {meeting.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </CardBody>
          </Card>
        </div>
      )}

      {activeTab === 'availability' && (
        <Card>
          <CardHeader>
            <h2 className="text-base font-bold text-dark-900">Set Your Availability</h2>
            <p className="text-sm text-dark-400 mt-0.5">Toggle time slots to mark when you're available for meetings</p>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {slots.map(slot => (
                <button key={slot.time} onClick={() => toggleSlot(slot.time)}
                  className={`p-4 rounded-xl border-2 text-sm font-semibold transition-all ${
                    slot.available
                      ? 'border-accent-400 bg-accent-50 text-accent-700 hover:bg-accent-100'
                      : 'border-dark-200 bg-dark-50 text-dark-400 hover:bg-dark-100'
                  }`}>
                  <div className="flex flex-col items-center gap-1">
                    <Clock size={16} className={slot.available ? 'text-accent-500' : 'text-dark-400'} />
                    <span>{slot.time}</span>
                    <span className={`text-xs font-medium ${slot.available ? 'text-accent-500' : 'text-dark-400'}`}>
                      {slot.available ? 'Available' : 'Blocked'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-dark-100">
              <Button>Save Availability</Button>
            </div>
          </CardBody>
        </Card>
      )}

      {activeTab === 'requests' && (
        <div className="space-y-4">
          {pendingRequests.length === 0 ? (
            <Card>
              <CardBody>
                <div className="text-center py-10 text-dark-400">
                  <Check size={40} className="mx-auto mb-2 opacity-30" />
                  <p className="font-medium">No pending requests</p>
                </div>
              </CardBody>
            </Card>
          ) : (
            pendingRequests.map(meeting => (
              <Card key={meeting.id}>
                <CardBody>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-dark-900">{meeting.title}</h3>
                      <p className="text-sm text-dark-500 mt-1">with {meeting.participant}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-dark-500">
                        <span className="flex items-center gap-1"><Calendar size={13}/> {meeting.date}</span>
                        <span className="flex items-center gap-1"><Clock size={13}/> {meeting.time} ({meeting.duration}min)</span>
                        {meeting.type === 'video' && <span className="flex items-center gap-1"><Video size={13}/> Video</span>}
                      </div>
                      {meeting.description && <p className="text-sm text-dark-400 mt-2 italic">"{meeting.description}"</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="success" size="sm" leftIcon={<Check size={14}/>}
                        onClick={() => handleStatusChange(meeting.id, 'confirmed')}>
                        Accept
                      </Button>
                      <Button variant="danger" size="sm" leftIcon={<X size={14}/>}
                        onClick={() => handleStatusChange(meeting.id, 'declined')}>
                        Decline
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      )}

      {/* New Meeting Modal */}
      {showNewMeeting && (
        <div className="fixed inset-0 bg-dark-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-dark-100">
              <h2 className="text-lg font-bold text-dark-900">Schedule New Meeting</h2>
              <button onClick={() => setShowNewMeeting(false)} className="p-1.5 hover:bg-dark-100 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-dark-700 mb-1">Title *</label>
                <input value={newMeeting.title} onChange={e => setNewMeeting(p => ({...p, title: e.target.value}))}
                  placeholder="e.g. Funding Discussion"
                  className="w-full px-4 py-2.5 border border-dark-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-dark-700 mb-1">Date *</label>
                  <input type="date" value={newMeeting.date} onChange={e => setNewMeeting(p => ({...p, date: e.target.value}))}
                    className="w-full px-4 py-2.5 border border-dark-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark-700 mb-1">Time *</label>
                  <input type="time" value={newMeeting.time} onChange={e => setNewMeeting(p => ({...p, time: e.target.value}))}
                    className="w-full px-4 py-2.5 border border-dark-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-dark-700 mb-1">Duration (min)</label>
                  <select value={newMeeting.duration} onChange={e => setNewMeeting(p => ({...p, duration: Number(e.target.value)}))}
                    className="w-full px-4 py-2.5 border border-dark-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                    {[15, 30, 45, 60, 90, 120].map(d => <option key={d} value={d}>{d} min</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark-700 mb-1">Type</label>
                  <select value={newMeeting.type} onChange={e => setNewMeeting(p => ({...p, type: e.target.value as any}))}
                    className="w-full px-4 py-2.5 border border-dark-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="video">Video Call</option>
                    <option value="in-person">In Person</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark-700 mb-1">Participant</label>
                <input value={newMeeting.participant} onChange={e => setNewMeeting(p => ({...p, participant: e.target.value}))}
                  placeholder="Name or email"
                  className="w-full px-4 py-2.5 border border-dark-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark-700 mb-1">Description</label>
                <textarea value={newMeeting.description} onChange={e => setNewMeeting(p => ({...p, description: e.target.value}))}
                  placeholder="Optional agenda or notes..."
                  rows={2}
                  className="w-full px-4 py-2.5 border border-dark-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <Button variant="outline" fullWidth onClick={() => setShowNewMeeting(false)}>Cancel</Button>
              <Button fullWidth onClick={handleAddMeeting}>Schedule Meeting</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
