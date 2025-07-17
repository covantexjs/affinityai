import { Link, useLocation } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';

const Header = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const isQuizRoute = location.pathname.includes('/quiz/question');
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Don't show header in quiz questions to minimize distraction
  if (isQuizRoute) {
    return null;
  }

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-primary-500 font-semibold">
          <Heart className="h-6 w-6 fill-primary-500 stroke-primary-500" />
          <span className="text-xl">Affinity AI</span>
        </Link>
        
        <div className="flex gap-4">
          {location.pathname === '/' ? (
            <Link 
              to="/quiz" 
              className="px-5 py-2 rounded-full bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors"
            >
              Take the Quiz
            </Link>
          ) : (
            <div className="flex gap-3">
              <Link 
                to="/protected-content" 
                className="px-4 py-2 rounded-full bg-secondary-500 text-white font-medium hover:bg-secondary-600 transition-colors text-sm"
              >
                Premium
              </Link>
              <Link 
                to="/" 
                className="px-5 py-2 rounded-full bg-white text-primary-500 border border-primary-500 font-medium hover:bg-primary-50 transition-colors"
              >
                Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;