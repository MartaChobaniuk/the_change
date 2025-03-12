import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import cn from 'classnames';
import styles from './Header.module.scss';
import { NavbarLeft } from '../NavbarLeft';
import { Logo } from '../Logo';
import { Path } from '../../utils/constants';
import { NavbarRight } from '../NavbarRight';
import { usePathChecker } from '../../helpers/usePathChecker';

export const Header = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { eventId } = useParams();
  const isEventPage = eventId ? pathname.includes(eventId) : false;

  const {
    isHome,
    isHomeAI,
    isLogIn,
    isAbout,
    isContact,
    isFaq,
    isExplore,
    isStories,
    isVolunteering,
    isWishes,
    isDonate,
    isProfile,
    isProfileInfo,
    isOpportunities,
    isActivity,
    isStepOne,
    isStepTwo,
    isStepThree,
    isSubmit,
  } = usePathChecker();

  const isProfileActive =
    isProfile || isProfileInfo || isActivity || isOpportunities;

  const isStepActive = isStepOne || isStepTwo || isStepThree || isSubmit;

  const isMainActive =
    isHome ||
    isFaq ||
    isExplore ||
    isVolunteering ||
    isWishes ||
    isStories ||
    isDonate ||
    isEventPage;

  useEffect(() => {
    document.body.style.overflow = openMenu ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [openMenu]);

  useEffect(() => {
    if (pathname === Path.Menu) {
      setOpenMenu(true);
    } else if (openMenu) {
      setOpenMenu(false);
    }
  }, [pathname, openMenu]);

  const handleOpenMenu = () => {
    setOpenMenu(true);
    navigate(Path.Menu);
  };

  const handleCloseMenu = () => {
    setOpenMenu(false);
    navigate(-1);
  };

  return (
    <div className={styles.header}>
      <div className={styles.header__left}>
        <Logo className={styles.header__logo} />
        <NavbarLeft className={styles['header__navbar-left']} />
      </div>

      <div className={styles['header__right-mobile']}>
        <button
          className={cn(styles.header__lang, {
            [styles['header__lang--main']]: isMainActive,
            [styles['header__lang--profile']]: isProfileActive,
            [styles['header__lang--step']]: isStepActive,
            [styles['header__lang--login']]: isLogIn,
            [styles['header__lang--homeAI']]: isHomeAI,
            [styles['header__lang--about']]: isAbout,
            [styles['header__lang--contact']]: isContact,
          })}
        >
          ENG
        </button>
        <button
          onClick={openMenu ? handleCloseMenu : handleOpenMenu}
          className={cn(styles.header__button, {
            [styles['header__button--open']]: openMenu,
            [styles['header__button--white-bg']]: isMainActive,
            [styles['header__button--profile']]: isProfileActive,
            [styles['header__button--step']]: isStepActive,
            [styles['header__button--login']]: isLogIn,
            [styles['header__button--about']]: isAbout,
            [styles['header__button--homeAI']]: isHomeAI,
            [styles['header__button--contact']]: isContact,
          })}
        ></button>
      </div>

      <div className={styles.header__right}>
        <NavbarRight />
      </div>
    </div>
  );
};
