import { useLocation } from 'react-router-dom';
import { Path } from '../utils/constants';
import cn from 'classnames';
import styles from '../components/NavbarLeft/NavbarLeft.module.scss';

export const useActiveLinkClass = ({ isActive }: { isActive: boolean }) => {
  const { pathname } = useLocation();

  const isHome = pathname === Path.Home;
  const isHomeAI = pathname === Path.HomeAI;
  const isResponse = pathname === Path.Response;
  const isSignUp = pathname === Path.SignUp;

  return cn(
    styles.navbar__item,
    { [styles['navbar__item--active']]: isActive },
    { [styles['navbar__item--light-bg']]: isHomeAI || isSignUp },
    {
      [styles['navbar__item--light-bg--active']]:
        (isActive && isHomeAI) || (isSignUp && isActive),
    },
    { [styles['navbar__item--dark-bg']]: isHome || isResponse },
    {
      [styles['navbar__item--dark-bg--active']]:
        (isActive && isHome) || (isActive && isResponse),
    },
  );
};
