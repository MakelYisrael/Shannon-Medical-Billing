import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminProtectedRoute } from './components/AdminProtectedRoute';
import UserMenu from './components/UserMenu';
import { isUserAdmin } from './utils/adminAuth';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import CoursePortal from './pages/CoursePortal';
import CourseHub from './pages/CourseHub';
import BookingPage from './pages/BookingPage';
import BlogPage from './pages/BlogPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import PoliciesPage from './pages/PoliciesPage';
import EnrollmentSuccessPage from './pages/EnrollmentSuccessPage';
import EnrollmentCancelledPage from './pages/EnrollmentCancelledPage';
import AdminDashboard from './pages/AdminDashboard';
import RefundCancellationPage from './pages/RefundCancellationPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import PortalCoursePage from './pages/PortalCoursePage';

function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, userProfile, signOut, loading } = useAuth();
  const [hasEnrollments, setHasEnrollments] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const checkEnrollments = async () => {
      if (!user?.email) {
        if (isMounted) setHasEnrollments(false);
        return;
      }

      try {
        const response = await fetch('/api/enrollments', { signal: controller.signal });
        if (response.ok && isMounted) {
          const enrollments = await response.json();
          const userEnrollments = enrollments.filter((e: any) => e.email === user.email);
          setHasEnrollments(userEnrollments.length > 0);
        }
      } catch (error) {
        // Ignore abort errors - expected during navigation/unmount
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        if (isMounted) {
          console.error('Failed to check enrollments:', error);
          setHasEnrollments(false);
        }
      }
    };

    checkEnrollments();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [user?.email]);

  const handleLogoClick = () => {
    window.scrollTo(0, 0);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center" onClick={handleLogoClick}>
            <img src="https://cdn.builder.io/api/v1/image/assets%2F0dd09a0ea4a74aae89da898b741a9d32%2Fe73407e5189e49dcb65d9d03d1691dbb?format=webp&width=800" alt="Shannon Marie" className="h-12" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600">About</Link>
            <Link to="/courses" className="text-gray-700 hover:text-blue-600">Courses</Link>
            <Link to="/booking" className="text-gray-700 hover:text-blue-600">Book a Session</Link>
            <Link to="/blog" className="text-gray-700 hover:text-blue-600">Blog</Link>
            <Link to="/faq" className="text-gray-700 hover:text-blue-600">FAQ</Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600">Contact</Link>

            {/* Auth buttons */}
            <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
              {!loading && !user ? (
                <>
                  <Link to="/signin" className="text-gray-700 hover:text-blue-600 font-medium">
                    Sign In
                  </Link>
                  <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Sign Up
                  </Link>
                </>
              ) : (
                <UserMenu
                  userName={userProfile?.firstName ? `${userProfile.firstName} ${userProfile.lastName || ''}`.trim() : user?.email || 'User'}
                  userInitial={(userProfile?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U').toUpperCase()}
                  onSignOut={handleSignOut}
                  isAdmin={isUserAdmin()}
                  hasEnrollments={hasEnrollments}
                />
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            title={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link to="/" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/about" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link to="/courses" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>Courses</Link>
            <Link to="/booking" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>Book a Session</Link>
            <Link to="/blog" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
            <Link to="/faq" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
            <Link to="/contact" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>Contact</Link>

            <div className="border-t border-gray-200 pt-2 mt-2">
              {!loading && !user ? (
                <>
                  <Link to="/signin" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                  <Link to="/signup" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                </>
              ) : (
                <div className="py-2">
                  <UserMenu
                    userName={userProfile?.firstName ? `${userProfile.firstName} ${userProfile.lastName || ''}`.trim() : user?.email || 'User'}
                    userInitial={(userProfile?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U').toUpperCase()}
                    onSignOut={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    isAdmin={isUserAdmin()}
                    hasEnrollments={hasEnrollments}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function AppContent() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/portal"
          element={
            <ProtectedRoute>
              <CoursePortal />
            </ProtectedRoute>
          }
        />
        <Route path="/course/:courseId" element={<CourseDetailsPage />} />
        <Route path="/course/:courseId/hub" element={<CourseHub />} />
        <Route path="/portal/course/:slug" element={<PortalCoursePage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/policies" element={<PoliciesPage />} />
        <Route path="/enrollment-success" element={<EnrollmentSuccessPage />} />
        <Route path="/enrollment-cancelled" element={<EnrollmentCancelledPage />} />
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route path="/refunds" element={<RefundCancellationPage />} />
      </Routes>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="mb-4">Shannon Marie</h3>
              <p className="text-gray-400">Medical Billing Consultant & Educator</p>
            </div>
            <div>
              <h4 className="mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/about" className="block text-gray-400 hover:text-white">About</Link>
                <Link to="/courses" className="block text-gray-400 hover:text-white">Courses</Link>
                <Link to="/booking" className="block text-gray-400 hover:text-white">Book a Session</Link>
                <Link to="/blog" className="block text-gray-400 hover:text-white">Blog</Link>
              </div>
            </div>
            <div>
              <h4 className="mb-4">Support</h4>
              <div className="space-y-2">
                <Link to="/faq" className="block text-gray-400 hover:text-white">FAQ</Link>
                <Link to="/contact" className="block text-gray-400 hover:text-white">Contact</Link>
                <Link to="/policies" className="block text-gray-400 hover:text-white">Policies</Link>
              </div>
            </div>
            <div>
              <h4 className="mb-4">Stay Connected</h4>
              <p className="text-gray-400 mb-4">Get billing tips straight to your inbox</p>
              <Link to="/contact" className="text-blue-400 hover:text-blue-300">Subscribe →</Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Shannon Marie Consulting. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
