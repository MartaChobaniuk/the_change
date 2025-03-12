/* eslint-disable no-console */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface User {
  name: string;
  email: string;
  phone: string;
  profileImage: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  error: string | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        setError('Authorization token is missing.');
        setLoading(false);

        return;
      }

      try {
        const response = await fetch(
          'https://dewvdtfd5m.execute-api.eu-north-1.amazonaws.com/dev/account',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const storedProfileImage =
          localStorage.getItem('profileImage') || data.profileImage;

        const userData = {
          name: data.name,
          email: data.email,
          phone: data.phone,
          profileImage: storedProfileImage,
        };

        setUser(userData);
        setError(null);
      } catch (errorMes) {
        setError('Failed to load profile. Please try again later.');
        console.error('Error loading profile:', errorMes);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      error,
      loading,
    }),
    [user, setUser, error, loading],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};
