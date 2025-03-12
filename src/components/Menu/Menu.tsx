import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import cn from 'classnames';
import styles from './Menu.module.scss';
import { Path } from '../../utils/constants';
import user from '../../images/icons/account_black.svg';
import logout from '../../images/icons/logout.svg';

export const Menu = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { path: Path.Home, label: 'Home', end: true },
    { path: Path.Stories, label: 'Success Stories' },
    { path: Path.About, label: 'About Us' },
    { path: Path.Contact, label: 'Contact' },
  ];

  const getActiveLink = ({ isActive }: { isActive: boolean }) =>
    cn(styles.menu__item, { [styles['menu__item--active']]: isActive });

  const handleLogout = async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('name');
    localStorage.removeItem('phone');
    localStorage.removeItem('email');
    localStorage.removeItem('profileImage');
    localStorage.clear();

    await auth.removeUser();

    navigate(Path.Home);
  };

  return (
    <section className={styles.menu}>
      <div className={styles.menu__left}>
        {navLinks.map(({ path, label, end }) => (
          <NavLink key={path} to={path} end={end} className={getActiveLink}>
            <span className={styles.menu__name}>{label}</span>
          </NavLink>
        ))}
      </div>
      <div className={styles.menu__right}>
        {auth.isAuthenticated ? (
          <div className={styles.menu__buttons}>
            <NavLink
              to={Path.ProfileInfo}
              className={({ isActive }: { isActive: boolean }) =>
                cn(styles.menu__sign, {
                  [styles['menu__sign--active']]: isActive,
                })
              }
            >
              <img src={user} alt="user" className={styles.menu__img} />
              <span className={styles['menu__name--sign']}>Profile</span>
            </NavLink>
            <button className={styles.menu__sign} onClick={handleLogout}>
              <img src={logout} alt="user" className={styles.menu__out} />
              <span className={styles['menu__name--sign']}>Logout</span>
            </button>
          </div>
        ) : (
          <NavLink
            className={({ isActive }: { isActive: boolean }) =>
              cn(styles.menu__sign, {
                [styles['menu__sign--active']]: isActive,
              })
            }
            to={Path.LogIn}
          >
            <img src={user} alt="user" className={styles.menu__img} />
            <span className={styles['menu__name--sign']}>Log In</span>
          </NavLink>
        )}
      </div>
    </section>
  );
};
