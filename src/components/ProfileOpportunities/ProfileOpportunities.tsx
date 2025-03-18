/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import cn from 'classnames';
import styles from './ProfileOpportunities.module.scss';
import { Path } from '../../utils/constants';
import search from '../../images/icons/search.svg';
import arrow_up from '../../images/icons/arrow_up_white (2).svg';
import arrow_down from '../../images/icons/arrow_down_white.svg';
import { Loader } from '../Loader';
import { NewOpportunityType } from '../../types/NewOpportunityType';
import { Link } from 'react-router-dom';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { SubmittedOpportunityType } from '../../types/SubmittedOpportunityType';

export const ProfileOpportunities = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState(
    localStorage.getItem('name') || 'user',
  );
  // eslint-disable-next-line max-len, prettier/prettier
  const [postedOpportunities, setPostedOpportunities] = useState<NewOpportunityType[]>([]);
  // eslint-disable-next-line max-len, prettier/prettier
  const [submittedOpportunities, setSubmittedOpportunities] = useState<SubmittedOpportunityType[]>([]);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line max-len, prettier/prettier
  const [errorSubmittedOpport, setErrorSubmittedOpport] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [parent] = useAutoAnimate();

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

  useEffect(() => {
    const getUserAccountDetails = async () => {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        setError('You need to be logged in to view your account details.');

        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          // eslint-disable-next-line max-len
          'https://dewvdtfd5m.execute-api.eu-north-1.amazonaws.com/dev/account/with-events',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (!response.ok) {
          if (response.status === 401) {
            setError('Unauthorized: Please login again.');
          } else if (response.status === 404) {
            setError('Account not found.');
          } else if (response.status === 500) {
            setError('Server error. Please try again later.');
          } else {
            setError(`Unexpected error: ${response.statusText}`);
          }

          return;
        }

        const data = await response.json();

        const events = Array.isArray(data?.events) ? data.events : [];

        setPostedOpportunities(events);
      } catch (errorMes) {
        setError('Network error. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    getUserAccountDetails();
  }, []);

  useEffect(() => {
    const getUserAccountDetails = async () => {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        setError('You need to be logged in to view your account details.');

        return;
      }

      setLoading(true);
      setErrorSubmittedOpport(null);

      try {
        const response = await fetch(
          // eslint-disable-next-line max-len
          'https://dewvdtfd5m.execute-api.eu-north-1.amazonaws.com/dev/account/with-sub-events',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (!response.ok) {
          if (response.status === 401) {
            setErrorSubmittedOpport('Unauthorized: Please login again.');
          } else if (response.status === 404) {
            setErrorSubmittedOpport('Account not found.');
          } else if (response.status === 500) {
            setErrorSubmittedOpport('Server error. Please try again later.');
          } else {
            setErrorSubmittedOpport(`Unexpected error: ${response.statusText}`);
          }

          return;
        }

        const data = await response.json();

        const events = Array.isArray(data?.events) ? data.events : [];

        setSubmittedOpportunities(events);
      } catch (errorMes) {
        setErrorSubmittedOpport('Network error. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    getUserAccountDetails();
  }, []);

  const toggleOpen = (id: string) => {
    setOpenDropdown(prev => (prev === id ? null : id));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className={styles.opport}>
      <div className={styles.opport__nav}>
        <div
          className={cn(styles.opport__top, {
            [styles['opport__top--scrolled']]: isScrolled,
          })}
        >
          <p
            className={cn(styles.opport__greeting, {
              [styles['opport__greeting--scrolled']]: isScrolled,
            })}
          >
            Hello, {userName}!
          </p>
          <h1
            className={cn(styles.opport__title, {
              [styles['opport__title--scrolled']]: isScrolled,
            })}
          >
            All You Need, In One Place
          </h1>
          <div className={styles.opport__buttons}>
            <NavLink
              to={Path.ProfileInfo}
              className={({ isActive }: { isActive: boolean }) =>
                cn(styles.opport__button, {
                  [styles['opport__button--active']]:
                    isActive && pathname === Path.ProfileInfo,
                })
              }
            >
              Profile Information
            </NavLink>
            <NavLink
              to={Path.Activity}
              className={({ isActive }: { isActive: boolean }) =>
                cn(styles.opport__button, {
                  [styles['opport__button--active']]:
                    isActive && pathname === Path.Activity,
                })
              }
            >
              My Activity
            </NavLink>
            <NavLink
              to={Path.Opportunities}
              className={({ isActive }: { isActive: boolean }) =>
                cn(styles.opport__button, {
                  [styles['opport__button--active']]:
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
          className={cn(styles.opport__bottom, {
            [styles['opport__bottom--scrolled']]: isScrolled,
          })}
        >
          <div className={styles.opport__block}>
            <div className={styles.opport__shell}>
              <h2 className={styles.opport__subtitle}>
                Submitted Opportunities
              </h2>
              <button
                className={styles['opport__create-button']}
                onClick={e => {
                  e.preventDefault();
                  navigate(Path.StepOne);
                }}
              >
                Create an opportunity
              </button>
            </div>

            {errorSubmittedOpport && (
              <p className={styles.opport__error}>{errorSubmittedOpport}</p>
            )}
            <div className={styles.opport__content}>
              <div className={styles.opport__grid}>
                <div className={styles.opport__header}>
                  <span>Name</span>
                  <span>Submission Date</span>
                  <span>Opportunity Type</span>
                  <span>Status</span>
                  <span>Details</span>
                </div>
                <div className={styles['opport__line-grid']}></div>
                {loading ? (
                  <div>Loading opportunities...</div>
                ) : submittedOpportunities.length > 0 ? (
                  submittedOpportunities.map(event => {
                    const eventTime = new Date(event.currentTime);

                    return (
                      <div key={event.eventId} className={styles.opport__row}>
                        <span>{event.title}</span>
                        <span>
                          {isNaN(eventTime.getTime())
                            ? 'No time'
                            : eventTime.toLocaleString()}
                        </span>
                        <span>{event.opportunityType}</span>
                        <span className={styles.opport__status}>
                          {event.submittedStatus}
                        </span>
                        <Link
                          to={`${event.opportunityType === 'WISHES' ? '/wishes' : '/volunteering'}/${event.eventId}`}
                          className={styles['opport__button-detail']}
                          aria-label={`View details for ${event.title}`}
                        >
                          Opportunity Information
                        </Link>
                      </div>
                    );
                  })
                ) : (
                  <div>No opportunities available.</div>
                )}
              </div>
              <div className={styles.opport__list} ref={parent}>
                {submittedOpportunities.length > 0 ? (
                  submittedOpportunities.map(event => {
                    const eventTime = new Date(event.currentTime);

                    return (
                      <React.Fragment key={event.eventId}>
                        <div className={styles.opport__dropdown}>
                          <button
                            type="button"
                            className={styles['opport__dropdown-button']}
                            onClick={e => {
                              e.preventDefault();
                              toggleOpen(event.eventId);
                            }}
                          >
                            <span className={styles.opport__select}>
                              {event.title}
                            </span>
                          </button>
                          <button
                            type="button"
                            className={styles['opport__dropdown-img-container']}
                            onClick={e => {
                              e.preventDefault();
                              toggleOpen(event.eventId);
                            }}
                          >
                            <img
                              className={styles['opport__dropdown-img']}
                              src={
                                openDropdown === event.eventId
                                  ? arrow_up
                                  : arrow_down
                              }
                              alt="Arrow Down"
                            />
                          </button>
                        </div>
                        <div className={styles.opport__line}></div>
                        {openDropdown === event.eventId && (
                          <div className={styles.opport__info}>
                            <div>
                              <span className={styles['opport__detail-name']}>
                                Submission Date:
                              </span>
                              <span className={styles['opport__detail-value']}>
                                {isNaN(eventTime.getTime())
                                  ? 'No time'
                                  : eventTime.toLocaleString()}
                              </span>
                            </div>
                            <div>
                              <span className={styles['opport__detail-name']}>
                                Type:
                              </span>
                              <span className={styles['opport__detail-value']}>
                                {event.opportunityType}
                              </span>
                            </div>
                            <div>
                              <span className={styles['opport__detail-name']}>
                                Status:
                              </span>
                              <span
                                className={cn(
                                  styles['opport__detail-value'],
                                  styles.opport__status,
                                  {
                                    [styles['opport__status--progress']]:
                                      event.submittedStatus ===
                                        'Information requested' ||
                                      event.submittedStatus === 'Denied',
                                    [styles['opport__status--completed']]:
                                      event.submittedStatus === 'Submitted' ||
                                      event.submittedStatus === 'On Review',
                                  },
                                )}
                              >
                                {event.submittedStatus}
                              </span>
                            </div>
                            <Link
                              to={`${event.opportunityType === 'WISHES' ? '/wishes' : '/volunteering'}/${event.eventId}`}
                              className={styles['opport__button-detail']}
                              aria-label={`View details for ${event.title}`}
                            >
                              Opportunity Information
                            </Link>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <p>No opportunities available</p>
                )}
              </div>
            </div>
          </div>
          <div className={styles.opport__block}>
            <h2 className={styles.opport__subtitle}>Posted Opportunities</h2>
            {error && <p className={styles.opport__error}>{error}</p>}
            {loading && <Loader />}
            <div className={styles['opport__search-block']}>
              <div className={styles['opport__block-input']}>
                <img
                  src={search}
                  alt="Search"
                  className={styles['opport__search-img']}
                />
                <input
                  type="text"
                  placeholder="Search opportunities"
                  value={query}
                  onChange={handleSearchChange}
                  className={styles.opport__input}
                />
                <div className={styles['opport__line-search']}></div>
              </div>
              <div className={styles['opport__buttons-search']}>
                <button className={styles['opport__button-search']}>
                  <span>Search</span>
                </button>
                <button className={styles['opport__button-search']}>
                  <span>Filters</span>
                </button>
              </div>
            </div>
            <div className={styles.opport__content}>
              <div className={styles.opport__grid}>
                <div className={styles.opport__header}>
                  <span>Name</span>
                  <span>Type</span>
                  <span>Main Assistance Progress</span>
                  <span>Status</span>
                  <span>Details</span>
                </div>
                <div className={styles['opport__line-grid']}></div>
                {loading ? (
                  <div>Loading opportunities...</div>
                ) : postedOpportunities.length > 0 ? (
                  postedOpportunities.map((event, index) => (
                    <div key={event.id ?? index} className={styles.opport__row}>
                      <span>{event.title}</span>
                      <span>{event.opportunityType}</span>
                      <span
                        className={cn(styles['opport__main-assist'], {
                          [styles['opport__main-assist--progress']]:
                            event.status === 'In progress',
                          [styles['opport__main-assist--completed']]:
                            event.status === 'Completed',
                        })}
                      >
                        {event.opportunityType === 'WISHES'
                          ? `${event.target} / ${event.currentProgress ?? 0} ₴ collected`
                          : `${event.target} / ${event.currentProgress ?? 0} participants`}
                      </span>
                      <span
                        className={cn(styles.opport__status, {
                          [styles['opport__status--progress']]:
                            event.status === 'In progress',
                          [styles['opport__status--completed']]:
                            event.status === 'Completed',
                        })}
                      >
                        {event.status}
                      </span>
                      <Link
                        to={`${event.opportunityType === 'WISHES' ? '/wishes' : '/volunteering'}/${event.id}`}
                        className={styles['opport__button-detail']}
                        aria-label={`View details for ${event.title}`}
                      >
                        View details
                      </Link>
                    </div>
                  ))
                ) : (
                  <div>No opportunities available.</div>
                )}
              </div>
              <div className={styles.opport__list} ref={parent}>
                {postedOpportunities.length > 0 ? (
                  postedOpportunities.map((event, index: number) => (
                    <React.Fragment
                      key={event.id ?? `fallback-${index}-${Math.random()}`}
                    >
                      <div className={styles.opport__dropdown}>
                        <button
                          className={styles['opport__dropdown-button']}
                          onClick={e => {
                            e.preventDefault();
                            toggleOpen(event.id);
                          }}
                        >
                          <span className={styles.opport__select}>
                            {event.title}
                          </span>
                        </button>
                        <div
                          className={styles['opport__dropdown-img-container']}
                        >
                          <img
                            className={styles['opport__dropdown-img']}
                            src={
                              openDropdown === event.id ? arrow_up : arrow_down
                            }
                            alt="Arrow Down"
                          />
                        </div>
                      </div>
                      <div className={styles.opport__line}></div>
                      {openDropdown === event.id && (
                        <div className={styles.opport__info}>
                          <div>
                            <span className={styles['opport__detail-name']}>
                              Type:
                            </span>
                            <span className={styles['opport__detail-value']}>
                              {event.opportunityType}
                            </span>
                          </div>
                          <div>
                            <span className={styles['opport__detail-name']}>
                              Main Assistance Progress:
                            </span>
                            <span
                              className={cn(
                                styles['opport__detail-value'],
                                styles['opport__main-assist'],
                                {
                                  [styles['opport__main-assist--progress']]:
                                    event.status === 'In progress',
                                  [styles['opport__main-assist--completed']]:
                                    event.status === 'Completed',
                                },
                              )}
                            >
                              {event.opportunityType === 'WISHES'
                                ? `${event.target} / ${event.currentProgress ?? 0} ₴ collected`
                                : `${event.target} / ${event.currentProgress ?? 0} participants`}
                            </span>
                          </div>
                          <div>
                            <span className={styles['opport__detail-name']}>
                              Status:
                            </span>
                            <span
                              className={cn(
                                styles['opport__detail-value'],
                                styles.opport__status,
                                {
                                  [styles['opport__status--progress']]:
                                    event.status === 'In progress',
                                  [styles['opport__status--completed']]:
                                    event.status === 'Completed',
                                },
                              )}
                            >
                              {event.status}
                            </span>
                          </div>
                          <Link
                            to={`${event.opportunityType === 'WISHES' ? '/wishes' : '/volunteering'}/${event.id}`}
                            className={styles['opport__button-detail']}
                            aria-label={`View details for ${event.title}`}
                          >
                            View details
                          </Link>
                        </div>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <p>No opportunities available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
