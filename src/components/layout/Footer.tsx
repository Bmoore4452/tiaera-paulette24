import { Link } from 'react-router-dom';
import { Instagram, Mail, Mic } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-bone/10 bg-ink">
      <div className="container-x grid gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="eyebrow">Stay encouraged</p>
          <h3 className="mt-4 max-w-md text-4xl text-balance md:text-5xl">
            Your 24 is a gift. <span className="text-flame">Don't waste it.</span>
          </h3>
          <p className="mt-6 max-w-md text-bone">
            Therapy, teaching, and truth-telling from Tiaera Paulette, LMSW. Join the
            list for new masterclasses, podcast drops, and upcoming events.
          </p>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.22em] text-bone">Explore</h4>
          <ul className="mt-5 space-y-3 text-sm">
            <li><Link to="/about" className="hover:text-flame">About</Link></li>
            <li><Link to="/speaking" className="hover:text-flame">Book speaking</Link></li>
            <li><Link to="/masterclasses" className="hover:text-flame">Masterclasses</Link></li>
            <li><Link to="/shop" className="hover:text-flame">Shop</Link></li>
            <li><Link to="/contact" className="hover:text-flame">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.22em] text-bone">Connect</h4>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <a
                href="mailto:tiaerapaulette24@gmail.com"
                className="inline-flex items-center gap-2 hover:text-flame"
              >
                <Mail size={14} /> tiaerapaulette24@gmail.com
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-flame"
              >
                <Instagram size={14} /> Instagram
              </a>
            </li>
            <li>
              <a href="#" className="inline-flex items-center gap-2 hover:text-flame">
                <Mic size={14} /> Uncensored Wellness Podcast
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-bone/10">
        <div className="container-x flex flex-col items-start justify-between gap-2 py-6 text-xs text-bone md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Tiaera Paulette, LMSW. All rights reserved.</p>
          <p className="font-serif italic">Don&apos;t let one moment own all 24.</p>
        </div>
      </div>
    </footer>
  );
}
