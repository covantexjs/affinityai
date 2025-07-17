import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Layout from '../components/layout/Layout';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

const NotFoundPage = () => {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-center"
        >
          <div className="mb-8">
            <h1 className="text-8xl md:text-9xl font-bold text-primary-500 mb-4 leading-none">
              404
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mb-6"></div>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Oops! Page Not Found
          </h2>
          
          <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
            The page you're looking for seems to have wandered off. 
            Let's get you back on track to discover your romantic archetype.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg">
                Return Home
              </Button>
            </Link>
            
            <Link to="/quiz">
              <Button variant="outline" size="lg">
                Take the Quiz
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 text-sm text-gray-500">
            <p>Lost? Here are some popular pages:</p>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              <Link to="/results" className="text-primary-500 hover:text-primary-600">
                View Results
              </Link>
              <Link to="/premium" className="text-primary-500 hover:text-primary-600">
                Premium Report
              </Link>
              <Link to="/contact" className="text-primary-500 hover:text-primary-600">
                Contact Us
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export { NotFoundPage };
export default NotFoundPage;