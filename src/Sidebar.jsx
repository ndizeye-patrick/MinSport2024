import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Flag, 
  Users, 
  UserSquare2, 
  GraduationCap,
  School2,
  School,
  Building2,
  Plane,
  FileText,
  FileSignature,
  CalendarDays,
  Users2,
  UserCog,
  Handshake,
  FileBarChart,
  Trophy,
  Settings2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

// Define roles and their accessible paths
const roleAccess = {
  admin: [
    "/dashboard",
    "/national-teams",
    "/federations",
    "/sports-professionals",
    "/trainings",
    "/isonga-programs",
    "/academies",
    "/infrastructure",
    "/sports-tourism",
    "/documents",
    "/contracts",
    "/appointments",
    "/employee",
    "/users",
    "/partners",
    "/reports",
    "/sports-for-all",
    "/settings"
  ],
  1: [
    "/dashboard",
    "/national-teams",
    "/sports-tourism",
    "/documents",
    "/appointments",
    "/sports-for-all",
    "/settings"
  ],
  guest: [
    "/dashboard",
    "/sports-tourism",
    "/settings"
  ]
};

const sidebarLinks = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard
  },
  {
    title: "National Teams",
    path: "/national-teams",
    icon: Flag,
    count: "78"
  },
  {
    title: "Federations",
    path: "/federations",
    icon: Users,
    count: "6"
  },
  {
    title: "Sports professionals",
    path: "/sports-professionals",
    icon: UserSquare2,
    count: "23"
  },
  {
    title: "Trainings",
    path: "/trainings",
    icon: GraduationCap
  },
  {
    title: "Isonga professionals",
    path: "/isonga-programs",
    icon: School2,
    count: "09"
  },
  {
    title: "Academies",
    path: "/academies",
    icon: School
  },
  {
    title: "Infrastructure",
    path: "/infrastructure",
    icon: Building2,
    count: "12"
  },
  {
    title: "Sports tourism",
    path: "/sports-tourism",
    icon: Plane
  },
  {
    title: "Documents",
    path: "/documents",
    icon: FileText,
    count: "23"
  },
  {
    title: "Contracts",
    path: "/contracts",
    icon: FileSignature
  },
  {
    title: "Appointments",
    path: "/appointments",
    icon: CalendarDays,
    count: "6"
  },
  {
    title: "Employee",
    path: "/employee",
    icon: Users2,
    count: "6"
  },
  {
    title: "Users",
    path: "/users",
    icon: UserCog
  },
  {
    title: "Partner",
    path: "/partners",
    icon: Handshake
  },
  {
    title: "Reports",
    path: "/reports",
    icon: FileBarChart
  },
  {
    title: "Sports for all",
    path: "/sports-for-all",
    icon: Trophy
  }
];

const Sidebar = () => {
  const { isDarkMode } = useDarkMode();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const [userRole, setUserRole] = useState('guest');
 
  alert(userRole);
  // Fetch user role from localStorage
  useEffect(() => {
    const storedUserRole = localStorage.getItem('userRole');
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }
  }, []);
  console.log('xx:',userRole);
  // Filter links based on user role
  const accessibleLinks = sidebarLinks.filter(link => roleAccess[userRole]?.includes(link.path));

  return (
    <aside 
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'} 
        ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'}
        border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
    >
      {/* Logo and Toggle Button */}
     
      <div className={`flex items-center justify-between h-16 px-4 ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      } border-b`}>
        {!isCollapsed && (
          <img src="https://dashboard.codeparrot.ai/api/assets/Z1Gz-0mqC8VE7xqc" alt="Logo" className="h-8" />
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 
            ${isCollapsed ? 'mx-auto' : ''}`}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4">
        {accessibleLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={`flex items-center px-4 py-2.5 text-sm transition-colors
                ${isActive 
                  ? 'bg-blue-600 text-white' 
                  : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-800'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              <Icon className={`h-5 w-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
              {!isCollapsed && (
                <div className="flex justify-between items-center w-full">
                  <span>{link.title}</span>
                  {link.count && (
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                    }`}>
                      {link.count}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>
      {/* Settings Link */}
      <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <NavLink
          to="/settings"
          className={`flex items-center px-4 py-2.5 rounded-lg ${
            isDarkMode 
              ? 'text-gray-300 hover:bg-gray-800' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Settings2 className={`h-5 w-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
          {!isCollapsed && <span>Settings</span>}
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
