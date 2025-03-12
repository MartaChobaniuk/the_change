import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './Profile.module.scss';
import { Path } from '../../utils/constants';
import cn from 'classnames';
import { useAuth } from 'react-oidc-context';

export const Profile = () => {
  const { pathname } = useLocation();
  const auth = useAuth();
  const { profile } = auth.user || {};
  const [isScrolled, setIsScrolled] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (bottomRef.current) {
        setIsScrolled(bottomRef.current.scrollTop > 50);
      }
    };

    const bottomDiv = bottomRef.current;

    bottomDiv?.addEventListener('scroll', handleScroll);

    return () => bottomDiv?.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.profile}>
      <div className={styles.profile__nav}>
        <div
          className={cn(styles.profile__top, {
            [styles['profile__top--scrolled']]: isScrolled,
          })}
        >
          <p
            className={cn(styles.profile__greeting, {
              [styles['profile__greeting--scrolled']]: isScrolled,
            })}
          >
            Hello, {profile?.name}
          </p>
          <h1
            className={cn(styles.profile__title, {
              [styles['profile__title--scrolled']]: isScrolled,
            })}
          >
            All You Need, In One Place
          </h1>
          <div className={styles.profile__buttons}>
            <NavLink
              to={Path.ProfileInfo}
              className={({ isActive }: { isActive: boolean }) =>
                cn(styles.profile__button, {
                  [styles['profile__button--active']]:
                    isActive && pathname === Path.ProfileInfo,
                })
              }
            >
              Profile Information
            </NavLink>
            <NavLink
              to={Path.Activity}
              className={({ isActive }: { isActive: boolean }) =>
                cn(styles.profile__button, {
                  [styles['profile__button--active']]:
                    isActive && pathname === Path.Activity,
                })
              }
            >
              My Activity
            </NavLink>
            <NavLink
              to={Path.Opportunities}
              className={({ isActive }: { isActive: boolean }) =>
                cn(styles.profile__button, {
                  [styles['profile__button--active']]:
                    isActive && pathname === Path.Opportunities,
                })
              }
            >
              My Opportunities
            </NavLink>
          </div>
        </div>

        <div ref={bottomRef} className={styles.profile__bottom}></div>
      </div>
    </div>
  );
};
