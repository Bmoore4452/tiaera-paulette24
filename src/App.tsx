import { Routes, Route, useLocation } from 'react-router-dom';
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
import CourseHome from './pages/course/CourseHome';
import WeekDetail from './pages/course/WeekDetail';
import TopicPage from './pages/course/TopicPage';
import ActivityPage from './pages/course/ActivityPage';
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
              <Route path="/course" element={<CourseHome />} />
              <Route path="/course/:weekId" element={<WeekDetail />} />
              <Route path="/course/:weekId/topic/:topicId" element={<TopicPage />} />
              <Route path="/course/:weekId/activity/:activityId" element={<ActivityPage />} />
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
