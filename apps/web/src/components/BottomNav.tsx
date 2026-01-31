import { useLocation, useNavigate } from 'react-router-dom';

const tabs = [
  { path: '/', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1' },
  { path: '/scan', label: 'Scan', icon: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z' },
  { path: '/history', label: 'History', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-around border-t border-gray-100 bg-white px-2 py-2 pb-safe">
      {tabs.map(tab => {
        const active = location.pathname === tab.path;
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-colors ${active ? 'text-black' : 'text-gray-400'}`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
            </svg>
            <span className="text-[10px] font-semibold">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
