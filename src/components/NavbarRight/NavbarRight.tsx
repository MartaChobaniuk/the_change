/* eslint-disable prettier/prettier */
import React from 'react';
import cn from 'classnames';
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import styles from './NavbarRight.module.scss';
import { Path } from '../../utils/constants';
import user_white from '../../images/icons/account_white.svg';
import user_black from '../../images/icons/account_black.svg';
import { usePathChecker } from '../../helpers/usePathChecker';
import { useAuth } from 'react-oidc-context';
import { deleteImgFromIndexedDB } from '../../helpers/deleteImageFromIndexedDB';

type Props = {
  className?: string;
};

export const NavbarRight: React.FC<Props> = ({ className }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { eventId } = useParams();
  const isEventPage = eventId ? pathname.includes(eventId) : false;
  const auth = useAuth();

  const {
    isHome,
    isHomeAI,
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

  const isProfileActive =
    isProfile || isProfileInfo || isActivity || isOpportunities;

  const isStepActive = isStepOne || isStepTwo || isStepThree || isSubmit;

  const isOtherPathActive = isHome ||
    isHomeAI ||
    isLogIn ||
    isAbout ||
    isFaq ||
    isContact ||
    isExplore ||
    isVolunteering ||
    isWishes ||
    isStories ||
    isDonate ||
    isEventPage;

  const getClassName = ({ isActive }: { isActive: boolean }) =>
    cn(isProfileActive ? styles.navbar__profile : styles.navbar__step, {
      [styles['navbar__profile--active']]: isActive && isProfileActive,
      [styles['navbar__step--active']]: isActive && isStepActive,
    });

  const iconSrc = isProfileActive ? user_white : user_black;
  const iconClass = isProfileActive
    ? styles.navbar__img
    : styles['navbar__img--dark'];

  const getActiveLink = ({ isActive }: { isActive: boolean }) =>
    cn(
      styles.navbar__item,
      { [styles['navbar__item--active']]: isActive },
      {
        [styles['navbar__item--white-bg']]:
          isHomeAI ||
          isContact ||
          isLogIn ||
          isExplore ||
          isVolunteering ||
          isWishes ||
          isDonate ||
          isStories ||
          isFaq ||
          isEventPage,
      },
      { [styles['navbar__item--dark-bg']]: isHome || isAbout },
      { [styles['navbar__item--login--active']]: isLogIn && isActive },
      className,
    );

  const handleLogout = async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('name');
    localStorage.removeItem('phone');
    localStorage.removeItem('email');
    localStorage.removeItem('profileImage');
    localStorage.clear();

    await deleteImgFromIndexedDB('profileImage');

    await auth.removeUser();

    navigate(Path.Home);
  };

  return (
    <section className={styles.navbar}>
      <div className={styles.navbar__left}></div>

      <div className={styles.navbar__right}>
        <button
          className={cn(styles.navbar__lang, {
            [styles['navbar__lang--transparent-bg']]:
              isHomeAI ||
              isLogIn ||
              isFaq ||
              isContact ||
              isExplore ||
              isVolunteering ||
              isWishes ||
              isDonate ||
              isStories ||
              isEventPage ||
              isStepOne ||
              isStepTwo ||
              isStepThree ||
              isSubmit,
            [styles['navbar__lang--dark-bg']]:
              isHome ||
              isAbout ||
              isProfile ||
              isProfileInfo ||
              isActivity ||
              isOpportunities,
          })}
        >
          <span className={styles['navbar__lang-name']}>ENG</span>
        </button>

        {auth.isAuthenticated && isOtherPathActive && (
          <NavLink to={Path.ProfileInfo} className={getClassName}>
            <img src={iconSrc} alt="user" className={iconClass} />
            <span className={styles.navbar__name}>Profile</span>
          </NavLink>
        )}

        {!auth.isAuthenticated && isOtherPathActive && (
          <NavLink to={Path.LogIn} className={getActiveLink}>
            <img
              src={isHome || isAbout ? user_white : user_black}
              alt="user"
              className={cn(styles.navbar__img, {
                [styles['navbar__img--dark']]:
                  isHomeAI ||
                  isLogIn ||
                  isContact ||
                  isExplore ||
                  isVolunteering ||
                  isWishes ||
                  isDonate ||
                  isStories ||
                  isEventPage ||
                  isFaq,
              })}
            />
            <span className={styles.navbar__name}>Log In</span>
          </NavLink>
        )}

        {(auth.isAuthenticated && isStepActive) && (
          <button
            className={
              isProfileActive ? styles.navbar__profile : styles.navbar__step
            }
            onClick={handleLogout}
          >
            Logout
          </button>
        )}

        {(auth.isAuthenticated && isProfileActive) && (
          <button
            className={
              isProfileActive ? styles.navbar__profile : styles.navbar__step
            }
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>
    </section>
  );
};
