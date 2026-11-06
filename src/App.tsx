import { useState, type FormEvent } from 'react';
import {
  ArrowLeft,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Heart,
  History,
  Home,
  MessageCircle,
  MoreHorizontal,
  Search,
  Send,
  ShoppingBasket,
  Stethoscope,
  UserRound,
  UsersRound,
  Smartphone,
  Coffee,
  Sparkles,
  Star,
  BookOpen,
  Sparkle,
  ThumbsUp,
  Check,
  Navigation,
  AlertTriangle,
  Type,
  LogOut,
  ChevronRight,
  Info,
  X,
  SlidersHorizontal,
  Calendar as CalendarIcon,
  type LucideIcon,
} from 'lucide-react';

type Role = 'senior' | 'assistant';
type Tab = 'home' | 'visits' | 'chat' | 'profile';
type RequestStatus = 'pending' | 'accepted' | 'on_the_way' | 'completed';

type Message = {
  sender: 'me' | 'contact';
  text: string;
  time: string;
};

type Contact = {
  id: string;
  name: string;
  subtitle: string;
  initials: string;
  color: string;
  online: boolean;
};

type Task = {
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
};

type RequestItem = {
  id: string;
  seniorName: string;
  task: string;
  day: string;
  time: string;
  distance: string;
  initials: string;
  color: string;
  description?: string;
  isTopChoice?: boolean;
  matchReasons: string[];
  status: RequestStatus;
  volunteer?: string;
  rating?: number;
};

const tasks: Task[] = [
  { name: 'Groceries', description: 'Supermarket & supplies', icon: ShoppingBasket, color: 'bg-emerald-50 text-emerald-700' },
  { name: 'Doctor Escort', description: 'Clinic & pharmacy escort', icon: Stethoscope, color: 'bg-blue-50 text-blue-700' },
  { name: 'Companionship', description: 'Coffee, chats & walks', icon: Coffee, color: 'bg-amber-50 text-amber-700' },
  { name: 'Tech Support', description: 'Phone, bills & TV', icon: Smartphone, color: 'bg-violet-50 text-violet-700' },
  { name: 'Light Chores', description: 'A little help at home', icon: Sparkles, color: 'bg-rose-50 text-rose-700' },
];

const availableDays = [
  { id: 'Today', dayName: 'Fri', dateNum: '6', label: 'Today' },
  { id: 'Tomorrow', dayName: 'Sat', dateNum: '7', label: 'Tomorrow' },
  { id: 'Sun 8', dayName: 'Sun', dateNum: '8', label: 'Nov 8' },
  { id: 'Mon 9', dayName: 'Mon', dateNum: '9', label: 'Nov 9' },
  { id: 'Tue 10', dayName: 'Tue', dateNum: '10', label: 'Nov 10' },
  { id: 'Wed 11', dayName: 'Wed', dateNum: '11', label: 'Nov 11' },
  { id: 'Thu 12', dayName: 'Thu', dateNum: '12', label: 'Nov 12' },
  { id: 'Fri 13', dayName: 'Fri', dateNum: '13', label: 'Nov 13' },
];

const timeSlots = ['09:30 AM', '11:00 AM', '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM'];

const initialRequests: RequestItem[] = [
  {
    id: 'req-giorgos-1',
    seniorName: 'Mr. Giorgos K.',
    task: 'Tech Support',
    day: 'Tomorrow',
    time: '10:30 AM',
    distance: '1.2 km away',
    initials: 'GK',
    color: 'bg-amber-700',
    description: 'Need help connecting my new tablet to Wi-Fi and setting up my email.',
    isTopChoice: false,
    matchReasons: ['💻 CS / Tech Background match', '📍 Nearby area'],
    status: 'pending',
  },
  {
    id: 'req-sofia-1',
    seniorName: 'Mrs. Sofia P.',
    task: 'Groceries',
    day: 'Friday',
    time: '4:00 PM',
    distance: '600m away',
    initials: 'SP',
    color: 'bg-emerald-600',
    description: 'Carrying two heavy bags of fruits and water bottles from the local market.',
    isTopChoice: true,
    matchReasons: ['🛒 Very close to your location', '⏰ Fits your free afternoon hours'],
    status: 'pending',
  },
  {
    id: 'req-dimitris-1',
    seniorName: 'Mr. Dimitris M.',
    task: 'Companionship',
    day: 'Saturday',
    time: '11:00 AM',
    distance: '800m away',
    initials: 'DM',
    color: 'bg-blue-700',
    description: 'Looking for someone to walk together around Syntagma square and have a coffee.',
    isTopChoice: false,
    matchReasons: ['☕ Loves walks & coffee chats', '📍 Walking distance'],
    status: 'pending',
  },
  {
    id: 'req-old-1',
    seniorName: 'Mrs. Eleni M.',
    task: 'Companionship',
    day: 'Last Tuesday',
    time: '11:00 AM',
    distance: '400m away',
    initials: 'EM',
    color: 'bg-rose-600',
    matchReasons: [],
    status: 'completed',
    volunteer: 'Giorgos K.',
    rating: 5,
  },
];

const getTime = () => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [role, setRole] = useState<Role>('senior');
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [largeFont, setLargeFont] = useState(false);

  // Senior 2-Step Form states
  const [bookingStep, setBookingStep] = useState<1 | 2>(1);
  const [selectedTask, setSelectedTask] = useState('Doctor Escort');
  const [visitDay, setVisitDay] = useState('Today');
  const [visitTime, setVisitTime] = useState('02:30 PM');
  const [visitDescription, setVisitDescription] = useState('Need escort to Athens General Clinic for routine checkup and pharmacy pickup.');
  const [requestPosted, setRequestPosted] = useState(false);
  const [showSosModal, setShowSosModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 10, 1));

  // Assistant Details Modal state
  const [selectedDetailRequest, setSelectedDetailRequest] = useState<RequestItem | null>(null);

  const [requestsList, setRequestsList] = useState<RequestItem[]>(initialRequests);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');

  const [conversations, setConversations] = useState<Record<string, Message[]>>({
    giorgos: [{ sender: 'contact', text: 'Good morning, Mrs. Eleni! How can I help today?', time: '9:30 AM' }],
    eleni: [{ sender: 'contact', text: 'Hello Giorgos! I am ready whenever you are.', time: '9:32 AM' }],
  });

  const seniorContacts: Contact[] = [
    { id: 'giorgos', name: 'Giorgos K.', subtitle: 'Student Volunteer · CS AUEB', initials: 'GK', color: 'bg-blue-700', online: true },
  ];

  const assistantContacts: Contact[] = [
    { id: 'eleni', name: 'Mrs. Eleni M.', subtitle: 'CareBridge member', initials: 'EM', color: 'bg-rose-600', online: true },
  ];

  const contacts = role === 'senior' ? seniorContacts : assistantContacts;
  const currentContact = contacts.find(contact => contact.id === activeConversation);
  const formatCalendarDate = (date: Date) => {
    if (date.getFullYear() === 2026 && date.getMonth() === 10) {
      if (date.getDate() === 6) return 'Today';
      if (date.getDate() === 7) return 'Tomorrow';
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      ...(date.getFullYear() === 2026 ? {} : { year: 'numeric' }),
    });
  };

  const calendarMonthStart = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
  const calendarDayOffset = (calendarMonthStart.getDay() + 6) % 7;
  const daysInCalendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  const calendarCellCount = Math.ceil((calendarDayOffset + daysInCalendarMonth) / 7) * 7;
  const calendarCells = Array.from(
    { length: calendarCellCount },
    (_, index) => index < calendarDayOffset || index >= calendarDayOffset + daysInCalendarMonth
      ? null
      : index - calendarDayOffset + 1,
  );

  const renderCalendarModal = () => showCalendarModal && (
    <div
      className="absolute inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onClick={() => setShowCalendarModal(false)}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="calendar-dialog-title"
        onClick={event => event.stopPropagation()}
        className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 id="calendar-dialog-title" className="text-base font-bold text-slate-900">Choose a date</h2>
            <p className="mt-0.5 text-xs text-slate-500">Select any day for your visit</p>
          </div>
          <button
            type="button"
            aria-label="Close calendar"
            onClick={() => setShowCalendarModal(false)}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
            className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
          </button>
          <h3 className="text-sm font-bold text-slate-800">
            {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
            className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
            <span key={`${day}-${index}`} className="py-2 text-[10px] font-semibold text-slate-400">{day}</span>
          ))}
          {calendarCells.map((day, index) => {
            if (day === null) return <span key={`empty-${index}`} />;
            const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
            const isSelected = visitDay === formatCalendarDate(date);
            return (
              <button
                type="button"
                key={day}
                aria-pressed={isSelected}
                onClick={() => {
                  setVisitDay(formatCalendarDate(date));
                  setShowCalendarModal(false);
                }}
                className={`aspect-square rounded-xl text-sm font-medium transition ${
                  isSelected
                    ? 'bg-blue-700 font-bold text-white'
                    : 'text-slate-700 hover:bg-blue-50 hover:text-blue-800'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setShowCalendarModal(false)}
          className="mt-4 w-full rounded-xl bg-slate-100 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
        >
          Close
        </button>
      </section>
    </div>
  );

  const selectRoleFromWelcome = (selectedRole: Role) => {
    setRole(selectedRole);
    setShowWelcome(false);
    setActiveTab('home');
    setBookingStep(1);
  };

  const postRequest = () => {
    const newReq: RequestItem = {
      id: `req-${Date.now()}`,
      seniorName: 'Mrs. Eleni M.',
      task: selectedTask,
      day: visitDay,
      time: visitTime,
      distance: '400m away',
      initials: 'EM',
      color: 'bg-rose-600',
      description: visitDescription || 'No special notes provided.',
      isTopChoice: true,
      matchReasons: ['🚗 Car available', '💻 Computer Science background match', '📍 < 500m away'],
      status: 'pending',
      volunteer: 'Finding Student...',
    };
    setRequestsList(prev => [newReq, ...prev]);
    setRequestPosted(true);
    setBookingStep(1);
  };

  const updateRequestStatus = (reqId: string, newStatus: RequestStatus) => {
    setRequestsList(prev =>
      prev.map(r => (r.id === reqId ? { ...r, status: newStatus, volunteer: 'Giorgos K.' } : r))
    );
  };

  const updateRating = (reqId: string, newRating: number) => {
    setRequestsList(prev =>
      prev.map(r => (r.id === reqId ? { ...r, rating: newRating } : r))
    );
  };

  const acceptRequest = (reqId: string) => {
    const targetReq = requestsList.find(r => r.id === reqId);
    if (!targetReq) return;

    updateRequestStatus(reqId, 'accepted');

    const autoMsgSenior: Message = {
      sender: 'contact',
      text: `Hi Mrs. Eleni! I accepted your request for ${targetReq.task} (${targetReq.day} at ${targetReq.time}). See you then!`,
      time: getTime(),
    };
    const autoMsgAssistant: Message = {
      sender: 'me',
      text: `Hi Mrs. Eleni! I accepted your request for ${targetReq.task} (${targetReq.day} at ${targetReq.time}). See you then!`,
      time: getTime(),
    };

    setConversations(prev => ({
      ...prev,
      giorgos: [...(prev['giorgos'] || []), autoMsgSenior],
      eleni: [...(prev['eleni'] || []), autoMsgAssistant],
    }));

    if (selectedDetailRequest?.id === reqId) {
      setSelectedDetailRequest(null);
    }
  };

  const sendQuickMessage = (text: string) => {
    if (!activeConversation) return;
    setConversations(current => ({
      ...current,
      [activeConversation]: [
        ...(current[activeConversation] ?? []),
        { sender: 'me', text, time: getTime() },
      ],
    }));
  };

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = messageText.trim();
    if (!text || !activeConversation) return;
    sendQuickMessage(text);
    setMessageText('');
  };

  const eleniBookings = requestsList.filter(r => r.seniorName === 'Mrs. Eleni M.');
  const upcomingEleni = eleniBookings.filter(r => r.status !== 'completed');
  const pastEleni = eleniBookings.filter(r => r.status === 'completed');

  const alexAcceptedVisits = requestsList.filter(r => r.volunteer === 'Giorgos K.' && r.status !== 'completed' && r.status !== 'pending');
  const alexPastVisits = requestsList.filter(r => r.volunteer === 'Giorgos K.' && r.status === 'completed');
  const pendingRequestsForPal = requestsList.filter(r => r.status === 'pending');

  const getStepIndex = (status: RequestStatus) => {
    switch (status) {
      case 'pending': return 1;
      case 'accepted': return 2;
      case 'on_the_way': return 3;
      case 'completed': return 4;
      default: return 1;
    }
  };

  const renderProgressBar = (status: RequestStatus) => {
    const currentStep = getStepIndex(status);
    const steps = [
      { label: 'Requested', icon: CalendarDays },
      { label: 'Student Found', icon: CheckCircle2 },
      { label: 'On the way 🚗', icon: Navigation },
      { label: 'Done', icon: Check },
    ];

    return (
      <div className="mt-3 pt-3 border-t border-blue-100">
        <div className="flex items-center justify-between relative mb-2">
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-4 h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 85}%` }}
          />

          {steps.map((step, idx) => {
            const stepNum = idx + 1;
            const isDone = stepNum <= currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <div key={step.label} className="flex flex-col items-center relative z-10">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    isDone
                      ? isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                        : 'bg-blue-600 text-white'
                      : 'bg-white text-slate-400 border-2 border-slate-200'
                  }`}
                >
                  {isDone ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : stepNum}
                </div>
                <span className={`mt-1.5 text-[9px] font-medium ${isDone ? 'text-blue-900 font-semibold' : 'text-slate-400'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWelcomeScreen = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-900 via-blue-800 to-slate-900 text-white px-6 py-8 justify-between">
      <div className="pt-6 text-center space-y-3">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-md text-white border border-white/20 shadow-xl">
          <Heart className="h-8 w-8 fill-white" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">CareBridge</h1>
        <p className="text-xs text-blue-200 max-w-xs mx-auto leading-relaxed">
          Connecting seniors with trusted local student volunteers in your neighborhood.
        </p>
      </div>

      <div className="space-y-3 py-6">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-blue-300">Choose mode to enter</p>
        
        <button
          type="button"
          onClick={() => selectRoleFromWelcome('senior')}
          className="flex w-full items-center justify-between rounded-2xl bg-white p-4 text-slate-900 shadow-lg transition active:scale-[0.98] hover:bg-slate-50"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-800">
              <UsersRound className="h-6 w-6" />
            </span>
            <div className="text-left">
              <span className="block text-sm font-bold">I need help (Senior / Family)</span>
              <span className="block text-xs text-slate-500">Post visit requests & find student volunteers</span>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-400 shrink-0" />
        </button>

        <button
          type="button"
          onClick={() => selectRoleFromWelcome('assistant')}
          className="flex w-full items-center justify-between rounded-2xl bg-white/10 border border-white/20 p-4 text-white shadow-lg transition active:scale-[0.98] hover:bg-white/20"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white">
              <GraduationCap className="h-6 w-6" />
            </span>
            <div className="text-left">
              <span className="block text-sm font-bold">I want to help (Student Volunteer)</span>
              <span className="block text-xs text-blue-200">Browse nearby visits & offer companionship</span>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-blue-300 shrink-0" />
        </button>
      </div>

      <p className="text-center text-[11px] text-blue-300/60">University Project Mockup · CareBridge 2026</p>
    </div>
  );

  const renderSeniorHome = () => (
    <div className={`space-y-5 px-5 py-5 ${largeFont ? 'text-base' : 'text-sm'}`}>
      <div>
        <p className="text-slate-500">Good morning,</p>
        <h1 className={`mt-0.5 font-bold tracking-tight text-slate-900 ${largeFont ? 'text-3xl' : 'text-2xl'}`}>Mrs. Eleni</h1>
      </div>

      {requestPosted && (
        <div role="status" className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>Request posted! Switch to <strong>Assistant</strong> mode to accept it.</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('visits')}
            className="font-bold underline shrink-0"
          >
            My Visits
          </button>
        </div>
      )}

      {bookingStep === 1 ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-[11px] font-bold text-blue-800 uppercase tracking-wider">
              Step 1 of 2
            </span>
            <span className="text-xs text-slate-400">Select a need</span>
          </div>

          <h2 className="text-base font-bold text-slate-900">What do you need help with?</h2>

          <div className="space-y-2.5">
            {tasks.map(task => {
              const Icon = task.icon;
              const selected = selectedTask === task.name;
              return (
                <button
                  type="button"
                  key={task.name}
                  onClick={() => {
                    setSelectedTask(task.name);
                    setRequestPosted(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition ${selected ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                >
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${task.color}`}>
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block font-semibold text-slate-800 ${largeFont ? 'text-base' : 'text-sm'}`}>{task.name}</span>
                    <span className="mt-0.5 block text-xs text-slate-500">{task.description}</span>
                  </span>
                  {selected && <CheckCircle2 className="h-6 w-6 shrink-0 text-blue-700" />}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setBookingStep(2)}
            className={`mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-800 py-4 font-bold text-white shadow-lg shadow-blue-900/15 transition hover:bg-blue-900 active:scale-[0.99] ${largeFont ? 'text-base' : 'text-sm'}`}
          >
            <span>Find Student</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        </section>
      ) : (
        /* STEP 2: DATE AND TIME SELECTION */
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setBookingStep(1)}
              className="flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Services
            </button>
            <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-[11px] font-bold text-blue-800 uppercase tracking-wider">
              Step 2 of 2
            </span>
          </div>

          <div className="rounded-xl bg-blue-50/70 border border-blue-100 p-3 flex items-center justify-between">
            <span className="text-xs text-blue-900">Selected Service:</span>
            <span className="text-xs font-bold text-blue-800 bg-white px-2.5 py-1 rounded-lg border border-blue-200">{selectedTask}</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-4 shadow-sm">
            
            {/* HORIZONTAL SCROLLING DATE STRIP */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <CalendarIcon className="h-4 w-4 text-blue-700" /> Select Date
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCalendarModal(true)}
                  className="shrink-0 rounded-lg px-2 py-1 text-[11px] font-semibold text-blue-700 transition hover:bg-blue-50"
                >
                  Full Calendar 📅
                </button>
              </div>

              {/* Horizontal Scroll Container */}
              <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1 px-0.5 scrollbar-thin">
                {availableDays.map(item => {
                  const isSelected = visitDay === item.id || visitDay === item.label;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setVisitDay(item.label)}
                      className={`flex w-16 shrink-0 flex-col items-center justify-center rounded-2xl border py-2.5 px-2 transition-all active:scale-95 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-700 text-white shadow-md ring-2 ring-blue-200'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white'
                      }`}
                    >
                      <span className={`text-[10px] uppercase font-bold tracking-wider ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                        {item.dayName}
                      </span>
                      <span className="text-base font-black my-0.5 leading-none">{item.dateNum}</span>
                      <span className={`text-[10px] font-medium ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* UNIFIED TIME SLOT GRID */}
            <div className="space-y-3 pt-1 border-t border-slate-100">
              <h3 className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <Clock3 className="h-4 w-4 text-blue-700" /> Select Time
              </h3>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {timeSlots.map(slot => {
                  const isSelected = visitTime === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setVisitTime(slot)}
                      className={`min-w-0 rounded-xl border px-1.5 py-2.5 text-[11px] font-bold transition active:scale-95 sm:text-xs ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-600'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DESCRIPTION TEXTAREA */}
            <div className="pt-1 border-t border-slate-100">
              <label className="mb-1.5 block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Special Notes / Description
              </label>
              <textarea
                rows={3}
                value={visitDescription}
                onChange={e => setVisitDescription(e.target.value)}
                placeholder="e.g. Escort to clinic, help with heavy bags, etc..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 outline-none focus:border-blue-600 focus:bg-white transition"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={postRequest}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-800 py-4 font-bold text-white shadow-lg shadow-blue-900/15 transition hover:bg-blue-900 active:scale-[0.99] ${largeFont ? 'text-base' : 'text-sm'}`}
          >
            <Heart className="h-5 w-5" />
            Post Visit Request
          </button>
        </section>
      )}

    </div>
  );

  const renderSeniorVisits = () => (
    <div className="space-y-5 px-5 py-5">
      <div>
        <p className="text-sm text-slate-500 font-medium">Your schedule</p>
        <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900">My Visits</h1>
      </div>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <CalendarCheck className="h-4 w-4 text-blue-700" />
          Active Requests ({upcomingEleni.length})
        </h2>
        {upcomingEleni.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-center text-xs text-slate-400">
            No active requests. Post one from Home!
          </div>
        ) : (
          upcomingEleni.map(b => (
            <div key={b.id} className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">{b.task}</span>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                  b.status === 'on_the_way'
                    ? 'bg-blue-600 text-white animate-pulse'
                    : b.status === 'accepted'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {b.status === 'on_the_way'
                    ? '🚗 Giorgos is on the way!'
                    : b.status === 'accepted'
                    ? `Confirmed: ${b.volunteer}`
                    : 'Finding Student...'}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                <Clock3 className="h-4 w-4 text-slate-400" />
                {b.day} at {b.time}
              </div>

              {renderProgressBar(b.status)}

              {b.status !== 'pending' && (
                <button
                  type="button"
                  onClick={() => { setActiveTab('chat'); setActiveConversation('giorgos'); }}
                  className="mt-3 text-xs font-bold text-blue-700 underline flex items-center gap-1"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> Chat with {b.volunteer}
                </button>
              )}
            </div>
          ))
        )}
      </section>

      <section className="space-y-3 pt-2">
        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <History className="h-4 w-4 text-slate-500" />
          Past Visits History ({pastEleni.length})
        </h2>
        <div className="space-y-2.5">
          {pastEleni.map(b => (
            <div key={b.id} className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">{b.task}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{b.day} · Assisted by {b.volunteer}</p>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => updateRating(b.id, star)}
                    className="p-0.5 transition active:scale-125"
                  >
                    <Star
                      className={`h-4 w-4 ${
                        star <= (b.rating || 5)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-slate-100 text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderAssistantVisits = () => (
    <div className="space-y-5 px-5 py-5">
      <div>
        <p className="text-sm text-slate-500 font-medium">Assigned Tasks</p>
        <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900">My Schedule</h1>
      </div>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <CalendarCheck className="h-4 w-4 text-blue-700" />
          Active Visits ({alexAcceptedVisits.length})
        </h2>
        {alexAcceptedVisits.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-center text-xs text-slate-400">
            No active visits accepted yet. Accept a request from the Feed!
          </div>
        ) : (
          alexAcceptedVisits.map(visit => (
            <div key={visit.id} className="rounded-2xl border border-blue-200 bg-white p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{visit.seniorName}</h3>
                  <p className="text-xs font-medium text-blue-800">{visit.task}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                  visit.status === 'on_the_way' ? 'bg-blue-600 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {visit.status === 'on_the_way' ? '🚗 On the way' : 'Accepted'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock3 className="h-3.5 w-3.5" />
                {visit.day} at {visit.time} · <span className="font-semibold text-slate-600">{visit.distance}</span>
              </div>

              <div className="pt-1 flex gap-2">
                {visit.status === 'accepted' && (
                  <button
                    type="button"
                    onClick={() => updateRequestStatus(visit.id, 'on_the_way')}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-blue-700 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-800"
                  >
                    <Navigation className="h-3.5 w-3.5" /> Start Route (On the way 🚗)
                  </button>
                )}
                {visit.status === 'on_the_way' && (
                  <button
                    type="button"
                    onClick={() => updateRequestStatus(visit.id, 'completed')}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-700 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-800"
                  >
                    <Check className="h-3.5 w-3.5" /> Mark Completed
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => { setActiveTab('chat'); setActiveConversation('eleni'); }}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  <MessageCircle className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      <section className="space-y-3 pt-2">
        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <History className="h-4 w-4 text-slate-500" />
          Completed Visits History ({alexPastVisits.length})
        </h2>
        <div className="space-y-2.5">
          {alexPastVisits.map(b => (
            <div key={b.id} className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">{b.seniorName} · {b.task}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{b.day} · Completed</p>
              </div>
              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {b.rating}.0
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderAssistantHome = () => (
    <div className="space-y-4 px-5 py-5">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Good morning,</p>
            <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900">Giorgos K.</h1>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Available
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-500">Recommended requests near you</p>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-blue-50 px-3.5 py-3">
        <span className="flex items-center gap-2 text-xs font-medium text-blue-900">
          <Sparkle className="h-4 w-4 text-blue-700" />
          Recommended Visits
        </span>
        <span className="text-[10px] font-semibold text-blue-700 bg-white px-2 py-0.5 rounded-md">Smart Feed</span>
      </div>

      <div className="space-y-3">
        {pendingRequestsForPal.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-400">
            No open requests right now. Switch to Senior mode to post one!
          </div>
        ) : (
          pendingRequestsForPal.map(request => (
            <article key={request.id} className={`rounded-2xl border p-4 shadow-sm transition ${request.isTopChoice ? 'border-blue-400 bg-blue-50/30 ring-1 ring-blue-400' : 'border-slate-200 bg-white'}`}>
              <div className="flex items-start gap-3">
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${request.color}`}>
                  {request.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="truncate text-sm font-bold text-slate-900">{request.seniorName}</h2>
                    {request.isTopChoice ? (
                      <span className="flex items-center gap-1 rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                        <ThumbsUp className="h-3 w-3" /> Best Choice
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                        {request.distance}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs font-medium text-blue-800">{request.task}</p>
                </div>
              </div>

              <div className="mt-3 rounded-xl bg-slate-50 p-2.5 space-y-1 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Why this visit fits you</p>
                {request.matchReasons.map((reason, idx) => (
                  <p key={idx} className="text-[11px] font-medium text-slate-600 flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-blue-600" />
                    {reason}
                  </p>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> {request.day} · {request.time}</span>
                {request.isTopChoice && <span className="font-semibold text-slate-600">{request.distance}</span>}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDetailRequest(request)}
                  className="flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
                >
                  <Info className="h-3.5 w-3.5 text-slate-500" /> Details
                </button>

                <button
                  type="button"
                  onClick={() => acceptRequest(request.id)}
                  className="flex items-center justify-center gap-1 rounded-xl bg-blue-800 py-2.5 text-xs font-bold text-white transition hover:bg-blue-900 active:scale-[0.98]"
                >
                  Accept Visit
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );

  const renderInbox = () => (
    <section className="min-h-full bg-white">
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <div>
          <p className="text-xs font-medium text-slate-400">{role === 'senior' ? 'Stay connected' : 'Your conversations'}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Messages</h1>
        </div>
        <button type="button" className="rounded-full p-2 text-slate-600 hover:bg-slate-100">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>
      <div className="px-5 pb-4">
        <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2.5 text-slate-400">
          <Search className="h-4 w-4" />
          <span className="text-sm">Search messages</span>
        </div>
      </div>
      <div className="px-5 pb-2 text-xs font-semibold text-slate-500">Recent DMs</div>
      <div>
        {contacts.map(contact => {
          const messages = conversations[contact.id] ?? [];
          const lastMessage = messages[messages.length - 1];
          return (
            <button
              type="button"
              key={contact.id}
              onClick={() => setActiveConversation(contact.id)}
              className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-slate-50"
            >
              <span className="relative shrink-0">
                <span className={`flex h-14 w-14 items-center justify-center rounded-full text-sm font-bold text-white ${contact.color}`}>
                  {contact.initials}
                </span>
                {contact.online && <span className="absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-slate-900">{contact.name}</span>
                  <span className="shrink-0 text-[10px] text-slate-400">{lastMessage?.time}</span>
                </span>
                <span className="mt-1 block truncate text-xs text-slate-500">{lastMessage?.text}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );

  const renderConversation = () => {
    if (!currentContact) return null;
    const quickReplies = role === 'senior'
      ? ['I am ready!', 'Thank you so much!', 'See you at the entrance']
      : ['On my way! 🚗', 'I am here at the door', 'Got the supplies 🛒'];

    return (
      <section className="flex h-full min-h-[520px] flex-col bg-white">
        <header className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <button
              type="button"
              onClick={() => setActiveConversation(null)}
              className="rounded-full p-1.5 text-slate-600 hover:bg-slate-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${currentContact.color}`}>
              {currentContact.initials}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-slate-900">{currentContact.name}</span>
              <span className="block text-[11px] text-slate-500">
                {currentContact.online ? 'Active now' : currentContact.subtitle}
              </span>
            </span>
          </div>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {(conversations[currentContact.id] ?? []).map((message, index) => (
            <div key={`${currentContact.id}-${index}`} className={`flex flex-col ${message.sender === 'me' ? 'items-end' : 'items-start'}`}>
              <p className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${message.sender === 'me' ? 'rounded-br-md bg-blue-700 text-white' : 'rounded-bl-md bg-slate-100 text-slate-800'}`}>
                {message.text}
              </p>
              <span className="mt-1 px-1 text-[10px] text-slate-400">{message.time}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 overflow-x-auto bg-slate-50 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 shrink-0">Quick:</span>
          {quickReplies.map((reply, i) => (
            <button
              key={i}
              type="button"
              onClick={() => sendQuickMessage(reply)}
              className="shrink-0 rounded-full bg-white border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-blue-50 hover:border-blue-300 active:scale-95 transition"
            >
              {reply}
            </button>
          ))}
        </div>

        <form onSubmit={sendMessage} className="flex items-center gap-2 border-t border-slate-100 px-3 py-3">
          <input
            value={messageText}
            onChange={event => setMessageText(event.target.value)}
            placeholder="Message..."
            className="min-w-0 flex-1 rounded-full bg-slate-100 px-4 py-2.5 text-sm text-slate-800 outline-none"
          />
          <button type="submit" disabled={!messageText.trim()} className="rounded-full p-2.5 text-blue-700 disabled:opacity-40">
            <Send className="h-5 w-5" />
          </button>
        </form>
      </section>
    );
  };

  const renderSeniorProfile = () => (
    <div className="space-y-4 px-5 py-5">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">Profile & Settings</h1>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-900">EM</div>
        <h2 className="mt-3 text-base font-bold text-slate-900">Mrs. Eleni M.</h2>
        <p className="mt-1 text-xs text-slate-500">CareBridge member · Athens</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Accessibility & Actions</h3>
        
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <Type className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Large Text Mode</p>
              <p className="text-[11px] text-slate-400">Easier reading for seniors</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setLargeFont(prev => !prev)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${largeFont ? 'bg-blue-700' : 'bg-slate-200'}`}
          >
            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${largeFont ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className="border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={() => setShowWelcome(true)}
            className="flex w-full items-center justify-between rounded-xl bg-rose-50 p-3 text-left text-sm font-bold text-rose-600 hover:bg-rose-100 transition"
          >
            <span className="flex items-center gap-2.5">
              <LogOut className="h-4 w-4 text-rose-600" /> Logout (Home Screen)
            </span>
            <ChevronRight className="h-4 w-4 text-rose-400" />
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Background & Needs</h3>
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
            <BookOpen className="h-3.5 w-3.5" /> Retired OPE Employee
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
            <Coffee className="h-3.5 w-3.5" /> Loves Walks & Coffee
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-800">
            <Stethoscope className="h-3.5 w-3.5" /> Frequent Clinic Escort Needed
          </span>
        </div>
      </section>
    </div>
  );

  const renderAssistantProfile = () => (
    <div className="space-y-4 px-5 py-5">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">Profile & Settings</h1>
      
      <section className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-900">GK</div>
        <h2 className="mt-3 text-base font-bold text-slate-900">Giorgos K.</h2>
        <p className="mt-1 text-xs font-medium text-blue-700">Computer Science Student · AUEB</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">MY SKILLS & OFFERINGS</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">What I can offer in my neighborhood</p>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <span className="rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-800">🛒 Groceries</span>
          <span className="rounded-full bg-violet-50 border border-violet-100 px-3 py-1.5 text-xs font-semibold text-violet-800">💻 Tech Support</span>
          <span className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-800">🩺 Pharmacy & Clinic</span>
          <span className="rounded-full bg-amber-50 border border-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-800">☕ Companionship & Walks</span>
          <span className="rounded-full bg-rose-50 border border-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-800">🚗 Vehicle Available</span>
        </div>

        <button
          type="button"
          onClick={() => alert('Availability settings opened!')}
          className="mt-2 flex items-center justify-between w-full pt-3 border-t border-slate-100 text-xs font-bold text-blue-800 hover:underline"
        >
          <span className="flex items-center gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5 text-blue-700" /> Edit Availability & Hours
          </span>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </button>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Actions</h3>
        <button
          type="button"
          onClick={() => setShowWelcome(true)}
          className="flex w-full items-center justify-between rounded-xl bg-rose-50 p-3 text-left text-sm font-bold text-rose-600 hover:bg-rose-100 transition"
        >
          <span className="flex items-center gap-2.5">
            <LogOut className="h-4 w-4 text-rose-600" /> Logout (Home Screen)
          </span>
          <ChevronRight className="h-4 w-4 text-rose-400" />
        </button>
      </section>
    </div>
  );

  const seniorTabs: { id: Tab; label: string; icon: LucideIcon }[] = [
    { id: 'home', label: 'Book', icon: Home },
    { id: 'visits', label: 'My Visits', icon: CalendarCheck },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'profile', label: 'Profile', icon: UserRound },
  ];

  const assistantTabs: { id: Tab; label: string; icon: LucideIcon }[] = [
    { id: 'home', label: 'Feed', icon: Home },
    { id: 'visits', label: 'My Visits', icon: CalendarCheck },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'profile', label: 'Profile', icon: UserRound },
  ];

  const currentTabs = role === 'senior' ? seniorTabs : assistantTabs;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-200 p-0 font-sans sm:p-6">
      <div className="relative flex h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-slate-50 shadow-2xl sm:h-[850px] sm:rounded-[36px] sm:border-[8px] sm:border-slate-900">
        
        {showWelcome ? (
          renderWelcomeScreen()
        ) : (
          <>
            <header className="z-10 flex shrink-0 items-center justify-between bg-white px-5 pb-3 pt-[max(14px,env(safe-area-inset-top))]">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-800 text-white">
                  <Heart className="h-5 w-5 fill-white" />
                </span>
                <div>
                  <span className="block text-sm font-extrabold tracking-tight text-slate-900">CareBridge</span>
                  <span className="block text-[10px] text-slate-500">{role === 'senior' ? 'Senior View' : 'Assistant View'}</span>
                </div>
              </div>

              {role === 'senior' && (
                <button
                  type="button"
                  onClick={() => setShowSosModal(true)}
                  className="flex items-center gap-1 rounded-full bg-rose-600 px-3 py-1.5 text-[11px] font-extrabold text-white shadow-sm hover:bg-rose-700 active:scale-95 transition"
                >
                  <AlertTriangle className="h-3.5 w-3.5" /> SOS
                </button>
              )}
            </header>

            {showSosModal && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                <div className="w-full max-w-xs rounded-3xl bg-white p-5 text-center shadow-2xl space-y-3">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                    <AlertTriangle className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Emergency Alert</h3>
                  <p className="text-xs text-slate-500">Contact family and local emergency contacts (+30 210 555 0142)?</p>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowSosModal(false)}
                      className="rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => { alert('Emergency contact notified!'); setShowSosModal(false); }}
                      className="rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white hover:bg-rose-700"
                    >
                      Call Now
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedDetailRequest && (
              <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 p-0 sm:p-4 backdrop-blur-sm">
                <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-white p-5 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <span className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white ${selectedDetailRequest.color}`}>
                        {selectedDetailRequest.initials}
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{selectedDetailRequest.seniorName}</h3>
                        <p className="text-xs text-blue-700 font-semibold">{selectedDetailRequest.task}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedDetailRequest(null)}
                      className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs text-slate-600">
                    <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Clock3 className="h-4 w-4 text-blue-700" /> {selectedDetailRequest.day} at {selectedDetailRequest.time}
                      </span>
                      <span className="font-semibold text-slate-500">{selectedDetailRequest.distance}</span>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Notes from Senior</h4>
                      <p className="rounded-xl bg-blue-50/50 border border-blue-100 p-3 text-slate-800 leading-relaxed font-medium">
                        "{selectedDetailRequest.description || 'No special notes.'}"
                      </p>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Smart Match Reasons</h4>
                      <div className="space-y-1">
                        {selectedDetailRequest.matchReasons.map((reason, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-slate-700 font-medium">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />
                            {reason}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedDetailRequest(null)}
                      className="rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={() => acceptRequest(selectedDetailRequest.id)}
                      className="rounded-xl bg-blue-800 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-900"
                    >
                      Accept Visit
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
              {activeTab === 'home' && (role === 'senior' ? renderSeniorHome() : renderAssistantHome())}
              {activeTab === 'visits' && (role === 'senior' ? renderSeniorVisits() : renderAssistantVisits())}
              {activeTab === 'chat' && (currentContact ? renderConversation() : renderInbox())}
              {activeTab === 'profile' && (role === 'senior' ? renderSeniorProfile() : renderAssistantProfile())}
            </div>

            {renderCalendarModal()}

            <nav aria-label="Main navigation" className="z-10 grid shrink-0 grid-cols-4 border-t border-slate-200 bg-white px-2 pb-[max(10px,env(safe-area-inset-bottom))] pt-2">
              {currentTabs.map(item => {
                const Icon = item.icon;
                const selected = activeTab === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      if (item.id !== 'chat') setActiveConversation(null);
                    }}
                    className={`flex flex-col items-center gap-1 rounded-xl py-1.5 transition ${selected ? 'text-blue-800 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <Icon className={`h-5 w-5 ${selected ? 'stroke-[2.5]' : ''}`} />
                    <span className="text-[10px]">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </>
        )}
      </div>
    </main>
  );
}