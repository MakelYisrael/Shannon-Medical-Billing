import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, BookOpen, Settings, Shield } from 'lucide-react';
import { isUserAdmin } from '../utils/adminAuth';

interface UserMenuProps {
  userName?: string;
  userInitial?: string;
  onSignOut?: () => void;
  isAdmin?: boolean;
  hasEnrollments?: boolean;
}

export default function UserMenu({ userName = 'User', userInitial = 'U', onSignOut, isAdmin: adminProp = false, hasEnrollments = false }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Check if user is admin
  useEffect(() => {
    setIsAdminUser(adminProp || isUserAdmin());
  }, [isOpen, adminProp]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        title="User Menu"
      >
        <div className="relative w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
          {userInitial}
        </div>
        <ChevronDown className="h-4 w-4 text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm text-gray-600">Signed in as</p>
            <p className="font-semibold text-gray-900 truncate">{userName}</p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {(isAdminUser || hasEnrollments) && (
              <Link
                to="/portal"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                <span>Course Portal</span>
              </Link>
            )}

            {isAdminUser && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
              >
                <Shield className="h-4 w-4" />
                <span>Admin Dashboard</span>
              </Link>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100"></div>

          {/* Profile Settings */}
          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>Profile Settings</span>
          </Link>

          {/* Sign Out */}
          {onSignOut && (
            <button
              onClick={() => {
                setIsOpen(false);
                onSignOut();
              }}
              className="w-full text-left flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors border-t border-gray-100"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
