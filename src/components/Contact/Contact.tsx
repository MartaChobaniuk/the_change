import { useEffect, useState } from 'react';
import styles from './Contact.module.scss';
import cn from 'classnames';
import { sendContactWish } from '../../services/events';

export const Contact = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [cover, setCover] = useState<string>('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  const showForm = () => {
    setIsFormVisible(true);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCover(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await sendContactWish({ cover, email, description });
      setSuccessMessage('Your message has been sent successfully!');
      setCover('');
      setEmail('');
      setDescription('');

      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setErrorMessage('Failed to send your message. Please try again later.');

      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.contact}>
      <section className={styles.contact__nav}>
        <div
          className={cn(styles['contact__right-side'], {
            [styles['contact__right-side--scrolled']]: isScrolled,
          })}
        >
          <div className={styles.contact__empty}></div>
          <div
            className={cn(styles['contact__footer-right'], {
              [styles['contact__footer-right--visible']]: isFormVisible,
              [styles['contact__footer-right--scrolled']]: isScrolled,
            })}
          >
            <div className={styles['contact__contact-us']}>
              <p className={styles.contact__subtitle}>Contact Us</p>
              <p className={styles.contact__part}>
                <a
                  href="mailto:contact@thechange.ua"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contact__link}
                >
                  contact@thechange.ua
                </a>
              </p>
              <p className={styles.contact__part}>
                <a
                  href="tel:+380681234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contact__link}
                >
                  +38 (068) 123 4567
                </a>
              </p>
            </div>

            <div className={styles['contact__visit-us']}>
              <p className={styles.contact__subtitle}>Visit Us</p>
              <p className={styles.contact__part}>
                <a
                  /* eslint-disable max-len */
                  href="https://www.google.com/maps/search/?api=1&query=Kniaziv+Ostrozkykh+St+8,+Kyiv,+Ukraine,+01029"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contact__link}
                >
                  Kniaziv Ostrozkykh St 8,
                  <br />
                  Kyiv, Ukraine, 01029
                </a>
              </p>
            </div>
          </div>
        </div>
        <div
          className={cn(styles['contact__left-side'], {
            [styles['contact__left-side--scrolled']]: isScrolled,
          })}
        >
          <div className={styles['contact__collaps-line']}></div>
          <div className={styles.contact__content}>
            <h2
              className={cn(styles.contact__title, {
                [styles['contact__title--visible']]: isFormVisible,
              })}
            >
              Want To Submit A Wish, Organizing A Fundraiser Or A Volunteering
              Event? Maybe, You Want To Partner With Us?
            </h2>
            <p
              className={cn(styles.contact__text, {
                [styles['contact__text--visible']]: isFormVisible,
              })}
            >
              Tell us about yourself and your submission, leave an email
              address, and we’ll contact you within 3 business days.
            </p>
          </div>
          <div className={styles.contact__footer}>
            <button
              className={cn(styles['contact__button-send'], {
                [styles['contact__button-send--visible']]: isFormVisible,
              })}
              onClick={showForm}
            >
              <span>Send a message</span>
            </button>
            <form
              onSubmit={handleSubmit}
              className={cn(styles.contact__form, {
                [styles['contact__form--visible']]: isFormVisible,
              })}
            >
              {errorMessage && (
                <p className={styles.contact__error}>{errorMessage}</p>
              )}
              {successMessage && (
                <p className={styles.contact__success}>{successMessage}</p>
              )}
              <div className={styles['contact__input-shell']}>
                <input
                  type="text"
                  className={styles.contact__input}
                  placeholder="Your title"
                  value={cover}
                  onChange={handleCoverChange}
                />
                <div className={styles.contact__line}></div>
                <input
                  type="email"
                  className={styles.contact__input}
                  placeholder="Email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
                <div className={styles.contact__line}></div>
                <textarea
                  value={description}
                  onChange={handleDescChange}
                  className={styles.contact__input}
                  placeholder="Tell about your submission"
                  maxLength={600}
                  rows={3}
                />
                <div className={styles.contact__line}></div>
              </div>
              <div className={styles['contact__button-shell']}>
                <button
                  className={styles.contact__button}
                  type="submit"
                  disabled={isSubmitting}
                >
                  <span>{isSubmitting ? 'Sending...' : 'Send'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
