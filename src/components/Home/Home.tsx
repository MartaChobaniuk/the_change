/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import styles from './Home.module.scss';
import arrow from '../../images/icons/arrow_r.svg';
import { NavLink, useNavigate } from 'react-router-dom';
import { Path } from '../../utils/constants';
import { useSwipeable } from 'react-swipeable';
import { useAuth } from 'react-oidc-context';

export const Home: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');

    if (code) {
      window.history.replaceState({}, '', window.location.pathname);
      navigate('/', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      const accessToken = auth.user.access_token;

      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      }
    }
  }, [auth.isAuthenticated, auth.user]);

  const handlers = useSwipeable({
    onSwipedUp: () => {
      setIsScrolled(true);
    },
    onSwipedDown: () => {
      setIsScrolled(false);
    },
    trackTouch: true,
  });

  const handleHomeAI = () => {
    navigate(Path.HomeAI);
  };

  const handleClick = () => {
    setIsScrolled(true);
  };

  return (
    <div className={styles.home}>
      <section className={styles.home__nav}>
        <div className={styles['home__left-side']}>
          <div className={styles['home__content-left']}>
            <h1 className={styles.home__title}>
              Take Action Today. Be The Change You Want To See In The World.
            </h1>
            <p className={styles.home__text}>
              Use our search filters to explore opportunities to fulfill wishes,
              donate to fundraisers, and volunteer in ways that align with your
              passions.Every small step contributes to making the world a better
              place.
            </p>
          </div>
          <div className={styles['home__footer-left']}>
            <h3 className={styles['home__question-left']}>
              How Do You Want To Contribute Today?
            </h3>
            <div className={styles.home__buttons}>
              <NavLink to={Path.Donate} className={styles.home__button}>
                <span>Donate</span>
              </NavLink>
              <NavLink to={Path.Volunteering} className={styles.home__button}>
                <span>Volunteer</span>
              </NavLink>
              <NavLink to={Path.Explore} className={styles.home__button}>
                <span>Explore All</span>
              </NavLink>
            </div>
          </div>
        </div>
        <div className={styles['home__right-side']}>
          <div className={styles['home__content-right']}></div>
          <div className={styles['home__footer-right']}>
            <h3 className={styles['home__question-right']}>
              Tell Us How You’d Like to Help
              <br />
              And We’ll Find the Right Opportunity
            </h3>
            <button
              className={styles['home__arrow-button']}
              onClick={handleHomeAI}
            >
              <img src={arrow} alt={arrow} className={styles.home__img} />
            </button>
          </div>
        </div>

        <div
          {...handlers}
          className={cn(styles['home__left-mobile'], {
            [styles['home__left-mobile--scrolled']]: isScrolled,
          })}
        >
          <div className={styles['home__collaps-line']}></div>
          <div
            className={cn(styles['home__mobile-content-left'], {
              [styles['home__mobile-content-left--scrolled']]: isScrolled,
            })}
          >
            <h1
              className={cn(styles['home__mobile-title'], {
                [styles['home__mobile-title--scrolled']]: isScrolled,
              })}
            >
              Take Action Today. Be The Change You Want To See In The World.
            </h1>
            <p
              className={cn(styles['home__mobile-text'], {
                [styles['home__mobile-text--scrolled']]: isScrolled,
              })}
            >
              Use our search filters to explore opportunities to fulfill wishes,
              donate to fundraisers, and volunteer in ways that align with your
              passions.Every small step contributes to making the world a better
              place.
            </p>
          </div>
        </div>
        <div
          className={cn(styles['home__right-mobile'], {
            [styles['home__right-mobile--scrolled']]: isScrolled,
          })}
        >
          <div
            className={cn(styles['home__mobile-content-right'], {
              [styles['home__mobile-content-right--scrolled']]: isScrolled,
            })}
          >
            <h3 className={styles['home__mobile-question-left']}>
              How Do You Want To Contribute Today?
            </h3>
            <div className={styles['home__mobile-buttons']}>
              <NavLink
                to={Path.Donate}
                className={styles['home__mobile-button']}
              >
                <span>Donate</span>
              </NavLink>
              <NavLink
                to={Path.Volunteering}
                className={styles['home__mobile-button']}
              >
                <span>Volunteer</span>
              </NavLink>
              <NavLink
                to={Path.Explore}
                className={styles['home__mobile-button']}
              >
                <span>Explore All</span>
              </NavLink>
            </div>
          </div>
          <div
            className={cn(styles['home__mobile-footer-right'], {
              [styles['home__mobile-footer-right--scrolled']]: isScrolled,
            })}
          >
            {!isScrolled && (
              <h3
                className={styles['home__mobile-question-left']}
                onClick={handleClick}
              >
                How Do You Want To Contribute Today?
              </h3>
            )}
            {isScrolled && (
              <>
                <h3 className={styles['home__mobile-question-right']}>
                  Tell Us How You’d Like to Help
                  <br />
                  And We’ll Find the Right Opportunity
                </h3>
                <button
                  className={styles['home__mobile-arrow-button']}
                  onClick={handleHomeAI}
                >
                  <img src={arrow} alt={arrow} className={styles.home__img} />
                </button>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
