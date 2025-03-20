/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
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
  const { search } = useLocation();
  const { isVolunteering, isWishes, isDonate } = usePathChecker();
  const params = new URLSearchParams(search);
  const [searchParams, setSearchParams] = useSearchParams();
  const [dropdownStates, setDropdownStates] = useState(initialDropdowns);
  const [selectedOptions, setSelectedOptions] = useState({
    categoryId: params.get('categoryId') || '',
    opportunityType: params.get('opportunityType') || '',
    assistanceType: params.get('assistanceType') || '',
    region: params.get('region') || '',
    timeDemands: params.get('timeDemands') || '',
  });

  const [startDate, setStartDate] = useState<Date | null>(
    params.get('startDate') ? new Date(params.get('startDate')!) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    params.get('endDate') ? new Date(params.get('endDate')!) : null
  );
  const [showDatePickerStart, setShowDatePickerStart] = useState(false);
  const [showDatePickerEnd, setShowDatePickerEnd] = useState(false);
  const [isApplyActive, setApplyActive] = useState(false);
  const [isCancelActive, setCancelActive] = useState(false);

  useEffect(() => {
    const startDateParam = params.get('startDate');
    const endDateParam = params.get('endDate');

    const hasDates = startDateParam || endDateParam;

    setSelectedOptions({
      categoryId: params.get('categoryId') || '',
      opportunityType: params.get('opportunityType') || '',
      assistanceType: params.get('assistanceType') || '',
      region: params.get('region') || '',
      timeDemands: params.get('timeDemands') || '',
    });

    setStartDate(startDateParam ? new Date(startDateParam) : null);
    setEndDate(endDateParam ? new Date(endDateParam) : null);

    if (hasDates) {
      setApplyActive(true);
    }
  }, [search]);

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

      const newParams = new URLSearchParams(searchParams);

      if (isVolunteering && !searchParams.get('assistanceType')) {
        newParams.set('assistanceType', 'VOLUNTEERING');
      }

      if (newParams.toString() !== searchParams.toString()) {
        setSearchParams(newParams);
      }
    }
  }, [
    isVolunteering,
    selectedOptions.assistanceType,
    startDate,
    endDate,
    onFilterChange,
    searchParams,
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

      const newParams = new URLSearchParams(searchParams);

      if (isWishes && !searchParams.get('assistanceType')) {
        newParams.set('assistanceType', 'DONATION');
      }

      if (newParams.toString() !== searchParams.toString()) {
        setSearchParams(newParams);
      }
    }
  }, [
    isWishes,
    selectedOptions.assistanceType,
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

      const newParams = new URLSearchParams(searchParams);

      if (isWishes && !searchParams.get('assistanceType')) {
        newParams.set('assistanceType', 'DONATION');
      }

      if (newParams.toString() !== searchParams.toString()) {
        setSearchParams(newParams);
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

  useEffect(() => {
    if (isApplyActive) {
      const filtersToApply = {
        ...selectedOptions,
        startDate,
        endDate,
      };

      onFilterChange(filtersToApply);
    }
  }, [startDate, endDate, selectedOptions, isApplyActive]);

  const applyFilters = () => {
    setApplyActive(true);
    setCancelActive(false);
    setIsFiltersOpen(false);
  };

  const cancelFilters = () => {
    setSelectedOptions(initialCategories);
    setDropdownStates(initialDropdowns);
    setStartDate(null);
    setEndDate(null);
    onFilterChange({});
    setApplyActive(false);
    setCancelActive(true);

    setSearchParams(new URLSearchParams());
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
          setCalendarOpen(prev => !prev);
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
              type="button"
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
            <button
              type="button"
              className={styles['filters__dropdown-img-container']}
              onClick={e => {
                e.preventDefault();
                toggleDropdown('opportunityType');
              }}
            >
              <img
                className={styles['filters__dropdown-img']}
                src={
                  dropdownStates.opportunityType ? arrow_up : arrow_down
                }
                alt="Arrow Down"
              />
            </button>
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
              type="button"
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
            <button
              type="button"
              className={styles['filters__dropdown-img-container']}
              onClick={e => {
                e.preventDefault();
                toggleDropdown('assistanceType');
              }}
            >
              <img
                className={styles['filters__dropdown-img']}
                src={
                  dropdownStates.assistanceType ? arrow_up : arrow_down
                }
                alt="Arrow Down"
              />
            </button>
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
              type="button"
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
            <button
              type="button"
              className={styles['filters__dropdown-img-container']}
              onClick={e => {
                e.preventDefault();
                toggleDropdown('categoryId');
              }}
            >
              <img
                className={styles['filters__dropdown-img']}
                src={dropdownStates.categoryId ? arrow_up : arrow_down}
                alt="Arrow Down"
              />
            </button>
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
              type="button"
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
            <button
              type="button"
              className={styles['filters__dropdown-img-container']}
              onClick={e => {
                e.preventDefault();
                toggleDropdown('region');
              }}
            >
              <img
                className={styles['filters__dropdown-img']}
                src={dropdownStates.region ? arrow_up : arrow_down}
                alt="Arrow Down"
              />
            </button>
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
              type="button"
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
            <button
              type="button"
              className={styles['filters__dropdown-img-container']}
              onClick={e => {
                e.preventDefault();
                toggleDropdown('timeDemands');
              }}
            >
              <img
                className={styles['filters__dropdown-img']}
                src={dropdownStates.timeDemands ? arrow_up : arrow_down}
                alt="Arrow Down"
              />
            </button>
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
