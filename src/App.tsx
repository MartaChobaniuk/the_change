import React, { useEffect, useState } from 'react';
import './App.scss';
import cn from 'classnames';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { Header } from './components/Header';
import { usePathChecker } from './helpers/usePathChecker';

export const App: React.FC = () => {
  const { pathname } = useLocation();
  const { eventId } = useParams();
  const isEventPage = eventId ? pathname.includes(eventId) : false;
  const [isScrolled, setIsScrolled] = useState(false);

  const {
    isExplore,
    isAbout,
    isFaq,
    isHome,
    isVolunteering,
    isWishes,
    isDonate,
    isOpportunities,
  } = usePathChecker();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 120);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="app">
      <div className="app__container">
        {isEventPage && isScrolled && <div className="app__overlay" />}
        <header
          className={cn('app__header', {
            'app__header--explore': isExplore,
            'app__header--volunt': isVolunteering,
            'app__header--wishes': isWishes,
            'app__header--donate': isDonate,
            'app__header--about': isAbout,
            'app__header--faq': isFaq,
            'app__header--home': isHome,
            'app__header--opport': isOpportunities,
            'app__header--event': isEventPage,
          })}
        >
          <Header />
        </header>
        <main className="app__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
