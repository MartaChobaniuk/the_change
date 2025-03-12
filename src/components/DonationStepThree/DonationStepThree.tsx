/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import cn from 'classnames';
import styles from './DonationStepThree.module.scss';

type Props = {
  onBack: () => void;
  onClose: () => void;
};

export const DonationStepThree: React.FC<Props> = ({ onBack, onClose }) => {
  const { eventId } = useParams<{ eventId: string }>();
  const [cardNumber, setCardNumber] = useState('');
  const [cardType, setCardType] = useState(
    localStorage.getItem('paymentMethodId') || '',
  );
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const savedPaymentMethod = localStorage.getItem('paymentMethodId');

    if (savedPaymentMethod) {
      setCardType(savedPaymentMethod);
    }
  }, []);

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(.{4})/g, '$1 ')
      .trim();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);

    setCardNumber(formattedValue);
  };

  const validateFields = () => {
    const newErrors: Record<string, string> = {};

    if (!cardNumber) {
      newErrors.cardNumber = 'Card number is required';
    }

    if (cardNumber.length < 16) {
      newErrors.cardNumber_2 = 'Card number must be exactly 16 digits';
    }

    if (!cardNumber) {
      newErrors.cardNumber = 'Card number is required';
    }

    if (!expiryDate) {
      newErrors.expiryDate = 'Expiry card and CVV is required';
    }

    if (!cvv) {
      newErrors.cvv = 'CVV is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleDonateClick = async () => {
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);

    if (!validateFields()) {
      setIsSubmitting(false);

      return;
    }

    const donationData = {
      amount: localStorage.getItem('amount'),
      name: localStorage.getItem('name'),
      email: localStorage.getItem('email'),
      paymentMethodId: localStorage.getItem('paymentMethodId'),
    };

    try {
      const response = await fetch(
        `https://dewvdtfd5m.execute-api.eu-north-1.amazonaws.com/dev/events/${eventId}/donate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(donationData),
        },
      );

      if (response.ok) {
        setSubmitSuccess(true);
        localStorage.removeItem('name');
        localStorage.removeItem('email');
        localStorage.removeItem('amount');
        localStorage.removeItem('paymentMethodId');

        setTimeout(() => onClose(), 1500);
      } else {
        setSubmitError('Donation failed. Please try again.');
      }
    } catch (error) {
      setSubmitError('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('amount');
    localStorage.removeItem('paymentMethodId');

    onClose();
  };

  return (
    <div className={styles['donation-three']}>
      <p className={styles['donation-three__title']}>Enter your card details</p>
      <div className={styles['donation-three__content-bottom']}>
        <div className={styles['donation-three__buttons']}>
          <button
            type="button"
            className={cn(styles['donation-three__button'], {
              [styles['donation-three__button--active']]:
                cardType === 'pm_card_visa',
            })}
            onClick={e => {
              e.preventDefault();
              localStorage.setItem('paymentMethodId', 'pm_card_visa');
              setCardType('pm_card_visa');
            }}
          >
            Visa
          </button>
          <button
            type="button"
            className={cn(styles['donation-three__button'], {
              [styles['donation-three__button--active']]:
                cardType === 'pm_card_mastercard',
            })}
            onClick={e => {
              e.preventDefault();
              localStorage.setItem('paymentMethodId', 'pm_card_mastercard');
              setCardType('pm_card_mastercard');
            }}
          >
            Mastercard
          </button>
        </div>
        {errors.cardType && (
          <p className={styles['donation-three__error']}>{errors.cardType}</p>
        )}
        <div className={styles['donation-three__input-block']}>
          <input
            value={cardNumber}
            onChange={handleChange}
            className={styles['donation-three__input']}
            placeholder="Enter your card number"
          />
        </div>
        <div className={styles['donation-three__line']}></div>
        {errors.cardNumber && !cardNumber && (
          <p className={styles['donation-three__error']}>{errors.cardNumber}</p>
        )}
        {errors.cardNumber_2 && cardNumber.length < 16 && (
          <p className={styles['donation-three__error']}>
            {errors.cardNumber_2}
          </p>
        )}
        <div className={styles['donation-three__inputs-block']}>
          <input
            value={expiryDate}
            onChange={e => setExpiryDate(e.target.value)}
            className={styles['donation-three__input--part']}
            placeholder="MM / YY"
          />
          <input
            value={cvv}
            onChange={e => setCvv(e.target.value)}
            className={styles['donation-three__input--part']}
            placeholder="CVV"
          />
        </div>
        <div className={styles['donation-three__lines']}>
          <div className={styles['donation-three__line-small']}></div>
          <div className={styles['donation-three__line-small']}></div>
        </div>
        <div className={styles['donation-three__errors']}>
          {errors.expiryDate && !expiryDate && !cvv && (
            <div
              className={cn(styles['donation-three__error-block'], {
                [styles['donation-three__error-block--visible']]:
                  errors.expiryDate,
              })}
            >
              <p className={styles['donation-three__error-part']}>
                {errors.expiryDate}
              </p>
            </div>
          )}
          {errors.cvv && !cvv && expiryDate && (
            <div
              className={cn(styles['donation-three__error-block'], {
                [styles['donation-three__error-block--visible']]: errors.cvv,
              })}
            >
              <p className={styles['donation-three__error-part']}>
                {errors.cvv}
              </p>
            </div>
          )}
        </div>
        {submitSuccess && (
          <p className={styles.success}>Donation successful!</p>
        )}
        {submitError && (
          <p className={styles.error}>Donation failed. Please try again.</p>
        )}
        <div className={styles['donation-three__main-buttons']}>
          <button
            type="button"
            className={styles['donation-three__button-next']}
            onClick={handleDonateClick}
          >
            {isSubmitting ? 'Donation' : 'Donate'}
          </button>
          {submitSuccess ? (
            <button
              type="button"
              onClick={handleClose}
              className={styles['donation-three__button-back']}
            >
              Close
            </button>
          ) : (
            <button
              type="button"
              onClick={onBack}
              className={styles['donation-three__button-back']}
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
