import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NetworkErrorBoundary from './components/ui/NetworkErrorBoundary';
import { LandingPage } from './pages/LandingPage';
import { DatabaseTestPage } from './pages/DatabaseTestPage';
import { QuizIntro } from './pages/quiz/QuizIntro';
import { QuizQuestion } from './pages/quiz/QuizQuestion';
import { ResultsPage } from './pages/results/ResultsPage';
import PremiumPage from './pages/premium/PremiumPage';
import { PremiumReportPage } from './pages/PremiumReportPage';
import SuccessPage from './pages/SuccessPage';
import ProtectedContentPage from './pages/ProtectedContentPage';
import { SharePage } from './pages/share/SharePage';
import ContactPage from './pages/ContactPage';
import { PrivacyPage } from './pages/legal/PrivacyPage';
import { TermsPage } from './pages/legal/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import CompatibilityPage from './pages/compatibility/CompatibilityPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <NetworkErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/database-test" element={<DatabaseTestPage />} />
          <Route path="/quiz" element={<QuizIntro />} />
          <Route path="/quiz/questions" element={<QuizQuestion />} />
          <Route path="/quiz/question/:questionIndex" element={<QuizQuestion />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/premium-report" element={<PremiumReportPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/protected-content" element={<ProtectedContentPage />} />
          <Route path="/share/:shareId?" element={<SharePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/compatibility" element={<CompatibilityPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </NetworkErrorBoundary>
  );
}

export default App;