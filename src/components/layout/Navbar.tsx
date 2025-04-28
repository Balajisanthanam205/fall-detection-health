import { NavLink, useNavigate } from 'react-router-dom';
import { Heart, Moon, Sun, LogOut, Bell, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useState } from 'react';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { emergencies } = useData();
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const activeEmergencies = emergencies.filter(e => e.status === 'active');
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <nav className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center">
              <Heart className="h-8 w-8 text-primary-500" />
              <span className="ml-2 text-xl font-semibold text-slate-800 dark:text-white">MediGuard</span>
            </NavLink>
            
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive 
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                  }`
                }
                end
              >
                Home
              </NavLink>
              <NavLink 
                to="/vitals" 
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive 
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                  }`
                }
              >
                Vitals Dashboard
              </NavLink>
              {user?.role === 'admin' || user?.role === 'hospital' ? (
                <NavLink 
                  to="/hospital" 
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive 
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
                        : 'text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`
                  }
                >
                  Hospital Dashboard
                </NavLink>
              ) : null}
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-full text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-white relative"
              >
                <Bell className="h-5 w-5" />
                {activeEmergencies.length > 0 && (
                  <span className="absolute top-1 right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-500"></span>
                  </span>
                )}
              </button>
              
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-slate-700">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-slate-700">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-white">Notifications</h3>
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto">
                    {activeEmergencies.length > 0 ? (
                      activeEmergencies.map(emergency => (
                        <button
                          key={emergency.id}
                          onClick={() => {
                            navigate(`/emergency/${emergency.patientId}`);
                            setNotificationsOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-slate-700 border-b border-gray-100 dark:border-slate-700"
                        >
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-accent-500 mr-2"></div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Emergency: {emergency.type === 'fall' ? 'Fall Detected' : `Abnormal ${emergency.type}`}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(emergency.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        No active emergencies
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={toggleTheme}
              className="ml-4 p-2 rounded-full text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-white"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            
            <div className="ml-4 relative">
              <div className="flex items-center">
                <div className="p-2 bg-secondary-100 dark:bg-secondary-900 rounded-full">
                  <User className="h-5 w-5 text-secondary-600 dark:text-secondary-300" />
                </div>
                <span className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:block">
                  {user?.name}
                </span>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="ml-4 p-2 rounded-full text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-white"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;