import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cn from 'classnames';
import styles from './HomeAI.module.scss';
import arrow from '../../images/icons/arrow_left.svg';
import { Path } from '../../utils/constants';
import { Chat } from '../Chat';

export const HomeAI = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      setIsScrolled(scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleHomePage = () => {
    navigate(Path.Home);
  };

  return (
    <div className={styles.home}>
      <section className={styles.home__nav}>
        <div
          className={cn(styles['home__right-side'], {
            [styles['home__right-side--scrolled']]: isScrolled,
          })}
        >
          <div className={styles.home__empty}></div>
          <div
            className={cn(styles['home__footer-right'], {
              [styles['home__footer-right--scrolled']]: isScrolled,
            })}
          >
            <button className={styles['home__arrow-button']}>
              <img
                src={arrow}
                alt={arrow}
                className={styles.home__img}
                onClick={handleHomePage}
              />
            </button>
            <h3 className={styles['home__question-right']}>
              Prefer The Regular Search? No Problem, Just Click The Arrow!
            </h3>
          </div>
        </div>
        <div
          className={cn(styles['home__left-side'], {
            [styles['home__left-side--scrolled']]: isScrolled,
          })}
        >
          <div className={styles.home__content}>
            <h2 className={styles.home__title}>
              Tell Us How You’d Like to Help <br />
              And We’ll Find the Right <br />
              Opportunity
            </h2>
            <p className={styles.home__text}>
              Tell us what kind of cause you’d like to support,if you want to do
              it financially or through volunteering, where and when.
            </p>
          </div>
          <div className={styles.home__footer}>
            <Chat />
          </div>
        </div>
      </section>
    </div>
  );
};
