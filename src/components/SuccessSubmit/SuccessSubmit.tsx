import { NavLink } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import cn from 'classnames';
import styles from './SuccessSubmit.module.scss';
import { Path } from '../../utils/constants';
import arrow from '../../images/icons/arrow_back.svg';

export const SuccessSubmit = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className={styles.submit}>
      <div className={styles.submit__nav}>
        <div className={styles['submit__right-side']}>
          <div
            className={styles['submit__bllock-top']}
            onClick={e => {
              e.preventDefault();
              navigate(Path.Opportunities);
            }}
          >
            <img src={arrow} alt="arrow" className={styles.submit__img} />
            <p className={styles.submit__back}>Go Back</p>
          </div>
          <div className={styles['submit__bllock-bottom']}>
            <h1 className={styles.submit__title}>New Opportunity</h1>
            <h3 className={styles.submit__subtitle}>Opportunity Submitted</h3>
          </div>
        </div>
        <div className={styles['submit__left-side']}>
          <p className={styles.submit__content}>
            Your opportunity has been successfully submitted and is now awaiting
            review by our team. Once approved, it will appear on the platform
            for others to explore and join.
            <br />
            If you have any additional questions or updates, feel free to reach
            out through our contact page. Thank you for contributing to making a
            difference!
          </p>

          <div className={styles.submit__buttons}>
            <NavLink
              to={Path.ProfileInfo}
              className={({ isActive }: { isActive: boolean }) =>
                cn(styles.submit__button, {
                  [styles['submit__button--active']]:
                    isActive && pathname === Path.ProfileInfo,
                })
              }
            >
              Profile
            </NavLink>
            <NavLink
              to={Path.Activity}
              className={({ isActive }: { isActive: boolean }) =>
                cn(styles.submit__button, {
                  [styles['submit__button--active']]:
                    isActive && pathname === Path.Activity,
                })
              }
            >
              Activity
            </NavLink>
            <NavLink
              to={Path.Opportunities}
              className={({ isActive }: { isActive: boolean }) =>
                cn(styles.submit__button, {
                  [styles['submit__button--active']]:
                    isActive && pathname === Path.Opportunities,
                })
              }
            >
              Opportunities
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};
