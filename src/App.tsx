import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import QuizIntro from './pages/quiz/QuizIntro';
import QuizQuestion from './pages/quiz/QuizQuestion';
import ResultsPage from './pages/results/ResultsPage';
import PremiumPage from './pages/premium/PremiumPage';
import SuccessPage from './pages/SuccessPage';
import SharePage from './pages/share/SharePage';
import PrivacyPage from './pages/legal/PrivacyPage';
import TermsPage from './pages/legal/TermsPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import Layout from './components/layout/Layout';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/quiz">
            <Route index element={<QuizIntro />} />
            <Route path="questions" element={<QuizQuestion />} />
          </Route>
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/share" element={<SharePage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;