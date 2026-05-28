import { Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Nav from './components/layout/Nav';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Speaking from './pages/Speaking';
import Masterclasses from './pages/Masterclasses';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import CheckoutSuccess from './pages/CheckoutSuccess';
import CheckoutCancel from './pages/CheckoutCancel';
import NotFound from './pages/NotFound';
import CoursesIndex from './pages/course/CoursesIndex';
import CoursePage from './pages/course/CoursePage';
import WeekDetail from './pages/course/WeekDetail';
import TopicPage from './pages/course/TopicPage';
import TeachingPointPage from './pages/course/TeachingPointPage';
import ActivityPage from './pages/course/ActivityPage';
import DiscussionPage from './pages/course/DiscussionPage';
import JournalPage from './pages/course/JournalPage';
import { CourseProgressProvider } from './components/course/CourseProgress';

export default function App() {
  const location = useLocation();

  return (
    <CourseProgressProvider>
      <div className="flex min-h-screen flex-col bg-ink text-paper">
        <Nav />
        <main className="flex-1">
          <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/speaking" element={<Speaking />} />
              <Route path="/masterclasses" element={<Masterclasses />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/contact" element={<Contact />} />

              <Route path="/courses" element={<CoursesIndex />} />
              <Route path="/courses/:courseId" element={<CoursePage />} />
              <Route path="/courses/:courseId/:weekId" element={<WeekDetail />} />
              <Route path="/courses/:courseId/:weekId/topic/:topicId" element={<TopicPage />} />
              <Route path="/courses/:courseId/:weekId/teaching/:teachingId" element={<TeachingPointPage />} />
              <Route path="/courses/:courseId/:weekId/activity/:activityId" element={<ActivityPage />} />
              <Route path="/courses/:courseId/:weekId/discussion/:discussionId" element={<DiscussionPage />} />
              <Route path="/courses/:courseId/:weekId/journal/:journalId" element={<JournalPage />} />

              {/* Back-compat for the original Time Mastery preview link. */}
              <Route path="/course" element={<Navigate to="/courses/time-mastery" replace />} />
              <Route path="/course/:weekId" element={<RedirectLegacyWeek />} />
              <Route path="/course/:weekId/topic/:topicId" element={<RedirectLegacyTopic />} />
              <Route path="/course/:weekId/activity/:activityId" element={<RedirectLegacyActivity />} />

              <Route path="/checkout/success" element={<CheckoutSuccess />} />
              <Route path="/checkout/cancel" element={<CheckoutCancel />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </CourseProgressProvider>
  );
}

/** Tiny redirect shims for old /course/* deep links shared before the multi-course refactor. */
function RedirectLegacyWeek() {
  const { weekId } = useParams();
  return <Navigate to={`/courses/time-mastery/${weekId}`} replace />;
}
function RedirectLegacyTopic() {
  const { weekId, topicId } = useParams();
  return <Navigate to={`/courses/time-mastery/${weekId}/topic/${topicId}`} replace />;
}
function RedirectLegacyActivity() {
  const { weekId, activityId } = useParams();
  return <Navigate to={`/courses/time-mastery/${weekId}/activity/${activityId}`} replace />;
}
