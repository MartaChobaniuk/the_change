import { useLocation } from 'react-router-dom';
import { Path } from '../utils/constants';
import { Home } from '../components/Home';
import { HomeAI } from '../components/HomeAI';

export const HomePage = () => {
  const { pathname } = useLocation();

  return (
    <div>
      {pathname === Path.HomeAI ? (
        <div>
          <HomeAI />
        </div>
      ) : (
        <div>
          <Home />
        </div>
      )}
    </div>
  );
};
