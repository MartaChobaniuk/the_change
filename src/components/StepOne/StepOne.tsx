/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Path } from '../../utils/constants';
import cn from 'classnames';
import styles from './StepOne.module.scss';
import arrow from '../../images/icons/arrow_back.svg';
import arrow_up from '../../images/icons/arrow_up_white (2).svg';
import arrow_down from '../../images/icons/arrow_down_white.svg';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';
import { useOpportunityContext } from '../../store/OpportunityContex';
import { getImageFromIndexedDB } from '../../helpers/getImageFromIndexedDB';
import { saveImageToIndexedDB } from '../../helpers/saveImageToIndexedDB';
import { removeImageFromIndexedDB } from '../../helpers/removeImageFromIndexed';
import { initIndexedDB } from '../../helpers/initIndexedDB';

export const StepOne = () => {
  const navigate = useNavigate();
  const { stepOneData, setStepOneData } = useOpportunityContext();
  const [openDropdown, setOpenDropdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const storedData = localStorage.getItem('stepOneData');

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);

        setStepOneData(parsedData);
      } catch (error) {
        console.error('Error parsing stepOneData:', error);
      }
    }

    initIndexedDB();

    getImageFromIndexedDB('organizerPhotoFile').then(file => {
      if (file) {
        if (file instanceof File) {
          const fileUrl = URL.createObjectURL(file);

          setStepOneData(prev => ({
            ...prev,
            organizerPhotoFile: file,
            photoUrl: fileUrl,
          }));
        } else {
          console.error('Expected a File, but got a Blob');
        }
      }
    });
  }, []);

  useEffect(() => {
    if (stepOneData) {
      localStorage.setItem('stepOneData', JSON.stringify(stepOneData));
    }
  }, [stepOneData]);

  const options = ['Individual', 'Company'];
  const activeOption =
    options.find(option => option === stepOneData.organizerType) || options[0];

  const selectOption = (option: string) => {
    setOpenDropdown(false);
    setStepOneData(prev => ({ ...prev, organizerType: option }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setStepOneData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setStepOneData(prev => ({
      ...prev,
      organizerPhotoFile: file,
      photoUrl: URL.createObjectURL(file),
    }));

    saveImageToIndexedDB(file, 'organizerPhotoFile');
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveFile = () => {
    setStepOneData(prev => ({
      ...prev,
      organizerPhotoFile: null,
      photoUrl: '',
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    removeImageFromIndexedDB('organizerPhotoFile');
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    setStepOneData(prev => ({
      ...prev,
      organizerPhotoFile: null,
      photoUrl: '',
      organizerName: '',
      organizerEmail: '',
      link: '',
      organizerType: '',
      phone: '',
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    removeImageFromIndexedDB('organizerPhotoFile');
    navigate(Path.Opportunities);
  };

  const validateFields = () => {
    const newErrors: Record<string, string> = {};

    if (!stepOneData.organizerName.trim()) {
      newErrors.organizerName = 'Organizer name is required';
    }

    if (!stepOneData.organizerEmail.trim()) {
      newErrors.organizerEmail = 'Email is required';
    }

    if (!stepOneData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!stepOneData.organizerType.trim()) {
      newErrors.organizerType = 'Organizer type is required';
    }

    if (!stepOneData.organizerPhotoFile) {
      newErrors.organizerPhotoFile = 'Organizer photo is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();

    if (validateFields()) {
      navigate(Path.StepTwo);
    }
  };

  return (
    <div className={styles.one}>
      <div className={styles.one__nav}>
        <div className={styles['one__right-side']}>
          <div
            className={styles['one__bllock-top']}
            onClick={e => {
              e.preventDefault();
              navigate(Path.Opportunities);
            }}
          >
            <img src={arrow} alt="arrow" className={styles.one__img} />
            <p className={styles.one__back}>Go Back</p>
          </div>
          <div className={styles['one__bllock-bottom']}>
            <h1 className={styles.one__title}>New Opportunity</h1>
            <h3 className={styles.one__subtitle}>Step 1/3. Organizer</h3>
          </div>
        </div>
        <div className={styles['one__left-side']}>
          <div className={styles.one__form}>
            <p className={styles.one__content}>
              Tell us about yourself or your organization! Share basic details
              like your name or organization name, contact information, and your
              photo or the organization logo. This helps us verify your
              credibility and ensure transparency for participants.
            </p>
            <form>
              <div className={styles['one__dropdown-shell']}>
                <button
                  type="button"
                  className={styles.one__dropdown}
                  onClick={() => setOpenDropdown(!openDropdown)}
                >
                  <span
                    className={cn(styles.one__select, {
                      [styles['one__select--chosen']]:
                        stepOneData.organizerType,
                    })}
                  >
                    {stepOneData.organizerType || 'Organizer Type'}
                  </span>
                </button>
                <div
                  onClick={() => setOpenDropdown(!openDropdown)}
                  className={styles['one__dropdown-img-container']}
                >
                  <img
                    className={styles['one__dropdown-img']}
                    src={openDropdown ? arrow_up : arrow_down}
                    alt="Arrow Down"
                  />
                </div>
              </div>
              {openDropdown && (
                <ul className={styles['one__dropdown-list']}>
                  {options.map(option => (
                    <li
                      key={option}
                      onClick={() => selectOption(option)}
                      className={cn(styles['one__dropdown-item'], {
                        [styles['one__dropdown-item--active']]:
                          option === activeOption,
                      })}
                    >
                      <label className={styles['one__dropdown-label']}>
                        <input
                          type="checkbox"
                          checked={stepOneData.organizerType === option}
                          onChange={() => selectOption(option)}
                          className={styles['one__dropdown-checkbox']}
                        />
                        {option}
                      </label>
                    </li>
                  ))}
                </ul>
              )}
              <div className={styles.one__line}></div>
              {errors.organizerType && !stepOneData.organizerType && (
                <p className={styles.one__error}>
                  {errors.organizerType}
                </p>
              )}
              <p className={styles.one__remark}>*Required</p>
              <input
                className={styles.one__input}
                type="text"
                name="organizerName"
                placeholder="Your full name or organization name"
                value={stepOneData.organizerName}
                onChange={handleChange}
              />
              <div className={styles.one__line}></div>
              {errors.organizerName && !stepOneData.organizerName && (
                <p className={styles.one__error}>{errors.organizerName}</p>
              )}
              <p className={styles.one__remark}>*Required</p>
              <input
                className={styles.one__input}
                type="email"
                name="organizerEmail"
                placeholder="Email"
                value={stepOneData.organizerEmail}
                onChange={handleChange}
              />
              <div className={styles.one__line}></div>
              {errors.organizerEmail && !stepOneData.organizerEmail && (
                <p className={styles.one__error}>{errors.organizerEmail}</p>
              )}
              <p className={styles.one__remark}>*Required</p>
              <PhoneInput
                country={'ua'}
                value={stepOneData.phone}
                onChange={(value: string) =>
                  setStepOneData(prev => ({ ...prev, phone: value }))
                }
                inputProps={{
                  required: true,
                  className: styles['transparent-input'],
                }}
                buttonStyle={{
                  background: 'transparent',
                  border: 'none',
                }}
                containerStyle={{ background: 'transparent' }}
                dropdownStyle={{
                  background: 'black',
                  color: 'white',
                  zIndex: '100',
                  position: 'absolute',
                  bottom: '100%',
                  left: '0',
                }}
              />
              <div className={styles.one__line}></div>
              {errors.phone && !stepOneData.phone && (
                <p className={styles.one__error}>{errors.phone}</p>
              )}
              <p className={styles.one__remark}>*Required</p>
              <input
                className={styles.one__input}
                type="text"
                name="link"
                placeholder="Link to your website or official page"
                value={stepOneData.link}
                onChange={handleChange}
              />
              <div className={styles.one__line}></div>
              {stepOneData.photoUrl ? (
                <div className={styles['one__upload-shell']}>
                  <>
                    <div className={styles['one__uploaded-photo']}>
                      <img
                        src={stepOneData.photoUrl}
                        alt="Uploaded photo"
                        className={styles['one__uploaded-img']}
                      />
                    </div>
                    <button
                      type="button"
                      className={styles['one__button-upload']}
                      onClick={handleRemoveFile}
                    >
                      Remove file
                    </button>
                  </>
                </div>
              ) : (
                <div className={styles['one__input-shell']}>
                  <input
                    ref={fileInputRef}
                    className={styles['one__input-photo']}
                    type="file"
                    id="organizerPhotoFile"
                    accept=".jpg,.jpeg,.png,"
                    onChange={handleFileChange}
                    data-placeholder="Your photo or the organization's logo"
                    data-has-file={
                      stepOneData.organizerPhotoFile ? 'true' : 'false'
                    }
                    hidden
                  />
                  <label
                    htmlFor="organizerPhotoFile"
                    className={`${styles['custom-file-label']} ${!stepOneData.organizerPhotoFile ? styles['no-file-selected'] : ''}`}
                  >
                    {stepOneData.organizerPhotoFile
                      ? stepOneData.organizerPhotoFile.name
                      : "Your photo or the organization\'s logo"}
                  </label>
                  <div className={styles['one__line-upload']}></div>
                  {errors.organizerPhotoFile &&
                    !stepOneData.organizerPhotoFile && (
                      <p className={styles['one__error-upload']}>
                        {errors.organizerPhotoFile}
                      </p>
                    )}
                  <p className={styles['one__remark-upload']}>
                    *Required. Max image size - 2 MB.
                    File type - JPG, PNG, JPEG.
                  </p>
                  <button
                    type="button"
                    className={styles['one__button-upload']}
                    onClick={handleButtonClick}
                  >
                    Add file
                  </button>
                </div>
              )}
              <div className={styles['one__line-upload-desk']}></div>
              {errors.organizerPhotoFile &&
                !stepOneData.organizerPhotoFile && (
                  <p className={styles['one__error-desk']}>
                    {errors.organizerPhotoFile}
                  </p>
                )}
              <p className={styles['one__remark-desk']}>
                *Required. Max image size - 2 MB. File type - JPG, PNG, JPEG.
              </p>
              <div className={styles.one__buttons}>
                <button
                  className={styles['one__button-cancel']}
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  className={styles['one__button-continue']}
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
