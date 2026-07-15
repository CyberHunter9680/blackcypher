import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { RegisterModal } from './components/auth';
import LandingPage from './pages/landing/LandingPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import CoursePage from './pages/course/CoursePage';
import CertificatePage from './pages/certificate/CertificatePage';
import SubscriptionPage from './pages/subscription/SubscriptionPage';
import DoubtSupportPage from './pages/subscription/DoubtSupportPage';
import AdminPanel from './pages/admin/AdminPanel';
import TermsPage from './pages/info/TermsPage';
import PrivacyPage from './pages/info/PrivacyPage';
import DisclaimerPage from './pages/info/DisclaimerPage';
import AboutPage from './pages/info/AboutPage';
import ContactPage from './pages/info/ContactPage';
import DocumentationPage from './pages/info/DocumentationPage';
import CareersPage from './pages/info/CareersPage';
import BlogHubPage from './pages/blog/BlogHubPage';
import BlogPostPage from './pages/blog/BlogPostPage';
import CommunityPage from './pages/community/CommunityPage';
import VerifyCertificatePage from './pages/certificate/VerifyCertificatePage';



function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/course/:id" element={<CoursePage />} />
          <Route path="/certificate" element={<CertificatePage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/doubt-support" element={<DoubtSupportPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/blog" element={<BlogHubPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/verify/:id" element={<VerifyCertificatePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/docs" element={<DocumentationPage />} />
          <Route path="/careers" element={<CareersPage />} />
        </Routes>
        <RegisterModal />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

