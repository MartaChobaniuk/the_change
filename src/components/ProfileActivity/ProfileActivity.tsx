import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import cn from 'classnames';
import styles from './ProfileActivity.module.scss';
import { Path } from '../../utils/constants';
import search from '../../images/icons/search.svg';
import arrow_up from '../../images/icons/arrow_up_white (2).svg';
import arrow_down from '../../images/icons/arrow_down_white.svg';

export const ProfileActivity = () => {
  const { pathname } = useLocation();
  const [query, setQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState(
    localStorage.getItem('name') || 'user',
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setUserName(localStorage.getItem('name') || 'user');
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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

  const toggleOpen = (index: number) => {
    setOpenDropdown(prev => (prev === index ? null : index));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className={styles.activity}>
      <div className={styles.activity__nav}>
        <div
          className={cn(styles.activity__top, {
            [styles['activity__top--scrolled']]: isScrolled,
          })}
        >
          <p
            className={cn(styles.activity__greeting, {
              [styles['activity__greeting--scrolled']]: isScrolled,
            })}
          >
            Hello, {userName}!
          </p>
          <h1
            className={cn(styles.activity__title, {
              [styles['activity__title--scrolled']]: isScrolled,
            })}
          >
            All You Need, In One Place
          </h1>
          <div className={styles.activity__buttons}>
            <NavLink
              to={Path.ProfileInfo}
              className={({ isActive }: { isActive: boolean }) =>
                cn(styles.activity__button, {
                  [styles['activity__button--active']]:
                    isActive && pathname === Path.ProfileInfo,
                })
              }
            >
              Profile Information
            </NavLink>
            <NavLink
              to={Path.Activity}
              className={({ isActive }: { isActive: boolean }) =>
                cn(styles.activity__button, {
                  [styles['activity__button--active']]:
                    isActive && pathname === Path.Activity,
                })
              }
            >
              My Activity
            </NavLink>
            <NavLink
              to={Path.Opportunities}
              className={({ isActive }: { isActive: boolean }) =>
                cn(styles.activity__button, {
                  [styles['activity__button--active']]:
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
          className={cn(styles.activity__bottom, {
            [styles['activity__bottom--scrolled']]: isScrolled,
          })}
        >
          <div className={styles.activity__block}>
            <h2 className={styles.activity__subtitle}>Upcoming Events</h2>
            <div className={styles.activity__content}>
              <div className={styles.activity__grid}>
                <div className={styles.activity__header}>
                  <span className={styles['activity__detail-name']}>Name</span>
                  <span className={styles['activity__detail-name']}>
                    Date & Time
                  </span>
                  <span className={styles['activity__detail-name']}>
                    Location
                  </span>
                  <span className={styles['activity__detail-name']}>
                    Requirements
                  </span>
                  <span className={styles['activity__detail-name']}>
                    Contact Organizer
                  </span>
                  <span className={styles['activity__detail-name']}>
                    Cancel Participation
                  </span>
                </div>
                <div className={styles['activity__line-grid']}></div>
                <div className={styles.activity__row}>
                  <span className={styles['activity__detail-value']}>
                    Soup Kitchen
                  </span>
                  <span className={styles['activity__detail-value']}>
                    20.02.2025, 12 a.m. - 3 p.m.
                  </span>
                  <span className={styles['activity__detail-value']}>
                    Kyiv, Ilyinskaya, 8
                  </span>
                  <span className={styles['activity__detail-value']}>
                    Nothing
                  </span>
                  <button className={styles['activity__button-contact']}>
                    Contact
                  </button>
                  <button className={styles['activity__button-cancel']}>
                    Cancel
                  </button>
                </div>
                <div className={styles.activity__row}>
                  <span className={styles['activity__detail-value']}>
                    Soup Kitchen
                  </span>
                  <span className={styles['activity__detail-value']}>
                    22.02.2025, 11 a.m. - 2 p.m.
                  </span>
                  <span className={styles['activity__detail-value']}>
                    Kharkiv, Nezalezhnosti, 34
                  </span>
                  <span className={styles['activity__detail-value']}>
                    Nothing
                  </span>
                  <button className={styles['activity__button-contact']}>
                    Contact
                  </button>
                  <button className={styles['activity__button-cancel']}>
                    Cancel
                  </button>
                </div>
              </div>
              <div className={styles.activity__dropdown}>
                <button
                  className={styles['activity__dropdown-button']}
                  onClick={e => {
                    e.preventDefault();
                    toggleOpen(1);
                  }}
                >
                  <span className={styles.activity__select}>Soup Kitchen</span>
                </button>
                <div className={styles['activity__dropdown-img-container']}>
                  <img
                    className={styles['activity__dropdown-img']}
                    src={openDropdown === 1 ? arrow_up : arrow_down}
                    alt="Arrow Down"
                  />
                </div>
              </div>
              <div className={styles.activity__line}></div>
              {openDropdown === 1 && (
                <>
                  <div className={styles.activity__info}>
                    <div>
                      <span className={styles['activity__detail-name']}>
                        Date & Time:
                      </span>
                      <span className={styles['activity__detail-value']}>
                        20.02.2025, 12 a.m. - 3 p.m.
                      </span>
                    </div>
                    <div>
                      <span className={styles['activity__detail-name']}>
                        Location:
                      </span>
                      <span className={styles['activity__detail-value']}>
                        Kyiv, Ilyinskaya, 8
                      </span>
                    </div>
                    <div>
                      <span className={styles['activity__detail-name']}>
                        Requirements:
                      </span>
                      <span className={styles['activity__detail-value']}>
                        Nothing
                      </span>
                    </div>
                    <div className={styles['activity__buttons-event']}>
                      <button className={styles['activity__button-contact']}>
                        Contact
                      </button>
                      <button className={styles['activity__button-cancel']}>
                        Cancel
                      </button>
                    </div>
                  </div>
                </>
              )}
              <div className={styles.activity__dropdown}>
                <button
                  className={styles['activity__dropdown-button']}
                  onClick={e => {
                    e.preventDefault();
                    toggleOpen(2);
                  }}
                >
                  <span className={styles.activity__select}>Soup Kitchen</span>
                </button>
                <div className={styles['activity__dropdown-img-container']}>
                  <img
                    className={styles['activity__dropdown-img']}
                    src={openDropdown === 2 ? arrow_up : arrow_down}
                    alt="Arrow Down"
                  />
                </div>
              </div>
              <div className={styles.activity__line}></div>
              {openDropdown === 2 && (
                <>
                  <div className={styles.activity__info}>
                    <div>
                      <span className={styles['activity__detail-name']}>
                        Date & Time:
                      </span>
                      <span className={styles['activity__detail-value']}>
                        22.02.2025, 11 a.m. - 2 p.m.
                      </span>
                    </div>
                    <div>
                      <span className={styles['activity__detail-name']}>
                        Location:
                      </span>
                      <span className={styles['activity__detail-value']}>
                        Kharkiv, Nezalezhnosti, 34
                      </span>
                    </div>
                    <div>
                      <span className={styles['activity__detail-name']}>
                        Requirements:
                      </span>
                      <span className={styles['activity__detail-value']}>
                        Nothing
                      </span>
                    </div>
                    <div className={styles['activity__buttons-event']}>
                      <button className={styles['activity__button-contact']}>
                        Contact
                      </button>
                      <button className={styles['activity__button-cancel']}>
                        Cancel
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className={styles.activity__block}>
            <h2 className={styles.activity__subtitle}>Past Opportunities</h2>
            <div className={styles['activity__search-block']}>
              <div className={styles['activity__block-input']}>
                <img
                  src={search}
                  alt="Search"
                  className={styles['activity__search-img']}
                />
                <input
                  type="text"
                  placeholder="Search opportunities"
                  value={query}
                  onChange={handleSearchChange}
                  className={styles.activity__input}
                />
                <div className={styles['activity__line-search']}></div>
              </div>
              <div className={styles['activity__buttons-search']}>
                <button className={styles['activity__button-search']}>
                  <span>Search</span>
                </button>
                <button className={styles['activity__button-search']}>
                  <span>Filters</span>
                </button>
              </div>
            </div>
            <div className={styles.activity__content}>
              <div className={styles.activity__grid}>
                <div className={styles.activity__header}>
                  <span>Name</span>
                  <span>Organizer</span>
                  <span>Date & Time</span>
                  <span>Location</span>
                  <span>Assistance Type</span>
                  <span>Leave Feedback</span>
                </div>
                <div className={styles['activity__line-grid']}></div>
                <div className={styles.activity__row}>
                  <span>English For Veterans</span>
                  <span>Ivan Fedorov</span>
                  <span>28.12.2025, 4 p.m. - 6 p.m.</span>
                  <span>Online</span>
                  <span>Volunteering</span>
                  <button className={styles['activity__button-detail']}>
                    Leave a Feedback
                  </button>
                </div>
              </div>
              <div className={styles.activity__dropdown}>
                <button
                  className={styles['activity__dropdown-button']}
                  onClick={e => {
                    e.preventDefault();
                    toggleOpen(3);
                  }}
                >
                  <span className={styles.activity__select}>
                    English For Veterans
                  </span>
                </button>
                <div className={styles['activity__dropdown-img-container']}>
                  <img
                    className={styles['activity__dropdown-img']}
                    src={openDropdown === 3 ? arrow_up : arrow_down}
                    alt="Arrow Down"
                  />
                </div>
              </div>
              <div className={styles.activity__line}></div>
              {openDropdown === 3 && (
                <>
                  <div className={styles.activity__info}>
                    <div>
                      <span className={styles['activity__detail-name']}>
                        Organizer:
                      </span>
                      <span className={styles['activity__detail-value']}>
                        Ivan Fedorov
                      </span>
                    </div>
                    <div>
                      <span className={styles['activity__detail-name']}>
                        Date & Time:
                      </span>
                      <span className={styles['activity__detail-value']}>
                        28.12.2025, 4 p.m. - 6 p.m.
                      </span>
                    </div>
                    <div>
                      <span className={styles['activity__detail-name']}>
                        Location:
                      </span>
                      <span className={styles['activity__detail-value']}>
                        Online
                      </span>
                    </div>
                    <div>
                      <span className={styles['activity__detail-name']}>
                        Assistance Type:
                      </span>
                      <span className={styles['activity__detail-value']}>
                        Volunteering
                      </span>
                    </div>
                    <button className={styles['activity__button-detail']}>
                      Leave a Feedback
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
