/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import React, { useCallback, useEffect, useState } from 'react';
import styles from './Filters.module.scss';
import cn from 'classnames';
import arrow_up from '../../images/icons/arrow_up_white (2).svg';
import arrow_down from '../../images/icons/arrow_down_white.svg';
import calendar from '../../images/icons/calendar-filled.svg';
import { FilterSelection } from '../../types/FilterType';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { usePathChecker } from '../../helpers/usePathChecker';
import {
  assistanceType,
  categoryId,
  opportunityType,
  region,
  timeDemands,
} from '../../helpers/dropdownsInfo';
import { useLocation, useSearchParams } from 'react-router-dom';

interface FiltersProps {
  onFilterChange: (newFilters: FilterSelection) => void;
  setIsFiltersOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type DropdownId =
  | 'categoryId'
  | 'opportunityType'
  | 'assistanceType'
  | 'region'
  | 'timeDemands';

const initialDropdowns = {
  categoryId: false,
  opportunityType: false,
  assistanceType: false,
  region: false,
  timeDemands: false,
};

const initialCategories = {
  categoryId: '',
  opportunityType: '',
  assistanceType: '',
  region: '',
  timeDemands: '',
};

export const Filters: React.FC<FiltersProps> = ({
  onFilterChange,
  setIsFiltersOpen,
}) => {
  const { pathname, search } = useLocation();
  const { isVolunteering, isWishes, isDonate } = usePathChecker();
  const [dropdownStates, setDropdownStates] = useState(initialDropdowns);
  const [selectedOptions, setSelectedOptions] = useState<{
    categoryId: string;
    opportunityType: string;
    assistanceType: string;
    region: string;
    timeDemands: string;
  }>(initialCategories);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showDatePickerStart, setShowDatePickerStart] = useState(false);
  const [showDatePickerEnd, setShowDatePickerEnd] = useState(false);
  const [isApplyActive, setApplyActive] = useState(false);
  const [isCancelActive, setCancelActive] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(search);

    const categoryIdParam = params.get('categoryId');
    const categoryName = categoryIdParam ? categoryId[categoryIdParam] : '';

    const startDateParam = params.get('startDate');
    const endDateParam = params.get('endDate');

    const startSearchDate = startDateParam ? new Date(startDateParam) : null;
    const endSearchDate = endDateParam ? new Date(endDateParam) : null;

    const newFilters: FilterSelection = {
      query: params.get('query') || '',
      categoryId: categoryName || '',
      opportunityType: params.get('opportunityType') || '',
      assistanceType: params.get('assistanceType') || '',
      region: params.get('region') || '',
      timeDemands: params.get('timeDemands') || '',
      startSearchDate,
      endSearchDate,
    };

    onFilterChange(newFilters);

    setSearchParams(params);
  }, [search, setSearchParams]);


  const updateFiltersInURL = useCallback((filterSearch: FilterSelection) => {
    const urlParams = new URLSearchParams();

    if (filterSearch.startDate) {
      const formattedStartDate =
        filterSearch.startDate.toLocaleDateString('en-GB');

      urlParams.set('startDate', formattedStartDate);
    }

    if (filterSearch.endDate) {
      const formattedEndDate =
        filterSearch.endDate.toLocaleDateString('en-GB');

      urlParams.set('endDate', formattedEndDate);
    }

    if (filterSearch.categoryId) {
      urlParams.set('categoryId', filterSearch.categoryId);
    }

    if (filterSearch.opportunityType) {
      urlParams.set('opportunityType', filterSearch.opportunityType);
    }

    if (filterSearch.assistanceType) {
      urlParams.set('assistanceType', filterSearch.assistanceType);
    }

    if (filterSearch.region) {
      urlParams.set('region', filterSearch.region);
    }

    if (filterSearch.timeDemands) {
      urlParams.set('timeDemands', filterSearch.timeDemands);
    }

    if (filterSearch.query) {
      urlParams.set('query', filterSearch.query);
    }

    const paramsString = urlParams.toString();

    if (paramsString) {
      const currentPath = window.location.pathname;
      const newUrl = `${currentPath}#${pathname}?${paramsString}`;

      window.history.replaceState(null, '', newUrl);
    }
  }, []);

  useEffect(() => {
    if (isVolunteering && !selectedOptions.assistanceType) {
      const volunteeringFilter = { assistanceType: 'VOLUNTEERING' };

      setSelectedOptions(prev => ({
        ...prev,
        ...volunteeringFilter,
      }));

      const filtersToApply = {
        ...selectedOptions,
        ...volunteeringFilter,
        startDate,
        endDate,
      };

      onFilterChange(filtersToApply);
      setApplyActive(true);

      if (!searchParams.get('assistanceType')) {
        const newParams = new URLSearchParams(searchParams);

        newParams.set('assistanceType', 'VOLUNTEERING');
        setSearchParams(newParams);
      }
    }
  }, [
    isVolunteering,
    selectedOptions.assistanceType,  // Додаємо залежність лише для конкретного поля
    startDate,
    endDate,
    onFilterChange,
    searchParams, // Використовуємо searchParams для актуалізації параметрів
    setSearchParams,
  ]
  );

  useEffect(() => {
    if (isWishes && !selectedOptions.assistanceType) {
      const wishesFilter = { assistanceType: 'DONATION' };

      setSelectedOptions(prev => ({
        ...prev,
        ...wishesFilter,
      }));

      const filtersToApply = {
        ...selectedOptions,
        ...wishesFilter,
        startDate,
        endDate,
      };

      onFilterChange(filtersToApply);
      setApplyActive(true);

      if (!searchParams.get('assistanceType')) {
        setSearchParams(prev => {
          const newParams = new URLSearchParams(prev);

          newParams.set('assistanceType', 'DONATION');

          return newParams;
        });
      }
    }
  }, [
    isWishes,
    selectedOptions,
    startDate,
    endDate,
    onFilterChange,
    searchParams,
    setSearchParams,
  ]);

  useEffect(() => {
    if (isDonate && !selectedOptions.assistanceType) {
      const donateFilter = { assistanceType: 'DONATION' };

      setSelectedOptions(prev => ({
        ...prev,
        ...donateFilter,
      }));

      const filtersToApply = {
        ...selectedOptions,
        ...donateFilter,
        startDate,
        endDate,
      };

      onFilterChange(filtersToApply);
      setApplyActive(true);

      if (!searchParams.get('assistanceType')) {
        setSearchParams(prev => {
          const newParams = new URLSearchParams(prev);

          newParams.set('assistanceType', 'DONATION');

          return newParams;
        });
      }
    }
  }, [
    isDonate,
    selectedOptions,
    startDate,
    endDate,
    onFilterChange,
    searchParams,
    setSearchParams,
  ]);

  const toggleDropdown = (dropdownId: DropdownId) => {
    setDropdownStates(prevState => ({
      ...prevState,
      [dropdownId]: !prevState[dropdownId],
    }));
  };

  const selectOption = (field: string, value: string) => {
    setSelectedOptions(prevState => ({
      ...prevState,
      [field]: value,
    }));

    setDropdownStates(prevState => ({
      ...prevState,
      [field]: false,
    }));
  };

  const applyFilters = () => {
    const filtersToApply = {
      ...selectedOptions,
      startDate,
      endDate,
    };

    onFilterChange(filtersToApply);
    setApplyActive(true);
    setCancelActive(false);
    setIsFiltersOpen(false);

    updateFiltersInURL(filtersToApply);
  };

  const cancelFilters = () => {
    setSelectedOptions(initialCategories);
    setDropdownStates(initialDropdowns);
    setStartDate(null);
    setEndDate(null);
    onFilterChange({});
    updateFiltersInURL({});
    setApplyActive(false);
    setCancelActive(true);
  };

  const handleHideFilters = () => {
    setIsFiltersOpen(false);
  };

  const renderDatePicker = (
    date: Date | null,
    handleChange: (v: Date | null) => void,
    calendarOpen: boolean,
    setCalendarOpen: React.Dispatch<React.SetStateAction<boolean>>,
    label: string,
  ) => (
    <div>
      <button
        className={styles['filters__toggle-button']}
        onClick={e => {
          e.preventDefault();
          setCalendarOpen(true);
        }}
      >
        <p
          className={cn(styles.filters__select, {
            [styles['filters__select--chosen']]: date,
          })}
        >
          {date ? date.toLocaleDateString('en-GB') : label}
        </p>
        <img
          className={styles.filters__img}
          src={calendar}
          alt="Toggle dropdown"
        />
      </button>
      {calendarOpen && (
        <>
          <div className={styles.filters__calendar}>
            <DatePicker
              selected={date}
              onChange={handleChange}
              inline
            />
          </div>
        </>
      )}
    </div>
  );

  const handleStartingDateChange = (date: Date | null) => {
    setStartDate(date);
    setShowDatePickerStart(false);
  };

  const handleEndingDateChange = (date: Date | null) => {
    setEndDate(date);
    setShowDatePickerEnd(false);
  };

  return (
    <div className={styles.filters}>
      <div className={styles.filters__content}>
        <div className={styles.filters__group}>
          <h3 className={styles.filters__name}>Opportunity Type</h3>
          <div className={styles.filters__dropdown}>
            <button
              className={styles['filters__dropdown-button']}
              onClick={e => {
                e.preventDefault();
                toggleDropdown('opportunityType');
              }}
            >
              <span
                className={cn(styles.filters__select, {
                  [styles['filters__select--chosen']]:
                    selectedOptions.opportunityType,
                })}
              >
                {selectedOptions.opportunityType || 'Opportunity Type'}
              </span>
            </button>
            <div className={styles['filters__dropdown-img-container']}>
              <img
                className={styles['filters__dropdown-img']}
                src={
                  dropdownStates.opportunityType ? arrow_up : arrow_down
                }
                alt="Arrow Down"
              />
            </div>
          </div>
          {dropdownStates.opportunityType && (
            <ul className={styles['filters__dropdown-list']}>
              {opportunityType.map(type => (
                <li
                  key={type}
                  onClick={() => selectOption('opportunityType', type)}
                  className={cn(styles['filters__dropdown-item'], {
                    [styles['filters__dropdown-item--active']]:
                      selectedOptions.opportunityType === type,
                  })}
                >
                  <label className={styles['filters__dropdown-label']}>
                    <input
                      type="checkbox"
                      checked={selectedOptions.opportunityType === type}
                      onChange={() =>
                        selectOption('opportunityType', type)
                      }
                      className={styles['filters__dropdown-checkbox']}
                    />
                    {type}
                  </label>
                </li>
              ))}
            </ul>
          )}
          <div className={styles.filters__line}></div>
        </div>
        <div className={styles.filters__group}>
          <h3 className={styles.filters__name}>Assistance Type</h3>
          <div className={styles.filters__dropdown}>
            <button
              className={styles['filters__dropdown-button']}
              onClick={e => {
                e.preventDefault();
                toggleDropdown('assistanceType');
              }}
            >
              <span
                className={cn(styles.filters__select, {
                  [styles['filters__select--chosen']]:
                    selectedOptions.assistanceType,
                })}
              >
                {selectedOptions.assistanceType || 'Assistance Type'}
              </span>
            </button>
            <div className={styles['filters__dropdown-img-container']}>
              <img
                className={styles['filters__dropdown-img']}
                src={
                  dropdownStates.assistanceType ? arrow_up : arrow_down
                }
                alt="Arrow Down"
              />
            </div>
          </div>
          {dropdownStates.assistanceType && (
            <ul className={styles['filters__dropdown-list']}>
              {assistanceType.map(type => (
                <li
                  key={type}
                  onClick={() => selectOption('assistanceType', type)}
                  className={cn(styles['filters__dropdown-item'], {
                    [styles['filters__dropdown-item--active']]:
                      selectedOptions.assistanceType === type,
                  })}
                >
                  <label className={styles['filters__dropdown-label']}>
                    <input
                      type="checkbox"
                      checked={selectedOptions.assistanceType === type}
                      onChange={() =>
                        selectOption('assistanceType', type)
                      }
                      className={styles['filters__dropdown-checkbox']}
                    />
                    {type}
                  </label>
                </li>
              ))}
            </ul>
          )}
          <div className={styles.filters__line}></div>
        </div>
        <div className={styles.filters__group}>
          <h3 className={styles.filters__name}>Category</h3>
          <div className={styles.filters__dropdown}>
            <button
              className={styles['filters__dropdown-button']}
              onClick={e => {
                e.preventDefault();
                toggleDropdown('categoryId');
              }}
            >
              <span
                className={cn(styles.filters__select, {
                  [styles['filters__select--chosen']]:
                    selectedOptions.categoryId,
                })}
              >
                {selectedOptions.categoryId
                  ? categoryId[selectedOptions.categoryId]
                  : 'Category'}
              </span>
            </button>
            <div className={styles['filters__dropdown-img-container']}>
              <img
                className={styles['filters__dropdown-img']}
                src={dropdownStates.categoryId ? arrow_up : arrow_down}
                alt="Arrow Down"
              />
            </div>
          </div>
          {dropdownStates.categoryId && (
            <ul className={styles['filters__dropdown-list']}>
              {Object.entries(categoryId).map(([id, name]) => (
                <li
                  key={id}
                  onClick={() => {
                    selectOption('categoryId', id);
                  }}
                  className={cn(styles['filters__dropdown-item'], {
                    [styles['filters__dropdown-item--active']]:
                      selectedOptions.categoryId === id,
                  })}
                >
                  <label className={styles['filters__dropdown-label']}>
                    <input
                      type="checkbox"
                      checked={selectedOptions.categoryId === id}
                      onChange={() => selectOption('categoryId', id)}
                      className={styles['filters__dropdown-checkbox']}
                    />
                    {name}
                  </label>
                </li>
              ))}
            </ul>
          )}
          <div className={styles.filters__line}></div>
        </div>
        <div className={styles.filters__group}>
          <h3 className={styles.filters__name}>Location</h3>
          <div className={styles.filters__dropdown}>
            <button
              className={styles['filters__dropdown-button']}
              onClick={e => {
                e.preventDefault();
                toggleDropdown('region');
              }}
            >
              <span
                className={cn(styles.filters__select, {
                  [styles['filters__select--chosen']]: selectedOptions.region,
                })}
              >
                {selectedOptions.region || 'Region'}
              </span>
            </button>
            <div className={styles['filters__dropdown-img-container']}>
              <img
                className={styles['filters__dropdown-img']}
                src={dropdownStates.region ? arrow_up : arrow_down}
                alt="Arrow Down"
              />
            </div>
          </div>
          {dropdownStates.region && (
            <ul className={styles['filters__dropdown-list']}>
              {region.map(reg => (
                <li
                  key={reg}
                  onClick={() => selectOption('region', reg)}
                  className={cn(styles['filters__dropdown-item'], {
                    [styles['filters__dropdown-item--active']]:
                      selectedOptions.region === reg,
                  })}
                >
                  <label className={styles['filters__dropdown-label']}>
                    <input
                      type="checkbox"
                      checked={selectedOptions.region === reg}
                      onChange={() => selectOption('region', reg)}
                      className={styles['filters__dropdown-checkbox']}
                    />
                    {reg}
                  </label>
                </li>
              ))}
            </ul>
          )}
          <div className={styles.filters__line}></div>
        </div>
        <div className={styles.filters__group}>
          <h3 className={styles.filters__name}>Time Demands</h3>
          <div className={styles.filters__dropdown}>
            <button
              className={styles['filters__dropdown-button']}
              onClick={e => {
                e.preventDefault();
                toggleDropdown('timeDemands');
              }}
            >
              <span
                className={cn(styles.filters__select, {
                  [styles['filters__select--chosen']]:
                    selectedOptions.timeDemands,
                })}
              >
                {selectedOptions.timeDemands || 'Time Demands'}
              </span>
            </button>
            <div className={styles['filters__dropdown-img-container']}>
              <img
                className={styles['filters__dropdown-img']}
                src={dropdownStates.timeDemands ? arrow_up : arrow_down}
                alt="Arrow Down"
              />
            </div>
          </div>
          {dropdownStates.timeDemands && (
            <ul className={styles['filters__dropdown-list']}>
              {Object.keys(timeDemands).map(demands => (
                <li
                  key={demands}
                  onClick={() => selectOption('timeDemands', demands)}
                  className={cn(styles['filters__dropdown-item'], {
                    [styles['filters__dropdown-item--active']]:
                      selectedOptions.timeDemands === demands,
                  })}
                >
                  <label className={styles['filters__dropdown-label']}>
                    <input
                      type="checkbox"
                      checked={selectedOptions.timeDemands === demands}
                      onChange={() =>
                        selectOption('timeDemands', demands)
                      }
                      className={styles['filters__dropdown-checkbox']}
                    />
                    {demands}
                  </label>
                </li>
              ))}
            </ul>
          )}
          <div className={styles.filters__line}></div>
        </div>
        <div className={styles.filters__group}>
          <h3 className={styles.filters__name}>Start Date</h3>
          {renderDatePicker(
            startDate,
            handleStartingDateChange,
            showDatePickerStart,
            setShowDatePickerStart,
            'Choose a starting date',
          )}
        </div>
        <div className={styles.filters__line}></div>
        <div className={styles.filters__group}>
          <h3 className={styles.filters__name}>End Date</h3>
          {renderDatePicker(
            endDate,
            handleEndingDateChange,
            showDatePickerEnd,
            setShowDatePickerEnd,
            'Choose a ending date',
          )}
        </div>
        <div className={styles.filters__line}></div>
      </div>
      <div className={styles.filters__buttons}>
        <button
          className={cn(styles.filters__button, {
            [styles['filters__button--active']]: isApplyActive,
          })}
          onClick={applyFilters}
        >
          <span>Apply</span>
        </button>
        <button
          className={cn(styles.filters__button, {
            [styles['filters__button--active']]: isCancelActive,
          })}
          onClick={cancelFilters}
        >
          <span>Clear</span>
        </button>
        <button className={styles.filters__button} onClick={handleHideFilters}>
          <span>Cancel</span>
        </button>
      </div>
    </div>
  );
};
