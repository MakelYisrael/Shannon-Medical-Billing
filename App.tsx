import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import logo from 'figma:asset/f02eaf66269c640a4b2a2407a909bd5c8e10bac6.png';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import BookingPage from './pages/BookingPage';
import BlogPage from './pages/BlogPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import PoliciesPage from './pages/PoliciesPage';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogoClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="text-blue-600" onClick={handleLogoClick}>
                <img src={logo} alt="Shannon Marie" className="h-8" />
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex space-x-8">
                <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
                <Link to="/about" className="text-gray-700 hover:text-blue-600">About</Link>
                <Link to="/courses" className="text-gray-700 hover:text-blue-600">Courses</Link>
                <Link to="/booking" className="text-gray-700 hover:text-blue-600">Book a Session</Link>
                <Link to="/blog" className="text-gray-700 hover:text-blue-600">Blog</Link>
                <Link to="/faq" className="text-gray-700 hover:text-blue-600">FAQ</Link>
                <Link to="/contact" className="text-gray-700 hover:text-blue-600">Contact</Link>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2"
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
              </div>
            )}
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/course/:courseId" element={<CourseDetailsPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/policies" element={<PoliciesPage />} />
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
    </Router>
  );
}