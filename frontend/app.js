const { useState, useEffect, useMemo } = React;

// --- DUMMY DATA ---
const WORKSHOPS_DATA = [
  { id: 1, title: 'Python for Beginners', date: '2026-05-10', status: 'Upcoming', students: 45, type: 'Online', duration: '2 Hours' },
  { id: 2, title: 'Advanced Machine Learning', date: '2026-05-22', status: 'Proposed', students: 0, type: 'Hybrid', duration: '5 Hours' },
  { id: 3, title: 'Django Web Development', date: '2026-06-05', status: 'Completed', students: 120, type: 'Online', duration: '3 Hours' },
  { id: 4, title: 'Data Science with Pandas', date: '2026-06-15', status: 'Upcoming', students: 85, type: 'Offline', duration: '4 Hours' },
  { id: 5, title: 'React UI/UX Modernization', date: '2026-07-01', status: 'Proposed', students: 0, type: 'Online', duration: '2 Hours' }
];

const STATS_DATA = {
  totalWorkshops: 24,
  activeStudents: 1450,
  upcomingSessions: 8,
  completionRate: '94%'
};

// --- SVG ICONS ---
const Icons = {
  Sun: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Moon: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
  Menu: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>,
  Home: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Book: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  User: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  LogOut: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  Search: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Filter: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
  Calendar: () => <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  MapPin: () => <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Clock: () => <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};

// --- GLOBAL NOTIFICATION SYSTEM ---
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up flex items-center p-4 rounded-xl shadow-xl glass bg-white/90 dark:bg-dark-card/90 border-l-4 border-brand-500">
      <div className={`mr-3 ${type === 'success' ? 'text-brand-500' : 'text-blue-500'}`}>
        <Icons.Book />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white">{message}</p>
      </div>
      <button onClick={onClose} className="ml-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
        &times;
      </button>
    </div>
  );
};

// --- SHARED COMPONENTS ---
const StatCard = ({ title, value, gradientStr }) => (
  <div className={`p-6 rounded-2xl glass shadow-lg border border-gray-100 dark:border-dark-card flex flex-col justify-center relative overflow-hidden animate-fade-in group cursor-pointer hover:-translate-y-1 transition-transform`}>
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20 bg-gradient-to-br ${gradientStr} group-hover:scale-150 transition-transform duration-500`}></div>
    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1 z-10">{title}</p>
    <h3 className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${gradientStr} dark:bg-none dark:text-white z-10`}>{value}</h3>
  </div>
);

const Button = ({ children, variant = 'primary', onClick, className = '', icon, type="button" }) => {
  const baseStyle = "flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white shadow-md hover:shadow-lg focus:ring-brand-500",
    secondary: "bg-white dark:bg-dark-card text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm focus:ring-gray-200",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-md focus:ring-red-500",
    glow: "bg-brand-500 text-white shadow-[0_0_15px_rgba(20,184,166,0.5)] hover:shadow-[0_0_25px_rgba(20,184,166,0.7)] focus:ring-brand-500"
  };
  return (
    <button type={type} onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {icon && <span className={children ? "mr-2" : ""}>{icon}</span>}
      {children}
    </button>
  );
};

const StatusPill = ({ status }) => {
  const styles = {
    'Upcoming': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'Completed': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'Proposed': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

// --- VIEWS ---

const DashboardView = ({ showToast }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Welcome back, Instructor</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Here is your workshop overview for today.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button icon={<Icons.Plus />} variant="glow" onClick={() => showToast('Redirecting to Propose Workshop...', 'info')}>Propose Workshop</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Workshops" value={STATS_DATA.totalWorkshops} gradientStr="from-blue-400 to-indigo-500" />
        <StatCard title="Active Students" value={STATS_DATA.activeStudents} gradientStr="from-brand-400 to-emerald-500" />
        <StatCard title="Upcoming Sessions" value={STATS_DATA.upcomingSessions} gradientStr="from-orange-400 to-amber-500" />
        <StatCard title="Avg. Completion" value={STATS_DATA.completionRate} gradientStr="from-purple-400 to-pink-500" />
      </div>

      <div className="glass rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-card">
        <h2 className="text-xl font-semibold mb-6 flex justify-between items-center text-gray-900 dark:text-white">
          <span>Recent Workshops</span>
          <button className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 font-medium">View All</button>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400">
                <th className="pb-3 px-4">Workshop Title</th>
                <th className="pb-3 px-4">Date</th>
                <th className="pb-3 px-4">Type</th>
                <th className="pb-3 px-4 text-center">Students</th>
                <th className="pb-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {WORKSHOPS_DATA.slice(0, 4).map((ws, i) => (
                <tr key={ws.id} className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-dark-card/50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/20 dark:bg-dark-card/20'}`}>
                  <td className="py-4 px-4 font-medium text-gray-900 dark:text-gray-100">{ws.title}</td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-300">{ws.date}</td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-300">{ws.type}</td>
                  <td className="py-4 px-4 text-center text-gray-600 dark:text-gray-300">{ws.students}</td>
                  <td className="py-4 px-4 text-right"><StatusPill status={ws.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const WorkshopsView = ({ showToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredWorkshops = WORKSHOPS_DATA.filter(ws => {
    const matchesSearch = ws.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' ? true : ws.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Workshops Library</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Browse, filter, and manage workshop sessions.</p>
        </div>
        
        {/* Search & Filter Bar */}
        <div className="flex w-full md:w-auto space-x-3">
          <div className="relative flex-1 md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Icons.Search />
            </div>
            <input 
              type="text" 
              placeholder="Search workshops..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-dark-card/70 focus:ring-2 focus:ring-brand-500 outline-none text-gray-900 dark:text-white"
            />
          </div>
          <div className="relative">
            <select 
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="appearance-none pl-10 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-dark-card/70 focus:ring-2 focus:ring-brand-500 outline-none text-gray-900 dark:text-white font-medium cursor-pointer"
            >
              <option value="All">All Types</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
              <option value="Hybrid">Hybrid</option>
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Icons.Filter />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Iteration */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkshops.map(ws => (
          <div key={ws.id} className="glass rounded-2xl p-6 border border-gray-200/60 dark:border-gray-700/60 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col h-full bg-white/40 dark:bg-dark-card/40">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${ws.type === 'Online' ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300' : ws.type === 'Offline' ? 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300' : 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300'}`}>
                {ws.type}
              </span>
              <StatusPill status={ws.status} />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{ws.title}</h3>
            
            <div className="space-y-2 mt-auto">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <span className="mr-2 text-gray-400"><Icons.Calendar /></span>
                {ws.date}
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <span className="mr-2 text-gray-400"><Icons.Clock /></span>
                {ws.duration}
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <span className="text-sm font-semibold text-gray-500">
                  <strong className="text-gray-900 dark:text-white">{ws.students}</strong> Students
                </span>
                <Button variant="secondary" className="px-4 py-1.5 text-sm" onClick={() => showToast(`Viewing details for ${ws.title}`, 'info')}>Details</Button>
              </div>
            </div>
          </div>
        ))}
        {filteredWorkshops.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 mb-4">
              <Icons.Book />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No workshops found</h3>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileView = ({ showToast }) => {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="glass rounded-3xl overflow-hidden shadow-sm border border-gray-200/50 dark:border-gray-800/50">
        <div className="h-48 bg-gradient-to-r from-brand-600 to-blue-600 relative">
          <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
        </div>
        <div className="p-8 pt-0 relative flex flex-col md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 mb-4 md:mb-0 space-y-4 md:space-y-0 md:space-x-6 relative">
            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-dark-bg bg-gradient-to-br from-brand-300 to-indigo-300 flex items-center justify-center shadow-xl">
              <span className="text-4xl font-bold text-white">PA</span>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Prof. Andrew</h1>
              <p className="text-brand-600 dark:text-brand-400 font-medium">Senior Instructor & Coordinator</p>
            </div>
          </div>
          <div className="flex space-x-3 justify-center">
            <Button variant="secondary" onClick={() => showToast('Opening Upload Dialog...', 'info')}>Update Avatar</Button>
            <Button variant="primary" onClick={() => showToast('Profile settings saved successfully!', 'success')}>Save Changes</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 glass rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/50">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Personal Info</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Email Address</p>
              <p className="font-medium text-gray-900 dark:text-gray-300">andrew@institute.edu</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Location</p>
              <p className="font-medium text-gray-900 dark:text-gray-300">Mumbai, India</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Member Since</p>
              <p className="font-medium text-gray-900 dark:text-gray-300">March 2024</p>
            </div>
          </div>
        </div>
        
        <div className="col-span-1 md:col-span-2 glass rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/50">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity & Comments</h3>
          <div className="space-y-4">
            {[1, 2, 3].map(item => (
              <div key={item} className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/20">
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  <strong className="text-brand-600 dark:text-brand-400">Coordinator Jane</strong> approved your Workshop proposal for "Python for Beginners".
                </p>
                <p className="text-xs text-gray-500 mt-2">2 hours ago</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginView = ({ setRoute }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-brand-50 via-white to-blue-50 dark:from-dark-bg dark:via-dark-bg dark:to-slate-900">
      <div className="w-full max-w-md glass p-8 rounded-3xl shadow-xl border border-white/40 dark:border-white/10 animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-100 text-brand-600 mb-4 dark:bg-brand-900/30 dark:text-brand-400 shadow-inner">
            <Icons.Book />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Welcome Back</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to manage your workshops</p>
        </div>
        
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setRoute('dashboard'); }}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-dark-card/70 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all dark:text-white outline-none input-glow shadow-sm"
              placeholder="instructor@institute.edu"
              required
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Password</label>
              <a href="#" className="text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400">Forgot password?</a>
            </div>
            <input 
              type="password" 
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-dark-card/70 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all dark:text-white outline-none input-glow shadow-sm"
              placeholder="••••••••"
              required
            />
          </div>
          <Button variant="primary" type="submit" className="w-full py-3.5 text-lg shadow-brand-500/30 hover:shadow-brand-500/50 mt-4 font-bold border border-transparent">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};

// --- MAIN APP SHELL ---

const AppShell = () => {
  const [theme, setTheme] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );
  const [route, setRoute] = useState('login');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  if (route === 'login') {
    return <LoginView setRoute={setRoute} />;
  }

  const NavItem = ({ icon, text, id }) => (
    <button 
      onClick={() => setRoute(id)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
        route === id 
          ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400 font-bold shadow-sm' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-card/60 font-medium'
      }`}
    >
      {icon}
      <span>{text}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex bg-[#f8fafc] dark:bg-[#0f172a] transition-colors duration-300 relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 glass border-r border-gray-200/50 dark:border-gray-800/50 sticky top-0 h-screen z-20 shadow-xl shadow-gray-200/20 dark:shadow-none">
        <div className="p-6 flex items-center space-x-3 h-20">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
            <Icons.Book />
          </div>
          <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 tracking-tight">FOSSEE</span>
        </div>
        
        <div className="flex-1 px-4 space-y-2 mt-6">
          <p className="px-4 text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Main Menu</p>
          <NavItem id="dashboard" icon={<Icons.Home />} text="Dashboard" />
          <NavItem id="workshops" icon={<Icons.Book />} text="Workshops" />
          <NavItem id="profile" icon={<Icons.User />} text="My Profile" />
        </div>

        <div className="p-4 mt-auto border-t border-gray-200/50 dark:border-gray-800/50">
          <button 
            onClick={() => { showToast('Signed out successfully'); setTimeout(() => setRoute('login'), 1500) }}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 font-semibold hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <Icons.LogOut />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen w-full relative overflow-x-hidden">
        {/* Background Decorative Blur */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-400/10 dark:bg-brand-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-indigo-400/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Header */}
        <header className="h-20 glass sticky top-0 z-10 flex items-center justify-between px-6 border-b border-gray-200/50 dark:border-gray-800/50">
          <div className="flex items-center">
            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-2 focus:ring-brand-500 outline-none">
              <Icons.Menu />
            </button>
            <span className="md:hidden ml-3 font-bold text-lg text-gray-900 dark:text-white">FOSSEE</span>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-card text-gray-600 dark:text-gray-300 transition-colors focus:ring-2 focus:ring-brand-500 outline-none"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'light' ? <Icons.Moon /> : <Icons.Sun />}
            </button>
            
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-gray-700 cursor-pointer group" onClick={() => setRoute('profile')}>
              <div className="hidden md:block text-right text-sm">
                <p className="font-bold text-gray-900 dark:text-white group-hover:text-brand-600 transition-colors">Prof. Andrew</p>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-0.5">Instructor</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-300 to-indigo-400 flex items-center justify-center text-white font-bold border-2 border-white dark:border-gray-800 shadow-md transform group-hover:scale-105 transition-transform">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full relative z-0">
          {route === 'dashboard' && <DashboardView showToast={showToast} />}
          {route === 'workshops' && <WorkshopsView showToast={showToast} />}
          {route === 'profile' && <ProfileView showToast={showToast} />}
        </div>
      </main>
    </div>
  );
};

const rootNode = document.getElementById('root');
const root = ReactDOM.createRoot(rootNode);
root.render(<AppShell />);
