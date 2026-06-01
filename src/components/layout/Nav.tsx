import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/speaking', label: 'Speaking' },
  { to: '/Gems', label: 'Gems' },
  { to: '/masterclasses', label: 'Masterclasses' },
  { to: '/shop', label: 'Shop' },
  { to: '/contact', label: 'Contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-ink/85 backdrop-blur-md' : 'bg-transparent'
        }`}
    >
      <nav className="container-x flex h-20 items-center justify-between">
        <Link to="/" aria-label="Tiaera Paulette, LMSW — home" className="group flex items-center">
          <img
            src="/images/brand/tp24_logo_no_background.svg"
            alt="Tiaera Paulette, LMSW"
            width={56}
            height={56}
            className="h-12 w-12 transition-transform duration-500 group-hover:rotate-3 md:h-14 md:w-14"
          />
          <span className="font-serif text-lg tracking-tight text-flame align-bottom ml-2 mt-6">
            Tiaera <span className="text-bone">Paulette</span><span className="text-xs font-normal text-flame align-bottom">24</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm tracking-wide transition-colors ${isActive ? 'text-paper' : 'text-bone hover:text-paper'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <NavLabel link={l} variant="desktop" isActive={isActive} />
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-3 -bottom-0.5 h-px bg-flame"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Link to="/speaking" className="btn-primary">
            Book Tiaera
          </Link>
        </div>

        <button
          aria-label="Menu"
          className="rounded-full border border-bone/20 p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="md:hidden"
          >
            <div className="container-x pb-6">
              <ul className="flex flex-col gap-1 rounded-2xl border border-bone/10 bg-ink-soft/80 p-3 backdrop-blur">
                {links.map((l) => (
                  <li key={l.to}>
                    <NavLink
                      to={l.to}
                      className={({ isActive }) =>
                        `block rounded-xl px-4 py-3 text-sm ${isActive ? 'bg-flame text-paper' : 'text-bone hover:text-paper'
                        }`
                      }
                    >
                      {({ isActive }) => <NavLabel link={l} variant="mobile" isActive={isActive} />}
                    </NavLink>
                  </li>
                ))}
                <li className="pt-1">
                  <Link to="/speaking" className="btn-primary w-full justify-center">
                    Book Tiaera
                  </Link>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/**
 * Renders a nav link's visible text. Most links inherit the parent's
 * bone/paper color cycle; `/Gems` gets Fraunces-italic in flame so it reads
 * as distinct without borrowing from the active-state vocabulary (which is
 * flame underline on desktop, flame pill on mobile). The one inversion: on
 * mobile when Gems is the active page, the text flips to paper so it stays
 * legible against the flame pill background.
 */
function NavLabel({
  link,
  variant,
  isActive,
}: {
  link: { to: string; label: string };
  variant: 'desktop' | 'mobile';
  isActive: boolean;
}) {
  if (link.to === '/Gems') {
    const textColor = variant === 'mobile' && isActive ? 'text-paper' : 'text-flame';
    return <span className={`font-serif italic ${textColor}`}>{link.label}</span>;
  }
  return <>{link.label}</>;
}
