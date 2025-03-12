import { useAuth } from 'react-oidc-context';
import styles from './LogIn.module.scss';
import { Loader } from '../Loader';

export const LogIn = () => {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <div className={styles.loading}>
        <Loader />
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className={styles.error}>
        Encountering error... {auth.error.message}
      </div>
    );
  }

  return (
    <div className={styles['log-in']}>
      <section className={styles['log-in__nav']}>
        <div className={styles['log-in__right-side']}>
          <div className={styles['log-in__empty']}></div>
          <div className={styles['log-in__footer-right']}>
            <div className={styles['log-in__contact-us']}>
              <p className={styles['log-in__subtitle']}>Contact Us</p>
              <p className={styles['log-in__part']}>
                <a
                  href="mailto:contact@thechange.ua"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles['log-in__link']}
                >
                  contact@thechange.ua
                </a>
              </p>
              <p className={styles['log-in__part']}>
                <a
                  href="tel:+380681234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles['log-in__link']}
                >
                  +38 (068) 123 4567
                </a>
              </p>
            </div>
            <div className={styles['log-in__visit-us']}>
              <p className={styles['log-in__subtitle']}>Visit Us</p>
              <p className={styles['log-in__part']}>
                <a
                  /* eslint-disable max-len */
                  href="https://www.google.com/maps/search/?api=1&query=Kniaziv+Ostrozkykh+St+8,+Kyiv,+Ukraine,+01029"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles['log-in__link']}
                >
                  Kniaziv Ostrozkykh St 8,
                  <br />
                  Kyiv, Ukraine, 01029
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className={styles['log-in__left-side']}>
          <div className={styles['log-in__collaps-line']}></div>
          <div className={styles['log-in__content']}>
            <h2 className={styles['log-in__title']}>Log In</h2>
            <p className={styles['log-in__text']}>
              Log into your profile to easily apply for volunteering events,
              join fundraisers, and fulfill wishes. Keep track of your
              volunteering journey with our account dashboard, or submit your
              own wishes, fundraisers and events via a convenient application
              form.
            </p>
          </div>
          <div className={styles['log-in__footer']}>
            <button
              className={styles['log-in__button']}
              onClick={() => auth.signinRedirect()}
            >
              Log In
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
