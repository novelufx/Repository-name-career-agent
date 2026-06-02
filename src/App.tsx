import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import JDAnalysis from './pages/JDAnalysis';
import ResumeDiagnosis from './pages/ResumeDiagnosis';
import ProjectOptimizer from './pages/ProjectOptimizer';
import MockInterview from './pages/MockInterview';
import FeedbackReport from './pages/FeedbackReport';
import Settings from './pages/Settings';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="workflow">
              <Route path="jd-analysis" element={<JDAnalysis />} />
              <Route path="resume-diagnosis" element={<ResumeDiagnosis />} />
              <Route path="project-optimization" element={<ProjectOptimizer />} />
              <Route path="mock-interview" element={<MockInterview />} />
              <Route path="feedback-report" element={<FeedbackReport />} />
            </Route>
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
