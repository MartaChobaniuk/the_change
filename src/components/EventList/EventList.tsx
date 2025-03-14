/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import React, { useContext, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import styles from './EventList.module.scss';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Path } from '../../utils/constants';
import { EventsContext } from '../../store/EventsContex';
import searchIcon from '../../images/icons/search.svg';
import to_top from '../../images/icons/arrow_back_to_top.svg';
import { FilterSelection } from '../../types/FilterType';
import { Filters } from '../Filters';
import { EventType } from '../../types/EventType';
import { filteredEv } from '../../helpers/getSortedEvents';
import { EventCard } from '../EventCard';
import { Loader } from '../Loader';

type Props = {
  title: string;
  subtitle: string;
};

export const EventList: React.FC<Props> = ({ title, subtitle }) => {
  const { pathname, search } = useLocation();
  const { events, loading, errorMessage } = useContext(EventsContext);
  const [isVisible, setIsVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterSelection>({});
  const [filteredEvent, setFilteredEvent] = useState<EventType[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 4500);

    return () => clearTimeout(timer);
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
    const params = new URLSearchParams(search);
    const queryParam = params.get('query') || '';
    const startDateParam = params.get('startDate');
    const endDateParam = params.get('endDate');

    const startSearchDate = startDateParam ? new Date(startDateParam) : null;
    const endSearchDate = endDateParam ? new Date(endDateParam) : null;

    const newFilters: FilterSelection = {
      query: queryParam,
      categoryId: params.get('categoryId') || '',
      opportunityType: params.get('opportunityType') || '',
      assistanceType: params.get('assistanceType') || '',
      region: params.get('region') || '',
      timeDemands: params.get('timeDemands') || '',
      startSearchDate,
      endSearchDate,
    };

    setQuery(queryParam);
    setFilters(newFilters);
  }, [search]);

  useEffect(() => {
    if (filters || query) {
      setFilteredEvent(filteredEv(events, filters, query));
    } else {
      setFilteredEvent(events);
    }
  }, [events, filters, query]);

  const handleFilterChange = (newFilters: FilterSelection) => {
    setFilters(newFilters);
    const params = new URLSearchParams();

    if (newFilters.query) {
      params.set('query', newFilters.query);
    }

    if (newFilters.categoryId) {
      params.set('categoryId', newFilters.categoryId);
    }

    if (newFilters.opportunityType) {
      params.set('opportunityType', newFilters.opportunityType);
    }

    if (newFilters.assistanceType) {
      params.set('assistanceType', newFilters.assistanceType);
    }

    if (newFilters.region) {
      params.set('region', newFilters.region);
    }

    if (newFilters.timeDemands) {
      params.set('timeDemands', newFilters.timeDemands);
    }

    if (
      newFilters.startSearchDate instanceof Date &&
      !isNaN(newFilters.startSearchDate.getTime())
    ) {
      const formattedStartDate = newFilters.startSearchDate
        .toISOString()
        .split('T')[0];

      params.set('startDate', formattedStartDate);
    }

    if (
      newFilters.endSearchDate instanceof Date &&
      !isNaN(newFilters.endSearchDate.getTime())
    ) {
      const formattedEndDate = newFilters.endSearchDate
        .toISOString()
        .split('T')[0];

      params.set('endDate', formattedEndDate);
    }

    const paramsString = params.toString();

    if (paramsString) {
      const currentPath = window.location.pathname;
      const newUrl = `${currentPath}#${pathname}?${paramsString}`;

      window.history.replaceState(null, '', newUrl);
    }

    setSearchParams(params);
  };

  const openFilters = () => {
    setIsFiltersOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;

    setQuery(newQuery);

    const params = new URLSearchParams(searchParams);

    if (newQuery) {
      params.set('query', newQuery);
    } else {
      params.delete('query');
    }

    setSearchParams(params);
  };

  const handleClickToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      className={cn(styles.explore, {
        [styles['explore--visible']]: isVisible,
      })}
    >
      <div
        className={cn(styles['explore__content-top'], {
          [styles['explore__content-top--visible']]: isVisible,
          [styles['explore__content-top--scrolled']]: isScrolled,
        })}
      >
        <h2
          className={cn(styles.explore__title, {
            [styles['explore__title--visible']]: isVisible,
          })}
        >
          {title}
        </h2>
        <p
          className={cn(styles.explore__subtitle, {
            [styles['explore__subtitle--visible']]: isVisible,
            [styles['explore__subtitle--is-filters']]: isFiltersOpen,
          })}
        >
          {subtitle}
        </p>
        <div
          className={cn(styles.explore__footer, {
            [styles['explore__footer--visible']]: isVisible,
            [styles['explore__footer--scrolled']]: isScrolled,
          })}
        >
          <div
            className={cn(styles.explore__buttons, {
              [styles['explore__buttons--is-filters']]: isFiltersOpen,
            })}
          >
            <Link
              to={Path.Wishes}
              className={cn(styles.explore__button, {
                [styles['explore__button--active']]: pathname === Path.Wishes,
              })}
            >
              <span>Wishes</span>
            </Link>
            <Link
              to={Path.Volunteering}
              className={cn(styles.explore__button, {
                [styles['explore__button--active']]:
                  pathname === Path.Volunteering,
              })}
            >
              <span>Volunteering</span>
            </Link>
            <Link
              to={Path.Explore}
              className={cn(styles.explore__button, {
                [styles['explore__button--active']]: pathname === Path.Explore,
              })}
            >
              <span>Explore All</span>
            </Link>
          </div>
          <div
            className={cn(styles['explore__collaps-line'], {
              [styles['explore__collaps-line--visible']]: isVisible,
              [styles['explore__collaps-line--is-filters']]: isFiltersOpen,
            })}
          ></div>
        </div>
      </div>
      <div
        ref={bottomRef}
        className={cn(styles['explore__content-bottom'], {
          [styles['explore__content-bottom--visible']]: isVisible,
          [styles['explore__content-bottom--is-filters']]: isFiltersOpen,
        })}
      >
        <div
          className={cn(styles['explore__search-block'], {
            [styles['explore__search-block--scrolled']]: isScrolled,
            [styles['explore__search-block--is-filters']]: isFiltersOpen,
          })}
        >
          <div
            className={cn(styles['explore__block-input'], {
              [styles['explore__block-input--is-filters']]: isFiltersOpen,
            })}
          >
            <img
              src={searchIcon}
              alt="Search"
              className={styles['explore__search-img']}
            />
            <input
              type="text"
              placeholder="Search opportunities"
              value={query}
              onChange={handleSearchChange}
              className={styles.explore__input}
            />
            <div className={styles.explore__line}></div>
          </div>
          <div className={styles['explore__buttons-search']}>
            <button
              className={cn(styles['explore__button-search'], {
                [styles['explore__button-search--active']]:
                  query.trim().length > 0,
                [styles['explore__button-search--isFilters']]: isFiltersOpen,
              })}
            >
              <span>Search</span>
            </button>
            {!isFiltersOpen && (
              <button
                className={styles['explore__button-search']}
                onClick={openFilters}
              >
                <span>Filters</span>
              </button>
            )}
          </div>
        </div>
        <div
          className={cn(styles['explore__filters-panel'], {
            [styles['explore__filters-panel--open']]: isFiltersOpen,
          })}
        >
          <Filters
            onFilterChange={handleFilterChange}
            setIsFiltersOpen={setIsFiltersOpen}
          />
        </div>
        <div
          className={cn(styles['explore__events-block'], {
            [styles['explore__events-block--visible']]: isVisible,
            [styles['explore__events-block--is-filters']]: isFiltersOpen,
          })}
        >
          {loading && (
            <div className={styles.explore__loader}>
              <Loader />
            </div>
          )}
          {events.length === 0 && errorMessage && (
            <div className={styles.explore__error}>
              <p className={styles['explore__error-text']}>{errorMessage}</p>
            </div>
          )}

          {filteredEvent.length > 0 &&
            filteredEvent.map((event, index) => (
              <EventCard key={event.id ?? `fallback-${index}`} event={event} />
            ))}

          {!errorMessage && filteredEvent.length === 0 && (
            <div className={styles.explore__error}>
              <p className={styles['explore__error-text']}>No matched events</p>
            </div>
          )}
        </div>
        <div
          className={cn(styles['explore__top-container'], {
            [styles['explore__top-container--visible']]: isVisible,
            [styles['explore__top-container--is-filters']]: isFiltersOpen,
          })}
        >
          <button
            className={styles['explore__top-button']}
            onClick={handleClickToTop}
          >
            <img
              src={to_top}
              alt="to top"
              className={styles['explore__top-img']}
            />
          </button>
        </div>
      </div>
    </section>
  );
};
