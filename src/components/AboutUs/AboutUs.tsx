import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import cn from 'classnames';
import styles from './AboutUs.module.scss';
import { Path } from '../../utils/constants';

export const AboutUs = () => {
  const { pathname } = useLocation();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isFixed, setIsFixed] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      setIsScrolled(scrollY > 50);
      setIsFixed(scrollY > 170);
    };

    const handleFixed = () => {
      if (contentRef.current) {
        const isAtBottom =
          contentRef.current.scrollHeight - contentRef.current.scrollTop <=
          contentRef.current.clientHeight + 1;

        setIsScrolled(contentRef.current.scrollTop > 0);
        setIsFixed(isAtBottom);
      }
    };

    const currentContentRef = contentRef.current;

    currentContentRef?.addEventListener('scroll', handleFixed);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      currentContentRef?.removeEventListener('scroll', handleFixed);
    };
  }, []);

  return (
    <div className={styles.about}>
      <section className={styles.about__nav}>
        <div
          className={cn(styles['about__left-side'], {
            [styles['about__left-side--scrolled']]: isScrolled,
          })}
        >
          <div ref={contentRef} className={styles['about__content-left']}>
            <h1 className={styles.about__title}>
              At The Change, We Believe In Action Over Words.
            </h1>
            <p className={styles.about__text}>
              Our platform connects people from all walks of life with
              meaningful opportunities to make a difference in Ukraine. Whether
              you’re fulfilling heartfelt wishes, donating to crucial
              fundraisers, or volunteering your time and skills, The Change
              makes it easy to find and contribute to causes that resonate with
              you.
              <br />
              <br />
              With a user-friendly catalog and advanced search tools - including
              filters and AI-driven recommendations - you can quickly discover
              the perfect way to support those in need. Our platform also offers
              online options for those unable to be on the ground in Ukraine,
              ensuring everyone, whether at home or abroad, can contribute.
              <br />
              <br />
              The name The Change reflects both our mission and our mindset: we
              inspire proactive help rather than passive hope. By facilitating
              direct impact, we aim to empower Ukrainians and benefactors
              worldwide to shape a better future - one act of generosity at a
              time.
            </p>
            <div className={styles['about__collaps-line']}></div>
          </div>
          <div className={styles['about__footer-left']}>
            <h3 className={styles['about__question-left']}>
              What Would You Like To Know?
            </h3>
            <div className={styles.about__buttons}>
              <Link
                to={Path.About}
                className={cn(styles.about__button, {
                  [styles['about__button--active']]: pathname === Path.About,
                })}
              >
                <span>About Us</span>
              </Link>
              <Link
                to={Path.Faq}
                className={cn(styles.about__button, {
                  [styles['about__button--active']]: pathname === Path.Faq,
                })}
              >
                <span>FAQ</span>
              </Link>
            </div>
          </div>
        </div>
        <div
          className={cn(styles['about__right-side'], {
            [styles['about__right-side--scrolled']]: isScrolled,
          })}
        >
          <div className={styles['about__right-content']}>
            <h3 className={styles['about__question-left']}>
              What Would You Like To Know?
            </h3>
            <div
              className={cn(styles.about__buttons, {
                [styles['about__buttons--scrolled']]: isScrolled,
                [styles['about__buttons--fixed']]: isFixed,
              })}
            >
              <Link
                to={Path.About}
                className={cn(styles.about__button, {
                  [styles['about__button--active']]: pathname === Path.About,
                })}
              >
                <span>About Us</span>
              </Link>
              <Link
                to={Path.Faq}
                className={cn(styles.about__button, {
                  [styles['about__button--active']]: pathname === Path.Faq,
                })}
              >
                <span>FAQ</span>
              </Link>
            </div>
          </div>
          <div className={styles.about__empty}></div>
          <div className={styles['about__footer-right']}>
            <div className={styles['about__contact-us']}>
              <p className={styles.about__subtitle}>Contact Us</p>
              <p className={styles.about__part}>
                <a
                  href="mailto:contact@thechange.ua"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.about__link}
                >
                  contact@thechange.ua
                </a>
              </p>
              <p className={styles.about__part}>
                <a
                  href="tel:+380681234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.about__link}
                >
                  +38 (068) 123 4567
                </a>
              </p>
            </div>
            <div className={styles['about__visit-us']}>
              <p className={styles.about__subtitle}>Visit Us</p>
              <p className={styles.about__part}>
                <a
                  /* eslint-disable max-len */
                  href="https://www.google.com/maps/search/?api=1&query=Kniaziv+Ostrozkykh+St+8,+Kyiv,+Ukraine,+01029"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.about__link}
                >
                  Kniaziv Ostrozkykh St 8,
                  <br />
                  Kyiv, Ukraine, 01029
                </a>
              </p>
            </div>
          </div>
          <div className={styles['about__tablet-footer-right']}>
            <div className={styles['about__contact-us']}>
              <p className={styles.about__subtitle}>Contact Us</p>
              <p className={styles.about__part}>
                <a
                  href="mailto:contact@thechange.ua"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.about__link}
                >
                  contact@thechange.ua
                </a>
              </p>
              <p className={styles.about__part}>
                <a
                  href="tel:+380681234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.about__link}
                >
                  +38 (068) 123 4567
                </a>
              </p>
            </div>
            <div className={styles['about__visit-us']}>
              <p className={styles.about__subtitle}>Visit Us</p>
              <p className={styles.about__part}>
                <a
                  /* eslint-disable max-len */
                  href="https://www.google.com/maps/search/?api=1&query=Kniaziv+Ostrozkykh+St+8,+Kyiv,+Ukraine,+01029"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.about__link}
                >
                  Kniaziv Ostrozkykh St 8,
                  <br />
                  Kyiv, Ukraine, 01029
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className={styles['about__tablet-left-side']}>
          <div className={styles['about__tablet-content-left']}>
            <h1 className={styles['about__tablet-title']}>
              At The Change, We Believe In Action Over Words.
            </h1>
            <p className={styles['about__tablet-text']}>
              Our platform connects people from all walks of life with
              meaningful opportunities to make a difference in Ukraine. Whether
              you’re fulfilling heartfelt wishes, donating to crucial
              fundraisers, or volunteering your time and skills, The Change
              makes it easy to find and contribute to causes that resonate with
              you.
              <br />
              <br />
              With a user-friendly catalog and advanced search tools - including
              filters and AI-driven recommendations - you can quickly discover
              the perfect way to support those in need. Our platform also offers
              online options for those unable to be on the ground in Ukraine,
              ensuring everyone, whether at home or abroad, can contribute.
              <br />
              <br />
              The name The Change reflects both our mission and our mindset: we
              inspire proactive help rather than passive hope. By facilitating
              direct impact, we aim to empower Ukrainians and benefactors
              worldwide to shape a better future - one act of generosity at a
              time.
            </p>
          </div>
          <div className={styles['about__tablet-footer-left']}>
            <h3 className={styles['about__tablet-question-left']}>
              What Would You Like To Know?
            </h3>
            <div className={styles.about__buttons}>
              <Link
                to={Path.About}
                className={cn(styles.about__button, {
                  [styles['about__button--active']]: pathname === Path.About,
                })}
              >
                <span>About Us</span>
              </Link>
              <Link
                to={Path.Faq}
                className={cn(styles.about__button, {
                  [styles['about__button--active']]: pathname === Path.Faq,
                })}
              >
                <span>FAQ</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
