import React from 'react';
import cn from 'classnames';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import styles from './NavbarLeft.module.scss';
import { Path } from '../../utils/constants';
import { usePathChecker } from '../../helpers/usePathChecker';

type Props = {
  className?: string;
};

export const NavbarLeft: React.FC<Props> = ({ className }) => {
  const { pathname } = useLocation();
  const { eventId } = useParams();
  const isEventPage = eventId ? pathname.includes(eventId) : false;

  const {
    isHome,
    isHomeAI,
    isSignUp,
    isLogIn,
    isAbout,
    isFaq,
    isContact,
    isExplore,
    isVolunteering,
    isWishes,
    isDonate,
    isProfile,
    isProfileInfo,
    isActivity,
    isOpportunities,
    isStories,
    isStepOne,
    isStepTwo,
    isStepThree,
    isSubmit,
  } = usePathChecker();

  const navLinks = [
    { path: Path.Stories, label: 'Success Stories' },
    { path: Path.About, label: 'About Us' },
    { path: Path.Contact, label: 'Contact' },
  ];

  const getActiveLink = ({ isActive }: { isActive: boolean }) =>
    cn(
      styles.navbar__item,
      { [styles['navbar__item--home']]: isHome },
      { [styles['navbar__item--home--active']]: isHome && isActive },
      { [styles['navbar__item--homeAi']]: isHomeAI },
      { [styles['navbar__item--homeAi--active']]: isHomeAI && isActive },
      { [styles['navbar__item--sign']]: isSignUp },
      { [styles['navbar__item--login']]: isLogIn },
      { [styles['navbar__item--about']]: isAbout || isFaq },
      {
        [styles['navbar__item--about--active']]: (isAbout || isFaq) && isActive,
      },
      { [styles['navbar__item--faq']]: isFaq },
      { [styles['navbar__item--contact']]: isContact },
      { [styles['navbar__item--contact--active']]: isContact && isActive },
      { [styles['navbar__item--stories']]: isStories },
      { [styles['navbar__item--stories--active']]: isStories && isActive },
      { [styles['navbar__item--explore']]: isExplore },
      { [styles['navbar__item--volunt']]: isVolunteering },
      { [styles['navbar__item--wishes']]: isWishes },
      { [styles['navbar__item--donate']]: isDonate },
      { [styles['navbar__item--event']]: isEventPage },
      {
        [styles['navbar__item--profile']]:
          isProfile ||
          isProfileInfo ||
          isActivity ||
          isOpportunities ||
          isStepOne ||
          isStepTwo ||
          isStepThree ||
          isSubmit,
      },
      className,
    );

  return (
    <section className={styles.navbar}>
      <div className={styles.navbar__left}>
        {pathname === Path.HomeAI ? (
          <NavLink to={Path.HomeAI} className={getActiveLink}>
            <span className={styles.navbar__name}>HomeAI</span>
          </NavLink>
        ) : (
          <NavLink to={Path.Home} className={getActiveLink}>
            <span className={styles.navbar__name}>Home</span>
          </NavLink>
        )}
        {navLinks.map(({ path, label }) => (
          <NavLink key={path} to={path} className={getActiveLink}>
            <span className={styles.navbar__name}>{label}</span>
          </NavLink>
        ))}
      </div>

      <div className={styles.navbar__right}></div>
    </section>
  );
};
