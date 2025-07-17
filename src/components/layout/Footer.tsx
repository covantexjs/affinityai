import { Heart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const SUPPORT_EMAIL = 'support@affinityai.me';

const Footer = () => {
  const location = useLocation();
  const isQuizRoute = location.pathname.includes('/quiz/question');
  
  // Don't show footer in quiz questions to minimize distraction
  if (isQuizRoute) {
    return null;
  }
  
  return (
    <footer className="bg-gray-50 py-8 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 fill-primary-500 stroke-primary-500" />
            <span className="text-lg font-medium text-gray-800">Affinity AI</span>
          </div>
          
          <div className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Affinity AI. All rights reserved.
          </div>
          
          <div className="flex gap-6">
            <Link to="/privacy" className="text-gray-600 hover:text-primary-500 transition-colors">Privacy</Link>
            <Link to="/terms" className="text-gray-600 hover:text-primary-500 transition-colors">Terms</Link>
            <div className="flex items-center gap-1">
              <Link to="/contact" className="text-gray-600 hover:text-primary-500 transition-colors">Contact</Link>
              <span className="text-gray-400">|</span>
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-gray-600 hover:text-primary-500 transition-colors">{SUPPORT_EMAIL}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;