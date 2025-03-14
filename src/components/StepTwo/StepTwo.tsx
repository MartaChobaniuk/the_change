/* eslint-disable @typescript-eslint/indent */
/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cn from 'classnames';
import styles from './StepTwo.module.scss';
import { Path } from '../../utils/constants';
import {
  opportunityType,
  assistanceType,
  region,
  categoryId,
} from '../../helpers/dropdownsInfo';
import arrow from '../../images/icons/arrow_back.svg';
import arrow_up from '../../images/icons/arrow_up_white (2).svg';
import arrow_down from '../../images/icons/arrow_down_white.svg';
import calendar from '../../images/icons/calendar-filled.svg';
import DatePicker from 'react-datepicker';
import { useOpportunityContext } from '../../store/OpportunityContex';

type DropdownId =
  | 'categoryId'
  | 'opportunityType'
  | 'assistanceType'
  | 'region'
  | 'timeDemands';

export const StepTwo = () => {
  const navigate = useNavigate();
  const { stepTwoData, setStepTwoData } = useOpportunityContext();

  const [dropdownStates, setDropdownStates] = useState({
    categoryId: false,
    opportunityType: false,
    assistanceType: false,
    region: false,
    timeDemands: false,
  });

  const [selectedOptions, setSelectedOptions] = useState({
    categoryId: stepTwoData.categoryId || '',
    opportunityType: stepTwoData.opportunityType || '',
    assistanceType: stepTwoData.assistanceType || '',
    region: stepTwoData.region || '',
    timeDemands: stepTwoData.timeDemands || '',
  });

  const [showDatePickerStart, setShowDatePickerStart] = useState(false);
  const [showDatePickerEnd, setShowDatePickerEnd] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const storedData = localStorage.getItem('stepTwoData');

    if (storedData) {
      const parsedData = JSON.parse(storedData);

      setStepTwoData(prevState => ({
        ...prevState,
        ...parsedData,
      }));
    }
  }, []);

  useEffect(() => {
    if (stepTwoData) {
      localStorage.setItem('stepTwoData', JSON.stringify(stepTwoData));
    }
  }, [stepTwoData]);

  const getTimeDemandsText = (hours: number): string => {
    if (hours <= 12) {
      return '1-12 hours';
    } else if (hours <= 24) {
      return 'Up to a day';
    } else if (hours <= 144) {
      return 'Up to a week';
    } else if (hours <= 744) {
      return 'Up to a month';
    } else if (hours <= 2232) {
      return '1 - 3 months';
    } else if (hours <= 4464) {
      return '3 - 6 months';
    } else if (hours <= 8950) {
      return 'Up to a year';
    } else {
      return 'More than a year';
    }
  };

  const calculateTimeDemands = () => {
    const startDate = stepTwoData.startingDate
      ? new Date(stepTwoData.startingDate)
      : null;
    const endDate = stepTwoData.endingDate
      ? new Date(stepTwoData.endingDate)
      : null;

    if (
      startDate &&
      endDate &&
      !isNaN(startDate.getTime()) &&
      !isNaN(endDate.getTime())
    ) {
      const diffInMs = endDate.getTime() - startDate.getTime();
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const timeDemandsText = getTimeDemandsText(diffInHours);

      setStepTwoData(prevState => ({
        ...prevState,
        timeDemands: timeDemandsText,
      }));

      return timeDemandsText;
    }

    return '0 hours';
  };

  useEffect(() => {
    const timeDemandsText = calculateTimeDemands();

    setStepTwoData(prevState => ({
      ...prevState,
      timeDemands: timeDemandsText,
    }));
  }, [stepTwoData.startingDate, stepTwoData.endingDate]);


  const toggleStartPeriod = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const newPeriod = stepTwoData.startPeriod === 'AM' ? 'PM' : 'AM';

    setStepTwoData(prevState => ({
      ...prevState,
      startPeriod: newPeriod,
    }));
  };

  const toggleEndPeriod = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const newPeriod = stepTwoData.endPeriod === 'AM' ? 'PM' : 'AM';

    setStepTwoData(prevState => ({
      ...prevState,
      endPeriod: newPeriod,
    }));
  };

  const handleStartHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === '' || (Number(value) >= 1 && Number(value) <= 12)) {
      setStepTwoData(prevState => ({
        ...prevState,
        startHour: value,
      }));
    }
  };

  const handleStartHourBlur = () => {
    if (stepTwoData.startHour !== '' && stepTwoData.startHour.length < 2) {
      const paddedHour = stepTwoData.startHour.padStart(2, '0');

      setStepTwoData(prevState => ({
        ...prevState,
        startHour: paddedHour,
      }));
    }
  };

  const handleStartMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === '' || (Number(value) >= 0 && Number(value) <= 59)) {
      setStepTwoData(prevState => ({
        ...prevState,
        startMinute: value,
      }));
    }
  };

  const handleStartMinuteBlur = () => {
    if (stepTwoData.startMinute !== '' && stepTwoData.startMinute.length < 2) {
      const paddedMinute = stepTwoData.startMinute.padStart(2, '0');

      setStepTwoData(prevState => ({
        ...prevState,
        startMinute: paddedMinute,
      }));
    }
  };

  const handleEndHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === '' || (Number(value) >= 0 && Number(value) <= 12)) {
      setStepTwoData(prevState => ({
        ...prevState,
        endHour: value,
      }));
    }
  };

  const handleEndHourBlur = () => {
    if (stepTwoData.endHour !== '' && stepTwoData.endHour.length < 2) {
      const paddedHour = stepTwoData.endHour.padStart(2, '0');

      setStepTwoData(prevState => ({
        ...prevState,
        endHour: paddedHour,
      }));
    }
  };

  const handleEndMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === '' || (Number(value) >= 0 && Number(value) <= 59)) {
      setStepTwoData(prevState => ({
        ...prevState,
        endMinute: value,
      }));
    }
  };

  const handleEndMinuteBlur = () => {
    if (stepTwoData.endMinute !== '' && stepTwoData.endMinute.length < 2) {
      const paddedMinute = stepTwoData.endMinute.padStart(2, '0');

      setStepTwoData(prevState => ({
        ...prevState,
        endMinute: paddedMinute,
      }));
    }
  };

  const toggleDropdown = (dropdownId: DropdownId) => {
    setDropdownStates(prevState => ({
      ...prevState,
      [dropdownId]: !prevState[dropdownId],
    }));
  };

  const selectOption = (category: string, value: string) => {
    setSelectedOptions(prevState => ({
      ...prevState,
      [category]: value,
    }));

    setStepTwoData(prevState => ({
      ...prevState,
      [category]: value,
    }));

    setDropdownStates(prevState => ({
      ...prevState,
      [category]: false,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setStepTwoData(prev => ({ ...prev, [name]: value }));
  };

  const handleStartingDateChange = (date: Date | null) => {
    if (!date) {
      return;
    }

    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000,
    );

    const day = String(localDate.getDate()).padStart(2, '0');
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const year = localDate.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    setStepTwoData(prev => ({
      ...prev,
      startingDate: localDate.toISOString(),
      formattedStartingDate: formattedDate,
    }));

    setShowDatePickerStart(false);
  };

  const handleEndingDateChange = (date: Date | null) => {
    if (!date) {
      return;
    }

    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000,
    );

    const day = String(localDate.getDate()).padStart(2, '0');
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const year = localDate.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    setStepTwoData(prev => ({
      ...prev,
      endingDate: localDate.toISOString(),
      formattedEndingDate: formattedDate,
    }));

    setShowDatePickerEnd(false);
  };

  const validateFields = () => {
    const newErrors: Record<string, string> = {};

    if (!stepTwoData.title.trim()) {
      newErrors.title = 'Opportunity name is required';
    }

    if (!stepTwoData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    if (!stepTwoData.opportunityType) {
      newErrors.opportunityType = 'Opportunity type is required';
    }

    if (!stepTwoData.assistanceType) {
      newErrors.assistanceType = 'Assistance type is required';
    }

    if (!stepTwoData.target) {
      newErrors.target = 'Target is required';
    }

    if (!stepTwoData.region) {
      newErrors.region = 'Region is required';
    }

    if (!stepTwoData.address) {
      newErrors.address = 'Address is required';
    }

    if (!stepTwoData.startingDate) {
      newErrors.startingDate =
        'Please choose a starting date and time (hour and minute)';
    }

    if (!stepTwoData.startHour) {
      newErrors.startHour = 'Please choose a starting hour and minutes';
    }

    if (!stepTwoData.startMinute) {
      newErrors.startMinute = 'Please choose a starting minutes';
    }

    if (!stepTwoData.endingDate) {
      newErrors.endingDate =
        'Please choose an ending date and time (hour and minute)';
    }

    if (!stepTwoData.endHour) {
      newErrors.endHour = 'Please choose a ending hour and minutes';
    }

    if (!stepTwoData.endMinute) {
      newErrors.endMinute = 'Please choose a ending minutes';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();

    if (validateFields()) {
      navigate(Path.StepThree);
    }
  };

  return (
    <div className={styles.two}>
      <div className={styles.two__nav}>
        <div className={styles['two__right-side']}>
          <div
            className={styles['two__bllock-top']}
            onClick={() => navigate(Path.StepOne)}
          >
            <img src={arrow} alt="arrow" className={styles.two__img} />
            <p className={styles.two__back}>Go Back</p>
          </div>
          <div className={styles['two__bllock-bottom']}>
            <h1 className={styles.two__title}>New Opportunity</h1>
            <h3 className={styles.two__subtitle}>Step 2/3. Event Overview</h3>
          </div>
        </div>
        <div className={styles['two__left-side']}>
          <div className={styles.two__form}>
            <p className={styles.two__content}>
              Provide key details about the opportunity. These details are all
              required as they will make your opportunity easy to find through
              our filters and search tools.
            </p>
            <form>
              <input
                className={styles.two__input}
                type="text"
                placeholder="Opportunity Name"
                name="title"
                value={stepTwoData.title}
                onChange={handleChange}
              />
              <div className={styles.two__line}></div>
              {errors.title && !stepTwoData.title && (
                <p className={styles.two__error}>{errors.title}</p>
              )}
              <p className={styles.two__remark}>*Required</p>
              <div className={styles['two__dropdowns-block']}>
                <div className={styles['two__dropdown-categories']}>
                  <button
                    type="button"
                    className={styles.two__dropdown}
                    onClick={e => {
                      e.preventDefault();
                      toggleDropdown('categoryId');
                    }}
                  >
                    <span
                      className={cn(styles.two__select, {
                        [styles['two__select--chosen']]:
                          selectedOptions.categoryId,
                      })}
                    >
                      {selectedOptions.categoryId
                        ? categoryId[selectedOptions.categoryId]
                        : 'Category'}
                    </span>
                  </button>
                  <div
                    className={styles['two__dropdown-img-container']}
                    onClick={e => {
                      e.preventDefault();
                      toggleDropdown('categoryId');
                    }}
                  >
                    <img
                      className={styles['two__dropdown-img']}
                      src={dropdownStates.categoryId ? arrow_up : arrow_down}
                      alt="Arrow Down"
                    />
                  </div>
                  {dropdownStates.categoryId && (
                    <ul className={styles['two__dropdown-list-categories']}>
                      {Object.entries(categoryId).map(([id, name]) => (
                        <li
                          key={id}
                          onClick={() => {
                            selectOption('categoryId', id);
                          }}
                          className={cn(styles['two__dropdown-item'], {
                            [styles['two__dropdown-item--active']]:
                              selectedOptions.categoryId === id,
                          })}
                        >
                          <label className={styles['two__dropdown-label']}>
                            <input
                              type="checkbox"
                              checked={selectedOptions.categoryId === id}
                              onChange={() => selectOption('categoryId', id)}
                              className={styles['two__dropdown-checkbox']}
                            />
                            {name}
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className={styles['two__line-categ-tablet']}></div>
                {errors.categoryId && !stepTwoData.categoryId && (
                  <p className={styles['two__error-left-tablet']}>
                    {errors.categoryId}
                  </p>
                )}

                <div className={styles['two__dropdown-opport']}>
                  <button
                    type="button"
                    className={styles.two__dropdown}
                    onClick={e => {
                      e.preventDefault();
                      toggleDropdown('opportunityType');
                    }}
                  >
                    <span
                      className={cn(styles.two__select, {
                        [styles['two__select--chosen']]:
                          selectedOptions.opportunityType,
                      })}
                    >
                      {selectedOptions.opportunityType || 'Opportunity Type'}
                    </span>
                  </button>
                  <div
                    className={styles['two__dropdown-img-container']}
                    onClick={e => {
                      e.preventDefault();
                      toggleDropdown('opportunityType');
                    }}
                  >
                    <img
                      className={styles['two__dropdown-img']}
                      src={
                        dropdownStates.opportunityType ? arrow_up : arrow_down
                      }
                      alt="Arrow Down"
                    />
                  </div>
                  {dropdownStates.opportunityType && (
                    <ul className={styles['two__dropdown-list-opport']}>
                      {opportunityType.map(type => (
                        <li
                          key={type}
                          onClick={() => selectOption('opportunityType', type)}
                          className={cn(styles['two__dropdown-item'], {
                            [styles['two__dropdown-item--active']]:
                              selectedOptions.opportunityType === type,
                          })}
                        >
                          <label className={styles['two__dropdown-label']}>
                            <input
                              type="checkbox"
                              checked={selectedOptions.opportunityType === type}
                              onChange={() =>
                                selectOption('opportunityType', type)
                              }
                              className={styles['two__dropdown-checkbox']}
                            />
                            {type}
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className={styles['two__line-categ-tablet']}></div>
                {errors.opportunityType && !stepTwoData.opportunityType && (
                  <p className={styles['two__error-right-tablet']}>
                    {errors.opportunityType}
                  </p>
                )}
              </div>
              <div className={styles.two__lines}>
                <div className={styles['two__line-left']}></div>
                <div className={styles['two__line-right']}></div>
              </div>
              <div className={styles.two__errors}>
                {errors.categoryId && !stepTwoData.categoryId && (
                  <div className={styles['two__container-error-left']}>
                    <p className={styles['two__error-left']}>
                      {errors.categoryId}
                    </p>
                  </div>
                )}
                {errors.opportunityType && !stepTwoData.opportunityType && (
                  <div className={styles['two__container-error-right']}>
                    <p className={styles['two__error-right']}>
                      {errors.opportunityType}
                    </p>
                  </div>
                )}
              </div>

              <div className={styles['two__dropdowns-block']}>
                <div className={styles['two__dropdown-assist']}>
                  <button
                    className={styles.two__dropdown}
                    onClick={e => {
                      e.preventDefault();
                      toggleDropdown('assistanceType');
                    }}
                  >
                    <span
                      className={cn(styles.two__select, {
                        [styles['two__select--chosen']]:
                          selectedOptions.assistanceType,
                      })}
                    >
                      {selectedOptions.assistanceType || 'Assistance Type'}
                    </span>
                  </button>
                  <div
                    className={styles['two__dropdown-img-container']}
                    onClick={e => {
                      e.preventDefault();
                      toggleDropdown('assistanceType');
                    }}
                  >
                    <img
                      className={styles['two__dropdown-img']}
                      src={
                        dropdownStates.assistanceType ? arrow_up : arrow_down
                      }
                      alt="Arrow Down"
                    />
                  </div>
                  {dropdownStates.assistanceType && (
                    <ul className={styles['two__dropdown-list-assist']}>
                      {assistanceType.map(type => (
                        <li
                          key={type}
                          onClick={() => selectOption('assistanceType', type)}
                          className={cn(styles['two__dropdown-item'], {
                            [styles['two__dropdown-item--active']]:
                              selectedOptions.assistanceType === type,
                          })}
                        >
                          <label className={styles['two__dropdown-label']}>
                            <input
                              type="checkbox"
                              checked={selectedOptions.assistanceType === type}
                              onChange={() =>
                                selectOption('assistanceType', type)
                              }
                              className={styles['two__dropdown-checkbox']}
                            />
                            {type}
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className={styles['two__line-categ-tablet']}></div>
                {errors.assistanceType && !stepTwoData.assistanceType && (
                  <p className={styles['two__error-left-tablet']}>
                    {errors.assistanceType}
                  </p>
                )}
                <input
                  type="text"
                  className={styles['two__input--target']}
                  placeholder="Target"
                  name="target"
                  value={stepTwoData.target}
                  onChange={handleChange}
                />
                <div className={styles['two__line-categ-tablet']}></div>
                {errors.target && !stepTwoData.target && (
                  <p className={styles['two__error-right-tablet']}>
                    {errors.target}
                  </p>
                )}
              </div>
              <div className={styles.two__lines}>
                <div className={styles['two__line-left']}></div>
                <div className={styles['two__line-right']}></div>
              </div>
              <div className={styles.two__errors}>
                {errors.assistanceType && !stepTwoData.assistanceType && (
                  <div className={styles['two__container-error-left']}>
                    <p className={styles['two__error-left']}>
                      {errors.assistanceType}
                    </p>
                  </div>
                )}
                {errors.target && !stepTwoData.target && (
                  <div className={styles['two__container-error-right']}>
                    <p className={styles['two__error-right']}>
                      {errors.target}
                    </p>
                  </div>
                )}
              </div>
              <div className={styles['two__remark--container']}>
                <p className={styles['two__remark--target']}>
                  Mesurable goal for progress tracking.
                </p>
              </div>
              <div className={styles['two__block-region']}>
                <div className={styles['two__dropdown-region']}>
                  <button
                    className={styles.two__dropdown}
                    onClick={e => {
                      e.preventDefault();
                      toggleDropdown('region');
                    }}
                  >
                    <span
                      className={cn(styles.two__select, {
                        [styles['two__select--chosen']]: selectedOptions.region,
                      })}
                    >
                      {selectedOptions.region || 'Region'}
                    </span>
                  </button>
                  <div
                    className={styles['two__dropdown-img-container']}
                    onClick={e => {
                      e.preventDefault();
                      toggleDropdown('region');
                    }}
                  >
                    <img
                      className={styles['two__dropdown-img']}
                      src={dropdownStates.region ? arrow_up : arrow_down}
                      alt="Arrow Down"
                    />
                  </div>
                </div>
                {dropdownStates.region && (
                  <ul className={styles['two__dropdown-list-region']}>
                    {region.map(reg => (
                      <li
                        key={reg}
                        onClick={() => selectOption('region', reg)}
                        className={cn(styles['two__dropdown-item'], {
                          [styles['two__dropdown-item--active']]:
                            selectedOptions.region === reg,
                        })}
                      >
                        <label className={styles['two__dropdown-label']}>
                          <input
                            type="checkbox"
                            checked={selectedOptions.region === reg}
                            onChange={() => selectOption('region', reg)}
                            className={styles['two__dropdown-checkbox']}
                          />
                          {reg}
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className={styles.two__line}></div>
              {errors.region && !stepTwoData.region && (
                <p className={styles.two__error}>{errors.region}</p>
              )}
              <input
                className={styles.two__input}
                type="text"
                placeholder="Address"
                name="address"
                value={stepTwoData.address}
                onChange={handleChange}
              />
              <div className={styles.two__line}></div>
              {errors.address && !stepTwoData.address && (
                <p className={styles.two__error}>{errors.address}</p>
              )}
              <p className={styles.two__remark}>
                Give a full address. If there can be difficulties in finding it,
                provide instructions.
              </p>
              <div className={styles['two__block-calendar']}>
                <button
                  type="button"
                  className={styles.two__calendar}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDatePickerStart((prev) => !prev);
                  }}
                >
                  <input
                    type="text"
                    placeholder="Choose a starting date"
                    className={styles.two__input}
                    name="startingDate"
                    readOnly
                    value={stepTwoData.formattedStartingDate || ''}
                  />
                  {showDatePickerStart && (
                    <div className={styles.two__picker}>
                      <DatePicker
                        selected={
                          stepTwoData.startingDate
                            ? new Date(stepTwoData.startingDate)
                            : null
                        }
                        onChange={handleStartingDateChange}
                        inline
                        minDate={new Date()}
                      />
                    </div>
                  )}
                  <img
                    src={calendar}
                    alt="calendar"
                    className={styles['two__calendar-img']}
                  />
                </button>
                <div className={styles['two__block-hour']}>
                  <input
                    value={stepTwoData.startHour}
                    onChange={handleStartHourChange}
                    onBlur={handleStartHourBlur}
                    type="number"
                    className={styles['two__input--calendar']}
                    placeholder="HH"
                    maxLength={2}
                  />
                </div>
                <div className={styles['two__block-dots']}>
                  <span className={styles.two__dots}>:</span>
                </div>
                <div className={styles['two__block-min']}>
                  <input
                    value={stepTwoData.startMinute}
                    onChange={handleStartMinuteChange}
                    onBlur={handleStartMinuteBlur}
                    type="number"
                    className={styles['two__input--calendar']}
                    placeholder="MM"
                    maxLength={2}
                  />
                </div>
                <button
                  type="button"
                  className={styles['two__button--calendar']}
                  onClick={toggleStartPeriod}
                >
                  {stepTwoData.startPeriod}
                </button>
              </div>
              <div className={styles['two__lines--calendar']}>
                <div className={styles['two__line--big']}></div>
                <div className={styles['two__line--small']}></div>
                <div className={styles['two__line--small']}></div>
              </div>
              {errors.startingDate && !stepTwoData.startingDate && (
                <p className={styles.two__error}>{errors.startingDate}</p>
              )}
              {errors.startHour &&
                stepTwoData.startingDate &&
                !stepTwoData.startHour && (
                  <p className={styles.two__error}>{errors.startHour}</p>
                )}
              {errors.startMinute &&
                stepTwoData.startHour &&
                !stepTwoData.startMinute && (
                  <p className={styles.two__error}>{errors.startMinute}</p>
                )}
              <div className={styles['two__block-calendar']}>
                <button
                  type="button"
                  className={styles.two__calendar}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDatePickerEnd(prev => !prev);
                  }}
                >
                  <input
                    type="text"
                    placeholder="Choose a ending date"
                    className={styles.two__input}
                    name="endingDate"
                    readOnly
                    value={stepTwoData.formattedEndingDate || ''}
                  />
                  {showDatePickerEnd && (
                    <div className={styles.two__picker}>
                      <DatePicker
                        selected={
                          stepTwoData.endingDate
                            ? new Date(stepTwoData.endingDate)
                            : null
                        }
                        onChange={handleEndingDateChange}
                        inline
                      />
                    </div>
                  )}
                  <img
                    src={calendar}
                    alt="calendar"
                    className={styles['two__calendar-img']}
                  />
                </button>
                <div className={styles['two__block-hour']}>
                  <input
                    value={stepTwoData.endHour}
                    onChange={handleEndHourChange}
                    onBlur={handleEndHourBlur}
                    type="number"
                    className={styles['two__input--calendar']}
                    placeholder="HH"
                    maxLength={2}
                  />
                </div>
                <div className={styles['two__block-dots']}>
                  <span className={styles.two__dots}>:</span>
                </div>
                <div className={styles['two__block-min']}>
                  <input
                    value={stepTwoData.endMinute}
                    onChange={handleEndMinuteChange}
                    onBlur={handleEndMinuteBlur}
                    type="number"
                    className={styles['two__input--calendar']}
                    placeholder="MM"
                    maxLength={2}
                  />
                </div>
                <button
                  type="button"
                  className={styles['two__button--calendar']}
                  onClick={toggleEndPeriod}
                >
                  {stepTwoData.endPeriod}
                </button>
              </div>
              <div className={styles['two__lines--calendar']}>
                <div className={styles['two__line--big']}></div>
                <div className={styles['two__line--small']}></div>
                <div className={styles['two__line--small']}></div>
              </div>
              {errors.endingDate && !stepTwoData.endingDate && (
                <p className={styles.two__error}>{errors.endingDate}</p>
              )}
              {errors.endHour &&
                stepTwoData.endingDate &&
                !stepTwoData.endHour && (
                  <p className={styles.two__error}>{errors.endHour}</p>
                )}
              {errors.endMinute &&
                stepTwoData.endHour &&
                !stepTwoData.endMinute && (
                  <p className={styles.two__error}>{errors.endMinute}</p>
                )}
              <input
                type="text"
                name="timeDemands"
                className={styles.two__input}
                value={stepTwoData.timeDemands || ''}
                readOnly
              />
              <div className={styles.two__line}></div>
              <input
                className={styles.two__input}
                name="skills"
                type="text"
                placeholder="Required materials and skills"
                value={stepTwoData.skills}
                onChange={handleChange}
              />
              <div className={styles.two__line}></div>
              <p className={styles.two__remark}>
                List needed materials and/or skills. If none are required, write
                it as well.
              </p>
              <div className={styles.two__buttons}>
                <button
                  type="button"
                  className={styles['two__button-prev']}
                  onClick={e => {
                    e.preventDefault();
                    navigate(Path.StepOne);
                  }}
                >
                  Previous Step
                </button>
                <button
                  type="button"
                  className={styles['two__button-continue']}
                  onClick={handleNextStep}
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
