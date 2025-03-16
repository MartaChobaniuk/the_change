/* eslint-disable no-console */
import { useEffect, useRef, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import styles from './ProfileInfo.module.scss';
import { Path } from '../../utils/constants';
import cn from 'classnames';
import default_user from '../../images/icons/profile-default.svg';
interface ProfileData {
  name: string;
  email: string;
  phone: string;
  profileImage: string | null;
}

export const ProfileInfo = () => {
  const { pathname } = useLocation();
  const auth = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    profileImage: default_user,
  });
  const [originalProfileData, setOriginalProfileData] =
    useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');

    if (code) {
      window.history.replaceState({}, '', window.location.pathname);
      navigate(Path.ProfileInfo, { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const handleScroll = () => {
      if (bottomRef.current) {
        setIsScrolled(bottomRef.current.scrollTop > 50);
      }
    };

    const bottomDiv = bottomRef.current;

    bottomDiv?.addEventListener('scroll', handleScroll);

    return () => bottomDiv?.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!auth.isAuthenticated || !auth.user) {
      return;
    }

    const accessToken =
      localStorage.getItem('accessToken') || auth.user?.access_token;

    if (!accessToken) {
      setErrorMessage('Authorization token is missing');

      throw new Error('Authorization token is missing');
    }

    const updateProfile = async () => {
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

        setProfileData(prev => ({
          ...prev,
          name: data.name,
          email: data.email,
          phone: data.phone,
          profileImage: storedProfileImage,
        }));

        localStorage.setItem('email', data.email);
        localStorage.setItem('name', data.name);
      } catch (error) {
        console.error('Error loading profile:', error);
        setErrorMessage('Failed to load profile. Please try again later.');
      }
    };

    updateProfile();
  }, [auth.isAuthenticated, auth.user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setProfileData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProfileImageChange = (newImageUrl: string) => {
    setProfileData(prev => ({ ...prev, profileImage: newImageUrl }));
    localStorage.setItem('profileImage', newImageUrl);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setErrorMessage('Please select a file to upload!');

      return;
    }

    setErrorMessage(null);

    const validTypes = [
      'image/png',
      'image/jpeg',
      'image/svg+xml',
      'image/webp',
    ];
    const maxSize = 2 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      setErrorMessage(
        'Only PNG, JPG, SVG, or WebP image formats are supported!',
      );

      return;
    }

    if (file.size > maxSize) {
      setErrorMessage('File size should not exceed 2MB!');

      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const newImageUrl = reader.result;

      if (typeof newImageUrl === 'string') {
        handleProfileImageChange(newImageUrl);
      } else {
        console.error('FileReader result is not a string:', newImageUrl);
        setErrorMessage('Error loading image. Please try again.');
      }
    };

    reader.readAsDataURL(file);
  };

  const handleEditClick = () => {
    if (isEditing) {
      if (originalProfileData) {
        setProfileData(originalProfileData);
      }

      setErrorMessage(null);
    } else {
      setOriginalProfileData(profileData);
    }

    setIsEditing(prev => !prev);
  };

  const handleSaveClick = async () => {
    if (!profileData.name || !profileData.phone) {
      setErrorMessage('Name and phone are required!');

      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage(null);
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        console.warn('No access token found');
        setErrorMessage('Authorization failed. Please log in again.');
        setIsSaving(false);

        return;
      }

      const userInfo = {
        name: profileData.name,
        phone: profileData.phone,
      };

      const response = await fetch(
        'https://dewvdtfd5m.execute-api.eu-north-1.amazonaws.com/dev/account',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(userInfo),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      console.log('Profile updated:', data);

      const storedProfileImage = localStorage.getItem('profileImage');

      setProfileData(prev => ({
        ...prev,
        profileImage: storedProfileImage,
      }));

      setIsEditing(false);
    } catch (error) {
      setErrorMessage('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.info}>
      <div className={styles.info__nav}>
        <div
          className={cn(styles.info__top, {
            [styles['info__top--scrolled']]: isScrolled,
          })}
        >
          <p
            className={cn(styles.info__greeting, {
              [styles['info__greeting--scrolled']]: isScrolled,
            })}
          >
            Hello, {profileData.name}!
          </p>
          <h1
            className={cn(styles.info__title, {
              [styles['info__title--scrolled']]: isScrolled,
            })}
          >
            All You Need, In One Place
          </h1>
          <div className={styles.info__buttons}>
            <NavLink
              to={Path.ProfileInfo}
              className={({ isActive }: { isActive: boolean }) =>
                cn(styles.info__button, {
                  [styles['info__button--active']]:
                    isActive && pathname === Path.ProfileInfo,
                })
              }
            >
              Profile Information
            </NavLink>
            <NavLink
              to={Path.Activity}
              className={({ isActive }: { isActive: boolean }) =>
                cn(styles.info__button, {
                  [styles['info__button--active']]:
                    isActive && pathname === Path.Activity,
                })
              }
            >
              My Activity
            </NavLink>
            <NavLink
              to={Path.Opportunities}
              className={({ isActive }: { isActive: boolean }) =>
                cn(styles.info__button, {
                  [styles['info__button--active']]:
                    isActive && pathname === Path.Opportunities,
                })
              }
            >
              My Opportunities
            </NavLink>
          </div>
        </div>

        <div
          ref={bottomRef}
          className={cn(styles.info__bottom, {
            [styles['info__bottom--scrolled']]: isScrolled,
          })}
        >
          <div className={styles.info__block}>
            <h2 className={styles.info__subtitle}>Profile Information</h2>
            <div className={styles['info__buttons-bottom']}>
              <button
                type="button"
                className={styles['info__button-edit']}
                onClick={handleEditClick}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
              {isEditing && (
                <button
                  type="button"
                  className={styles['info__button-edit']}
                  onClick={handleSaveClick}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              )}
            </div>
          </div>
          {errorMessage && <p className={styles.info__error}>{errorMessage}</p>}
          <div className={styles.info__details}>
            <div className={styles['info__photo-container']}>
              {isEditing ? (
                <>
                  <input
                    ref={fileInputRef}
                    className={styles['info__photo--upload']}
                    type="file"
                    id="profileImage"
                    accept=".jpg,.jpeg,.png,.svg"
                    onChange={handleFileChange}
                    title="Click for change photo"
                    hidden
                  />
                  <label
                    htmlFor="profileImage"
                    className={`${styles['custom-file-label']} ${!profileData.profileImage ? styles['no-file-selected'] : ''}`}
                  >
                    {profileData.profileImage ? (
                      <img
                        src={profileData.profileImage}
                        alt="profile"
                        className={styles.info__photo}
                      />
                    ) : (
                      'Choose a photo for your profile'
                    )}
                  </label>
                </>
              ) : (
                <img
                  src={profileData.profileImage || default_user}
                  alt="profile"
                  className={styles.info__photo}
                />
              )}
            </div>
            <div className={styles.info__inputs}>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className={styles.info__input}
                />
              ) : (
                <p className={styles.info__input}>
                  {profileData.name || 'Name'}
                </p>
              )}
              <div className={styles.info__line}></div>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className={styles.info__input}
                />
              ) : (
                <p className={styles.info__input}>
                  {profileData.email || 'Email'}
                </p>
              )}
              <div className={styles.info__line}></div>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  className={styles.info__input}
                />
              ) : (
                <p className={styles.info__input}>
                  {profileData.phone || 'Phone Number'}
                </p>
              )}
              <div className={styles.info__line}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
