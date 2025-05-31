/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StepThree.module.scss';
import arrow from '../../images/icons/arrow_back.svg';
import { Path } from '../../utils/constants';
import { useOpportunityContext } from '../../store/OpportunityContex';
import { saveImageToIndexedDB } from '../../helpers/saveImageToIndexedDB';
import { getImageFromIndexedDB } from '../../helpers/getImageFromIndexedDB';
import { saveDocToIndexedDB } from '../../helpers/saveDocToIndexedDB';
import { getDocFromIndexedDB } from '../../helpers/getDocFromIndexedDB';
import { removeImageFromIndexedDB } from '../../helpers/removeImageFromIndexed';

export const StepThree = () => {
  const navigate = useNavigate();
  const { stepThreeData, setStepThreeData, resetOpportunityData } =
    useOpportunityContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const docsInputRef = useRef<HTMLInputElement | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const storedData = localStorage.getItem('stepThreeData');

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);

        setStepThreeData(parsedData);
      } catch (error) {
        console.error('Error parsing stepThreeData:', error);
      }
    }

    getImageFromIndexedDB('coverImageFile').then(file => {
      if (file) {
        if (file instanceof File) {
          const fileUrl = URL.createObjectURL(file);

          setStepThreeData(prev => ({
            ...prev,
            coverImageFile: file,
            coverUrl: fileUrl,
          }));
        } else {
          console.error('Expected a File, but got a Blob');
        }
      }
    });

    stepThreeData.documentFile.forEach(doc => {
      getDocFromIndexedDB(doc.id).then(file => {
        if (file && file instanceof File) {
          setStepThreeData(prev => ({
            ...prev,
            documentFile: prev.documentFile.map(d =>
              d.id === doc.id ? { ...d, file } : d,
            ),
          }));
        }
      });
    });
  }, []);

  useEffect(() => {
    if (stepThreeData) {
      localStorage.setItem('stepThreeData', JSON.stringify(stepThreeData));
    }
  }, [stepThreeData]);

  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const cleanText = (text: string) =>
    text
      .replace(/â€™|â€˜|’|‘/g, "'")
      .replace(/â€œ|â€|“|”/g, '"')
      .replace(/â€“|–/g, '-')
      .replace(/â€/g, '')
      .trim();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setStepThreeData(prev => ({
      ...prev,
      [name]: cleanText(value),
    }));
  };

  const handleCoverImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (file && file instanceof File) {
      if (file.size > MAX_FILE_SIZE) {
        console.error('File is too large. Max size is 5MB.');

        return;
      }

      const fileUrl = URL.createObjectURL(file);

      setStepThreeData(prev => ({
        ...prev,
        coverImageFile: file,
        coverUrl: fileUrl,
      }));
      saveImageToIndexedDB(file, 'coverImageFile');
    } else {
      console.error('File not found or invalid file type');
    }
  };

  const handleAddDocument = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const newDoc = {
      id: crypto.randomUUID(),
      file: null,
    };

    setStepThreeData(prev => ({
      ...prev,
      documentFile: [...prev.documentFile, newDoc],
    }));
  };

  const handleRemoveDocument = (id: string) => {
    setStepThreeData(prev => ({
      ...prev,
      documentFile: prev.documentFile.filter(doc => doc.id !== id),
    }));

    const request = indexedDB.open('MyDatabase', 2);

    request.onsuccess = (event: Event) => {
      const db = (event.target as IDBOpenDBRequest)?.result;

      if (db) {
        const transaction = db.transaction('files', 'readwrite');
        const store = transaction.objectStore('files');

        store.delete(id);
      }
    };
  };

  const handleDocumentChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: string,
  ) => {
    const file = event.target.files?.[0];

    if (file && file instanceof File) {
      if (file.size > MAX_FILE_SIZE) {
        console.error('File is too large. Max size is 5MB.');

        return;
      }

      saveDocToIndexedDB(file, id);

      setStepThreeData(prev => ({
        ...prev,
        documentFile: prev.documentFile.map(doc =>
          doc.id === id ? { ...doc, file } : doc,
        ),
      }));
    } else {
      console.error('File not found or invalid file type');
    }
  };

  const handleRemoveFile = () => {
    setStepThreeData(prev => ({
      ...prev,
      coverImageFile: null,
      coverUrl: '',
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    removeImageFromIndexedDB('coverImageFile');
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleButtonDocsClick = () => {
    if (docsInputRef.current) {
      docsInputRef.current.click();
    }
  };

  const validateFields = () => {
    const newErrors: Record<string, string> = {};

    if (!stepThreeData.coverImageFile) {
      newErrors.coverImageFile = 'Cover photo is required';
    }

    if (!stepThreeData.description) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const clearFilesFromIndexedDB = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('MyDatabase', 2);

      request.onsuccess = event => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db) {
          reject('Database not found');

          return;
        }

        const transaction = db.transaction('files', 'readwrite');
        const store = transaction.objectStore('files');
        const clearRequest = store.clear();

        clearRequest.onsuccess = () => {
          console.log('IndexedDB store cleared successfully');
          resolve();
        };

        clearRequest.onerror = eventClear => {
          console.error('Error clearing IndexedDB store', eventClear);
          reject(eventClear);
        };
      };

      request.onerror = event =>
        reject(
          (event.target as IDBOpenDBRequest).error || 'Error opening IndexedDB',
        );
    });
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);

    if (!validateFields()) {
      setIsSubmitting(false);

      return;
    }

    const storedStepOneData = localStorage.getItem('stepOneData');
    const storedStepTwoData = localStorage.getItem('stepTwoData');
    const storedStepThreeData = localStorage.getItem('stepThreeData');

    if (!storedStepOneData || !storedStepTwoData || !storedStepThreeData) {
      setSubmitError('Data is missing in localStorage');
      setIsSubmitting(false);

      return;
    }

    const stepOneDataLS = JSON.parse(storedStepOneData);
    const stepTwoDataLS = JSON.parse(storedStepTwoData);
    const stepThreeDataLS = JSON.parse(storedStepThreeData);

    const formData = new FormData();
    const eventData = {
      organizerType: stepOneDataLS.organizerType,
      organizerName: stepOneDataLS.organizerName,
      organizerEmail: stepOneDataLS.organizerEmail,
      phone: stepOneDataLS.phone,
      link: stepOneDataLS.link,
      title: stepTwoDataLS.title,
      categoryId: stepTwoDataLS.categoryId,
      opportunityType: stepTwoDataLS.opportunityType,
      assistanceType: stepTwoDataLS.assistanceType,
      target: stepTwoDataLS.target,
      region: stepTwoDataLS.region,
      address: stepTwoDataLS.address,
      startingDate: stepTwoDataLS.startingDate,
      endingDate: stepTwoDataLS.endingDate,
      startHour: stepTwoDataLS.startHour,
      startMinute: stepTwoDataLS.startMinute,
      endHour: stepTwoDataLS.endHour,
      endMinute: stepTwoDataLS.endMinute,
      startPeriod: stepTwoDataLS.startPeriod,
      endPeriod: stepTwoDataLS.endPeriod,
      timeDemands: stepTwoDataLS.timeDemands,
      skills: stepTwoDataLS.skills,
      description: stepThreeDataLS.description,
      descriptionLink: stepThreeDataLS.descriptionLink,
    };

    formData.append('event', JSON.stringify(eventData));

    try {
      const organizerPhotoFile =
        await getImageFromIndexedDB('organizerPhotoFile');
      const coverImageFile = await getImageFromIndexedDB('coverImageFile');

      if (organizerPhotoFile) {
        formData.append('organizerPhotoFile', organizerPhotoFile);
      }

      if (coverImageFile) {
        formData.append('coverImageFile', coverImageFile);
      }

      for (const doc of stepThreeDataLS.documentFile) {
        const docFile = await getDocFromIndexedDB(doc.id);

        if (!docFile) {
          continue;
        }

        formData.append('documentFile', docFile);
      }

      const accessToken = localStorage.getItem('accessToken');

      const response = await fetch(
        // eslint-disable-next-line max-len
        'https://dewvdtfd5m.execute-api.eu-north-1.amazonaws.com/dev/createEvent',
        {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.ok) {
        setSubmitSuccess(true);
        setSuccessMessage('Your event has been successfully created');

        resetOpportunityData();

        localStorage.removeItem('stepOneData');
        localStorage.removeItem('stepTwoData');
        localStorage.removeItem('stepThreeData');

        await clearFilesFromIndexedDB();

        setTimeout(() => {
          navigate(Path.SuccessSubmit);
        }, 1000);
      } else {
        const errorJson = await response.json();

        setSubmitError(errorJson);
      }
    } catch (error) {
      setSubmitError('Error submitting the form');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.three}>
      <div className={styles.three__nav}>
        <div className={styles['three__right-side']}>
          <div
            className={styles['three__bllock-top']}
            onClick={() => navigate(Path.StepTwo)}
          >
            <img src={arrow} alt="arrow" className={styles.three__img} />
            <p className={styles.three__back}>Go Back</p>
          </div>
          <div className={styles['three__bllock-bottom']}>
            <h1 className={styles.three__title}>New Opportunity</h1>
            <h3 className={styles.three__subtitle}>
              Step 3/3. Upload Files & Documents
            </h3>
          </div>
        </div>
        <div className={styles['three__left-side']}>
          <div className={styles.three__form}>
            <p className={styles.three__content}>
              Upload a description (file or link to Google Docs), supporting
              documents (like permits or plans), and a cover image to attract
              attention. These extras help users understand the impact of your
              opportunity and how they can get involved.
            </p>
            <form onSubmit={handleSubmit}>
              {stepThreeData.coverUrl ? (
                <div className={styles['three__upload-shell']}>
                  <>
                    <div className={styles['three__uploaded-photo']}>
                      <img
                        src={stepThreeData.coverUrl}
                        alt="Uploaded photo"
                        className={styles['three__uploaded-img']}
                      />
                    </div>
                    <button
                      type="button"
                      className={styles['three__button-upload']}
                      onClick={handleRemoveFile}
                    >
                      Remove file
                    </button>
                  </>
                </div>
              ) : (
                <>
                  <div className={styles['three__input-shell']}>
                    <input
                      ref={fileInputRef}
                      className={styles['three__input-photo']}
                      type="file"
                      id="coverImageFile"
                      name="coverImageFile"
                      accept=".jpg,.png,.jpeg"
                      onChange={handleCoverImageChange}
                      placeholder="Upload cover for your wish"
                      data-placeholder="Upload cover for your wish"
                      data-has-file={
                        stepThreeData.coverImageFile ? 'true' : 'false'
                      }
                      hidden
                    />
                    <label
                      htmlFor="coverImageFile"
                      className={`
                    ${styles['custom-file-label']}
                    ${!stepThreeData.coverImageFile ? styles['no-file-selected'] : ''}`}
                    >
                      {stepThreeData.coverImageFile
                        ? stepThreeData.coverImageFile.name
                        : 'Upload cover for your wish'}
                    </label>
                    <div className={styles['three__line-upload']}></div>
                    {errors.coverImageFile && !stepThreeData.coverImageFile && (
                      <p className={styles['three__error-upload']}>
                        {errors.coverImageFile}
                      </p>
                    )}
                    <p className={styles['three__remark-upload']}>
                      *Required. Max image size - 2 MB. File type - JPG, PNG,
                      JPEG.
                    </p>
                    <button
                      type="button"
                      className={styles['three__button-upload']}
                      onClick={handleButtonClick}
                    >
                      Add file
                    </button>
                  </div>
                </>
              )}
              <div className={styles['three__line-upload-desk']}></div>
              {errors.coverImageFile && !stepThreeData.coverImageFile && (
                <p className={styles['three__error-desk']}>
                  {errors.coverImageFile}
                </p>
              )}
              <p className={styles['three__remark-desk']}>
                *Required. Max image size - 2 MB. File type - JPG, PNG, JPEG.
              </p>
              <input
                className={styles.three__input}
                type="text"
                name="description"
                placeholder="Write opportunity description"
                value={stepThreeData.description}
                onChange={handleInputChange}
              />
              <div className={styles.three__line}></div>
              {errors.description && !stepThreeData.description && (
                <p className={styles.three__error}>{errors.description}</p>
              )}
              <p className={styles.three__remark}>*Required</p>
              <input
                className={styles.three__input}
                type="text"
                name="descriptionLink"
                /* eslint-disable max-len */
                placeholder="Or provide a link to the Google Docs file with the opportunity information"
                value={stepThreeData.descriptionLink}
                onChange={handleInputChange}
              />
              <div className={styles.three__line}></div>
              <p className={styles.three__remark}>
                Link to the Google Docs with the description.
              </p>

              <div className={styles['three__docs-block']}>
                <p className={styles.three__pretitle}>
                  Upload all required documents that confirm your situation and
                  the needs:
                </p>
                <div className={styles.three__documents}>
                  {stepThreeData.documentFile.map(doc => (
                    <React.Fragment key={doc.id}>
                      <div className={styles['three__input-docs-shell']}>
                        <input
                          ref={docsInputRef}
                          className={styles['three__input-docs-photo']}
                          type="file"
                          id={`file-${doc.id}`}
                          name="documentFile"
                          accept=".pdf,.doc,.docx"
                          onChange={e => handleDocumentChange(e, doc.id)}
                          data-placeholder="Upload a document"
                          data-has-file={
                            stepThreeData.documentFile ? 'true' : 'false'
                          }
                          hidden
                        />
                        <label
                          htmlFor={`file-${doc.id}`}
                          className={`${styles['custom-file-label']} ${!doc.file ? styles['no-file-selected'] : ''}`}
                        >
                          {doc.file ? (
                            <p>{doc.file.name}</p>
                          ) : (
                            <p>Upload a document</p>
                          )}
                        </label>
                        <div className={styles['three__line-upload']}></div>
                        <p className={styles['three__remark-upload']}>
                          File type - DOC, DOCX, PDF.
                        </p>
                        <div className={styles['three__docs-button-shell']}>
                          <button
                            type="button"
                            className={styles['three__button-docs-upload']}
                            onClick={handleButtonDocsClick}
                          >
                            Add file
                          </button>
                          <button
                            type="button"
                            className={styles['three__button-docs-remove']}
                            onClick={() => handleRemoveDocument(doc.id)}
                          >
                            Remove file
                          </button>
                        </div>
                      </div>
                      <div className={styles['three__line-docs-desk']}></div>
                      <p className={styles['three__remark-desk']}>
                        File type - DOC, DOCX, PDF.
                      </p>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className={styles['three__block-add-button']}>
                <button
                  type="button"
                  className={styles['three__button-add-doc']}
                  onClick={handleAddDocument}
                >
                  Add new file
                </button>
              </div>
              {submitSuccess && <div>Форма успішно надіслана!</div>}
              {successMessage && <div>{successMessage}</div>}
              {submitError && <div style={{ color: 'red' }}>{submitError}</div>}
              <div className={styles.three__buttons}>
                <button
                  type="button"
                  className={styles['three__button-prev']}
                  onClick={e => {
                    e.preventDefault();
                    navigate(Path.StepTwo);
                  }}
                >
                  Previous Step
                </button>
                <button
                  type="submit"
                  className={styles['three__button-submit']}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submiting' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
